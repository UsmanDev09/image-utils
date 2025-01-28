import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip";
import { ImageUpscale, Image, Scaling, ScanSearch } from "lucide-react";

export function AppSidebar() {
  return (
    <div 
      style={{ viewTransitionName: 'sidebar' }}
    >
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="h-fit left-2 top-[76px] rounded-lg"
      >
        <SidebarContent className="bg-[#242627] border-[hsl(0,0,17)] border rounded-md ">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2">
                  <Image className="h-6 w-6 cursor-pointer text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="center" 
                sideOffset={10}
                className="bg-white text-black shadow-lg p-2"
              >
                Background
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2">
                  <ImageUpscale className="h-6 w-6 cursor-pointer opacity-50 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="center"
                sideOffset={10}
                className="bg-white text-black shadow-lg p-2"
              >
                Resize Image
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2">
                  <ScanSearch className="h-6 w-6 cursor-pointer opacity-50 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="center"
                sideOffset={10}
                className="bg-white text-black shadow-lg p-2"
              >
                Compress Image
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2">
                  <Scaling className="h-6 w-6 cursor-pointer opacity-50 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="center"
                sideOffset={10}
                className="bg-white shadow-lg text-black p-2"
              >
                Enhance Image
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}