import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
} from "agora-rtc-react";
import { getDevicePermissions, getErrorMessage, type DeviceInfo } from "../utils/deviceUtils";

export const useAgoraVoiceCall = () => {
  const [calling, setCalling] = useState(false);
  const [appId] = useState(import.meta.env.VITE_AGORA_APP_ID || "5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    import.meta.env.VITE_DEFAULT_CALL_TOKEN || "007eJxTYGhcbf93/4qb8k4LIs2ZV7qXPpHhEdrQldn7frNe9vWzwpMUGEzNDY2SkszNLJMS00wsDE0szA0sjZOSkw1STIyMzcyNV7/tzGgIZGRoyCxiYIRCEJ+FISS1uISBAQA3JR8X"
  );
  const [micOn, setMic] = useState(true);
  
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
      // For audio calls, only check microphone permissions
      const info = await getDevicePermissions({ checkCamera: false, checkMicrophone: true });
      setDeviceInfo(info);
      
      // Update device states based on permissions
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
  
  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack(
    micOn && deviceInfo?.microphonePermission !== 'denied' && deviceInfo?.hasMicrophone !== false
  );
  const remoteUsers = useRemoteUsers();
  
  // Get remote audio tracks
  const remoteAudioTracks = useRemoteAudioTracks(remoteUsers);

  // Handle microphone track creation errors
  useEffect(() => {
    if (micError) {
      console.error("Microphone track error:", micError);
      setDeviceError("Failed to access microphone. Please check your device permissions.");
      setMic(false);
    }
  }, [micError]);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  
  // Control microphone track enabled state
  React.useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(micOn);
    }
  }, [localMicrophoneTrack, micOn]);
  
  // Publish tracks
  const tracksToPublish = [localMicrophoneTrack].filter(Boolean);
  usePublish(tracksToPublish);

  // Track audio states for remote users
  const remoteUsersWithAudioState = useMemo(() => {
    return remoteUsers.map(user => {
      const audioTrack = remoteAudioTracks.audioTracks.find(track => track.getUserId() === user.uid);
      
      return {
        ...user,
        hasAudio: audioTrack ? true : false,
        audioTrack
      };
    });
  }, [remoteUsers, remoteAudioTracks.audioTracks]);

  const toggleMic = useCallback(() => {
    if (deviceInfo?.microphonePermission !== 'denied' && deviceInfo?.hasMicrophone !== false) {
      setMic((prev) => !prev);
    }
  }, [deviceInfo]);
  
  const toggleCall = () => setCalling((prev) => !prev);
  const joinChannel = () => setCalling(true);
  
  const clearDeviceError = () => {
    setDeviceError(null);
  };

  const retryDeviceCheck = () => {
    checkDevicePermissions();
  };

  return {
    // State
    calling,
    isConnected,
    micOn,
    appId,
    channel,
    remoteUsers: remoteUsersWithAudioState,
    
    // Device states
    deviceError,
    deviceInfo,
    isCheckingDevices,
    
    // Tracks
    localMicrophoneTrack,

    // Actions
    toggleMic,
    toggleCall,
    joinChannel,
    clearDeviceError,
    retryDeviceCheck,
  };
}; 