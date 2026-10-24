import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Transaction, FinancialGoal } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import {
  Receipt,
  Plus,
  Download,
  Trash2,
  Pencil,
  Filter
} from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('');

  // Add Transaction Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [txType, setTxType] = useState<string>('PERSONAL_EXPENSE');
  const [txCategory, setTxCategory] = useState<string>('Groceries & Food');
  const [txAmount, setTxAmount] = useState<number>(1500);
  const [txDesc, setTxDesc] = useState<string>('');
  const [txDate, setTxDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [txGoalId, setTxGoalId] = useState<number | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Edit Transaction Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editType, setEditType] = useState<string>('PERSONAL_EXPENSE');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editDesc, setEditDesc] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editGoalId, setEditGoalId] = useState<number | undefined>();
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [txList, sum, userGoals] = await Promise.all([
        api.getTransactions(),
        api.getTransactionSummary(),
        api.getGoals(),
      ]);
      setTransactions(txList);
      setSummary(sum);
      setGoals(userGoals);
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchTransactions = async () => {
      try {
        const [txList, sum, userGoals] = await Promise.all([
          api.getTransactions(),
          api.getTransactionSummary(),
          api.getGoals(),
        ]);
        if (!ignore) {
          setTransactions(txList);
          setSummary(sum);
          setGoals(userGoals);
        }
      } catch (err) {
        console.error('Error loading transactions:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchTransactions();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createTransaction({
        type: txType as any,
        category: txCategory,
        amount: txAmount,
        description: txDesc,
        transactionDate: txDate,
        goalId: txGoalId,
      });
      setModalOpen(false);
      setTxDesc('');
      loadData();
    } catch (err) {
      console.error('Error recording transaction:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.deleteTransaction(deleteId);
      setDeleteId(null);
      loadData();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleStartEdit = (tx: Transaction) => {
    setEditId(tx.id);
    setEditType(tx.type);
    setEditCategory(tx.category);
    setEditAmount(tx.amount);
    setEditDesc(tx.description || '');
    setEditDate(tx.transactionDate);
    setEditGoalId(tx.goalId);
    setEditModalOpen(true);
  };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      setEditSubmitting(true);
      await api.updateTransaction(editId, {
        type: editType as any,
        category: editCategory,
        amount: editAmount,
        description: editDesc,
        transactionDate: editDate,
        goalId: editGoalId,
      });
      setEditModalOpen(false);
      setEditId(null);
      loadData();
    } catch (err) {
      console.error('Error updating transaction:', err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      await api.downloadTransactionsCsv();
    } catch (err) {
      console.error('Error downloading CSV:', err);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType && t.type !== filterType) return false;
    if (searchCategory && !t.category.toLowerCase().includes(searchCategory.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5D8CB]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529] mb-2">
            <Receipt className="w-3.5 h-3.5" />
            CASH FLOW & ACCURATE ACCOUNTING
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
            Financial Transactions
          </h1>
          <p className="text-sm text-[#79675E] mt-1">
            Separate personal living expenses from business income and goal savings contributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs text-[#49362E] bg-[#FFF9F1] border border-[#E5D8CB] hover:bg-[#F4E2D9] transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#79675E]" />
            Export CSV
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Transaction
          </button>
        </div>
      </div>

      {/* 4 Summary Cards: Personal vs Business */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Personal Income */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Personal Income
          </span>
          <div className="text-2xl font-bold font-display text-[#356B4B] mt-1">
            {formatCurrency(summary.personalIncome || 0)}
          </div>
          <span className="text-[10px] text-[#79675E]">Salary & recurring inflows</span>
        </div>

        {/* Personal Expense */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Personal Expenses
          </span>
          <div className="text-2xl font-bold font-display text-[#9E3529] mt-1">
            {formatCurrency(summary.personalExpense || 0)}
          </div>
          <span className="text-[10px] text-[#79675E]">Essential & leisure costs</span>
        </div>

        {/* Business Net Margin */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Business Net Margin
          </span>
          <div className={`text-2xl font-bold font-display mt-1 ${
            (summary.businessNetProfit || 0) >= 0 ? 'text-[#356B4B]' : 'text-[#9E3529]'
          }`}>
            {formatCurrency(summary.businessNetProfit || 0)}
          </div>
          <span className="text-[10px] text-[#79675E]">
            Rev: {formatCurrency(summary.businessIncome || 0)} | Costs: {formatCurrency(summary.businessExpense || 0)}
          </span>
        </div>

        {/* Goal Savings Allocated */}
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Savings Allocated
          </span>
          <div className="text-2xl font-bold font-display text-[#C74634] mt-1">
            {formatCurrency(summary.savingsAllocated || 0)}
          </div>
          <span className="text-[10px] text-[#79675E]">Transferred towards target goals</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFF9F1] p-4 rounded-2xl border border-[#E5D8CB] shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-[#79675E] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter By:
          </span>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5D8CB] bg-white text-[#49362E]"
          >
            <option value="">All Categories</option>
            <option value="PERSONAL_INCOME">Personal Income</option>
            <option value="PERSONAL_EXPENSE">Personal Expense</option>
            <option value="BUSINESS_INCOME">Business Revenue</option>
            <option value="BUSINESS_EXPENSE">Business Expense</option>
            <option value="GOAL_ALLOCATION">Goal Allocation</option>
            <option value="SAVINGS_CONTRIBUTION">Savings Contribution</option>
          </select>

          <input
            type="text"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            placeholder="Search category (e.g. Hosting, Food)..."
            className="px-3 py-1.5 rounded-lg border border-[#E5D8CB] bg-white text-[#49362E] placeholder-[#79675E]/50"
          />
        </div>

        <span className="text-[#79675E]">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </span>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#FFF9F1] rounded-3xl border border-[#E5D8CB] shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#79675E]">Loading transactions...</div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6E9D8] text-[#79675E] uppercase font-bold tracking-wider border-b border-[#E5D8CB]">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Goal Linked</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D8CB]/70">
                {filteredTransactions.map((tx) => {
                  const isPositive = tx.type === 'PERSONAL_INCOME' || tx.type === 'BUSINESS_INCOME';

                  return (
                    <tr key={tx.id} className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-6 text-[#79675E] whitespace-nowrap">{tx.transactionDate}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          tx.type.startsWith('BUSINESS')
                            ? 'bg-[#E7BFA9]/50 text-[#9E3529]'
                            : tx.type.startsWith('GOAL') || tx.type.startsWith('SAVINGS')
                            ? 'bg-[#DCE8DE] text-[#356B4B]'
                            : 'bg-[#F4E2D9] text-[#79675E]'
                        }`}>
                          {tx.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#49362E]">{tx.category}</td>
                      <td className="py-4 px-6 text-[#79675E] max-w-xs truncate">{tx.description || '—'}</td>
                      <td className="py-4 px-6 font-bold whitespace-nowrap">
                        <span className={isPositive ? 'text-[#356B4B]' : 'text-[#9E3529]'}>
                          {isPositive ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#79675E]">{tx.goalTitle || '—'}</td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(tx)}
                            className="p-1.5 text-[#79675E] hover:text-[#C74634] transition-colors rounded"
                            title="Edit transaction"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(tx.id)}
                            className="p-1.5 text-[#79675E] hover:text-[#C74634] transition-colors rounded"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#79675E] space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-[#79675E] opacity-50" />
            <p>No transactions match your current filters.</p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* RECORD TRANSACTION MODAL                                     */}
      {/* ============================================================ */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Financial Transaction"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTransaction} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Transaction Type
            </label>
            <select
              value={txType}
              onChange={(e) => setTxType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            >
              <option value="PERSONAL_EXPENSE">Personal Expense (Rent, Groceries, Discretionary)</option>
              <option value="PERSONAL_INCOME">Personal Take-Home Income</option>
              <option value="BUSINESS_INCOME">Business Revenue / Client Inflow</option>
              <option value="BUSINESS_EXPENSE">Business Operational Cost (Hosting, Domains, Tools)</option>
              <option value="GOAL_ALLOCATION">Goal Allocation (Direct deposit into target)</option>
              <option value="SAVINGS_CONTRIBUTION">Savings Reserve Contribution</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={txCategory}
              onChange={(e) => setTxCategory(e.target.value)}
              placeholder="e.g. Client Pilot Fee, Groceries, Software Hosting"
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={txAmount}
                onChange={(e) => setTxAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={txDesc}
              onChange={(e) => setTxDesc(e.target.value)}
              placeholder="Notes on client name, receipt, or store..."
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          {(txType === 'GOAL_ALLOCATION' || txType === 'SAVINGS_CONTRIBUTION') && goals.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Link to Goal (Increments allocated progress)
              </label>
              <select
                value={txGoalId || ''}
                onChange={(e) => setTxGoalId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              >
                <option value="">None (General balance)</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({formatCurrency(g.currentAllocated)} / {formatCurrency(g.targetAmount)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D8CB]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#79675E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529]"
            >
              {submitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* EDIT TRANSACTION MODAL                                       */}
      {/* ============================================================ */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Financial Transaction"
        maxWidth="md"
      >
        <form onSubmit={handleUpdateTransaction} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Transaction Type
            </label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            >
              <option value="PERSONAL_EXPENSE">Personal Expense (Rent, Groceries, Discretionary)</option>
              <option value="PERSONAL_INCOME">Personal Take-Home Income</option>
              <option value="BUSINESS_INCOME">Business Revenue / Client Inflow</option>
              <option value="BUSINESS_EXPENSE">Business Operational Cost (Hosting, Domains, Tools)</option>
              <option value="GOAL_ALLOCATION">Goal Allocation (Direct deposit into target)</option>
              <option value="SAVINGS_CONTRIBUTION">Savings Reserve Contribution</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={editAmount}
                onChange={(e) => setEditAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          {(editType === 'GOAL_ALLOCATION' || editType === 'SAVINGS_CONTRIBUTION') && goals.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Link to Goal (Increments allocated progress)
              </label>
              <select
                value={editGoalId || ''}
                onChange={(e) => setEditGoalId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              >
                <option value="">None (General balance)</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({formatCurrency(g.currentAllocated)} / {formatCurrency(g.targetAmount)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D8CB]">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#79675E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editSubmitting}
              className="px-5 py-2 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529]"
            >
              {editSubmitting ? 'Updating...' : 'Update Transaction'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-[#79675E]">
            Are you sure you want to delete this transaction record? This will update your cash flow summaries.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 text-xs font-semibold text-[#79675E]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529]"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
