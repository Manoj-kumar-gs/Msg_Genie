import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Message } from '@/models/user'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { ApiResponse } from '@/types/apiResponse'
import dayjs from 'dayjs';

type MessageCardProps = {
message:Message,
onDeleteMessage: (id: string)=>void
}

const MessageCard = ({message, onDeleteMessage} : MessageCardProps ) => {
    const handleDeleteMessage = async ()=>{
      try {
        const response = await axios.delete<ApiResponse>(`api/delete-message/${message._id}`)
          onDeleteMessage(`${message._id}`)
          toast.success(`${response.data.message}`)
      } catch (error) {
        const axioxError = error as AxiosError<ApiResponse>
        console.log("Error in deleting message",axioxError) 
        toast.error(`${axioxError.response?.data.message}`)
      }
    }
  return (
      <Card className='w-full md:w-[25vw] min-h-[35vh] shadow-gray-500 flex justify-center items-center'>
  <CardHeader className='space-y-4 w-full flex flex-col justify-center items-start'>
    <CardTitle className='text-lg w-full flex justify-center items-center'>{message.suggester}</CardTitle>
    <CardDescription className='font-semibold'>{message.content}</CardDescription>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className='flex justify-between items-center w-full'>
        <div className='text-sm font-semibold'>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</div>
        <Button variant="destructive" className='cursor-pointer'>Delete</Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer hover:bg-green-500'>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage} className='cursor-pointer hover:bg-red-700 bg-gray-800'>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog> 
  </CardHeader>
</Card>
  )
}

export default MessageCard
 