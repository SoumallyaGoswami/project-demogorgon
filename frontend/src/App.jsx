import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Lobby from "./pages/Lobby";
import RoleReveal from "./pages/RoleReveal";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Lobby />} />

        <Route path="/role" element={<RoleReveal />} />

        <Route path="/game" element={<Game />} />

      </Routes>
    </Router>
  );
}

export default App;