import { RemoteUser } from "agora-rtc-react";

interface RemoteUsersGridProps {
  remoteUsers: any[];
}

export const RemoteUsersGrid = ({ remoteUsers }: RemoteUsersGridProps) => {
  if (remoteUsers.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-slate-800 mb-5">
        Remote Participants ({remoteUsers.length})
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative">
            <RemoteUser
              user={user}
              className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg"
            >
              <div className="absolute bottom-5 left-5 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                <span className="font-medium">User {user.uid}</span>
              </div>
            </RemoteUser>
          </div>
        ))}
      </div>
    </div>
  );
};
