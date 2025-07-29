export interface DeviceInfo {
  hasCamera: boolean;
  hasMicrophone: boolean;
  cameraPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
  microphonePermission: 'granted' | 'denied' | 'prompt' | 'unknown';
  isSecureContext: boolean;
}

export const checkDeviceSupport = (): DeviceInfo => {
  const isSecureContext = window.isSecureContext;
  const hasMediaDevices = !!navigator.mediaDevices;
  
  return {
    hasCamera: hasMediaDevices,
    hasMicrophone: hasMediaDevices,
    cameraPermission: 'unknown',
    microphonePermission: 'unknown',
    isSecureContext,
  };
};

export const getDevicePermissions = async (): Promise<DeviceInfo> => {
  const baseInfo = checkDeviceSupport();
  
  if (!baseInfo.hasCamera && !baseInfo.hasMicrophone) {
    return baseInfo;
  }

  try {
    // Check camera permission
    let cameraPermission: 'granted' | 'denied' | 'prompt' = 'prompt';
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraPermission = 'granted';
      cameraStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          cameraPermission = 'denied';
        } else if (error.name === 'NotFoundError') {
          baseInfo.hasCamera = false;
        }
      }
    }

    // Check microphone permission
    let microphonePermission: 'granted' | 'denied' | 'prompt' = 'prompt';
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphonePermission = 'granted';
      micStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          microphonePermission = 'denied';
        } else if (error.name === 'NotFoundError') {
          baseInfo.hasMicrophone = false;
        }
      }
    }

    return {
      ...baseInfo,
      cameraPermission,
      microphonePermission,
    };
  } catch (error) {
    console.error('Error checking device permissions:', error);
    return baseInfo;
  }
};

export const getErrorMessage = (deviceInfo: DeviceInfo): string | null => {
  if (!deviceInfo.isSecureContext) {
    return "Media access requires a secure context (HTTPS or localhost). Please use HTTPS or run on localhost.";
  }

  if (!deviceInfo.hasCamera && !deviceInfo.hasMicrophone) {
    return "No camera or microphone found. Please check your device connections.";
  }

  const errors: string[] = [];

  if (!deviceInfo.hasCamera) {
    errors.push("Camera not available");
  } else if (deviceInfo.cameraPermission === 'denied') {
    errors.push("Camera permission denied");
  }

  if (!deviceInfo.hasMicrophone) {
    errors.push("Microphone not available");
  } else if (deviceInfo.microphonePermission === 'denied') {
    errors.push("Microphone permission denied");
  }

  if (errors.length === 0) {
    return null;
  }

  return `${errors.join(', ')}. Please check your device permissions and try again.`;
};

export const requestDevicePermissions = async (): Promise<DeviceInfo> => {
  const deviceInfo = await getDevicePermissions();
  
  if (deviceInfo.cameraPermission === 'prompt' || deviceInfo.microphonePermission === 'prompt') {
    try {
      // Request both permissions at once
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceInfo.hasCamera,
        audio: deviceInfo.hasMicrophone,
      });
      
      stream.getTracks().forEach(track => track.stop());
      
      return {
        ...deviceInfo,
        cameraPermission: deviceInfo.hasCamera ? 'granted' : 'denied',
        microphonePermission: deviceInfo.hasMicrophone ? 'granted' : 'denied',
      };
    } catch (error) {
      console.error('Error requesting device permissions:', error);
      return deviceInfo;
    }
  }
  
  return deviceInfo;
}; 