// 'use client' 
// import React from 'react'
// import Auth from '../components/auth'

// const page = () => {
//   return (
//     <Auth/>
//   )
// }

// export default page
import Auth from '../components/auth';

export default function AuthPage({ searchParams }) {
  const tab = searchParams?.tab || 'login'; 
  return <Auth defaultTab={tab} />;
}
