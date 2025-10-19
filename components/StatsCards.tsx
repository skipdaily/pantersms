
import React, { useMemo } from 'react';
import { Recipient, RecipientStatus } from '../types';
import { CheckCircleIcon, PaperAirplaneIcon, UserGroupIcon, ExclamationTriangleIcon } from './icons';

interface StatsCardsProps {
    recipients: Recipient[];
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200 flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export const StatsCards: React.FC<StatsCardsProps> = ({ recipients }) => {
    const stats = useMemo(() => {
        const total = recipients.length;
        const sent = recipients.filter(r => r.status === RecipientStatus.SENT).length;
        const failed = recipients.filter(r => r.status === RecipientStatus.FAILED).length;
        const pending = total - sent - failed;
        return { total, sent, failed, pending };
    }, [recipients]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Total Recipients" 
                value={stats.total} 
                icon={<UserGroupIcon className="w-6 h-6 text-indigo-600" />} 
                color="bg-indigo-100"
            />
            <StatCard 
                title="Messages Sent" 
                value={stats.sent} 
                icon={<CheckCircleIcon className="w-6 h-6 text-green-600" />}
                color="bg-green-100"
            />
             <StatCard 
                title="Pending" 
                value={stats.pending} 
                icon={<PaperAirplaneIcon className="w-6 h-6 text-sky-600 -rotate-45" />}
                color="bg-sky-100"
            />
            <StatCard 
                title="Failed" 
                value={stats.failed} 
                icon={<ExclamationTriangleIcon className="w-6 h-6 text-red-600" />}
                color="bg-red-100"
            />
        </div>
    );
};
