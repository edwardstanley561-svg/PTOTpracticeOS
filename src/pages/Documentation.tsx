import { useState } from 'react';
import { FileText, Pen, CheckCircle, Clock, AlertCircle, Plus, Eye } from 'lucide-react';
import { clinicalNotes, patients, users } from '../data/mockData';
import { NoteStatus, NoteType } from '../types';

function getPatientName(id: string) {
  const p = patients.find(p => p.id === id);
  return p ? `${p.lastName}, ${p.firstName}` : 'Unknown';
}

function getUserName(id: string) {
  const u = users.find(u => u.id === id);
  return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
}

function getStatusBadge(status: NoteStatus) {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-700';
    case 'PENDING_SIGNATURE': return 'bg-yellow-100 text-yellow-700';
    case 'SIGNED': return 'bg-green-100 text-green-700';
    case 'AMENDED': return 'bg-blue-100 text-blue-700';
    case 'VOIDED': return 'bg-red-100 text-red-700';
  }
}

function getStatusIcon(status: NoteStatus) {
  switch (status) {
    case 'DRAFT': return <Pen className="h-4 w-4 text-gray-500" />;
    case 'PENDING_SIGNATURE': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'SIGNED': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'AMENDED': return <AlertCircle className="h-4 w-4 text-blue-600" />;
    case 'VOIDED': return <AlertCircle className="h-4 w-4 text-red-600" />;
  }
}

export default function Documentation() {
  const [typeFilter, setTypeFilter] = useState<NoteType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<NoteStatus | 'ALL'>('ALL');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const filtered = clinicalNotes.filter(n => {
    const matchesType = typeFilter === 'ALL' || n.noteType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || n.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const selected = clinicalNotes.find(n => n.id === selectedNote);

  const noteTypes: NoteType[] = ['INITIAL_EVALUATION', 'SOAP', 'PROGRESS', 'RE_EVALUATION', 'DISCHARGE', 'HEP'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
          <p className="text-sm text-gray-500 mt-1">Clinical notes, evaluations, and home exercise programs</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Note type quick buttons */}
      <div className="flex flex-wrap gap-2">
        {noteTypes.map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? 'ALL' : type)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              typeFilter === type ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as NoteStatus | 'ALL')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING_SIGNATURE">Pending Signature</option>
          <option value="SIGNED">Signed</option>
          <option value="AMENDED">Amended</option>
          <option value="VOIDED">Voided</option>
        </select>
        <span className="text-sm text-gray-500">{filtered.length} notes</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes list */}
        <div className="lg:col-span-1 space-y-2">
          {filtered.map(note => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note.id)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedNote === note.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(note.status)}
                  <span className="text-sm font-medium text-gray-900">{getPatientName(note.patientId)}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(note.status)}`}>
                  {note.status === 'PENDING_SIGNATURE' ? 'Pending' : note.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{note.noteType.replace(/_/g, ' ')} • {note.serviceDate}</p>
              <p className="text-xs text-gray-400 mt-1">By {getUserName(note.authorId)}</p>
            </button>
          ))}
        </div>

        {/* Note detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selected.noteType.replace(/_/g, ' ')}</h2>
                  <p className="text-sm text-gray-500">{getPatientName(selected.patientId)} • Service Date: {selected.serviceDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selected.status === 'DRAFT' && (
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                      <Pen className="h-3.5 w-3.5" />
                      Sign Note
                    </button>
                  )}
                  {selected.status === 'PENDING_SIGNATURE' && (
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Sign
                    </button>
                  )}
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                {Object.entries(selected.content).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                      {typeof value === 'number' ? value : value || <span className="text-gray-400 italic">Not documented</span>}
                    </div>
                  </div>
                ))}
                {selected.signedAt && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Signed by {getUserName(selected.signedBy || '')} on {selected.signedAt}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-96">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select a note to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
