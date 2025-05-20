const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify Your Email - NE Parking Management System',
    html: `
      <h1>Welcome to NE Parking Management System</h1>
      <p>Please use the following code to verify your email address:</p>
      <h2>${token}</h2>
      <p>This code will expire in 24 hours.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset - NE Parking Management System',
    html: `
      <h1>Password Reset Request</h1>
      <p>Please use the following code to reset your password:</p>
      <h2>${token}</h2>
      <p>This code will expire in 1 hour.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendEntryTicket = async (email, data) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Parking Entry Ticket - NE Parking Management System',
    html: `
      <h1>Parking Entry Ticket</h1>
      <p>Your car has been registered at ${data.parkingName}.</p>
      <ul>
        <li>Entry ID: ${data.entryId}</li>
        <li>Plate Number: ${data.plateNumber}</li>
        <li>Entry Time: ${data.entryDateTime}</li>
        <li>Fee per Hour: $${data.feePerHour}</li>
      </ul>
      <p>Please keep this ticket for your records.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendExitBill = async (email, data) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Parking Exit Bill - NE Parking Management System',
    html: `
      <h1>Parking Exit Bill</h1>
      <p>Thank you for using ${data.parkingName}.</p>
      <ul>
        <li>Entry ID: ${data.entryId}</li>
        <li>Plate Number: ${data.plateNumber}</li>
        <li>Entry Time: ${data.entryDateTime}</li>
        <li>Exit Time: ${data.exitDateTime}</li>
        <li>Duration: ${data.durationInHours.toFixed(2)} hours</li>
        <li>Total Amount: $${data.chargedAmount.toFixed(2)}</li>
      </ul>
      <p>Thank you for your business!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendPaymentConfirmation = async (email, data) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Payment Confirmation - NE Parking Management System',
    html: `
      <h1>Payment Confirmation</h1>
      <p>Your payment for parking at ${data.parkingName} has been processed successfully.</p>
      <ul>
        <li>Entry ID: ${data.entryId}</li>
        <li>Plate Number: ${data.plateNumber}</li>
        <li>Amount Paid: $${data.amount.toFixed(2)}</li>
        <li>Payment Date: ${data.paidAt}</li>
      </ul>
      <p>Thank you for using our parking service!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEntryTicket,
  sendExitBill,
  sendPaymentConfirmation
}; 