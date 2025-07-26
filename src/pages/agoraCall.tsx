import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

const AgoraCall = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <Basics />
    </AgoraRTCProvider>
  );
};

export default AgoraCall;

const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected(); // Store the user's connection status
  const [appId] = useState("5712bb769baf481487093bcc0d423673");
  const [channel] = useState("Test");
  const [token] = useState(
    "007eJxTYPg2K/nAJG2xoKVtM73d8ifJWHIdtVOcUrD92jyXM63rbqUpMJiaGxolJZmbWSYlpplYGJpYmBtYGiclJxukmBgZm5kb65a2ZDQEMjJwuU9iYWSAQBCfhSEktbiEgQEA/UIdmA=="
  );
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎥 Agora Video Call</h1>
        <p style={styles.subtitle}>
          {isConnected ? "Connected to channel" : "Join a video call channel"}
        </p>
      </div>

      {isConnected ? (
        <div style={styles.videoContainer}>
          <div style={styles.localVideoWrapper}>
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={false}
              videoTrack={localCameraTrack}
              style={styles.videoPlayer}
            >
              <div style={styles.videoLabel}>
                <span style={styles.labelText}>You</span>
                {!micOn && <span style={styles.mutedIcon}>🔇</span>}
                {!cameraOn && <span style={styles.mutedIcon}>📷</span>}
              </div>
            </LocalUser>
          </div>

          {remoteUsers.length > 0 && (
            <div style={styles.remoteUsersContainer}>
              <h3 style={styles.remoteUsersTitle}>Remote Participants</h3>
              <div style={styles.remoteUsersGrid}>
                {remoteUsers.map((user) => (
                  <div key={user.uid} style={styles.remoteVideoWrapper}>
                    <RemoteUser user={user} style={styles.videoPlayer}>
                      <div style={styles.videoLabel}>
                        <span style={styles.labelText}>User {user.uid}</span>
                      </div>
                    </RemoteUser>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.formContainer}>
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Join Channel</h2>
            {/* <div style={styles.inputGroup}>
              <label style={styles.label}>App ID</label>
              <input
                style={styles.input}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="Enter your App ID"
                value={appId}
              />
            </div> */}
            {/* <div style={styles.inputGroup}>
              <label style={styles.label}>Channel Name</label>
              <input
                style={styles.input}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="Enter channel name"
                value={channel}
              />
            </div> */}
            {/* <div style={styles.inputGroup}>
              <label style={styles.label}>Token (Optional)</label>
              <input
                style={styles.input}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter token (optional)"
                value={token}
              />
            </div> */}
            <button
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(!appId || !channel ? styles.disabledButton : {}),
              }}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>🚀 Join Channel</span>
            </button>
          </div>
        </div>
      )}

      {isConnected && (
        <div style={styles.controlsContainer}>
          <div style={styles.controlsCard}>
            <h3 style={styles.controlsTitle}>Call Controls</h3>
            <div style={styles.controlsGrid}>
              <button
                style={{
                  ...styles.button,
                  ...styles.controlButton,
                  ...(micOn ? styles.activeButton : styles.inactiveButton),
                }}
                onClick={() => setMic((a) => !a)}
              >
                {micOn ? "🎤 Mute" : "🔇 Unmute"}
              </button>
              <button
                style={{
                  ...styles.button,
                  ...styles.controlButton,
                  ...(cameraOn ? styles.activeButton : styles.inactiveButton),
                }}
                onClick={() => setCamera((a) => !a)}
              >
                {cameraOn ? "📹 Stop Video" : "📷 Start Video"}
              </button>
              <button
                style={{
                  ...styles.button,
                  ...styles.controlButton,
                  ...styles.dangerButton,
                }}
                onClick={() => setCalling((a) => !a)}
              >
                {calling ? "📞 End Call" : "📞 Start Call"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1e293b",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    margin: "0",
  },
  videoContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  localVideoWrapper: {
    marginBottom: "30px",
  },
  videoPlayer: {
    width: "100%",
    height: "400px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  },
  videoLabel: {
    position: "absolute" as const,
    bottom: "20px",
    left: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  labelText: {
    fontWeight: "500",
  },
  mutedIcon: {
    fontSize: "16px",
  },
  remoteUsersContainer: {
    marginTop: "30px",
  },
  remoteUsersTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
  },
  remoteUsersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  remoteVideoWrapper: {
    position: "relative" as const,
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },
  formCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  formTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "30px",
    textAlign: "center" as const,
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box" as const,
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    width: "100%",
    padding: "16px 24px",
    fontSize: "18px",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  controlsContainer: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
  },
  controlsCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px",
  },
  controlsTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  controlsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  controlButton: {
    padding: "14px 20px",
    fontSize: "14px",
    fontWeight: "500",
  },
  activeButton: {
    backgroundColor: "#10b981",
    color: "white",
  },
  inactiveButton: {
    backgroundColor: "#ef4444",
    color: "white",
  },
  dangerButton: {
    backgroundColor: "#ef4444",
    color: "white",
  },
};
