import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationStatus } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Crear o obtener conversación existente
  async getOrCreateConversation(customerId: string, subject?: string) {
    // Buscar conversación abierta existente
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        customerId,
        status: { in: ['OPEN', 'PENDING'] },
      },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        admin: {
          select: { id: true, firstName: true, lastName: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          customerId,
          subject: subject || 'Consulta general',
          status: 'OPEN',
        },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          admin: {
            select: { id: true, firstName: true, lastName: true },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
              sender: {
                select: { id: true, firstName: true, lastName: true, role: true },
              },
            },
          },
        },
      });
    }

    return conversation;
  }

  // Crear mensaje
  async createMessage(conversationId: string, senderId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });

    // Actualizar la conversación
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  // Obtener conversación por ID
  async getConversation(conversationId: string) {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        admin: {
          select: { id: true, firstName: true, lastName: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
      },
    });
  }

  // Obtener conversaciones del cliente
  async getCustomerConversations(customerId: string) {
    return this.prisma.conversation.findMany({
      where: { customerId },
      orderBy: { updatedAt: 'desc' },
      include: {
        admin: {
          select: { id: true, firstName: true, lastName: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: { isRead: false },
            },
          },
        },
      },
    });
  }

  // Obtener todas las conversaciones (admin)
  async getAllConversations(status?: ConversationStatus) {
    return this.prisma.conversation.findMany({
      where: status ? { status } : {},
      orderBy: { updatedAt: 'desc' },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        admin: {
          select: { id: true, firstName: true, lastName: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: { isRead: false },
            },
          },
        },
      },
    });
  }

  // Asignar admin a conversación
  async assignAdmin(conversationId: string, adminId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { adminId },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        admin: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  // Cerrar conversación
  async closeConversation(conversationId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status: 'CLOSED' },
    });
  }

  // Marcar mensajes como leídos
  async markMessagesAsRead(conversationId: string, userId: string) {
    // Marcar como leídos los mensajes que NO fueron enviados por el usuario actual
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  }

  // Contar mensajes no leídos (para admin)
  async getUnreadCountForAdmin() {
    return this.prisma.message.count({
      where: {
        isRead: false,
        conversation: {
          status: { in: ['OPEN', 'PENDING'] },
        },
        sender: {
          role: 'CUSTOMER',
        },
      },
    });
  }

  // Contar mensajes no leídos para cliente
  async getUnreadCountForCustomer(customerId: string) {
    return this.prisma.message.count({
      where: {
        isRead: false,
        conversation: {
          customerId,
          status: { in: ['OPEN', 'PENDING'] },
        },
        sender: {
          role: { not: 'CUSTOMER' },
        },
      },
    });
  }
}
