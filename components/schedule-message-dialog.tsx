"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduledMessage } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

interface ScheduleMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onScheduleMessage: (message: Omit<ScheduledMessage, 'id' | 'createdAt'>) => void;
}

const scheduleSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  quickOption: z.string().optional(),
}).refine(data => {
  if (data.quickOption) return true;
  
  const scheduledDateTime = new Date(`${data.date}T${data.time}`);
  const now = new Date();
  
  return scheduledDateTime > now;
}, {
  message: "Scheduled time must be in the future",
  path: ["time"],
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export function ScheduleMessageDialog({ 
  isOpen, 
  onClose, 
  roomId, 
  onScheduleMessage 
}: ScheduleMessageDialogProps) {
  const [useQuickOption, setUseQuickOption] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      content: "",
      date: "",
      time: "",
      quickOption: "",
    },
  });

  const quickOptions = [
    { value: "5min", label: "In 5 minutes", getDate: () => new Date(Date.now() + 5 * 60 * 1000) },
    { value: "30min", label: "In 30 minutes", getDate: () => new Date(Date.now() + 30 * 60 * 1000) },
    { value: "1hour", label: "In 1 hour", getDate: () => new Date(Date.now() + 60 * 60 * 1000) },
    { value: "tomorrow9am", label: "Tomorrow at 9 AM", getDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    }},
    { value: "nextweek", label: "Next week same time", getDate: () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }},
  ];

  const handleQuickOptionChange = (value: string) => {
    const option = quickOptions.find(opt => opt.value === value);
    if (option) {
      const date = option.getDate();
      form.setValue('quickOption', value);
      form.setValue('date', date.toISOString().split('T')[0]);
      form.setValue('time', date.toTimeString().slice(0, 5));
    }
  };

  const onSubmit = (data: ScheduleFormData) => {
    let scheduledFor: string;
    
    if (data.quickOption) {
      const option = quickOptions.find(opt => opt.value === data.quickOption);
      scheduledFor = option!.getDate().toISOString();
    } else {
      scheduledFor = new Date(`${data.date}T${data.time}`).toISOString();
    }

    const scheduledMessage: Omit<ScheduledMessage, 'id' | 'createdAt'> = {
      roomId,
      content: data.content,
      type: 'text',
      scheduledFor,
      sender: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        isOnline: true
      }
    };

    onScheduleMessage(scheduledMessage);
    
    toast({
      title: "Message scheduled",
      description: `Message will be sent on ${new Date(scheduledFor).toLocaleString()}`,
    });
    
    form.reset();
    onClose();
  };

  // Get current date and time for min values
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule Message
          </DialogTitle>
          <DialogDescription>
            Schedule a message to be sent at a specific time
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={useQuickOption ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseQuickOption(true)}
                >
                  Quick Options
                </Button>
                <Button
                  type="button"
                  variant={!useQuickOption ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseQuickOption(false)}
                >
                  Custom Time
                </Button>
              </div>

              {useQuickOption ? (
                <FormField
                  control={form.control}
                  name="quickOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose when to send</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        handleQuickOptionChange(value);
                      }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {quickOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            min={currentDate}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            min={form.watch('date') === currentDate ? currentTime : undefined}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Schedule Message
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}