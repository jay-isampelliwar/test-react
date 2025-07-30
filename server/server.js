const express = require('express');
const cors = require('cors');
const  { ChatTokenBuilder, RtcTokenBuilder, RtcRole } = require('agora-token');
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

// Endpoint 2: Channel Token (group/chat room)
app.get("/api/token/channel", (req, res) => {
  try {
    const { channel, id, type = 1 } = req.query;

    if (!channel || !id) {
      return res.status(400).json({
        success: false,
        error: 'channel and id parameters are required'
      });
    }

    // Set the privilege expiry
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

    console.log(`Generating channel token for channel: ${channel}, id: ${id}, type: ${type}`);

    // Generate RTC Token for channel
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channel,
      id,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    return res.json({
      token,
    });

  } catch (error) {
    console.error('Channel token generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate channel token'
    });
  }
});

// Endpoint 3: Guest Token (random user)
app.get("/api/token/guest", (req, res) => {
  try {
    const { projectId, type = 'app' } = req.query;


    // Set the privilege expiry
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

    console.log(`Generating guest token for projectId: ${projectId}, type: ${type}`);

    // Generate Chat App Token (for app-level operations)
    const token = ChatTokenBuilder.buildAppToken(
      appID,
      appCertificate,
      privilegeExpiredTs
    );

    return res.json({
      success: true,
      token,
      projectId,
      type,
      expireTime: privilegeExpiredTs
    });

  } catch (err) {
    console.error('Guest token generation error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
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