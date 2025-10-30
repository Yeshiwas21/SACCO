import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  DollarSign,
  CreditCard,
  FileText,
  Repeat,
  Percent,
  LogOut,
  ArrowLeftRight
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/main" },
    { label: "Member", icon: <Users size={20} />, path: "/members" },
    { label: "Saving", icon: <DollarSign size={20} />, path: "/savings" },
    { label: "Transaction", icon: <ArrowLeftRight size={20} />, path: "/withdraws" },
    { label: "Loan", icon: <CreditCard size={20} />, path: "/loans" },
    { label: "Fee", icon: <FileText size={20} />, path: "/fees" },
    { label: "Repayment", icon: <Repeat size={20} />, path: "/repayments" },
    { label: "Dividend", icon: <Percent size={20} />, path: "/dividend" },
    { label: "Logout", icon: <LogOut size={20} /> },
  ];

  return (
    <ul className="flex flex-col bg-gray-900 text-white gap-6 px-6 py-8 min-h-screen">
      {menuItems.map((item) => (
        <li key={item.label}>
          <Link
            to={item.path}
            className="flex items-center gap-3 cursor-pointer hover:text-yellow-400 transition-all duration-300"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
