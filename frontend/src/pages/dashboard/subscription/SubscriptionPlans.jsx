import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiPlus, FiX, FiArrowLeft } from 'react-icons/fi';
import { subscriptionPlanService } from '../../../services/api/subscription/subscriptionPlan.service';

// Validation schema with Yup (Cleaned up limits & access configurations)
const schema = yup.object({
    planName: yup.string().required('Plan name is required'),
    description: yup.string().default(''),
    price: yup
        .number()
        .typeError('Price must be a number')
        .required('Price is required'),
    billingCycle: yup
        .string()
        .oneOf(['monthly', 'quarterly', 'half_yearly', 'yearly', 'lifetime'], 'Invalid billing cycle')
        .required('Billing cycle is required'),
    displayOrder: yup
        .number()
        .typeError('Priority order must be a number')
        .oneOf([0, 1, 2, 3], 'Invalid priority level')
        .default(0),
});

// Common Modern Styles
const styles = {
    container: { padding: '2rem', width: '100%', color: '#fff' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '1.75rem', fontWeight: 700, margin: 0 },
    subtitle: { color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' },
    mainGrid: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
    leftCol: { flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    rightCol: { width: '520px', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.85rem', color: '#888', fontWeight: 500 },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'border 0.2s',
    },
    select: {
        width: '100%',
        backgroundColor: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
    },
    errorText: { color: '#ff6b6b', fontSize: '0.75rem', margin: '0.25rem 0 0 0' },
    card: {
        background: 'rgba(255,255,255,0.02)',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
    },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eee', cursor: 'pointer', fontSize: '0.9rem' },
    btnPrimary: {
        background: 'var(--primary, #bfff00)',
        color: '#000',
        fontWeight: 600,
        padding: '0.7rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem'
    }
};

function SubscriptionPlanForm({ onSuccess }) {
    const { id } = useParams();
    const targetId = id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [featuresList, setFeaturesList] = useState([]);
    const [newFeature, setNewFeature] = useState('');

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            planName: '',
            description: '',
            price: 0,
            billingCycle: 'monthly',
            displayOrder: 0,
            isActive: true,
            isFeatured: false
        }
    });

    // Fetch operational rules
    useEffect(() => {
        if (targetId) {
            setLoading(true);
            subscriptionPlanService.getById(targetId)
                .then(res => {
                    const data = res.data?.data || res.data;
                    if (data) {
                        reset({
                            planName: data.name || data.planName || '',
                            description: data.description || '',
                            price: data.price || 0,
                            billingCycle: data.plan_duration || data.billingCycle || 'monthly',
                            displayOrder: data.display_order !== undefined ? data.display_order : 0,
                            isActive: data.is_active !== undefined ? data.is_active : (data.isActive !== undefined ? data.isActive : true),
                            isFeatured: data.is_featured !== undefined ? data.is_featured : (data.isFeatured !== undefined ? data.isFeatured : false)
                        });
                        setFeaturesList(data.features || []);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setApiError(err.response?.data?.message || err.message || 'Failed to load details.');
                })
                .finally(() => setLoading(false));
        } else {
            reset({
                planName: '',
                description: '',
                price: 0,
                billingCycle: 'monthly',
                displayOrder: 0,
                isActive: true,
                isFeatured: false
            });
            setFeaturesList([]);
        }
    }, [targetId, reset]);

    const addFeature = (e) => {
        if (e) e.preventDefault();
        const feature = newFeature.trim();
        if (!feature) return;
        setFeaturesList(prev => [...prev, feature]);
        setNewFeature('');
    };

    const removeFeature = (index) => {
        setFeaturesList(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        setApiError('');
        setLoading(true);

        const payload = {
            ...data,
            name: data.planName,
            plan_duration: data.billingCycle,
            display_order: Number(data.displayOrder),
            is_active: data.isActive,
            is_featured: data.isFeatured,
            features: featuresList
        };

        try {
            let response;
            if (targetId) {
                response = await subscriptionPlanService.update(targetId, payload);
            } else {
                response = await subscriptionPlanService.create(payload);
            }
            if (onSuccess) {
                onSuccess(response);
            } else {
                navigate('/dashboard/subscriptions');
            }
        } catch (err) {
            console.error(err);
            setApiError(err.response?.data?.message || err.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading && targetId && featuresList.length === 0) {
        return (
            <div style={{ ...styles.container, textAlign: 'center', padding: '4rem', color: '#888' }}>
                Fetching platform subscription matrix...
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Dynamic Title Headers */}
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/dashboard/subscriptions')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 style={styles.title}>{targetId ? 'Edit Subscription Tier' : 'Deploy Subscription Plan'}</h1>
                            <p style={styles.subtitle}>Configure runtime parameters, pricing structures, and inclusion parameters.</p>
                        </div>
                    </div>
                    <button type="submit" style={styles.btnPrimary} disabled={isSubmitting || loading}>
                        {targetId ? 'Update Configurations' : 'Publish Plan'}
                    </button>
                </div>

                {apiError && (
                    <div style={{ ...styles.card, borderColor: '#ff6b6b', color: '#ff6b6b', marginBottom: '1.5rem', padding: '0.75rem' }}>
                        {apiError}
                    </div>
                )}

                <div style={styles.mainGrid}>

                    {/* Left Panel: Primary Content Inputs */}
                    <div style={styles.leftCol}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Plan Title / Name</label>
                                <input style={styles.input} placeholder="e.g. Premium Pro" {...register('planName')} />
                                {errors.planName && <p style={styles.errorText}>{errors.planName.message}</p>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Base Price</label>
                                <input style={styles.input} type="number" step="0.01" placeholder="0.00" {...register('price')} />
                                {errors.price && <p style={styles.errorText}>{errors.price.message}</p>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Billing Intervals</label>
                                <select style={styles.select} {...register('billingCycle')}>
                                    <option value="monthly">Monthly Plan Cycle</option>
                                    <option value="quarterly">Quarterly Cycle</option>
                                    <option value="half_yearly">Half Yearly Cycle</option>
                                    <option value="yearly">Yearly Absolute Cycle</option>
                                    <option value="lifetime">Lifetime Access Plan</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Priority Display Order</label>
                                <select style={styles.select} {...register('displayOrder')}>
                                    <option value={0}>0 - High Priority</option>
                                    <option value={1}>1 - Medium-High Priority</option>
                                    <option value={2}>2 - Medium Priority</option>
                                    <option value={3}>3 - Low Priority</option>
                                </select>
                                {errors.displayOrder && <p style={styles.errorText}>{errors.displayOrder.message}</p>}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Short Summary Description</label>
                            <textarea style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }} placeholder="Specify targeted tier user profile..." {...register('description')} />
                        </div>
                    </div>

                    {/* Right Panel: Features List Builder & Lifecycle Toggles */}
                    <div style={styles.rightCol}>

                        {/* Features & Tier Inclusion Card */}
                        <div style={styles.card}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Features & Tier Inclusion Rules</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                        placeholder="Add entitlement..."
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                                    />
                                    <button type="button" onClick={addFeature} style={{ ...styles.btnPrimary, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <FiPlus /> Add
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                                    {featuresList.map((feat, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#ddd' }}>{feat}</span>
                                            <button type="button" onClick={() => removeFeature(idx)} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status Configurations Card */}
                        <div style={styles.card}>
                            <label style={styles.checkboxLabel}>
                                <input type="checkbox" {...register('isActive')} style={{ width: '16px', height: '16px', accentColor: '#bfff00' }} />
                                Active Lifecycle Status
                            </label>

                            <label style={styles.checkboxLabel}>
                                <input type="checkbox" {...register('isFeatured')} style={{ width: '16px', height: '16px', accentColor: '#bfff00' }} />
                                Highlight as Featured Tier
                            </label>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default SubscriptionPlanForm;