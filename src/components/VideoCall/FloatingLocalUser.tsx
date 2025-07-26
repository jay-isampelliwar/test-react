import { LocalUser } from "agora-rtc-react";

interface FloatingLocalUserProps {
  audioTrack: any;
  videoTrack: any;
  micOn: boolean;
  cameraOn: boolean;
}

export const FloatingLocalUser = ({
  audioTrack,
  videoTrack,
  micOn,
  cameraOn,
}: FloatingLocalUserProps) => {
  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="w-48 h-36 rounded-xl overflow-hidden shadow-2xl border-2 border-white">
        <LocalUser
          audioTrack={audioTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={false}
          videoTrack={videoTrack}
          className="w-full h-full"
        >
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <span className="font-medium">You</span>
            {!micOn && <span className="text-xs">🔇</span>}
            {!cameraOn && <span className="text-xs">📷</span>}
          </div>
        </LocalUser>
      </div>
    </div>
  );
};
