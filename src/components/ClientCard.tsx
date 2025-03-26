
import React from 'react';
import { cn } from '@/lib/utils';
import { tasks } from '@/lib/data';
import { FileText, MoreVertical, Clock } from 'lucide-react';

interface ClientCardProps {
  id: number;
  name: string;
  logo: string;
  industry: string;
  primaryColor: string;
  secondaryColor: string;
  postsPerWeek: number;
  tags: string[];
}

export default function ClientCard({
  id,
  name,
  logo,
  industry,
  primaryColor,
  secondaryColor,
  postsPerWeek,
  tags
}: ClientCardProps) {
  // Get client's tasks
  const clientTasks = tasks.filter(task => task.clientId === id);
  
  // Calculate task statistics
  const completedTasks = clientTasks.filter(task => task.status === 'done').length;
  const pendingTasks = clientTasks.filter(task => task.status !== 'done').length;
  const completionRate = clientTasks.length > 0 
    ? Math.round((completedTasks / clientTasks.length) * 100) 
    : 0;
  
  // Generate a subtle gradient using the client's colors
  const cardGradient = `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`;
  
  return (
    <div 
      className="glass-dark rounded-xl p-6 hover-scale border border-border/30" 
      style={{ background: cardGradient }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center glass"
            style={{ borderColor: `${primaryColor}30` }}
          >
            <span 
              className="text-2xl font-bold" 
              style={{ color: primaryColor }}
            >
              {name.charAt(0)}
            </span>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{industry}</p>
          </div>
        </div>
        
        <button className="p-1.5 rounded-lg hover:bg-muted/20 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <div 
            key={index}
            className="text-xs px-2 py-1 rounded-full bg-muted/20"
            style={{ color: primaryColor }}
          >
            #{tag}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{postsPerWeek} posts/semana</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{pendingTasks} em aberto</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Progresso</span>
          <span className="text-sm font-medium">{completionRate}%</span>
        </div>
        
        <div className="w-full bg-muted/20 rounded-full h-1.5">
          <div 
            className="h-full rounded-full"
            style={{ 
              width: `${completionRate}%`,
              backgroundColor: primaryColor 
            }}
          />
        </div>
      </div>
    </div>
  );
}
