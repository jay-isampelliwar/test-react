import AgoraRTC, { AgoraRTCProvider, useJoin } from "agora-rtc-react";
import { useState } from "react";

export const VoiceCalling = () => {
  const [appId, setAppId] = useState("<-- Insert App ID -->");
  const [channel, setChannel] = useState("<-- Insert Channel Name -->");
  const [token, setToken] = useState("<-- Insert Token -->");
  const [calling, setCalling] = useState(false);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );

  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>{/* <Basics /> */}</AgoraRTCProvider>
  );
};
