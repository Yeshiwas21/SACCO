import React from "react";
import Sidebar from "../components/Sidebar"; // adjust path if needed
import saccoLogo from "../assets/sacco-logo.svg"; // replace with your actual logo file

const MainPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-black text-white flex flex-col shadow-lg">
        {/* Logo / Icon Section */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-10">
          <img
            src={saccoLogo}
            alt="SACCO Logo"
            className="w-10 h-10 rounded-full border border-gray-700"
          />
          <h1 className="text-lg font-semibold tracking-wide">SACCO</h1>
        </div>

        {/* Sidebar Menu */}
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Dashboard Overview
          </h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            + Add New
          </button>
        </header>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <h3 className="text-gray-700 font-semibold mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-green-700">254</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <h3 className="text-gray-700 font-semibold mb-2">Active Loans</h3>
            <p className="text-3xl font-bold text-blue-700">87</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <h3 className="text-gray-700 font-semibold mb-2">Total Savings</h3>
            <p className="text-3xl font-bold text-yellow-600">$120,500</p>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activities
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between text-gray-700 border-b border-gray-100 pb-2">
              <span>Member John Doe applied for a new loan.</span>
              <span className="text-sm text-gray-500">2h ago</span>
            </li>
            <li className="flex justify-between text-gray-700 border-b border-gray-100 pb-2">
              <span>Repayment received from Mary Smith.</span>
              <span className="text-sm text-gray-500">5h ago</span>
            </li>
            <li className="flex justify-between text-gray-700">
              <span>New member registration: Daniel K.</span>
              <span className="text-sm text-gray-500">1d ago</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
