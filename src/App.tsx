import { Route, Routes } from "react-router-dom";

import "./App.css";
import AgoraCall from "./pages/agoraVideoCall";

function App() {
  return (
    <Routes>
      <Route path="/a" element={<div>Home</div>} />
      {/* <Route path="/" element={<AgoraChatComponent />} /> */}
      <Route path="/" element={<AgoraCall />} />
    </Routes>
  );
}

export default App;
