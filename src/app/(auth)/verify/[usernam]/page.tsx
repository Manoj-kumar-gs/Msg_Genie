'use client'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { ApiResponse } from "@/types/apiResponse"
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'

const page = () => {
  const [verifying, setverifying] = useState(false)
  const params = useParams()
  console.log(params, params.usernam)
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  })
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log(data)
    setverifying(true);
    try {
      const response = await axios.post('/api/check-user-isVerified', {
        username: params.usernam,
        verifyCode: { code: data.code }
      })
      toast(`${response?.data.message}`)
      // const router = useRouter()
      // router.replace('/')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.error("error verifying user using verification code", error)
      toast.error(`${axiosError.response?.data.message}`)
    } finally {
      setverifying(false)
    }
  }
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
            <button type='submit' className="bg-gray-500 w-30 p-3 rounded-lg text-white font-semibold cursor-pointer" disabled={verifying}>{verifying ? (
              <>
                <div className="flex justify-center items-center">
                  <Loader className="animate-spin" />
                  <p>Verifying</p>
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
