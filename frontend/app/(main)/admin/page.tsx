import { getServerSession } from '@/lib/get-session'
import Link from 'next/link'
import { forbidden, unauthorized } from 'next/navigation'
import React from 'react'

const AdminPage = async () => {
  const session = await getServerSession()
  const user = session?.user
  
  if (!user) {
    forbidden()
  }

  // Check if user has admin role
  const isAdmin = checkUserRole(user)
  
  if (!isAdmin) {
    // Redirect to forbidden page if user is not admin
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50'>
        <div className='bg-white p-8 rounded-2xl shadow-lg border-2 border-red-300 w-full max-w-md text-center'>
          <div className='text-6xl mb-4'>🚫</div>
          <h1 className='text-3xl font-bold text-red-600 mb-3'>Access Denied</h1>
          <p className='text-gray-600 mb-6'>You don't have permission to access the admin panel.</p>
          <Link href='/dashboard' className='inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200'>
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-300 mb-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold text-purple-600 mb-2'>Admin Dashboard</h1>
              <p className='text-gray-600'>Welcome back, {user.name}!</p>
            </div>
            <div className='px-4 py-2 bg-purple-500 text-white rounded-full font-semibold'>
              👑 Admin
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Total Users</p>
                <p className='text-3xl font-bold text-blue-600 mt-2'>1,234</p>
              </div>
              <div className='text-4xl'>👥</div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-lg border-2 border-green-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Active Sessions</p>
                <p className='text-3xl font-bold text-green-600 mt-2'>456</p>
              </div>
              <div className='text-4xl'>🟢</div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-300'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Pending Actions</p>
                <p className='text-3xl font-bold text-orange-600 mt-2'>12</p>
              </div>
              <div className='text-4xl'>⚠️</div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className='bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-300 mb-6'>
          <h2 className='text-2xl font-bold text-purple-600 mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button className='p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-colors text-left'>
              <div className='text-2xl mb-2'>👥</div>
              <p className='font-semibold text-gray-800'>Manage Users</p>
              <p className='text-sm text-gray-600'>View and edit users</p>
            </button>

            <button className='p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors text-left'>
              <div className='text-2xl mb-2'>⚙️</div>
              <p className='font-semibold text-gray-800'>System Settings</p>
              <p className='text-sm text-gray-600'>Configure system</p>
            </button>

            <button className='p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-colors text-left'>
              <div className='text-2xl mb-2'>📊</div>
              <p className='font-semibold text-gray-800'>View Reports</p>
              <p className='text-sm text-gray-600'>Analytics & stats</p>
            </button>

            <button className='p-4 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-colors text-left'>
              <div className='text-2xl mb-2'>🔒</div>
              <p className='font-semibold text-gray-800'>Security Logs</p>
              <p className='text-sm text-gray-600'>View audit logs</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className='bg-white p-6 rounded-2xl shadow-lg border-2 border-purple-300'>
          <h2 className='text-2xl font-bold text-purple-600 mb-4'>Recent Activity</h2>
          <div className='space-y-3'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold'>
                    U
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>User Action #{item}</p>
                    <p className='text-sm text-gray-600'>Activity description here</p>
                  </div>
                </div>
                <span className='text-sm text-gray-500'>2 min ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function checkUserRole(user: any): boolean {
  //todo: Implement role check logic
  //todo: Check if user has 'admin' role
  //todo: Return true if admin, false otherwise
  return false // Change this after implementing role check
}

export default AdminPage