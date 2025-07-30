import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useAgoraVoiceCall } from "../hooks/useAgoraVoiceCall";
import {
  AudioCallControls,
  AudioUsersGrid,
  DeviceErrorPopup,
} from "../components/VideoCall";

const AgoraCall = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <AudioCallApp />
    </AgoraRTCProvider>
  );
};

export default AgoraCall;

const AudioCallApp = () => {
  const {
    calling,
    isConnected,
    micOn,
    appId,
    channel,
    remoteUsers,
    deviceError,
    isCheckingDevices,
    toggleMic,
    toggleCall,
    joinChannel,
    clearDeviceError,
    retryDeviceCheck,
  } = useAgoraVoiceCall();

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="text-center mb-10 pt-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          🎤 Agora Audio Call
        </h1>
        <p className="text-lg text-slate-600">
          {isConnected
            ? `Connected to channel: ${channel}`
            : "Join an audio call channel"}
        </p>
        {isConnected && (
          <p className="text-sm text-slate-500 mt-2">
            Share channel name "{channel}" with others to join the call
          </p>
        )}
      </div>

      {isConnected ? (
        <div className="w-full h-screen flex flex-col">
          {/* Main content area for audio users */}
          <div className="flex-1 pb-24">
            <AudioUsersGrid
              remoteUsers={remoteUsers}
              localUser={{
                uid: "local",
                hasAudio: micOn,
              }}
            />
          </div>

          {/* Audio call controls */}
          <AudioCallControls
            micOn={micOn}
            calling={calling}
            onToggleMic={toggleMic}
            onToggleCall={toggleCall}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            className={`py-4 px-6 text-lg font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              !appId || !channel
                ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={!appId || !channel}
            onClick={() => {
              joinChannel();
            }}
          >
            <span>🚀 Join Audio Call</span>
          </button>
        </div>
      )}

      {/* Device Error Popup */}
      <DeviceErrorPopup
        error={deviceError}
        isCheckingDevices={isCheckingDevices}
        onClose={clearDeviceError}
        onRetry={retryDeviceCheck}
      />
    </div>
  );
};
