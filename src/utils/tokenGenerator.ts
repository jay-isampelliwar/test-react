// Token generation using backend API
const API_BASE_URL = 'https://f4c3c6601330.ngrok-free.app/api';

export async function generateToken(userAccount: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAccount }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.token;
    } else {
      console.error('Token generation failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}
