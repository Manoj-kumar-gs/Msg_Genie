'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usernameValidation } from '@/schemas/signUpSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { redirect } from 'next/dist/server/api-utils'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter();

    const identifierSchema = z.object({
        identifier: z.string().min(1, "Email or username is required")
    })


    const form = useForm<z.infer<typeof identifierSchema>>({
        resolver: zodResolver(identifierSchema),
        defaultValues: {
            identifier: ''
        }
    })
    const onSubmit = async (data: { identifier: string }) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/forgot-password', data)
            const result = response.data;
            router.push(`/verify-user/${data.identifier}`)
            toast.success(`${result.message}`)
        } catch (error: any) {
            toast.error(`${error.response?.data?.message || "An error occurred"}`)
            console.log("Error submitting form:", error);
        } finally {
            setIsSubmitting(false)
            form.setValue("identifier", "")
        }
    }
    return (
        <div className="flex flex-col justify-center items-center gap-10 h-[80vh] w-[99vw] space-y-4">
            <div className='flex flex-col justify-center items-center space-y-2'>
                <h1 className='text-2xl font-bold'>Forgot Password</h1>
                <p className='font-semibold'>Please enter your username/email address to reset your password.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-start w-[70%]">
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem className="w-full flex justify-center items-start flex-col gap-4">
                                <FormLabel>Username/Email</FormLabel>
                                <FormControl>
                                    <Input className="w-full" placeholder="Enter Username/Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button type="submit" className={`bg-gray-950 p-3 rounded-lg text-white font-semibold cursor-pointer transition duration-200 ease-in-out active:scale-95 active:bg-gray-700 hover:shadow-md hover:shadow-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </Form>
        </div>
    )
}

export default page
