import { Route, Routes } from "react-router-dom";

import "./App.css";
import AgoraChatComponent from "./pages/agoraChat";

function App() {
  return (
    <Routes>
      <Route path="/a" element={<div>Home</div>} />
      <Route path="/" element={<AgoraChatComponent />} />
      {/* <Route path="/" element={<Test />} /> */}
      {/* <Route path="/agora-call" element={<AgoraCall />} /> */}
    </Routes>
  );
}

export default App;
