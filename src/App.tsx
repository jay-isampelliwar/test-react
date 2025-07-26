import { Route, Routes } from "react-router-dom";

import "./App.css";
import AgoraCall from "./pages/agoraCall";

function App() {
  return (
    <Routes>
      <Route path="/a" element={<div>Home</div>} />
      <Route path="/" element={<AgoraCall />} />
      {/* <Route path="/agora-call" element={<AgoraCall />} /> */}
    </Routes>
  );
}

export default App;
