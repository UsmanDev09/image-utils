import {
    env,
    AutoModel, 
    AutoProcessor
} from "@huggingface/transformers";
import { FALLBACK_MODEL_ID, WEBGPU_MODEL_ID } from "./constants";
import { initializeWebGPU } from "./initialize-gpu";
import useAppShell from "../store/use-app-shell";

export async function initializeModel(forceModelId?: string): Promise<boolean> {
    const { isIOS, setModel, setProcessor, setCurrentModelId, setIsWebGPUSupported } = useAppShell.getState();
    try {
      // Always use RMBG-1.4 for iOS
      if (isIOS) {
        console.log('iOS detected, using RMBG-1.4 model');
        env.allowLocalModels = false;
        if (env.backends?.onnx?.wasm) {
          env.backends.onnx.wasm.proxy = true;
        }
  
        const model = await AutoModel.from_pretrained(FALLBACK_MODEL_ID, {
          //@ts-expect-error ts-ignore
          config: { model_type: 'custom' }
        });

        setModel(model);
  
        const processor = await AutoProcessor.from_pretrained(FALLBACK_MODEL_ID, {
          config: {
            do_normalize: true,
            do_pad: false,
            do_rescale: true,
            do_resize: true,
            image_mean: [0.5, 0.5, 0.5],
            feature_extractor_type: "ImageFeatureExtractor",
            image_std: [1, 1, 1],
            resample: 2,
            rescale_factor: 0.00392156862745098,
            size: { width: 1024, height: 1024 },
          }
        });

        setProcessor(processor);
  
        const currentModelId = FALLBACK_MODEL_ID;
        setCurrentModelId(currentModelId)
        return true;
      }
  
      // Non-iOS flow remains the same
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gpu = (navigator as any).gpu;
      const isWebGPUSupported = Boolean(gpu);

      setIsWebGPUSupported(isWebGPUSupported)
      
      const selectedModelId = forceModelId || FALLBACK_MODEL_ID;
      const useWebGPU = selectedModelId === WEBGPU_MODEL_ID && gpu;
      
      console.log(`Initializing model: ${selectedModelId} ${useWebGPU ? '(WebGPU)' : '(Cross-browser)'}`);
      
      if (useWebGPU) {
        await initializeWebGPU();
      } else {
        env.allowLocalModels = false;
        if (env.backends?.onnx?.wasm) {
          env.backends.onnx.wasm.proxy = true;
        }
        
        const model = await AutoModel.from_pretrained(FALLBACK_MODEL_ID, {
          progress_callback: (progress) => {
            console.log(`Loading model: ${progress}%`);
          }
        });

        setModel(model);
        
        const processor = await AutoProcessor.from_pretrained(FALLBACK_MODEL_ID, {
          revision: "main",
          config: {
            do_normalize: true,
            do_pad: true,
            do_rescale: true,
            do_resize: true,
            image_mean: [0.5, 0.5, 0.5],
            feature_extractor_type: "ImageFeatureExtractor",
            image_std: [0.5, 0.5, 0.5],
            resample: 2,
            rescale_factor: 0.00392156862745098,
            size: { width: 1024, height: 1024 }
          }
        });

        setProcessor(processor)
      }


        
      // if (!model || !processor) {
      //   throw new Error("Failed to initialize model or processor");
      // }
      
      setCurrentModelId(selectedModelId)
      return true;
    } catch (error) {
      console.error("Error initializing model:", error);
      if (forceModelId === WEBGPU_MODEL_ID) {
        console.log("Falling back to cross-browser model...");
        return initializeModel(FALLBACK_MODEL_ID);
      }
      throw new Error(error instanceof Error ? error.message : "Failed to initialize background removal model");
    }
  }