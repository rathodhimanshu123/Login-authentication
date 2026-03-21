import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';
import prisma from './lib/prisma.js';

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

// Request logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Check if this is a successful sign-up request
    if (req.path === '/api/auth/sign-up/email' && req.method === 'POST' && res.statusCode === 200) {
      try {
        const responseData = typeof data === 'string' ? JSON.parse(data) : data;
        if (responseData?.user?.id) {
          // Store the user ID for the after-request handler
          (res as any).newUserId = responseData.user.id;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    if (res.statusCode >= 400) {
      console.error(`[${res.statusCode}] ${req.method} ${req.path}`, {
        body: req.body,
        error: typeof data === 'string' ? data : JSON.stringify(data)
      });
    }
    res.send = originalSend;
    return res.send(data);
  };
  
  next();
});

// After-response middleware to copy password hash to User table
app.use((req, res, next) => {
  res.on('finish', async () => {
    if (req.path === '/api/auth/sign-up/email' && req.method === 'POST' && res.statusCode === 200) {
      try {
        const userId = (res as any).newUserId;
        if (userId) {
          // Get the account with password hash
          const account = await prisma.account.findFirst({
            where: { userId }
          });
          
          if (account?.password) {
            // Update user's password field with the hash from account
            await prisma.user.update({
              where: { id: userId },
              data: { password: account.password }
            });
            console.log(`✅ Password hash stored in User table for user: ${userId}`);
          }
        }
      } catch (error) {
        console.error("Error storing password in User table:", error);
      }
    }
  });
  
  next();
});
// Better Auth handler - handles all /api/auth/* routes
app.use('/api/auth', toNodeHandler(auth));

// Custom API routes

// Get user details with password (for admin purposes)
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await auth.api.getSession({
      headers: req.headers as any
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user with account details (including password hash)
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          select: {
            id: true,
            providerId: true,
            password: true,
            createdAt: true,
            updatedAt: true,
          }
        },
        sessions: {
          select: {
            id: true,
            token: true,
            expiresAt: true,
            ipAddress: true,
            userAgent: true,
            createdAt: true,
          }
        }
      }
    });

    if (!userDetails) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(userDetails);
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({
      error: error.message || 'Failed to fetch user details'
    });
  }
});

// Get all users (for admin dashboard)
app.get('/api/users', async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any
    });

    if (!session || session.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await prisma.user.findMany({
      include: {
        accounts: {
          select: {
            id: true,
            providerId: true,
            password: true,
            createdAt: true,
            updatedAt: true,
          }
        },
        _count: {
          select: {
            sessions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      error: error.message || 'Failed to fetch users'
    });
  }
});

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
// Sync password hashes from Account table to User table
app.post('/api/sync-passwords', async (req, res) => {
  try {
    console.log('🔄 Syncing password hashes from Account to User table...');
    
    // Get all users and their accounts
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          where: {
            password: { not: null }
          }
        }
      }
    });
    
    let syncedCount = 0;
    for (const user of users) {
      if (user.accounts.length > 0 && user.accounts[0].password) {
        const account = user.accounts[0];
        const passwordHash = account.password as string;
        
        // Only update if User.password is empty
        if (!user.password || user.password.length === 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: { password: passwordHash }
          });
          syncedCount++;
          console.log(`✅ Synced password for user: ${user.email}`);
        }
      }
    }
    
    return res.json({
      success: true,
      message: `Synced passwords for ${syncedCount} users`
    });
  } catch (error: any) {
    console.error('Error syncing passwords:', error);
    return res.status(500).json({
      error: error.message || 'Failed to sync passwords'
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
