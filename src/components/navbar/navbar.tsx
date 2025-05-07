"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/redux/features/authSlice";
import { useEffect, useState } from "react";

import "./navbar.styles.css"

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
    <div className="NavBar-Styles bg-[url('/banner_web_minpro_v1.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="flex flex-row h-[140px] pt-5 pb-12 ml-5 mr-5 justify-between text-orange-400">
        <div className="size-12 sm:size-24 mr-2">
          <button onClick={() => router.push("/")}>
            <img className="rounded-lg" src="logo_miniTiket_v1.jpg" alt="MiniProjek G2 Logo" />
          </button>
        </div>
        <div className="Dashboard-Button-Stlyes">
          {menus.map((menu, idx) => {
          // Using the new role checking function
          if (!hasRequiredRole(menu.roleName)) return null;
            return (
            <div
              key={idx}
              className="flex flex-row gap-4"
              onClick={onMenuItemClick(menu.path)}
            >
              {menu.label}
            </div>
            );
          })}
        </div>
        <div>
          {auth.isLogin ? (
            <div className= "flex flex-row gap-4">
              <span className="pt-8 no-underline hover:underline text-orange-400 pl-2"
              >
                Welcome, {auth.user?.first_name}</span>
              <button className="Auth-Button-Styles"
                onClick={() => {
                dispatch(logout());
                router.push("/");
                }}>Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-5">
              <div className="Auth-Button-Styles" >
                <button onClick={() => router.push("/login")}>Login</button>
              </div>
              <div className="Auth-Button-Styles">
                <button onClick={() => router.push("/register")}>Register</button>  
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }
