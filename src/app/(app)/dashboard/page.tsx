'use client'
import MessageCard from '@/components/MessageCard'
import { SkeletonDemo } from '@/components/Skeleton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Copy, Loader, Loader2, RefreshCcw, RefreshCcwIcon } from 'lucide-react'
import { set } from 'mongoose'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileURL, setProfileURL] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { data, status } = useSession()
  const username = data?.username

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch('AcceptMessage')

  const handleSwitchChange = async () => {
    const newValue = !acceptMessages
    setIsSwitchLoading(true)
    setValue('AcceptMessage', newValue)
    try {
      const response = await axios.post('api/accepting-messages', {
        acceptMessages: newValue
      })
    } catch (error) {
      const axiosError = error as AxiosError
      toast.error(`${axiosError}`)
    } finally {
      setIsSwitchLoading(false)
    }
  }

  useEffect(() => {
    if (!username) return
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
    setProfileURL(`${baseUrl}/u/${username}`)
  }, [username])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000);
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => {
      const updated = prev.filter(item => item._id !== messageId)
      return updated
    })
  }



  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accepting-messages')
      setValue("AcceptMessage", response?.data.isAcceptingMessages ?? true)
    } catch (error) {
      const axiosError = error as AxiosError
      toast.error(`${axiosError}`)
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setIsSwitchLoading])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get('api/get-messages')
      setMessages(response.data.messages ?? [])
      if (refresh) {
        toast.success('Messages refreshed successfully')
      }
    } catch (error) {
      const axiosError = error as AxiosError
      toast.error(`${axiosError}`)
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading])
  const [skeletonUI, setSkeletonUI] = useState(true);

  useEffect(() => {
    fetchAcceptingMessages();
    fetchMessages();
    const timer = setTimeout(() => {
      setSkeletonUI(false);
    }, 500);

    return () => clearTimeout(timer); // cleanup
  }, []);


  if (skeletonUI) { return <SkeletonDemo /> }

  return (
    <div className='w-[99vw] flex flex-col justify-start items-start gap-7 p-8'>
      <h1 className='font-extrabold text-3xl'>Your Dashboard</h1>
      <div className='flex flex-col justify-center items-start w-full'>
        <h2 className='font-bold text-[20px]'>Copy Your Link</h2>
        <div className='w-full flex items-end gap-3 h-15'>
          <input
            type="text"
            value={profileURL}
            readOnly
            className='font-semibold p-2 rounded-lg bg-slate-100 w-[80%] h-10' />
          <div className='flex flex-col gap-2 justify-end items-center h-full'>
            <button className={`flex items-center gap-2 px-6 py-2 rounded-lg ${copied ? 'text-green' : 'text-white'} font-semibold shadow-md transition duration-100 ease-in-out transform active:scale-95 cursor-pointer hover:shadow-cyan-500 ${copied ? 'bg-green-500' : 'bg-indigo-500'}`} disabled={copied} onClick={copyToClipboard}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
      </div>
      <div className='flex gap-2'>
        <Switch
          {...register('AcceptMessage')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className='cursor-pointer'
        />
        {acceptMessages ? (
          <>
            <div>Accepting Messages</div>
          </>
        ) : (
          <>
            <div>Not Accepting Messages</div>
          </>
        )}
      </div>
      <div>
        <Button onClick={() => { fetchMessages(true) }} className='cursor-pointer'>
          {isLoading ? (
            <>
              <Loader2 className='animate-spin' />
            </>
          ) : (
            <>
              <RefreshCcw className='hover:cursor-pointer' />
            </>
          )}
        </Button>
      </div>

      {messages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 w-full justify-center items-center place-items-center space-y-5">
          {messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onDeleteMessage={handleDeleteMessage}
            />
          ))}
        </div>
      ) : (
        <div className='font-bold text-2xl'>There are no messages to display</div>
      )}
    </div>
  )
}

export default DashboardPage