import { LocalUser } from "agora-rtc-react";

interface LocalUserComponentProps {
  localMicrophoneTrack: any;
  localCameraTrack: any;
  cameraOn: boolean;
  micOn: boolean;
}

const LocalUserComponent = ({
  localMicrophoneTrack,
  localCameraTrack,
  cameraOn,
  micOn,
}: LocalUserComponentProps) => {
  return (
    <div className="bg-gray-800 rounded-lg relative overflow-hidden">
      <LocalUser
        audioTrack={localMicrophoneTrack}
        cameraOn={cameraOn}
        micOn={micOn}
        playAudio={false}
        videoTrack={localCameraTrack}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 text-white text-sm">You</div>
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
  );
};

export default LocalUserComponent;
