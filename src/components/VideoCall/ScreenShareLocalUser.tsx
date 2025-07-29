import { LocalVideoTrack } from "agora-rtc-react";

interface ScreenShareLocalUserProps {
  screenTrack: any;
  screenSharing: boolean;
}

const ScreenShareLocalUser = ({ screenTrack }: ScreenShareLocalUserProps) => {
  // if (!screenSharing) {
  //   return (
  //     <div className="mb-8">
  //       <div className="bg-white p-6 rounded-2xl shadow-lg">
  //         <div className="text-center">
  //           <h3 className="text-xl font-semibold text-slate-800 mb-4">
  //             Screen Sharing
  //           </h3>
  //           <p className="text-slate-600 mb-4">
  //             Share your screen with other participants
  //           </p>
  //           <button
  //             onClick={handleToggleScreenShare}
  //             disabled={isLoading}
  //             className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto ${
  //               isLoading
  //                 ? "bg-gray-400 text-white cursor-not-allowed"
  //                 : "bg-blue-500 text-white hover:bg-blue-600"
  //             }`}
  //           >
  //             {isLoading ? (
  //               <>
  //                 <span className="animate-spin">⏳</span>
  //                 Starting...
  //               </>
  //             ) : (
  //               <>
  //                 <span>🖥️</span>
  //                 Start Screen Share
  //               </>
  //             )}
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full relative">
      {screenTrack && (
        <>
          <LocalVideoTrack
            play
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            track={screenTrack}
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            🖥️ Screen Share
          </div>
        </>
      )}
    </div>
  );
};

export default ScreenShareLocalUser;
