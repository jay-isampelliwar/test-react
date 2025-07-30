import { Route, Routes } from "react-router-dom";

import "./App.css";

import AgoraCall from "./pages/agoraVideoCall";
import AgoraAudioCall from "./pages/agoraVoiceCall";
import Home from "./pages/homePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/video" element={<AgoraCall />} />
      <Route path="/audio" element={<AgoraAudioCall />} />
    </Routes>
  );
}

export default App;
