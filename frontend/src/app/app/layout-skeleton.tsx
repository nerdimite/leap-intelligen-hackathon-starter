"use client";

import { User } from "@/types/user";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Menu,
  Search,
  MessageCircle,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

function SidebarTooltip({
  href,
  icon: Icon,
  label,
  isActive,
}: Readonly<{
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SideNavbar() {
  const pathname = usePathname();

  return (
    <div>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <svg
            className="h-6 w-6 text-primary-foreground"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only">Greenbase Assist</span>
        </Link>
        <SidebarTooltip
          href="/app/dashboard"
          icon={Home}
          label="Dashboard"
          isActive={pathname === "/app/dashboard"}
        />
        <SidebarTooltip
          href="/app/search"
          icon={Search}
          label="Search"
          isActive={pathname === "/app/search"}
        />
        <SidebarTooltip
          href="/app/g-assist"
          icon={MessageCircle}
          label="G-Assist"
          isActive={pathname === "/app/g-assist"}
        />
      </nav>
    </div>
  );
}

function MobileNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: Readonly<{
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}>) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-2.5 ${
        isActive
          ? "text-accent-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

function MobileNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">Greenbase Assist</span>
          </Link>
          <MobileNavItem
            href="/app/dashboard"
            icon={Home}
            label="Dashboard"
            isActive={pathname === "/app/dashboard"}
            onClick={() => setIsOpen(false)}
          />
          <MobileNavItem
            href="/app/search"
            icon={Search}
            label="Search"
            isActive={pathname === "/app/search"}
            onClick={() => setIsOpen(false)}
          />
          <MobileNavItem
            href="/app/g-assist"
            icon={MessageCircle}
            label="G-Assist"
            isActive={pathname === "/app/g-assist"}
            onClick={() => setIsOpen(false)}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DynamicBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <div>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/app/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.slice(1).map((segment, index) => {
            const href = `/app/${pathSegments.slice(1, index + 2).join("/")}`;
            const isLast = index === pathSegments.length - 2;

            const formattedSegment = segment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{formattedSegment}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default function DashboardSkeleton({
  children,
  user,
  handleLogout,
}: Readonly<{
  children: React.ReactNode;
  user: User | null;
  handleLogout: () => void;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <TooltipProvider>
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <SideNavbar />
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNavbar />
            <DynamicBreadcrumb />
            <div className="ml-auto space-x-4 flex items-center">
              <ThemeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Image
                    src={
                      user?.profileImageUrl ??
                      process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL ??
                      ""
                    }
                    width={36}
                    height={36}
                    priority={true}
                    alt="Profile"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user ? `${user.first_name} ${user.last_name}` : "User"}
                </DropdownMenuLabel>
                <DropdownMenuItem disabled>
                  Customer ID: {user?.customer_id || 'N/A'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
        </div>
      </TooltipProvider>
    </div>
  );
}
