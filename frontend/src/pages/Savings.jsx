import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import saccoLogo from "../assets/sacco-logo.svg";
import { 
  Eye, 
  Plus, 
  Search, 
  Filter,
  Download,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  FileText,
  RefreshCw,
  AlertCircle,
  X,
  Building,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const savingService = {
  getAllSavings: async (params = {}) => {
    try {
      const response = await api.get('/savings/savings/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching savings:', error);
      throw error;
    }
  },

  getSavingById: async (id) => {
    try {
      const response = await api.get(`/savings/savings/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saving:', error);
      throw error;
    }
  },

  createSaving: async (savingData) => {
    try {
      console.log("=== DEBUG: Sending data to API ===");
      console.log("Saving data:", savingData);
      const response = await api.post('/savings/savings/', savingData);
      console.log("=== DEBUG: API Response ===");
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating saving:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  searchMembers: async (searchTerm) => {
    try {
      const response = await api.get('/savings/savings/member_search/', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching members:', error);
      return [];
    }
  },

  getMemberSavings: async (memberId, page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/savings/savings/${memberId}/member_savings/`, {
        params: { page, page_size: pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching member savings:', error);
      return { results: [], count: 0 };
    }
  },

  getMemberTotals: async (memberId) => {
    try {
      const response = await api.get(`/savings/savings/${memberId}/member_totals/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching member totals:', error);
      return {
        compulsory_total: 0,
        voluntary_total: 0,
        regular_total: 0,
        fixed_deposit_total: 0,
        total_balance: 0
      };
    }
  },

  exportSavings: async (filters = {}) => {
    try {
      const response = await api.get('/savings/savings/export/', {
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting savings:', error);
      throw error;
    }
  },

  getSavingFilters: async () => {
    try {
      const response = await api.get('/savings/savings/filters/');
      return response.data;
    } catch (error) {
      console.error('Error fetching filters:', error);
      return {
        saving_types: [],
        payment_methods: [],
        statuses: [],
        banks: [],
        mobile_providers: []
      };
    }
  }
};

// Bank and Mobile Money Options
const BANK_OPTIONS = [
  'Commercial Bank of Ethiopia',
  'Bank of Abyssinia',
  'Awash Bank',
  'Dashen Bank',
  'Bunna Bank',
  'Hibret Bank',
  'Tseday Bank',
  'Zemen Bank',
  'Cooperative Bank of Oromia',
  'Other'
];

const MOBILE_MONEY_OPTIONS = [
  'Tele-Birr',
  'CBE Birr',
  'M-PESA',
  'Other'
];

const PAGE_SIZE_OPTIONS = [5, 10, 50, 100];
const MAIN_TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Filter Component (same as before)
const FilterModal = ({ isOpen, onClose, onApply, filters }) => {
  const [localFilters, setLocalFilters] = useState({
    saving_type: '',
    payment_method: '',
    status: '',
    bank_name: '',
    mobile_money_provider: '',
    date_from: '',
    date_to: '',
    amount_min: '',
    amount_max: ''
  });

  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      saving_type: '',
      payment_method: '',
      status: '',
      bank_name: '',
      mobile_money_provider: '',
      date_from: '',
      date_to: '',
      amount_min: '',
      amount_max: ''
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b bg-amber-300 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Filter Savings
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saving Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saving Type
              </label>
              <select
                name="saving_type"
                value={localFilters.saving_type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Compulsory">Compulsory</option>
                <option value="Voluntary">Voluntary</option>
                <option value="Regular">Regular</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={localFilters.payment_method}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={localFilters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Bank Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <select
                name="bank_name"
                value={localFilters.bank_name}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Banks</option>
                {BANK_OPTIONS.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>

            {/* Mobile Money Provider Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Provider
              </label>
              <select
                name="mobile_money_provider"
                value={localFilters.mobile_money_provider}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Providers</option>
                {MOBILE_MONEY_OPTIONS.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date From
              </label>
              <input
                type="date"
                name="date_from"
                value={localFilters.date_from}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date To
              </label>
              <input
                type="date"
                name="date_to"
                value={localFilters.date_to}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Amount
              </label>
              <input
                type="number"
                name="amount_min"
                value={localFilters.amount_min}
                onChange={handleFilterChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Amount
              </label>
              <input
                type="number"
                name="amount_max"
                value={localFilters.amount_max}
                onChange={handleFilterChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-500 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Saving Form Component (same as before)
const SavingForm = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    member: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    saving_type: 'Compulsory',
    payment_method: 'Cash',
    bank_name: '',
    mobile_money_provider: '',
    transaction_code: '',
    status: 'Active'
  });

  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData.saving_id) {
      setFormData({
        member: initialData.member?.member_id || initialData.member || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        amount: initialData.amount || '',
        saving_type: initialData.saving_type || 'Compulsory',
        payment_method: initialData.payment_method || 'Cash',
        bank_name: initialData.bank_name || '',
        mobile_money_provider: initialData.mobile_money_provider || '',
        transaction_code: initialData.transaction_code || '',
        status: initialData.status || 'Active'
      });
      
      if (initialData.member) {
        setSelectedMember({
          member_id: initialData.member.member_id || initialData.member,
          full_name: initialData.member_full_name,
          contact: initialData.member_contact
        });
        setMemberSearchTerm(initialData.member_full_name || '');
      }
    }
  }, [initialData]);

  useEffect(() => {
    const searchMembers = async () => {
      if (memberSearchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await savingService.searchMembers(memberSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching members:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchMembers, 500);
    return () => clearTimeout(debounceTimer);
  }, [memberSearchTerm]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setFormData(prev => ({
      ...prev,
      member: member.member_id
    }));
    setMemberSearchTerm(member.full_name);
    setSearchResults([]);
    setErrors(prev => ({ ...prev, member: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear related fields when payment method changes
    if (name === 'payment_method') {
      setFormData(prev => ({
        ...prev,
        bank_name: '',
        mobile_money_provider: '',
        transaction_code: ''
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMemberSearchChange = (e) => {
    const value = e.target.value;
    setMemberSearchTerm(value);
    
    if (!value || (selectedMember && value !== selectedMember.full_name)) {
      setSelectedMember(null);
      setFormData(prev => ({ ...prev, member: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.member) newErrors.member = 'Member is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.date) newErrors.date = 'Date is required';

    // Validate payment method specific fields
    if (formData.payment_method === 'Bank Transfer') {
      if (!formData.bank_name) newErrors.bank_name = 'Bank name is required for bank transfers';
      if (!formData.transaction_code) newErrors.transaction_code = 'Transaction code is required for bank transfers';
    } else if (formData.payment_method === 'Mobile Money') {
      if (!formData.mobile_money_provider) newErrors.mobile_money_provider = 'Mobile money provider is required';
      if (!formData.transaction_code) newErrors.transaction_code = 'Transaction code is required for mobile money';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("=== DEBUG: Form Data Before Sending ===");
      console.log("Raw formData:", formData);
      console.log("Member ID type:", typeof formData.member);
      console.log("Member ID value:", formData.member);
      
      const dataToSend = {
        member: formData.member.toString(), // Ensure it's a string
        date: formData.date,
        amount: parseFloat(formData.amount), // Ensure it's a number
        saving_type: formData.saving_type,
        payment_method: formData.payment_method,
        bank_name: formData.bank_name || '',
        mobile_money_provider: formData.mobile_money_provider || '',
        transaction_code: formData.transaction_code || '',
        status: formData.status
      };
      
      console.log("=== DEBUG: Data Being Sent to API ===");
      console.log("Final dataToSend:", dataToSend);
      
      await onSave(dataToSend);
      handleClose();
    } catch (error) {
      console.error('Error saving saving:', error);
      console.error('Error response data:', error.response?.data);
      if (error.response?.data) {
        const djangoErrors = error.response.data;
        console.error('Django validation errors:', djangoErrors);
        const fieldErrors = {};
        Object.keys(djangoErrors).forEach(key => {
          fieldErrors[key] = Array.isArray(djangoErrors[key]) ? djangoErrors[key][0] : djangoErrors[key];
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'Failed to save saving. Please try again.' });
      }
    }
  };

  const handleClose = () => {
    setFormData({
      member: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      saving_type: 'Compulsory',
      payment_method: 'Cash',
      bank_name: '',
      mobile_money_provider: '',
      transaction_code: '',
      status: 'Active'
    });
    setSelectedMember(null);
    setMemberSearchTerm('');
    setSearchResults([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b bg-amber-300 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {initialData.saving_id ? 'Edit Saving' : 'Add New Saving'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <div className="space-y-6">
            {/* Member Search Section */}
            <div>
              <h4 className="font-medium text-gray-700 mb-4">Member Information</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Member *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={memberSearchTerm}
                    onChange={handleMemberSearchChange}
                    placeholder="Search by member ID, name, or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSearching && (
                    <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={20} />
                  )}
                </div>
                {errors.member && (
                  <p className="text-red-500 text-sm mt-1">{errors.member}</p>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="mb-4 border border-gray-200 rounded-lg max-h-40 overflow-y-auto shadow-lg">
                  {searchResults.map((member) => (
                    <div
                      key={member.member_id}
                      onClick={() => handleMemberSelect(member)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{member.full_name}</div>
                      <div className="text-sm text-gray-600">
                        ID: {member.member_id} | Contact: {member.contact}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedMember && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {selectedMember.full_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        ID: {selectedMember.member_id} | Contact: {selectedMember.contact}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMember(null);
                        setMemberSearchTerm('');
                        setFormData(prev => ({ ...prev, member: '' }));
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Saving Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saving Type *
                </label>
                <select
                  name="saving_type"
                  value={formData.saving_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Compulsory">Compulsory (3% interest)</option>
                  <option value="Voluntary">Voluntary (5% interest)</option>
                  <option value="Regular">Regular (2% interest)</option>
                  <option value="Fixed Deposit">Fixed Deposit (2% interest)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details */}
            {formData.payment_method === 'Bank Transfer' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Building size={18} className="text-blue-600" />
                  Bank Transfer Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <select
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Bank</option>
                      {BANK_OPTIONS.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    {errors.bank_name && <p className="text-red-500 text-sm mt-1">{errors.bank_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Code *
                    </label>
                    <input
                      type="text"
                      name="transaction_code"
                      value={formData.transaction_code}
                      onChange={handleInputChange}
                      placeholder="Enter transaction code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.transaction_code && <p className="text-red-500 text-sm mt-1">{errors.transaction_code}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Money Details */}
            {formData.payment_method === 'Mobile Money' && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Smartphone size={18} className="text-green-600" />
                  Mobile Money Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider *
                    </label>
                    <select
                      name="mobile_money_provider"
                      value={formData.mobile_money_provider}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Provider</option>
                      {MOBILE_MONEY_OPTIONS.map(provider => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                    </select>
                    {errors.mobile_money_provider && <p className="text-red-500 text-sm mt-1">{errors.mobile_money_provider}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Code *
                    </label>
                    <input
                      type="text"
                      name="transaction_code"
                      value={formData.transaction_code}
                      onChange={handleInputChange}
                      placeholder="Enter transaction code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.transaction_code && <p className="text-red-500 text-sm mt-1">{errors.transaction_code}</p>}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.member}
              className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialData.saving_id ? 'Update Saving' : 'Add Saving'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Member Savings Detail Component
const MemberSavingsDetail = ({ member, isOpen, onClose }) => {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberTotals, setMemberTotals] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      if (member && member.member_id) {
        setLoading(true);
        try {
          const [savingsData, totalsData] = await Promise.all([
            savingService.getMemberSavings(member.member_id, pagination.currentPage, pagination.pageSize),
            savingService.getMemberTotals(member.member_id)
          ]);
          
          // Handle Django REST Framework pagination response
          const savingsList = savingsData.results || savingsData;
          setSavings(savingsList);
          setMemberTotals(totalsData);
          setPagination(prev => ({
            ...prev,
            totalCount: savingsData.count || savingsList.length
          }));
        } catch (error) {
          console.error('Error fetching member data:', error);
          setSavings([]);
          setMemberTotals({
            compulsory_total: 0,
            voluntary_total: 0,
            regular_total: 0,
            fixed_deposit_total: 0,
            total_balance: 0
          });
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen && member) {
      fetchMemberData();
    }
  }, [member, isOpen, pagination.currentPage, pagination.pageSize]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination({ currentPage: 1, pageSize: parseInt(newSize), totalCount: 0 });
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 bg-amber-300 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            SAVINGS FOR {member.full_name} - {member.member_id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Member Information */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800">
                {member.full_name}
              </h4>
              <p className="text-gray-600">
                Member ID: {member.member_id}
              </p>
              <p className="text-gray-600">
                Contact: {member.contact}
              </p>
            </div>
          </div>

          {/* Member Savings Summary */}
          {memberTotals && (
            <div className="mb-6">
              <h5 className="text-lg font-medium text-gray-700 mb-4">Member Savings Summary</h5>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <h6 className="text-sm font-medium text-gray-600 mb-1">Compulsory</h6>
                  <p className="text-xl font-bold text-blue-700">
                    ETB {parseFloat(memberTotals.compulsory_total || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <h6 className="text-sm font-medium text-gray-600 mb-1">Voluntary</h6>
                  <p className="text-xl font-bold text-green-700">
                    ETB {parseFloat(memberTotals.voluntary_total || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <h6 className="text-sm font-medium text-gray-600 mb-1">Regular</h6>
                  <p className="text-xl font-bold text-purple-700">
                    ETB {parseFloat(memberTotals.regular_total || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <h6 className="text-sm font-medium text-gray-600 mb-1">Fixed Deposit</h6>
                  <p className="text-xl font-bold text-yellow-700">
                    ETB {parseFloat(memberTotals.fixed_deposit_total || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <h6 className="text-sm font-medium text-gray-600 mb-1">Total Balance</h6>
                  <p className="text-2xl font-bold text-red-700">
                    ETB {parseFloat(memberTotals.total_balance || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Savings List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-medium text-gray-700">
                Individual Savings Records ({pagination.totalCount})
              </h5>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-4">
                <select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size} per page</option>
                  ))}
                </select>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                  >
                    <ChevronsLeft size={16} />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {totalPages || 1}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === totalPages || totalPages === 0}
                    className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={pagination.currentPage === totalPages || totalPages === 0}
                    className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="animate-spin h-8 w-8 text-amber-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading savings data...</p>
              </div>
            ) : savings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-300 font-medium">
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Saving ID</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Interest</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Reference Number</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Bank/Mobile Name</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Transaction Code</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savings.map((saving) => (
                      <tr key={saving.saving_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                          {saving.saving_id}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                          ETB {parseFloat(saving.amount || 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          ETB {parseFloat(saving.interest || 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm font-mono">
                          {saving.reference_number}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          {saving.payment_method === 'Bank Transfer' 
                            ? saving.bank_name 
                            : saving.payment_method === 'Mobile Money'
                            ? saving.mobile_money_provider
                            : saving.payment_method
                          }
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm font-mono">
                          {saving.transaction_code || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          {new Date(saving.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            saving.status === 'Active' 
                              ? 'bg-green-100 text-green-800'
                              : saving.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {saving.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No savings found for this member.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to group savings by member and calculate totals
const groupSavingsByMember = (savings) => {
  const memberMap = new Map();
  
  // Handle both array and paginated response
  const savingsList = Array.isArray(savings) ? savings : (savings.results || []);
  
  savingsList.forEach(saving => {
    const memberId = saving.member?.member_id || saving.member;
    
    if (!memberMap.has(memberId)) {
      memberMap.set(memberId, {
        member_id: memberId,
        full_name: saving.member_full_name || saving.member?.full_name || 'Unknown Member',
        contact: saving.member_contact || saving.member?.phone_number || 'N/A',
        total_balance: 0,
        savings_count: 0,
        latest_saving: saving
      });
    }
    
    const memberData = memberMap.get(memberId);
    memberData.total_balance += parseFloat(saving.amount || 0) + parseFloat(saving.interest || 0);
    memberData.savings_count += 1;
    
    // Keep the latest saving for reference
    if (new Date(saving.date) > new Date(memberData.latest_saving.date)) {
      memberData.latest_saving = saving;
    }
  });
  
  return Array.from(memberMap.values());
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange, totalCount, pageSizeOptions = PAGE_SIZE_OPTIONS }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
      </div>
      <div className="flex items-center gap-4">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Savings Component
const Savings = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMemberDetailOpen, setIsMemberDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savings, setSavings] = useState([]);
  const [groupedMembers, setGroupedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  });

  const loadSavings = async (params = {}) => {
    try {
      setError(null);
      const data = await savingService.getAllSavings({
        ...params,
        page: pagination.currentPage,
        page_size: pagination.pageSize
      });
      
      // Handle Django REST Framework pagination response
      const savingsData = data.results || data || [];
      setSavings(savingsData);
      
      // Group savings by member
      const grouped = groupSavingsByMember(savingsData);
      setGroupedMembers(grouped);
      
      // Update total count for pagination
      setPagination(prev => ({
        ...prev,
        totalCount: data.count || savingsData.length
      }));
    } catch (err) {
      console.error('Error loading savings:', err);
      setError('Failed to load savings data. Please try again.');
      setSavings([]);
      setGroupedMembers([]);
      setPagination(prev => ({ ...prev, totalCount: 0 }));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSavings();
  }, [pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    // Count active filters
    const count = Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
    setActiveFilters(count);
  }, [filters]);

  useEffect(() => {
    // Reset to page 1 when search or filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Debounced search with filters
    const timer = setTimeout(() => {
      loadSavings({ search: searchTerm, ...filters });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const handleAddSaving = async (savingData) => {
    try {
      console.log("=== DEBUG: Main handleAddSaving ===");
      console.log("Saving data received:", savingData);
      
      const newSaving = await savingService.createSaving(savingData);
      console.log("New saving created:", newSaving);
      
      // Reload savings to get updated grouped data
      loadSavings({ search: searchTerm, ...filters });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating saving:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const handleViewMemberSavings = (memberData) => {
    setSelectedMember(memberData);
    setIsMemberDetailOpen(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadSavings({ search: searchTerm, ...filters });
  };

  const handleExport = async () => {
    try {
      const blob = await savingService.exportSavings({ search: searchTerm, ...filters });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `savings-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting savings:', error);
      setError('Failed to export savings data. Please try again.');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination({ currentPage: 1, pageSize: parseInt(newSize), totalCount: 0 });
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

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
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Savings Management
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-400 font-bold text-black px-4 py-2 rounded-lg hover:bg-amber-500 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Saving
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by member name, contact, or member ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative"
            >
              <Filter size={20} />
              Filter
              {activeFilters > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={20} />
              Export
            </button>
          </div>

          {/* Active Filters Display */}
          {activeFilters > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">
                    Active Filters ({activeFilters}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (value && value !== '') {
                        return (
                          <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {key.replace('_', ' ')}: {value}
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                              className="hover:text-blue-600"
                            >
                              ×
                            </button>
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Member Savings Summary Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-300 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Member ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Total Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Savings Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <RefreshCw className="animate-spin h-8 w-8 text-amber-400 mx-auto mb-4" />
                      <p>Loading savings data...</p>
                    </td>
                  </tr>
                ) : groupedMembers.length > 0 ? (
                  groupedMembers.map((member) => (
                    <tr key={member.member_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.member_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-green-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {member.full_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-green-600" />
                          <span className="font-semibold text-lg">
                            ETB {parseFloat(member.total_balance || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {member.savings_count} records
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewMemberSavings(member)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="View Member Savings Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm || activeFilters > 0 ? 'No members found matching your search criteria.' : 'No savings records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for Main Table */}
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pagination.pageSize}
              onPageSizeChange={handlePageSizeChange}
              totalCount={pagination.totalCount}
              pageSizeOptions={MAIN_TABLE_PAGE_SIZE_OPTIONS}
            />
          </div>
        </section>

        {/* Modals */}
        <SavingForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddSaving}
        />

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          filters={filters}
        />

        <MemberSavingsDetail
          member={selectedMember}
          isOpen={isMemberDetailOpen}
          onClose={() => setIsMemberDetailOpen(false)}
        />
      </main>
    </div>
  );
};

export default Savings;