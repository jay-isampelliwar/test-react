import { useState } from "react";
import { LocalVideoTrack } from "agora-rtc-react";

interface ScreenShareLocalUserProps {
  screenTrack: any;
  screenSharing: boolean;
  onToggleScreenShare: () => void;
}

const ScreenShareLocalUser = ({
  screenTrack,
  screenSharing,
  onToggleScreenShare,
}: ScreenShareLocalUserProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleScreenShare = async () => {
    setIsLoading(true);
    try {
      await onToggleScreenShare();
    } catch (error) {
      console.error("Screen share toggle failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!screenSharing) {
    return (
      <div className="mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Screen Sharing
            </h3>
            <p className="text-slate-600 mb-4">
              Share your screen with other participants
            </p>
            <button
              onClick={handleToggleScreenShare}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Starting...
                </>
              ) : (
                <>
                  <span>🖥️</span>
                  Start Screen Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {/* <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-800">
            Screen Sharing Active
          </h3>
          <button
            onClick={handleToggleScreenShare}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Stopping...
              </>
            ) : (
              <>
                <span>⏹️</span>
                Stop Sharing
              </>
            )}
          </button>
        </div> */}

        {screenTrack && (
          <div className="relative">
            <LocalVideoTrack
              play
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "12px",
                objectFit: "contain",
              }}
              track={screenTrack}
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
              🖥️ Screen Share
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenShareLocalUser;
