
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Kanban,
  MessageSquare
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, collapsed }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all-200",
        "hover:bg-primary/20 group",
        isActive ? "bg-primary/20 text-cream" : "text-muted-foreground",
        collapsed ? "justify-center" : ""
      )}
    >
      <Icon className={cn(
        "h-5 w-5",
        collapsed ? "text-foreground" : ""
      )} />
      {!collapsed && <span className="font-medium">{label}</span>}
      
      {collapsed && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-card text-foreground text-sm 
          invisible opacity-0 -translate-x-3 transition-all-200 group-hover:visible 
          group-hover:opacity-100 group-hover:translate-x-0 z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [turboMode, setTurboMode] = useState(false);

  return (
    <aside className={cn(
      "glass-dark h-screen flex flex-col border-r border-border/80 relative",
      collapsed ? "w-[70px]" : "w-[240px]",
      "transition-all duration-300 ease-in-out"
    )}>
      <div className="p-4 flex items-center mb-2 justify-center">
        {!collapsed ? (
          <img 
            src="/lovable-uploads/94174d70-177d-4594-803f-abf234f836ca.png" 
            alt="Logo" 
            className="h-8" 
          />
        ) : (
          <img 
            src="/lovable-uploads/94174d70-177d-4594-803f-abf234f836ca.png" 
            alt="Logo" 
            className="h-6" 
          />
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 glass-dark rounded-full w-6 h-6 flex items-center justify-center text-xs"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
      
      <div className="space-y-1 px-2 flex-1">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" collapsed={collapsed} />
        <SidebarItem icon={ListTodo} label="Tarefas" to="/tasks" collapsed={collapsed} />
        <SidebarItem icon={Kanban} label="Projetos" to="/projects" collapsed={collapsed} />
        <SidebarItem icon={Calendar} label="Calendário" to="/calendar" collapsed={collapsed} />
        <SidebarItem icon={Users} label="Clientes" to="/clients" collapsed={collapsed} />
        <SidebarItem icon={MessageSquare} label="Chat" to="/chat" collapsed={collapsed} />
      </div>
      
      <div className="border-t border-border/40 pt-2 p-2 space-y-1">
        <button 
          onClick={() => setTurboMode(!turboMode)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all-200",
            "hover:bg-secondary/40",
            turboMode ? "bg-secondary/40 text-cream" : "text-muted-foreground",
            collapsed ? "justify-center" : ""
          )}
        >
          <Zap className={cn(
            "h-5 w-5",
            turboMode ? "text-cream" : ""
          )} />
          {!collapsed && <span className="font-medium">Turbo Mode</span>}
          
          {collapsed && turboMode && (
            <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-secondary text-secondary-foreground text-sm 
              invisible opacity-0 -translate-x-3 transition-all-200 group-hover:visible 
              group-hover:opacity-100 group-hover:translate-x-0 z-50">
              Turbo Mode Ativado
            </div>
          )}
        </button>
        
        <SidebarItem icon={Settings} label="Configurações" to="/settings" collapsed={collapsed} />
      </div>
    </aside>
  );
}
