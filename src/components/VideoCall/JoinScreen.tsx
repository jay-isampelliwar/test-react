interface JoinScreenProps {
  appId: string;
  channel: string;
  onJoin: () => void;
}

export const JoinScreen = ({ appId, channel, onJoin }: JoinScreenProps) => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
          Join Channel
        </h2>
        <button
          className={`w-full py-4 px-6 text-lg font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            !appId || !channel
              ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={!appId || !channel}
          onClick={onJoin}
        >
          <span>🚀 Join Channel</span>
        </button>
      </div>
    </div>
  );
};
