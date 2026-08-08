import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Shield } from 'lucide-react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { subscriptionPlanService } from '../../../services/api/subscription/subscriptionPlan.service';
import { subscriptionPaymentService } from '../../../services/api/subscription/subscriptionPayment.service';
import { userSubscriptionService } from '../../../services/api/subscription/userSubscription.service';
import { kycService } from '../../../services/api/kyc.service';
import { toast } from 'react-toastify';
import { CustomToast } from '../../../components/common/CustomToast';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState(null);
  const [mySubscription, setMySubscription] = useState(null);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch Plans
        const res = await subscriptionPlanService.getAll();
        const planData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setPlans(planData.filter(plan => plan.is_active));

        // Fetch My Subscriptions
        try {
          const subRes = await userSubscriptionService.getMy();
          if (subRes.data?.data && subRes.data.data.length > 0) {
            setMySubscription(subRes.data.data[0]);
          }
        } catch (subErr) {
          console.error("Failed to fetch my subscriptions", subErr);
        }

        // Fetch KYC Status
        try {
          const kycRes = await kycService.getStatus();
          setKycStatus(kycRes?.kyc_status || null);
        } catch (kycErr) {
          console.error("Failed to fetch KYC status", kycErr);
        }
        
      } catch (error) {
        toast.error(<CustomToast title="Error" message="Failed to fetch subscription plans" />);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePurchase = async (plan) => {
    if (kycStatus !== 'approved' && kycStatus !== 'verified') {
      toast.error(
        <CustomToast 
          title="KYC Required" 
          message="Your KYC must be approved before you can purchase a subscription." 
        />
      );
      return;
    }

    try {
      const toastId = toast.loading(<CustomToast title="Processing" message="Initiating purchase flow..." />);
      
      const orderRes = await subscriptionPaymentService.createOrder({ planId: plan._id });
      
      if (!orderRes.data?.success) {
        toast.update(toastId, { render: <CustomToast title="Error" message="Failed to create order" />, type: "error", isLoading: false, autoClose: 3000 });
        return;
      }

      if (orderRes.data?.isFree) {
        toast.update(toastId, { render: <CustomToast title="Success" message="Free subscription activated successfully!" />, type: "success", isLoading: false, autoClose: 3000 });
        // Update local state to immediately show as subscribed
        setMySubscription({
            subscription_plan: plan,
            end_date: plan.plan_duration !== 'lifetime' ? new Date(Date.now() + 30*24*60*60*1000) : null 
        });
        return;
      }

      toast.dismiss(toastId);

      const options = {
        key: orderRes.data.keyId, 
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "Bimal Institute",
        description: `Purchase ${plan.name}`,
        order_id: orderRes.data.orderId,
        handler: async function (response) {
          try {
            const verifyToast = toast.loading(<CustomToast title="Verifying" message="Verifying payment..." />);
            
            const verifyRes = await subscriptionPaymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id
            });

            if (verifyRes.data?.success) {
              toast.update(verifyToast, { render: <CustomToast title="Success" message="Subscription activated successfully!" />, type: "success", isLoading: false, autoClose: 3000 });
              // Update local state
              setMySubscription({
                  subscription_plan: plan,
                  end_date: plan.plan_duration !== 'lifetime' ? new Date(Date.now() + 30*24*60*60*1000) : null 
              });
            } else {
              toast.update(verifyToast, { render: <CustomToast title="Error" message="Payment verification failed." />, type: "error", isLoading: false, autoClose: 3000 });
            }
          } catch (verifyErr) {
            toast.error(<CustomToast title="Error" message="Payment verification error." />);
          }
        },
        theme: {
          color: "#111111", // Dark black primary color
          backdrop_color: "#000000" // Dark background
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
          toast.error(<CustomToast title="Payment Failed" message={response.error.description} />);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Something went wrong during checkout.";
      toast.error(<CustomToast title="Error" message={errorMsg} />);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="py-12 relative">
      {mySubscription && (
        <div className="absolute top-4 right-4 bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-end z-10">
          <span className="text-[#10b981] font-bold text-sm mb-1 flex items-center">
            <Crown size={14} className="mr-1"/> My Subscription
          </span>
          <span className="text-white font-semibold text-lg">{mySubscription.subscription_plan?.name}</span>
          {mySubscription.end_date ? (
            <span className="text-gray-400 text-xs mt-1">Expires: {new Date(mySubscription.end_date).toLocaleDateString()}</span>
          ) : (
            <span className="text-gray-400 text-xs mt-1">Lifetime Access</span>
          )}
        </div>
      )}

      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Unlock Premium Features
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          Choose the right plan to supercharge your trading journey. Get advanced analytics, psychological insights, and real-time alerts.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {plans.map((plan, index) => {
          const isSubscribed = mySubscription?.subscription_plan?._id === plan._id || mySubscription?.subscription_plan === plan._id;
          const isFeatured = plan.is_featured || plan.name.toLowerCase().includes('pro');

          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative rounded-2xl border p-8 flex flex-col h-full ${isFeatured
                  ? 'bg-gradient-to-b from-[#10b981]/10 to-transparent border-[#10b981]/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                  : 'bg-[#111] border-gray-800'
                }`}
            >
              {isSubscribed ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center shadow-lg shadow-blue-600/20">
                    <Check size={14} className="mr-1.5" strokeWidth={3} /> SUBSCRIBED
                  </span>
                </div>
              ) : isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#10b981] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg shadow-[#10b981]/20">
                    <Crown size={14} className="mr-1" /> MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.badge && (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981]">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline mb-2">
                  <FaIndianRupeeSign className="text-xl text-gray-400" />
                  <span className="text-4xl font-bold text-white">
                    {plan.sale_price > 0 ? plan.sale_price : plan.price}
                  </span>
                  <span className="text-gray-400 ml-2">/{plan.plan_duration}</span>
                </div>

                {plan.sale_price > 0 && (
                  <div className="text-sm text-gray-500 line-through flex items-center">
                    <FaIndianRupeeSign className="text-xs" />
                    {plan.price}
                  </div>
                )}

                <p className="text-gray-400 text-sm mt-4 min-h-[40px]">
                  {plan.description || 'Access basic trading tools and journal.'}
                </p>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {['Advanced Trade Analytics', 'Psychological Insights', 'Real-time Alerts', 'Custom Goals Tracking'].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`mt-1 mr-3 rounded-full p-1 ${isFeatured ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-gray-800 text-gray-400'}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => !isSubscribed && handlePurchase(plan)}
                disabled={isSubscribed}
                className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center ${isSubscribed
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                    : isFeatured
                    ? 'bg-[#10b981] text-white hover:bg-[#059669] shadow-lg shadow-[#10b981]/25 hover:shadow-xl hover:shadow-[#10b981]/40'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
              >
                {isSubscribed ? 'Active Plan' : (plan.trial_days > 0 ? `Start ${plan.trial_days}-Day Trial` : 'Get Started')}
                {!isSubscribed && <Zap size={16} className="ml-2" />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
