import React from 'react';
import { SidebarUserCard } from './SidebarUserCard';
import { User } from '../types';

interface SidebarProps {
    user: User;
    trends: any[];
    onPromoteClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, trends, onPromoteClick }) => {
    return (
        <div className="flex flex-col h-full bg-dark-950 border-l border-white/5 w-80">
            <SidebarUserCard user={user} />
        </div>
    );
};
