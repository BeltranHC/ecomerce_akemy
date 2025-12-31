import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userName?: string;
}

@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      // Permitir requests sin origin
      if (!origin) {
        return callback(null, true);
      }

      // Permitir akemy.app y sus subdominios
      if (origin.includes('akemy.app')) {
        return callback(null, true);
      }

      // Permitir vercel.app
      if (origin.includes('vercel.app')) {
        return callback(null, true);
      }

      // Permitir localhost
      if (origin.includes('localhost')) {
        return callback(null, true);
      }

      callback(null, true); // Permitir todos por ahora para desarrollo
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
  namespace: '/chat',
  transports: ['polling', 'websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) { }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} attempted connection without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;
      client.userRole = payload.role;
      client.userName = payload.firstName || 'Usuario';

      this.connectedUsers.set(payload.sub, client.id);

      // Unir al usuario a su room personal
      client.join(`user:${payload.sub}`);

      // Si es admin, unir al room de admins
      if (payload.role !== 'CUSTOMER') {
        client.join('admins');
      }

      this.logger.log(`User ${payload.sub} (${payload.role}) connected`);

      // Enviar conteo de mensajes no leídos al conectar
      if (payload.role === 'CUSTOMER') {
        const unreadCount = await this.chatService.getUnreadCountForCustomer(payload.sub);
        client.emit('unreadCount', { count: unreadCount });
      } else {
        const unreadCount = await this.chatService.getUnreadCountForAdmin();
        client.emit('unreadCount', { count: unreadCount });
      }
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  // Cliente inicia o continúa conversación
  @SubscribeMessage('startConversation')
  async handleStartConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { subject?: string },
  ) {
    this.logger.log(`startConversation received from user ${client.userId}`);

    if (!client.userId) {
      this.logger.warn('startConversation: No userId on client');
      return;
    }

    const conversation = await this.chatService.getOrCreateConversation(
      client.userId,
      data.subject,
    );

    this.logger.log(`Conversation ${conversation.id} created/found for user ${client.userId}`);

    // Unir al cliente a la room de conversación
    client.join(`conversation:${conversation.id}`);

    // Emitir conversación al cliente
    this.logger.log(`Emitting conversationStarted to client ${client.id}`);
    client.emit('conversationStarted', conversation);

    // Notificar a admins de nueva conversación
    this.server.to('admins').emit('newConversation', {
      conversation,
      customer: conversation.customer,
    });

    return conversation;
  }

  // Enviar mensaje
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    if (!client.userId) return;

    const message = await this.chatService.createMessage(
      data.conversationId,
      client.userId,
      data.content,
    );

    // Emitir mensaje a todos en la conversación
    this.server.to(`conversation:${data.conversationId}`).emit('newMessage', message);

    // Obtener conversación para saber a quién notificar
    const conversation = await this.chatService.getConversation(data.conversationId);

    if (conversation) {
      // Si el mensaje es del cliente, notificar a admins
      if (client.userRole === 'CUSTOMER') {
        this.server.to('admins').emit('messageNotification', {
          message,
          conversation,
          type: 'customer',
        });
      } else {
        // Si es del admin, notificar al cliente
        this.server.to(`user:${conversation.customerId}`).emit('messageNotification', {
          message,
          conversation,
          type: 'admin',
        });
      }
    }

    return message;
  }

  // Admin se une a conversación
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId || client.userRole === 'CUSTOMER') return;

    client.join(`conversation:${data.conversationId}`);

    const conversation = await this.chatService.getConversation(data.conversationId);

    // Asignar admin si no está asignado
    if (conversation && !conversation.adminId) {
      await this.chatService.assignAdmin(data.conversationId, client.userId);

      // Notificar al cliente que un admin se unió
      this.server.to(`user:${conversation.customerId}`).emit('adminJoined', {
        adminName: client.userName,
        conversationId: data.conversationId,
      });
    }

    client.emit('conversationJoined', conversation);

    return conversation;
  }

  // Marcar mensajes como leídos
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) return;

    await this.chatService.markMessagesAsRead(data.conversationId, client.userId);

    // Notificar actualización de lectura
    this.server.to(`conversation:${data.conversationId}`).emit('messagesRead', {
      conversationId: data.conversationId,
      readBy: client.userId,
    });

    return { success: true };
  }

  // Obtener conversaciones (para admin)
  @SubscribeMessage('getConversations')
  async handleGetConversations(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { status?: 'OPEN' | 'CLOSED' | 'PENDING' },
  ) {
    if (!client.userId || client.userRole === 'CUSTOMER') return;

    const conversations = await this.chatService.getAllConversations(data.status);
    client.emit('conversationsList', conversations);

    return conversations;
  }

  // Cerrar conversación
  @SubscribeMessage('closeConversation')
  async handleCloseConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId || client.userRole === 'CUSTOMER') return;

    await this.chatService.closeConversation(data.conversationId);

    this.server.to(`conversation:${data.conversationId}`).emit('conversationClosed', {
      conversationId: data.conversationId,
    });

    return { success: true };
  }

  // Escribiendo...
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    if (!client.userId) return;

    client.to(`conversation:${data.conversationId}`).emit('userTyping', {
      userId: client.userId,
      userName: client.userName,
      isTyping: data.isTyping,
    });
  }

  // Método para enviar notificación de pedido listo (llamado desde orders service)
  async sendOrderReadyNotification(userId: string, orderNumber: string) {
    this.server.to(`user:${userId}`).emit('orderReady', {
      orderNumber,
      message: `¡Tu pedido #${orderNumber} está listo para recoger!`,
    });
  }

  // Método para enviar notificación de cambio de estado
  async sendOrderStatusNotification(userId: string, orderNumber: string, status: string, message: string) {
    this.server.to(`user:${userId}`).emit('orderStatusUpdate', {
      orderNumber,
      status,
      message,
    });
  }
}
