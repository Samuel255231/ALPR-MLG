import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, LogOut } from "lucide-react";
import logo from "../assets/image_alpr_mlg.png";
import { useDispatch} from "react-redux";
import type { AppDispatch} from "@/redux/store";
import { logout } from "@/redux/slices/AuthSlice";

export function SiteHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // true = ouverte

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const dispatch = useDispatch<AppDispatch>()
  return (
    <header className="fixed top-0 left-0 z-10 flex w-full items-center gap-2 bg-sidebar h-[var(--header-height)] border-b transition-all ease-linear px-4 lg:px-6">

      {/* Logo */}
      <div
        className={`flex items-center gap-2 transition-all duration-300 ${
          sidebarOpen ? "w-50" : "w-5"
        }`}
      >
        <img
          src={logo}
          className={`object-contain transition-all duration-300 ${
            sidebarOpen ? "w-10 h-10" : "w-8 h-8"
          }`}
          alt="Logo"
        />
        <span
          className={`text-lg font-semibold text-gray-900 transition-all duration-300 overflow-hidden whitespace-nowrap ${
            sidebarOpen ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          ALPR_MLG
        </span>
      </div>

      {/* Sidebar Trigger */}
      <Separator orientation="vertical" className=" h-6 ml-4" />
      <SidebarTrigger
        onClick={toggleSidebar}
      />


      {/* Title */}
      <h1 className="text-lg font-bold text-gray-900">
        Système de Reconnaissance Automatique de Plaques d’Immatriculation Malgache
      </h1>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-4">
        
        <button 
        aria-label="Notifications"
        className="relative p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-red-300 rounded-full">
            <LogOut className="cursor-pointer w-4 h-4 text-red-900" onClick={()=>{
              dispatch(logout())
            }} />
          </div>
          {/* <div>
            <p className="text-sm font-medium text-gray-900">{displayFullname}</p>
            <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
          </div> */}
        </div>
      </div>
    </header>
  );
}
