interface DeviceErrorPopupProps {
  error: string | null;
  isCheckingDevices: boolean;
  onClose: () => void;
  onRetry: () => void;
  onContinueWithoutCamera?: () => void;
  showContinueOption?: boolean;
}

export const DeviceErrorPopup: React.FC<DeviceErrorPopupProps> = ({
  error,
  isCheckingDevices,
  onClose,
  onRetry,
  onContinueWithoutCamera,
  showContinueOption = false,
}) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Device Error
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close device error popup"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-4">{error}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Troubleshooting Tips:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Make sure your camera/microphone is connected and working
              </li>
              <li>
                • Check browser permissions for camera and microphone access
              </li>
              <li>
                • Try refreshing the page and allowing permissions when prompted
              </li>
              <li>
                • Ensure you're using HTTPS or localhost (required for media
                access)
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          {showContinueOption && onContinueWithoutCamera && (
            <button
              onClick={onContinueWithoutCamera}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Continue Without Camera
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onRetry}
            disabled={isCheckingDevices}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              isCheckingDevices
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isCheckingDevices ? (
              <>
                <span className="animate-spin">⏳</span>
                Checking...
              </>
            ) : (
              <>
                <span>🔄</span>
                Retry
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
