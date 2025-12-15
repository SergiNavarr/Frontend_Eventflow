"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Loader2, ArrowDown } from "lucide-react"; // Agregamos ArrowDown
import { useEventChat } from "@/hooks/useEventChat";
import { EventService } from "@/services/event.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/components/ChatBubble";

interface EventChatProps {
  eventId: number;
}

export const EventChat = ({ eventId }: EventChatProps) => {
  const { messages, sendMessage, isConnected, setInitialMessages } = useEventChat(eventId);
  
  const [newMessage, setNewMessage] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false); // Botón para bajar si hay mensajes nuevos

  // Referencias para el scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Cargar historial
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

  // 2. SCROLL INTELIGENTE
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Si es la primera carga (0 a N mensajes), bajamos siempre.
    if (prevMessagesLength.current === 0 && messages.length > 0) {
       scrollToBottom(false); // false = instantáneo
       prevMessagesLength.current = messages.length;
       return;
    }

    // Si no hubo cambios en la cantidad, no hacemos nada
    if (messages.length === prevMessagesLength.current) return;

    // Obtenemos el último mensaje
    const lastMessage = messages[messages.length - 1];
    
    // Calculamos si el usuario estaba cerca del fondo ANTES del nuevo mensaje
    // (Usamos un margen generoso de 250px)
    const { scrollHeight, scrollTop, clientHeight } = container;
    const scrollDistanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // IMPORTANTE: Estimamos la altura del nuevo mensaje (~100px) para ajustar el cálculo
    const wasNearBottom = scrollDistanceFromBottom < 250; 

    // LÓGICA REFINADA:
    // Bajamos si: (Yo lo envié) O (Estaba cerca del fondo)
    if (lastMessage?.isMine || wasNearBottom) {
      // Usamos un pequeño timeout para asegurar que el DOM pintó el mensaje nuevo
      setTimeout(() => scrollToBottom(), 100);
    } else {
      // Si estoy leyendo arriba y llega uno de otro, muestro el botón
      setShowScrollButton(true);
    }

    // Actualizamos la ref
    prevMessagesLength.current = messages.length;

  }, [messages]);

  // Efecto extra: Bajar siempre al terminar de cargar el historial inicial
  useEffect(() => {
    if (!loadingHistory) {
      scrollToBottom(false); // false = sin animación (instantáneo)
    }
  }, [loadingHistory]);

  // Función Helper para bajar
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    setShowScrollButton(false);
  };

  // Detectar scroll manual para ocultar el botón si el usuario baja solo
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const { scrollHeight, scrollTop, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (isAtBottom) setShowScrollButton(false);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !isConnected) return;
    await sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <Card className="flex h-[500px] flex-col border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
        {/* Chat Messages Area */}
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
            <p className="text-sm">¡Sé el primero en saludar!</p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg, index) => (
              <ChatBubble 
                key={msg.id || index} 
                message={msg} 
              />
            ))}
            {/* Elemento invisible para marcar el final */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Botón flotante para bajar si hay mensajes nuevos y estoy arriba */}
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
            placeholder={isConnected ? "Escribe un mensaje..." : "Conectando al chat..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected}
            className="flex-1 bg-background/60"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!isConnected || !newMessage.trim()}
            className={!isConnected ? "opacity-50" : ""}
          >
            {isConnected ? <Send className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </div>
    </Card>
  );
};