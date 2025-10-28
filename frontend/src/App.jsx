import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";
import Members from "./pages/Members";
// import Loans from "./pages/Loans";
// import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Includes Navbar */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/members" element={<Members />} />
        {/* <Route path="/loans" element={<Loans />} />
        <Route path="/reports" element={<Reports />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
