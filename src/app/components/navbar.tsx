"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { request} from "src/app/lib/api";
import { useAuth } from "src/app/components/AuthProvider";

interface NavbarProps {
  onMenuClick: () => void;
}

interface UserData {
  id_user: number;
  name: string;
  email: string;
  avatar: string;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [user, setUser] = useState<UserData | null>(null);
 const router = useRouter();
  const { logout } = useAuth();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token"); // قراءة token من cookie
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/navbarDashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
               throw new Error("Erreur lors du chargement des commandes");
        }
      } catch (error) {
             throw new Error("Erreur lors du chargement des commandes");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
   try {
     await request("/api/logout", { method: "POST", auth: true });
     // removeToken();  <-- supprime cette ligne
     Cookies.remove("session_id",{ path: "/" }); // supprime ton token ou session
 
     logout();
     router.push("/");
   } catch (e) {
         throw new Error("Erreur lors du chargement des commandes");
   }
 };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-4 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar ?? "/diverse-user-avatars.png"} alt="User" />
                <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name ?? "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email ?? "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/settings">
              <DropdownMenuItem asChild>
                <a>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </a>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
