import { Route, Routes } from "react-router-dom";

import "./App.css";
import AgoraCall from "./pages/agoraCall";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AgoraCall />} />
    </Routes>
  );
}

export default App;
