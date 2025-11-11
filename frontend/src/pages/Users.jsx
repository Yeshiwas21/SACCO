import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import saccoLogo from "../assets/sacco-logo.svg";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  UserPlus,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

const Users = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/users/");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();

        const formattedUsers = data.map((u) => ({
          id: u.id,
          firstName: u.first_name || "",
          lastName: u.last_name || "",
          email: u.email,
          phone: u.phone || "-",
          role: u.user_type
            ? u.user_type.charAt(0).toUpperCase() +
              u.user_type.slice(1).replace("_", " ")
            : "Member",
          status: u.is_active ? "Active" : "Inactive",
          dateJoined: u.date_joined
            ? new Date(u.date_joined).toISOString().split("T")[0]
            : "-",
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "Member",
    status: "Active", // default is active
    profile_image: null,
    dateJoined: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("first_name", newUser.firstName);
      formData.append("last_name", newUser.lastName);
      formData.append("phone", newUser.phone);
      formData.append(
        "user_type",
        newUser.role.toLowerCase().replace(" ", "_")
      );
      formData.append("is_active", newUser.status); // send "Active" or "Inactive"

      if (newUser.profile_image) {
        formData.append("profile_image", newUser.profile_image);
      }

      const response = await fetch(
        "http://127.0.0.1:8080/api/users/register/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to register user");

      const data = await response.json();

      const addedUser = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone || "-",
        role: data.user_type
          ? data.user_type.charAt(0).toUpperCase() +
            data.user_type.slice(1).replace("_", " ")
          : "Member",
        status: data.is_active ? "Active" : "Inactive",
        dateJoined: data.date_joined
          ? new Date(data.date_joined).toISOString().split("T")[0]
          : "-",
      };

      setUsers([...users, addedUser]);
      setIsAddModalOpen(false);

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "Member",
        status: "Active",
        profile_image: null,
        dateJoined: new Date().toISOString().split("T")[0],
      });

      alert("✅ User registered successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Registration failed");
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-black text-white flex flex-col shadow-lg">
        <div className="flex items-center justify-center gap-2 mt-6 mb-10">
          <img
            src={saccoLogo}
            alt="SACCO Logo"
            className="w-10 h-10 rounded-full border border-gray-700"
          />
          <h1 className="text-lg font-semibold tracking-wide">SACCO</h1>
        </div>
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-300 font-bold text-black px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add New User
          </button>
        </header>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Users Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-300 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.role}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1 rounded">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add User Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 bg-amber-300">
                <h3 className="text-lg font-semibold text-gray-800">
                  Register New User
                </h3>
              </div>
              <form
                onSubmit={handleAddUser}
                className="p-6 space-y-4"
                encType="multipart/form-data"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={newUser.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={newUser.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                      <option value="Loan Officer">Loan Officer</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Teller">Teller</option>
                      <option value="Auditor">Auditor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={newUser.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-300 text-black font-bold rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View User Modal */}
        {isViewModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 bg-amber-300">
                <h3 className="text-lg font-semibold text-gray-800">
                  User Details
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {selectedUser.firstName[0] || ""}
                      {selectedUser.lastName[0] || ""}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Joined: {selectedUser.dateJoined}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} /> {selectedUser.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} /> {selectedUser.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> Role: {selectedUser.role}
                  </div>
                  <p>
                    Status:{" "}
                    <span className="font-semibold">{selectedUser.status}</span>
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 bg-amber-300 font-bold text-black rounded-lg hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
