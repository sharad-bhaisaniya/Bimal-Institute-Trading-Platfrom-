import React, { useState, useEffect, useCallback } from 'react';
import { FiBriefcase, FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiPower, FiImage, FiUploadCloud } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { CustomToast } from '../../../components/common/CustomToast';

// IMPORT SERVICES & CONFIG
import { brokerService } from '../../../services/api/broker.service';
import { mediaService } from '../../../services/api/media.service';
import { BASE_URL } from '../../../services/api/api';

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const BrokerManagement = () => {
    const [brokers, setBrokers] = useState([]);
    const [mediaList, setMediaList] = useState([]); // Store all uploaded media references
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBroker, setEditingBroker] = useState(null);

    // ─── DYNAMIC HELPER FUNCTION TO RESOLVE RELATIONAL PATHS ──────────────────
    const getImageUrl = useCallback((logoData) => {
        console.log("=== [getImageUrl Debug] Raw Data Received ===", logoData);

        if (!logoData) {
            console.log("--> [getImageUrl Debug] Data is empty/falsy. Returning null.");
            return null;
        }

        let path = null;
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;

        // 1. If it's a raw MongoDB ObjectId string, look it up in the fetched media array
        if (typeof logoData === 'string' && objectIdRegex.test(logoData)) {
            console.log(`--> [getImageUrl Debug] Detected raw MongoDB ObjectId: ${logoData}. Performing structural lookup inside media store...`);

            const matchedMedia = mediaList.find(m => m._id === logoData);
            if (matchedMedia) {
                path = matchedMedia.url || matchedMedia.filePath || matchedMedia.filename;
                console.log("--> [getImageUrl Debug] Lookup successful! Found matching path in mediaList state:", path);
            } else {
                console.warn(`--> [getImageUrl Debug] Media reference ID ${logoData} not found in the current mediaList archive.`);
                return null;
            }
        }
        // 2. If it is already a populated object from the backend
        else if (typeof logoData === 'object' && logoData !== null) {
            path = logoData.url || logoData.filePath || logoData.filename;
            console.log("--> [getImageUrl Debug] Parsed path from OBJECT wrapper:", path);
        }
        // 3. Local reactive blob streams handle real-time input previews directly
        else if (typeof logoData === 'string' && (logoData.startsWith('http') || logoData.startsWith('blob:'))) {
            console.log("--> [getImageUrl Debug] Detected valid direct HTTP/Blob path:", logoData);
            return logoData;
        }
        // 4. Fallback string assignment
        else if (typeof logoData === 'string') {
            path = logoData;
            console.log("--> [getImageUrl Debug] Parsed path from general string data:", path);
        }

        // Final sanity verification before compilation
        if (!path || path === 'undefined' || path === 'null' || objectIdRegex.test(path)) {
            console.warn("--> [getImageUrl Debug] Path resolved to an invalid pattern. Rendering baseline fallback icon.");
            return null;
        }

        // Ensure path starts with proper root directory location mapping
        if (!path.startsWith('/') && !path.startsWith('uploads/') && !path.includes('/')) {
            path = `/uploads/${path}`;
        }

        const cleanedBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        const cleanedPath = path.startsWith('/') ? path : `/${path}`;
        const finalCompiledUrl = `${cleanedBase}${cleanedPath}`;

        console.log("=== [getImageUrl Debug] Final Rendered Image URL ===", finalCompiledUrl);
        return finalCompiledUrl;
    }, [mediaList]);

    // ─── FETCH BOTH DATA STREAMS CONCURRENTLY ─────────────────────────────────
    const fetchBrokersAndMedia = useCallback(async () => {
        setLoading(true);
        try {
            console.log("--> [Frontend Query] Launching parallel pipeline to pull data stores...");

            // Fetch brokers and media lists simultaneously to optimize processing[cite: 24, 25]
            const [brokerRes, mediaRes] = await Promise.all([
                brokerService.getAll(),
                mediaService.getAllMedia()
            ]);

            const brokersData = brokerRes.data?.data || [];
            const mediaData = mediaRes?.data || mediaRes || [];

            console.log("--> [Frontend Query] Raw brokers loaded:", brokersData);
            console.log("--> [Frontend Query] Raw media catalog repository loaded:", mediaData);

            setMediaList(mediaData);
            setBrokers(brokersData);
        } catch (error) {
            console.error("XX [Frontend Query] Error reloading system repositories:", error);
            toast.error(<CustomToast title="Error" message="Failed to load database elements." />);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrokersAndMedia();
    }, [fetchBrokersAndMedia]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await brokerService.delete(id);
            toast.success(<CustomToast title="Deleted" message={`${name} has been removed.`} />);
            fetchBrokersAndMedia();
        } catch {
            toast.error(<CustomToast title="Error" message="Failed to delete broker." />);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await brokerService.updateStatus(id, { is_active: !currentStatus });
            toast.success(<CustomToast title="Status Updated" message="Broker status changed successfully." />);
            fetchBrokersAndMedia();
        } catch {
            toast.error(<CustomToast title="Error" message="Failed to update status." />);
        }
    };

    const openAddModal = () => {
        setEditingBroker(null);
        setShowModal(true);
    };

    const openEditModal = (broker) => {
        setEditingBroker(broker);
        setShowModal(true);
    };

    return (
        <div style={{ padding: '0', maxWidth: '1100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FiBriefcase color="var(--primary)" /> Broker Management
                    </h1>
                    <p style={{ margin: '0.25rem 0 0', color: '#888', fontSize: '0.85rem' }}>Manage brokerage firms and dynamic tax/charge calculations.</p>
                </div>
                <button onClick={openAddModal}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '0.7rem', padding: '0.65rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                    <FiPlus /> Add Broker
                </button>
            </div>

            {loading ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>Loading Brokers...</div>
            ) : brokers.length === 0 ? (
                <div style={{ color: '#666', textAlign: 'center', padding: '4rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '1rem' }}>
                    <FiBriefcase size={32} style={{ marginBottom: '0.75rem' }} />
                    <p style={{ margin: 0 }}>No brokers found. Add one to get started!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {brokers.map(broker => (
                        <div key={broker._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.9rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {broker.logo && getImageUrl(broker.logo) ? (
                                        <img src={getImageUrl(broker.logo)} alt={broker.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <FiBriefcase color="#888" size={20} />
                                    )}
                                </div>
                                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '14px', height: '14px', borderRadius: '50%', background: broker.is_active ? '#10b981' : '#ef4444', border: '2px solid #1a1a1a', boxShadow: `0 0 8px ${broker.is_active ? '#10b981' : '#ef4444'}` }}></div>
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase' }}>{broker.name}</span>
                                    <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', background: broker.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: broker.is_active ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                        {broker.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem', color: '#aaa', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ color: '#666' }}>Delivery:</span> ₹{broker.equity_delivery_charge}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ color: '#666' }}>Intraday:</span> ₹{broker.equity_intraday_charge}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ color: '#666' }}>Options:</span> ₹{broker.options_charge}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button title="Toggle Status" onClick={() => handleToggleStatus(broker._id, broker.is_active)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiPower size={14} color={broker.is_active ? '#10b981' : '#888'} />
                                </button>
                                <button title="Edit Broker" onClick={() => openEditModal(broker)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#60a5fa', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiEdit2 size={14} />
                                </button>
                                <button title="Delete Broker" onClick={() => handleDelete(broker._id, broker.name)}
                                    style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff6b6b', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiTrash2 size={14} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <BrokerModal
                    onClose={() => setShowModal(false)}
                    onSaved={fetchBrokersAndMedia}
                    existingBroker={editingBroker}
                    mediaList={mediaList}
                    getImageUrl={getImageUrl}
                />
            )}
        </div>
    );
};

// ─── COMPOSE MODAL (For Add/Edit Broker) ──────────────────────────────────────
const BrokerModal = ({ onClose, onSaved, existingBroker, mediaList, getImageUrl }) => {
    const [form, setForm] = useState(
        existingBroker || {
            name: '',
            logo: null,
            equity_delivery_charge: 0,
            equity_intraday_charge: 20,
            options_charge: 20,
            is_active: true,
        }
    );

    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Safe Dynamic initialization for the inside preview layer
    useEffect(() => {
        if (existingBroker?.logo) {
            const initialResolvedUrl = getImageUrl(existingBroker.logo);
            if (initialResolvedUrl) {
                setPreviewUrl(initialResolvedUrl);
            }
        }
    }, [existingBroker, getImageUrl]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            toast.error(<CustomToast title="Validation Error" message="Broker Name is required." />);
            return;
        }

        setSaving(true);
        try {
            let finalLogoReference = existingBroker?.logo?._id || existingBroker?.logo || null;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);

                const res = await mediaService.uploadMedia(formData); //[cite: 25]
                const uploadedMediaId = res?.data?.media?._id || res?.media?._id;

                if (uploadedMediaId) {
                    finalLogoReference = uploadedMediaId;
                } else {
                    throw new Error("Could not parse media reference ID from payload.");
                }
            }

            const payload = { ...form, logo: finalLogoReference };

            if (existingBroker?._id) {
                await brokerService.update(existingBroker._id, payload); //[cite: 24]
                toast.success(<CustomToast title="Updated!" message="Broker details updated successfully." />);
            } else {
                await brokerService.create(payload); //[cite: 24]
                toast.success(<CustomToast title="Added!" message="New broker added successfully." />);
            }
            onSaved();
            onClose();
        } catch (error) {
            console.error("Save Error:", error);
            const errorMsg = error.message || "Failed to save broker.";
            toast.error(<CustomToast title="Error" message={errorMsg} />);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        return () => {
            if (selectedFile && previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [selectedFile, previewUrl]);

    const inp = {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0.6rem',
        padding: '0.65rem 0.9rem',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiBriefcase color="var(--primary)" /> {existingBroker ? 'Edit Broker' : 'Add New Broker'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><FiX size={20} /></button>
                </div>

                <div style={{ margin: '0 0 1.25rem 0' }}>
                    <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.6rem' }}>Broker Logo (Optional)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <FiImage color="#666" size={24} />
                            )}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="brokerLogo"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.6rem",
                                    width: "220px",
                                    height: "48px",
                                    border: "2px dashed #22c55e",
                                    borderRadius: "20px",
                                    background: "rgba(34,197,94,0.06)",
                                    cursor: saving ? "not-allowed" : "pointer",
                                    transition: "all .25s ease",
                                    color: "#bbb",
                                    fontSize: ".85rem",
                                    fontWeight: 500,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(34,197,94,0.12)";
                                    e.currentTarget.style.borderColor = "#4ade80";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(34,197,94,0.06)";
                                    e.currentTarget.style.borderColor = "#22c55e";
                                }}
                            >
                                <FiUploadCloud size={18} color="#22c55e" />
                                {selectedFile ? "Logo Selected ✓" : "Select Logo"}
                            </label>

                            <input
                                id="brokerLogo"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={saving}
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Broker Name *</label>
                    <input style={inp} name="name" value={form.name} onChange={handleChange} placeholder="e.g., ZERODHA" />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Delivery Charge (₹)</label>
                        <input type="number" style={inp} name="equity_delivery_charge" value={form.equity_delivery_charge} onChange={handleChange} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Intraday Charge (₹)</label>
                        <input type="number" style={inp} name="equity_intraday_charge" value={form.equity_intraday_charge} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Options Charge (₹ / Order)</label>
                    <input type="number" style={inp} name="options_charge" value={form.options_charge} onChange={handleChange} />
                </div>

                <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                        type="checkbox"
                        id="isActive"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <label htmlFor="isActive" style={{ color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>Active (Available for trading journal)</label>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '0.65rem 1.2rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#aaa', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                        style={{ padding: '0.65rem 1.5rem', borderRadius: '0.6rem', border: 'none', background: 'var(--primary)', color: '#000', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}>
                        <FiCheck size={16} /> {saving ? 'Processing...' : 'Save Broker'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrokerManagement;