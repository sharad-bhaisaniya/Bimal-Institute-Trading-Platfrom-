/**
 * kyc.controller.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin controller layer — all Digio API logic lives in services/digio/digioService.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const KycVerification = require('../models/KycVerification');
const User = require('../models/User');
const DigioCredential = require('../models/DigioSetting');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

const {
  initiateDigioKyc,
  approveKycManually,
  fetchAndUpdateKycStatus,
} = require('../services/digio/digioService');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Initiate Digio KYC
// @route   POST /api/v1/kyc/initiate
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
exports.initiateKyc = asyncHandler(async (req, res, next) => {
  console.log(`[KYC] 🚀 initiateKyc called by user: ${req.user._id}`);

  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  const mobile = req.body.phone || user.phone;
  const name   = req.body.name  || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || 'User');

  if (!mobile) {
    console.warn('[KYC] ⚠️ Mobile number missing for user:', user._id);
    return next(new ErrorResponse('Mobile number is required to initiate KYC', 400));
  }

  // Block if there is already an active KYC (not abandoned / not rejected)
  const lastKyc = await KycVerification.findOne({ user: user._id }).sort({ createdAt: -1 });
  if (lastKyc && ['pending', 'approval_pending', 'approved', 'initiated'].includes(lastKyc.status)) {
    console.warn(`[KYC] ⚠️ KYC already in progress/completed for user ${user._id} — status: ${lastKyc.status}`);
    return res.status(400).json({
      success: false,
      message: `KYC already ${lastKyc.status === 'approved' ? 'approved' : 'in progress'}`,
      status: lastKyc.status,
    });
  }

  try {
    const result = await initiateDigioKyc({ name, mobile, email: user.email });

    // Persist the new KYC request
    await KycVerification.create({
      user:              user._id,
      digio_document_id: result.document_id,
      customer_name:     name,
      customer_mobile:   mobile,
      customer_email:    user.email,
      reference_id:      result.reference_id,
      transaction_id:    result.transaction_id,
      status:            'initiated',
      kyc_details:       { type: 're-kyc' },
      raw_response:      result.raw_response,
    });

    console.log(`[KYC] ✅ KYC initiated — doc ID: ${result.document_id}`);

    res.status(200).json({
      success:       true,
      document_id:   result.document_id,
      redirect_url:  result.redirect_url,
    });
  } catch (error) {
    console.error('[KYC] ❌ Digio initiation error:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Digio API error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Digio Callback — user redirected back after completing Digio flow
// @route   GET /api/v1/kyc/callback
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.digioCallback = asyncHandler(async (req, res, next) => {
  const { digio_doc_id } = req.query;
  console.log(`[KYC] 🔔 digioCallback received — doc ID: ${digio_doc_id}`);

  if (!digio_doc_id) {
    return res.status(400).json({ success: false, message: 'Invalid callback: document ID missing' });
  }

  const kyc = await KycVerification.findOne({ digio_document_id: digio_doc_id });
  if (!kyc) {
    console.error(`[KYC] ❌ No KYC record for doc ID: ${digio_doc_id}`);
    return res.status(404).json({ success: false, message: 'KYC record not found' });
  }

  // Trigger approval if needed
  if (['initiated', 'approval_pending', 'requested'].includes(kyc.status)) {
    console.log(`[KYC] ⚡ Status is "${kyc.status}" — auto-approving`);
    await approveKycManually(digio_doc_id);
  }

  // Fetch & persist final status/documents
  await fetchAndUpdateKycStatus(digio_doc_id);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  console.log(`[KYC] ✅ Callback processed — redirecting to frontend`);
  res.redirect(`${frontendUrl}/kyc-process?kyc_status=updated&digio_doc_id=${digio_doc_id}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Check KYC status for the logged-in user
// @route   GET /api/v1/kyc/status
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
exports.checkKycStatus = asyncHandler(async (req, res, next) => {
  console.log(`[KYC] 🔍 checkKycStatus called by user: ${req.user._id}`);

  const user = await User.findById(req.user._id);
  const credential = await DigioCredential.findOne({ isActive: true });

  if (!credential) {
    console.warn('[KYC] ⚠️ Digio is inactive — returning manual status');
    const status = user?.kyc_status || 'pending';
    return res.status(200).json({
      success: true,
      digio_active: false,
      kyc_status: status,
      kyc_details: status === 'approved' ? { aadhaar: 'Manually Verified', pan: 'Manually Verified' } : null,
      message: 'Digio is inactive — KYC is manually managed.',
    });
  }

  const kyc = await KycVerification.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (!kyc) {
    return res.status(200).json({
      success: true,
      digio_active: true,
      kyc_status: user?.kyc_status || 'none',
      message: 'No KYC record found',
    });
  }

  const updatedKyc = await fetchAndUpdateKycStatus(kyc.digio_document_id);

  res.status(200).json({
    success: true,
    digio_active: true,
    kyc_status:     updatedKyc?.status    || user?.kyc_status || 'pending',
    kyc_details:    updatedKyc?.kyc_details    || null,
    aadhaar_details: updatedKyc?.aadhaar_details || null,
    raw_response:   updatedKyc?.raw_response   || null,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get full KYC + User details for the current user
// @route   GET /api/v1/kyc/full-details
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
exports.getKycFullDetails = asyncHandler(async (req, res, next) => {
  console.log(`[KYC] 📋 getKycFullDetails called by user: ${req.user._id}`);

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const credential = await DigioCredential.findOne({ isActive: true });
  if (!credential) {
    const status = user.kyc_status || 'pending';
    return res.status(200).json({
      success: true,
      digio_active: false,
      user,
      kyc: { status, kyc_details: status === 'approved' ? { aadhaar: 'Manually Verified', pan: 'Manually Verified' } : null },
      message: 'Digio is inactive — KYC is manually managed.',
    });
  }

  const kyc = await KycVerification.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (!kyc) {
    return res.status(200).json({
      success: true,
      digio_active: true,
      user,
      kyc: null,
      message: 'No KYC record found',
    });
  }

  const updatedKyc = await fetchAndUpdateKycStatus(kyc.digio_document_id);

  res.status(200).json({
    success: true,
    digio_active: true,
    user,
    kyc:             updatedKyc || kyc,
    kyc_details:     updatedKyc?.kyc_details     || kyc.kyc_details,
    aadhaar_details: updatedKyc?.aadhaar_details  || kyc.aadhaar_details,
    raw_response:    updatedKyc?.raw_response     || kyc.raw_response,
  });
});
