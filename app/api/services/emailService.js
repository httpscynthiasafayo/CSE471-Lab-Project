import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // For development, you can use a service like Gmail or a test service like Ethereal
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration
    return nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development configuration - using Ethereal for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.EMAIL_PASSWORD || 'ethereal.pass'
      }
    });
  }
};

// Send landowner verification approval email
export const sendLandownerApprovalEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@abroadease.com',
      to: userEmail,
      subject: 'Landowner Verification Approved - AbroadEase',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Landowner Verification Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Landowner Verification Approved!</h1>
            </div>
            <div class="content">
              <h2>Congratulations, ${userName}!</h2>
              <p>We're excited to inform you that your landowner verification has been approved by our admin team.</p>
              
              <p><strong>What this means:</strong></p>
              <ul>
                <li>You can now log in to your landowner account</li>
                <li>Access to property management features</li>
                <li>Ability to list and manage your properties</li>
                <li>Connect with students looking for accommodation</li>
              </ul>
              
              <p>You can now log in to your account and start managing your properties:</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/landowner-login" class="button">
                Login to Your Account
              </a>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <p>Welcome to the AbroadEase landowner community!</p>
            </div>
            <div class="footer">
              <p>This email was sent by AbroadEase. If you didn't request this, please ignore this email.</p>
              <p>&copy; 2024 AbroadEase. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Landowner approval email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending landowner approval email:', error);
    return { success: false, error: error.message };
  }
};

// Send landowner verification rejection email
export const sendLandownerRejectionEmail = async (userEmail, userName, adminNotes) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@abroadease.com',
      to: userEmail,
      subject: 'Landowner Verification Update - AbroadEase',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Landowner Verification Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #EF4444; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .notes { background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Landowner Verification Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Thank you for your interest in becoming a verified landowner on AbroadEase.</p>
              
              <p>After reviewing your verification request, we need additional information or documentation before we can approve your account.</p>
              
              ${adminNotes ? `
                <div class="notes">
                  <h3>Admin Notes:</h3>
                  <p>${adminNotes}</p>
                </div>
              ` : ''}
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Review the admin notes above (if provided)</li>
                <li>Prepare the required documentation</li>
                <li>Submit a new verification request with updated documents</li>
              </ul>
              
              <p>You can submit a new verification request by logging into your account:</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/landowner-login" class="button">
                Login to Your Account
              </a>
              
              <p>If you have any questions about the verification process, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>This email was sent by AbroadEase. If you didn't request this, please ignore this email.</p>
              <p>&copy; 2024 AbroadEase. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Landowner rejection email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending landowner rejection email:', error);
    return { success: false, error: error.message };
  }
};

