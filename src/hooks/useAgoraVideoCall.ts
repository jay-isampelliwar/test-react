import { useState, useEffect, useCallback, useRef } from "react";
import {
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useLocalScreenTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { getDevicePermissions, getErrorMessage, type DeviceInfo } from "../utils/deviceUtils";

export const useAgoraCall = () => {
  const [calling, setCalling] = useState(false);
  const [appId] = useState("5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    "007eJxTYEjjP71ql+YT34h0zhm1p1Nc/DM6tH3SZ/Awst/fV3M8302BwdTc0CgpydzMMikxzcTC0MTC3MDSOCk52SDFxMjYzNw4K7YjoyGQkSH03XUGRigE8VkYQlKLSxgYAJzUHT0="
  );
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isScreenSharingLoading, setIsScreenSharingLoading] = useState(false);
  const screenSharingRef = useRef(false);
  
  // Error handling states
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isCheckingDevices, setIsCheckingDevices] = useState(false);

  const isConnected = useIsConnected();
  
  // Check device permissions and availability
  const checkDevicePermissions = useCallback(async () => {
    setIsCheckingDevices(true);
    setDeviceError(null);
    
    try {
      const info = await getDevicePermissions();
      setDeviceInfo(info);
      
      // Update device states based on permissions
      if (info.cameraPermission === 'denied' || !info.hasCamera) {
        setCamera(false);
      }
      if (info.microphonePermission === 'denied' || !info.hasMicrophone) {
        setMic(false);
      }
      
      // Get error message if any
      const errorMessage = getErrorMessage(info);
      if (errorMessage) {
        setDeviceError(errorMessage);
      }
      
    } catch (error) {
      console.error("Device permission check failed:", error);
      setDeviceError("Failed to check device permissions. Please refresh the page and try again.");
    } finally {
      setIsCheckingDevices(false);
    }
  }, []);

  // Check permissions on mount
  useEffect(() => {
    checkDevicePermissions();
  }, [checkDevicePermissions]);

  // Create tracks with error handling
  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack(
    micOn && deviceInfo?.microphonePermission !== 'denied' && deviceInfo?.hasMicrophone !== false
  );
  
  const { localCameraTrack, error: cameraError } = useLocalCameraTrack(
    cameraOn && deviceInfo?.cameraPermission !== 'denied' && deviceInfo?.hasCamera !== false
  );
  
  const { screenTrack } = useLocalScreenTrack(screenSharing, {}, "disable");
  const remoteUsers = useRemoteUsers();

  // Handle screen sharing state synchronization with browser events
  useEffect(() => {
    if (screenTrack) {
      // Listen for when screen sharing is stopped from browser UI
      const handleTrackEnded = () => {
        console.log("Screen sharing track ended");
        setScreenSharing(false);
        screenSharingRef.current = false;
      };

      // Add event listeners to the screen track
      if (screenTrack.getMediaStreamTrack) {
        const mediaStreamTrack = screenTrack.getMediaStreamTrack();
        if (mediaStreamTrack) {
          mediaStreamTrack.addEventListener('ended', handleTrackEnded);
        }
      }

      // Cleanup function
      return () => {
        if (screenTrack.getMediaStreamTrack) {
          const mediaStreamTrack = screenTrack.getMediaStreamTrack();
          if (mediaStreamTrack) {
            mediaStreamTrack.removeEventListener('ended', handleTrackEnded);
          }
        }
      };
    }
  }, [screenTrack]);

  // Listen for browser screen sharing events
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Check if screen sharing is still active when page becomes visible
      if (screenSharing && document.visibilityState === 'visible') {
        // If we're screen sharing but the track is not available, stop sharing
        if (!screenTrack) {
          setScreenSharing(false);
          screenSharingRef.current = false;
        }
      }
    };

    const handleBeforeUnload = () => {
      // Stop screen sharing when page is about to unload
      if (screenSharing) {
        setScreenSharing(false);
        screenSharingRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [screenSharing, screenTrack]);

  // Handle track creation errors
  useEffect(() => {
    if (micError) {
      console.error("Microphone track error:", micError);
      setDeviceError("Failed to access microphone. Please check your device permissions.");
      setMic(false);
    }
  }, [micError]);

  useEffect(() => {
    if (cameraError) {
      console.error("Camera track error:", cameraError);
      setDeviceError("Failed to access camera. Please check your device permissions.");
      setCamera(false);
    }
  }, [cameraError]);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  
  // Publish tracks including screen track when screen sharing is active
  const tracksToPublish = [localMicrophoneTrack, localCameraTrack].filter(Boolean);
  if (screenSharing && screenTrack) {
    tracksToPublish.push(screenTrack as any);
  }
  usePublish(tracksToPublish);

  const toggleMic = useCallback(() => {
    if (deviceInfo?.microphonePermission !== 'denied' && deviceInfo?.hasMicrophone !== false) {
      setMic((prev) => !prev);
    }
  }, [deviceInfo]);

  const toggleCamera = useCallback(() => {
    if (deviceInfo?.cameraPermission !== 'denied' && deviceInfo?.hasCamera !== false) {
      setCamera((prev) => !prev);
    }
  }, [deviceInfo]);

  const toggleCall = () => setCalling((prev) => !prev);
  const joinChannel = () => setCalling(true);
  
  // Helper function to force stop screen sharing
  const forceStopScreenSharing = useCallback(async () => {
    try {
      // Try to access the screen sharing API to trigger any active streams to stop
      // This is a workaround for browsers that don't properly stop screen sharing
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Request a new screen share to potentially interrupt existing ones
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true
        });
        // Immediately stop the new stream
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.log("Screen sharing force stop completed or no active streams");
    }
  }, []);
  
  const toggleScreenShare = useCallback(async () => {
    try {
      if (screenSharing) {
        // Stop screen sharing
        console.log("Stopping screen sharing from UI");
        
        // Update ref first
        screenSharingRef.current = false;
        
        // First, stop the screen track if it exists
        if (screenTrack) {
          try {
            // Stop all tracks in the screen stream
            if (screenTrack.getMediaStreamTrack) {
              const mediaStreamTrack = screenTrack.getMediaStreamTrack();
              if (mediaStreamTrack) {
                mediaStreamTrack.stop();
              }
            }
            
            // Also try to close the track using Agora's method
            if (screenTrack.close) {
              screenTrack.close();
            }
          } catch (trackError) {
            console.warn("Error stopping screen track:", trackError);
          }
        }
        
        // Try to force stop screen sharing
        await forceStopScreenSharing();
        
        // Update the state
        setScreenSharing(false);
        setIsScreenSharingLoading(false);
      } else {
        // Start screen sharing
        console.log("Starting screen sharing from UI");
        setIsScreenSharingLoading(true);
        setScreenSharing(true);
        screenSharingRef.current = true;
        // Reset loading state after a short delay
        setTimeout(() => {
          setIsScreenSharingLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Screen sharing toggle failed:", error);
      // Reset state if there's an error
      setScreenSharing(false);
      screenSharingRef.current = false;
      setIsScreenSharingLoading(false);
    }
  }, [screenSharing, screenTrack, forceStopScreenSharing]);

  const clearDeviceError = () => {
    setDeviceError(null);
  };

  const retryDeviceCheck = () => {
    checkDevicePermissions();
  };

  const continueWithoutCamera = () => {
    setDeviceError(null);
    setCamera(false);
    // Force device info to allow microphone-only mode
    if (deviceInfo) {
      setDeviceInfo({
        ...deviceInfo,
        hasCamera: false,
        cameraPermission: 'denied'
      });
    }
  };

  // Test mode functions
  const simulateNoCamera = () => {
    setDeviceError("Camera not available. Video will be disabled.");
    setCamera(false);
    if (deviceInfo) {
      setDeviceInfo({
        ...deviceInfo,
        hasCamera: false,
        cameraPermission: 'denied'
      });
    }
  };

  const simulateNoMicrophone = () => {
    setDeviceError("Microphone not available. Audio will be disabled.");
    setMic(false);
    if (deviceInfo) {
      setDeviceInfo({
        ...deviceInfo,
        hasMicrophone: false,
        microphonePermission: 'denied'
      });
    }
  };

  const simulateNoDevices = () => {
    setDeviceError("No camera or microphone found. Please check your device permissions and try again.");
    setCamera(false);
    setMic(false);
    if (deviceInfo) {
      setDeviceInfo({
        ...deviceInfo,
        hasCamera: false,
        hasMicrophone: false,
        cameraPermission: 'denied',
        microphonePermission: 'denied'
      });
    }
  };

  const resetDevices = () => {
    setDeviceError(null);
    setCamera(true);
    setMic(true);
    checkDevicePermissions();
  };

  return {
    // State
    calling,
    isConnected,
    micOn,
    cameraOn,
    screenSharing,
    isScreenSharingLoading,
    appId,
    channel,
    remoteUsers,
    
    // Device states
    deviceError,
    deviceInfo,
    isCheckingDevices,
    
    // Tracks
    localMicrophoneTrack,
    localCameraTrack,
    screenTrack,
    
    // Actions
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    toggleCall,
    joinChannel,
    clearDeviceError,
    retryDeviceCheck,
    continueWithoutCamera,
    simulateNoCamera,
    simulateNoMicrophone,
    simulateNoDevices,
    resetDevices,
  };
}; 