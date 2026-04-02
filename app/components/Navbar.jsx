"use client";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { TextLogo as Logo } from "./TextLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navigationData = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Groups", href: "/groups" },
  { title: "Meal Plans", href: "/meals" },
  { title: "Grocery", href: "/groceries" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user, login, logout, mounted } = useAuth();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY >= 20);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className={cn(
          "pointer-events-none transition-all duration-500 ease-in-out",
          // On scroll: shrink horizontal padding so the island compresses inward
          scrolled
            ? "w-full max-w-3xl px-4 pt-3"
            : "w-full max-w-7xl px-4 sm:px-6 pt-5"
        )}
      >
        <nav
          className={cn(
            "pointer-events-auto w-full flex items-center justify-between transition-all duration-500 ease-in-out rounded-full",
            // Always glass pill
            "backdrop-blur-xl border",
            // Scroll state: slightly more opaque + deeper shadow
            scrolled
              ? "px-4 py-2.5 bg-background/60 border-border/60 shadow-2xl shadow-black/10 scale-[0.98]"
              : "px-5 py-3.5 bg-background/40 border-border/30 shadow-lg shadow-black/5"
          )}
          style={{
            // Extra frosted glass depth
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Logo — shrinks slightly on scroll */}
          <Link
            href="/"
            className={cn(
              "flex-shrink-0 transition-all duration-500",
              scrolled ? "opacity-90 scale-95" : "opacity-100 scale-100"
            )}
          >
            <Logo className={cn("transition-all duration-500", scrolled ? "text-2xl" : "text-2xl")} />
          </Link>

          {/* Desktop Nav — centered pill */}
          <NavigationMenu className="max-lg:hidden flex-1 flex justify-center">
            <NavigationMenuList
              className={cn(
                "flex gap-0 rounded-full transition-all duration-500",
                scrolled ? "bg-muted/60 p-0.5" : "bg-muted/80 p-0.5"
              )}
            >
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <Link
                    href={navItem.href}
                    className={cn(
                      "inline-flex items-center rounded-full font-medium text-muted-foreground",
                      "hover:text-foreground hover:bg-background/90 hover:shadow-sm",
                      "outline outline-transparent hover:outline-border/50",
                      "transition-all duration-200 tracking-normal",
                      scrolled ? "px-3 py-1.5 text-xs" : "px-3 lg:px-4 py-2 text-sm"
                    )}
                  >
                    {navItem.title}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth — Desktop */}
          <div className="max-lg:hidden flex-shrink-0">
            {user ? (
              <Button
                onClick={logout}
                className={cn(
                  "rounded-full transition-all duration-500 bg-red-100 text-red-800 hover:bg-red-200",
                  scrolled ? "h-8 px-4 text-xs" : "h-9 px-5 text-sm"
                )}
              >
                Log Out
              </Button>
            ) : (
              <Button
                className={cn(
                  "rounded-full transition-all duration-500",
                  scrolled ? "h-8 px-4 text-xs" : "h-9 px-5 text-sm"
                )}
              >
                <Link href="/signin" className="flex gap-1.5 items-center">
                  Continue with Google
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex-shrink-0">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger
                className={cn(
                  "rounded-full bg-background/50 border border-border/50 outline-none",
                  "flex items-center justify-center cursor-pointer",
                  "hover:bg-background/80 transition-all duration-200",
                  scrolled ? "p-1.5" : "p-2"
                )}
              >
                <Menu size={scrolled ? 17 : 20} className="transition-all duration-300" />
                <span className="sr-only">Menu</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 mt-2 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl"
              >
                {navigationData.map((item) => (
                  <DropdownMenuItem key={item.title} className="rounded-xl">
                    <Link
                      href={item.href}
                      className="w-full cursor-pointer text-sm font-medium"
                    >
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuItem className="rounded-xl mt-1 border-t border-border/30 pt-2">
                  {user ? (
                    <button
                      onClick={logout}
                      className="w-full text-left text-sm font-medium text-red-500"
                    >
                      Log Out
                    </button>
                  ) : (
                    <button
                      onClick={login}
                      className="w-full text-left text-sm font-medium flex items-center gap-2"
                    >
                      <FcGoogle size={18} />
                      Sign In with Google
                    </button>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;