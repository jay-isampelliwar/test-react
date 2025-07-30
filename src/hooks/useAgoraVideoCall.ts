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
import AC, { AgoraChat } from "agora-chat";
import useRegisterUser from "./useRegisterUser";
import useUserStatus from "./userUserStatus";
import { generateToken } from "../utils/tokenGenerator";
import type { ChatMessage } from "../types/chat";

export const useAgoraCall = () => {
  const [calling, setCalling] = useState(false);
  const [appId] = useState(import.meta.env.VITE_AGORA_APP_ID || "5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    import.meta.env.VITE_DEFAULT_CALL_TOKEN || "007eJxTYGhcbf93/4qb8k4LIs2ZV7qXPpHhEdrQldn7frNe9vWzwpMUGEzNDY2SkszNLJMS00wsDE0szA0sjZOSkw1STIyMzcyNV7/tzGgIZGRoyCxiYIRCEJ+FISS1uISBAQA3JR8X"
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

  // Chat states
  const [userId, setUserId] = useState("");
  const [receptor, setReceptor] = useState("");
  const [singleMessage, setSingleMessage] = useState("");
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [isChatLoggedIn, setIsChatLoggedIn] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  // Chat connection ref
  const agoraConn = useRef<AgoraChat.Connection | null>(null);
  const appToken = "611374477#1580634";

  const isConnected = useIsConnected();
  
  // Check device permissions and availability
  const checkDevicePermissions = useCallback(async () => {
    setIsCheckingDevices(true);
    setDeviceError(null);
    
    try {
      // For video calls, check both camera and microphone permissions
      const info = await getDevicePermissions({ checkCamera: true, checkMicrophone: true });
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

  // Chat auto-scroll effect
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Initialize chat connection
  const startChatConnection = useCallback(async () => {
    try {
      agoraConn.current = await new AC.connection({
        appKey: appToken,
      });

      agoraConn.current.addEventHandler("connection&message", {
        onConnected: () => {
          setIsChatConnected(true);
        },
        onDisconnected: () => {
          setIsChatConnected(false);
          setIsChatLoggedIn(false);
        },
        onTextMessage: (message) => {
          if (message.chatType === "singleChat") {
            const newMessage: ChatMessage = {
              id: message.id || Date.now().toString(),
              from: message.from || "Unknown",
              to: message.to || userId || "",
              message: message.msg || "",
              timestamp: new Date(),
              isOwn: false,
            };
            setMessages((prev) => [...prev, newMessage]);
          }
        },
        onTokenWillExpire: () => {
          setChatError("Token is about to expire");
        },
        onTokenExpired: () => {
          setChatError("The token has expired");
        },
        onError: (error) => {
          setChatError("Connection error occurred");
          console.error("Agora connection error:", error);
        },
      });
    } catch (error) {
      setChatError("Failed to initialize connection");
      console.error("Connection initialization error:", error);
    }
  }, [userId]);

  // Initialize chat connection on mount
  useEffect(() => {
    startChatConnection();
    return () => {
      if (agoraConn.current) {
        agoraConn.current.removeEventHandler("connection&message");
      }
    };
  }, [startChatConnection]);

  // Custom hooks for chat
  const { registerUser, status: registerStatus } = useRegisterUser();
  const { getUserStatus } = useUserStatus();

  // Handle user token generation
  const handleUserToken = useCallback(async (): Promise<string> => {
    try {
      const token = await generateToken(userId);
      if (token) {
        return token;
      } else {
        throw new Error("Failed to generate token");
      }
    } catch (error) {
      throw new Error("Token generation failed");
    }
  }, [userId]);

  // Handle user registration
  const handleUserRegistration = useCallback(async (): Promise<boolean> => {
    try {
      await registerUser(userId);
      return registerStatus;
    } catch (error) {
      throw new Error("User registration failed");
    }
  }, [userId, registerUser, registerStatus]);

  // Handle chat login
  const handleChatLogin = useCallback(async () => {
    if (!userId.trim()) {
      setChatError("Please enter a valid user ID");
      return;
    }

    setIsChatLoading(true);
    setChatError(null);

    try {
      // Check if user exists
      const userExistsResult = await getUserStatus(userId);
      
      if (userExistsResult) {
        // User exists, proceed with login
        if (agoraConn.current) {
          const token = await handleUserToken();
          await agoraConn.current.open({
            user: userId,
            accessToken: token,
          });
          setIsChatLoggedIn(true);
        }
      } else {
        // User doesn't exist, register first
        const registrationSuccess = await handleUserRegistration();
        
        if (registrationSuccess && agoraConn.current) {
          const token = await handleUserToken();
          await agoraConn.current.open({
            user: userId,
            accessToken: token,
          });
          setIsChatLoggedIn(true);
        } else {
          throw new Error("User registration failed");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setChatError(errorMessage);
    } finally {
      setIsChatLoading(false);
    }
  }, [userId, getUserStatus, handleUserToken, handleUserRegistration]);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!singleMessage.trim() || !agoraConn.current) return;

    const option: AgoraChat.CreateMsgType = {
      chatType: "singleChat",
      type: "txt",
      to: receptor,
      msg: singleMessage,
    };

    const msg = AC.message.create(option);

    // Add message to local state immediately
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      from: userId,
      to: receptor,
      message: singleMessage,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setSingleMessage("");

    // Send message to server
    agoraConn.current
      .send(msg)
      .then((res) => {
        // Update message with server ID
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, id: res.localMsgId } : msg
          )
        );
      })
      .catch((error) => {
        setChatError("Failed to send message");
        console.error("Send message error:", error);
        // Remove message if sending failed
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      });
  }, [singleMessage, receptor, userId]);

  // Clear chat error
  const clearChatError = useCallback(() => {
    setChatError(null);
  }, []);

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
    
    // Chat states
    userId,
    receptor,
    singleMessage,
    isChatConnected,
    isChatLoggedIn,
    messages,
    isChatLoading,
    chatError,
    showChat,
    
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
    
    // Chat actions
    setUserId,
    setReceptor,
    setSingleMessage,
    handleChatLogin,
    handleSendMessage,
    clearChatError,
    setShowChat,
  };
}; 