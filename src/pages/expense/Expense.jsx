import React, { useState, useEffect } from 'react';
import { Save, Loader2, X } from 'lucide-react';
import Button from '../../components/common/Button';
import TableActions from '../../components/common/TableActions';
import ConfirmModal from '../../components/common/ConfirmModal';
import api from '../../utils/api';

const Expense = () => {
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  
  const [expensesList, setExpensesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/pg/add_expense/');
      setExpensesList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (err) {
      console.error('Failed to fetch expenses', err);
      // Keep expenses empty on error rather than showing old data
      setExpensesList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSave = async () => {
    if (!expense.trim() || !amount) {
      setError('Please enter both Expense name and Amount');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (editingExpenseId) {
        await api.put('/api/pg/add_expense/', {
          expense_id: editingExpenseId,
          expense_name: expense.trim(),
          amount: Number(amount)
        });
        setEditingExpenseId(null);
      } else {
        await api.post('/api/pg/add_expense/', {
          expense_name: expense.trim(),
          amount: Number(amount)
        });
      }
      
      // Clear form
      setExpense('');
      setAmount('');
      
      // Refresh list
      fetchExpenses();
    } catch (err) {
      console.error('Failed to save expense', err);
      setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to save expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingExpenseId(item.expense_id);
    setExpense(item.expense_name || item.name);
    setAmount(item.amount);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setExpense('');
    setAmount('');
    setError('');
  };

  const handleDeleteClick = (item) => {
    setExpenseToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await api.delete('/api/pg/add_expense/', { data: { expense_id: expenseToDelete.expense_id } });
      fetchExpenses();
    } catch (err) {
      console.error('Failed to delete expense', err);
      setError('Failed to delete expense. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="page-container">
      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="form-section-card theme-blue" style={{ marginBottom: '24px' }}>
        <div className="form-section-body" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ margin: 0, flex: '1 1 250px' }}>
              <label className="form-label">Expense <span className="required">*</span></label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter expense description" 
                value={expense}
                onChange={(e) => {
                  setExpense(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
            
            <div className="form-group" style={{ margin: 0, flex: '1 1 250px' }}>
              <label className="form-label">Amount (₹) <span className="required">*</span></label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter amount" 
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setAmount(val);
                  if (error) setError('');
                }}
              />
            </div>

            <div style={{ flex: '0 0 auto', display: 'flex', gap: '8px' }}>
              {editingExpenseId && (
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit} 
                  disabled={isSaving}
                  style={{ height: '44px', padding: '0 20px', justifyContent: 'center', fontSize: '15px', fontWeight: '600' }}
                >
                  <span className="hide-on-mobile">Cancel</span>
                </Button>
              )}
              <Button 
                variant="primary" 
                onClick={handleSave} 
                disabled={isSaving} 
                icon={isSaving ? <Loader2 size={20} className="pf-spin" /> : <Save size={20} />} 
                style={{ height: '44px', padding: '0 30px', minWidth: '130px', justifyContent: 'center', fontSize: '15px', fontWeight: '600' }}
              >
                <span className="hide-on-mobile">{isSaving ? 'Saving...' : (editingExpenseId ? 'Update' : 'Save')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="table-container list-table-container">
          <table className="data-table list-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', paddingLeft: '24px', width: '50%' }}>Expense</th>
                <th style={{ textAlign: 'left', width: '30%' }}>Amount</th>
                <th style={{ textAlign: 'center', width: '20%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Loading expenses...</td>
                </tr>
              ) : expensesList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No expenses found.</td>
                </tr>
              ) : (
                expensesList.map((item, index) => (
                  <tr key={item.expense_id || index}>
                    <td className="font-medium text-slate-800" style={{ textAlign: 'left', paddingLeft: '24px' }}>
                      {item.expense_name || item.name}
                    </td>
                    <td className="font-medium text-slate-700" style={{ textAlign: 'left' }}>
                      ₹ {Number(item.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="actions-cell" style={{ textAlign: 'center' }}>
                      <TableActions 
                        onEdit={() => handleEditClick(item)}
                        onDelete={() => handleDeleteClick(item)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete the expense "${expenseToDelete?.expense_name || expenseToDelete?.name}"?`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Expense;
