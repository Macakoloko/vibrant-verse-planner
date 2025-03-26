
import React from 'react';
import CalendarView from '@/components/CalendarView';
import { calendarEvents } from '@/lib/data';
import { ListFilter, Grid, List, Plus } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calendário</h1>
          <p className="text-muted-foreground mt-1">Planejamento e visualização de conteúdo</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass rounded-lg flex p-1">
            <button className="p-2 rounded-lg bg-primary/20">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted/20 transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button className="glass px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-muted/20 transition-colors">
            <ListFilter className="w-4 h-4" />
            <span>Filtrar</span>
          </button>
          
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Novo post</span>
          </button>
        </div>
      </div>
      
      <CalendarView />
    </div>
  );
}
