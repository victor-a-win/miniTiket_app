"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/redux/features/authSlice";
import { useEffect, useState } from "react";

const menus = [
  {
    label: "EO Dashboard",
    path: "/eo-dashboard-page", // Make sure this matches the middleware matcher
    roleName: "Event Organizer"
  },
];

export default function Navbar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // add loading state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hasRequiredRole = (requiredRole: string | undefined) => {
    if (!requiredRole) return true;
    if (!auth.isLogin || !auth.user?.roleName) return false;
    return auth.user.roleName.toLowerCase() === requiredRole.toLowerCase();
  };

  if (!isHydrated) {
    return <div className="h-[140px] p-10">Loading...</div>;
  }

  console.log("Auth state:", auth); // Debugging line

  // Function to handle menu item click
  const onMenuItemClick = (path: string) => () => {
    if (!auth.isLogin) {
      router.push("/login");
      return;
    }
    router.push(path);
  };

  return (
    <div className="flex flex-row h-[140px] p-10 justify-between">
      <div>
        {menus.map((menu, idx) => {
        // Using the new role checking function
        if (!hasRequiredRole(menu.roleName)) return null;
          return (
          <div
            key={idx}
            className="flex flex-row gap-4 cursor-pointer hover:bg-gray-600 p-4 rounded-md"
            onClick={onMenuItemClick(menu.path)}
          >
            {menu.label}
          </div>
          );
        })}
      </div>
      <div>
        {auth.isLogin ? (
          <div className="flex flex-row gap-4">
            <span>Welcome, {auth.user?.first_name}</span>
            <button onClick={() => {
              dispatch(logout());
              router.push("/");
              }}>Logout</button>
          </div>
        ) : (
          <div className="flex flex-row gap-5">
            <button onClick={() => router.push("/login")}>Login</button>
            <button onClick={() => router.push("/register")}>Register</button>  
          </div>
        )}
      </div>
    </div>
  );
}
