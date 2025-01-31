import useAppShell from "../store/use-app-shell";


interface ModelInfo {
    currentModelId: string;
    isWebGPUSupported: boolean;
    isIOS: boolean;
}


export function getModelInfo(): ModelInfo {
    const { currentModelId, isWebGPUSupported, isIOS } = useAppShell.getState();
    
    return {
      currentModelId,
      isWebGPUSupported,
      isIOS
    };
  }