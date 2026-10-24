import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Roadmap, RoadmapTask, DailyAction } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Layers,
  Plus,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [dailyActions, setDailyActions] = useState<DailyAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Switcher for plan duration
  const [duration, setDuration] = useState<number>(6);

  // Add custom task modal
  const [customTaskModalOpen, setCustomTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStage, setTaskStage] = useState('1. Understand the Customer');
  const [taskHours, setTaskHours] = useState<number>(3);
  const [taskPriority, setTaskPriority] = useState('MEDIUM');

  const loadRoadmap = async (targetDuration?: number) => {
    try {
      setLoading(true);
      const [rData, actions] = await Promise.all([
        api.getActiveRoadmap(),
        api.getDailyActions(),
      ]);

      if (!rData && targetDuration) {
        // Generate new if none
        const generated = await api.generateRoadmap({ durationMonths: targetDuration });
        setRoadmap(generated);
        setDuration(generated.durationMonths);
      } else if (rData) {
        setRoadmap(rData);
        setDuration(rData.durationMonths);
      }
      setDailyActions(actions);
    } catch (err) {
      console.error('Error loading roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchRoadmap = async () => {
      try {
        const [rData, actions] = await Promise.all([
          api.getActiveRoadmap(),
          api.getDailyActions(),
        ]);
        if (!ignore) {
          if (rData) {
            setRoadmap(rData);
            setDuration(rData.durationMonths);
          }
          setDailyActions(actions);
        }
      } catch (err) {
        console.error('Error loading roadmap:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchRoadmap();
    return () => {
      ignore = true;
    };
  }, []);

  const handleGenerateDuration = async (months: number) => {
    try {
      setLoading(true);
      const newRoadmap = await api.generateRoadmap({
        goalId: roadmap?.goalId,
        opportunityId: roadmap?.opportunityId,
        durationMonths: months,
      });
      setRoadmap(newRoadmap);
      setDuration(months);
      const actions = await api.getDailyActions();
      setDailyActions(actions);
    } catch (err) {
      console.error('Error generating new roadmap duration:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      await api.toggleRoadmapTask(taskId);
      const updated = await api.getActiveRoadmap();
      setRoadmap(updated);
      const actions = await api.getDailyActions();
      setDailyActions(actions);
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleAddCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadmap) return;
    try {
      await api.addCustomTask(roadmap.id, {
        title: taskTitle,
        description: taskDesc,
        stage: taskStage,
        estimatedHours: taskHours,
        priority: taskPriority,
      });
      setCustomTaskModalOpen(false);
      setTaskTitle('');
      setTaskDesc('');
      loadRoadmap(duration);
    } catch (err) {
      console.error('Error adding custom task:', err);
    }
  };

  if (loading && !roadmap) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#C74634] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#79675E]">Loading personalized roadmap...</p>
        </div>
      </div>
    );
  }

  // Group tasks by stage
  const stagesMap = (roadmap?.tasks || []).reduce<Record<string, RoadmapTask[]>>((acc, task) => {
    const stageName = task.stage || 'General';
    if (!acc[stageName]) acc[stageName] = [];
    acc[stageName].push(task);
    return acc;
  }, {});

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8">
      {/* Page Header & Duration Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5D8CB]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529] mb-2">
            <Layers className="w-3.5 h-3.5" />
            MILESTONE EXECUTION ENGINE
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
            {roadmap?.title || 'Personalized Execution Roadmap'}
          </h1>
          <p className="text-sm text-[#79675E] mt-1">
            Track your milestones across customer validation, MVP launch, and sustainable scaling.
          </p>
        </div>

        {/* 3 / 6 / 12-Month Switcher */}
        <div className="flex items-center gap-2 bg-[#FFF9F1] p-1.5 rounded-full border border-[#E5D8CB]">
          {[3, 6, 12].map((m) => (
            <button
              key={m}
              onClick={() => handleGenerateDuration(m)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                duration === m
                  ? 'bg-[#C74634] text-white shadow-2xs'
                  : 'text-[#79675E] hover:text-[#49362E]'
              }`}
            >
              {m} Months
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Focus Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Completion Card */}
        <div className="lg:col-span-4 bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#79675E]">
            Roadmap Completion
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-4xl font-display font-bold text-[#C74634]">
              {roadmap?.completionPercentage || 0}%
            </div>
            <span className="text-xs font-medium text-[#79675E]">
              {roadmap?.completedTasks || 0} of {roadmap?.totalTasks || 0} milestones done
            </span>
          </div>

          <div className="w-full bg-[#E5D8CB] h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#C74634] h-full rounded-full transition-all duration-500"
              style={{ width: `${roadmap?.completionPercentage || 0}%` }}
            />
          </div>

          <button
            onClick={() => setCustomTaskModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Custom Task
          </button>
        </div>

        {/* What Should I Do Today? Widget */}
        <div className="lg:col-span-8 bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5D8CB]">
            <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C74634]" />
              What Should I Do Today?
            </h2>
            <span className="text-xs text-[#79675E]">Top 3 prioritized tasks</span>
          </div>

          {dailyActions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dailyActions.map((act) => (
                <div
                  key={act.taskId}
                  className="p-3.5 rounded-2xl bg-white border border-[#E5D8CB] hover:border-[#C74634]/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-[#9E3529] bg-[#F4E2D9] px-2 py-0.5 rounded-full inline-block mb-1.5">
                      {act.priority}
                    </div>
                    <div className="text-xs font-bold text-[#49362E] line-clamp-2">{act.title}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E5D8CB]/50 flex items-center justify-between">
                    <span className="text-[10px] text-[#79675E]">{act.estimatedHours} hrs</span>
                    <button
                      onClick={() => handleToggleTask(act.taskId)}
                      className="text-[11px] font-bold text-[#C74634] hover:underline"
                    >
                      Complete ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#79675E] py-4 text-center">
              All prioritized tasks for today are checked off! Great execution.
            </p>
          )}
        </div>
      </div>

      {/* Stage-by-Stage Milestone Accordions */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#49362E]">Milestones by Stage</h2>

        {Object.entries(stagesMap).map(([stageName, tasks]) => {
          const completedInStage = tasks.filter((t) => t.isCompleted).length;
          const isStageDone = completedInStage === tasks.length && tasks.length > 0;

          return (
            <div
              key={stageName}
              className="bg-[#FFF9F1] rounded-3xl p-6 border border-[#E5D8CB] shadow-soft space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5D8CB]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isStageDone
                        ? 'bg-[#356B4B] text-white'
                        : 'bg-[#F4E2D9] text-[#9E3529]'
                    }`}
                  >
                    {isStageDone ? <Check className="w-4 h-4" /> : completedInStage}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#49362E]">{stageName}</h3>
                </div>

                <span className="text-xs font-semibold text-[#79675E]">
                  {completedInStage} of {tasks.length} tasks completed
                </span>
              </div>

              {/* Task Items */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-4 text-left ${
                      task.isCompleted
                        ? 'bg-[#FBF5EC]/60 border-[#E5D8CB] opacity-75'
                        : 'bg-white border-[#E5D8CB] hover:border-[#C74634]/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        task.isCompleted
                          ? 'bg-[#356B4B] border-[#356B4B] text-white shadow-2xs'
                          : 'border-[#E5D8CB] hover:border-[#C74634]'
                      }`}
                      aria-label="Toggle task status"
                    >
                      {task.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-sm font-bold ${
                            task.isCompleted ? 'line-through text-[#79675E]' : 'text-[#49362E]'
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-[#F4E2D9] text-[#9E3529]">
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-[#79675E] flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#79675E] leading-relaxed mt-1">{task.description}</p>

                      {task.successCriteria && (
                        <div className="text-[11px] text-[#49362E] font-medium mt-2 p-2 rounded-lg bg-[#F6E9D8]/50 border border-[#E5D8CB]">
                          <strong className="text-[#79675E]">Success Criteria:</strong> {task.successCriteria}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* ADD CUSTOM TASK MODAL                                        */}
      {/* ============================================================ */}
      <Modal
        isOpen={customTaskModalOpen}
        onClose={() => setCustomTaskModalOpen(false)}
        title="Add Custom Roadmap Task"
        maxWidth="md"
      >
        <form onSubmit={handleAddCustomTask} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Set up domain email and appointment link"
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
              Task Description
            </label>
            <textarea
              rows={2}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Provide context on what steps are needed..."
              className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Stage
              </label>
              <select
                value={taskStage}
                onChange={(e) => setTaskStage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              >
                <option value="1. Understand the Customer">1. Understand the Customer</option>
                <option value="2. Validate the Problem">2. Validate the Problem</option>
                <option value="3. Test Willingness to Pay">3. Test Willingness to Pay</option>
                <option value="4. Create MVP Solution">4. Create MVP Solution</option>
                <option value="5. Find Initial Customers">5. Find Initial Customers</option>
                <option value="6. Measure Costs & Actual Revenue">6. Measure Costs & Revenue</option>
                <option value="7. Improve the Offer">7. Improve the Offer</option>
                <option value="8. Scale Sustainably">8. Scale Sustainably</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={taskHours}
                onChange={(e) => setTaskHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D8CB]">
            <button
              type="button"
              onClick={() => setCustomTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#79675E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529]"
            >
              Add to Roadmap
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
