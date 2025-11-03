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
  Printer,
  Loader,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

// Updated API Configuration without authentication
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to handle API calls
const handleApiCall = async (url, options = {}) => {
  try {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

const memberAPI = {
  // Get all members with pagination and filters
  getMembers: async (page = 1, pageSize = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    // Add non-empty filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'undefined') {
        params.append(key, value);
      }
    });
    
    return handleApiCall(`${API_BASE_URL}/members/members/?${params}`);
  },

  // Test API connection
  testConnection: async () => {
    return handleApiCall(`${API_BASE_URL}/members/members/test/`);
  },

  // Get single member
  getMember: async (memberId) => {
    return handleApiCall(`${API_BASE_URL}/members/members/${memberId}/`);
  },

  // Create member
  createMember: async (memberData) => {
    return handleApiCall(`${API_BASE_URL}/members/members/`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  // Update member
  updateMember: async (memberId, memberData) => {
    return handleApiCall(`${API_BASE_URL}/members/members/${memberId}/`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  // Delete member
  deleteMember: async (memberId) => {
    return handleApiCall(`${API_BASE_URL}/members/members/${memberId}/`, {
      method: 'DELETE',
    });
  },

  // Export members
  exportMembers: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'undefined') {
        params.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE_URL}/members/members/export/?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to export members');
    }
    
    return response.blob();
  },
};
// Notification Component
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 
                 type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                 'bg-blue-100 border-blue-400 text-blue-700';

  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 border-l-4 p-4 rounded-lg shadow-lg ${bgColor} max-w-md`}>
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = ({ size = 24 }) => (
  <div className="flex justify-center items-center">
    <Loader size={size} className="animate-spin text-amber-500" />
  </div>
);

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
  onPrint,
  isLoading,
  isSaving
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
                  disabled={isSaving}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => onEdit(null)}
                  disabled={isSaving}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50"
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
                  onClick={() => onDelete(member.member_id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}
          </div>
        </header>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <LoadingSpinner size={48} />
            <p className="text-center mt-4 text-gray-600">Loading member details...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 p-6 border-b border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xl">
                  {currentMember.first_name[0]}{currentMember.last_name[0]}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {currentMember.first_name} {currentMember.last_name}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">ID: {currentMember.member_id}</span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    currentMember.membership_status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : currentMember.membership_status === 'Inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentMember.membership_status}
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
                            name="first_name"
                            value={currentMember.first_name}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.first_name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="last_name"
                            value={currentMember.last_name}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.last_name}</p>
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
                            name="date_of_birth"
                            value={currentMember.date_of_birth}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.date_of_birth}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">National ID</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="national_id"
                            value={currentMember.national_id}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.national_id}</p>
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
                        <p className="font-medium">{currentMember.member_id}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Date Joined</label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="membership_date"
                            value={currentMember.membership_date}
                            onChange={onEditChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="font-medium">{currentMember.membership_date}</p>
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
                              name="phone_number"
                              value={currentMember.phone_number}
                              onChange={onEditChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="font-medium">{currentMember.phone_number}</p>
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
                              value={currentMember.email || ''}
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
                              name="house_no"
                              value={currentMember.house_no}
                              onChange={onEditChange}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          ) : (
                            <p className="font-medium">{currentMember.house_no}</p>
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
                                name="emergency_contact_name"
                                value={currentMember.emergency_contact_name}
                                onChange={onEditChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              />
                            ) : (
                              <p className="font-semibold text-gray-800">{currentMember.emergency_contact_name}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Phone</label>
                            {isEditing ? (
                              <input
                                type="tel"
                                name="emergency_contact_phone"
                                value={currentMember.emergency_contact_phone}
                                onChange={onEditChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              />
                            ) : (
                              <p className="font-semibold text-blue-600">{currentMember.emergency_contact_phone}</p>
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
        )}
      </main>
    </div>
  );
};

// Add Member View Component
const AddMemberView = ({ 
  onClose, 
  onSave,
  isSidebarOpen,
  setIsSidebarOpen,
  SidebarContent,
  newMember,
  onInputChange,
  isLoading
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
              disabled={isLoading}
              className="bg-amber-300 font-bold text-black px-3 py-2 rounded-lg hover:bg-amber-400 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 p-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xl">
                {newMember.first_name ? newMember.first_name[0] : 'N'}{newMember.last_name ? newMember.last_name[0] : 'M'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {newMember.first_name || 'New'} {newMember.last_name || 'Member'}
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
                        name="first_name"
                        value={newMember.first_name}
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
                        name="last_name"
                        value={newMember.last_name}
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
                        name="date_of_birth"
                        value={newMember.date_of_birth}
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
                        name="national_id"
                        value={newMember.national_id}
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

                  {/* Date Joined */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Date Joined
                      </label>
                      <input
                        type="date"
                        name="membership_date"
                        value={newMember.membership_date}
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
                          name="phone_number"
                          value={newMember.phone_number}
                          onChange={onInputChange}
                          required
                          placeholder="0979572520 or +251979572520"
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
                          name="house_no"
                          value={newMember.house_no}
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
                            name="emergency_contact_name"
                            value={newMember.emergency_contact_name}
                            onChange={onInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="emergency_contact_phone"
                            value={newMember.emergency_contact_phone}
                            onChange={onInputChange}
                            placeholder="0979572520 or +251979572520"
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
                            name="membership_status"
                            value={newMember.membership_status}
                            onChange={onInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                          </select>
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-8 overflow-auto print:p-0">
      <div className="max-w-4xl mx-auto print:max-w-none">
        {/* Print Header - Hidden when printing */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">MEMBER PROFILE</h1>
            <p className="text-gray-600">Printed on: {printDate} at {printTime}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Print Now
            </button>
            <button 
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Print Content */}
        <div className="space-y-6 print:space-y-4">
          {/* Member Header */}
          <div className="flex justify-between items-start border-b pb-4 print:border-b-2 print:border-black">
            <div>
              <h2 className="text-xl font-bold print:text-2xl">{member.first_name} {member.last_name}</h2>
              <div className="flex gap-4 mt-2 text-sm print:text-base">
                <span>ID: {member.member_id}</span>
                <span>National ID: {member.national_id}</span>
                <span className={`px-2 py-1 rounded-full ${
                  member.membership_status === 'Active' ? 'bg-green-100' : 
                  member.membership_status === 'Inactive' ? 'bg-gray-100' : 'bg-red-100'
                } print:bg-transparent print:border print:border-black print:px-1`}>
                  {member.membership_status}
                </span>
              </div>
            </div>
          </div>

          {/* Print Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 print:border-black">
              <thead>
                <tr className="bg-gray-100 print:bg-gray-200">
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
                  <td className="border border-gray-300 px-4 py-2">{member.first_name} {member.last_name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Gender</td>
                  <td className="border border-gray-300 px-4 py-2">{member.gender}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Date of Birth</td>
                  <td className="border border-gray-300 px-4 py-2">{member.date_of_birth}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">National ID</td>
                  <td className="border border-gray-300 px-4 py-2">{member.national_id}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Occupation</td>
                  <td className="border border-gray-300 px-4 py-2">{member.occupation}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Member ID</td>
                  <td className="border border-gray-300 px-4 py-2">{member.member_id}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Date Joined</td>
                  <td className="border border-gray-300 px-4 py-2">{member.membership_date}</td>
                </tr>

                {/* Contact & Address Information */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="border border-gray-300 px-4 py-2 font-bold bg-amber-200">
                    CONTACT & ADDRESS INFORMATION
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Phone Number</td>
                  <td className="border border-gray-300 px-4 py-2">{member.phone_number}</td>
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
                  <td className="border border-gray-300 px-4 py-2">{member.house_no}</td>
                </tr>

                {/* Emergency Contact */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="border border-gray-300 px-4 py-2 font-bold bg-amber-200">
                    EMERGENCY CONTACT
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Contact Name</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{member.emergency_contact_name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Contact Phone</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{member.emergency_contact_phone}</td>
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
                      member.membership_status === 'Active' ? 'bg-green-100' : 
                      member.membership_status === 'Inactive' ? 'bg-gray-100' : 'bg-red-100'
                    }`}>
                      {member.membership_status}
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
                <p>ADMAS SACCO Management System</p>
                <p>This is an official document</p>
              </div>
              <div className="text-right">
                <p>Page 1 of 1</p>
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
  const [currentView, setCurrentView] = useState("management");
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
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Members data from backend
  const [members, setMembers] = useState([]);

  // New member state
  const [newMember, setNewMember] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    national_id: "",
    phone_number: "",
    email: "",
    city: "Addis Ababa",
    subcity: "",
    woreda: "",
    house_no: "",
    membership_date: new Date().toISOString().split('T')[0],
    occupation: "Member",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    profile_photo: null,
    membership_status: "Active"
  });

  // Load members on component mount
  useEffect(() => {
    loadMembers();
  }, [currentPage, rowsPerPage, filters, searchTerm]);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const filterParams = {
        membership_status: filters.status,
        gender: filters.gender,
        occupation: filters.occupation,
        search: searchTerm || undefined
      };
      
      const data = await memberAPI.getMembers(currentPage, rowsPerPage, filterParams);
      setMembers(data.results || data);
      setTotalCount(data.count || data.length);
    } catch (error) {
      showNotification('Failed to load members: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Filter members locally for immediate feedback
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone_number.includes(searchTerm) ||
      member.national_id.includes(searchTerm) ||
      member.member_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || member.membership_status === filters.status;
    const matchesGender = !filters.gender || member.gender === filters.gender;
    const matchesOccupation = !filters.occupation || member.occupation === filters.occupation;

    return matchesSearch && matchesStatus && matchesGender && matchesOccupation;
  });

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Drill-down navigation handlers
  const handleViewMember = async (member) => {
    setIsLoading(true);
    try {
      const memberDetail = await memberAPI.getMember(member.member_id);
      setSelectedMember(memberDetail);
      setCurrentView("detail");
      setIsEditing(false);
      setEditedMember(null);
    } catch (error) {
      showNotification('Failed to load member details: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToManagement = () => {
    setCurrentView("management");
    setSelectedMember(null);
    setIsEditing(false);
    setEditedMember(null);
    // Reset new member form when going back
    setNewMember({
      first_name: "",
      last_name: "",
      gender: "",
      date_of_birth: "",
      national_id: "",
      phone_number: "",
      email: "",
      city: "Addis Ababa",
      subcity: "",
      woreda: "",
      house_no: "",
      membership_date: new Date().toISOString().split('T')[0],
      occupation: "Member",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      profile_photo: null,
      membership_status: "Active"
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

  const handleSaveMember = async (updatedMember) => {
    setIsSaving(true);
    try {
      const savedMember = await memberAPI.updateMember(updatedMember.member_id, updatedMember);
      setMembers(prev => 
        prev.map(member => 
          member.member_id === savedMember.member_id ? savedMember : member
        )
      );
      setSelectedMember(savedMember);
      setIsEditing(false);
      setEditedMember(null);
      showNotification('Member updated successfully!');
    } catch (error) {
      showNotification('Failed to update member: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveNewMember = async (memberData) => {
    setIsSaving(true);
    try {
      const savedMember = await memberAPI.createMember(memberData);
      setMembers(prev => [savedMember, ...prev]);
      setNewMember({
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        national_id: "",
        phone_number: "",
        email: "",
        city: "Addis Ababa",
        subcity: "",
        woreda: "",
        house_no: "",
        membership_date: new Date().toISOString().split('T')[0],
        occupation: "Member",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        profile_photo: null,
        membership_status: "Active"
      });
      setCurrentView("management");
      setCurrentPage(1);
      showNotification('Member registered successfully!');
    } catch (error) {
      showNotification('Failed to register member: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete member
  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await memberAPI.deleteMember(memberId);
        setMembers(prev => prev.filter(member => member.member_id !== memberId));
        if (currentMembers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        if (currentView === "detail" && selectedMember && selectedMember.member_id === memberId) {
          setCurrentView("management");
          setSelectedMember(null);
        }
        showNotification('Member deleted successfully!');
      } catch (error) {
        showNotification('Failed to delete member: ' + error.message, 'error');
      }
    }
  };

  // Print functionality
  const handlePrint = () => {
    setIsPrintView(true);
  };

  const handleClosePrint = () => {
    setIsPrintView(false);
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
  const handleExport = async () => {
    try {
      const filterParams = {
        membership_status: filters.status,
        gender: filters.gender,
        occupation: filters.occupation,
        search: searchTerm || undefined
      };
      
      const blob = await memberAPI.exportMembers(filterParams);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `members_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('Members exported successfully!');
    } catch (error) {
      showNotification('Failed to export members: ' + error.message, 'error');
    }
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
        isLoading={isSaving}
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
        isLoading={isLoading}
        isSaving={isSaving}
      />
    );
  }

  // Render Management View with Full Table
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarContent />
      <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${!isSidebarOpen ? 'ml-0' : ''}`}>
        {/* Notification */}
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ message: '', type: '' })} 
        />
        
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
                placeholder="Search by name, phone, national ID, or member ID..."
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
            <button 
              onClick={loadMembers}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              Refresh
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
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <LoadingSpinner size={32} />
                      <p className="mt-2 text-gray-600">Loading members...</p>
                    </td>
                  </tr>
                ) : currentMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No members found. {searchTerm && 'Try adjusting your search or filters.'}
                    </td>
                  </tr>
                ) : (
                  currentMembers.map((member) => (
                    <tr key={member.member_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {member.first_name[0]}{member.last_name[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.member_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.phone_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.emergency_contact_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.emergency_contact_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.membership_status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : member.membership_status === 'Inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.membership_status}
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
                            onClick={() => handleDeleteMember(member.member_id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            title="Delete Member"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of {totalCount} members
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