import { useState } from 'react';
import { DollarSign, AlertTriangle, CheckCircle, Clock, Plus, ArrowUpRight } from 'lucide-react';
import { claims, patients, payers } from '../data/mockData';
import { ClaimStatus } from '../types';
import PremiumPageGate from '../components/PremiumPageGate';

function getPatientName(id: string) {
  const p = patients.find(p => p.id === id);
  return p ? `${p.lastName}, ${p.firstName}` : 'Unknown';
}

function getPayerName(id?: string) {
  if (!id) return 'Unknown';
  const p = payers.find(p => p.id === id);
  return p ? p.name : 'Unknown';
}

function getStatusColor(status: ClaimStatus) {
  switch (status) {
    case 'PAID': return 'bg-green-100 text-green-700';
    case 'PARTIALLY_PAID': return 'bg-blue-100 text-blue-700';
    case 'SUBMITTED': return 'bg-gray-100 text-gray-700';
    case 'DRAFT': return 'bg-gray-50 text-gray-500';
    case 'DENIED': return 'bg-red-100 text-red-700';
    case 'APPEALED': return 'bg-purple-100 text-purple-700';
    case 'WRITTEN_OFF': return 'bg-gray-100 text-gray-500';
  }
}

export default function Claims() {
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'ALL'>('ALL');

  const filtered = claims.filter(c => statusFilter === 'ALL' || c.status === statusFilter);
  
  const totalBilled = claims.reduce((sum, c) => sum + c.amountBilledCents, 0);
  const totalPaid = claims.reduce((sum, c) => sum + c.amountPaidCents, 0);
  const deniedCount = claims.filter(c => c.status === 'DENIED').length;
  const outstandingCount = claims.filter(c => c.status !== 'PAID' && c.status !== 'WRITTEN_OFF').length;

  return (
    <PremiumPageGate
      featureName="Claims Tracking"
      featureDescription="Monitor submitted, paid, denied, and appealed claims. Track follow-up dates and manage denials with automated alerts."
      requiredPlan="practice"
    >
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-sm text-gray-500 mt-1">Track submitted, paid, denied, and appealed claims</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Claim
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">${(totalBilled / 100).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Billed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">${(totalPaid / 100).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Collected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{deniedCount}</p>
              <p className="text-xs text-gray-500">Denied Claims</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-600">{outstandingCount}</p>
              <p className="text-xs text-gray-500">Outstanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'DRAFT', 'SUBMITTED', 'PAID', 'PARTIALLY_PAID', 'DENIED', 'APPEALED'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              statusFilter === status ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {status === 'ALL' ? 'All' : status.replace(/_/g, ' ')}
            <span className="ml-1.5 text-xs opacity-60">
              {status === 'ALL' ? claims.length : claims.filter(c => c.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Claims table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">DOS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Billed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow-Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(claim => (
                <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{claim.claimNumber || 'Draft'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{getPatientName(claim.patientId)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{getPayerName(claim.payerId)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{claim.dateOfService}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">${(claim.amountBilledCents / 100).toFixed(2)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">${(claim.amountPaidCents / 100).toFixed(2)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status.replace(/_/g, ' ')}
                    </span>
                    {claim.denialReason && (
                      <p className="text-xs text-red-600 mt-1 truncate max-w-[150px]">{claim.denialReason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {claim.followUpDate ? (
                      <div className="flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3 text-gray-400" />
                        <span className={`text-sm ${claim.followUpDate <= new Date().toISOString().split('T')[0] ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {claim.followUpDate}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </PremiumPageGate>
  );
}
