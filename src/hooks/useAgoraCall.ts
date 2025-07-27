import { useState } from "react";
import {
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useLocalScreenTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";

export const useAgoraCall = () => {
  const [calling, setCalling] = useState(false);
  const [appId] = useState("5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    "007eJxTYEiT5P39J+z0FYvUcCth15L3rQ5CPpxVr759nl21f/+bsDMKDKbmhkZJSeZmlkmJaSYWhiYW5gaWxknJyQYpJkbGZubGD562ZjQEMjJIxOiyMDJAIIjPwhCSWlzCwAAAZTsfkg=="
  );
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const isConnected = useIsConnected();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const { screenTrack } = useLocalScreenTrack(screenSharing, {}, "disable");
  const remoteUsers = useRemoteUsers();

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  
  // Publish tracks including screen track when screen sharing is active
  const tracksToPublish = [localMicrophoneTrack, localCameraTrack];
  if (screenSharing && screenTrack) {
    tracksToPublish.push(screenTrack as any);
  }
  usePublish(tracksToPublish);

  const toggleMic = () => setMic((prev) => !prev);
  const toggleCamera = () => setCamera((prev) => !prev);
  const toggleCall = () => setCalling((prev) => !prev);
  const joinChannel = () => setCalling(true);
  
  const toggleScreenShare = () => {
    setScreenSharing((prev) => !prev);
  };

  return {
    // State
    calling,
    isConnected,
    micOn,
    cameraOn,
    screenSharing,
    appId,
    channel,
    remoteUsers,
    
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
  };
}; 