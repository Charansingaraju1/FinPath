import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Opportunity, OpportunityCategory } from '../types';
import { Modal } from '../components/common/Modal';
import { formatCurrency } from '../utils/formatters';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  SlidersHorizontal,
  Plus,
  Scale,
  Sparkles,
  Compass
} from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [categories, setCategories] = useState<OpportunityCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Comparison
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [comparedOpps, setComparedOpps] = useState<Opportunity[]>([]);

  // Submit problem modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newCostMin, setNewCostMin] = useState<number>(2000);
  const [newCostMax, setNewCostMax] = useState<number>(15000);

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const [opps, cats] = await Promise.all([
        api.searchOpportunities({
          query: searchQuery,
          categoryId: selectedCategory,
          difficulty: selectedDifficulty || undefined,
          validationStatus: selectedStatus || undefined,
        }),
        api.getCategories(),
      ]);
      setOpportunities(opps);
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStatus]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const [opps, cats] = await Promise.all([
          api.searchOpportunities({
            query: searchQuery,
            categoryId: selectedCategory,
            difficulty: selectedDifficulty || undefined,
            validationStatus: selectedStatus || undefined,
          }),
          api.getCategories(),
        ]);
        if (!ignore) {
          setOpportunities(opps);
          setCategories(cats);
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleToggleBookmark = async (id: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await api.toggleSaveOpportunity(id);
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, isSavedByCurrentUser: !o.isSavedByCurrentUser } : o))
      );
    } catch (err) {
      console.error('Error saving opportunity:', err);
    }
  };

  const handleOpenSubmitModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmitModalOpen(true);
  };

  const handleToggleCompare = (id: number) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((item) => item !== id));
    } else {
      if (selectedForComparison.length >= 3) {
        alert('You can compare a maximum of 3 opportunities simultaneously.');
        return;
      }
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  const openComparisonModal = async () => {
    if (selectedForComparison.length === 0) return;
    try {
      const data = await api.compareOpportunities(selectedForComparison);
      setComparedOpps(data);
      setComparisonModalOpen(true);
    } catch (err) {
      console.error('Error comparing opportunities:', err);
    }
  };

  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.submitOpportunity({
        title: newTitle,
        description: newDesc,
        targetCustomer: newTarget,
        potentialSolution: newSolution,
        requiredSkills: newSkills,
        initialCostMin: newCostMin,
        initialCostMax: newCostMax,
      });
      setSubmitModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewTarget('');
      setNewSolution('');
      setNewSkills('');
      fetchOpportunities();
    } catch (err) {
      console.error('Error submitting problem:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5D8CB]">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
            Find Problems Worth Solving
          </h1>
          <p className="text-sm sm:text-base text-[#79675E] mt-1 max-w-2xl">
            Explore practical opportunities that match your skills, resources, and financial goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedForComparison.length > 0 && (
            <button
              onClick={openComparisonModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs text-[#9E3529] bg-[#F4E2D9] border border-[#D9A28F] hover:bg-[#E7BFA9]/70 transition-colors shadow-2xs"
            >
              <Scale className="w-4 h-4" />
              Compare ({selectedForComparison.length}/3)
            </button>
          )}

          <button
            onClick={handleOpenSubmitModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Submit Problem
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#FFF9F1] rounded-2xl p-4 sm:p-5 border border-[#E5D8CB] shadow-soft space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 rounded-xl border border-[#E5D8CB] bg-white focus-within:border-[#C74634]">
            <Search className="w-4 h-4 text-[#79675E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, skills (React, SEO, math), or customer type..."
              className="w-full pl-10 pr-4 py-2.5 text-sm text-[#49362E] placeholder-[#79675E]/50 focus:outline-hidden bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] shadow-2xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E5D8CB]/60 text-xs">
          <span className="font-bold text-[#79675E] flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-1.5 rounded-lg border border-[#E5D8CB] bg-white text-[#49362E] focus:outline-hidden"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5D8CB] bg-white text-[#49362E] focus:outline-hidden"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5D8CB] bg-white text-[#49362E] focus:outline-hidden"
          >
            <option value="">All Validation Stages</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="RESEARCHING">Researching</option>
            <option value="PROBLEM_CONFIRMED">Problem Confirmed</option>
            <option value="READY_TO_BUILD">Ready to Build</option>
          </select>

          {(selectedCategory || selectedDifficulty || selectedStatus || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory(undefined);
                setSelectedDifficulty('');
                setSelectedStatus('');
                setSearchQuery('');
              }}
              className="text-xs text-[#C74634] font-semibold hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities Card Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-[#C74634] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#79675E]">Finding matching opportunities...</p>
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const isCompared = selectedForComparison.includes(opp.id);

            return (
              <div
                key={opp.id}
                className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft flex flex-col justify-between hover:border-[#C74634]/50 transition-all text-left relative group"
              >
                <div>
                  {/* Top Bar: Category, Fit Score, Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-[#79675E] bg-[#F4E2D9] px-2.5 py-0.5 rounded-full">
                      {opp.categoryName || 'General'}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#356B4B] bg-[#DCE8DE] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Fit: {opp.userCalculatedFitScore || opp.baseFitScore}
                      </span>
                      <button
                        onClick={() => handleToggleBookmark(opp.id)}
                        className="p-1 rounded-full text-[#79675E] hover:text-[#C74634] transition-colors"
                        title={opp.isSavedByCurrentUser ? 'Remove bookmark' : 'Save opportunity'}
                      >
                        {opp.isSavedByCurrentUser ? (
                          <BookmarkCheck className="w-5 h-5 text-[#C74634] fill-current" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Target */}
                  <h3 className="font-display text-xl font-bold text-[#49362E] mb-2 leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-[#79675E] mb-2.5">
                    <strong className="text-[#49362E]">Customer:</strong> {opp.targetCustomer}
                  </p>

                  <p className="text-xs text-[#79675E] leading-relaxed line-clamp-3 mb-4">
                    {opp.description}
                  </p>

                  {/* Proposed Solution snippet */}
                  <div className="p-3 rounded-xl bg-white border border-[#E5D8CB] mb-4 text-xs text-[#79675E]">
                    <span className="font-bold text-[#49362E] block mb-0.5">Potential Solution:</span>
                    <span className="line-clamp-2">{opp.potentialSolution}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5D8CB] space-y-3">
                  <div className="text-[11px] text-[#79675E]">
                    <span className="font-bold text-[#49362E]">Required Skills:</span> {opp.requiredSkills}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#79675E]">
                    <span>
                      Cost: <strong className="text-[#49362E]">{formatCurrency(opp.initialCostMin)} - {formatCurrency(opp.initialCostMax)}</strong>
                    </span>
                    <span className="font-semibold text-[#9E3529] bg-[#F4E2D9] px-2 py-0.5 rounded">
                      {opp.validationStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Bottom Actions: Compare & View Workspace */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(opp.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                        isCompared
                          ? 'bg-[#C74634] text-white border-[#C74634]'
                          : 'bg-white text-[#79675E] border-[#E5D8CB] hover:border-[#C74634]'
                      }`}
                    >
                      {isCompared ? 'Selected' : '+ Compare'}
                    </button>

                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#C74634] hover:text-[#9E3529]"
                    >
                      Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-[#FFF9F1] rounded-3xl border border-[#E5D8CB] p-8 space-y-3">
          <Compass className="w-10 h-10 text-[#79675E] mx-auto opacity-60" />
          <h3 className="font-display text-xl font-bold text-[#49362E]">No Opportunities Found</h3>
          <p className="text-xs text-[#79675E] max-w-sm mx-auto">
            Try adjusting your search filters or submit a new problem you have noticed in your community.
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* COMPARISON MODAL (UP TO 3 OPPORTUNITIES)                     */}
      {/* ============================================================ */}
      <Modal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        title="Compare Opportunities"
        maxWidth="4xl"
      >
        <div className="space-y-6 text-left">
          <p className="text-xs text-[#79675E]">
            Comparing feasibility, customer demand, startup cost, and required skills side-by-side.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedOpps.map((opp) => (
              <div key={opp.id} className="p-4 rounded-2xl bg-white border border-[#E5D8CB] space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#356B4B] bg-[#DCE8DE] px-2 py-0.5 rounded-full">
                    Fit Score: {opp.userCalculatedFitScore || opp.baseFitScore}
                  </span>
                  <h4 className="font-display text-base font-bold text-[#49362E] mt-2 leading-snug">
                    {opp.title}
                  </h4>
                </div>

                <div>
                  <span className="font-bold text-[#79675E] block">Target Customer:</span>
                  <span className="text-[#49362E]">{opp.targetCustomer}</span>
                </div>

                <div>
                  <span className="font-bold text-[#79675E] block">Required Skills:</span>
                  <span className="text-[#49362E]">{opp.requiredSkills}</span>
                </div>

                <div>
                  <span className="font-bold text-[#79675E] block">Estimated Startup Cost:</span>
                  <span className="text-[#49362E] font-semibold">{formatCurrency(opp.initialCostMin)} - {formatCurrency(opp.initialCostMax)}</span>
                </div>

                <div>
                  <span className="font-bold text-[#79675E] block">Validation Stage:</span>
                  <span className="text-[#9E3529] font-medium bg-[#F4E2D9] px-2 py-0.5 rounded">
                    {opp.validationStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/opportunities/${opp.id}`}
                    className="block text-center w-full py-2 rounded-xl font-semibold text-xs text-white bg-[#C74634]"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/* SUBMIT PROBLEM MODAL                                         */}
      {/* ============================================================ */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit a Problem Worth Solving"
        maxWidth="lg"
      >
        <form onSubmit={handleProblemSubmit} className="space-y-4 text-left">
          <p className="text-xs text-[#79675E]">
            Notice a friction point in a local business, student life, or workplace? Record it here to validate demand before building.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Problem Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Small contractors lose hours chasing unpaid invoices"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Target Customer
            </label>
            <input
              type="text"
              required
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="e.g. Freelance electricians, trade subcontractors"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Problem Description
            </label>
            <textarea
              rows={2}
              required
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe the recurring headache and why current solutions are inadequate..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Potential Solution You Could Deliver
            </label>
            <textarea
              rows={2}
              required
              value={newSolution}
              onChange={(e) => setNewSolution(e.target.value)}
              placeholder="e.g. Automated payment reminders with online checkout links..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Skills Needed
            </label>
            <input
              type="text"
              required
              value={newSkills}
              onChange={(e) => setNewSkills(e.target.value)}
              placeholder="e.g. Zapier automation, accounting software setup"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden focus:border-[#C74634]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Estimated Min Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={newCostMin}
                onChange={(e) => setNewCostMin(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Estimated Max Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={newCostMax}
                onChange={(e) => setNewCostMax(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D8CB]">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#79675E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529]"
            >
              {submitting ? 'Submitting...' : 'Save & Start Validating'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
