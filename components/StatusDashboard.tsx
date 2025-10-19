
import React from 'react';
import { Recipient, RecipientStatus } from '../types';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, PaperAirplaneIcon, SpinnerIcon, UserGroupIcon } from './icons';

interface StatusDashboardProps {
  recipients: Recipient[];
}

const StatusBadge: React.FC<{ status: RecipientStatus }> = ({ status }) => {
  switch (status) {
    case RecipientStatus.PENDING:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><ClockIcon className="w-4 h-4 mr-1.5 text-slate-500" />Pending</span>;
    case RecipientStatus.SENDING:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><SpinnerIcon className="w-4 h-4 mr-1.5 animate-spin"/>Sending</span>;
    case RecipientStatus.SENT:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircleIcon className="w-4 h-4 mr-1.5" />Sent</span>;
    case RecipientStatus.FAILED:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><ExclamationTriangleIcon className="w-4 h-4 mr-1.5" />Failed</span>;
    default:
      return null;
  }
};

export const StatusDashboard: React.FC<StatusDashboardProps> = ({ recipients }) => {
  if (recipients.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 h-full flex flex-col justify-center items-center">
        <UserGroupIcon className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">Recipient Dashboard</h3>
        <p className="text-sm text-slate-500 mt-1">Upload a CSV to see your recipients here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Recipient Dashboard</h3>
            <p className="text-sm text-slate-500 mt-1">Tracking status for {recipients.length} recipients.</p>
        </div>
        <div className="overflow-x-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone Number</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Personalized Message</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {recipients.map((recipient) => (
              <tr key={recipient.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{recipient.name || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{recipient.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <StatusBadge status={recipient.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 italic">
                  {recipient.personalizedMessage || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>
  );
};
