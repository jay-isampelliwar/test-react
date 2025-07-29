interface TestModeToggleProps {
  onSimulateNoCamera: () => void;
  onSimulateNoMicrophone: () => void;
  onSimulateNoDevices: () => void;
  onResetDevices: () => void;
}

export const TestModeToggle: React.FC<TestModeToggleProps> = ({
  onSimulateNoCamera,
  onSimulateNoMicrophone,
  onSimulateNoDevices,
  onResetDevices,
}) => {
  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-40">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">🧪 Test Mode</h4>
      <div className="space-y-2">
        <button
          onClick={onSimulateNoCamera}
          className="w-full px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
        >
          Simulate No Camera
        </button>
        <button
          onClick={onSimulateNoMicrophone}
          className="w-full px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
        >
          Simulate No Microphone
        </button>
        <button
          onClick={onSimulateNoDevices}
          className="w-full px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Simulate No Devices
        </button>
        <button
          onClick={onResetDevices}
          className="w-full px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
        >
          Reset Devices
        </button>
      </div>
    </div>
  );
};
