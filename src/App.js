import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import StreamerPage from "./pages/StreamerPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<h1>404</h1>} />
      <Route path="/streamer/:id" element={<StreamerPage />} />
    </Routes>
  );
}

export default App;
