import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface SchoolClaimRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  claimantName: string;
  claimantEmail: string;
  phone: string;
  pincode: string;
  state: string;
  district: string;
  note: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
}

// In-memory / file fallback store
const CLAIMS_FILE = path.join(process.cwd(), 'src', 'data', 'school_claims_db.json');

function readClaims(): SchoolClaimRecord[] {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      const data = fs.readFileSync(CLAIMS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read school_claims_db.json:', err);
  }
  return [];
}

function writeClaims(claims: SchoolClaimRecord[]) {
  try {
    const dir = path.dirname(CLAIMS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write school_claims_db.json:', err);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const schoolId = searchParams.get('schoolId');

  let claims = readClaims();

  if (email) {
    claims = claims.filter((c) => c.claimantEmail.toLowerCase() === email.toLowerCase());
  }
  if (schoolId) {
    claims = claims.filter((c) => c.schoolId === schoolId);
  }

  return NextResponse.json({ success: true, claims });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      school_id,
      school_name,
      claimant_name,
      claimant_email,
      phone,
      pincode,
      state,
      district,
      note,
      action,
      claim_id,
    } = body;

    let claims = readClaims();

    // Action to approve / verify claim by admin
    if (action === 'verify' && claim_id) {
      const target = claims.find((c) => c.id === claim_id);
      if (target) {
        target.status = 'verified';
        target.verifiedAt = new Date().toISOString();
        writeClaims(claims);
        return NextResponse.json({ success: true, claim: target });
      }
      return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
    }

    if (!school_id || !school_name || !claimant_name || !claimant_email || !phone) {
      return NextResponse.json(
        { success: false, error: 'School ID, School Name, Name, Email, and Phone are required.' },
        { status: 400 }
      );
    }

    // Check if a claim for this school and user already exists
    let existing = claims.find(
      (c) =>
        c.schoolId === school_id &&
        c.claimantEmail.toLowerCase() === claimant_email.toLowerCase()
    );

    if (existing) {
      existing.claimantName = claimant_name;
      existing.phone = phone;
      existing.pincode = pincode || existing.pincode;
      existing.state = state || existing.state;
      existing.district = district || existing.district;
      existing.note = note || existing.note;
      writeClaims(claims);
      return NextResponse.json({ success: true, claim: existing, updated: true });
    }

    const newClaim: SchoolClaimRecord = {
      id: 'clm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      schoolId: String(school_id).trim(),
      schoolName: String(school_name).trim(),
      claimantName: String(claimant_name).trim(),
      claimantEmail: String(claimant_email).trim(),
      phone: String(phone).trim(),
      pincode: String(pincode || '').trim(),
      state: String(state || '').trim(),
      district: String(district || '').trim(),
      note: String(note || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    claims.unshift(newClaim);
    writeClaims(claims);

    return NextResponse.json({ success: true, claim: newClaim });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
