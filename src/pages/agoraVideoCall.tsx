import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useAgoraCall } from "../hooks/useAgoraVideoCall";
import {
  JoinScreen,
  DeviceErrorPopup,
  RemoteUserComponent,
  LocalUserComponent,
} from "../components/VideoCall";
import { useState } from "react";
import ScreenShareLocalUser from "../components/VideoCall/ScreenShareLocalUser";

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
  const [receiver, setReceiver] = useState<string>("");

  const {
    calling,
    isConnected,
    micOn,
    cameraOn,
    screenSharing,
    isScreenSharingLoading,
    appId,
    channel,
    remoteUsers,
    localMicrophoneTrack,
    localCameraTrack,
    screenTrack,
    deviceError,
    isCheckingDevices,
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
  } = useAgoraCall();

  return (
    <div className="min-h-screen bg-gray-900 w-full relative">
      {isConnected ? (
        <div className="w-full h-screen flex flex-col">
          {/* Main video area */}
          <div className="flex-1 p-4">
            {screenSharing && screenTrack ? (
              // Screen sharing layout - main screen with participant panels on the side
              <div className="h-full flex gap-4">
                {/* Main screen share area (left side - takes most space) */}
                <div className="flex-1 bg-gray-800 rounded-lg relative overflow-hidden">
                  <ScreenShareLocalUser
                    screenSharing={screenSharing}
                    screenTrack={screenTrack}
                  />
                </div>

                {/* Participant panels (right side - smaller) */}
                <div className="w-80 flex flex-col gap-4">
                  {/* Remote user panel */}
                  <div className="flex-1 bg-gray-800 rounded-lg relative overflow-hidden">
                    <RemoteUserComponent remoteUsers={remoteUsers} />
                  </div>

                  {/* Local user panel */}
                  <div className="flex-1 bg-gray-800 rounded-lg relative overflow-hidden">
                    <LocalUserComponent
                      localMicrophoneTrack={localMicrophoneTrack}
                      localCameraTrack={localCameraTrack}
                      cameraOn={cameraOn}
                      micOn={micOn}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Normal video call layout - side by side for 2 people
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Remote user panel (left side) */}
                <RemoteUserComponent remoteUsers={remoteUsers} />

                {/* Local user panel (right side) */}
                <LocalUserComponent
                  localMicrophoneTrack={localMicrophoneTrack}
                  localCameraTrack={localCameraTrack}
                  cameraOn={cameraOn}
                  micOn={micOn}
                />
              </div>
            )}
          </div>

          {/* Bottom control bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Left side controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleMic}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors text-xl ${
                    micOn ? "bg-white" : "bg-red-500"
                  }`}
                >
                  {micOn ? "🎤" : "🔇"}
                </button>

                <button
                  onClick={toggleCamera}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors text-xl ${
                    cameraOn ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  {cameraOn ? "📹" : "📷"}
                </button>

                <button
                  onClick={toggleCall}
                  className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors text-xl"
                >
                  📞
                </button>

                <button
                  onClick={toggleScreenShare}
                  disabled={isScreenSharingLoading}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors text-xl ${
                    isScreenSharingLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : screenSharing
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  title={
                    isScreenSharingLoading
                      ? "Starting Screen Share..."
                      : screenSharing
                      ? "Stop Screen Sharing"
                      : "Start Screen Sharing"
                  }
                >
                  {isScreenSharingLoading ? "⏳" : screenSharing ? "⏹️" : "🖥️"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <JoinScreen
          appId={appId}
          channel={channel}
          onJoin={joinChannel}
          setReceiver={setReceiver}
        />
      )}

      {/* Device Error Popup */}
      <DeviceErrorPopup
        error={deviceError}
        isCheckingDevices={isCheckingDevices}
        onClose={clearDeviceError}
        onRetry={retryDeviceCheck}
        onContinueWithoutCamera={continueWithoutCamera}
        showContinueOption={
          deviceError?.includes("Camera") || deviceError?.includes("camera")
        }
      />
    </div>
  );
};
