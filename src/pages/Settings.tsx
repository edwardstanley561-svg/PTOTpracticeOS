import { Settings, Users, Shield, Building, Bell, Database, Key } from 'lucide-react';
import { organization, users } from '../data/mockData';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage practice configuration, users, and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings nav */}
        <div className="bg-white rounded-xl border border-gray-200 p-2">
          <nav className="space-y-1">
            {[
              { icon: Building, label: 'Practice Info', active: true },
              { icon: Users, label: 'Team & Roles', active: false },
              { icon: Shield, label: 'Security & HIPAA', active: false },
              { icon: Bell, label: 'Notifications', active: false },
              { icon: Key, label: 'Permissions', active: false },
              { icon: Database, label: 'Data & Backup', active: false },
            ].map(item => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Practice info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Practice Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Practice Name</label>
                <input type="text" defaultValue={organization.name} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Timezone</label>
                <input type="text" defaultValue={organization.timezone} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">NPI Number</label>
                <input type="text" placeholder="Enter NPI" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tax ID</label>
                <input type="text" placeholder="Enter Tax ID" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700" />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>

          {/* Team */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Invite Member
              </button>
            </div>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">{user.firstName[0]}{user.lastName[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HIPAA notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">HIPAA Compliance Notice</h3>
                <p className="text-sm text-amber-700 mt-1">
                  This application handles Protected Health Information (PHI). Ensure all team members have completed HIPAA training. 
                  All access is logged and auditable. Session timeout is set to 15 minutes of inactivity.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Encryption at rest: Enabled
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    TLS 1.3: Active
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Audit logging: Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
