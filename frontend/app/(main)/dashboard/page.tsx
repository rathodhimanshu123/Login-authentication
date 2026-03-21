import { getServerSession } from '@/lib/get-session'
import { unauthorized } from 'next/navigation'

const Dashboard = async () => {
  const session = await getServerSession()
  const user = session?.user
  if (!user) {
    unauthorized()
  }
  return (
    <div className='min-h-screen' />
  )
}

export default Dashboard
