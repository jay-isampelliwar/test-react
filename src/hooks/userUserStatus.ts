import { useState, useCallback } from 'react'

const host = "a61.chat.agora.io";
const org_name = "611374477";
const app_name = "1580634";
const admin_token =
  "007eJxTYOAWENNQOR/fcPkEj+Bx2S+lUnYt6/Q3nxXOnSc74V2KSJQCg6m5oVFSkrmZZVJimomFoYmFuYGlcVJyskGKiZGxmbmxV357RkMgI0PIolAWRgZWBkYGJgYQn4EBAJZzGgw=";

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
