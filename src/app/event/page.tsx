"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, MapPin } from "lucide-react";

import { EventService } from "@/services/event.service";
import { EventDto } from "@/types";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CreateEventDialog } from "@/components/CreateEventDialog";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el mes que estamos viendo
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const data = await EventService.getMyCalendarEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos del Calendario
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Funciones de navegación
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Función para obtener eventos de un día específico
  const getEventsForDay = (day: Date) => {
    return events.filter(e => isSameDay(new Date(e.startDateTime), day));
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-72 pb-24 md:pb-8">
        
        {/* Header con Controles de Mes */}
        <div className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <CalendarIcon className="h-8 w-8 text-primary" />
                Mi Agenda
              </h1>
              <p className="text-sm text-muted-foreground">
                Tus eventos confirmados y actividades de tus comunidades.
              </p>
              <CreateEventDialog />
            </div>

            <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-lg border border-border/50">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-lg font-semibold min-w-[140px] text-center capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </span>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Referencias visuales */}
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary"></span>
              <span>Asistiré (Confirmado)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-secondary border border-border"></span>
              <span>Comunidad (Sugerido)</span>
            </div>
          </div>
        </div>

        {/* Grilla del Calendario */}
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {daysInMonth.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isTodayDate = isToday(day);

                  return (
                    <Card 
                      key={day.toISOString()} 
                      className={`min-h-[150px] p-3 flex flex-col gap-2 border-border/40 transition-colors ${
                        isTodayDate ? 'bg-primary/5 border-primary/30' : 'bg-card/40'
                      }`}
                    >
                      {/* Cabecera del Día */}
                      <div className="flex justify-between items-center border-b border-border/30 pb-2 mb-1">
                        <span className={`text-sm font-medium capitalize ${
                          isTodayDate ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {format(day, 'EEEE', { locale: es })}
                        </span>
                        <span className={`h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold ${
                          isTodayDate ? 'bg-primary text-primary-foreground' : ''
                        }`}>
                          {format(day, 'd')}
                        </span>
                      </div>

                      {/* Lista de Eventos del Día */}
                      <div className="flex-1 space-y-2">
                        {dayEvents.length > 0 ? (
                          dayEvents.map(evt => {
                            // DISTINCIÓN VISUAL
                            const isAttending = !!evt.myRsvpStatus; 

                            return (
                              <Link key={evt.id} href={`/event/${evt.id}`}>
                                <div className={`text-xs p-2 rounded-md border transition-all hover:scale-[1.02] cursor-pointer ${
                                  isAttending 
                                    ? 'bg-primary/15 border-primary/20 hover:bg-primary/20' 
                                    : 'bg-secondary/50 border-border hover:bg-secondary'
                                }`}>
                                  <div className="font-semibold line-clamp-1">
                                    {evt.title}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                                    <span className="capitalize">
                                      {format(new Date(evt.startDateTime), 'HH:mm')}
                                    </span>
                                    {isAttending && (
                                      <Badge variant="default" className="h-4 px-1 py-0 text-[9px] ml-auto">
                                        Voy
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-[10px] text-muted-foreground/30 italic">
                            Sin eventos
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
        <BottomNav />
      </main>
    </div>
  );
}