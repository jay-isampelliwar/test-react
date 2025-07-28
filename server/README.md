# Agora Token Generation Server

This Express backend server handles Agora token generation securely on the server side.

## Setup Instructions

1. **Install dependencies:**

   ```bash
   cd server
   npm install
   ```

2. **Configure your Agora credentials:**

   - Edit `config.env` file with your Agora App ID and App Certificate
   - You can find these in your Agora Console

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

## Security Notes

- Never expose your Agora App Certificate in frontend code
- Always generate tokens on the server side
- Consider adding authentication to the token generation endpoint in production

## Troubleshooting

If you get "Buffer is not defined" errors, it means you're trying to generate tokens in the browser. Use this backend server instead.
