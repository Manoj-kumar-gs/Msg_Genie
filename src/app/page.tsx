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
import { Loader } from "lucide-react";

export default function Home() {
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

  const routingHandler = async (path: string) => {
 router.push(path);
  };

  return (
    <div className="min-h-[80vh] bg-white text-gray-800">
      <main className="flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center text-center py-8 md:px-6 space-y-4 md:w-full w-[90vw]">
          <h1 className="text-2xl md:text-4xl font-bold">
            Let Others Message You — With a Little Help from AI 🤖
          </h1>
          <p className="text-lg md:text-lg max-w-2xl font-semibold text-gray-600">
            Create your personal link. Share it in your bio. Let your friends (or strangers)
            send you messages — even with smart AI suggestions to guide them.
          </p>
        </section>

        {/* Intro Section */}
        <section className="flex flex-col xl:flex-row justify-center items-center gap-10 xl:gap-20 md:px-10 py-8 md:w-full w-[90vw]">
          <div className="flex flex-col gap-6 text-center xl:text-left xl:w-1/2">
            <h2 className="text-3xl md:text-3xl font-bold">
              Welcome to <span className="text-indigo-600">MsgGenie</span> 👋
            </h2>
            <p className="text-lg font-semibold text-gray-700">
              Enhance your conversations with smart, AI-powered suggestions.
              Whether you're breaking the ice, asking fun questions, or giving compliments,
              our AI helps you say it better.
            </p>
          </div>

          {/* Carousel */}
          <div className="w-[90%] md:w-full max-w-md box-border">
            <Carousel className="w-[95%] md:w-full" plugins={[autoplayPlugin.current]}>
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <Card className="w-[100%] h-full flex flex-col justify-between px-2 py-4 md:px-4 md:py-6 text-center shadow-md border">
                      <div className="font-semibold text-indigo-700 text-lg">
                        {message.title}
                      </div>
                      <CardContent className="flex-grow flex items-center justify-center p-0 md:px-4">
                        <span className="text-xl font-medium text-gray-800 break-words">
                          {message.content}
                        </span>
                      </CardContent>
                      <CardFooter className="text-sm text-gray-500 p-0">
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
        <section className="flex flex-col items-center justify-center md:pb-5 py-10 md:w-full w-[90vw]">
            <p className="text-md font-bold text-gray-600 text-center">
              Start by creating your link, share it anywhere, and let the world message you!
            </p>
        {user? (
            <button onClick={() => routingHandler("/dashboard")} className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-md hover:shadow-cyan-500 transition-all duration-100 active:scale-95"> My Link </button>
        ) : (
            <button onClick={() => routingHandler("/sign-up")} className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md shadow-md hover:shadow-cyan-500 transition-all duration-100 active:scale-95" >
              Sign In to Create Your Link
            </button>
        )}
        </section>
      </main>
    </div>
  );
}
