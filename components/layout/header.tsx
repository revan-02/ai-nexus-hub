import React from 'react';
import { Search, Moon, Globe, Bell, Menu, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarContent } from '@/components/layout/sidebar';

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger render={<button className="lg:hidden p-2 -ml-2 text-muted-foreground hover:bg-slate-100 rounded-lg" />}>
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 flex flex-col">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        
        <div className="relative w-full max-w-2xl hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search algorithms, concepts, examples, use cases..." 
            className="pl-10 pr-4 py-2 w-full bg-slate-50 border-transparent focus-visible:ring-purple-500 rounded-full"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <button className="text-muted-foreground hover:text-foreground">
          <Moon className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900">
          <Globe className="w-4 h-4" />
          <span>EN</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <button className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 pl-2 lg:border-l">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Aarav Sharma" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-sm">
            <p className="text-muted-foreground text-xs">Welcome,</p>
            <p className="font-semibold leading-none">Aarav Sharma</p>
          </div>
        </div>
      </div>
    </header>
  );
}
