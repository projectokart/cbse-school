import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const OTP_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'otp_store.json');

function getOtpStore(): Record<string, { otp: string; expiresAt: number }> {
  try {
    if (fs.existsSync(OTP_FILE_PATH)) {
      const data = fs.readFileSync(OTP_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read otp_store.json:', err);
  }
  return {};
}

function saveOtpStore(store: Record<string, { otp: string; expiresAt: number }>) {
  try {
    const dir = path.dirname(OTP_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(OTP_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write otp_store.json:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save in file store
    const store = getOtpStore();
    store[email] = { otp, expiresAt };
    saveOtpStore(store);

    // Primary: AWS SES on mailer.cseel.org
    const sesUser = process.env.SES_SMTP_USER;
    const sesPass = process.env.SES_SMTP_PASS;

    let transporter;
    let fromAddress = process.env.MAIL_FROM_EMAIL
      ? `"${process.env.MAIL_FROM_NAME || 'CSEEL Security'}" <${process.env.MAIL_FROM_EMAIL}>`
      : '"CSEEL Security" <auth@mailer.cseel.org>';
    let replyToAddress = process.env.MAIL_REPLY_TO || 'no-reply@mailer.cseel.org';

    if (sesUser && sesPass) {
      transporter = nodemailer.createTransport({
        host: process.env.SES_SMTP_HOST || 'email-smtp.ap-southeast-2.amazonaws.com',
        port: Number(process.env.SES_SMTP_PORT) || 587,
        secure: false,
        auth: { user: sesUser, pass: sesPass },
        tls: { rejectUnauthorized: true },
      });
    } else {
      // Fallback: Gmail App Password
      const host = process.env.SMTP_HOST || 'smtp.gmail.com';
      const port = Number(process.env.SMTP_PORT) || 465;
      const user = process.env.SMTP_USER || '';
      const pass = process.env.SMTP_PASS || '';
      fromAddress = `"CSEEL Schools Portal" <${user}>`;
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }

    await transporter.sendMail({
      from: fromAddress,
      replyTo: replyToAddress,
      to: email,
      subject: `Your CSEEL Login OTP: ${otp}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: #EDF5FA; padding: 12px 18px; border-radius: 12px;">
              <span style="font-size: 20px; font-weight: 800; color: #006FCC; letter-spacing: -0.5px;">CSEEL Portal</span>
            </div>
          </div>
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; text-align: center;">School Profile Verification</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; text-align: center; margin: 16px 0;">
            Use the following 6-digit One-Time Password (OTP) to verify your account and claim your school profile:
          </p>
          <div style="background: #f8fafc; border: 2px dashed #006FCC; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #006FCC; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; text-align: center;">
            This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            © 2026 CSEEL Education Portal · CBSE Verified Schools Network
          </p>
        </div>
      `,
      text: `Your CSEEL Login OTP is: ${otp}. It expires in 10 minutes.`,
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (err: any) {
    console.error('Error in /api/auth/send-otp:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to send OTP' }, { status: 500 });
  }
}
