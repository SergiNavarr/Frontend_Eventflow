"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import { EventService } from "@/services/event.service";
import { EventDto, UserProfileDto } from "@/types";

import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EventHeader } from "@/components/EventHeader";
import { EventInfo } from "@/components/EventInfo";
import { EventChat } from "@/components/EventChat";
import { EventPolls } from "@/components/EventPolls";
import { EventTasks } from "@/components/EventTasks";

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [event, setEvent] = useState<EventDto | null>(null);
  const [attendees, setAttendees] = useState<UserProfileDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (id) loadEventData();
  }, [id]);

  const loadEventData = async () => {
    if (!id) return;
    try {
      const [eventData, attendeesData] = await Promise.all([
        EventService.getById(id),
        EventService.getAttendees(id),
      ]);
      setEvent(eventData);
      setAttendees(attendeesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) return <div className="p-8 text-center">Evento no encontrado</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Sidebar />

      <main className="md:ml-72">
        <EventHeader event={event} />

        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="tasks">Tareas</TabsTrigger>
              <TabsTrigger value="polls">Encuestas</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="info" className="mt-0">
                    <EventInfo
                      event={event}
                      attendees={attendees}
                      onJoinChange={loadEventData}
                    />
                  </TabsContent>

                  <TabsContent value="chat" className="mt-0">
                    <EventChat
                      eventId={event.id}
                      isParticipant={Boolean(event.myRsvpStatus)}
                    />
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-0">
                    <EventTasks isParticipant={Boolean(event.myRsvpStatus)}/>
                  </TabsContent>

                  <TabsContent value="polls" className="mt-0">
                    <EventPolls isParticipant={Boolean(event.myRsvpStatus)}/>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}