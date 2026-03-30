import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

/**
 * Header component: shows Sign In button when logged out,
 * or the user's email + sign-out when logged in.
 */
export function UserMenu() {
    const { user, tier, signOut } = useAuth();

  if (!user) {
        return (
                <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        <Link to="/login">Sign In</Link>Link>
                </Button>Button>
              );
  }
  
    return (
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 gap-2">
                                  <User className="h-4 w-4" />
                                  <span className="hidden sm:inline max-w-[160px] truncate">
                                    {user.email}
                                  </span>span>
                                  <span className="text-xs text-blue-300 uppercase">{tier}</span>span>
                        </Button>Button>
                </DropdownMenuTrigger>DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1B2A4A] border-white/10 text-white">
                        <DropdownMenuItem disabled className="text-gray-400 text-xs">
                          {user.email}
                        </DropdownMenuItem>DropdownMenuItem>
                        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-400 focus:text-red-300">
                                  <LogOut className="mr-2 h-4 w-4" />
                                  Sign Out
                        </DropdownMenuItem>DropdownMenuItem>
                </DropdownMenuContent>DropdownMenuContent>
          </DropdownMenu>DropdownMenu>
        );
}</Button>
