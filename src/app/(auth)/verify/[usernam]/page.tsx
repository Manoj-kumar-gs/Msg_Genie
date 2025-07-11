'use client'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ApiResponse } from "@/types/apiResponse"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'

const page = () => {
  const params = useParams()
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameFromLink = params.usernam;   
  const codeFromLink = searchParams.get('c');     

  const [verifying, setVerifying] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: codeFromLink ?? '' },    // pre‑fill when arriving via link
  });

  /** Shared verify call.
   *  - Works for both auto‑submit and manual form submit */
  const verifyUser = async (code: string) => {
    if (!usernameFromLink) return; // should never happen if link is correct
    setVerifying(true);
    try {
      const { data } = await axios.post('/api/check-user-isVerified', {
        username: usernameFromLink,
        verifyCode: { code },
      });
      toast.success(data.message);
      router.replace('/dashboard');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      toast.error(axiosErr.response?.data.message ?? 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  /** Normal form handler */
  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    await verifyUser(values.code);
  };

  /** 🚀 Auto‑submit immediately if we have both params */
  useEffect(() => {
    if (usernameFromLink && codeFromLink) {
      verifyUser(codeFromLink);
    }
  }, [usernameFromLink, codeFromLink]);
  return (
    <div className="bg-white flex justify-center items-center h-[100vh]">
      <div className="bg-slate-50 p-8 flex flex-col justify-center items-center rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full flex flex-col justify-center items-center">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input className="w-[90%]" type='text' placeholder="verification code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type='submit' className="bg-gray-500 p-3 rounded-lg text-white font-semibold cursor-pointer" disabled={verifying}>{verifying ? (
              <>
                <div className="flex justify-center items-center gap-2">
                  <Loader className="animate-spin" />
                  <p>Verifying...</p>
                </div>
              </>
            ) : (<>
              Verify
            </>)}</button>
          </form>
        </Form>
      </div>

    </div>
  )
}

export default page
