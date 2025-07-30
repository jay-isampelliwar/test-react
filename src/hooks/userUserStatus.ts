import { useState, useCallback } from 'react'

const host = "a61.chat.agora.io";
const org_name = "611374477";
const app_name = "1580634";
const admin_token =
  "007eJxTYLCu2bKr6afPBKv4uw8Pc6s/Od5TH/nT6L5ActzvydGzeAQVGEzNDY2SkszNLJMS00wsDE0szA0sjZOSkw1STIyMzcyNX7zpzPjxqzNDU2QWCyMDKwMjAxMDiM/AAAAAaSI1";

const useUserStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState<boolean>(false);

  const getUserStatus = useCallback(async (username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setUserExists(false);
      
      const url = `https://${host}/${org_name}/${app_name}/users/${username}/status`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${admin_token}`,
        },
      });
      
      const exists = response.status === 200;
      setUserExists(exists);
      return exists;
    } catch (error) {
      console.error("Error during user status:", error);
      setUserExists(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getUserStatus,
    isLoading,
    userExists,
  };
};

export default useUserStatus;
