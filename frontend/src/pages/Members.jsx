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
  Calendar,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Save,
  Printer
} from "lucide-react";

// Member Detail View Component
const MemberDetailView = ({ 
  member, 
  onClose, 
  onEdit, 
  onDelete,
  onSave,
  isSidebarOpen,
  setIsSidebarOpen,
  SidebarContent,
  isEditing,
  editedMember,
  onEditChange,
  onPrint
}) => {
  if (!member) return null;

  const currentMember = isEditing ? editedMember : member;

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarContent />
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${!isSidebarOpen ? 'ml-0' : ''}`}>
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition text-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Members</span>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Member Details
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onPrint}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
            >
              <Printer size={16} />
              Print
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={() => onSave(currentMember)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={() => onEdit(null)}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onEdit(member)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
                >
                  <Edit size={16} />
                  Edit Member
                </button>
                <button
                  onClick={() => onDelete(member.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 p-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xl">
                {currentMember.firstName[0]}{currentMember.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {currentMember.firstName} {currentMember.lastName}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">ID: {currentMember.id}</span>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  currentMember.membershipStatus === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : currentMember.membershipStatus === 'Inactive'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentMember.membershipStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Personal Information</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={currentMember.firstName}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="font-medium">{currentMember.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={currentMember.lastName}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="font-medium">{currentMember.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Gender</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={currentMember.gender}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      ) : (
                        <p className="font-medium">{currentMember.gender}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={currentMember.dateOfBirth}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="font-medium">{currentMember.dateOfBirth}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">National ID</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="nationalId"
                          value={currentMember.nationalId}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="font-medium">{currentMember.nationalId}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Occupation</label>
                      {isEditing ? (
                        <select
                          name="occupation"
                          value={currentMember.occupation}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          <option value="Member">Member</option>
                          <option value="Admin">Admin</option>
                          <option value="Officer">Officer</option>
                          <option value="Accountant">Accountant</option>
                        </select>
                      ) : (
                        <p className="font-medium">{currentMember.occupation}</p>
                      )}
                    </div>
                  </div>

                  {/* Member ID and Date Joined */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Member ID</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="memberId"
                          value={currentMember.memberId}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="font-medium">{currentMember.memberId}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date Joined</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="membershipDate"
                          value={currentMember.membershipDate}
                          onChange={onEditChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="font-medium">{currentMember.membershipDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Address Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Contact & Address Information</h4>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={currentMember.phoneNumber}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={currentMember.email}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.email || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-3">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Full Address</label>
                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              name="city"
                              value={currentMember.city}
                              onChange={onEditChange}
                              placeholder="City"
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              name="subcity"
                              value={currentMember.subcity}
                              onChange={onEditChange}
                              placeholder="Subcity"
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        ) : (
                          <p className="font-medium">{currentMember.city}, {currentMember.subcity}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Woreda</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="woreda"
                            value={currentMember.woreda}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.woreda}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">House No</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="houseNo"
                            value={currentMember.houseNo}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.houseNo}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-3 border-t pt-3">
                    <h5 className="font-medium text-gray-700 text-sm">Emergency Contact</h5>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="emergencyContactName"
                              value={currentMember.emergencyContactName}
                              onChange={onEditChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="font-semibold text-gray-800">{currentMember.emergencyContactName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Phone</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="emergencyContactPhone"
                              value={currentMember.emergencyContactPhone}
                              onChange={onEditChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="font-semibold text-blue-600">{currentMember.emergencyContactPhone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Add Member View Component (Drill-down version)
const AddMemberView = ({ 
  onClose, 
  onSave,
  isSidebarOpen,
  setIsSidebarOpen,
  SidebarContent,
  newMember,
  onInputChange
}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarContent />
      <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${!isSidebarOpen ? 'ml-0' : ''}`}>
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition text-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Members</span>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Member Registration Form
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(newMember)}
              className="bg-amber-300 font-bold text-black px-3 py-2 rounded-lg hover:bg-amber-400 transition flex items-center gap-2 text-sm"
            >
              <Save size={16} />
              Register
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 p-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xl">
                {newMember.firstName ? newMember.firstName[0] : 'N'}{newMember.lastName ? newMember.lastName[0] : 'M'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {newMember.firstName || 'New'} {newMember.lastName || 'Member'}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">New Member Registration</span>
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                  Pending
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSave(newMember); }} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Personal Information</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={newMember.firstName}
                        onChange={onInputChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={newMember.lastName}
                        onChange={onInputChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={newMember.gender}
                        onChange={onInputChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={newMember.dateOfBirth}
                        onChange={onInputChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        National ID *
                      </label>
                      <input
                        type="text"
                        name="nationalId"
                        value={newMember.nationalId}
                        onChange={onInputChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Occupation
                      </label>
                      <select
                        name="occupation"
                        value={newMember.occupation}
                        onChange={onInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                        <option value="Officer">Officer</option>
                        <option value="Accountant">Accountant</option>
                      </select>
                    </div>
                  </div>

                  {/* Member ID and Date Joined */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Member ID
                      </label>
                      <input
                        type="text"
                        name="memberId"
                        value={newMember.memberId}
                        onChange={onInputChange}
                        placeholder="e.g., M001"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Date Joined
                      </label>
                      <input
                        type="date"
                        name="membershipDate"
                        value={newMember.membershipDate}
                        onChange={onInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Address Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Contact & Address Information</h4>
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={newMember.phoneNumber}
                          onChange={onInputChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={newMember.email}
                          onChange={onInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-3 border-t pt-3">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Full Address</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="city"
                            value={newMember.city}
                            onChange={onInputChange}
                            placeholder="City"
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            name="subcity"
                            value={newMember.subcity}
                            onChange={onInputChange}
                            placeholder="Subcity"
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Woreda</label>
                        <input
                          type="text"
                          name="woreda"
                          value={newMember.woreda}
                          onChange={onInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">House No</label>
                        <input
                          type="text"
                          name="houseNo"
                          value={newMember.houseNo}
                          onChange={onInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-3 border-t pt-3">
                    <h5 className="font-medium text-gray-700 text-sm">Emergency Contact</h5>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Name</label>
                          <input
                            type="text"
                            name="emergencyContactName"
                            value={newMember.emergencyContactName}
                            onChange={onInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="emergencyContactPhone"
                            value={newMember.emergencyContactPhone}
                            onChange={onInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Membership Status */}
                  <div className="space-y-3 border-t pt-3">
                    <h5 className="font-medium text-gray-700 text-sm">Membership Status</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Status</label>
                          <select
                            name="membershipStatus"
                            value={newMember.membershipStatus}
                            onChange={onInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Profile Photo</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onInputChange({
                              target: {
                                name: 'profilePhoto',
                                value: e.target.files[0]
                              }
                            })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

// Print Component
const MemberPrintView = ({ member, onClose }) => {
  const printDate = new Date().toLocaleDateString();
  const printTime = new Date().toLocaleTimeString();

  return (
    <div className="fixed inset-0 bg-white z-50 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Print Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">MEMBER PROFILE</h1>
            <p className="text-gray-600">Printed on: {printDate} at {printTime}</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Close Print View
          </button>
        </div>

        {/* Print Content */}
        <div className="space-y-6">
          {/* Member Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h2 className="text-xl font-bold">{member.firstName} {member.lastName}</h2>
              <div className="flex gap-4 mt-2 text-sm">
                <span>ID: {member.id}</span>
                <span>Member ID: {member.memberId}</span>
                <span className={`px-2 py-1 rounded-full ${
                  member.membershipStatus === 'Active' ? 'bg-green-100' : 
                  member.membershipStatus === 'Inactive' ? 'bg-gray-100' : 'bg-red-100'
                }`}>
                  {member.membershipStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Print Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Field</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {/* Personal Information */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="border border-gray-300 px-4 py-2 font-bold bg-amber-200">
                    PERSONAL INFORMATION
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Full Name</td>
                  <td className="border border-gray-300 px-4 py-2">{member.firstName} {member.lastName}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Gender</td>
                  <td className="border border-gray-300 px-4 py-2">{member.gender}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Date of Birth</td>
                  <td className="border border-gray-300 px-4 py-2">{member.dateOfBirth}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">National ID</td>
                  <td className="border border-gray-300 px-4 py-2">{member.nationalId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Occupation</td>
                  <td className="border border-gray-300 px-4 py-2">{member.occupation}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Member ID</td>
                  <td className="border border-gray-300 px-4 py-2">{member.memberId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Date Joined</td>
                  <td className="border border-gray-300 px-4 py-2">{member.membershipDate}</td>
                </tr>

                {/* Contact & Address Information */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="border border-gray-300 px-4 py-2 font-bold bg-amber-200">
                    CONTACT & ADDRESS INFORMATION
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Phone Number</td>
                  <td className="border border-gray-300 px-4 py-2">{member.phoneNumber}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Email Address</td>
                  <td className="border border-gray-300 px-4 py-2">{member.email || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">City</td>
                  <td className="border border-gray-300 px-4 py-2">{member.city}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Subcity</td>
                  <td className="border border-gray-300 px-4 py-2">{member.subcity}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Woreda</td>
                  <td className="border border-gray-300 px-4 py-2">{member.woreda}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">House No</td>
                  <td className="border border-gray-300 px-4 py-2">{member.houseNo}</td>
                </tr>

                {/* Emergency Contact */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="border border-gray-300 px-4 py-2 font-bold bg-amber-200">
                    EMERGENCY CONTACT
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Contact Name</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{member.emergencyContactName}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Contact Phone</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{member.emergencyContactPhone}</td>
                </tr>

                {/* Membership Information */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="border border-gray-300 px-4 py-2 font-bold bg-amber-200">
                    MEMBERSHIP INFORMATION
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Membership Status</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded-full ${
                      member.membershipStatus === 'Active' ? 'bg-green-100' : 
                      member.membershipStatus === 'Inactive' ? 'bg-gray-100' : 'bg-red-100'
                    }`}>
                      {member.membershipStatus}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Print Footer */}
          <div className="border-t pt-4 mt-8">
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <p>Generated by SACCO Management System</p>
                <p>This is an official document</p>
              </div>
              <div className="text-right">
                <p>Page 1 of 1</p>
                <p>Confidential</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Members Component
const Members = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentView, setCurrentView] = useState("management"); // "management", "detail", "add"
  const [isPrintView, setIsPrintView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    gender: "",
    occupation: ""
  });
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      memberId: "M001",
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
      memberId: "M002",
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
    memberId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    profilePhoto: null,
    membershipStatus: "Active"
  });

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phoneNumber.includes(searchTerm) ||
      member.nationalId.includes(searchTerm);
    
    const matchesStatus = !filters.status || member.membershipStatus === filters.status;
    const matchesGender = !filters.gender || member.gender === filters.gender;
    const matchesOccupation = !filters.occupation || member.occupation === filters.occupation;

    return matchesSearch && matchesStatus && matchesGender && matchesOccupation;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Drill-down navigation handlers
  const handleViewMember = (member) => {
    setSelectedMember(member);
    setCurrentView("detail");
    setIsEditing(false);
    setEditedMember(null);
  };

  const handleBackToManagement = () => {
    setCurrentView("management");
    setSelectedMember(null);
    setIsEditing(false);
    setEditedMember(null);
    // Reset new member form when going back
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
      memberId: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      profilePhoto: null,
      membershipStatus: "Active"
    });
  };

  const handleAddMemberView = () => {
    setCurrentView("add");
    setSelectedMember(null);
  };

  // Edit member functionality
  const handleEditMember = (member) => {
    setEditedMember({...member});
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveMember = (updatedMember) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setSelectedMember(updatedMember);
    setIsEditing(false);
    setEditedMember(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMember(null);
  };

  // Add Member functionality
  const handleSaveNewMember = (memberData) => {
    const id = `MEM${String(members.length + 1).padStart(3, '0')}`;
    const memberToAdd = { 
      ...memberData, 
      id: id,
      memberId: memberData.memberId || `M${String(members.length + 1).padStart(3, '0')}`
    };
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
      memberId: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      profilePhoto: null,
      membershipStatus: "Active"
    });
    setCurrentView("management");
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Print functionality
  const handlePrint = () => {
    setIsPrintView(true);
  };

  const handleClosePrint = () => {
    setIsPrintView(false);
  };

  // Delete member
  const handleDeleteMember = (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter(member => member.id !== memberId));
      if (currentMembers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      if (currentView === "detail" && selectedMember && selectedMember.id === memberId) {
        setCurrentView("management");
        setSelectedMember(null);
      }
    }
  };

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      gender: "",
      occupation: ""
    });
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["ID", "First Name", "Last Name", "Phone", "Gender", "Status", "Email", "National ID"],
      ...filteredMembers.map(member => [
        member.id,
        member.firstName,
        member.lastName,
        member.phoneNumber,
        member.gender,
        member.membershipStatus,
        member.email,
        member.nationalId
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "members_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Pagination handlers
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const SidebarContent = () => (
    <aside className={`${isSidebarOpen ? 'w-56' : 'w-0'} bg-black text-white flex flex-col shadow-lg transition-all duration-300 overflow-hidden`}>
      <div className="flex items-center justify-center gap-2 mt-6 mb-10 min-w-[224px]">
        <img
          src={saccoLogo}
          alt="SACCO Logo"
          className="w-10 h-10 rounded-full border border-gray-700"
        />
        {isSidebarOpen && <h1 className="text-lg font-semibold tracking-wide">SACCO</h1>}
      </div>
      <Sidebar isCollapsed={!isSidebarOpen} />
    </aside>
  );

  // Render Print View
  if (isPrintView && selectedMember) {
    return <MemberPrintView member={selectedMember} onClose={handleClosePrint} />;
  }

  // Render Add Member View
  if (currentView === "add") {
    return (
      <AddMemberView
        onClose={handleBackToManagement}
        onSave={handleSaveNewMember}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        SidebarContent={SidebarContent}
        newMember={newMember}
        onInputChange={handleInputChange}
      />
    );
  }

  // Render Detail View
  if (currentView === "detail" && selectedMember) {
    return (
      <MemberDetailView
        member={selectedMember}
        onClose={handleBackToManagement}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        onSave={handleSaveMember}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        SidebarContent={SidebarContent}
        isEditing={isEditing}
        editedMember={editedMember}
        onEditChange={handleEditChange}
        onPrint={handlePrint}
      />
    );
  }

  // Render Management View with Full Table
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarContent />
      <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${!isSidebarOpen ? 'ml-0' : ''}`}>
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 transition"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              Member Management
            </h2>
          </div>
          <button 
            onClick={handleAddMemberView}
            className="bg-amber-300 font-bold text-black px-4 py-2 rounded-lg hover:bg-amber-400 transition flex items-center gap-2"
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
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
                Filter
              </button>
              
              {/* Filter Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={filters.gender}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <select
                      value={filters.occupation}
                      onChange={(e) => handleFilterChange('occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Occupation</option>
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                      <option value="Officer">Officer</option>
                      <option value="Accountant">Accountant</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={20} />
              Export
            </button>
          </div>
          
          {/* Active Filters Display */}
          {(filters.status || filters.gender || filters.occupation) && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-gray-600">Active filters:</span>
              {filters.status && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Status: {filters.status}
                </span>
              )}
              {filters.gender && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Gender: {filters.gender}
                </span>
              )}
              {filters.occupation && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  Occupation: {filters.occupation}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Members Table */}

<section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-amber-300 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
            Full Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
            Phone
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
            Gender
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
            Emergency Contact
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
            Emergency Phone
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {currentMembers.map((member) => (
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
                  className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEditMember(member)}
                  className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                  title="Edit Member"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                  title="Delete Member"
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

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} members
            </span>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            {/* First page button */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              title="First page"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Previous page button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`min-w-[2rem] px-2 py-1 text-sm rounded-lg border transition ${
                      currentPage === pageNum
                        ? 'bg-amber-300 border-amber-400 text-black font-semibold'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next page button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>

            {/* Last page button */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              title="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Members;