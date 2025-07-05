'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { useCompletion } from 'ai/react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
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
import { ApiResponse } from '@/types/apiResponse';
import { messageSchema } from '@/schemas/messageSchema';
import Link from 'next/link';
import { toast } from 'react-toastify';

const specialChar = '||';
const splitStringMessages = (messageString: string): string[] =>{
 console.log('Splitting message string:', messageString);
  const splitString = messageString.split(":").slice(-1)
  return splitString[0].split(specialChar);
}

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
 
  const messageContent = form.watch('content');
  console.log('Current message content:', messageContent);

  // const {
  //   complete,
  //   completion,
  //   isLoading: isSuggestLoading, 
  //   error,
  // } = useCompletion({
  //   api: '/api/suggest-messages',
  // });

  // useEffect(() => {
  //   console.log('Completion received:', completion);
  //   if (completion.includes(specialChar)) {
  //     setSuggestedMessages(splitStringMessages(completion));
  //   }
  // }, [completion]);

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

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const fetchSuggestions = async () => {
    setSuggestedMessages([]);
    setIsSuggestLoading(true);
    try {
      const response = await axios.post<string>('/api/suggest-messages');
      setSuggestedMessages(splitStringMessages(response.data));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setSuggestedMessages([]);
      toast(axiosError.response?.data.message ?? 'Failed to fetch suggestions');
      console.error('Error fetching suggestions:', axiosError);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="suggester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name or Email (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
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
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit" disabled={isSending || !messageContent}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send It
            </Button>
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestions}
            disabled={isSuggestLoading}
            className="cursor-pointer"
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>

          <p className="text-sm text-gray-500">Click on a message to use it:</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">AI Message Suggestions</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            { suggestedMessages.length === 0 ? (
              <p className="text-gray-500">No suggestions available.</p>
            ) : (
              suggestedMessages.map((msg, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => handleSuggestionClick(msg)}
                  className="cursor-pointer"
                >
                  {msg}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <p className="mb-4">Want your own anonymous board?</p>
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
