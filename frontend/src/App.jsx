import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BrandLogo from './components/common/BrandLogo';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/home/DashboardHome';
import Users from './pages/dashboard/users/Users';
import UserDetails from './pages/dashboard/users/UserDetails';
import Roles from './pages/dashboard/roles/Roles';
import RoleForm from './pages/dashboard/roles/RoleForm';
import Settings from './pages/dashboard/settings/Settings';
import SmtpCredentials from './pages/dashboard/credentials/SmtpCredentials';
import SmsCredentials from './pages/dashboard/credentials/SmsCredentials';
import RazorpayCredentials from './pages/dashboard/credentials/RazorpayCredentials';
import DigioCredentials from './pages/dashboard/credentials/DigioCredentials';
import YoutubeCredentials from './pages/dashboard/credentials/YoutubeCredentials';
import BlogsList from './pages/dashboard/blogs/BlogsList';
import BlogForm from './pages/dashboard/blogs/BlogForm';
import BlogCategories from './pages/dashboard/blogs/BlogCategories';
import MediaLibrary from './pages/dashboard/media/MediaLibrary';
import CoursesList from './pages/dashboard/courses/CoursesList';
import CourseBuilder from './pages/dashboard/courses/CourseBuilder';
import CourseView from './pages/dashboard/courses/CourseView';
import YouTubeImport from './pages/dashboard/courses/YouTubeImport';
import NotificationCenter from './pages/dashboard/notifications/NotificationCenter';
import SubscriptionPlans from './pages/dashboard/subscription/SubscriptionPlans';
import SubscriptionPlansList from './pages/dashboard/subscription/SubscriptionPlansList';
import UserLayout from './layouts/UserLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Courses from './pages/public/Courses';
import Contact from './pages/public/Contact';
import Kyc from './pages/public/Kyc';
import KycProcess from './pages/kyc/KycProcess';
import Chat from './pages/public/chat/Chat';
import AdminChat from './pages/dashboard/chat/AdminChat';
import TradingJournal from './pages/trading-journal/TradingJournal';
import UserDashboardLayout from './layouts/UserDashboardLayout';
import Profile from './pages/trading-journal/Profile';
import BrokerManagement from './pages/dashboard/tradeBroker/BrokerManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="roles" element={<Roles />} />
          <Route path="roles/create" element={<RoleForm />} />
          <Route path="roles/edit/:id" element={<RoleForm />} />
          <Route path="settings" element={<Settings />} />
          <Route path="credentials/smtp" element={<SmtpCredentials />} />
          <Route path="credentials/sms" element={<SmsCredentials />} />
          <Route path="credentials/razorpay" element={<RazorpayCredentials />} />
          <Route path="credentials/digio" element={<DigioCredentials />} />
          <Route path="credentials/youtube" element={<YoutubeCredentials />} />
          <Route path="blogs" element={<BlogsList />} />
          <Route path="blogs/add" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />
          <Route path="blog-categories" element={<BlogCategories />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="courses" element={<CoursesList />} />
          <Route path="courses/:id" element={<CourseView />} />
          <Route path="courses/builder" element={<CourseBuilder />} />
          <Route path="courses/builder/:id" element={<CourseBuilder />} />
          <Route path="courses/import-youtube" element={<YouTubeImport />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="chat" element={<AdminChat />} />


          <Route path="/dashboard/subscriptions" element={<SubscriptionPlansList />} />
          <Route path="/dashboard/subscriptions/new" element={<SubscriptionPlans />} />
          <Route path="/dashboard/subscriptions/edit/:id" element={<SubscriptionPlans />} />

          <Route path="/dashboard/brokers" element={<BrokerManagement />} />

        </Route>

        <Route path="/student-dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
        </Route>

        <Route path="/trader-dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
        </Route>


        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="courses" element={<Courses />} />
          <Route path="contact" element={<Contact />} />
          <Route path="kyc" element={<Kyc />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        <Route path="/user" element={<UserDashboardLayout />}>
          <Route path="journal" element={<TradingJournal />} />
          <Route path="profile" element={<Profile />} />
        </Route>


        <Route path="/kyc-process" element={<KycProcess />} />
      </Routes>
      <ToastContainer
        position="top-right"
        theme="dark"
        icon={<BrandLogo showText={false} />}
        hideProgressBar={true}
        closeButton={({ closeToast }) => (
          <button className="Toastify__close-button" onClick={closeToast}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      />
    </BrowserRouter>
  );
}

export default App;
