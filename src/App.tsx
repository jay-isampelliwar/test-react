import { Route, Routes } from "react-router-dom";

import "./App.css";
import AudioCallApp from "./pages/agoraVoiceCall";

function App() {
  return (
    <Routes>
      <Route path="/a" element={<div>Home</div>} />
      <Route path="/" element={<AudioCallApp />} />
      {/* <Route path="/agora-call" element={<AgoraCall />} /> */}
    </Routes>
  );
}

export default App;
