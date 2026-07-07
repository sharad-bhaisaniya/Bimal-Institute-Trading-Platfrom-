import React from 'react';
import { FiMenu, FiHome, FiUsers, FiShield, FiBookOpen, FiPlayCircle, FiSettings } from 'react-icons/fi';
import BrandLogo from '../../../components/common/BrandLogo';

const UserSidebar = ({ isCollapsed, toggleSidebar, navItemComponent: NavItem }) => {
    return (
        <aside className={`
            fixed top-0 left-0 h-screen bg-[#0a0a0a] border-r border-dark-border flex flex-col transition-all duration-300 z-40 bg-glass backdrop-blur-md shrink-0
            ${isCollapsed ? 'w-20' : 'w-64'}
        `}>
            <div className="h-20 flex items-center justify-between px-6 border-b border-dark-border shrink-0">
                <div className="flex-1 overflow-hidden" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
                    <BrandLogo showText={!isCollapsed} />
                </div>
                {!isCollapsed && (
                    <button className="text-text-secondary hover:text-text-primary text-xl p-1.5 rounded-lg hover:bg-white/5 transition-colors" onClick={toggleSidebar}>
                        <FiMenu />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1 no-scrollbar">
                <NavItem to="/user/journal" icon={FiHome} label="Dashboard" isCollapsed={isCollapsed} />
                <NavItem to="/user/profile" icon={FiSettings} label="Settings" isCollapsed={isCollapsed} />

                <NavItem to="/dashboard/roles" icon={FiShield} label="Roles" isCollapsed={isCollapsed} />
                <NavItem
                    to="/dashboard/courses"
                    icon={FiPlayCircle}
                    label="Courses (LMS)"
                    isCollapsed={isCollapsed}
                    subLinks={[
                        { label: 'All Courses', to: '/dashboard/courses' },
                        { label: 'Create Course', to: '/dashboard/courses/builder' }
                    ]}
                />

            </nav>
        </aside>
    );
};

export default UserSidebar;