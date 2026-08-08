import React from 'react';
import SubscriptionPlans from './components/SubscriptionPlans';

const UserSubscriptions = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-8">
      <SubscriptionPlans />
    </div>
  );
};

export default UserSubscriptions;
