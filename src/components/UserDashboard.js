import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import SubmitExpenseForm from './SubmitExpenseForm';
import { DollarSign, Clock, CheckCircle, Eye, Calendar } from 'lucide-react';

const UserDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/expenses/my');
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpense = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'PAID': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.price), 0);
  const pendingAmount = expenses.filter(exp => exp.status === 'PENDING').reduce((sum, exp) => sum + parseFloat(exp.price), 0);
  const paidAmount = expenses.filter(exp => exp.status === 'PAID').reduce((sum, exp) => sum + parseFloat(exp.price), 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Responsive Layout: My Expenses (left), Submit Form (middle, larger), Stats (right) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* My Expenses - Left */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Eye className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">My Expenses</h2>
              </div>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center transition-all duration-300 ease-in-out">{error}</div>}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center">No expenses submitted yet.</p>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{expense.expenseName}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        <span className="ml-1 capitalize">{expense.status.toLowerCase()}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {expense.date}
                      </span>
                      <span className="font-bold text-gray-900">₹{parseFloat(expense.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Submit Expense Form - Middle, Larger */}
        <div className="md:col-span-2">
          <SubmitExpenseForm onSubmit={handleSubmitExpense} />
        </div>

        {/* Stats Cards - Right */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{paidAmount.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
