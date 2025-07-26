interface CallControlsProps {
  micOn: boolean;
  cameraOn: boolean;
  calling: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleCall: () => void;
}

export const CallControls = ({
  micOn,
  cameraOn,
  calling,
  onToggleMic,
  onToggleCamera,
  onToggleCall,
}: CallControlsProps) => {
  return (
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
            onClick={onToggleMic}
          >
            {micOn ? "🎤 Mute" : "🔇 Unmute"}
          </button>
          <button
            className={`py-3 px-5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              cameraOn
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            onClick={onToggleCamera}
          >
            {cameraOn ? "📹 Stop Video" : "📷 Start Video"}
          </button>
          <button
            className="py-3 px-5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
            onClick={onToggleCall}
          >
            {calling ? "📞 End Call" : "📞 Start Call"}
          </button>
        </div>
      </div>
    </div>
  );
};
