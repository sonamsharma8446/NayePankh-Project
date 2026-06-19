const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });
};

const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to NayePankh Foundation!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
        <div style="background:linear-gradient(135deg,#1a6b4a,#2d9d6e);padding:32px 24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🌟 NayePankh Foundation</h1>
          <p style="color:#b2dfcf;margin:8px 0 0;">Empowering Communities, Transforming Lives</p>
        </div>
        <div style="padding:32px 24px;background:#fff;">
          <h2 style="color:#1a6b4a;">Welcome, ${name}!</h2>
          <p style="color:#555;line-height:1.6;">We're thrilled to have you join the NayePankh Foundation family. Your commitment to making a difference is what drives us forward.</p>
          <p style="color:#555;line-height:1.6;">As a volunteer, you'll have access to:</p>
          <ul style="color:#555;line-height:2;">
            <li>🎯 Exciting internship opportunities</li>
            <li>📜 Volunteer certificates</li>
            <li>📢 Latest announcements</li>
            <li>🤝 A community of changemakers</li>
          </ul>
          <div style="text-align:center;margin-top:24px;">
            <a href="http://localhost:4200/dashboard" style="background:#1a6b4a;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Go to Dashboard</a>
          </div>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2024 NayePankh Foundation. All rights reserved.</p>
        </div>
      </div>`
  }),

  applicationSubmitted: (name, internshipTitle) => ({
    subject: `Application Received – ${internshipTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a6b4a,#2d9d6e);padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;">NayePankh Foundation</h1>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1a6b4a;">Application Received!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p style="color:#555;">Your application for <strong>${internshipTitle}</strong> has been successfully submitted.</p>
          <p style="color:#555;">Our team will review your application and update the status within 3–5 business days. You can track your application status in your dashboard.</p>
          <p style="color:#888;font-size:13px;">Thank you for your interest in NayePankh Foundation.</p>
        </div>
      </div>`
  }),

  applicationStatusUpdate: (name, internshipTitle, status, note) => ({
    subject: `Application Update – ${internshipTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a6b4a,#2d9d6e);padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;">NayePankh Foundation</h1>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1a6b4a;">Application Status Updated</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p style="color:#555;">Your application for <strong>${internshipTitle}</strong> has been updated.</p>
          <p style="color:#555;">New Status: <strong style="color:${status==='Selected'?'#1a6b4a':status==='Rejected'?'#d32f2f':'#f57c00'};">${status}</strong></p>
          ${note ? `<p style="color:#555;">Admin Note: <em>${note}</em></p>` : ''}
        </div>
      </div>`
  }),

  certificateApproved: (name, type) => ({
    subject: 'Your Certificate Has Been Approved!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a6b4a,#2d9d6e);padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;">🎉 NayePankh Foundation</h1>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1a6b4a;">Congratulations, ${name}!</h2>
          <p style="color:#555;">Your request for a <strong>${type}</strong> has been approved.</p>
          <p style="color:#555;">You can download your certificate from your dashboard.</p>
        </div>
      </div>`
  }),

  announcement: (name, title, content) => ({
    subject: `📢 Announcement: ${title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a6b4a,#2d9d6e);padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;">NayePankh Foundation</h1>
        </div>
        <div style="padding:32px 24px;">
          <h2 style="color:#1a6b4a;">${title}</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p style="color:#555;line-height:1.6;">${content}</p>
        </div>
      </div>`
  })
};

const sendEmail = async (to, template) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[Email Skipped] No credentials set. Would send to: ${to}, Subject: ${template.subject}`);
    return;
  }
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'NayePankh Foundation <noreply@nayepankh.org>',
      to,
      subject: template.subject,
      html: template.html
    });
    console.log(`✉️ Email sent to ${to}`);
  } catch (error) {
    console.error('Email error:', error.message);
  }
};

module.exports = { sendEmail, emailTemplates };
