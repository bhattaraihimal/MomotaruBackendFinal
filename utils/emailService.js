const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: `"Momotarou Restaurant" <${process.env.EMAIL_USER}>`,
      to: `${process.env.EMAIL_USER}, ${process.env.EMAIL_RECEIVER}`, // Send to both as requested
      subject: options.subject,
      html: options.html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to avoid breaking the main request flow
    return null;
  }
};

const sendBookingNotification = async (data) => {
  const subject = 'New Booking/Inquiry from Website';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #c4a484;">New Booking/Inquiry</h2>
      <p>A new message has been submitted via the contact form on your website.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Message:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.message}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #777;">This is an automated notification from Momotarou Restaurant Website.</p>
    </div>
  `;
  return sendEmail({ subject, html });
};

const sendFranchiseNotification = async (data) => {
  const subject = 'New Franchise Inquiry from Website';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #c4a484;">New Franchise Inquiry</h2>
      <p>A potential partner has submitted interest in a Momotarou Restaurant franchise.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Full Name:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Contact Number:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contactNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Preferred Location:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.preferredLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Budget:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.budget}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Message:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.message || 'N/A'}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #777;">This is an automated notification from Momotarou Restaurant Website.</p>
    </div>
  `;
  return sendEmail({ subject, html });
};

module.exports = {
  sendBookingNotification,
  sendFranchiseNotification,
};
