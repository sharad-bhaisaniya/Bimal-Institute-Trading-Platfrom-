import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { subscriptionPlanService } from '../../../services/api/subscriptionPlan.service';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { CustomToast } from '../../../components/common/CustomToast';

// Yup Validation mapping perfectly to your Mongoose schema
const schema = yup.object().shape({
    name: yup.string().required('Plan name is required'),
    description: yup.string(),
    price: yup.number().typeError('Price must be a number').min(0, 'Minimum price is 0').required('Price is required'),
    currency: yup.string().oneOf(['INR', 'USD', 'EUR', 'GBP']).required('Currency is required'),
    duration: yup.number().typeError('Duration must be a number').min(0, 'Minimum duration is 0').required('Duration is required'),
    durationType: yup.string().oneOf(['days', 'months', 'years', 'lifetime']).required('Duration Type is required'),
    badge: yup.string(),
    badgeColor: yup.string().default('#bfff00'),
    trialDays: yup.number().typeError('Trial days must be a number').default(0),
    maxUsers: yup.number().typeError('Max users must be a number').default(-1),
    sortOrder: yup.number().typeError('Sort order must be a number').default(0)
});

const SubscriptionPlanForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    // Dynamic state list to track explicit array items for features list
    const [featuresList, setFeaturesList] = useState([]);
    const [currentFeature, setCurrentFeature] = useState('');

    const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            currency: 'INR',
            durationType: 'months',
            trialDays: 0,
            maxUsers: -1,
            sortOrder: 0,
            badgeColor: '#bfff00'
        }
    });

    useEffect(() => {
        if (isEditing) {
            const fetchPlan = async () => {
                try {
                    const res = await subscriptionPlanService.getPlanById(id);
                    const plan = res.data;
                    if (plan) {
                        setValue('name', plan.name);
                        setValue('description', plan.description);
                        setValue('price', plan.price);
                        setValue('currency', plan.currency);
                        setValue('duration', plan.duration);
                        setValue('durationType', plan.durationType);
                        setValue('badge', plan.badge);
                        setValue('badgeColor', plan.badgeColor);
                        setValue('trialDays', plan.trialDays);
                        setValue('maxUsers', plan.maxUsers);
                        setValue('sortOrder', plan.sortOrder);
                        if (plan.features) setFeaturesList(plan.features);
                    }
                } catch (err) {
                    toast.error(<CustomToast title="Error" message={err.response?.data?.message || 'Failed to fetch subscription plan'} />);
                    navigate('/dashboard/subscriptions');
                }
            };
            fetchPlan();
        }
    }, [id, isEditing, setValue, navigate]);

    // Fixed: Handles adding the feature and clears the local state element
    const handleAddFeature = (e) => {
        if (e) e.preventDefault(); // Strongly prevent form side-effects
        if (!currentFeature.trim()) return;
        setFeaturesList([...featuresList, currentFeature.trim()]);
        setCurrentFeature('');
    };

    // Fixed: Intercept Enter key inside feature input box
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Stop form from trying to submit entirely
            handleAddFeature();
        }
    };

    const handleRemoveFeature = (index) => {
        setFeaturesList(featuresList.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        try {
            const payload = { ...data, features: featuresList };

            if (isEditing) {
                await subscriptionPlanService.updatePlan(id, payload);
                toast.success(<CustomToast title="Success" message="Plan updated successfully" />);
            } else {
                await subscriptionPlanService.createPlan(payload);
                toast.success(<CustomToast title="Success" message="Plan created successfully" />);
            }
            navigate('/dashboard/subscriptions');
        } catch (error) {
            toast.error(<CustomToast title="Error" message={error.response?.data?.message || 'Failed to save plan'} />);
        }
    };

    return (
        <div style={{ padding: '2rem', width: '100%' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Header & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/dashboard/subscriptions')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#fff' }}>{isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</h1>
                            <p style={{ color: '#888', margin: '0.25rem 0 0 0' }}>{isEditing ? 'Modify tier parameters and access privileges' : 'Configure new pricing tier parameters'}</p>
                        </div>
                    </div>

                    <Button type="submit" isLoading={isSubmitting} style={{ padding: '0.8rem 2.5rem', fontSize: '1.05rem', borderRadius: '0.75rem' }}>
                        {isEditing ? 'Save Tier Configuration' : 'Publish Plan'}
                    </Button>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    {/* Left Column: Core Pricing Fields */}
                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                            <Input label="Plan Name" placeholder="e.g. Enterprise Tier" {...register('name')} error={errors.name?.message} />
                            <Input label="Base Price" type="number" step="any" placeholder="0.00" {...register('price')} error={errors.price?.message} />
                            <Controller
                                name="currency"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        label="Currency"
                                        value={value}
                                        onChange={onChange}
                                        options={[
                                            { value: 'INR', label: 'INR (₹)' },
                                            { value: 'USD', label: 'USD ($)' },
                                            { value: 'EUR', label: 'EUR (€)' },
                                            { value: 'GBP', label: 'GBP (£)' }
                                        ]}
                                    />
                                )}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input label="Duration Length" type="number" placeholder="1" {...register('duration')} error={errors.duration?.message} />
                            <Controller
                                name="durationType"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        label="Duration Interval"
                                        value={value}
                                        onChange={onChange}
                                        options={[
                                            { value: 'days', label: 'Days' },
                                            { value: 'months', label: 'Months' },
                                            { value: 'years', label: 'Years' },
                                            { value: 'lifetime', label: 'Lifetime' }
                                        ]}
                                    />
                                )}
                            />
                        </div>

                        <Input label="Short Description / Subtext" placeholder="Describe the purpose of this package tier..." {...register('description')} error={errors.description?.message} />

                        {/* Feature List Builder section */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Tier Entitlements / Features</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        placeholder="e.g. 24/7 Dedicated Server Access Support"
                                        value={currentFeature}
                                        onChange={(e) => setCurrentFeature(e.target.value)}
                                        onKeyDown={handleKeyDown} // Intercepts the Enter key locally
                                    />
                                </div>
                                <button type="button" onClick={handleAddFeature} style={{ height: '46px', padding: '0 1.25rem', background: 'var(--primary)', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <FiPlus /> Add
                                </button>
                            </div>

                            {/* Dynamic Features List Render */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {featuresList.map((feat, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                                        <span style={{ color: '#eee', fontSize: '0.9rem', flex: 1 }}>{feat}</span>
                                        <button type="button" onClick={() => handleRemoveFeature(index)} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Custom Threshold Metadata & Badging System */}
                    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <Input label="Free Trial Period (Days)" type="number" {...register('trialDays')} error={errors.trialDays?.message} />
                            <Input label="Max Concurrent Users (-1 = Unlimited)" type="number" {...register('maxUsers')} error={errors.maxUsers?.message} />
                            <Input label="Interface Sorting Weight" type="number" {...register('sortOrder')} error={errors.sortOrder?.message} />
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <Input label="Highlight Tag / Badge" placeholder="e.g. Most Popular" {...register('badge')} error={errors.badge?.message} />
                            <Input label="Tag Hex Color Hex" type="color" {...register('badgeColor')} error={errors.badgeColor?.message} style={{ height: '40px', padding: '2px', cursor: 'pointer' }} />
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default SubscriptionPlanForm;