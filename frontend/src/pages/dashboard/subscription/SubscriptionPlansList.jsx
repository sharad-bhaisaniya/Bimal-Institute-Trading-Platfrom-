import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiDollarSign } from 'react-icons/fi';
import { FaIndianRupeeSign } from "react-icons/fa6";

import { toast } from 'react-toastify';

import { subscriptionPlanService } from '../../../services/api/subscription/subscriptionPlan.service';
import Button from '../../../components/common/Button';
import { CustomToast } from '../../../components/common/CustomToast';

const SubscriptionPlansList = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const res = await subscriptionPlanService.getAll();

            // Fix: Extract the array from the backend envelope structure (res.data.data)
            const planData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
            setPlans(planData);
        } catch (error) {
            toast.error(<CustomToast title="Error" message="Failed to fetch subscription plans" />);
            setPlans([]); // Fallback to an empty array to prevent view crashes
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleToggleActive = async (id, currentStatus) => {
        try {
            // Toggles active state via updateStatus endpoint matching subscriptionPlan.service.js
            await subscriptionPlanService.updateStatus(id, { is_active: !currentStatus });
            toast.success(<CustomToast title="Success" message="Plan status updated successfully" />);
            fetchPlans();
        } catch (error) {
            toast.error(<CustomToast title="Error" message="Failed to change plan status" />);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subscription plan permanently?')) return;
        try {
            await subscriptionPlanService.delete(id);
            toast.success(<CustomToast title="Success" message="Subscription plan deleted successfully" />);
            fetchPlans();
        } catch (error) {
            toast.error(<CustomToast title="Error" message="Failed to delete subscription plan" />);
        }
    };

    return (
        <div style={{ padding: '0' }}>
            {/* View Header Matrix */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>Subscription Plans</h1>
                    <p style={{ color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Configure platform tier thresholds, dynamic badges, billing cycles, and access control matrices.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/subscriptions/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <FiPlus /> Add Tier Plan
                </Button>
            </div>

            {/* Main Dark Data Grid Container */}
            <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>Loading subscription configurations...</div>
                ) : plans.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>No pricing tiers deployed. Create your first subscription plan configuration!</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Tier Details</th>
                                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing Rates & Interval</th>
                                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort & Display Hierarchy</th>
                                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State Visibility</th>
                                <th style={{ padding: '0.75rem 1rem', color: '#666', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan) => (
                                <tr key={plan._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>

                                    {/* Name and Badge Custom Colorings */}
                                    <td style={{ padding: '0.75rem 1rem', color: '#fff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '6px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FaIndianRupeeSign color="var(--primary)" size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {plan.name}
                                                    {plan.badge && (
                                                        <span style={{
                                                            fontSize: '0.6rem',
                                                            padding: '2px 6px',
                                                            backgroundColor: 'rgba(189,255,0,0.15)',
                                                            color: 'var(--primary)',
                                                            borderRadius: '4px',
                                                            fontWeight: 700,
                                                            border: '1px solid rgba(189,255,0,0.30)',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {plan.badge}
                                                        </span>
                                                    )}
                                                    {plan.is_featured && (
                                                        <span style={{
                                                            fontSize: '0.6rem',
                                                            padding: '2px 6px',
                                                            backgroundColor: 'rgba(0,180,255,0.15)',
                                                            color: '#00b4ff',
                                                            borderRadius: '4px',
                                                            fontWeight: 700,
                                                            border: '1px solid rgba(0,180,255,0.30)',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px', width: '270px', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {plan.description ? plan.description : 'No specific metadata description allocated.'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Pricing details mapped to schema fields */}
                                    <td style={{ padding: '0.75rem 1rem', color: '#eee', fontSize: '0.85rem', fontWeight: 500 }}>
                                        <div>
                                            {plan.sale_price > 0 ? (
                                                <>
                                                    <span style={{ textDecoration: 'line-through', color: '#555', marginRight: '6px' }}>
                                                        {plan.price} {plan.currency}
                                                    </span>
                                                    <span>{plan.sale_price} {plan.currency}</span>
                                                </>
                                            ) : (
                                                <span>{plan.price} {plan.currency}</span>
                                            )}
                                            <span style={{ color: '#555', fontSize: '0.75rem', marginLeft: '4px', textTransform: 'capitalize' }}>
                                                / {plan.plan_duration}
                                            </span>
                                        </div>
                                        {plan.trial_days > 0 && (
                                            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
                                                Includes {plan.trial_days}-day trial block
                                            </div>
                                        )}
                                    </td>

                                    {/* System display parameters weights */}
                                    <td style={{ padding: '0.75rem 1rem', color: '#aaa', fontSize: '0.8rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#eee' }}>
                                            Order Priority: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{plan.display_order}</span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '2px' }}>
                                            Slug Reference: /{plan.slug}
                                        </div>
                                    </td>

                                    {/* Visibility state mapping */}
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span style={{
                                            padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                                            backgroundColor: plan.is_active ? 'rgba(189,255,0,0.1)' : 'rgba(255,100,100,0.1)',
                                            color: plan.is_active ? 'var(--primary)' : '#ff6b6b'
                                        }}>
                                            {plan.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    {/* Operational actions mappings */}
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleToggleActive(plan._id, plan.is_active)}
                                                title={plan.is_active ? "Deactivate Plan" : "Activate Plan"}
                                                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: plan.is_active ? 'var(--primary)' : '#888', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                {plan.is_active ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/dashboard/subscriptions/edit/${plan._id}`)}
                                                title="Edit Parameters"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <FiEdit2 size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan._id)}
                                                title="Delete Plan Config"
                                                style={{ background: 'rgba(255,100,100,0.1)', border: 'none', color: '#ff6b6b', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPlansList;