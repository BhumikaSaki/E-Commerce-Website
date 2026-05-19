import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('\n── Password reset (SMTP not configured) ──');
    console.log(`To: ${email}`);
    console.log(`Reset link: ${resetUrl}\n`);
    return { devMode: true, resetUrl };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'ShopBy — Reset your password',
    html: `
      <h2>Password reset</h2>
      <p>You requested a password reset for your ShopBy account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 10 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });

  return { sent: true };
};
