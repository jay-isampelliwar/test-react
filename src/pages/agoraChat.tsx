import React from "react";
import useAgoraChat from "../hooks/useAgoraChat";
import { LoginScreen, ChatInterface, ErrorPopup } from "../components";

const SimpleAgoraChat: React.FC = () => {
  const {
    // State
    userId,
    receptor,
    singleMessage,
    isConnected,
    isLoggedIn,
    messages,
    isLoading,
    error,

    // Actions
    setUserId,
    setReceptor,
    setSingleMessage,
    handleLogin,
    handleLogout,
    handleSendMessage,
    clearError,
  } = useAgoraChat();

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen
          userId={userId}
          receptor={receptor}
          isLoading={isLoading}
          onUserIdChange={setUserId}
          onReceptorChange={setReceptor}
          onLogin={handleLogin}
        />
        <ErrorPopup error={error} onClose={clearError} />
      </>
    );
  }

  // Show chat interface if logged in
  return (
    <>
      <ChatInterface
        userId={userId}
        receptor={receptor}
        singleMessage={singleMessage}
        isConnected={isConnected}
        messages={messages}
        onMessageChange={setSingleMessage}
        onSendMessage={handleSendMessage}
        onLogout={handleLogout}
      />
      <ErrorPopup error={error} onClose={clearError} />
    </>
  );
};

export default SimpleAgoraChat;
