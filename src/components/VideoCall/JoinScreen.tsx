interface JoinScreenProps {
  appId: string;
  channel: string;
  onJoin: () => void;
  setReceiver: (receiver: string) => void;
  userId: string;
  receptor: string;
  onUserIdChange: (userId: string) => void;
  onReceptorChange: (receptor: string) => void;
  onChatLogin: () => void;
  isChatLoading: boolean;
}

export const JoinScreen = ({
  appId,
  channel,
  onJoin,
  setReceiver,
  userId,
  receptor,
  onUserIdChange,
  onReceptorChange,
  onChatLogin,
  isChatLoading,
}: JoinScreenProps) => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
          Join Video Call
        </h2>

        {/* Chat Setup Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-slate-700 mb-4">
            Chat Setup
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => onUserIdChange(e.target.value)}
                placeholder="Enter your user ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="receptor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Chat With (Receptor)
              </label>
              <input
                id="receptor"
                type="text"
                value={receptor}
                onChange={(e) => onReceptorChange(e.target.value)}
                placeholder="Enter receptor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={onChatLogin}
              disabled={!userId.trim() || isChatLoading}
              className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                !userId.trim() || isChatLoading
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isChatLoading ? "Connecting..." : "📱 Setup Chat"}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-slate-700 mb-4">
            Video Call
          </h3>
          <button
            className={`w-full py-4 px-6 text-lg font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              !appId || !channel
                ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={!appId || !channel}
            onClick={() => {
              onJoin();
              setReceiver("receiver");
            }}
          >
            <span>🚀 Join Video Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
