import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Opportunity } from '../types';
import { Shield } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, opps] = await Promise.all([
        api.getAdminMetrics(),
        api.getAllOpportunitiesAdmin(),
      ]);
      setMetrics(m);
      setOpportunities(opps);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchAdminData = async () => {
      try {
        const [m, opps] = await Promise.all([
          api.getAdminMetrics(),
          api.getAllOpportunitiesAdmin(),
        ]);
        if (!ignore) {
          setMetrics(m);
          setOpportunities(opps);
        }
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchAdminData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleApproval = async (id: number) => {
    try {
      await api.toggleOpportunityApproval(id);
      loadData();
    } catch (err) {
      console.error('Error toggling approval:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#C74634] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#79675E]">Loading administrator dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5D8CB]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2D9] text-xs font-semibold text-[#9E3529] mb-2">
          <Shield className="w-3.5 h-3.5" />
          ADMINISTRATION CONSOLE
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#49362E]">
          Platform Operations & Content Review
        </h1>
        <p className="text-sm text-[#79675E] mt-1">
          Review user-submitted problems, manage opportunity catalog status, and inspect aggregate adoption metrics.
        </p>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Total Users
          </span>
          <div className="text-3xl font-display font-bold text-[#49362E] mt-1">
            {metrics.totalUsers || 0}
          </div>
          <span className="text-[10px] text-[#79675E]">Registered accounts</span>
        </div>

        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Opportunities
          </span>
          <div className="text-3xl font-display font-bold text-[#C74634] mt-1">
            {metrics.totalOpportunities || 0}
          </div>
          <span className="text-[10px] text-[#79675E]">{metrics.approvedOpportunities || 0} approved for public view</span>
        </div>

        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Active Validations
          </span>
          <div className="text-3xl font-display font-bold text-[#356B4B] mt-1">
            {metrics.totalValidationsInProgress || 0}
          </div>
          <span className="text-[10px] text-[#79675E]">Discovery workspaces in progress</span>
        </div>

        <div className="bg-[#FFF9F1] p-5 rounded-2xl border border-[#E5D8CB] shadow-soft">
          <span className="text-[11px] font-bold text-[#79675E] uppercase tracking-wider">
            Categories
          </span>
          <div className="text-3xl font-display font-bold text-[#49362E] mt-1">
            {metrics.categoriesCount || 0}
          </div>
          <span className="text-[10px] text-[#79675E]">Domain taxonomy</span>
        </div>
      </div>

      {/* Opportunity Management Table */}
      <div className="bg-[#FFF9F1] rounded-3xl border border-[#E5D8CB] shadow-soft overflow-hidden">
        <div className="p-6 border-b border-[#E5D8CB] flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#49362E]">Opportunity Moderation</h2>
          <span className="text-xs text-[#79675E]">{opportunities.length} Total records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6E9D8] text-[#79675E] uppercase font-bold tracking-wider border-b border-[#E5D8CB]">
              <tr>
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-6">Customer Target</th>
                <th className="py-3.5 px-6">Origin</th>
                <th className="py-3.5 px-6">Validation Stage</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Toggle Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D8CB]/70">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 text-[#79675E]">#{opp.id}</td>
                  <td className="py-4 px-6 font-bold text-[#49362E] max-w-xs">{opp.title}</td>
                  <td className="py-4 px-6 text-[#79675E]">{opp.targetCustomer}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      opp.isUserSubmitted ? 'bg-[#F4E2D9] text-[#9E3529]' : 'bg-[#DCE8DE] text-[#356B4B]'
                    }`}>
                      {opp.isUserSubmitted ? 'User Submitted' : 'Core Seed'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#79675E]">{opp.validationStatus}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      opp.isApproved ? 'bg-[#DCE8DE] text-[#356B4B]' : 'bg-[#F4E2D9] text-[#9E3529]'
                    }`}>
                      {opp.isApproved ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleApproval(opp.id)}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-[#E5D8CB] hover:border-[#C74634]"
                    >
                      {opp.isApproved ? 'Archive' : 'Approve'}
                    </button>
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
