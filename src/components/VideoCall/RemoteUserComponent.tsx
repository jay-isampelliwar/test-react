import { RemoteUser } from "agora-rtc-react";

interface RemoteUserComponentProps {
  remoteUsers: any[];
}

const RemoteUserComponent = ({ remoteUsers }: RemoteUserComponentProps) => {
  return (
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
  );
};

export default RemoteUserComponent;
