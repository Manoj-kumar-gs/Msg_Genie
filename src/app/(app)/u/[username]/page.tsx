'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ApiResponse } from '@/types/apiResponse';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const splitStringMessages = (messageString: string): string[] => {
  const splitString = messageString.split(':').slice(-1);
  return splitString[0].split(specialChar);
};

export default function Suggester() {
  const { username } = useParams<{ username: string }>();
  const [isSending, setIsSending] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      suggester: '',
      content: '',
    },
  });

  useEffect(() => {
    fetchSuggestions();
  }, [])

  const fetchSuggestions = useCallback(async () => {
    setSuggestedMessages([]);
    setIsSuggestLoading(true);
    try {
      const response = await axios.post<string>('/api/suggest-messages');
      setSuggestedMessages(splitStringMessages(response.data));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to fetch suggestions');
    } finally {
      setIsSuggestLoading(false);
    }
  },[]);

  const messageContent = form.watch('content');

  const handleSuggestionClick = (msg: string) => {
    form.setValue('content', msg);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        suggesterName: data.suggester,
        username,
        message: data.content,
      });

      toast.success(response.data.message);
      form.reset({ suggester: data.suggester, content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-gradient-to-br from-slate-100 to-white">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-black mb-8">
          Send Anonymous Message to <span className="text-indigo-600">@{username}</span>
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="suggester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      className="focus-visible:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write something you want to say..."
                      className="resize-none focus-visible:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSending || !messageContent}
                className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-md hover:shadow-cyan-500 transition-all duration-100 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  'Send It'
                )}
              </button>
            </div>
          </form>
        </Form>

        <Separator className="my-10" />

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">AI Message Suggestions</h2>
            <button
              onClick={fetchSuggestions}
              disabled={isSuggestLoading}
              className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-md hover:shadow-cyan-500 transition-all duration-100 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSuggestLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                'Suggest Messages'
              )}
            </button>
          </div>
          <Card className="border border-slate-200">
            <CardContent className="py-4 flex flex-wrap gap-2">
              {suggestedMessages.length === 0 ? (
                <p className="text-gray-500 italic">No suggestions yet.</p>
              ) : (
                suggestedMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(msg)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border rounded-md text-sm transition-all duration-150 shadow-sm cursor-pointer hover:shadow-md active:scale-95"
                  >
                    {msg}
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="text-center">
          <p className="text-gray-600 mb-3">Want your own anonymous board?</p>
          <Link href="/sign-up">
            <button className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-md hover:shadow-cyan-500 transition-all duration-100 active:scale-95">
              Create Your Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
