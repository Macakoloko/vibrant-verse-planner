
import React, { useState } from 'react';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import { dashboardStats } from '@/lib/data';
import { Bell, Zap, Search } from 'lucide-react';

export default function Dashboard() {
  const [turboMode, setTurboMode] = useState(false);
  
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral de performance e atividades</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="p-2 rounded-full glass hover:bg-muted/30 transition-all-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-secondary" />
            </button>
          </div>
          
          <div className="relative">
            <div className="glass flex items-center px-3 py-2 rounded-lg w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <button 
            onClick={() => setTurboMode(!turboMode)}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 transition-all-200
              ${turboMode ? 'bg-secondary text-secondary-foreground' : 'glass text-foreground'}
            `}
          >
            <Zap className={`w-4 h-4 ${turboMode ? 'text-secondary-foreground' : 'text-muted-foreground'}`} />
            <span>Turbo Mode</span>
          </button>
        </div>
      </div>
      
      <PerformanceMetrics />
      
      <div className="glass-dark rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Atividades recentes</h3>
        
        <div className="space-y-4">
          {dashboardStats.recentActivity.map((activity, index) => {
            const isTask = activity.action.includes('task');
            const isClient = activity.action.includes('client');
            const isComment = activity.action.includes('comment');
            
            let actionText = '';
            if (activity.action === 'task_completed') actionText = 'finalizou';
            if (activity.action === 'task_created') actionText = 'criou';
            if (activity.action === 'comment_added') actionText = 'comentou em';
            if (activity.action === 'client_added') actionText = 'adicionou cliente';
            
            const timeAgo = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
              Math.round((activity.timestamp.getTime() - Date.now()) / (1000 * 60 * 60)), 'hour'
            );
            
            return (
              <div key={index} className="glass p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {activity.user.charAt(0)}
                    </div>
                    
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{actionText}</span>{' '}
                        <span className="font-medium">
                          {isTask || isComment ? activity.task : activity.task}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`
                      text-xs px-2 py-0.5 rounded-full 
                      ${activity.action === 'task_completed' ? 'bg-green-500/20 text-green-200' : 
                        activity.action === 'comment_added' ? 'bg-blue-500/20 text-blue-200' : 
                        'bg-primary/20 text-primary-foreground'}
                    `}
                  >
                    {activity.action === 'task_completed' ? 'Concluído' : 
                      activity.action === 'comment_added' ? 'Comentário' : 
                      activity.action === 'task_created' ? 'Nova tarefa' : 'Novo cliente'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
