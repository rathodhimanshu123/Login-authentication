import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Better Auth handler - handles all /api/auth/* routes
app.use('/api/auth', toNodeHandler(auth));

// Custom API routes
app.use('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: 'forget-password',
      }
    });

    return res.json({ 
      success: true, 
      message: 'Password reset OTP sent to your email' 
    });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send OTP. Please try again.'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📧 Auth endpoint: http://localhost:${PORT}/api/auth`);
});
