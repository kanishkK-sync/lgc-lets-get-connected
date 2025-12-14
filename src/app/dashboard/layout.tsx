"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, FolderKanban, Briefcase, Users, LogOut, Code, Heart, Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAuthenticating } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/my-projects', label: 'My Projects', icon: FolderKanban },
    { href: '/dashboard/experience', label: 'Experience', icon: Briefcase },
    { href: '/dashboard/connections', label: 'Connections', icon: Users, count: 8 },
  ];

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/');
    }
  }, [isAuthenticating, user, router]);

  if (isAuthenticating || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sidebarContent = (
    <>
        <nav className="flex flex-col items-start gap-4 px-4 sm:py-5">
            <Link
                href="/"
                className="group flex h-9 w-full shrink-0 items-center justify-start gap-2 rounded-full bg-primary px-3 text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
                >
                <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="">LGC</span>
            </Link>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.count && (
                 <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{item.count}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <Button onClick={logout} variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
    </>
  )

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        {sidebarContent}
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs flex flex-col">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-4 ml-auto">
            <Card>
              <CardContent className="p-2 flex items-center gap-2">
                <Code className="h-5 w-5 text-accent"/>
                <span className="font-semibold">{user.projectsCount}</span>
                <span className="text-muted-foreground hidden md:inline">Projects</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary"/>
                <span className="font-semibold">{user.likesCount}</span>
                <span className="text-muted-foreground hidden md:inline">Likes</span>
              </CardContent>
            </Card>
            <Avatar>
              <AvatarImage src={user.photoUrl} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
