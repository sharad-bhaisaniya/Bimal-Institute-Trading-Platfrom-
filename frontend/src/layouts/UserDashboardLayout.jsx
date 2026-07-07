import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import UserSidebar from '../pages/trading-journal/components/UserSidebar';
import Navbar from '../pages/trading-journal/components/Navbar';

// NavLink config block used across sidebar views
const NavItem = ({ to, icon: Icon, label, subLinks, isCollapsed }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (e) => {
        if (subLinks && !isCollapsed) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={`w-full transition-all duration-300 relative group/nav ${isCollapsed ? 'px-2 text-center' : 'px-4'}`}>
            <NavLink
                to={to}
                end={!subLinks}
                className={({ isActive }) => `
                    flex items-center justify-between p-3 rounded-xl transition-all duration-200 font-medium tracking-wide my-1
                    ${isActive
                        ? 'bg-primary/20 text-primary border border-primary/30 shadow-glow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'}
                `}
                onClick={handleToggle}
            >
                <div className="flex items-center gap-3">
                    <Icon className="text-xl shrink-0" />
                    {!isCollapsed && <span className="text-base">{label}</span>}
                </div>
                {!isCollapsed && subLinks && (
                    <div className="text-text-muted text-sm">
                        {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </div>
                )}
            </NavLink>

            {/* Expanded Sublinks */}
            {!isCollapsed && subLinks && isOpen && (
                <div className="pl-9 mt-1 space-y-1 border-l border-dark-border ml-6">
                    {subLinks.map((link, idx) => (
                        <NavLink
                            key={idx}
                            to={link.to}
                            className={({ isActive }) => `
                                block p-2 text-sm rounded-lg transition-colors
                                ${isActive ? 'text-primary font-semibold' : 'text-text-muted hover:text-text-primary'}
                            `}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            )}

            {/* Collapsed Hover Menu */}
            {isCollapsed && subLinks && (
                <div className="absolute left-full top-0 ml-2 w-48 bg-dark-bg/95 backdrop-blur-md border border-dark-border p-2 rounded-xl opacity-0 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:pointer-events-auto transition-all duration-200 z-50 shadow-card">
                    <div className="px-3 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-dark-border mb-1">
                        {label}
                    </div>
                    {subLinks.map((link, idx) => (
                        <NavLink
                            key={idx}
                            to={link.to}
                            className={({ isActive }) => `
                                block p-2 text-sm rounded-lg transition-colors
                                ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}
                            `}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

const UserDashboardLayout = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            try {
                const userString = localStorage.getItem('user');
                if (userString) {
                    setUser(JSON.parse(userString));
                } else {
                    setUser(null);
                }
            } catch (e) {
                setUser(null);
            }
        };

        loadUser();
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const isAuthenticated = !!localStorage.getItem('user');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-text-primary relative overflow-x-hidden font-sans flex">

            <UserSidebar
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                navItemComponent={NavItem}
            />

            <div className={`transition-all duration-300 flex flex-col min-h-screen w-full ${isCollapsed ? 'pl-20' : 'pl-64'}`}>

                {/* FIXED PROPS: Added isCollapsed prop down here to toggle left alignments */}
                <Navbar
                    user={user}
                    isCollapsed={isCollapsed}
                    onLogout={handleLogout}
                    onSettingsClick={() => navigate('/user/profile')}
                />

                {/* Main panel content layout area */}
                <main className="flex-1 p-6 mt-20 md:p-8 max-w-[1600px] w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>

        </div>
    );
};

export default UserDashboardLayout;