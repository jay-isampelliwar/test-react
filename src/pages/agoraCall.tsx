import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import Basics from "./basic";

const AgoraCall = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <Basics />
    </AgoraRTCProvider>
  );
};

export default AgoraCall;
