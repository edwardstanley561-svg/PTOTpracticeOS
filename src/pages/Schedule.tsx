import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Plus } from 'lucide-react';
import { appointments, patients, users } from '../data/mockData';
import { AppointmentStatus } from '../types';

function getPatientName(id: string) {
  const p = patients.find(p => p.id === id);
  return p ? `${p.lastName}, ${p.firstName}` : 'Unknown';
}

function getUserName(id?: string) {
  if (!id) return 'Unassigned';
  const u = users.find(u => u.id === id);
  return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
}

function getStatusColor(status: AppointmentStatus) {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
    case 'CHECKED_IN': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'SCHEDULED': return 'bg-white text-gray-700 border-gray-200';
    case 'NO_SHOW': return 'bg-red-100 text-red-700 border-red-200';
    case 'CANCELLED': return 'bg-gray-100 text-gray-500 border-gray-200';
    case 'RESCHEDULED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-white text-gray-700 border-gray-200';
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'INITIAL_EVAL': return 'border-l-purple-500';
    case 'RE_EVAL': return 'border-l-orange-500';
    case 'DISCHARGE': return 'border-l-gray-500';
    default: return 'border-l-blue-500';
  }
}

export default function Schedule() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const [view, setView] = useState<'day' | 'week'>('day');

  const dateStr = viewDate.toISOString().split('T')[0];
  const dayAppointments = appointments.filter(a => a.startsAt.startsWith(dateStr));
  
  const hours = Array.from({ length: 11 }, (_, i) => i + 7); // 7am to 5pm

  const navigateDate = (direction: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + (view === 'week' ? direction * 7 : direction));
    setViewDate(newDate);
  };

  const weekDays = view === 'week' ? Array.from({ length: 5 }, (_, i) => {
    const d = new Date(viewDate);
    const monday = new Date(d);
    monday.setDate(d.getDate() - d.getDay() + 1);
    monday.setDate(monday.getDate() + i);
    return monday;
  }) : [viewDate];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">
            {viewDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button 
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Week
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button onClick={() => setViewDate(today)} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              Today
            </button>
            <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Therapist filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-sm text-gray-500 shrink-0">Therapists:</span>
        {users.filter(u => u.role === 'THERAPIST').map(u => (
          <button key={u.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">{u.firstName[0]}{u.lastName[0]}</span>
            </div>
            {u.firstName} {u.lastName[0]}.
          </button>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {view === 'day' ? (
          <div className="divide-y divide-gray-50">
            {hours.map(hour => {
              const hourAppts = dayAppointments.filter(a => new Date(a.startsAt).getHours() === hour);
              return (
                <div key={hour} className="flex min-h-[80px]">
                  <div className="w-20 shrink-0 px-4 py-3 border-r border-gray-100">
                    <span className="text-sm font-medium text-gray-500">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </span>
                  </div>
                  <div className="flex-1 px-2 py-2 flex flex-col gap-1">
                    {hourAppts.map(appt => (
                      <div key={appt.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${getStatusColor(appt.status)} border-l-4 ${getTypeColor(appt.appointmentType)}`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{getPatientName(appt.patientId)}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(appt.startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(appt.endsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {getUserName(appt.therapistId)}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white/50 border border-gray-200">
                          {appt.appointmentType.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Week view */
          <div className="grid grid-cols-6 border-b border-gray-100">
            <div className="border-r border-gray-100 p-2" />
            {weekDays.map((day, i) => (
              <div key={i} className="border-r border-gray-100 p-3 text-center">
                <p className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className={`text-lg font-semibold ${day.toISOString().split('T')[0] === today.toISOString().split('T')[0] ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{dayAppointments.length}</p>
          <p className="text-sm text-gray-500">Total Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-green-600">{dayAppointments.filter(a => a.status === 'COMPLETED').length}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{dayAppointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN').length}</p>
          <p className="text-sm text-gray-500">Remaining</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-red-600">{dayAppointments.filter(a => a.status === 'NO_SHOW').length}</p>
          <p className="text-sm text-gray-500">No-Shows</p>
        </div>
      </div>
    </div>
  );
}
