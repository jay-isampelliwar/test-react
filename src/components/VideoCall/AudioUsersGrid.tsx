import { RemoteUser } from "agora-rtc-react";

interface AudioUsersGridProps {
  remoteUsers: any[];
  localUser?: {
    uid?: string;
    hasAudio?: boolean;
  };
}

export const AudioUsersGrid = ({
  remoteUsers,
  localUser,
}: AudioUsersGridProps) => {
  const allUsers = localUser ? [localUser, ...remoteUsers] : remoteUsers;

  if (allUsers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Waiting for participants...
          </h3>
          <p className="text-gray-600">
            Share the channel name with others to start the audio call
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      {/* Hidden audio tracks for remote users */}
      <div className="hidden">
        {remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-4xl w-full">
        {allUsers.map((user, index) => {
          // Check if user has audio track and if it's enabled
          const hasAudio =
            user.hasAudio || (user.audioTrack && user.audioTrack.enabled);
          const isLocalUser = !user.uid || user.uid === "local";

          return (
            <div key={user.uid || `local-${index}`} className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                  {isLocalUser
                    ? "ME"
                    : user.uid.toString().slice(-2).toUpperCase()}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    hasAudio ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {hasAudio ? (
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
                  ) : (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {isLocalUser ? "You" : `User ${user.uid}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {hasAudio ? "Speaking" : "Muted"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
