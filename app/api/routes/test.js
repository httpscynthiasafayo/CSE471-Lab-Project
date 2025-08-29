import express from 'express';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

router.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Mailtrap Test',
      text: 'Hello from Nodemailer & Mailtrap!'
    });
    res.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Email failed' });
  }
});

export default router;
