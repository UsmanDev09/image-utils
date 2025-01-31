'use client'

import { create } from "zustand";
import { PreTrainedModel, Processor } from "@huggingface/transformers";

export interface ImageFile {
    id: number;
    file: File;
    processedFile?: File;
    isEditing: boolean;
}

export enum Feature {
    RemoveBackground = 'RB',
    Compress = 'C',
    Enhance = 'E'
}

type Store = {
    currentModelId: string;
    isWebGPUSupported: boolean;
    isIOS: boolean;
    model?: PreTrainedModel | null,
    processor?: Processor | null,
    images: ImageFile[],
    selectedFeature: Feature,
    setModel: (model: PreTrainedModel) => void,
    setProcessor: (processor: Processor) => void,
    setIsWebGPUSupported: (isWebGPUSupported: boolean) => void,
    setCurrentModelId: (currentModelId: string) => void,
    addImage: (image: ImageFile) => void, // Action to add images
    updateProcessedImage: (id: number, processedFile: File) => void, // Action to update processed image
    updateImageEditing: (id: number, isEditing: boolean) => void,
    setImages: (images: ImageFile[]) => void,
    setSelectedFeature: (selectedFeature: Feature) => void,
}

// type PersistStore = (
//     config: StateCreator<Store, [], []>,
//     options: PersistOptions<Store>
// ) => StateCreator<Store, [], []>

const useAppShell = create<Store>(
    
    (set) => ({
        currentModelId: 'briaai/RMBG-1.4',
        isWebGPUSupported: false,
        isIOS: false,
        images: [],
        selectedFeature: Feature.RemoveBackground,
        setModel: (model: PreTrainedModel) => set(() => ({ model })),
        setProcessor: (processor: Processor) => set(() => ({ processor })),
        setCurrentModelId: (currentModelId: string) => set(() => ({ currentModelId })),
        setIsWebGPUSupported: (isWebGPUSupported: boolean) => set(() => ({ isWebGPUSupported})),
        addImage: (image: ImageFile) => set(state => ({ images: [...state.images, image] })), // Add image action

        updateProcessedImage: (id: number, processedFile: File) => set(state => ({
            images: state.images.map(image => 
                image.id === id ? { ...image, processedFile } : image
            )
        })), // Update processed image action
        updateImageEditing: (id: number, isEditing: boolean) => set(state => ({
            images: state.images.map(image => 
                image.id === id ? { ...image, isEditing } : image
            )
        })),
        setSelectedFeature: (selectedFeature: Feature) => set(() => ({ selectedFeature })),
        setImages: (images: ImageFile[]) => set(() => ({ images }))
    }), 

)

export default useAppShell;