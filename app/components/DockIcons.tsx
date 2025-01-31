"use client";

import React from "react";

import { Dock, DockIcon } from "@/components/ui/dock";
import { useTransitionRouter } from 'next-view-transitions'
import useAppShell, { ImageFile } from "@/app/store/use-app-shell";

type IconProps = React.HTMLAttributes<SVGElement>;

interface DockIconProps {
    onDelete: (id: number) => void,
    setIsEditModalOpen: (isEditModalOpen:boolean) => void,
    processedImageUrl: string,
    processedURL: string,
    image: ImageFile
}

export function DockIcons({ onDelete, processedImageUrl, processedURL, image  } : DockIconProps) {
    const { updateImageEditing } = useAppShell.getState();
    const router = useTransitionRouter()

    return (
        <div className="relative top-0 p-2">
            <Dock iconSize={30} iconMagnification={40} iconDistance={80} direction="middle" className="h-[35px] mt-0 text-white"> 
                <DockIcon>
                    <button
                        onClick={() => onDelete(image.id)}
                        title="Delete"
                    >
                        <Icons.delete className="size-full"  />
                    </button>
                </DockIcon>
                <DockIcon>
                {/* <button
                onClick={() => setIsEditModalOpen(true)}
                title="Edit"
                > */}

                    <button onClick={() => {
                        // Your state changes or navigation logic here
                        updateImageEditing(image.id, true);
                        router.push('/edit');
                    }}>
                        <Icons.edit className="size-full" />
                    </button>
                {/* </button> */}
                </DockIcon>
                <DockIcon>
                    <a
                        href={processedImageUrl || processedURL}
                        download={`processed-${image.id}.png`}
                        title="Download"
                    >
                        <Icons.download className="size-full" />
                    </a>
                </DockIcon>
            </Dock>
        </div>
    );
}

const Icons = {
    delete: (props: IconProps) => (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    edit: (props: IconProps) => (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    ),
    download: (props: IconProps) => (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
};
