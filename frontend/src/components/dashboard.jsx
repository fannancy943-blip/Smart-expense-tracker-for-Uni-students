import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, LogOut, Loader2, X, Settings, AlertTriangle, Target, Trash2 } from 'lucide-react';
import { expenseAPI, userAPI, savingsAPI } from '../api/services';

export default function Dashboard({ onLogout }) {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [budgetSettings, setBudgetSettings] = useState({
    budget: 10000,
    alert_threshold: 80,
    email_alerts: false
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, expenseRes, savingsRes] = await Promise.all([
        userAPI.getProfile(),
        expenseAPI.getAll(),
        savingsAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setProfile(userRes.data);
      setBudgetSettings({
        budget: userRes.data.budget || 10000,
        alert_threshold: userRes.data.alert_threshold || 80,
        email_alerts: userRes.data.email_alerts || false
      });
      
      const expensesData = expenseRes.data;
      if (Array.isArray(expensesData)) {
        setExpenses(expensesData);
      } else if (expensesData && Array.isArray(expensesData.expenses)) {
        setExpenses(expensesData.expenses);
      } else {
        setExpenses([]);
      }

      const savingsData = savingsRes.data;
      if (Array.isArray(savingsData)) {
        setSavingsGoals(savingsData);
      } else {
        setSavingsGoals([]);
      }
      
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      setExpenses([]);
      setSavingsGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

const handleAddExpense = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    await expenseAPI.create({
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date
    });

    setNewExpense({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddExpense(false);
    await fetchData();
    // Removed alert - expense added silently
  } catch (err) {
    console.error('Add expense error:', err);
    // Removed alert - just log to console
  } finally {
    setSubmitting(false);
  }
};
const handleUpdateBudget = async (e) => {
   e.preventDefault();
   setSubmitting(true);

   try {
     await userAPI.updateBudgetSettings(budgetSettings);
     setShowSettings(false);
     await fetchData();
     // Removed alert - budget updates silently
   } catch (err) {
     console.error('Update budget error:', err);
     // Removed alert - just log to console
   } finally {
     setSubmitting(false);
   }
 };

 const handleDeleteExpense = (id) => {
   setDeleteExpenseId(id);
   setShowDeleteConfirm(true);
 };

 const confirmDelete = async () => {
   try {
     await expenseAPI.delete(deleteExpenseId);
     setShowDeleteConfirm(false);
     setDeleteExpenseId(null);
     await fetchData();
   } catch (err) {
     console.error('Delete expense error:', err);
     alert('Failed to delete expense');
     setShowDeleteConfirm(false);
   }
 };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="animate-spin w-16 h-16 text-purple-400" />
      </div>
    );
  }

  const totalExpenses = Array.isArray(expenses) && expenses.length > 0 
    ? expenses.reduce((t, x) => t + (Number(x.amount) || 0), 0) 
    : 0;

  const highestExpense = Array.isArray(expenses) && expenses.length > 0
    ? Math.max(...expenses.map(e => Number(e.amount) || 0))
    : 0;

  const budget = budgetSettings.budget || 10000;
  const spendingPercentage = (totalExpenses / budget) * 100;
  const isOverBudget = spendingPercentage > 100;
  const isNearLimit = spendingPercentage >= budgetSettings.alert_threshold && !isOverBudget;

  const categoryIcons = {
    'Food': '🍔',
    'Transport': '🚗',
    'Books': '📚',
    'Rent': '🏠',
    'Entertainment': '🎬',
    'Utilities': '💡',
    'Other': '📦'
  };

  const categories = Object.keys(categoryIcons);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8 text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Smart Expense Tracker</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center gap-2 transition-all"
          >
            <Target className="w-5 h-5" />
            <span className="hidden md:inline">Add Budget</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 flex items-center gap-2 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Welcome & Budget Alert */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Welcome back, {profile?.username || 'User'}!</h2>
        <p className="text-gray-300">Here's a snapshot of your spending activity</p>
        
        {/* Budget Alert */}
        {(isOverBudget || isNearLimit) && (
          <div className={`mt-4 p-4 rounded-xl border-2 flex items-start gap-3 ${
            isOverBudget 
              ? 'bg-red-500/10 border-red-500' 
              : 'bg-yellow-500/10 border-yellow-500'
          }`}>
            <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
              isOverBudget ? 'text-red-500' : 'text-yellow-500'
            }`} />
            <div>
              <h3 className="font-semibold">
                {isOverBudget ? '⚠️ Budget Exceeded!' : '⚠️ Approaching Budget Limit'}
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {isOverBudget 
                  ? `You've spent KES ${totalExpenses.toLocaleString()} (${spendingPercentage.toFixed(1)}% of your KES ${budget.toLocaleString()} budget)`
                  : `You've used ${spendingPercentage.toFixed(1)}% of your monthly budget. Consider reducing expenses.`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <Wallet className="w-10 h-10 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <h3 className="text-2xl font-bold">
                KES {totalExpenses.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <Target className="w-10 h-10 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Monthly Budget</p>
              <h3 className="text-2xl font-bold">
                KES {budget.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-10 h-10 text-green-400" />
            <div>
              <p className="text-gray-400 text-sm">Remaining</p>
              <h3 className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : ''}`}>
                KES {Math.max(0, budget - totalExpenses).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <TrendingDown className="w-10 h-10 text-red-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Entries</p>
              <h3 className="text-2xl font-bold">{expenses.length}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Budget Progress Bar */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 mb-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Budget Usage</h3>
          <span className={`font-bold ${
            isOverBudget ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {spendingPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget 
                ? 'bg-red-500' 
                : isNearLimit 
                  ? 'bg-yellow-500' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Expenses</h3>

          <button 
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        {!Array.isArray(expenses) || expenses.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No expenses recorded yet. Click "Add Expense" to get started!
          </p>
        ) : (
          <ul className="space-y-4">
            {expenses.slice(0, 10).map(exp => (
              <li
                key={exp.id}
                className="flex justify-between items-center bg-gray-700/40 p-4 rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{categoryIcons[exp.category] || '📦'}</span>
                  <div>
                    <span className="font-semibold">{exp.category || 'Uncategorized'}</span>
                    {exp.description && (
                      <p className="text-sm text-gray-400">{exp.description}</p>
                    )}
                    {exp.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(exp.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">
                    KES {(Number(exp.amount) || 0).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-purple-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Expense</h2>
              <button
                onClick={() => setShowAddExpense(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (KES)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              </div>



              <div>
                <label className="block text-sm text-gray-400 mb-2">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
          <button
  type="submit"
  disabled={submitting}
  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
>
  {submitting ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Saving...
    </>
  ) : (
    'Save Expense'
  )}
</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-purple-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Set Your Budget</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Budget (KES)</label>
                <input
                  type="number"
                  step="0.01"
                  value={budgetSettings.budget}
                  onChange={(e) => setBudgetSettings({...budgetSettings, budget: parseFloat(e.target.value)})}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Alert Threshold (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={budgetSettings.alert_threshold}
                  onChange={(e) => setBudgetSettings({...budgetSettings, alert_threshold: parseInt(e.target.value)})}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You'll be alerted when spending reaches this percentage
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Budget'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-red-500/20">
            <h2 className="text-xl font-bold mb-4">Delete Expense</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this expense?</p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
      );
      }