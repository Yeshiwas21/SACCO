import React, { useState } from "react";
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
  MapPin,
  Calendar
} from "lucide-react";

const Members = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample member data
  const [members, setMembers] = useState([
    {
      id: "MEM001",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dateOfBirth: "1985-05-15",
      nationalId: "1234567890",
      phoneNumber: "+251911223344",
      email: "john.doe@email.com",
      city: "Addis Ababa",
      subcity: "Bole",
      woreda: "08",
      houseNo: "H123",
      membershipDate: "2023-01-15",
      occupation: "Member",
      branchId: "BR001",
      emergencyContactName: "Jane Doe",
      emergencyContactPhone: "+251922334455",
      profilePhoto: null,
      membershipStatus: "Active"
    },
    {
      id: "MEM002",
      firstName: "Mary",
      lastName: "Smith",
      gender: "Female",
      dateOfBirth: "1990-08-22",
      nationalId: "0987654321",
      phoneNumber: "+251944556677",
      email: "mary.smith@email.com",
      city: "Addis Ababa",
      subcity: "Kirkos",
      woreda: "03",
      houseNo: "H456",
      membershipDate: "2023-02-20",
      occupation: "Member",
      branchId: "BR001",
      emergencyContactName: "Robert Smith",
      emergencyContactPhone: "+251955667788",
      profilePhoto: null,
      membershipStatus: "Active"
    }
  ]);

  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    city: "",
    subcity: "",
    woreda: "",
    houseNo: "",
    membershipDate: new Date().toISOString().split('T')[0],
    occupation: "Member",
    branchId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    profilePhoto: null,
    membershipStatus: "Active"
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    const memberId = `MEM${String(members.length + 1).padStart(3, '0')}`;
    const memberToAdd = { ...newMember, id: memberId };
    setMembers([...members, memberToAdd]);
    setNewMember({
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      nationalId: "",
      phoneNumber: "",
      email: "",
      city: "",
      subcity: "",
      woreda: "",
      houseNo: "",
      membershipDate: new Date().toISOString().split('T')[0],
      occupation: "Member",
      branchId: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      profilePhoto: null,
      membershipStatus: "Active"
    });
    setIsAddModalOpen(false);
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter(member => member.id !== memberId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phoneNumber.includes(searchTerm) ||
    member.nationalId.includes(searchTerm)
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Member Management
          </h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-300 font-bold text-black px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add New Member
          </button>
        </header>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, phone, or national ID..."
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

        {/* Members Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-300 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black  uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold  text-black uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold  text-black uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold  text-black uppercase tracking-wider">
                    Emergency Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold  text-black uppercase tracking-wider">
                    Emergency Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold  text-black uppercase tracking-wider">
                    Status
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-bold  text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {member.firstName[0]}{member.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.emergencyContactName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.emergencyContactPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.membershipStatus === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : member.membershipStatus === 'Inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewMember(member)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add Member Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6  bg-amber-300">
                <h3 className="text-lg font-semibold  text-gray-800">Add New Member</h3>
              </div>
              <form onSubmit={handleAddMember} className="p-6"autoComplete="off" >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Personal Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={newMember.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={newMember.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={newMember.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={newMember.dateOfBirth}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        National ID / Passport No *
                      </label>
                      <input
                        type="text"
                        name="nationalId"
                        value={newMember.nationalId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={newMember.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={newMember.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Address Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newMember.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subcity
                        </label>
                        <input
                          type="text"
                          name="subcity"
                          value={newMember.subcity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Woreda
                        </label>
                        <input
                          type="text"
                          name="woreda"
                          value={newMember.woreda}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        House No
                      </label>
                      <input
                        type="text"
                        name="houseNo"
                        value={newMember.houseNo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Occupation
                        </label>
                        <select
                          name="occupation"
                          value={newMember.occupation}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Member">Member</option>
                          <option value="Admin">Admin</option>
                          <option value="Officer">Officer</option>
                          <option value="Accountant">Accountant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Membership Status
                        </label>
                        <select
                          name="membershipStatus"
                          value={newMember.membershipStatus}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Emergency Contact</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={newMember.emergencyContactName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={newMember.emergencyContactPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Membership Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Membership Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Membership Date
                      </label>
                      <input
                        type="date"
                        name="membershipDate"
                        value={newMember.membershipDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch ID
                      </label>
                      <input
                        type="text"
                        name="branchId"
                        value={newMember.branchId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewMember(prev => ({
                          ...prev,
                          profilePhoto: e.target.files[0]
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-black font-bold bg-blue-300 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-300 font-bold text-black rounded-lg hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Member Modal */}
        {isViewModalOpen && selectedMember && (
          <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6  bg-amber-300 border-gray-200">
                <h3 className="text-lg font-semibold  text-gray-800">Member Details</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </h4>
                    <p className="text-gray-600">Member ID: {selectedMember.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 border-b pb-2">Personal Information</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{selectedMember.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-medium">{selectedMember.dateOfBirth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">National ID:</span>
                        <span className="font-medium">{selectedMember.nationalId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 border-b pb-2">Contact Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="font-medium">{selectedMember.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="font-medium">{selectedMember.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 border-b pb-2">Address Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{selectedMember.city}, {selectedMember.subcity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Woreda:</span>
                        <span>{selectedMember.woreda}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">House No:</span>
                        <span>{selectedMember.houseNo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Membership Info */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 border-b pb-2">Membership Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>Joined: {selectedMember.membershipDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Occupation:</span>
                        <span>{selectedMember.occupation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedMember.membershipStatus === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : selectedMember.membershipStatus === 'Inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedMember.membershipStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4 md:col-span-2">
                    <h5 className="font-medium text-gray-700 border-b pb-2">Emergency Contact</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Name</label>
                        <p className="font-medium">{selectedMember.emergencyContactName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <p className="font-medium">{selectedMember.emergencyContactPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
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

export default Members;
