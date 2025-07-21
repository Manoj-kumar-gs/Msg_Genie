// import { Skeleton } from "@/components/ui/skeleton"

// export function SkeletonDemo() {
//   return (
//     <div className="flex items-center space-x-4 w-screen h-screen justify-center">
//       <Skeleton className="h-[90%] w-[90%] rounded-lg" />
//       <div className="space-y-2">
//         <Skeleton className="h-4 w-[250px]" />
//         <Skeleton className="h-4 w-[200px]" />
//       </div>
//     </div>
//   )
// }

// import { cn } from "@/lib/utils"
// import { Slider } from "@/components/ui/slider"

// type SliderProps = React.ComponentProps<typeof Slider>

// export function SkeletonDemo({ className, ...props }: SliderProps) {
//   return (
//     <Slider
//       defaultValue={[50]}
//       max={100}
//       step={1}
//       className={cn("w-[60%]", className)}
//       {...props}
//     />
//   )
// }


import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4 h-screen justify-center w-screen">
      <Skeleton className="h-22 w-22 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

