import { useRef, useState, useCallback, useEffect } from "react";
import AC, { AgoraChat } from "agora-chat";
import useRegisterUser from "./useRegisterUser";
import useUserStatus from "./userUserStatus";
import { generateToken } from "../utils/tokenGenerator";
import type { ChatMessage } from "../types/chat";

interface UseAgoraChatReturn {
  // State
  userId: string;
  receptor: string;
  singleMessage: string;
  isConnected: boolean;
  isLoggedIn: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUserId: (userId: string) => void;
  setReceptor: (receptor: string) => void;
  setSingleMessage: (message: string) => void;
  handleLogin: () => Promise<void>;
  handleLogout: () => void;
  handleSendMessage: () => void;
  clearError: () => void;
}

const useAgoraChat = (): UseAgoraChatReturn => {
  const agoraConn = useRef<AgoraChat.Connection | null>(null);
  const appToken = "611374477#1580634";

  // State
  const [userId, setUserId] = useState("");
  const [receptor, setReceptor] = useState<string>("Yoyo");
  const [singleMessage, setSingleMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks
  const { registerUser, status: registerStatus } = useRegisterUser();
  const { getUserStatus, userExists } = useUserStatus();

  // Auto-scroll effect
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Initialize connection
  const startConnection = useCallback(async () => {
    try {
      agoraConn.current = await new AC.connection({
        appKey: appToken,
      });

      agoraConn.current.addEventHandler("connection&message", {
        onConnected: () => {
          setIsConnected(true);
        },
        onDisconnected: () => {
          setIsConnected(false);
          setIsLoggedIn(false);
        },
        onTextMessage: (message) => {
          if (message.chatType === "singleChat") {
            const newMessage: ChatMessage = {
              id: message.id || Date.now().toString(),
              from: message.from || "Unknown",
              to: message.to || userId || "",
              message: message.msg || "",
              timestamp: new Date(),
              isOwn: false,
            };
            setMessages((prev) => [...prev, newMessage]);
          }
        },
        onTokenWillExpire: () => {
          setError("Token is about to expire");
        },
        onTokenExpired: () => {
          setError("The token has expired");
        },
        onError: (error) => {
          setError("Connection error occurred");
          console.error("Agora connection error:", error);
        },
      });
    } catch (error) {
      setError("Failed to initialize connection");
      console.error("Connection initialization error:", error);
    }
  }, [userId]);

  // Initialize connection on mount
  useEffect(() => {
    startConnection();
    return () => {
      if (agoraConn.current) {
        agoraConn.current.removeEventHandler("connection&message");
      }
    };
  }, [startConnection]);

  // Handle user token generation
  const handleUserToken = useCallback(async (): Promise<string> => {
    try {
      const token = await generateToken(userId);
      if (token) {
        return token;
      } else {
        throw new Error("Failed to generate token");
      }
    } catch (error) {
      throw new Error("Token generation failed");
    }
  }, [userId]);

  // Handle user registration
  const handleUserRegistration = useCallback(async (): Promise<boolean> => {
    try {
      await registerUser(userId);
      return registerStatus;
    } catch (error) {
      throw new Error("User registration failed");
    }
  }, [userId, registerUser, registerStatus]);

  // Main login handler
  const handleLogin = useCallback(async () => {
    if (!userId.trim()) {
      setError("Please enter a valid user ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if user exists - get the result directly
      const userExistsResult = await getUserStatus(userId);
      
      if (userExistsResult) {
        // User exists, proceed with login
        if (agoraConn.current) {
          const token = await handleUserToken();
          await agoraConn.current.open({
            user: userId,
            accessToken: token,
          });
          setIsLoggedIn(true);
        }
      } else {
        // User doesn't exist, register first
        const registrationSuccess = await handleUserRegistration();
        
        if (registrationSuccess && agoraConn.current) {
          const token = await handleUserToken();
          await agoraConn.current.open({
            user: userId,
            accessToken: token,
          });
          setIsLoggedIn(true);
        } else {
          throw new Error("User registration failed");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, getUserStatus, handleUserToken, handleUserRegistration]);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (agoraConn.current) {
      agoraConn.current.close();
    }
    setIsLoggedIn(false);
    setUserId("");
    setReceptor("");
    setSingleMessage("");
    setMessages([]);
    setError(null);
  }, []);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!singleMessage.trim() || !agoraConn.current) return;

    const option: AgoraChat.CreateMsgType = {
      chatType: "singleChat",
      type: "txt",
      to: receptor,
      msg: singleMessage,
    };

    const msg = AC.message.create(option);

    // Add message to local state immediately
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      from: userId,
      to: receptor,
      message: singleMessage,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setSingleMessage("");

    // Send message to server
    agoraConn.current
      .send(msg)
      .then((res) => {
        // Update message with server ID
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, id: res.localMsgId } : msg
          )
        );
      })
      .catch((error) => {
        setError("Failed to send message");
        console.error("Send message error:", error);
        // Remove message if sending failed
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      });
  }, [singleMessage, receptor, userId]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
};

export default useAgoraChat; 