"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react";
import { CardFooter } from "@/components/ui/card";
import messages from "@/messages.json"
export default function Home() {
  const autoplayPlugin = useRef(
    Autoplay({
       delay: 1000,
       stopOnInteraction: true,
       stopOnMouseEnter:true }) 
  )
  return (
    <div className="">
      <main>
        <section className="flex flex-col justify-evenly items-center min-h-[20vh]">
          <div className="text-[20px] font-bold">Hello there!, Welcome to ChatUsingAi</div>
          <div className="text-lg font-semibold px-3 md:px-0">Use suggestions from Artificial Inteligence to suggest your suggestion to your friends</div>
        </section>
        <div className="w-full flex flex-col xl:flex-row justify-center items-center gap-4 xl:gap-0 md:h-[60vh]">
          <div className="flex flex-col justify-center gap-6 items-center h-full w-full xl:w-[60vw]">
            <div className="text-4xl font-bold">Welcome to ChatUsingAi <span className="text-6xl">👋</span></div>
            <div className="text-[20px] font-semibold w-[75%] text-center">Get ready to enhance your conversations with the power of Artificial Intelligence! Our smart AI helps you generate thoughtful, fun, or helpful suggestions—so you can impress your friends, break the ice, or keep the chat going smoothly.</div>
          </div>
          <div className="w-[100vw] xl:w-[40vw] flex justify-center items-center">
            <Carousel className="w-full max-w-xs cursor-pointer" plugins={[Autoplay({ delay: 3000 })]}
>
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="flex flex-col justify-center items-center gap-0 ">
                       <div className="font-bold text-center">
                        {message.title}
                       </div>
                        <CardContent className="flex aspect-square items-center justify-center px-6 w-full h-30">
                          <span className="text-2xl font-semibold px-2 break-words">{message.content}</span>
                        </CardContent>
                        <CardFooter className="pt-0">
                          {message.received}
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="cursor-pointer"/>
              <CarouselNext className="cursor-pointer"/>
            </Carousel>
          </div>
        </div>
      </main>
    </div>
  );
}
