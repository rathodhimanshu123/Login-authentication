'use client'
import React from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const Sidebar = () => {
    const router = useRouter()
    const [user, setUser] = useState({ name: '', email: '', role: '' })
    const [isLoaded, setIsLoaded] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchSession = async () => {
            const session = await authClient.getSession()
            if (session.data?.user) {
                const userData = session.data.user
                setUser({
                    name: userData.name || '',
                    email: userData.email || '',
                    role: (userData as any).role || 'user'
                })
            }
            setIsLoaded(true)
        }
        fetchSession()
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
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

    if (!isLoaded) {
        return null
    }

    const isAdmin = user.role === 'admin'

    return (
        <div className='fixed top-0 right-0 z-50 p-4' ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105'
            >
                <div className='w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-lg font-bold border-2 border-white/50'>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className='text-left'>
                    <p className='font-semibold text-sm'>{isAdmin ? 'Admin' : 'User'}</p>
                    <p className='text-xs text-purple-100'>{user.name}</p>
                </div>
                <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill='none' 
                    stroke='currentColor' 
                    viewBox='0 0 24 24'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700'>
                    {/* User Info Header */}
                    <div className='p-4 bg-gradient-to-r from-purple-600 to-purple-800 border-b border-gray-700'>
                        <p className='font-semibold text-white text-sm mb-1'>{isAdmin ? 'Admin' : 'User'}</p>
                        <p className='text-xs text-purple-100 truncate'>{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className='py-2'>
                        {/* Profile */}
                        <Link 
                            href='/profile' 
                            className='flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 transition-colors duration-200'
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                            <span className='font-medium'>Profile</span>
                        </Link>

                        {/* Dashboard or Admin Dashboard */}
                        {isAdmin ? (
                            <Link 
                                href='/admin' 
                                className='flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 transition-colors duration-200'
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                                </svg>
                                <span className='font-medium'>Admin Dashboard</span>
                            </Link>
                        ) : (
                            <Link 
                                href='/dashboard' 
                                className='flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 transition-colors duration-200'
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                                </svg>
                                <span className='font-medium'>Dashboard</span>
                            </Link>
                        )}

                        {/* Divider */}
                        <div className='border-t border-gray-700 my-2'></div>

                        {/* Logout */}
                        <button 
                            onClick={handleSignOut}
                            className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 transition-colors duration-200 text-left'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                            </svg>
                            <span className='font-medium'>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sidebar
