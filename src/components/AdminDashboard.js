import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FileText, Clock, DollarSign, Settings, User, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const fetchAllExpenses = async () => {
    try {
      const response = await axios.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateExpenseStatus = async (id, newStatus) => {
    try {
      await axios.put(`/expenses/${id}/status`, { status: newStatus });
      setExpenses(prev =>
        prev.map(expense =>
          expense.id === id ? { ...expense, status: newStatus } : expense
        )
      );
      const message = newStatus === 'APPROVED' ? 'Expense approved successfully!' :
                      newStatus === 'REJECTED' ? 'Expense rejected successfully!' :
                      newStatus === 'PAID' ? 'Expense marked as paid successfully!' : 'Expense status updated successfully!';
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update expense status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesText =
      expense.expenseName.toLowerCase().includes(filter.toLowerCase()) ||
      expense.user?.name.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter ? expense.status === statusFilter : true;
    return matchesText && matchesStatus;
  });

  const totalExpenses = expenses.length;
  const pendingExpenses = expenses.filter(exp => exp.status === 'PENDING').length;
  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.price), 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{totalExpenses}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingExpenses}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600">+{Math.floor(totalExpenses * 0.3)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* All Expenses Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Expenses</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search expenses..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center transition-all duration-300 ease-in-out">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center transition-all duration-300 ease-in-out">{success}</div>}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Expense</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Receipt</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{expense.user?.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{expense.expenseName}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">₹{parseFloat(expense.price).toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-600">{expense.date}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(expense.status)}`}>
                      {expense.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {expense.proofImagePath ? (
                      <button
                        onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081'}/expenses/files/${expense.proofImagePath}`, '_blank')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
                      >
                        View Receipt
                      </button>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {expense.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateExpenseStatus(expense.id, 'APPROVED')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateExpenseStatus(expense.id, 'REJECTED')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {expense.status === 'APPROVED' && (
                        <button
                          onClick={() => updateExpenseStatus(expense.id, 'PAID')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
