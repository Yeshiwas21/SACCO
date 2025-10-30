import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";
import Members from "./pages/Members";
import Savings from "./pages/Savings";
import Loans from "./pages/Loans";
import Fees from "./pages/Fees";
import Repayments from "./pages/Repayments";
import Dividend from "./pages/Dividend";
import Login from "./pages/Login";
// import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/members" element={<Members />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/repayments" element={<Repayments />} />
        <Route path="/dividend" element={<Dividend />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
