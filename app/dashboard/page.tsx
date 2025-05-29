import Dashboard from '@/components/admin/dashboard'
import React from 'react'
import { auth, signOut } from "@/auth";






const DashboardPage = async () => {
  const session = await auth();
  if (session?.user.role === 'USER') {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className='text-2xl font-bold'>Access Denied</h1>
      </div>
    )
  } else {
    return (
      <Dashboard />
    )
  }
}
export default DashboardPage