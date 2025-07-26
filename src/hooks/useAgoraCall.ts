import { useState } from "react";
import {
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";

export const useAgoraCall = () => {
  const [calling, setCalling] = useState(false);
  const [appId] = useState("5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    "007eJxTYPg2K/nAJG2xoKVtM73d8ifJWHIdtVOcUrD92jyXM63rbqUpMJiaGxolJZmbWSYlpplYGJpYmBtYGiclJxukmBgZm5kb65a2ZDQEMjJwuU9iYWSAQBCfhSEktbiEgQEA/UIdmA=="
  );
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const isConnected = useIsConnected();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const remoteUsers = useRemoteUsers();

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const toggleMic = () => setMic((prev) => !prev);
  const toggleCamera = () => setCamera((prev) => !prev);
  const toggleCall = () => setCalling((prev) => !prev);
  const joinChannel = () => setCalling(true);

  return {
    // State
    calling,
    isConnected,
    micOn,
    cameraOn,
    appId,
    channel,
    remoteUsers,
    
    // Tracks
    localMicrophoneTrack,
    localCameraTrack,
    
    // Actions
    toggleMic,
    toggleCamera,
    toggleCall,
    joinChannel,
  };
}; 