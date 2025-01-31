'use client'

import { Dock, DockIcon } from "@/components/ui/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { ImageUpscale, ImageOff } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip"
import useAppShell, { Feature } from "@/app/store/use-app-shell";


const DATA = { 
    contact: {
    email: "hello@example.com",
    tel: "+123456789",
    selectedFeature: {
      RemoveBackground: {
        name: "Remove BG",
        url: "https://dub.sh/dillion-github",
        icon: ImageOff,

        navbar: true,
      },
      Compress: {
        name: "Compress image",
        url: "https://dub.sh/dillion-linkedin",
        icon: ImageUpscale,

        navbar: true,
      }
    },
  },
}

// keep track of monthly users, files processed, gb reduced

export function Navbar () {
    const { selectedFeature, setSelectedFeature } = useAppShell();
    console.log('FEATURE', selectedFeature)
    return (
        <>
            <nav className="bg-black shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-center">
                        <h1 className="text-md  text-white">
                            A free tool by <Link href="http://bitpix.tech" ><span className="text-green-400 font-bold underline hover:text-green-600"> Bitpix  </span></Link>
                        </h1>
                    </div>
                </div>
                <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom">
                    <Dock className="z-50 rounded-full pointer-events-auto bg-[#101112] relative mx-auto flex min-h-full items-center border border-gray-800  [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
                        {Object.entries(DATA.contact.selectedFeature)
                            .filter(([_, selectedFeature]) => selectedFeature.navbar)
                            .map(([name, selectedFeature]) => (
                                <DockIcon key={name} className="size-4">
                                    <TooltipProvider delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <selectedFeature.icon 
                                                      onClick={() => {
                                                        console.log('changing state')
                                                        const featureMap = {
                                                          'RemoveBackground': Feature.RemoveBackground,
                                                          'Compress': Feature.Compress
                                                        };
                                                        setSelectedFeature(featureMap[name as keyof typeof featureMap]);
                                                      }} 
                                                    className="size-5 stroke-green-400" 
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                            <p>{selectedFeature.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </DockIcon>
                        ))}
                    </Dock>
                </div>
            </nav>
        </>
    )
}


