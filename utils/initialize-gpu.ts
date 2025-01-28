import { 
    AutoModel,
    AutoProcessor,
} from "@huggingface/transformers";

import useAppShell from "../store/use-app-shell";

import { WEBGPU_MODEL_ID } from "./constants";

export async function initializeWebGPU() {
  const { setModel, setProcessor, setIsWebGPUSupported } = useAppShell.getState();
  console.log('start')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gpu = (navigator as any).gpu; 
  if (!gpu) {
    setIsWebGPUSupported(false);
    throw new Error("WebGPU is not supported in this browser");
  }

  setIsWebGPUSupported(true);

  try {
    // Your existing initialization code
    const model = await AutoModel.from_pretrained(WEBGPU_MODEL_ID, {
      device: "webgpu",
      config: {
        model_type: 'modnet',
        //@ts-expect-error ts-ignore
        architectures: ['MODNet']
      }
    });

    console.log('model', model.config)
    const processor = await AutoProcessor.from_pretrained(WEBGPU_MODEL_ID, {});
    setModel(model);
    setProcessor(processor);
    
    return true;
  } catch (error) {
    console.error("WebGPU initialization failed:", error);
    throw new Error("Failed to initialize WebGPU model. Falling back to cross-browser version.");
  }
}