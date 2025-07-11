"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from "react";
import messages from "@/messages.json";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fi } from "zod/v4/locales";
import { set } from "mongoose";
import { Loader } from "lucide-react";

export default function Home() {
  const [routing, setrouting] = useState(false)
  const router = useRouter();
  const {data: session} = useSession();
  const user = session?.user;

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  const routingHandler = (path: string) => {
    try {
      setrouting(true);
      router.push(path);
    } catch (error) {
      console.error("Error occurred while routing:", error);
    }finally {
      setrouting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center text-center py-10 px-6 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Let Others Message You — With a Little Help from AI 🤖
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Create your personal link. Share it in your bio. Let your friends (or strangers)
            send you messages — even with smart AI suggestions to guide them.
          </p>
        </section>

        {/* Intro Section */}
        <section className="flex flex-col xl:flex-row justify-center items-center gap-10 px-6 md:px-20 py-10">
          <div className="flex flex-col gap-6 text-center xl:text-left xl:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold">
              Welcome to <span className="text-indigo-600">ChatUsingAI</span> 👋
            </h2>
            <p className="text-lg font-medium text-gray-700">
              Enhance your conversations with smart, AI-powered suggestions.
              Whether you're breaking the ice, asking fun questions, or giving compliments,
              our AI helps you say it better.
            </p>
            <p className="text-md text-gray-600">
              Start by creating your link, share it anywhere, and let the world message you!
            </p>
          </div>

          {/* Carousel */}
          <div className="w-full max-w-md">
            <Carousel className="w-full" plugins={[autoplayPlugin.current]}>
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <Card className="h-full flex flex-col justify-between p-4 text-center shadow-md border">
                      <div className="font-semibold text-indigo-700 text-lg">
                        {message.title}
                      </div>
                      <CardContent className="flex-grow flex items-center justify-center px-4">
                        <span className="text-xl font-medium text-gray-800 break-words">
                          {message.content}
                        </span>
                      </CardContent>
                      <CardFooter className="text-sm text-gray-500">
                        {message.received}
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
        {user? (
            routing ? <Loader className="animate-spin"/> : <button className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700" onClick={() => routingHandler("/dashboard")}>
              Dashboard
            </button>
        ) : (
          <Link href="/sign-in">
            <button className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700">
              Sign In to Create Your Link
            </button>
          </Link>
        )}
      </main>
    </div>
  );
}
