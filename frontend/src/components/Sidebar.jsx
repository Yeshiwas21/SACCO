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
  // Define menu items with labels and matching icons
  const menuItems = [
    { label: "Dashboard", icon: <Home size={20} /> },
    { label: "Member", icon: <Users size={20} /> },
    { label: "Saving", icon: <DollarSign size={20} /> },
    { label: "Loan", icon: <CreditCard size={20} /> },
    { label: "Fee", icon: <FileText size={20} /> },
    { label: "Repayment", icon: <Repeat size={20} /> },
    { label: "Dividend", icon: <Percent size={20} /> },
  ];

  return (
    <div className="h-screen w-48 bg-black text-white flex flex-col shadow-lg p-6">
      {/* Sidebar title (optional) */}
      {/* <h1 className="text-2xl font-bold text-blue-400 mb-10">SACCO</h1> */}

      {/* Added top margin here */}
      <ul className="flex flex-col gap-6 mt-20">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 cursor-pointer hover:text-blue-500 transition duration-300"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
