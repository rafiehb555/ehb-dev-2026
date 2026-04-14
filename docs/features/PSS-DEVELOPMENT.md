# PSS DEVELOPMENT GUIDE — Proof & Security System (27 Features)

**Version:** 1.0  
**Updated:** 2026-04-14  
**Status:** Phase 1 — Build 6 core verification types  

---

## Overview: PSS Architecture

**PSS (Proof & Security System)** is EHB's KYC/AML framework. Users submit verifications (ID, liveness, face, address, AML, device), and AI + admins review them. Approved verifications grant STL points and unlock marketplace access.

**Phase 1 Goal:** Build 6 features (ID, Liveness, Face Match, Address, AML, Device)  
**Phase 2 Goal:** Add 10 features (Business verification, tax ID, banking, biometric, wallet auth, etc.)  
**Phase 3 Goal:** Add 11 features (Insurance, reputation, skill verification, etc.)  

---

## Phase 1: 6 Core Features (Sprint 1-2)

### Priority Order

| # | Feature | Type | AI | Dev | Est. Points | STL Reward | Blockers |
|---|---------|------|----|----|-------------|-----------|----------|
| 1 | **ID Document Verification** | OCR | OpenAI Vision | Upload + OCR | 12 | +40 | None |
| 2 | **Liveness Detection** | Video | Twilio/Stripe | Video capture | 10 | +8 | #1 |
| 3 | **Face Matching** | ML | face-recognition lib | Compare algo | 10 | +7 | #2 |
| 4 | **Address Verification** | Geocoding | Google Maps | Postal validation | 8 | +5 | #1 |
| 5 | **AML Check** | Risk | Refinitiv/OFAC | Risk scoring | 8 | +5 | None |
| 6 | **Device Fingerprinting** | Trust | TrustDevice SDK | Device auth | 6 | +5 | None |

**Total Phase 1 Points:** 54 (2 sprints)

---

## Database Schema

### Collection 1: `users` (Mongoose User.js)

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  phone: String,
  profile: {
    first_name: String,
    last_name: String,
    date_of_birth: Date,
    nationality: String,
  },
  pss_status: String, // 'pending', 'in_review', 'approved', 'rejected'
  pss_completed: {
    id_document: Boolean,
    liveness: Boolean,
    face_match: Boolean,
    address: Boolean,
    aml: Boolean,
    device: Boolean,
  },
  stl_level: Number, // 0-9, depends on PSS results
  stl_score: Number, // 0-500
  role: String, // 'buyer', 'seller', 'inspector', 'admin'
  status: String, // 'active', 'suspended', 'banned'
  created_at: Date,
  updated_at: Date,
}
```

### Collection 2: `pss_verifications`

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref User),
  type: String, // 'id_document', 'liveness', 'face_match', 'address', 'aml', 'device'
  status: String, // 'pending', 'approved', 'rejected', 'resubmit_requested'
  
  // Metadata
  document_url: String, // S3 URL for ID image
  document_type: String, // 'passport', 'driver_license', 'national_id'
  
  // Extracted data (OCR/ML results)
  extracted_data: {
    full_name: String,
    date_of_birth: Date,
    expiry_date: Date,
    document_number: String,
    issuing_country: String,
  },
  
  // AI processing
  ai_result: {
    confidence: Number, // 0-100
    is_valid: Boolean,
    alerts: [String], // e.g., ['expired', 'poor_quality', 'suspicious']
    raw_response: Object, // OpenAI Vision full response
  },
  
  // Admin review
  reviewed_by: ObjectId, // Admin user ID
  reviewed_at: Date,
  review_notes: String,
  
  // Timestamps
  created_at: Date,
  updated_at: Date,
}
```

### Collection 3: `pss_alerts`

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref User),
  alert_type: String, // 'fraud', 'suspicious', 'duplicate', 'blacklist_match'
  severity: String, // 'low', 'medium', 'high', 'critical'
  description: String,
  evidence: {
    verification_id: ObjectId,
    comparison_user_id: ObjectId, // If duplicate
    matched_rules: [String],
  },
  action_taken: String, // 'none', 'manual_review', 'rejected', 'suspended'
  resolved_at: Date,
  created_at: Date,
}
```

### Collection 4: `pss_audit_log` (Immutable)

```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  action: String, // 'verification_created', 'verification_approved', 'manual_override'
  actor_id: ObjectId, // Admin or system
  actor_role: String,
  details: Object,
  timestamp: Date,
  // TTL index: 90 days
}
```

---

## API Endpoint List

### 1. ID Document Verification

#### POST `/api/pss/verify/id`
Upload ID document, extract data via OpenAI Vision.

**Request:**
```json
{
  "document_type": "passport",
  "file": "<multipart image>"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "verification_id": "507f1f77bcf86cd799439011",
  "status": "pending",
  "message": "ID document submitted for verification. Processing..."
}
```

**Processing (Background):**
1. Save image to S3
2. Call OpenAI Vision API (extract name, DOB, expiry, doc #)
3. Validate document format + expiry
4. Check for fraud signals (double check with same user)
5. Flag for admin review
6. Update `pss_verifications` collection with result
7. Send notification to user

**Admin Review:** GET `/api/pss/admin/queue?type=id_document`

---

### 2. Liveness Detection

#### POST `/api/pss/verify/liveness/token`
Get token for Twilio/Stripe video capture.

**Request:**
```json
{
  "verification_id": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "token": "twilio_token_xyz",
  "session_id": "sess_123",
  "max_duration_seconds": 30,
  "capture_url": "https://twilio.verify.com/session/sess_123"
}
```

#### POST `/api/pss/verify/liveness/complete`
Submit liveness video for processing.

**Request:**
```json
{
  "session_id": "sess_123",
  "video_url": "s3://bucket/videos/liveness_abc123.mp4"
}
```

**Response (202):**
```json
{
  "success": true,
  "status": "pending",
  "message": "Liveness video submitted for processing"
}
```

**Processing:**
1. Extract frames from video (every 2 seconds)
2. Detect face in all frames (TensorFlow.js or OpenCV)
3. Check for motion (blink, head movement, smile)
4. Compare to profile photo (face matching)
5. Flag if suspicious (deep fake indicators)
6. Update result in `pss_verifications`

---

### 3. Face Matching

#### POST `/api/pss/verify/face-match`
Compare liveness video face to ID document face.

**Request:**
```json
{
  "id_verification_id": "507f1f77bcf86cd799439011",
  "liveness_verification_id": "507f1f77bcf86cd799439012"
}
```

**Response (202):**
```json
{
  "success": true,
  "verification_id": "507f1f77bcf86cd799439013",
  "status": "pending"
}
```

**Processing:**
1. Extract face embeddings from ID photo (using face-recognition.js)
2. Extract face embeddings from liveness frames
3. Calculate similarity score (Euclidean distance)
4. If similarity > 85%, approve; else flag for manual review
5. Update `pss_verifications`

---

### 4. Address Verification

#### POST `/api/pss/verify/address`
Validate address + check AML against postal code.

**Request:**
```json
{
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "postal_code": "94102",
  "country": "US"
}
```

**Response (202):**
```json
{
  "success": true,
  "verification_id": "507f1f77bcf86cd799439014",
  "status": "pending",
  "geocoded": {
    "lat": 37.7749,
    "lng": -122.4194,
    "formatted_address": "123 Main St, San Francisco, CA 94102, USA"
  }
}
```

**Processing:**
1. Call Google Geocoding API
2. Validate address format
3. Check postal code against blacklist (sanctions, high-risk zones)
4. Validate coordinates match country claim
5. Update `pss_verifications`

---

### 5. AML Check

#### POST `/api/pss/verify/aml`
Check against OFAC, PEP, and sanctions lists.

**Request:**
```json
{
  "full_name": "John Doe",
  "date_of_birth": "1990-01-15",
  "country": "US"
}
```

**Response (202):**
```json
{
  "success": true,
  "verification_id": "507f1f77bcf86cd799439015",
  "status": "pending",
  "risk_level": "low"
}
```

**Processing:**
1. Call Refinitiv/Laurence Fink API (OFAC + PEP check)
2. Calculate risk score (0-100)
3. If risk > 70, flag as "manual_review" + alert
4. If risk > 90, flag as "rejected" + alert
5. Store full response in `ai_result` for audit

---

### 6. Device Fingerprinting

#### POST `/api/pss/verify/device`
Register device as trusted.

**Request:**
```json
{
  "device_name": "iPhone 14 Pro",
  "user_agent": "...",
  "ip_address": "203.0.113.45"
}
```

**Response:**
```json
{
  "success": true,
  "verification_id": "507f1f77bcf86cd799439016",
  "status": "approved",
  "device_id": "device_xyz123",
  "trusted": true
}
```

**Processing:**
1. Extract device fingerprint (TrustDevice SDK)
2. Check against known fraud devices (DB blacklist)
3. Check IP against VPN/proxy services (MaxMind)
4. If suspicious, flag for manual review
5. Auto-approve if clean, store in `pss_verifications`

---

### Admin Routes

#### GET `/api/pss/admin/queue?type=id_document&status=pending`
List verifications pending review.

**Response:**
```json
{
  "data": [
    {
      "verification_id": "507f1f77bcf86cd799439011",
      "user_id": "507f1f77bcf86cd799439001",
      "type": "id_document",
      "status": "pending",
      "submitted_at": "2026-04-15T10:30:00Z",
      "ai_result": {
        "confidence": 92,
        "is_valid": true,
        "alerts": []
      },
      "extracted_data": {
        "full_name": "John Doe",
        "date_of_birth": "1990-01-15",
        "expiry_date": "2028-01-15"
      }
    }
  ],
  "total": 15,
  "page": 1
}
```

#### PATCH `/api/pss/admin/review/:verification_id`
Approve or reject verification.

**Request:**
```json
{
  "action": "approve",
  "notes": "Document valid, ID matches liveness"
}
```

**Response:**
```json
{
  "success": true,
  "verification_id": "507f1f77bcf86cd799439011",
  "status": "approved",
  "stl_points_added": 40
}
```

---

## Frontend Pages

### 1. PSS Onboarding Flow (`/pss/[type]`)

```
Step 1: Welcome
├─ "Complete verification to unlock marketplace"
├─ Progress bar (1/6 steps)
├─ Next: ID Document Upload
└─ Skip option (button disabled until complete)

Step 2: ID Document
├─ Upload ID image (passport/driver license/national ID)
├─ Preview + crop
├─ Submit → shows "Processing..." + spinner
├─ Notification when complete
└─ Next: Liveness

Step 3: Liveness
├─ Start video capture (30 seconds)
├─ Instructions: "Look at camera, blink, smile, turn head"
├─ Timer + visual feedback (face detected? green ✓)
├─ Submit video → processing
└─ Next: Face Matching

Step 4: Face Matching
├─ Auto-triggered after liveness complete
├─ Shows comparison (ID photo vs. liveness frame)
├─ Result: "Match 92% • Approved" or "Manual review needed"
└─ Next: Address

Step 5: Address Verification
├─ Form: Street, City, State, Postal Code, Country
├─ Google Maps autocomplete
├─ Preview map with coordinates
├─ Submit
└─ Next: AML + Device

Step 6: AML + Device
├─ AML: "Checking against sanctions lists..."
├─ Device: "Trust this device? Yes/No"
├─ Final status: "All steps complete!"
└─ Redirect to dashboard + show STL points earned
```

### 2. PSS Status Dashboard (`/pss/status`)

```
┌─────────────────────────────────┐
│ PSS Verification Status         │
├─────────────────────────────────┤
│                                 │
│ ✓ ID Document       Approved   │
│   (Passport, expires 2028-01-15)│
│                                 │
│ ✓ Liveness          Approved   │
│   (Video submitted, 92% match)  │
│                                 │
│ ✓ Face Matching     Approved   │
│   (Match 92%)                   │
│                                 │
│ ✓ Address           Approved   │
│   (San Francisco, CA 94102)     │
│                                 │
│ ✓ AML Check         Approved   │
│   (Risk level: low)             │
│                                 │
│ ✓ Device            Approved   │
│   (iPhone 14 Pro)               │
│                                 │
│ ═════════════════════════════   │
│ Overall Status: APPROVED ✓      │
│ STL Points Earned: +40          │
│ STL Level: L3 (out of L9)       │
│                                 │
│ [View Details] [Re-verify]      │
└─────────────────────────────────┘
```

### 3. Admin Review Panel (`/admin/pss/queue`)

```
Filters:
├─ Type: ID / Liveness / Face / Address / AML / Device
├─ Status: Pending / In Review / Approved / Rejected
├─ Risk Level: Low / Medium / High / Critical
└─ Submitted: Last 7 days / Last 30 days

Results Table:
┌──────────────┬──────────┬──────────┬──────────┬─────────┐
│ User         │ Type     │ Risk     │ Submitted│ Action  │
├──────────────┼──────────┼──────────┼──────────┼─────────┤
│ John D.      │ ID       │ Low      │ 2 days   │ [Review]│
│ Jane S.      │ Liveness │ Medium   │ 5 hours  │ [Review]│
│ Bob T.       │ AML      │ Critical │ 1 hour   │ [Review]│
└──────────────┴──────────┴──────────┴──────────┴─────────┘

Detail Panel (on click):
├─ User profile
├─ Verification images (if ID/liveness)
├─ AI result + confidence
├─ Similar users (if fraud risk)
├─ Decision buttons: [Approve] [Reject] [Request Resubmit]
└─ Notes field
```

---

## Integration Points

### STL Points Mapping
| Verification | Points | Requirement |
|--------------|--------|-------------|
| ID Document | +40 | Approved, not expired |
| Liveness | +8 | Video confirmed, >85% face match |
| Face Match | +7 | Similarity >85% to ID |
| Address | +5 | Geocoded + not in blacklist |
| AML Check | +5 | Risk score <70 |
| Device | +5 | Not in fraud blacklist |
| **Total Phase 1** | **+70** | All 6 complete |

Users who complete Phase 1 PSS reach **L3 (minimum seller level).**

### Error Handling
```typescript
// If any PSS type is rejected
throw new AppError(
  'Address verification failed. Please submit a different proof.',
  400,
  true
);

// If admin manually rejects
if (action === 'reject') {
  await User.updateOne(
    { _id: user_id },
    { pss_status: 'rejected', stl_level: 0 }
  );
}

// User can resubmit immediately
```

---

## Testing Requirements

### Unit Tests (90+ cases)

```typescript
// ID Document
describe('ID Document OCR', () => {
  it('should extract valid document data from clear image', async () => {
    // Mock OpenAI Vision API
    // Assert: extracted_data.expiry_date > today
  });
  it('should flag expired documents', async () => {
    // Mock API returning past expiry
    // Assert: alert includes 'expired'
  });
  it('should reject poor quality images', async () => {
    // Blurry/dark image
    // Assert: confidence < 70
  });
});

// Liveness
describe('Liveness Detection', () => {
  it('should detect face in video frames', async () => {
    // Mock video with clear face
    // Assert: face detected in all frames
  });
  it('should flag deepfakes', async () => {
    // Use fake liveness test set
    // Assert: alert includes 'potential_deepfake'
  });
});

// Face Matching
describe('Face Matching', () => {
  it('should approve matching faces >85%', async () => {
    // Same person, different angles
    // Assert: similarity > 85
  });
  it('should reject non-matching faces', async () => {
    // Different people
    // Assert: similarity < 50
  });
});

// AML
describe('AML Check', () => {
  it('should flag OFAC matches', async () => {
    // Mock Refinitiv API with PEP match
    // Assert: risk_level = 'high', alert created
  });
});

// Fraud
describe('PSS Fraud Detection', () => {
  it('should detect duplicate document usage', async () => {
    // Same ID document submitted by 2 users
    // Assert: alert = 'duplicate_document'
  });
  it('should detect VPN/proxy in device check', async () => {
    // IP from known VPN provider
    // Assert: flag for manual review
  });
});
```

### Integration Tests
- Register → complete all 6 PSS types → STL updates to L3
- Admin approves ID → STL jumps +40 → User notified
- User rejects AML → STL stays L0 → Can't list products

### E2E Tests (Playwright)
- Full PSS journey: register → upload ID → liveness → approve → see dashboard

---

## Phase 2 & 3 Roadmap (10 + 11 features)

### Phase 2 (Weeks 3-4 of Q2)
1. Business License Verification (+10 points)
2. Tax ID Verification (+8 points)
3. Bank Account Verification (+12 points, seller only)
4. Biometric Iris Scan (+5 points)
5. Wallet 2FA Setup (+3 points)
6. Phone Number Verification (+2 points)
7. Email Domain Verification (+3 points)
8. SSO (Google/Apple) Linking (+2 points)
9. IP Geolocation Validation (+2 points)
10. Manual Verification (Admin override, +10 points)

### Phase 3 (Q3)
11-21: Insurance verification, reputation score, skill certificates, education credentials, professional licenses, reference checks, payment method validation, transaction history review, risk profile assessment, background checks, credential scanning.

---

## Key Rules

1. **No PSS, no marketplace.** Users must complete Phase 1 PSS to reach L3.
2. **AI review first, then admin.** Auto-approve if confidence >95%, else manual.
3. **Immutable audit trail.** Every review + rejection is logged permanently.
4. **Re-submission allowed.** Users can resubmit rejected verifications (except bans).
5. **Fraud blocks account.** Critical alerts trigger immediate suspension pending L8 approval.

---

*EHB Technologies (Pvt.) Ltd. — PSS Development Guide v1 — 2026-04-14*
