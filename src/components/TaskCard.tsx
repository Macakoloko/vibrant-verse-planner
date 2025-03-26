
import React from 'react';
import { cn } from '@/lib/utils';
import { TaskPriority, TaskStatus, ContentType, getClientById, getTagById, getPriorityColor, getContentTypeIcon, getStatusColor } from '@/lib/data';
import { Calendar, Clock, Tag } from 'lucide-react';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  clientId: number;
  status: TaskStatus;
  priority: TaskPriority;
  contentType: ContentType;
  dueDate: Date;
  assignedTo: string;
  tagIds: number[];
}

export default function TaskCard({
  id,
  title,
  description,
  clientId,
  status,
  priority,
  contentType,
  dueDate,
  assignedTo,
  tagIds
}: TaskCardProps) {
  const client = getClientById(clientId);
  const ContentTypeIcon = getContentTypeIcon(contentType);
  
  // Format due date
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  }).format(dueDate);
  
  // Check if task is overdue
  const isOverdue = dueDate < new Date() && status !== 'done';
  
  // Calculate remaining days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(dueDate);
  dueDay.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="glass-dark rounded-xl p-4 hover-scale">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: client?.primaryColor }}
          />
          <span className="text-xs text-muted-foreground">{client?.name}</span>
        </div>
        <div className={cn(
          "text-xs px-2 py-0.5 rounded-full font-medium",
          getStatusColor(status)
        )}>
          {status === 'todo' ? 'A fazer' : 
           status === 'doing' ? 'Em andamento' : 
           status === 'review' ? 'Em revisão' : 'Concluído'}
        </div>
      </div>
      
      <h3 className="font-semibold text-base mb-2 line-clamp-1">{title}</h3>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
      
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          "flex items-center text-xs gap-1 px-2 py-0.5 rounded-full font-medium",
          getPriorityColor(priority)
        )}>
          <ContentTypeIcon className="w-3 h-3" />
          <span className="capitalize">{contentType}</span>
        </div>
        
        {isOverdue ? (
          <div className="bg-red-500/20 text-red-200 text-xs px-2 py-0.5 rounded-full font-medium">
            Atrasado
          </div>
        ) : diffDays === 0 ? (
          <div className="bg-orange-500/20 text-orange-200 text-xs px-2 py-0.5 rounded-full font-medium">
            Hoje
          </div>
        ) : diffDays === 1 ? (
          <div className="bg-yellow-500/20 text-yellow-200 text-xs px-2 py-0.5 rounded-full font-medium">
            Amanhã
          </div>
        ) : null}
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tagIds.map(tagId => {
          const tag = getTagById(tagId);
          if (!tag) return null;
          
          return (
            <div 
              key={tagId}
              className="flex items-center text-xs gap-1 px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${tag.color}20`, 
                color: tag.color 
              }}
            >
              <Tag className="w-3 h-3" />
              <span>{tag.name}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-border/20">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {assignedTo.charAt(0)}
          </div>
          <span className="text-xs text-muted-foreground">{assignedTo}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
