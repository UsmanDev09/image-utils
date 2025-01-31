'use client'

import { buttonVariants } from "@/components/ui/button"
import { Dock, DockIcon } from "@/components/ui/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ImageUpscale, Image, Scaling, ScanSearch, ImageUp } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip"
// type IconProps = React.HTMLAttributes<SVGElement>;

// const DATA = { contact: {
//     email: "hello@example.com",
//     tel: "+123456789",
//     social: {
//       GitHub: {
//         name: "Remove BG",
//         url: "https://dub.sh/dillion-github",
//         icon: Image,

//         navbar: true,
//       },
//       LinkedIn: {
//         name: "Compress image",
//         url: "https://dub.sh/dillion-linkedin",
//         icon: ImageUpscale,

//         navbar: true,
//       }
//     },
//   },
// }


// const Icons = {
//     delete: (props: IconProps) => (
//       <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//       </svg>
//     ),
//     edit: (props: IconProps) => (
//       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//       </svg>
//     ),
//     download: (props: IconProps) => (
//       <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//     </svg>
//     ),
//   };

export function Navbar () {
    return (
        <>
            <nav className="bg-black shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-center">
                        <h1 className="text-md  text-white">
                            A free tool by <Link href="https://usmansiddique.dev" ><span className="text-green-400 font-bold underline hover:text-green-600"> Usman  </span></Link>
                        </h1>
                    </div>
                </div>
                {/* <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom">
                    <Dock className="z-50 rounded-full pointer-events-auto bg-[#101112] relative mx-auto flex min-h-full items-center border-gray-200 border bg-[#08090a] [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
                        {Object.entries(DATA.contact.social)
                            .filter(([_, social]) => social.navbar)
                            .map(([name, social]) => (
                                <DockIcon key={name} className="size-4">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <ImageUpscale className="size-4 text-white" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                            <p>{name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </DockIcon>
                        ))}
                    </Dock>
                </div> */}
            </nav>
        </>
    )
}


