import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Opportunity, ValidationWorkspace } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Save,
  Calculator,
  Layers
} from 'lucide-react';

export const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const opportunityId = Number(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [workspace, setWorkspace] = useState<ValidationWorkspace | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add Interview Note Modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [intervieweeName, setIntervieweeName] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [confirmedProblem, setConfirmedProblem] = useState(true);
  const [willingnessToPay, setWillingnessToPay] = useState<number>(0);
  const [interviewDate, setInterviewDate] = useState(() => new Date().toISOString().split('T')[0]);

  // AI Assistant Suggestions
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        setLoading(true);
        const [opp, val] = await Promise.all([
          api.getOpportunity(opportunityId),
          api.getValidation(opportunityId),
        ]);
        if (!ignore) {
          setOpportunity(opp);
          setWorkspace(val);
        }
      } catch (err) {
        console.error('Error loading opportunity validation workspace:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (opportunityId) loadData();
    return () => {
      ignore = true;
    };
  }, [opportunityId]);

  const handleSaveWorkspace = async () => {
    if (!workspace) return;
    try {
      setSaving(true);
      const updated = await api.updateValidation(opportunityId, workspace);
      setWorkspace(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving validation workspace:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;
    try {
      await api.addInterviewNote(workspace.id, {
        intervieweeName,
        customerType,
        notes: interviewNotes,
        confirmedProblem,
        willingnessToPayAmount: willingnessToPay,
        interviewDate,
      });

      // Refresh workspace to update counts
      const updated = await api.getValidation(opportunityId);
      setWorkspace(updated);
      setNoteModalOpen(false);
      setIntervieweeName('');
      setCustomerType('');
      setInterviewNotes('');
      setWillingnessToPay(0);
    } catch (err) {
      console.error('Error adding interview note:', err);
    }
  };

  const handleGenerateAiQuestions = async () => {
    if (!opportunity) return;
    try {
      setAiLoading(true);
      const res = await api.aiInterviewQuestions(opportunity.title, opportunity.targetCustomer);
      setAiSuggestions(res.questions);
    } catch (err) {
      console.error('Error generating AI interview questions:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateRoadmapForThis = async () => {
    try {
      await api.generateRoadmap({
        opportunityId,
        durationMonths: 6,
      });
      navigate('/roadmap');
    } catch (err) {
      console.error('Error generating roadmap:', err);
    }
  };

  if (loading || !opportunity || !workspace) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#C74634] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#79675E]">Loading validation workspace...</p>
        </div>
      </div>
    );
  }

  const stages = [
    { key: 'NOT_STARTED', label: 'Not Started' },
    { key: 'RESEARCHING', label: 'Researching' },
    { key: 'INTERVIEWING', label: 'Interviewing' },
    { key: 'PROBLEM_CONFIRMED', label: 'Problem Confirmed' },
    { key: 'WILLINGNESS_TO_PAY_TESTED', label: 'Willingness to Pay Tested' },
    { key: 'READY_TO_BUILD', label: 'Ready to Build' },
    { key: 'REJECTED', label: 'Needs Revision / Pivoted' },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5D8CB]">
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#79675E] hover:text-[#C74634]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunities
        </Link>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-[#356B4B] bg-[#DCE8DE] px-3 py-1 rounded-full">
              Workspace Saved
            </span>
          )}
          <button
            onClick={handleSaveWorkspace}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Workspace'}
          </button>
        </div>
      </div>

      {/* Opportunity Overview Header Card */}
      <div className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-8 border border-[#E5D8CB] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-wider uppercase text-[#C74634]">
            Validation Workspace
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#356B4B] bg-[#DCE8DE] px-3 py-1 rounded-full">
              Fit Score: {opportunity.userCalculatedFitScore || opportunity.baseFitScore} / 100
            </span>
            <span className="text-xs font-bold text-[#9E3529] bg-[#F4E2D9] px-3 py-1 rounded-full">
              Validation Score: {workspace.validationScore} / 100
            </span>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#49362E]">
          {opportunity.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white border border-[#E5D8CB] text-xs">
          <div>
            <span className="font-bold text-[#79675E] block">Target Customer:</span>
            <span className="text-[#49362E] font-medium">{opportunity.targetCustomer}</span>
          </div>
          <div>
            <span className="font-bold text-[#79675E] block">Startup Cost Range:</span>
            <span className="text-[#49362E] font-medium">{formatCurrency(opportunity.initialCostMin)} - {formatCurrency(opportunity.initialCostMax)}</span>
          </div>
          <div>
            <span className="font-bold text-[#79675E] block">Required Skills:</span>
            <span className="text-[#49362E] font-medium">{opportunity.requiredSkills}</span>
          </div>
        </div>

        {/* Validation Stage Selector */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-2">
            Current Validation Stage:
          </label>
          <div className="flex flex-wrap gap-2">
            {stages.map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => setWorkspace({ ...workspace, stage: st.key })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  workspace.stage === st.key
                    ? 'bg-[#C74634] text-white border-[#C74634] shadow-xs'
                    : 'bg-white text-[#79675E] border-[#E5D8CB] hover:border-[#C74634]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Validation Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Hypotheses & Evidence */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-4">
            <h3 className="font-display text-xl font-bold text-[#49362E]">Problem Hypotheses & Discovery</h3>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                Core Problem Statement
              </label>
              <textarea
                rows={2}
                value={workspace.problemStatement || ''}
                onChange={(e) => setWorkspace({ ...workspace, problemStatement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                Hypotheses to Test
              </label>
              <textarea
                rows={3}
                value={workspace.hypothesesToTest || ''}
                onChange={(e) => setWorkspace({ ...workspace, hypothesesToTest: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                Current Alternatives Used by Customers
              </label>
              <input
                type="text"
                value={workspace.currentAlternatives || ''}
                onChange={(e) => setWorkspace({ ...workspace, currentAlternatives: e.target.value })}
                placeholder="e.g. Spreadsheets, manual paper logs, WhatsApp messages..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                Evidence of Willingness to Pay
              </label>
              <textarea
                rows={2}
                value={workspace.willingnessToPayEvidence || ''}
                onChange={(e) => setWorkspace({ ...workspace, willingnessToPayEvidence: e.target.value })}
                placeholder="e.g. 2 clinic owners confirmed they would pay ₹5,000/mo for automated SMS reminders..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1.5">
                Next Validation Experiment
              </label>
              <input
                type="text"
                value={workspace.nextExperiment || ''}
                onChange={(e) => setWorkspace({ ...workspace, nextExperiment: e.target.value })}
                placeholder="e.g. Call 3 local salons and test offering a 14-day zero-risk trial..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Action Links: Calculator & Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/calculator"
              className="p-5 rounded-2xl bg-[#FFF9F1] border border-[#E5D8CB] hover:border-[#C74634] transition-colors flex items-center justify-between group shadow-soft"
            >
              <div>
                <div className="font-display font-bold text-base text-[#49362E] group-hover:text-[#C74634]">
                  Revenue Calculator
                </div>
                <div className="text-xs text-[#79675E] mt-0.5">Model break-even & cash flow</div>
              </div>
              <Calculator className="w-5 h-5 text-[#C74634]" />
            </Link>

            <button
              onClick={handleCreateRoadmapForThis}
              className="p-5 rounded-2xl bg-[#FFF9F1] border border-[#E5D8CB] hover:border-[#C74634] transition-colors flex items-center justify-between group shadow-soft text-left"
            >
              <div>
                <div className="font-display font-bold text-base text-[#49362E] group-hover:text-[#C74634]">
                  Generate Roadmap
                </div>
                <div className="text-xs text-[#79675E] mt-0.5">Build 6-month plan for this</div>
              </div>
              <Layers className="w-5 h-5 text-[#C74634]" />
            </button>
          </div>
        </div>

        {/* Right: Customer Interview Log & AI Questions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Discovery Counter Card */}
          <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D8CB] mb-4">
              <h3 className="font-display text-lg font-bold text-[#49362E]">Customer Interview Evidence</h3>
              <button
                onClick={() => setNoteModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#C74634] hover:bg-[#9E3529] px-3 py-1.5 rounded-full"
              >
                <Plus className="w-3.5 h-3.5" /> Log Interview
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white rounded-xl border border-[#E5D8CB] text-center">
                <span className="text-[11px] font-bold text-[#79675E] uppercase">Interviewed</span>
                <div className="text-2xl font-bold font-display text-[#49362E] mt-1">
                  {workspace.peopleInterviewedCount}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E5D8CB] text-center">
                <span className="text-[11px] font-bold text-[#79675E] uppercase">Problem Confirmed</span>
                <div className="text-2xl font-bold font-display text-[#356B4B] mt-1">
                  {workspace.confirmedProblemCount}
                </div>
              </div>
            </div>

            {/* List of interview notes */}
            {workspace.interviewNotes && workspace.interviewNotes.length > 0 ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {workspace.interviewNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-white border border-[#E5D8CB] text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[#49362E]">
                      <span>{note.intervieweeName || 'Anonymous Customer'}</span>
                      <span className="text-[10px] text-[#79675E]">{note.interviewDate}</span>
                    </div>
                    <p className="text-[#79675E] leading-relaxed line-clamp-2">{note.notes}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      <span className={note.confirmedProblem ? 'text-[#356B4B] font-bold' : 'text-[#79675E]'}>
                        {note.confirmedProblem ? '✓ Confirmed Problem' : 'Problem not acute'}
                      </span>
                      {note.willingnessToPayAmount > 0 && (
                        <span className="text-[#9E3529] font-bold">
                          Willing to pay: {formatCurrency(note.willingnessToPayAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#79675E]">
                No customer interviews logged yet. Click "+ Log Interview" to record notes after customer discovery conversations.
              </div>
            )}
          </div>

          {/* AI Discovery Question Generator */}
          <div className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#49362E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C74634]" />
                Discovery Question Prompts
              </h3>
              <button
                onClick={handleGenerateAiQuestions}
                disabled={aiLoading}
                className="text-xs font-bold text-[#C74634] hover:underline"
              >
                {aiLoading ? 'Drafting...' : 'Generate Prompts'}
              </button>
            </div>

            <p className="text-xs text-[#79675E] leading-relaxed">
              Use open-ended discovery questions to uncover real customer pain without pitching prematurely.
            </p>

            {aiSuggestions.length > 0 ? (
              <ul className="space-y-2 text-xs text-[#49362E] p-3 rounded-xl bg-white border border-[#E5D8CB]">
                {aiSuggestions.map((q, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {q}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-[#79675E] italic">
                Click "Generate Prompts" to load interview discovery questions customized for this opportunity.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LOG CUSTOMER INTERVIEW MODAL                                 */}
      {/* ============================================================ */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Record Customer Discovery Interview"
        maxWidth="md"
      >
        <form onSubmit={handleAddNote} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Interviewee Name / Business
            </label>
            <input
              type="text"
              required
              value={intervieweeName}
              onChange={(e) => setIntervieweeName(e.target.value)}
              placeholder="e.g. Dr. Sarah Miller (Local Dental Clinic)"
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Customer Segment
            </label>
            <input
              type="text"
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              placeholder="e.g. Small business owner, clinic manager"
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Detailed Interview Notes & Quotes
            </label>
            <textarea
              rows={4}
              required
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              placeholder="What specific tasks are painful? What workarounds are they using? What did they say word for word?"
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          <div className="p-3 bg-[#F6E9D8] rounded-xl border border-[#E5D8CB] flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="confirmedProblemCheck"
              checked={confirmedProblem}
              onChange={(e) => setConfirmedProblem(e.target.checked)}
              className="w-4 h-4 text-[#C74634] rounded accent-[#C74634]"
            />
            <label htmlFor="confirmedProblemCheck" className="font-semibold text-[#49362E] cursor-pointer">
              Prospect confirmed this is an urgent, recurring problem
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Willingness to Pay (₹)
              </label>
              <input
                type="number"
                min="0"
                value={willingnessToPay}
                onChange={(e) => setWillingnessToPay(Number(e.target.value))}
                placeholder="0 if not tested yet"
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Interview Date
              </label>
              <input
                type="date"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D8CB]">
            <button
              type="button"
              onClick={() => setNoteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#79675E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529]"
            >
              Save Interview Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
