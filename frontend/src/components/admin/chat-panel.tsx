'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Users, Clock, CheckCircle, XCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/lib/socket';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function AdminChatPanel() {
  const [message, setMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [filter, setFilter] = useState<'OPEN' | 'CLOSED' | 'PENDING' | undefined>('OPEN');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isConnected, 
    conversation, 
    messages, 
    conversations,
    unreadCount,
    isTyping,
    joinConversation, 
    sendMessage, 
    markAsRead,
    getConversations,
    closeConversation,
    setTyping,
  } = useSocket();
  
  const { user } = useAuthStore();

  // Cargar conversaciones al montar
  useEffect(() => {
    if (isConnected) {
      getConversations(filter);
    }
  }, [isConnected, filter, getConversations]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when selecting conversation
  useEffect(() => {
    if (selectedConversation && conversation) {
      markAsRead(selectedConversation);
    }
  }, [selectedConversation, conversation, markAsRead]);

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId);
    joinConversation(convId);
  };

  const handleSend = () => {
    if (message.trim() && conversation) {
      sendMessage(message.trim());
      setMessage('');
      setTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value.length > 0) {
      setTyping(true);
    }
  };

  const handleCloseConversation = () => {
    if (selectedConversation) {
      closeConversation(selectedConversation);
      setSelectedConversation(null);
    }
  };

  const statusColors = {
    OPEN: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="flex h-[600px]">
        {/* Sidebar - Lista de conversaciones */}
        <div className="w-80 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Mensajes
              </h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {unreadCount} nuevos
                </Badge>
              )}
            </div>
            {/* Filtros */}
            <div className="flex gap-1">
              {(['OPEN', 'PENDING', 'CLOSED'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setFilter(status)}
                >
                  {status === 'OPEN' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {status === 'PENDING' && <Clock className="h-3 w-3 mr-1" />}
                  {status === 'CLOSED' && <XCircle className="h-3 w-3 mr-1" />}
                  {status === 'OPEN' ? 'Abiertas' : status === 'PENDING' ? 'Pendientes' : 'Cerradas'}
                </Button>
              ))}
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No hay conversaciones</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const lastMessage = conv.messages?.[0];
                const unread = (conv as any)._count?.messages || 0;
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={cn(
                      "w-full p-4 text-left border-b hover:bg-muted/50 transition-colors",
                      selectedConversation === conv.id && "bg-primary/5 border-l-4 border-l-primary"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium truncate">
                        {conv.customer?.firstName} {conv.customer?.lastName}
                      </div>
                      <Badge className={cn("text-xs", statusColors[conv.status])}>
                        {conv.status === 'OPEN' ? 'Abierta' : conv.status === 'PENDING' ? 'Pendiente' : 'Cerrada'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate mb-1">
                      {conv.customer?.email}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(conv.updatedAt).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {unread}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Selecciona una conversación</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">
                    {conversation?.customer?.firstName} {conversation?.customer?.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {conversation?.customer?.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500" : "bg-red-500"
                  )} />
                  {conversation?.status === 'OPEN' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCloseConversation}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cerrar
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No hay mensajes aún</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isOwn = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2",
                              isOwn 
                                ? "bg-primary text-white rounded-br-sm" 
                                : "bg-white border shadow-sm rounded-bl-sm"
                            )}
                          >
                            {!isOwn && (
                              <p className="text-xs font-medium text-primary mb-1">
                                {msg.sender.firstName} (Cliente)
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className={cn(
                              "text-xs mt-1",
                              isOwn ? "text-white/70" : "text-muted-foreground"
                            )}>
                              {new Date(msg.createdAt).toLocaleTimeString('es-PE', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {isOwn && msg.isRead && ' ✓✓'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm rounded-2xl rounded-bl-sm px-4 py-2">
                          <p className="text-sm text-muted-foreground italic">
                            {isTyping.userName} está escribiendo...
                          </p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white">
                {conversation?.status === 'CLOSED' ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Esta conversación está cerrada
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu respuesta..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Enviar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
