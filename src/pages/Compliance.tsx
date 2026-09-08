import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, ClipboardCheck, FileText, Shield, Plus } from 'lucide-react';

interface AuditItem {
  id: string;
  item: string;
  category: string;
  status: 'COMPLIANT' | 'NEEDS_ATTENTION' | 'NOT_REVIEWED';
  patient?: string;
  reviewedBy?: string;
  lastReviewed?: string;
  notes?: string;
  dueDate?: string;
}

const auditItems: AuditItem[] = [
  { id: 'audit-1', item: 'Initial evaluations completed within 24 hours of appointment', category: 'DOCUMENTATION_TIMELINESS', status: 'COMPLIANT', reviewedBy: 'Sarah Chen', lastReviewed: '2024-12-01', notes: 'All initial evals signed within 24hr window' },
  { id: 'audit-2', item: 'SOAP notes signed within 48 hours of service', category: 'DOCUMENTATION_TIMELINESS', status: 'NEEDS_ATTENTION', patient: 'Maria Garcia', notes: 'SOAP note from 12/10 still unsigned after 72 hours', dueDate: '2024-12-15' },
  { id: 'audit-3', item: 'Plan of Care certified within required timeframe', category: 'PLAN_OF_CARE_CERTIFICATION', status: 'COMPLIANT', reviewedBy: 'Sarah Chen', lastReviewed: '2024-12-01' },
  { id: 'audit-4', item: 'Re-evaluations performed at required intervals', category: 'MEDICAL_NECESSITY', status: 'NEEDS_ATTENTION', patient: 'Patricia Lee', notes: 'Re-eval overdue by 5 days', dueDate: '2024-12-12' },
  { id: 'audit-5', item: 'All notes include required functional outcome measures', category: 'DOCUMENTATION_TIMELINESS', status: 'NOT_REVIEWED', dueDate: '2024-12-20' },
  { id: 'audit-6', item: 'Discharge summaries completed within 7 days', category: 'DOCUMENTATION_TIMELINESS', status: 'COMPLIANT', reviewedBy: 'Marcus Williams', lastReviewed: '2024-11-28' },
  { id: 'audit-7', item: 'Physician orders on file for all Medicare patients', category: 'PLAN_OF_CARE_CERTIFICATION', status: 'COMPLIANT', reviewedBy: 'Sarah Chen', lastReviewed: '2024-12-05' },
  { id: 'audit-8', item: 'Medical necessity documented for each visit', category: 'MEDICAL_NECESSITY', status: 'NEEDS_ATTENTION', patient: 'James Thompson', notes: 'Visit #15 lacks functional progress documentation', dueDate: '2024-12-13' },
  { id: 'audit-9', item: 'All therapists maintain current licensure', category: 'SIGNATURE_COMPLIANCE', status: 'COMPLIANT', reviewedBy: 'Sarah Chen', lastReviewed: '2024-12-01' },
  { id: 'audit-10', item: 'HIPAA acknowledgment forms on file for all staff', category: 'SIGNATURE_COMPLIANCE', status: 'COMPLIANT', reviewedBy: 'Sarah Chen', lastReviewed: '2024-11-15' },
];

function getStatusBadge(status: AuditItem['status']) {
  switch (status) {
    case 'COMPLIANT': return 'bg-green-100 text-green-700';
    case 'NEEDS_ATTENTION': return 'bg-orange-100 text-orange-700';
    case 'NOT_REVIEWED': return 'bg-gray-100 text-gray-600';
  }
}

function getStatusIcon(status: AuditItem['status']) {
  switch (status) {
    case 'COMPLIANT': return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'NEEDS_ATTENTION': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    case 'NOT_REVIEWED': return <Clock className="h-5 w-5 text-gray-400" />;
  }
}

export default function Compliance() {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = auditItems.filter(item => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const compliantCount = auditItems.filter(i => i.status === 'COMPLIANT').length;
  const needsAttentionCount = auditItems.filter(i => i.status === 'NEEDS_ATTENTION').length;
  const notReviewedCount = auditItems.filter(i => i.status === 'NOT_REVIEWED').length;
  const complianceRate = Math.round((compliantCount / auditItems.length) * 100);

  const categories = [...new Set(auditItems.map(i => i.category))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Audits</h1>
          <p className="text-sm text-gray-500 mt-1">Internal documentation and compliance review checklist</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">
            <FileText className="h-4 w-4" />
            Export Report
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Audit
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{complianceRate}%</p>
              <p className="text-xs text-gray-500">Compliance Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{compliantCount}</p>
              <p className="text-xs text-gray-500">Compliant</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-orange-600">{needsAttentionCount}</p>
              <p className="text-xs text-gray-500">Needs Attention</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{notReviewedCount}</p>
              <p className="text-xs text-gray-500">Not Reviewed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Overall Compliance</h3>
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="bg-green-500 h-full" style={{ width: `${(compliantCount / auditItems.length) * 100}%` }} />
          <div className="bg-orange-500 h-full" style={{ width: `${(needsAttentionCount / auditItems.length) * 100}%` }} />
          <div className="bg-gray-300 h-full" style={{ width: `${(notReviewedCount / auditItems.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-3 h-3 bg-green-500 rounded" /> Compliant
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-3 h-3 bg-orange-500 rounded" /> Needs Attention
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-3 h-3 bg-gray-300 rounded" /> Not Reviewed
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          <option value="ALL">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLIANT">Compliant</option>
          <option value="NEEDS_ATTENTION">Needs Attention</option>
          <option value="NOT_REVIEWED">Not Reviewed</option>
        </select>
      </div>

      {/* Audit items */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-4">
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">{item.item}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${getStatusBadge(item.status)}`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-gray-500">{item.category.replace(/_/g, ' ')}</span>
                  {item.patient && <span className="text-xs text-orange-600">Patient: {item.patient}</span>}
                  {item.reviewedBy && <span className="text-xs text-gray-400">Reviewed by {item.reviewedBy}</span>}
                  {item.lastReviewed && <span className="text-xs text-gray-400">{item.lastReviewed}</span>}
                </div>
                {item.notes && <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">{item.notes}</p>}
              </div>
              {item.status !== 'COMPLIANT' && (
                <button className="shrink-0 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200">
                  Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
