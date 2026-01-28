import { Menu, School, LogOut, User as UserIcon, BookOpen, LayoutDashboard, Loader2 } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

/* =====================================================
    📱 MOBILE NAVBAR COMPONENT
===================================================== */
const MobileNavbar = ({ user, logoutHandler, goToAuth, isLoggingOut }) => {
  const [open, setOpen] = React.useState(false);

  const handleNavClick = () => {
    setOpen(false); 
  };
 
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-800">
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col gap-6 w-[300px] sm:w-[350px] dark:bg-[#0A0A0A]">
        <SheetHeader className="flex flex-row justify-between items-center pr-6">
          <SheetTitle className="font-black text-xl italic uppercase">
            Acadify<span className="text-blue-600">.</span>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>

        <Separator className="dark:bg-zinc-800" />

        <nav className="flex flex-col gap-4 mt-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800">
                <Avatar className="h-10 w-10 border border-white dark:border-zinc-700">
                  <AvatarImage src={user.photoUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{user.name}</span>
                  <span className="text-xs text-zinc-500 truncate max-w-[150px]">{user.email}</span>
                </div>
              </div>

              <NavLink to="/profile" onClick={handleNavClick} className="flex items-center gap-3 text-sm font-semibold p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">
                <UserIcon size={18} /> Profile
              </NavLink>

              <NavLink to="/my-learning" onClick={handleNavClick} className="flex items-center gap-3 text-sm font-semibold p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">
                <BookOpen size={18} /> My Learning
              </NavLink>

              {user.role === "instructor" && (
                <NavLink to="/admin/dashboard" onClick={handleNavClick} className="flex items-center gap-3 text-sm font-bold p-3 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors">
                  <LayoutDashboard size={18} /> Instructor Dashboard
                </NavLink>
              )}

              <Separator className="my-4 dark:bg-zinc-800" />
              
              <Button 
                variant="destructive" 
                disabled={isLoggingOut}
                onClick={async () => { 
                  await logoutHandler(); 
                  handleNavClick(); 
                }} 
                className="w-full rounded-xl font-bold uppercase text-xs tracking-widest h-12"
              >
                {isLoggingOut ? <Loader2 className="animate-spin mr-2" size={16} /> : <LogOut size={16} className="mr-2" />}
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
                <Button variant="outline" onClick={() => { goToAuth("login"); handleNavClick(); }} className="w-full rounded-xl font-bold h-12 border-zinc-200 dark:border-zinc-800">
                  Login
                </Button>
                <Button onClick={() => { goToAuth("signup"); handleNavClick(); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-12 shadow-lg shadow-blue-500/20 transition-all">
                  Get Started (Signup)
                </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

/* =====================================================
    🏠 MAIN NAVBAR COMPONENT
===================================================== */
const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutMutation();

  // 🔥 Fix: Logout handler ke andar hi Toast trigger kiya hai taaki navigation se pehle dikhe
  const logoutHandler = async () => {
    try {
      const res = await logoutUser().unwrap();
      // Pehle Toast dikhao
      toast.success(res?.message || "Logged out successfully");
      // Phir Navigate karo
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Logout failed. Please try again.");
    }
  };

  const goToAuth = (tab) => {
    navigate(`/login?tab=${tab}`);
  };

  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between h-full px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-xl group-hover:rotate-6 transition-transform">
            <School size={24} className="text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic">
            Acadify<span className="text-blue-600">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-5">
              <Link to="/my-learning" className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">My Learning</Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-blue-600 transition-all shadow-sm ring-offset-2 ring-offset-white dark:ring-offset-black">
                    <AvatarImage src={user.photoUrl || "https://github.com/shadcn.png"} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold uppercase">
                      {user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-64 p-2 mt-2 rounded-2xl shadow-xl border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900">
                      <Link to="/profile" className="flex items-center gap-2 w-full p-1"><UserIcon size={16}/> Profile</Link>
                    </DropdownMenuItem>
                    {user.role === "instructor" && (
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                        <Link to="/admin/dashboard" className="flex items-center gap-2 w-full p-1"><LayoutDashboard size={16}/> Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  
                  {/* onSelect touch devices ke liye 100% reliable hai */}
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      logoutHandler();
                    }} 
                    disabled={isLoading}
                    className="rounded-lg text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer font-bold"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <LogOut size={16} className="mr-2" />}
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase" onClick={() => goToAuth("login")}>Login</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold text-xs uppercase shadow-lg shadow-blue-500/20" onClick={() => goToAuth("signup")}>Get Started</Button>
            </div>
          )}
          <Separator orientation="vertical" className="h-6 mx-2 dark:bg-zinc-800" />
          <DarkMode />
        </div>
      </div>

      {/* MOBILE TRIGGER */}
      <div className="flex md:hidden items-center justify-between h-full px-4">
        <Link to="/" className="font-black text-xl italic uppercase tracking-tighter">
          Acadify<span className="text-blue-600">.</span>
        </Link>
        <MobileNavbar user={user} logoutHandler={logoutHandler} goToAuth={goToAuth} isLoggingOut={isLoading} />
      </div>
    </header>
  );
};

export default Navbar;