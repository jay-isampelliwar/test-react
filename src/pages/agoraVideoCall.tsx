import AgoraRTC, {
  AgoraRTCProvider,
  RemoteUser,
  LocalUser,
} from "agora-rtc-react";
import { useAgoraCall } from "../hooks/useAgoraVideoCall";
import { JoinScreen, DeviceErrorPopup } from "../components/VideoCall";

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
    screenSharing,
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
          {/* Main video area - side by side for 2 people */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Remote user panel (left side) */}
              <div className="bg-gray-800 rounded-lg relative overflow-hidden">
                {remoteUsers.length > 0 ? (
                  <>
                    <RemoteUser
                      user={remoteUsers[0]}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm">
                      {remoteUsers[0].uid}
                    </div>
                  </>
                ) : (
                  // Placeholder when no remote user
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-16 h-16 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-white text-lg font-medium">
                        Waiting for participant...
                      </div>
                      <div className="text-gray-400 text-sm mt-2">
                        Share the channel name to invite someone
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="absolute w-4 h-0.5 bg-white rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Local user panel (right side) */}
              <div className="bg-gray-800 rounded-lg relative overflow-hidden">
                <LocalUser
                  audioTrack={localMicrophoneTrack}
                  cameraOn={cameraOn}
                  micOn={micOn}
                  playAudio={false}
                  videoTrack={localCameraTrack}
                  className="w-full h-full object-cover"
                />

                {/* {localCameraTrack ? (
                  <div></div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-16 h-16 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-white text-lg font-medium mb-2">
                        {!localCameraTrack
                          ? "No Camera Detected"
                          : "Camera Off"}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {!localCameraTrack
                          ? "Your device doesn't have a camera"
                          : "Click the camera button to turn on"}
                      </div>
                      {!localCameraTrack && (
                        <div className="mt-4 p-3 bg-yellow-900/50 rounded-lg border border-yellow-600/30">
                          <div className="text-yellow-300 text-xs">
                            💡 Tip: You can still join the call with audio only
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )} */}
                <div className="absolute bottom-2 left-2 text-white text-sm">
                  You
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="absolute w-4 h-0.5 bg-white rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom control bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Left side controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleMic}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    micOn ? "bg-white" : "bg-red-500"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      micOn ? "text-gray-800" : "text-white"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {!micOn && (
                    <div className="absolute w-6 h-0.5 bg-white rotate-45"></div>
                  )}
                </button>

                <button
                  onClick={toggleCamera}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    cameraOn ? "bg-white" : "bg-gray-600"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      cameraOn ? "text-gray-800" : "text-white"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </button>

                <button className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-gray-800 font-semibold text-sm">
                    CC
                  </span>
                </button>

                <button className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <button className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </button>

                <button className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  onClick={toggleCall}
                  className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </button>
              </div>

              {/* Right side controls */}
              <div className="flex items-center space-x-4">
                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center relative">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-white text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {remoteUsers.length + 1}
                  </span>
                </button>

                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </button>

                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <JoinScreen appId={appId} channel={channel} onJoin={joinChannel} />
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
