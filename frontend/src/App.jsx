import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Navbar />
        <h1 className="text-2xl font-bold text-white text-center">
  Welcome to SACCO System
</h1>

      </main>
    </div>
  );
}

export default App;

