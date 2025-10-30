import React, { useState } from "react";
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
  FileText
} from "lucide-react";

const Saving = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample savings data
  const [savings, setSavings] = useState([
    {
      id: "SAV001",
      memberId: "MEM001",
      memberName: "John Doe",
      contact: "+251911223344",
      date: "2024-01-15",
      amount: 5000,
      savingType: "Compulsory",
      referenceNumber: "REF001",
      paymentMethod: "Bank Transfer",
      interest: 250,
      status: "Active",
      transactions: [
        { 
          date: "2024-01-15", 
          paymentMethod: "Bank Transfer", 
          referenceNumber: "REF001", 
          savingType: "Compulsory", 
          amount: 5000, 
          interest: 250, 
          debit: 0, 
          credit: 5000, 
          balance: 5000 
        }
      ]
    },
    {
      id: "SAV002",
      memberId: "MEM002",
      memberName: "Mary Smith",
      contact: "+251944556677",
      date: "2024-01-16",
      amount: 3000,
      savingType: "Voluntary",
      referenceNumber: "REF002",
      paymentMethod: "Cash",
      interest: 150,
      status: "Active",
      transactions: [
        { 
          date: "2024-01-16", 
          paymentMethod: "Cash", 
          referenceNumber: "REF002", 
          savingType: "Voluntary", 
          amount: 3000, 
          interest: 150, 
          debit: 0, 
          credit: 3000, 
          balance: 3000 
        }
      ]
    }
  ]);

  const [newSaving, setNewSaving] = useState({
    memberId: "",
    memberName: "",
    contact: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    savingType: "Compulsory",
    referenceNumber: `REF${Date.now()}`,
    paymentMethod: "Cash",
    interest: "",
    status: "Active"
  });

  const handleAddSaving = (e) => {
    e.preventDefault();
    const savingId = `SAV${String(savings.length + 1).padStart(3, '0')}`;
    
    // Calculate interest based on amount and saving type
    const interestRate = newSaving.savingType === "Compulsory" ? 0.05 : 0.03;
    const calculatedInterest = parseFloat(newSaving.amount) * interestRate;
    
    const savingToAdd = {
      id: savingId,
      memberId: newSaving.memberId,
      memberName: newSaving.memberName,
      contact: newSaving.contact,
      date: newSaving.date,
      amount: parseFloat(newSaving.amount),
      savingType: newSaving.savingType,
      referenceNumber: newSaving.referenceNumber,
      paymentMethod: newSaving.paymentMethod,
      interest: calculatedInterest,
      status: newSaving.status,
      transactions: [{
        date: newSaving.date,
        paymentMethod: newSaving.paymentMethod,
        referenceNumber: newSaving.referenceNumber,
        savingType: newSaving.savingType,
        amount: parseFloat(newSaving.amount),
        interest: calculatedInterest,
        debit: 0,
        credit: parseFloat(newSaving.amount),
        balance: parseFloat(newSaving.amount)
      }]
    };

    setSavings([...savings, savingToAdd]);
    setNewSaving({
      memberId: "",
      memberName: "",
      contact: "",
      date: new Date().toISOString().split('T')[0],
      amount: "",
      savingType: "Compulsory",
      referenceNumber: `REF${Date.now()}`,
      paymentMethod: "Cash",
      interest: "",
      status: "Active"
    });
    setIsAddModalOpen(false);
  };

  const handleViewSaving = (saving) => {
    setSelectedSaving(saving);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "amount") {
      // Auto-calculate interest when amount changes
      const interestRate = newSaving.savingType === "Compulsory" ? 0.05 : 0.03;
      const calculatedInterest = value ? (parseFloat(value) * interestRate).toFixed(2) : "";
      
      setNewSaving(prev => ({
        ...prev,
        [name]: value,
        interest: calculatedInterest
      }));
    } else if (name === "savingType" && newSaving.amount) {
      // Recalculate interest when saving type changes
      const interestRate = value === "Compulsory" ? 0.05 : 0.03;
      const calculatedInterest = (parseFloat(newSaving.amount) * interestRate).toFixed(2);
      
      setNewSaving(prev => ({
        ...prev,
        [name]: value,
        interest: calculatedInterest
      }));
    } else {
      setNewSaving(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const filteredSavings = savings.filter(saving =>
    saving.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    saving.contact.includes(searchTerm) ||
    saving.referenceNumber.includes(searchTerm) ||
    saving.id.includes(searchTerm)
  );

  // Calculate totals for a specific member's savings
  const calculateTotals = (savingData) => {
    const compulsoryTotal = savingData.transactions
      .filter(t => t.savingType === "Compulsory")
      .reduce((sum, t) => sum + t.amount, 0);

    const voluntaryTotal = savingData.transactions
      .filter(t => t.savingType === "Voluntary")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalAmount = compulsoryTotal + voluntaryTotal;

    return { compulsoryTotal, voluntaryTotal, totalAmount };
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-black text-white flex flex-col shadow-lg">
        {/* Logo / Icon Section */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-10">
          <img
            src={saccoLogo}
            alt="SACCO Logo"
            className="w-10 h-10 rounded-full border border-gray-700"
          />
          <h1 className="text-lg font-semibold tracking-wide">SACCO</h1>
        </div>

        {/* Sidebar Menu */}
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Savings Management
          </h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-400 font-bold text-black px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Saving
          </button>
        </header>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by member name, contact, or reference..."
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

        {/* Savings Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-300 border-b  border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Saving ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Member Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Reference Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSavings.map((saving) => (
                  <tr key={saving.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewSaving(saving)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {saving.id}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-green-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {saving.memberName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {saving.memberId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {saving.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {saving.referenceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-600" />
                        <span className="font-semibold">{saving.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(saving.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewSaving(saving)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add Saving Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b bg-amber-300 border-gray-200">
                <h3 className="text-lg font-semibold  text-gray-800">Add New Saving</h3>
              </div>
              <form onSubmit={handleAddSaving} className="p-6">
                <div className="space-y-6">
                  {/* Member Information Section */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Member Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member ID *
                        </label>
                        <input
                          type="text"
                          name="memberId"
                          value={newSaving.memberId}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter Member ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Name *
                        </label>
                        <input
                          type="text"
                          name="memberName"
                          value={newSaving.memberName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter Member Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={newSaving.contact}
                        onChange={handleInputChange}
                        placeholder="Enter Contact Number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date and Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={newSaving.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={newSaving.amount}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Saving Type and Interest */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saving Type *
                      </label>
                      <select
                        name="savingType"
                        value={newSaving.savingType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Compulsory">Compulsory</option>
                        <option value="Voluntary">Voluntary</option>
                        <option value="Regular">Regular</option>
                        <option value="Fixed Deposit">Fixed Deposit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interest
                      </label>
                      <input
                        type="number"
                        name="interest"
                        value={newSaving.interest}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Auto-calculated"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-calculated based on amount and saving type
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Method and Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <select
                        name="paymentMethod"
                        value={newSaving.paymentMethod}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={newSaving.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Reference Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      value={newSaving.referenceNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-500 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-300 rounded-lg font-bold text-black hover:bg-blue-700"
                  >
                    Add Saving
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Saving Detail Modal */}
        {isViewModalOpen && selectedSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6  bg-amber-300">
                <h3 className="text-lg font-semibold text-gray-800">
                  SAVING DETAIL
                </h3>
              </div>
              <div className="p-6">
                {/* Member Information */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {selectedSaving.memberName}
                    </h4>
                    <p className="text-gray-600">Member ID: {selectedSaving.memberId}</p>
                    <p className="text-gray-600">Contact: {selectedSaving.contact}</p>
                  </div>
                </div>

                {/* Savings Detail Table */}
                <div className="mb-6">
                  <h5 className="text-lg font-medium text-gray-700 mb-4">Savings Transactions</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-300 font-medium">
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Payment Method</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Reference Number</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Saving Type</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Interest</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Debit</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSaving.transactions.map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-sm">{transaction.date}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{transaction.paymentMethod}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm font-mono">{transaction.referenceNumber}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.savingType === 'Compulsory' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : transaction.savingType === 'Voluntary'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.savingType}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                              {transaction.amount.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              {transaction.interest.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-red-600">
                              {transaction.debit > 0 ? transaction.debit.toLocaleString() : '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-green-600">
                              {transaction.credit > 0 ? transaction.credit.toLocaleString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <h6 className="text-sm font-medium text-gray-600 mb-1">Compulsory Saving Total</h6>
                    <p className="text-2xl font-bold text-blue-700">
                      {calculateTotals(selectedSaving).compulsoryTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <h6 className="text-sm font-medium text-gray-600 mb-1">Voluntary Saving Total</h6>
                    <p className="text-2xl font-bold text-green-700">
                      {calculateTotals(selectedSaving).voluntaryTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <h6 className="text-sm font-medium text-gray-600 mb-1">Final Total Amount</h6>
                    <p className="text-2xl font-bold text-purple-700">
                      {calculateTotals(selectedSaving).totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 bg-amber-300 text-black font-bold rounded-lg hover:bg-blue-700"
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

export default Saving;
