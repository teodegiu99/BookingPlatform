import React from 'react'
import CalendarioPage from "@/components/admin/calendarioFetch"
import Search from "@/components/admin/search"


 const Dashboard = () => {
  return (
    <div className="w-full flex flex-col pt-16 md:pt-24 px-4 sm:px-8">     
    <div className="w-full flex justify-end items-end mt-4"> 
    <Search />
</div>
      <CalendarioPage />
</div>
  )
}
export default Dashboard