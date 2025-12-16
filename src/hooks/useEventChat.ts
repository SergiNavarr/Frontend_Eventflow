import { useEffect, useState, useRef, useCallback } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "@/context/AuthContext";
import { EventChatMessageDto } from "@/types";
import { EventService } from "@/services/event.service";
import { API_URL } from "@/services/api"; 

export const useEventChat = (eventId: number) => {
  const { user } = useAuth(); // Solo usamos 'user' del contexto
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<EventChatMessageDto[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Referencia mutable para tener siempre el usuario actual dentro de los eventos de SignalR
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // 1. Configurar la Conexión
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || !eventId) return;

    // URL del Hub: http://localhost:XXXX/chatHub (quitamos el "/api")
    const hubUrl = API_URL.replace("/api", "") + "/chatHub"; 

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token, // SignalR usará este token
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);

    // Limpieza al desmontar
    return () => {
      newConnection.stop();
      setIsConnected(false);
    };
  }, [eventId]); 

  // 2. Manejar eventos del Hub (Join, Receive, Leave)
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("🟢 Conectado al ChatHub");
          setIsConnected(true);

          // A. UNIRSE AL GRUPO (Método de tu ChatHub.cs: JoinEventGroup)
          connection.invoke("JoinEventGroup", eventId.toString())
            .catch(err => console.error("Error uniéndose al grupo:", err));

          // B. ESCUCHAR MENSAJES (Tu ChatService envía "ReceiveMessage")
          connection.on("ReceiveMessage", (msg: EventChatMessageDto) => {
            
            // Tu backend envía "IsMine = false" por SignalR. 
            // Aquí lo recalculamos comparando IDs para pintar el globo correctamente.
            const isMe = userRef.current?.id === msg.senderId;
            const correctedMsg = { ...msg, isMine: isMe };

            setMessages((prev) => {
              // Evitar duplicados (por si la latencia hace cosas raras)
              if (prev.some(m => m.id === correctedMsg.id)) return prev;
              return [...prev, correctedMsg];
            });
          });
        })
        .catch((err) => console.error("🔴 Error conexión SignalR:", err));

      return () => {
        // Al salir del componente, avisamos al Hub
        if (connection.state === "Connected") {
            connection.invoke("LeaveEventGroup", eventId.toString())
                .catch(err => console.error(err));
        }
        connection.off("ReceiveMessage");
      };
    }
  }, [connection, eventId]);

  // 3. Enviar Mensaje (Usamos HTTP POST, no el Hub directo)
  // 2. Envuelve sendMessage en useCallback
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    try {
      await EventService.sendChatMessage(eventId, content);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  }, [eventId]); // Dependencia: eventId

  // 3. Envuelve setInitialMessages en useCallback
  const setInitialMessages = useCallback((history: EventChatMessageDto[]) => {
    setMessages(history);
  }, []); // Sin dependencias

  return {
    messages,
    sendMessage,
    isConnected,
    setInitialMessages
  };
};