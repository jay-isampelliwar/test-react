# Agora Token Generation Server

This Express backend server handles Agora token generation securely on the server side.

## Setup Instructions

1. **Install dependencies:**

   ```bash
   cd server
   npm install
   ```

2. **Configure your Agora credentials:**

   - Edit the root `.env` file with your Agora App ID and App Certificate
   - You can find these in your Agora Console
   - Copy `.env.example` to `.env` and fill in your values

3. **Start the server:**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

4. **Server will run on:** `http://localhost:3001`

## API Endpoints

### Generate Token

- **URL:** `POST /api/generate-token`
- **Body:** `{ "userAccount": "your_user_id" }`
- **Response:** `{ "success": true, "token": "generated_token", "expireTime": 1234567890 }`

### Health Check

- **URL:** `GET /api/health`
- **Response:** `{ "success": true, "message": "Server is running", "timestamp": "..." }`

## Environment Variables

The server reads configuration from the root `.env` file:

- `VITE_AGORA_APP_ID`: Your Agora App ID
- App Certificate and other settings are hardcoded for simplicity

## Security Notes

- Never expose your Agora App Certificate in frontend code
- Always generate tokens on the server side
- Consider adding authentication to the token generation endpoint in production
- Keep your `.env` file secure and never commit it to version control

## Troubleshooting

If you get "Buffer is not defined" errors, it means you're trying to generate tokens in the browser. Use this backend server instead.
