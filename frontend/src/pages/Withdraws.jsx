import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import saccoLogo from "../assets/sacco-logo.svg";

const Withdraws = () => {
  // State for withdrawal form
  const [withdrawalData, setWithdrawalData] = useState({
    memberId: "",
    amount: "",
    date: "",
    type: "",
    status: "pending"
  });

  // State for balance
  const [balance, setBalance] = useState(120500); // Initial balance from your original code

  // Withdrawal types
  const withdrawalTypes = [
    "compulsory",
    "voluntary", 
    "Total amount including interest"
  ];

  // Status options
  const statusOptions = [
    "pending",
    "processed",
    "rejected",
    "completed"
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process withdrawal transaction
    processWithdrawal();
  };

  // Process withdrawal and update balance
  const processWithdrawal = () => {
    const withdrawalAmount = parseFloat(withdrawalData.amount) || 0;
    
    if (withdrawalAmount > 0 && withdrawalAmount <= balance) {
      // Update balance (simulating real-time update)
      const newBalance = balance - withdrawalAmount;
      setBalance(newBalance);
      
      // Here you would typically make an API call to update the database
      console.log("Withdrawal processed:", withdrawalData);
      console.log("New balance:", newBalance);
      
      // Reset form
      setWithdrawalData({
        memberId: "",
        amount: "",
        date: "",
        type: "",
        status: "pending"
      });
      
      alert("Withdrawal processed successfully!");
    } else {
      alert("Invalid withdrawal amount or insufficient funds!");
    }
  };

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
            Withdrawal Management
          </h2>
          <div className="flex items-center gap-4">
            {/* Balance Display */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-gray-700 font-semibold mb-2">Available Balance</h3>
              <p className="text-2xl font-bold text-green-700">
                ${balance.toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* Withdrawal Form Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b w-full bg-amber-300 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Withdrawal Form
          </h3>
        </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Member ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Member ID *
              </label>
              <input
                type="text"
                name="memberId"
                value={withdrawalData.memberId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter Member ID"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={withdrawalData.amount}
                onChange={handleInputChange}
                required
                min="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={withdrawalData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                name="type"
                value={withdrawalData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Withdrawal Type</option>
                {withdrawalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={withdrawalData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-amber-300 text-black font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Process Withdrawal
              </button>
            </div>
          </form>
        </section>

        {/* Transaction Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Savings Account Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Previous Balance:</span>
                <span className="font-semibold">$120,500.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Withdrawal Amount:</span>
                <span className="font-semibold text-red-600">
                  -${withdrawalData.amount || "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-gray-800 font-semibold">Current Balance:</span>
                <span className="text-xl font-bold text-green-700">
                  ${balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Withdrawals */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Withdrawals
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-gray-700 border-b border-gray-100 pb-2">
                <div>
                  <span className="font-medium">WD-001</span>
                  <span className="text-sm text-gray-500 ml-2">(Member: MBR-123)</span>
                </div>
                <div className="text-right">
                  <span className="text-red-600 font-semibold">-$500.00</span>
                  <span className="block text-sm text-gray-500">2h ago</span>
                </div>
              </li>
              <li className="flex justify-between text-gray-700 border-b border-gray-100 pb-2">
                <div>
                  <span className="font-medium">WD-002</span>
                  <span className="text-sm text-gray-500 ml-2">(Member: MBR-456)</span>
                </div>
                <div className="text-right">
                  <span className="text-red-600 font-semibold">-$1,200.00</span>
                  <span className="block text-sm text-gray-500">1d ago</span>
                </div>
              </li>
              <li className="flex justify-between text-gray-700">
                <div>
                  <span className="font-medium">WD-003</span>
                  <span className="text-sm text-gray-500 ml-2">(Member: MBR-789)</span>
                </div>
                <div className="text-right">
                  <span className="text-red-600 font-semibold">-$750.00</span>
                  <span className="block text-sm text-gray-500">2d ago</span>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Withdraws;