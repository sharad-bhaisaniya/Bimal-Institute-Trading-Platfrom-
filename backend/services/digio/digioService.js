/**
 * digioService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised service layer for all Digio KYC API interactions.
 * Keeps the controller thin and makes each helper independently testable.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

const KycVerification = require('../../models/KycVerification');
const User = require('../../models/User');
// DigioSetting.js is now updated to export as DigioCredential
const DigioCredential = require('../../models/DigioSetting');

// ─── INTERNAL HELPER: load active Digio credential ──────────────────────────

const getCredential = async () => {
  const credential = await DigioCredential.findOne({ isActive: true });
  if (!credential) {
    console.error('[Digio] ❌ No active Digio credential found in DB');
    return null;
  }
  return credential;
};

const buildAuthHeader = (credential) => {
  const encoded = Buffer.from(
    `${credential.client_id}:${credential.client_secret}`
  ).toString('base64');
  return `Basic ${encoded}`;
};

const getBaseUrl = (credential) => {
  let url = (credential.api_base_url || 'https://ext.digio.in:444').replace(/\/$/, '');
  if (url === 'https://ext.digio.in') {
    url = 'https://ext.digio.in:444';
  }
  return url;
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE: Initiate KYC on Digio
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new KYC request on Digio with the given template.
 * Returns: { document_id, redirect_url } on success, throws on failure.
 */
const initiateDigioKyc = async ({ name, mobile, email }) => {
  console.log(`[Digio] 🚀 Initiating KYC for mobile: ${mobile}, name: ${name}`);

  const credential = await getCredential();
  if (!credential) throw new Error('Digio configuration missing or inactive');

  const baseUrl = getBaseUrl(credential);
  const authHeader = buildAuthHeader(credential);
  const workflow = credential.workflow_name;

  const referenceId = `KYC_${Date.now()}`;
  const transactionId = referenceId;

  const payload = {
    template_name: workflow,
    customer_identifier: mobile,
    customer_name: name,
    reference_id: referenceId,
    transaction_id: transactionId,
    notify_customer: false,
    expire_in_days: 1,
    message: 'KYC Verification',
  };

  console.log('[Digio] 📤 Sending initiation payload:', JSON.stringify(payload, null, 2));

  const response = await axios.post(
    `${baseUrl}/client/kyc/v2/request/with_template`,
    payload,
    {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = response.data;
  console.log('[Digio] ✅ Initiation response:', JSON.stringify(data, null, 2));

  if (!data.id) {
    console.error('[Digio] ❌ Digio response missing document id', data);
    throw new Error('Digio response missing document id');
  }

  // Build redirect URL
  const redirectBase = baseUrl.includes('ext.digio')
    ? 'https://ext.digio.in/#/gateway/login/'
    : 'https://app.digio.in/#/gateway/login/';

  const frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:5173';

  const callbackUrl = `${frontendUrl}/kyc-process?kyc_callback=true&digio_doc_id=${data.id}`;

  const redirectUrl = `${redirectBase}${data.id}/${Date.now()}/${mobile}?redirect_url=${encodeURIComponent(
    callbackUrl
  )}`;

  return {
    document_id: data.id,
    redirect_url: redirectUrl,
    reference_id: referenceId,
    transaction_id: transactionId,
    raw_response: data,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE: Manually Approve KYC on Digio
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calls the Digio manage_approval endpoint to auto-approve a KYC request.
 * Returns Digio's response data or null on failure.
 */
const approveKycManually = async (digioDocId) => {
  console.log(`[Digio] 🔑 Attempting manual approval for doc ID: ${digioDocId}`);

  const credential = await getCredential();
  if (!credential) return null;

  const baseUrl = getBaseUrl(credential);
  const authHeader = buildAuthHeader(credential);
  const url = `${baseUrl}/client/kyc/v2/request/${digioDocId}/manage_approval`;

  try {
    const response = await axios.post(
      url,
      { status: 'approved' },
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`[Digio] ✅ Manual approval result for ${digioDocId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[Digio] ❌ Manual approval failed for ${digioDocId}:`,
      error.response?.data || error.message
    );
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE: Download file from Digio by file_id
// ─────────────────────────────────────────────────────────────────────────────

const downloadFileFromDigio = async (fileId) => {
  console.log(`[Digio] 📥 Downloading file from Digio, fileId: ${fileId}`);

  const credential = await getCredential();
  if (!credential) return null;

  const baseUrl = getBaseUrl(credential);
  const authHeader = buildAuthHeader(credential);

  try {
    const response = await axios.get(`${baseUrl}/client/kyc/v2/media/${fileId}`, {
      params: { base64: 'true' },
      headers: { Authorization: authHeader },
    });

    if (response.data && response.data.file_in_base64) {
      console.log(`[Digio] ✅ File downloaded successfully for fileId: ${fileId}`);
      return Buffer.from(response.data.file_in_base64, 'base64');
    }
    console.warn(`[Digio] ⚠️ No base64 data in response for fileId: ${fileId}`);
    return null;
  } catch (error) {
    console.error(
      `[Digio] ❌ File download error for fileId ${fileId}:`,
      error.response?.data || error.message
    );
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE: Store media locally (from Digio or provided buffer)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Saves a KYC image (aadhaar / selfie / signature / pan) to local disk,
 * updates the KycVerification record with the public URL, and returns the URL.
 *
 * @param {string|null} fileId        - Digio file ID (null if providedBuffer is given)
 * @param {'aadhaar'|'selfie'|'signature'|'pan'} type
 * @param {ObjectId}    userId
 * @param {Object}      kycModel      - KycVerification document
 * @param {Buffer|null} providedBuffer - Pre-fetched buffer (e.g. from base64 in response)
 */
const storeMediaLocally = async (fileId, type, userId, kycModel, providedBuffer = null) => {
  console.log(`[Digio] 💾 Storing ${type} media for user ${userId} (fileId: ${fileId})`);

  try {
    let buffer;
    let fileName;

    if (providedBuffer) {
      buffer = providedBuffer;
      fileName = `${type}_${Date.now()}.jpg`;
    } else {
      if (!fileId) {
        console.warn(`[Digio] ⚠️ storeMediaLocally called with no fileId and no buffer for type: ${type}`);
        return null;
      }
      buffer = await downloadFileFromDigio(fileId);
      if (!buffer) return null;
      fileName = `${type}_${fileId}.jpg`;
    }

    const uploadDir = path.join(__dirname, '../../uploads/kyc', userId.toString());
    await fs.ensureDir(uploadDir);

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/kyc/${userId}/${fileName}`;
    console.log(`[Digio] ✅ ${type} image stored at: ${publicUrl}`);

    // Update KycVerification image field
    const updateField = `${type}_image`; // aadhaar_image | selfie_image | signature_image | pan_image
    const updatedDetails = { ...(kycModel.kyc_details || {}) };
    updatedDetails[`${type}_local_path`] = publicUrl;

    await KycVerification.findByIdAndUpdate(kycModel._id, {
      [updateField]: publicUrl,
      kyc_details: updatedDetails,
    });

    return publicUrl;
  } catch (error) {
    console.error(`[Digio] ❌ storeMediaLocally error (${type}):`, error.message);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE: Fetch status from Digio, auto-approve, store documents
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main orchestrator:
 *  1. Calls Digio's status API for the given document ID.
 *  2. Auto-approves if status is approval_pending / initiated / requested.
 *  3. Parses Aadhaar, PAN, selfie, signature from the actions array.
 *  4. Updates KycVerification + User records.
 *  5. Downloads & stores document images locally.
 *
 * Returns the latest KycVerification document (or null on failure).
 */
const fetchAndUpdateKycStatus = async (digioDocId) => {
  console.log(`[Digio] 🔄 Fetching KYC status for doc ID: ${digioDocId}`);

  const credential = await getCredential();
  if (!credential) return null;

  const baseUrl = getBaseUrl(credential);
  const authHeader = buildAuthHeader(credential);
  const url = `${baseUrl}/client/kyc/v2/${digioDocId}/response`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    console.log(`[Digio] 📊 Status response for ${digioDocId}:`, JSON.stringify(data, null, 2));

    if (!data) {
      console.error('[Digio] ❌ Empty response from Digio status API');
      return null;
    }

    let status = (data.status || 'pending').toLowerCase();
    console.log(`[Digio] 📌 Current status: ${status}`);

    // ── AUTO APPROVAL ─────────────────────────────────────────────────────────
    if (['approval_pending', 'requested', 'initiated'].includes(status)) {
      console.log(`[Digio] ⚡ Status is "${status}" — triggering auto-approval`);
      const approvalResult = await approveKycManually(digioDocId);
      if (approvalResult?.status) {
        status = approvalResult.status.toLowerCase();
        console.log(`[Digio] 🔄 Status updated after approval attempt: ${status}`);
      }
    }

    // ── PARSE ACTIONS ─────────────────────────────────────────────────────────
    const kycDetails = {
      aadhaar: null,
      signature_file: null,
      selfie_file: null,
      face_match: null,
      pan: null,
    };

    let aadhaarDetails = null;

    if (data.actions && Array.isArray(data.actions)) {
      console.log(`[Digio] 🗂️ Processing ${data.actions.length} action(s)...`);

      for (const action of data.actions) {
        // Aadhaar (DigiLocker)
        if (action.type === 'digilocker' && action.details?.aadhaar) {
          const aadhar = action.details.aadhaar;
          kycDetails.aadhaar = aadhar.id_number || aadhar.masked_aadhaar_number;
          kycDetails.face_match = action.face_match_result;
          kycDetails.name = aadhar.name;
          kycDetails.dob = aadhar.dob;
          kycDetails.address = aadhar.current_address || aadhar.address;
          aadhaarDetails = aadhar;

          if (aadhar.image) kycDetails.aadhaar_base64 = aadhar.image;
          if (action.file_id) kycDetails.aadhaar_file = action.file_id;

          console.log(`[Digio] 🪪 Aadhaar parsed: ${kycDetails.aadhaar}, name: ${kycDetails.name}`);
        }

        // PAN
        if (action.type === 'pan' || action.details?.pan) {
          const pan = action.details?.pan || action.details;
          kycDetails.pan = pan.id_number || pan.pan_number;
          if (action.file_id) kycDetails.pan_file = action.file_id;
          console.log(`[Digio] 🪪 PAN parsed: ${kycDetails.pan}`);
        }

        // Signature
        if (
          action.type === 'image' &&
          action.rules_data?.strict_validation_types?.includes('signature')
        ) {
          kycDetails.signature_file = action.file_id;
          console.log(`[Digio] ✍️ Signature file_id: ${kycDetails.signature_file}`);
        }

        // Selfie
        if (action.type === 'selfie') {
          kycDetails.selfie_file = action.file_id;
          console.log(`[Digio] 🤳 Selfie file_id: ${kycDetails.selfie_file}`);
        }
      }
    }

    // ── UPDATE KYC RECORD ─────────────────────────────────────────────────────
    const kyc = await KycVerification.findOneAndUpdate(
      { digio_document_id: digioDocId },
      {
        status,
        kyc_details: kycDetails,
        aadhaar_details: aadhaarDetails,
        raw_response: data,
        kyc_completed_at: ['approved', 'completed', 'success'].includes(status)
          ? new Date()
          : null,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!kyc) {
      console.error(`[Digio] ❌ KycVerification record not found for doc ID: ${digioDocId}`);
      return null;
    }

    console.log(`[Digio] ✅ KycVerification updated in DB for user: ${kyc.user}`);

    // ── SYNC TO USER RECORD ───────────────────────────────────────────────────
    const userUpdate = { kyc_status: status };

    if (['approved', 'completed', 'success'].includes(status)) {
      userUpdate.is_kyc_synced = true;
      userUpdate.adhar_card = kycDetails.aadhaar;
      userUpdate.pan_card = kycDetails.pan;

      if (kyc.aadhaar_image) userUpdate.adhar_card_image = kyc.aadhaar_image;
      if (kyc.pan_image) userUpdate.pan_card_image = kyc.pan_image;

      if (aadhaarDetails) {
        if (aadhaarDetails.name) userUpdate.name = aadhaarDetails.name;
        if (aadhaarDetails.gender) {
          const g = aadhaarDetails.gender.toUpperCase();
          userUpdate.gender = g === 'M' ? 'male' : g === 'F' ? 'female' : 'other';
        }
        if (aadhaarDetails.dob) {
          const parts = aadhaarDetails.dob.split('/');
          if (parts.length === 3) {
            userUpdate.dob = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
        if (aadhaarDetails.father_name) userUpdate.father_name = aadhaarDetails.father_name;
        if (aadhaarDetails.current_address) userUpdate.address = aadhaarDetails.current_address;

        const addr = aadhaarDetails.current_address_details;
        if (addr) {
          if (addr.district_or_city) userUpdate.city = addr.district_or_city;
          if (addr.state) userUpdate.state = addr.state;
          if (addr.pincode) userUpdate.pincode = addr.pincode;
        }
      }
    }

    await User.findByIdAndUpdate(kyc.user, userUpdate);
    console.log(`[Digio] 👤 User record synced with KYC status: ${status}`);

    // ── STORE MEDIA ───────────────────────────────────────────────────────────
    if (kycDetails.signature_file) {
      await storeMediaLocally(kycDetails.signature_file, 'signature', kyc.user, kyc);
    }
    if (kycDetails.selfie_file) {
      await storeMediaLocally(kycDetails.selfie_file, 'selfie', kyc.user, kyc);
    }
    if (kycDetails.aadhaar_file) {
      await storeMediaLocally(kycDetails.aadhaar_file, 'aadhaar', kyc.user, kyc);
    } else if (kycDetails.aadhaar_base64) {
      const buffer = Buffer.from(kycDetails.aadhaar_base64, 'base64');
      await storeMediaLocally(null, 'aadhaar', kyc.user, kyc, buffer);
    }
    if (kycDetails.pan_file) {
      await storeMediaLocally(kycDetails.pan_file, 'pan', kyc.user, kyc);
    }

    // Return the freshest DB record
    return await KycVerification.findById(kyc._id);
  } catch (error) {
    console.error(
      `[Digio] ❌ fetchAndUpdateKycStatus error for ${digioDocId}:`,
      error.response?.data || error.message
    );
    return null;
  }
};

module.exports = {
  initiateDigioKyc,
  approveKycManually,
  downloadFileFromDigio,
  storeMediaLocally,
  fetchAndUpdateKycStatus,
};
