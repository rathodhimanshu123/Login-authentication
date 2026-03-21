'use client'
import React from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const Sidebar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState({ name: '', email: '', role: '' })
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const fetchSession = async () => {
            const session = await authClient.getSession()
            if (session.data?.user) {
                const userData = session.data.user
                setUser({
                    name: userData.name || '',
                    email: userData.email || '',
                    role: (userData as { role?: string }).role || 'user'
                })
            }
            setIsLoaded(true)
        }
        fetchSession()
    }, [])

    const handleSignOut = async () => {
        const { error } = await authClient.signOut()
        if (error) {
            toast.error(error.message || 'Something went wrong')
        } else {
            toast.success('Signed out successfully')
            router.push('/')
        }
    }

    const isAdmin = user.role === 'admin'

    return (
        <>
            {/* Left navigation panel */}
            <aside className='w-64 h-screen bg-purple-600 text-white border-r border-purple-700 flex flex-col p-4'>
                <div className='h-8 mb-4' />

                {/* User summary */}
                <div className='flex items-center gap-3 bg-white/7 border border-white/12 rounded-2xl p-3 mb-4 shadow-sm backdrop-blur'>
                    <div className='w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-lg font-bold text-white'>
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className='min-w-0'>
                        <p className='font-semibold text-sm truncate text-white'>{user.name || 'User'}</p>
                        <p className='text-xs text-white/80 truncate'>
                            {user.email ? user.email : 'Email: -'}
                        </p>
                    </div>
                </div>

                <nav className='flex flex-col gap-1.5'>
                    <Link
                        href='/dashboard'
                        className={[
                            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200',
                            pathname === '/dashboard'
                                ? 'bg-purple-800 text-white shadow-sm'
                                : 'text-white/75 hover:bg-white/10',
                        ].join(' ')}
                    >
                        <svg className='w-5 h-5 opacity-90' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                        </svg>
                        <span className='font-medium'>Dashboard</span>
                    </Link>

                    {isAdmin && (
                        <Link
                            href='/admin'
                            className={[
                                'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200',
                                pathname === '/admin'
                                    ? 'bg-purple-800 text-white shadow-sm'
                                    : 'text-white/75 hover:bg-white/10',
                            ].join(' ')}
                        >
                            <svg className='w-5 h-5 opacity-90' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                            </svg>
                            <span className='font-medium'>Admin Dashboard</span>
                        </Link>
                    )}

                    <Link
                        href='/profile'
                        className={[
                            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200',
                            pathname === '/profile'
                                ? 'bg-purple-800 text-white shadow-sm'
                                : 'text-white/75 hover:bg-white/10',
                        ].join(' ')}
                    >
                        <svg className='w-5 h-5 opacity-90' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                        </svg>
                        <span className='font-medium'>Profile</span>
                    </Link>
                </nav>

                <div className='mt-auto pt-4'>
                    <button
                        onClick={handleSignOut}
                        className='w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-white/10 transition-colors duration-200 text-left rounded-xl'
                    >
                        <span className='w-8 h-8 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center'>
                            <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                            </svg>
                        </span>
                        <span className='font-medium'>Logout</span>
                    </button>
                </div>

                {/* Small note to help the user if the role isn't loaded yet */}
                {!isLoaded && (
                    <div className='mt-4 text-xs text-gray-400'>
                        Loading...
                    </div>
                )}
            </aside>
        </>
    )
}

export default Sidebar
