import { useState, useCallback } from 'react'

const host = "a61.chat.agora.io";
const org_name = "611374477";
const app_name = "1580634";
const admin_token =
  "007eJxTYPgTsiomb+7Vlx18mY+K1s7I/W/TFJ38ifnYXcGDrsaZ+2wVGEzNDY2SkszNLJMS00wsDE0szA0sjZOSkw1STIyMzcyNPx7tyGgIZGRQ2f2MgZGBFYiZGEB8BgYABoEfcQ==";

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