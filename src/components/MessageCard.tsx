import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

type MessageCardProps = {
message:Message,
onDeleteMessage: (messageId: string)=>void
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
      <Card className='w-[15vw]'>
  <CardHeader className='space-y-4'>
    <CardTitle>{message.suggester}</CardTitle>
    <CardDescription>{message.content}</CardDescription>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className='cursor-pointer'>Delete</Button>
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardHeader>
</Card>
  )
}

export default MessageCard
 