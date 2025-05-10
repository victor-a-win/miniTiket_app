"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hook";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/redux/features/authSlice";
import { useEffect, useState } from "react";

import "./navbar.styles.css"

const menus = [
  {
    label: "EO Dashboard",
    path: "/eo-dashboard", // Make sure this matches the middleware matcher
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
    <div className="NavBar-Styles bg-[url('/banner_web_minpro_v1.png')] text-xs sm:text-base">
      <div className="flex flex-row h-[140px] justify-between items-center">
        
        <div className="size-20 absolute sm:relative sm:size-28 ml-5 mb-10 sm:ml-8 sm:mr-16 sm:mb-7 sm:pt-3.5">
          <button onClick={() => router.push("/")}>
            <img className="rounded-lg" src="logo_miniTiket_v1.jpg" alt="MiniProjek G2 Logo" />
          </button>
        </div>

        <div className="flex relative -mr-20 mt-20 gap-4 sm:mt-5 sm:text-xl sm:gap-8">
          <button 
            className="Nav-Button-Stlyes ml-14 sm:pl-4 sm:pr-4"
            onClick={() => router.push("/")}>
              Home
          </button>

          <button 
            className="Nav-Button-Stlyes sm:pl-4 sm:pr-4"
            onClick={() => router.push("/about")}>
              About
          </button>
  
          <button 
            className="Nav-Button-Stlyes sm:pl-4 sm:pr-4" 
            onClick={() => router.push("/contact")}>
              Contact
          </button>

          <div className="EO-Button-Stlyes cursor-pointer sm:pl-4 sm:pr-4">
            {menus.map((menu, idx) => {
          // Using the new role checking function
            if (!hasRequiredRole(menu.roleName)) return null;
              return (
              <div
                key={idx}
                className="flex flex-row"
                onClick={onMenuItemClick(menu.path)}
              >
                {menu.label}
              </div>
              );
            })}
          </div>
        </div>

        <div>
          {auth.isLogin ? (
            <div className= "flex flex-row mb-20 gap-2 sm:gap-5">
              <div className="Auth-Button-Styles no-underline hover:underline 
                              pr-1.5 pl-1.5 sm:pl-3 sm:pr-3"
                > Welcome, {auth.user?.first_name}
              </div>
                <button className="Auth-Button-Styles cursor-pointer 
                                  mr-4 pr-2 pl-2 sm:pl-3 sm:pr-3 sm:mr-7" 
                  onClick={() => {
                  dispatch(logout());
                  router.push("/");
                    }}> Logout
                </button>
            </div>
          ) : (
            <div className="flex flex-row gap-4 sm:gap-5 mb-20 sm:mb-15">
              <div className="Auth-Button-Styles sm:pl-4 sm:pr-4" >
                <button onClick={() => router.push("/login")}>Login</button>
              </div>
              <div className="Auth-Button-Styles mr-5 sm:pl-3 sm:pr-3 sm:mr-7">
                <button onClick={() => router.push("/register")}>Register</button>  
              </div>
            </div>
          )}
        </div>
      </div>
  </div>
    );
  }
