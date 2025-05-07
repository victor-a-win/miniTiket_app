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
    <div className="NavBar-Styles bg-[url('/banner_web_minpro_v1.jpg')]">
      <div className="flex flex-row h-[140px] pt-5 pb-12 justify-between items-center">
        
        <div className="size-12 sm:size-24 ml-8 mr-8 pt-3.5">
          <button onClick={() => router.push("/")}>
            <img className="rounded-lg" src="logo_miniTiket_v1.jpg" alt="MiniProjek G2 Logo" />
          </button>
        </div>

        <div className="ml-40">
          <button className="Nav-Button-Stlyes cursor-pointer" 
            onClick={() => router.push("/")}>
              Home
          </button>
        </div>

        <div>
          <button className="Nav-Button-Stlyes cursor-pointer" 
            onClick={() => router.push("/about")}>
              About
          </button>
        </div>
    
        <div>
          <button className="Nav-Button-Stlyes cursor-pointer" 
            onClick={() => router.push("/contact")}>
              Contact
          </button>
        </div>

        <div className="Nav-Button-Stlyes cursor-pointer mr-10">
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

        <div>
          {auth.isLogin ? (
            <div className= "flex flex-row gap-7">
              <div className="Auth-Button-Styles pt-8 no-underline hover:underline pl-2"
                > Welcome, {auth.user?.first_name}
              </div>
                <button className="Auth-Button-Styles cursor-pointer mr-5" 
                  onClick={() => {
                  dispatch(logout());
                  router.push("/");
                    }}> Logout
                </button>
            </div>
          ) : (
            <div className="flex flex-row gap-5">
              <div className="Auth-Button-Styles mr-2" >
                <button onClick={() => router.push("/login")}>Login</button>
              </div>
              <div className="Auth-Button-Styles mr-5">
                <button onClick={() => router.push("/register")}>Register</button>  
              </div>
            </div>
          )}
        </div>
      </div>
  </div>
    );
  }
