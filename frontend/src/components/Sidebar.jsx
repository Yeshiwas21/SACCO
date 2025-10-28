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
    <ul className="flex flex-col gap-6 px-6">
      {menuItems.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-3 cursor-pointer hover:text-green-400 transition duration-300"
        >
          {item.icon}
          <span className="text-sm font-medium">{item.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
