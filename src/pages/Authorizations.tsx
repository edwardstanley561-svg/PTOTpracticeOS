import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, Clock, Filter, Download, UserCheck, Bell, Lock, Crown, ArrowRight, Zap } from 'lucide-react';
import { authorizations, patients, payers, users } from '../data/mockData';
import { AuthAlertStatus } from '../types';

function getPatientName(id: string) {
  const p = patients.find(p => p.id === id);
  return p ? `${p.lastName}, ${p.firstName}` : 'Unknown';
}

function getPayerName(id: string) {
  const p = payers.find(p => p.id === id);
  return p ? p.name : 'Unknown';
}

function getUserName(id?: string) {
  if (!id) return 'Unassigned';
  const u = users.find(u => u.id === id);
  return u ? `${u.firstName} ${u.lastName[0]}.` : 'Unknown';
}

function getAlertColor(status: AuthAlertStatus) {
  switch (status) {
    case 'EXPIRED': return 'bg-red-100 text-red-800 border-red-200';
    case 'EXHAUSTED': return 'bg-red-100 text-red-800 border-red-200';
    case 'URGENT': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'VISITS_LOW': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'SOON': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-green-100 text-green-800 border-green-200';
  }
}

function getAlertIcon(status: AuthAlertStatus) {
  switch (status) {
    case 'EXPIRED':
    case 'EXHAUSTED':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'URGENT':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case 'VISITS_LOW':
    case 'SOON':
      return <Clock className="h-4 w-4 text-blue-600" />;
    default:
      return <CheckCircle className="h-4 w-4 text-green-600" />;
  }
}

export default function Authorizations() {
  const [activeTab, setActiveTab] = useState<'needs-action' | 'all-active' | 'pending-reauth' | 'expired' | 'history'>('needs-action');
  const [selectedAuths, setSelectedAuths] = useState<string[]>([]);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const getFilteredAuths = () => {
    switch (activeTab) {
      case 'needs-action':
        return authorizations.filter(a => a.alertStatus !== 'OK');
      case 'all-active':
        return authorizations.filter(a => a.status === 'ACTIVE');
      case 'pending-reauth':
        return authorizations.filter(a => a.reauthStatus === 'REQUEST_SUBMITTED');
      case 'expired':
        return authorizations.filter(a => a.status === 'EXPIRED' || a.status === 'EXHAUSTED');
      case 'history':
        return authorizations;
      default:
        return authorizations;
    }
  };

  const filtered = getFilteredAuths();

  const toggleSelect = (id: string) => {
    setSelectedAuths(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedAuths.length === filtered.length) {
      setSelectedAuths([]);
    } else {
      setSelectedAuths(filtered.map(a => a.id));
    }
  };

  const tabs = [
    { id: 'needs-action' as const, label: 'Needs Action', count: authorizations.filter(a => a.alertStatus !== 'OK').length, color: 'text-red-600' },
    { id: 'all-active' as const, label: 'All Active', count: authorizations.filter(a => a.status === 'ACTIVE').length, color: 'text-gray-600' },
    { id: 'pending-reauth' as const, label: 'Pending Re-Auth', count: authorizations.filter(a => a.reauthStatus === 'REQUEST_SUBMITTED').length, color: 'text-purple-600' },
    { id: 'expired' as const, label: 'Expired/Exhausted', count: authorizations.filter(a => a.status === 'EXPIRED' || a.status === 'EXHAUSTED').length, color: 'text-red-600' },
    { id: 'history' as const, label: 'History', count: authorizations.length, color: 'text-gray-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authorization Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage insurance authorizations to prevent visit-cap and expiration lapses</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            <Shield className="h-4 w-4" />
            New Authorization
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-red-700">{authorizations.filter(a => a.alertStatus === 'EXPIRED').length}</p>
          <p className="text-xs text-red-600 font-medium">Expired</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-red-700">{authorizations.filter(a => a.alertStatus === 'EXHAUSTED').length}</p>
          <p className="text-xs text-red-600 font-medium">Exhausted</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-orange-700">{authorizations.filter(a => a.alertStatus === 'URGENT').length}</p>
          <p className="text-xs text-orange-600 font-medium">Urgent (≤7d)</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-yellow-700">{authorizations.filter(a => a.alertStatus === 'VISITS_LOW').length}</p>
          <p className="text-xs text-yellow-600 font-medium">Visits Low (≤2)</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-700">{authorizations.filter(a => a.alertStatus === 'SOON').length}</p>
          <p className="text-xs text-blue-600 font-medium">Soon (≤14d)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedAuths([]); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedAuths.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-700">{selectedAuths.length} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-sm font-medium text-blue-700 rounded-lg hover:bg-blue-50">
              <Bell className="h-3.5 w-3.5" />
              Send Reminder
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-sm font-medium text-blue-700 rounded-lg hover:bg-blue-50">
              <UserCheck className="h-3.5 w-3.5" />
              Assign Owner
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-sm font-medium text-blue-700 rounded-lg hover:bg-blue-50">
              <CheckCircle className="h-3.5 w-3.5" />
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    checked={selectedAuths.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Auth #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visits</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Re-Auth</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Alert</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(auth => {
                const daysRemaining = Math.ceil((new Date(auth.authorizationExpirationDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const visitsRemaining = auth.visitsAuthorized - auth.visitsUsed;
                const usagePercent = Math.round((auth.visitsUsed / auth.visitsAuthorized) * 100);
                return (
                  <tr key={auth.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        checked={selectedAuths.includes(auth.id)}
                        onChange={() => toggleSelect(auth.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{getPatientName(auth.patientId)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{getPayerName(auth.payerId)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 font-mono">{auth.authorizationNumber || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{auth.authorizationExpirationDate}</p>
                      <p className={`text-xs ${daysRemaining <= 0 ? 'text-red-600 font-medium' : daysRemaining <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 75 ? 'bg-orange-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 whitespace-nowrap">{auth.visitsUsed}/{auth.visitsAuthorized}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        auth.reauthStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        auth.reauthStatus === 'DENIED' ? 'bg-red-100 text-red-700' :
                        auth.reauthStatus === 'REQUEST_SUBMITTED' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {auth.reauthStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {getAlertIcon(auth.alertStatus)}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getAlertColor(auth.alertStatus)}`}>
                          {auth.alertStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{getUserName(auth.assignedOwnerId)}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practice Feature: Bulk Actions & Automation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Bulk Actions & Automation</h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">Practice Plan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 opacity-40">
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Bulk Re-auth Request</p>
            <p className="text-xs text-gray-500 mt-0.5">Submit multiple at once</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Auto-assign Staff</p>
            <p className="text-xs text-gray-500 mt-0.5">Route by workload</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Export Worklist</p>
            <p className="text-xs text-gray-500 mt-0.5">CSV/PDF export</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Auto Reminders</p>
            <p className="text-xs text-gray-500 mt-0.5">Staff notifications</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Bulk Actions & Automation</p>
            <p className="text-xs text-gray-500 mb-3">Streamline authorization management at scale</p>
            <Link to="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
              Upgrade to Practice <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
