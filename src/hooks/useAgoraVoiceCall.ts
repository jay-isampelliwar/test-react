import { useState, useMemo } from "react";
import {
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
} from "agora-rtc-react";


export const useAgoraVoiceCall = () => {
  const [calling, setCalling] = useState(false);
  const [appId] = useState("5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    "007eJxTYEiT5P39J+z0FYvUcCth15L3rQ5CPpxVr759nl21f/+bsDMKDKbmhkZJSeZmlkmJaSYWhiYW5gaWxknJyQYpJkbGZubGD562ZjQEMjJIxOiyMDJAIIjPwhCSWlzCwAAAZTsfkg=="
  );
  const [micOn, setMic] = useState(true);
  const isConnected = useIsConnected();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const remoteUsers = useRemoteUsers();
  
  // Get remote audio tracks
  const remoteAudioTracks = useRemoteAudioTracks(remoteUsers);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  
  // Publish tracks
  const tracksToPublish = [localMicrophoneTrack];
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

  const toggleMic = () => setMic((prev) => !prev);
  const toggleCall = () => setCalling((prev) => !prev);
  const joinChannel = () => setCalling(true);
  

  return {
    // State
    calling,
    isConnected,
    micOn,
    appId,
    channel,
    remoteUsers: remoteUsersWithAudioState,
    
    // Tracks
    localMicrophoneTrack,

    
    // Actions
    toggleMic,
    toggleCall,
    joinChannel,
  };
}; 