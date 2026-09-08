import { 
  Calendar, AlertTriangle, Clock, FileWarning, ClipboardCheck,
  TrendingUp, Users, CheckCircle2, XCircle, ArrowRight, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { patients, appointments, authorizations, claims, clinicalNotes, treatmentPlans, users, payers } from '../data/mockData';
import { AuthAlertStatus, AppointmentStatus } from '../types';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function getPatientName(id: string) {
  const p = patients.find(p => p.id === id);
  return p ? `${p.lastName}, ${p.firstName}` : 'Unknown';
}

function getUserName(id?: string) {
  if (!id) return 'Unassigned';
  const u = users.find(u => u.id === id);
  return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
}

function getPayerName(id: string) {
  const p = payers.find(p => p.id === id);
  return p ? p.name : 'Unknown';
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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

function getStatusColor(status: AppointmentStatus) {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-700';
    case 'CHECKED_IN': return 'bg-blue-100 text-blue-700';
    case 'SCHEDULED': return 'bg-gray-100 text-gray-700';
    case 'NO_SHOW': return 'bg-red-100 text-red-700';
    case 'CANCELLED': return 'bg-gray-100 text-gray-500';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function Dashboard() {
  const todayAppointments = appointments.filter(a => a.startsAt.startsWith(todayStr));
  const authAlerts = authorizations.filter(a => a.alertStatus !== 'OK');
  const reEvalsDue = treatmentPlans.filter(tp => {
    if (!tp.reEvalDueDate) return false;
    return tp.reEvalDueDate <= todayStr;
  });
  const claimsNeedingAction = claims.filter(c => 
    c.status === 'DENIED' || c.status === 'APPEALED' || 
    (c.followUpDate && c.followUpDate <= todayStr)
  );
  const unsignedNotes = clinicalNotes.filter(n => n.status === 'DRAFT' || n.status === 'PENDING_SIGNATURE');

  const scheduledToday = todayAppointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN').length;
  const completedToday = todayAppointments.filter(a => a.status === 'COMPLETED').length;
  const noShowsToday = todayAppointments.filter(a => a.status === 'NO_SHOW').length;
  const outstandingClaims = claims.filter(c => c.status !== 'PAID' && c.status !== 'WRITTEN_OFF').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Practice Pulse */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{scheduledToday}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Scheduled Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{completedToday}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Completed Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{noShowsToday}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">No-Shows Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{outstandingClaims}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Outstanding Claims</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Today's Schedule</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{todayAppointments.length}</span>
            </div>
            <Link to="/schedule" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayAppointments.sort((a, b) => a.startsAt.localeCompare(b.startsAt)).map(appt => (
              <div key={appt.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="text-sm font-medium text-gray-500 w-16 shrink-0">{formatTime(appt.startsAt)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{getPatientName(appt.patientId)}</p>
                  <p className="text-xs text-gray-500">{appt.appointmentType.replace('_', ' ')} • {getUserName(appt.therapistId)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(appt.status)}`}>
                  {appt.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Authorization Risk */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Authorization Risk</h2>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{authAlerts.length}</span>
            </div>
            <Link to="/authorizations" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Command Center <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {authAlerts.sort((a, b) => {
              const order: Record<string, number> = { EXPIRED: 0, EXHAUSTED: 1, URGENT: 2, VISITS_LOW: 3, SOON: 4 };
              return (order[a.alertStatus] ?? 5) - (order[b.alertStatus] ?? 5);
            }).map(auth => {
              const daysRemaining = Math.ceil((new Date(auth.authorizationExpirationDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const visitsRemaining = auth.visitsAuthorized - auth.visitsUsed;
              return (
                <div key={auth.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getPatientName(auth.patientId)}</p>
                    <p className="text-xs text-gray-500">{getPayerName(auth.payerId)} • {visitsRemaining} visits left</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500">{daysRemaining > 0 ? `${daysRemaining}d left` : 'Expired'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getAlertColor(auth.alertStatus)}`}>
                    {auth.alertStatus.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Re-Evaluations Due */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Re-Evaluations Due</h2>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{reEvalsDue.length}</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {reEvalsDue.map(tp => {
              const patient = patients.find(p => p.id === tp.patientId);
              const daysOverdue = tp.reEvalDueDate ? Math.ceil((today.getTime() - new Date(tp.reEvalDueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
              return (
                <div key={tp.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{patient ? `${patient.lastName}, ${patient.firstName}` : 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{tp.planName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-medium ${daysOverdue > 0 ? 'text-red-600' : 'text-orange-600'}`}>
                      {daysOverdue > 0 ? `${daysOverdue}d overdue` : 'Due today'}
                    </p>
                    <p className="text-xs text-gray-400">{tp.reEvalDueDate}</p>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Claims Needing Action */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Claims Needing Action</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{claimsNeedingAction.length}</span>
            </div>
            <Link to="/claims" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {claimsNeedingAction.map(claim => {
              const patient = patients.find(p => p.id === claim.patientId);
              return (
                <div key={claim.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{patient ? `${patient.lastName}, ${patient.firstName}` : 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{claim.claimNumber} • ${(claim.amountBilledCents / 100).toFixed(2)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {claim.denialReason && <p className="text-xs text-red-600 truncate max-w-[150px]">{claim.denialReason}</p>}
                    {claim.followUpDate && <p className="text-xs text-gray-400">Follow-up: {claim.followUpDate}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    claim.status === 'DENIED' ? 'bg-red-100 text-red-700' :
                    claim.status === 'APPEALED' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {claim.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unsigned Documentation */}
      {unsignedNotes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Unsigned Documentation</h2>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{unsignedNotes.length}</span>
            </div>
            <Link to="/documentation" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {unsignedNotes.map(note => {
              const patient = patients.find(p => p.id === note.patientId);
              return (
                <div key={note.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{patient ? `${patient.lastName}, ${patient.firstName}` : 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{note.noteType.replace('_', ' ')} • {getUserName(note.authorId)} • {note.serviceDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    note.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {note.status === 'DRAFT' ? 'Draft' : 'Pending Signature'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
