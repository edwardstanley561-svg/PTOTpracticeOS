import { useState } from 'react';
import { Link2, Phone, Mail, Calendar, AlertTriangle, Users, Plus, ExternalLink } from 'lucide-react';
import { referralSources } from '../data/mockData';
import { ReferralSourceType } from '../types';

function getSourceTypeColor(type: ReferralSourceType) {
  switch (type) {
    case 'PHYSICIAN': return 'bg-blue-100 text-blue-700';
    case 'HOSPITAL': return 'bg-purple-100 text-purple-700';
    case 'CLINIC': return 'bg-green-100 text-green-700';
    case 'COMMUNITY': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function Referrals() {
  const [typeFilter, setTypeFilter] = useState<ReferralSourceType | 'ALL'>('ALL');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const filtered = referralSources.filter(r => typeFilter === 'ALL' || r.sourceType === typeFilter);
  const selected = referralSources.find(r => r.id === selectedSource);

  const totalReferrals = referralSources.reduce((sum, r) => sum + r.referralCount, 0);
  const needsFollowUp = referralSources.filter(r => r.needsFollowUp).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Relationships</h1>
          <p className="text-sm text-gray-500 mt-1">Track and maintain referral source relationships</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Source
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Link2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{referralSources.length}</p>
              <p className="text-xs text-gray-500">Total Sources</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalReferrals}</p>
              <p className="text-xs text-gray-500">Total Referrals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-orange-600">{needsFollowUp}</p>
              <p className="text-xs text-gray-500">Need Follow-Up</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {referralSources.reduce((max, r) => r.referralCount > max.referralCount ? r : max, referralSources[0]).referralCount}
              </p>
              <p className="text-xs text-gray-500">Top Source Volume</p>
            </div>
          </div>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'PHYSICIAN', 'HOSPITAL', 'CLINIC', 'COMMUNITY', 'OTHER'] as const).map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              typeFilter === type ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {type === 'ALL' ? 'All Types' : type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sources list */}
        <div className="lg:col-span-1 space-y-2">
          {filtered.map(source => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedSource === source.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{source.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{source.specialty || source.sourceType}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSourceTypeColor(source.sourceType)}`}>
                  {source.sourceType}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500">{source.referralCount} referrals</span>
                {source.needsFollowUp && (
                  <span className="text-xs text-orange-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Follow-up needed
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Source detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selected.name}</h2>
                    <p className="text-sm text-gray-500">{selected.sourceType} {selected.specialty ? `• ${selected.specialty}` : ''}</p>
                  </div>
                  {selected.needsFollowUp && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg border border-orange-200">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Follow-Up Needed
                    </span>
                  )}
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selected.contactName && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{selected.contactName}</span>
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{selected.phone}</span>
                    </div>
                  )}
                  {selected.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{selected.email}</span>
                    </div>
                  )}
                  {selected.lastFollowUpDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Last follow-up: {selected.lastFollowUpDate}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Total Referrals</p>
                    <p className="text-2xl font-bold text-gray-900">{selected.referralCount}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Last Referral</p>
                    <p className="text-sm font-medium text-gray-900">{selected.lastReferralDate || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Log Follow-Up
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                    Send Thank You
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-96">
              <div className="text-center">
                <Link2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a referral source to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
