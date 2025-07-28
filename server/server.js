const express = require('express');
const cors = require('cors');
const { ChatTokenBuilder } = require('agora-token');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables from config file
const configPath = path.join(__dirname, 'config.env');
const configContent = fs.readFileSync(configPath, 'utf8');
const config = {};

configContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    config[key.trim()] = value.trim();
  }
});

// Agora configuration
const appID = config.AGORA_APP_ID;
const appCertificate = config.AGORA_APP_CERTIFICATE;
const expireTimeInSeconds = parseInt(config.AGORA_TOKEN_EXPIRE_TIME) || 3600;

// Token generation endpoint
app.post('/api/generate-token', (req, res) => {
  try {
    const { userAccount } = req.body;

    if (!userAccount) {
      return res.status(400).json({
        success: false,
        error: 'userAccount is required'
      });
    }

    // Set the privilege expiry
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

    console.log( userAccount);
    
    // Generate Chat User Token
    const token = ChatTokenBuilder.buildUserToken(appID, appCertificate, userAccount, privilegeExpiredTs);


    res.json({
      success: true,
      token,
      expireTime: privilegeExpiredTs
    });

  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate token'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Agora Token Server running on port ${PORT}`);
  console.log(`📡 Token generation endpoint: http://localhost:${PORT}/api/generate-token`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
}); 