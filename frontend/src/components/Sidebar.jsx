import React from "react";
import { 
  Home, 
  Users, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Repeat, 
  Percent 
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-screen w-40 bg-gray-700 text-white items-center h2-24 flex flex-col shadow-lg p-6">
      <br />
      <br />
      {/*<h1 className="text-3xl font-bold text-green-500 mb-12">SACCO System</h1>*/}

      <ul className="flex flex-col gap-6">
        <li className="hover:text-green-400 cursor-pointer">Login</li>
        <li className="hover:text-green-400 cursor-pointer">Member</li>
        <li className="hover:text-green-400 cursor-pointer">Saving</li>
        <li className="hover:text-green-400 cursor-pointer">Loan</li>
        <li className="hover:text-green-400 cursor-pointer">Fee</li>
        <li className="hover:text-green-400 cursor-pointer">Repayment</li>
        <li className="hover:text-green-400 cursor-pointer">Dividend</li>
      </ul>
    </div>
  );
};

export default Sidebar;