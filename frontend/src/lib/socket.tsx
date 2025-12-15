'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface Conversation {
  id: string;
  customerId: string;
  adminId?: string;
  subject?: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  admin?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  messages: Message[];
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  conversation: Conversation | null;
  messages: Message[];
  unreadCount: number;
  conversations: Conversation[];
  isTyping: { userId: string; userName: string } | null;
  startConversation: (subject?: string) => void;
  sendMessage: (content: string) => void;
  joinConversation: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversations: (status?: 'OPEN' | 'CLOSED' | 'PENDING') => void;
  closeConversation: (conversationId: string) => void;
  setTyping: (isTyping: boolean) => void;
  playNotificationSound: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

// Audio para notificaciones
let notificationAudio: HTMLAudioElement | null = null;

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTypingState] = useState<{ userId: string; userName: string } | null>(null);
  
  const { isAuthenticated, user } = useAuthStore();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Función para reproducir sonido de notificación
  const playNotificationSound = useCallback(() => {
    try {
      if (!notificationAudio) {
        // Crear audio con sonido de notificación
        notificationAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleicFQp7g3q1VDAcimN7er1MMAg+U2OCtUgcDCIzS4KxQBwIDipDX3qtRCgIBjJTb4KxSCwEAkJne4K1VCQEC');
      }
      notificationAudio.currentTime = 0;
      notificationAudio.volume = 0.5;
      notificationAudio.play().catch(() => {});
    } catch (e) {
      console.log('Could not play notification sound');
    }
  }, []);

  useEffect(() => {
    console.log('Socket useEffect - isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Try sessionStorage first, then cookies
    let token = null;
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('accessToken');
    }
    if (!token) {
      token = Cookies.get('accessToken');
    }
    
    console.log('Socket token available:', !!token);
    
    if (!token) {
      console.log('No token found, cannot connect socket');
      return;
    }

    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat`, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    console.log('Socket created, attempting to connect to:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/chat`);

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected, reason:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    newSocket.on('unreadCount', (data: { count: number }) => {
      setUnreadCount(data.count);
    });

    newSocket.on('conversationStarted', (conv: Conversation) => {
      console.log('conversationStarted event received:', conv);
      setConversation(conv);
      setMessages(conv.messages?.reverse() || []);
    });

    newSocket.on('conversationJoined', (conv: Conversation) => {
      console.log('conversationJoined event received:', conv);
      setConversation(conv);
      setMessages(conv.messages || []);
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => {
        // Avoid duplicates by checking if message already exists
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      // Reproducir sonido si el mensaje no es del usuario actual
      if (message.senderId !== user?.id) {
        playNotificationSound();
      }
    });

    newSocket.on('messageNotification', (data: { message: Message; conversation: Conversation; type: string }) => {
      playNotificationSound();
      setUnreadCount(prev => prev + 1);
      
      const senderName = data.message.sender.firstName || 'Alguien';
      if (data.type === 'admin') {
        toast.success(`💬 Nuevo mensaje de ${senderName}`, {
          duration: 5000,
        });
      } else {
        toast.success(`💬 Nuevo mensaje de cliente: ${senderName}`, {
          duration: 5000,
        });
      }
    });

    newSocket.on('conversationsList', (convs: Conversation[]) => {
      setConversations(convs);
    });

    newSocket.on('newConversation', (data: { conversation: Conversation }) => {
      playNotificationSound();
      setConversations(prev => {
        // Avoid duplicates
        if (prev.some(c => c.id === data.conversation.id)) {
          return prev;
        }
        return [data.conversation, ...prev];
      });
      toast.success('📩 Nueva conversación de cliente', {
        duration: 5000,
      });
    });

    newSocket.on('adminJoined', (data: { adminName: string; conversationId: string }) => {
      toast.success(`👤 ${data.adminName} se ha unido a la conversación`);
    });

    newSocket.on('messagesRead', (data: { conversationId: string; readBy: string }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.conversationId === data.conversationId && msg.senderId !== data.readBy
            ? { ...msg, isRead: true }
            : msg
        )
      );
    });

    newSocket.on('conversationClosed', (data: { conversationId: string }) => {
      if (conversation?.id === data.conversationId) {
        setConversation(prev => prev ? { ...prev, status: 'CLOSED' } : null);
      }
      toast.success('Conversación cerrada');
    });

    newSocket.on('userTyping', (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setIsTypingState({ userId: data.userId, userName: data.userName });
      } else {
        setIsTypingState(null);
      }
    });

    // Notificaciones de pedidos
    newSocket.on('orderReady', (data: { orderNumber: string; message: string }) => {
      playNotificationSound();
      toast.success(data.message, {
        duration: 10000,
        icon: '🎉',
      });
    });

    newSocket.on('orderStatusUpdate', (data: { orderNumber: string; status: string; message: string }) => {
      playNotificationSound();
      toast.success(data.message, {
        duration: 8000,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.id, playNotificationSound]);

  const startConversation = useCallback((subject?: string) => {
    console.log('startConversation called - socket:', !!socket, 'isConnected:', isConnected);
    if (socket && isConnected) {
      console.log('Emitting startConversation event');
      socket.emit('startConversation', { subject });
    } else {
      console.log('Cannot start conversation - socket not ready');
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((content: string) => {
    if (socket && isConnected && conversation) {
      socket.emit('sendMessage', { conversationId: conversation.id, content });
    }
  }, [socket, isConnected, conversation]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('joinConversation', { conversationId });
    }
  }, [socket, isConnected]);

  const markAsRead = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('markAsRead', { conversationId });
    }
  }, [socket, isConnected]);

  const getConversations = useCallback((status?: 'OPEN' | 'CLOSED' | 'PENDING') => {
    if (socket && isConnected) {
      socket.emit('getConversations', { status });
    }
  }, [socket, isConnected]);

  const closeConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('closeConversation', { conversationId });
    }
  }, [socket, isConnected]);

  const setTyping = useCallback((typing: boolean) => {
    if (socket && isConnected && conversation) {
      // Limpiar timeout anterior
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socket.emit('typing', { conversationId: conversation.id, isTyping: typing });

      // Auto-apagar typing después de 3 segundos
      if (typing) {
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit('typing', { conversationId: conversation.id, isTyping: false });
        }, 3000);
      }
    }
  }, [socket, isConnected, conversation]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      conversation,
      messages,
      unreadCount,
      conversations,
      isTyping,
      startConversation,
      sendMessage,
      joinConversation,
      markAsRead,
      getConversations,
      closeConversation,
      setTyping,
      playNotificationSound,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
