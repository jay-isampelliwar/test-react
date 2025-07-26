import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

const AgoraCall = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <Basics />
    </AgoraRTCProvider>
  );
};

export default AgoraCall;

const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId] = useState("5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    "007eJxTYPg2K/nAJG2xoKVtM73d8ifJWHIdtVOcUrD92jyXM63rbqUpMJiaGxolJZmbWSYlpplYGJpYmBtYGiclJxukmBgZm5kb65a2ZDQEMjJwuU9iYWSAQBCfhSEktbiEgQEA/UIdmA=="
  );
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <div className="min-h-screen bg-slate-50 p-5 font-sans">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          🎥 Agora Video Call
        </h1>
        <p className="text-lg text-slate-600">
          {isConnected ? "Connected to channel" : "Join a video call channel"}
        </p>
      </div>

      {isConnected ? (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={false}
              videoTrack={localCameraTrack}
              className="w-full h-96 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="absolute bottom-5 left-5 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <span className="font-medium">You</span>
                {!micOn && <span className="text-base">🔇</span>}
                {!cameraOn && <span className="text-base">📷</span>}
              </div>
            </LocalUser>
          </div>

          {remoteUsers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-5">
                Remote Participants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {remoteUsers.map((user) => (
                  <div key={user.uid} className="relative">
                    <RemoteUser
                      user={user}
                      className="w-full h-96 rounded-xl overflow-hidden shadow-lg"
                    >
                      <div className="absolute bottom-5 left-5 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                        <span className="font-medium">User {user.uid}</span>
                      </div>
                    </RemoteUser>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
              Join Channel
            </h2>
            <button
              className={`w-full py-4 px-6 text-lg font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                !appId || !channel
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>🚀 Join Channel</span>
            </button>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="mt-10 flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-slate-800 mb-5 text-center">
              Call Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                className={`py-3 px-5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  micOn
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                onClick={() => setMic((a) => !a)}
              >
                {micOn ? "🎤 Mute" : "🔇 Unmute"}
              </button>
              <button
                className={`py-3 px-5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  cameraOn
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                onClick={() => setCamera((a) => !a)}
              >
                {cameraOn ? "📹 Stop Video" : "📷 Start Video"}
              </button>
              <button
                className="py-3 px-5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
                onClick={() => setCalling((a) => !a)}
              >
                {calling ? "📞 End Call" : "📞 Start Call"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
