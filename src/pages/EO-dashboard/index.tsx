"use client";

import { useAppSelector } from "@/lib/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./EO_dashboard.style.css"

export default function EODashboard() {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Only check auth state if we're running on client
    if (typeof window !== 'undefined') {
      if (!auth.isLogin) {
        router.push('/login');
      } else if (auth.user?.roleName?.toLowerCase() !== 'event organizer') {
        router.push('/');
      }
    }
  }, [auth, router]);

  console.log("Auth state:", auth); // Debugging line

  // Show loading state while checking authentication
  if (!auth.isLogin || auth.user?.roleName?.toLowerCase() !== 'event organizer'
  ) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500">
        </div>
      </div>;
  }

  return ( 
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600"
        >
          Welcome, {auth.user.first_name}
      </h1>
    </div>
  );
}