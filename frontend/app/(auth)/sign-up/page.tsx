'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const SignUp = () => {
    const router=useRouter();
    const [error, setError] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState<'user' | 'admin'>('admin') // Default to admin since it's first

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        // Password validation
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            toast.error('Passwords do not match')
            return
        }
        
        try {
            // Sign up with role as additional field
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/sign-up/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Sign up failed');
            }

            toast.success(`Sign up successful as ${role}!`);
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(`Error signing up: ${error.message}`);
            setError(error.message || 'An unknown error occurred');
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600' suppressHydrationWarning>
            <div className='bg-white p-8 rounded-2xl shadow-2xl border-2 border-purple-200 w-full max-w-md'>
                <div className='text-center mb-6'>
                    <div className='text-6xl mb-3'>✨</div>
                    <h1 className='text-3xl font-bold text-purple-600 mb-2'>Create Account</h1>
                    <p className='text-gray-600 text-sm'>Join us today! Create your account to get started.</p>
                </div>
                <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter your name'
                            className='w-full border-2 border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Role:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                            className='w-full border-2 border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer'
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <p className='text-xs text-gray-500 mt-1'>Select your account type</p>
                    </div>
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            className='w-full border-2 border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                            className='w-full border-2 border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm your password'
                            className='w-full border-2 border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mt-2'
                    >
                        Sign Up
                    </button>
                    {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
                </form>
                <div className='mt-6 text-center'>
                    <span className='text-gray-600 text-sm'>Already have an account? </span>
                    <Link href='/sign-in' className='text-purple-600 hover:text-purple-800 text-sm font-bold'>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp
