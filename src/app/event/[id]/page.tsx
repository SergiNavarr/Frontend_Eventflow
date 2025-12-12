"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Heart,
  MessageCircle,
  CheckSquare,
  BarChart3,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvatarStack } from '@/components/AvatarStack';
import { ChatBubble } from '@/components/ChatBubble';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/services/api';
import { Event, User, Comment, Task, Poll } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EventDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (id) {
      loadEventData(id);
    }
  }, [id]);

  const loadEventData = async (eventId: string) => {
    const [eventData, attendeesData, commentsData, tasksData, pollsData, usersData] =
      await Promise.all([
        api.getEventById(eventId),
        api.getUsersAttendingEvent(eventId),
        api.getCommentsByEventId(eventId),
        api.getTasksByEventId(eventId),
        api.getPollsByEventId(eventId),
        api.getUsers(),
      ]);

    if (eventData) setEvent(eventData);
    setAttendees(attendeesData);
    setComments(commentsData);
    setTasks(tasksData);
    setPolls(pollsData);
    setUsers(usersData);
  };

  const handleJoinEvent = () => {
    setIsJoined(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#EC4899'],
    });
    toast.success('You joined the event! 🎉');
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !id) return;
    
    const comment = await api.addComment(id, 'user-1', newComment);
    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment posted!');
  };

  const handleToggleTask = async (taskId: string) => {
    const updatedTask = await api.toggleTaskCompletion(taskId);
    if (updatedTask) {
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      toast.success(updatedTask.isCompleted ? 'Task completed!' : 'Task reopened');
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    const updatedPoll = await api.votePoll(pollId, optionId);
    if (updatedPoll) {
      setPolls(polls.map((p) => (p.id === pollId ? updatedPoll : p)));
      toast.success('Vote recorded!');
    }
  };

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Image */}
      <div className="relative h-64 w-full overflow-hidden md:h-96">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-20 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-20 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40"
        >
          <Share2 className="h-6 w-6 text-white" />
        </Button>
      </div>

      <div className="relative z-20 -mt-12 px-4 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Event Title & Info */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.date), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
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
                  <TabsContent value="info" className="mt-0 space-y-6">
                    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                      <h3 className="mb-4 text-lg font-semibold">About Event</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </Card>

                    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Attendees ({attendees.length})</h3>
                        <Button variant="link" className="text-primary">
                          View All
                        </Button>
                      </div>
                      <AvatarStack users={attendees} max={5} size="lg" />
                    </Card>

                    <Button
                      className={`w-full py-6 text-lg font-bold shadow-lg transition-all ${
                        isJoined
                          ? 'bg-secondary hover:bg-secondary/90'
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                      onClick={handleJoinEvent}
                      disabled={isJoined}
                    >
                      {isJoined ? (
                        <>
                          <CheckSquare className="mr-2 h-5 w-5" /> Going
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-5 w-5" /> Join Event
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="chat" className="mt-0">
                    <Card className="flex h-[500px] flex-col border-border/50 bg-card/50 backdrop-blur-sm">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {comments.map((comment) => {
                            const author = users.find((u) => u.id === comment.userId);
                            if (!author) return null;
                            return (
                              <ChatBubble
                                key={comment.id}
                                comment={comment}
                                user={author}
                                isCurrentUser={comment.userId === 'user-1'}
                              />
                            );
                          })}
                        </div>
                      </ScrollArea>
                      <div className="border-t border-border/50 p-4">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendComment();
                          }}
                          className="flex gap-2"
                        >
                          <Input
                            placeholder="Type a message..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-background/50"
                          />
                          <Button type="submit" size="icon">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-0">
                    <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Task List</h3>
                        <Badge variant="outline">
                          {tasks.filter((t) => t.isCompleted).length}/{tasks.length} Done
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/30 p-3 transition-colors hover:bg-background/50"
                          >
                            <Checkbox
                              checked={task.isCompleted}
                              onCheckedChange={() => handleToggleTask(task.id)}
                            />
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  task.isCompleted ? 'text-muted-foreground line-through' : ''
                                }`}
                              >
                                {task.text}
                              </p>
                              {task.assignedToUserId && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                  <span>Assigned to</span>
                                  <AvatarStack
                                    users={[users.find((u) => u.id === task.assignedToUserId)!].filter(Boolean)}
                                    size="sm"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="polls" className="mt-0">
                    <div className="space-y-6">
                      {polls.map((poll) => {
                        const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
                        return (
                          <Card
                            key={poll.id}
                            className="border-border/50 bg-card/50 p-6 backdrop-blur-sm"
                          >
                            <div className="mb-4 flex items-center gap-2">
                              <BarChart3 className="h-5 w-5 text-primary" />
                              <h3 className="text-lg font-semibold">{poll.question}</h3>
                            </div>
                            <div className="space-y-4">
                              {poll.options.map((option) => {
                                const percentage =
                                  totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                                return (
                                  <div key={option.id} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>{option.text}</span>
                                      <span className="text-muted-foreground">{percentage}%</span>
                                    </div>
                                    <div
                                      className="relative h-10 cursor-pointer overflow-hidden rounded-lg bg-background/50"
                                      onClick={() => handleVote(poll.id, option.id)}
                                    >
                                      <motion.div
                                        className="absolute inset-y-0 left-0 bg-primary/20"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5 }}
                                      />
                                      <div className="absolute inset-0 flex items-center px-4 hover:bg-white/5">
                                        <span className="text-sm font-medium">Vote</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-4 text-right text-xs text-muted-foreground">
                              {totalVotes} total votes
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
