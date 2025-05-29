import React from 'react'
import CalendarioPage from "@/components/admin/calendarioFetch"
import Search from "@/components/admin/search"


 const Dashboard = () => {
  return (
    <div className="w-full flex flex-col">     
    <div className="w-full  flex justify-end items-end mt-20  "> 
    <Search />
</div>
      <CalendarioPage />
</div>
  )
}
export default Dashboard