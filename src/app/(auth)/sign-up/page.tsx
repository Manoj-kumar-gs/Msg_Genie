'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from 'react-toastify';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from 'lucide-react';
import Link from "next/link"


const page = () => {
    const [username, setUsername] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isSubmiting, setIsSubmiting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkingUsername = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    console.log(response)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? 'error checking username'
                    )
                } finally { setIsCheckingUsername(false) }
            }
        }
        checkingUsername()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmiting(true)
        try {
            const response = await axios.post('api/sign-up', data)
            console.log(response)
            router.replace(`/verify/${username}`)
            toast.success(`${response.data.message}`)
            setIsSubmiting(false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.error("error signing up the user")
            toast.error(
                `${axiosError.response?.data.message}`
            )
            setIsSubmiting(false)
        }
    }

    return (
        <div className="bg-white flex justify-center items-center mt-15">
            <div className="bg-slate-50 p-8 flex flex-col justify-center items-center rounded-lg">
                <h1 className="text-4xl font-bold mb-15">Try Message With AI</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full flex flex-col justify-center items-center">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Username</FormLabel>
                                    <Input className="w-[80%]" placeholder="enter username" {...field} onChange={(e) => {
                                        field.onChange(e.target.value)
                                        debounced(e.target.value)
                                    }} />
                                    {isCheckingUsername && (
                                        <Loader className="animate-spin" />
                                    )}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${usernameMessage === 'username is unique'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="w-[80%]" placeholder="enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input className="w-[80%]" type="password" placeholder="enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <button type="submit" disabled={isSubmiting} className="bg-gray-950 p-3 rounded-lg text-white font-semibold cursor-pointer transition duration-200 ease-in-out active:scale-95 active:bg-gray-700 hover:shadow-md hover:shadow-gray-500">
                            {isSubmiting ? (
                                <>
                                    <div className="flex justify-center items-center">
                                        <Loader className="animate-spin" />
                                        <p>Please Wait</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>Sign-Up</p>
                                </>
                            )}
                        </button>
                        <div className="flex gap-2">
                            <p>Already have an account?</p>
                            <Link href={"/sign-in"} className="text-blue-500">Sign-In</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page
