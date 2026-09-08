import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Phone, Mail, Calendar, ChevronRight, User } from 'lucide-react';
import { patients, payers, referralSources, authorizations, treatmentPlans } from '../data/mockData';
import { PatientStatus } from '../types';

function getStatusBadge(status: PatientStatus) {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-700';
    case 'INTAKE': return 'bg-blue-100 text-blue-700';
    case 'RE_EVAL_DUE': return 'bg-orange-100 text-orange-700';
    case 'DISCHARGED': return 'bg-gray-100 text-gray-600';
  }
}

function getAge(dob: string) {
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export default function Patients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'ALL'>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filtered = patients.filter(p => {
    const matchesSearch = search === '' || 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      p.patientNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selected = patients.find(p => p.id === selectedPatient);
  const patientAuth = selected ? authorizations.find(a => a.patientId === selected.id) : null;
  const patientPlan = selected ? treatmentPlans.find(t => t.patientId === selected.id) : null;
  const patientPayer = selected ? payers.find(p => p.id === selected.payerId) : null;
  const patientReferral = selected ? referralSources.find(r => r.id === selected.referralSourceId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">{patients.length} total patients</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Patient
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
          <Search className="h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or patient number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PatientStatus | 'ALL')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INTAKE">Intake</option>
            <option value="RE_EVAL_DUE">Re-Eval Due</option>
            <option value="DISCHARGED">Discharged</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {filtered.map(patient => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  selectedPatient === patient.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{patient.lastName}, {patient.firstName}</p>
                    <p className="text-xs text-gray-500">{patient.patientNumber} • {getAge(patient.dateOfBirth)}y</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(patient.status)}`}>
                      {patient.status.replace('_', ' ')}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{patient.primaryDiagnosisDescription}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200">
              {/* Patient header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selected.firstName} {selected.lastName}</h2>
                      <p className="text-sm text-gray-500">{selected.patientNumber} • DOB: {selected.dateOfBirth} • {getAge(selected.dateOfBirth)} years old</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(selected.status)}`}>
                    {selected.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selected.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Intake: {selected.intakeDate}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Diagnosis: </span>
                  <span className="text-sm text-gray-700">{selected.primaryDiagnosisCode} - {selected.primaryDiagnosisDescription}</span>
                </div>
              </div>

              {/* Key info */}
              <div className="px-6 py-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Key Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Primary Payer</p>
                    <p className="text-sm font-medium text-gray-900">{patientPayer?.name || 'Not set'}</p>
                    <p className="text-xs text-gray-500">{patientPayer?.payerType}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Referral Source</p>
                    <p className="text-sm font-medium text-gray-900">{patientReferral?.name || 'Not set'}</p>
                    <p className="text-xs text-gray-500">{patientReferral?.specialty}</p>
                  </div>
                  {patientPlan && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Treatment Plan</p>
                      <p className="text-sm font-medium text-gray-900">{patientPlan.planName}</p>
                      <p className="text-xs text-gray-500">{patientPlan.frequencyLabel} • {patientPlan.status}</p>
                    </div>
                  )}
                  {patientAuth && (
                    <div className={`p-3 rounded-lg ${
                      patientAuth.alertStatus === 'OK' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <p className="text-xs text-gray-500 mb-1">Authorization</p>
                      <p className="text-sm font-medium text-gray-900">{patientAuth.visitsAuthorized - patientAuth.visitsUsed} visits remaining</p>
                      <p className="text-xs text-gray-500">Expires: {patientAuth.authorizationExpirationDate} • {patientAuth.alertStatus}</p>
                    </div>
                  )}
                </div>

                {/* Tabs placeholder */}
                <div className="flex gap-1 pt-4 border-t border-gray-100">
                  {['Overview', 'Treatment Plans', 'Authorizations', 'Schedule', 'Documentation', 'Claims', 'Insurance', 'Activity'].map((tab, i) => (
                    <button key={tab} className={`px-3 py-2 text-xs font-medium rounded-lg ${i === 0 ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-96">
              <div className="text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a patient to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
