"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Loader2, ArrowDown, Lock } from "lucide-react"; 
import { useEventChat } from "@/hooks/useEventChat";
import { EventService } from "@/services/event.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/components/ChatBubble";

interface EventChatProps {
  eventId: number;
  isParticipant: boolean;
}

export const EventChat = ({ eventId, isParticipant }: EventChatProps) => {
  const { messages, sendMessage, isConnected, setInitialMessages } = useEventChat(eventId);
  
  const [newMessage, setNewMessage] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Referencias para el scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await EventService.getChatHistory(eventId);
        setInitialMessages(history);
      } catch (error) {
        console.error("Error cargando historial", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    if (eventId) loadHistory();
  }, [eventId, setInitialMessages]);

  // Referencia para saber cuántos mensajes teníamos antes
  const prevMessagesLength = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (prevMessagesLength.current === 0 && messages.length > 0) {
       scrollToBottom(false);
       prevMessagesLength.current = messages.length;
       return;
    }

    if (messages.length === prevMessagesLength.current) return;

    const lastMessage = messages[messages.length - 1];
    
    const { scrollHeight, scrollTop, clientHeight } = container;
    const scrollDistanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const wasNearBottom = scrollDistanceFromBottom < 250; 

    if (lastMessage?.isMine || wasNearBottom) {
      setTimeout(() => scrollToBottom(), 100);
    } else {
      setShowScrollButton(true);
    }

    prevMessagesLength.current = messages.length;

  }, [messages]);

  useEffect(() => {
    if (!loadingHistory) {
      scrollToBottom(false);
    }
  }, [loadingHistory]);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const { scrollHeight, scrollTop, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (isAtBottom) setShowScrollButton(false);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // Bloqueamos envío si no es participante
    if (!newMessage.trim() || !isConnected || !isParticipant) return;
    await sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <Card className="flex h-[500px] flex-col border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
      
      {/* Área de Mensajes */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent"
      >
        {loadingHistory ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50">
            <p>No hay mensajes aún.</p>
            {isParticipant && <p className="text-sm">¡Sé el primero en saludar!</p>}
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg, index) => (
              <ChatBubble 
                key={msg.id || index} 
                message={msg} 
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {showScrollButton && (
        <Button
          size="icon"
          className="absolute bottom-20 right-6 rounded-full shadow-lg z-10 h-8 w-8 animate-bounce"
          onClick={() => scrollToBottom()}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}

      {/* Input Area */}
      <div className="border-t border-border/50 p-3 bg-background/40">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            placeholder={
                !isParticipant 
                    ? "Debes unirte al evento para chatear" 
                    : isConnected 
                        ? "Escribe un mensaje..." 
                        : "Conectando al chat..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected || !isParticipant}
            className="flex-1 bg-background/60"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!isConnected || !newMessage.trim() || !isParticipant}
            className={!isConnected || !isParticipant ? "opacity-50" : ""}
          >
            {!isParticipant ? (
                 <Lock className="h-4 w-4" /> 
            ) : isConnected ? (
                 <Send className="h-4 w-4" /> 
            ) : (
                 <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};