import { getServerSession } from '@/lib/get-session'
import { unauthorized } from 'next/navigation'
import React from 'react'

const Dashboard = async () => {
  const session = await getServerSession()
  const user = session?.user
  if (!user) {
    unauthorized()
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-purple-100'>
      {/* Empty dashboard - all content is in the sidebar */}
    </div>
  )
}

export default Dashboard
