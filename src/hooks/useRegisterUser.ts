import { useState, useCallback } from 'react'

const host = import.meta.env.VITE_AGORA_CHAT_HOST || "a61.chat.agora.io";
const org_name = import.meta.env.VITE_AGORA_CHAT_ORG_NAME || "611374477";
const app_name = import.meta.env.VITE_AGORA_CHAT_APP_NAME || "1580634";
const admin_token = import.meta.env.VITE_AGORA_CHAT_ADMIN_TOKEN || 
  "007eJxTYLCu2bKr6afPBKv4uw8Pc6s/Od5TH/nT6L5ActzvydGzeAQVGEzNDY2SkszNLJMS00wsDE0szA0sjZOSkw1STIyMzcyNX7zpzPjxqzNDU2QWCyMDKwMjAxMDiM/AAAAAaSI1";

const useRegisterUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<boolean>(false);

  const registerUser = useCallback(async (username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError("");
      setStatus(false);
      
      const user = {
        username: username,
        password: username + "123"
      };

      const url = `https://${host}/${org_name}/${app_name}/users`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin_token}`,
        },
        body: JSON.stringify([user]),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User registration response:", data);
      setStatus(true);
      return true;
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
      setStatus(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    registerUser,
    isLoading,
    error,
    status,
  };
};

export default useRegisterUser;