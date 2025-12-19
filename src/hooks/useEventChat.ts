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
 
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token || !eventId) return;

    // URL del Hub: http://localhost:XXXX/chatHub (quitamos el "/api")
    const hubUrl = API_URL.replace("/api", "") + "/chatHub"; 

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
      setIsConnected(false);
    };
  }, [eventId]); 

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("🟢 Conectado al ChatHub");
          setIsConnected(true);

          connection.invoke("JoinEventGroup", eventId.toString())
            .catch(err => console.error("Error uniéndose al grupo:", err));

          connection.on("ReceiveMessage", (msg: EventChatMessageDto) => {

            const isMe = userRef.current?.id === msg.senderId;
            const correctedMsg = { ...msg, isMine: isMe };

            setMessages((prev) => {
              if (prev.some(m => m.id === correctedMsg.id)) return prev;
              return [...prev, correctedMsg];
            });
          });
        })
        .catch((err) => console.error("🔴 Error conexión SignalR:", err));

      return () => {
        if (connection.state === "Connected") {
            connection.invoke("LeaveEventGroup", eventId.toString())
                .catch(err => console.error(err));
        }
        connection.off("ReceiveMessage");
      };
    }
  }, [connection, eventId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    try {
      await EventService.sendChatMessage(eventId, content);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  }, [eventId]); 

  const setInitialMessages = useCallback((history: EventChatMessageDto[]) => {
    setMessages(history);
  }, []); 

  return {
    messages,
    sendMessage,
    isConnected,
    setInitialMessages
  };
};