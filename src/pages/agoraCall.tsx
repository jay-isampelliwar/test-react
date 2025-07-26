import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useAgoraCall } from "../hooks/useAgoraCall";
import {
  JoinScreen,
  FloatingLocalUser,
  RemoteUsersGrid,
  CallControls,
} from "../components/VideoCall";

const AgoraCall = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <VideoCallApp />
    </AgoraRTCProvider>
  );
};

export default AgoraCall;

const VideoCallApp = () => {
  const {
    calling,
    isConnected,
    micOn,
    cameraOn,
    appId,
    channel,
    remoteUsers,
    localMicrophoneTrack,
    localCameraTrack,
    toggleMic,
    toggleCamera,
    toggleCall,
    joinChannel,
  } = useAgoraCall();

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="text-center mb-10 pt-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          🎥 Agora Video Call
        </h1>
        <p className="text-lg text-slate-600">
          {isConnected
            ? `Connected to channel: ${channel}`
            : "Join a video call channel"}
        </p>
        {isConnected && (
          <p className="text-sm text-slate-500 mt-2">
            Share channel name "{channel}" with others to join the call
          </p>
        )}
      </div>

      {isConnected ? (
        <div className="w-full px-4">
          {/* Main content area for remote users */}
          <div className="mb-8">
            <RemoteUsersGrid remoteUsers={remoteUsers} />
          </div>

          {/* Floating local user overlay */}
          <FloatingLocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            micOn={micOn}
            cameraOn={cameraOn}
          />

          {/* Call controls */}
          <CallControls
            micOn={micOn}
            cameraOn={cameraOn}
            calling={calling}
            onToggleMic={toggleMic}
            onToggleCamera={toggleCamera}
            onToggleCall={toggleCall}
          />
        </div>
      ) : (
        <JoinScreen appId={appId} channel={channel} onJoin={joinChannel} />
      )}
    </div>
  );
};
