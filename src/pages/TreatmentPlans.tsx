import { useState } from 'react';
import { ClipboardList, Calendar, Target, AlertTriangle, Plus, Clock } from 'lucide-react';
import { treatmentPlans, patients, users } from '../data/mockData';
import { PlanStatus } from '../types';

function getPatientName(id: string) {
  const p = patients.find(p => p.id === id);
  return p ? `${p.lastName}, ${p.firstName}` : 'Unknown';
}

function getUserName(id: string) {
  const u = users.find(u => u.id === id);
  return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
}

function getStatusColor(status: PlanStatus) {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-700';
    case 'RE_EVAL_DUE': return 'bg-orange-100 text-orange-700';
    case 'COMPLETED': return 'bg-gray-100 text-gray-600';
    case 'DISCONTINUED': return 'bg-red-100 text-red-700';
  }
}

export default function TreatmentPlans() {
  const [statusFilter, setStatusFilter] = useState<PlanStatus | 'ALL'>('ALL');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const filtered = treatmentPlans.filter(tp => statusFilter === 'ALL' || tp.status === statusFilter);
  const selected = treatmentPlans.find(tp => tp.id === selectedPlan);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Track goals, prescribed frequency, and session usage</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Plan
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'ACTIVE', 'RE_EVAL_DUE', 'COMPLETED', 'DISCONTINUED'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              statusFilter === status ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {status === 'ALL' ? 'All' : status.replace(/_/g, ' ')}
            <span className="ml-1.5 text-xs opacity-60">
              {status === 'ALL' ? treatmentPlans.length : treatmentPlans.filter(tp => tp.status === status).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plans list */}
        <div className="lg:col-span-1 space-y-3">
          {filtered.map(plan => {
            const daysToReEval = plan.reEvalDueDate ? Math.ceil((new Date(plan.reEvalDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selectedPlan === plan.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getPatientName(plan.patientId)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.planName}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${getStatusColor(plan.status)}`}>
                    {plan.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {plan.frequencyLabel}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {plan.durationPrescribedWeeks}w
                  </span>
                  {daysToReEval !== null && daysToReEval <= 7 && (
                    <span className="text-xs text-orange-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {daysToReEval <= 0 ? 'Overdue' : `${daysToReEval}d`}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Plan detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selected.planName}</h2>
                    <p className="text-sm text-gray-500">{getPatientName(selected.patientId)} • Created by {getUserName(selected.createdBy)}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selected.status)}`}>
                    {selected.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Frequency</p>
                    <p className="text-sm font-medium text-gray-900">{selected.frequencyLabel}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{selected.durationPrescribedWeeks} weeks</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium text-gray-900">{selected.startDate}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Re-Eval Due</p>
                    <p className={`text-sm font-medium ${selected.reEvalDueDate && selected.reEvalDueDate <= today ? 'text-red-600' : 'text-gray-900'}`}>
                      {selected.reEvalDueDate || 'Not set'}
                    </p>
                  </div>
                </div>

                {selected.diagnosis && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnosis</label>
                    <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">{selected.diagnosis}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    Long-Term Goals
                  </label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">{selected.longTermGoals || 'Not documented'}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    Short-Term Goals
                  </label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">{selected.shortTermGoals || 'Not documented'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-96">
              <div className="text-center">
                <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a treatment plan to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
