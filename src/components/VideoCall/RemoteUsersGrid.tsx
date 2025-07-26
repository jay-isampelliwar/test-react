import { RemoteUser } from "agora-rtc-react";

interface RemoteUsersGridProps {
  remoteUsers: any[];
}

export const RemoteUsersGrid = ({ remoteUsers }: RemoteUsersGridProps) => {
  if (remoteUsers.length === 0) {
    return (
      <div className="mt-8 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Waiting for other participants...
          </h3>
          <p className="text-slate-600">
            Share this channel name with others to start the video call
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {remoteUsers.map((user) => {
        return (
          <div key={user.uid} className="relative">
            <RemoteUser
              user={user}
              style={{ width: "100%", height: "70vh" }}
            ></RemoteUser>
          </div>
        );
      })}
    </div>
  );
};
