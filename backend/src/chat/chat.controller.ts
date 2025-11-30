import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ConversationStatus, UserRole } from '@prisma/client';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  // Cliente: Obtener o crear conversación
  @Post('conversation')
  async getOrCreateConversation(@Req() req: any, @Body() body: { subject?: string }) {
    return this.chatService.getOrCreateConversation(req.user.id, body.subject);
  }

  // Obtener conversación por ID
  @Get('conversation/:id')
  async getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  // Cliente: Obtener mis conversaciones
  @Get('my-conversations')
  async getMyConversations(@Req() req: any) {
    return this.chatService.getCustomerConversations(req.user.id);
  }

  // Admin: Obtener todas las conversaciones
  @Get('conversations')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.EDITOR)
  async getAllConversations(@Query('status') status?: ConversationStatus) {
    return this.chatService.getAllConversations(status);
  }

  // Enviar mensaje (REST fallback)
  @Post('conversation/:id/message')
  async sendMessage(
    @Param('id') conversationId: string,
    @Req() req: any,
    @Body() body: { content: string },
  ) {
    return this.chatService.createMessage(conversationId, req.user.id, body.content);
  }

  // Marcar mensajes como leídos
  @Post('conversation/:id/read')
  async markAsRead(@Param('id') conversationId: string, @Req() req: any) {
    return this.chatService.markMessagesAsRead(conversationId, req.user.id);
  }

  // Admin: Asignar conversación
  @Post('conversation/:id/assign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.EDITOR)
  async assignConversation(@Param('id') conversationId: string, @Req() req: any) {
    return this.chatService.assignAdmin(conversationId, req.user.id);
  }

  // Admin: Cerrar conversación
  @Post('conversation/:id/close')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.EDITOR)
  async closeConversation(@Param('id') conversationId: string) {
    return this.chatService.closeConversation(conversationId);
  }

  // Obtener conteo de mensajes no leídos
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    if (req.user.role === 'CUSTOMER') {
      return { count: await this.chatService.getUnreadCountForCustomer(req.user.id) };
    }
    return { count: await this.chatService.getUnreadCountForAdmin() };
  }
}
