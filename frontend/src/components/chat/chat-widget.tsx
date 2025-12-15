'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/lib/socket';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef(0);
  
  const { 
    isConnected, 
    conversation, 
    messages, 
    unreadCount,
    isTyping,
    startConversation, 
    sendMessage, 
    markAsRead,
    setTyping,
  } = useSocket();
  
  const { isAuthenticated, user } = useAuthStore();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when opening chat
  useEffect(() => {
    if (isOpen && conversation && !isMinimized) {
      markAsRead(conversation.id);
    }
  }, [isOpen, conversation, isMinimized, markAsRead]);

  // Start conversation when socket connects and chat is open
  useEffect(() => {
    console.log('Chat useEffect - isOpen:', isOpen, 'isConnected:', isConnected, 'conversation:', !!conversation);
    if (isOpen && isConnected && !conversation) {
      console.log('Calling startConversation from useEffect');
      startConversation();
    }
  }, [isOpen, isConnected, conversation, startConversation]);

  // Reset connection error when socket connects
  useEffect(() => {
    if (isConnected) {
      setConnectionError(false);
      retryCountRef.current = 0;
    }
  }, [isConnected]);

  const handleRetry = () => {
    retryCountRef.current += 1;
    if (isConnected && !conversation) {
      console.log('Retry: calling startConversation');
      startConversation();
    }
  };

  const handleOpen = () => {
    console.log('handleOpen called - isConnected:', isConnected, 'conversation:', !!conversation);
    setIsOpen(true);
    setIsMinimized(false);
    // The useEffect will handle starting the conversation
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

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300",
            isMinimized ? "w-72 h-14" : "w-96 h-[500px] max-h-[80vh]"
          )}
        >
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-400" : "bg-red-400"
              )} />
              <span className="font-medium">
                {conversation?.admin 
                  ? `Chat con ${conversation.admin.firstName}` 
                  : 'Soporte AKEMY'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 h-[380px] overflow-y-auto p-4 space-y-3 bg-gray-50">
                {connectionError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto text-red-400 mb-3" />
                      <p className="text-muted-foreground mb-3">No se pudo conectar al chat</p>
                      <Button onClick={handleRetry} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reintentar
                      </Button>
                    </div>
                  </div>
                ) : !conversation ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {!isConnected ? 'Conectando al servidor...' : 'Iniciando chat...'}
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">¡Hola! ¿En qué podemos ayudarte?</p>
                      <p className="text-sm text-muted-foreground mt-1">Escribe tu mensaje para iniciar la conversación</p>
                    </div>
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
                              "max-w-[80%] rounded-2xl px-4 py-2",
                              isOwn 
                                ? "bg-primary text-white rounded-br-sm" 
                                : "bg-white border shadow-sm rounded-bl-sm"
                            )}
                          >
                            {!isOwn && (
                              <p className="text-xs font-medium text-primary mb-1">
                                {msg.sender.firstName}
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
                          <p className="text-sm text-muted-foreground">
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
              <div className="p-3 border-t bg-white">
                {conversation?.status === 'CLOSED' ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Esta conversación ha sido cerrada
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 rounded-full"
                      disabled={!conversation}
                    />
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="rounded-full"
                      disabled={!message.trim() || !conversation}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
