import React from "react";
import {
  Home,
  Users,
  DollarSign,
  CreditCard,
  FileText,
  Repeat,
  Percent,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-auto w-40 bg-gray-700 text-white items-center h2-24 flex flex-col shadow-lg   p-6">
      <br />
      <br />
      {/*<h1 className="text-3xl font-bold text-green-500 mb-12">SACCO System</h1>*/}

      <ul className="flex flex-col gap-6">
        <li className="hover:text-blue-500 cursor-pointer">Dashboard</li>
        <li className="hover:text-blue-500 cursor-pointer">Member</li>
        <li className="hover:text-blue-500 cursor-pointer">Saving</li>
        <li className="hover:text-blue-500 cursor-pointer">Loan</li>
        <li className="hover:text-blue-500 cursor-pointer">Fee</li>
        <li className="hover:text-blue-500 cursor-pointer">Repayment</li>
        <li className="hover:text-blue-500 cursor-pointer">Dividend</li>
      </ul>
    </div>
  );
};

export default Sidebar;
