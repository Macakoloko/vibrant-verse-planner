
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardStats, weeklyPerformance } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function PerformanceMetrics() {
  // Calculate percentage for radial progress
  const completionPercentage = dashboardStats.completionRate;
  
  // Calculate circumference and offset for SVG circle
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionPercentage / 100) * circumference;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="glass-dark rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Performance semanal</h3>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyPerformance}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="week" 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(27, 43, 29, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  color: 'white' 
                }}
              />
              <Bar name="Total de tarefas" dataKey="tasks" fill="rgba(67, 96, 81, 0.8)" radius={[4, 4, 0, 0]} />
              <Bar name="Concluídas" dataKey="completed" fill="rgba(255, 241, 228, 0.8)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-dark rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição por tipo</h3>
        <div className="flex items-center justify-center h-[240px]">
          <div className="relative w-[160px] h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardStats.tasksByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {dashboardStats.tasksByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [`${value} tarefas`, props.payload.type]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(27, 43, 29, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    color: 'white' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{dashboardStats.completionRate}%</span>
              <span className="text-xs text-muted-foreground">Concluídas</span>
            </div>
          </div>
          
          <div className="ml-6">
            {dashboardStats.tasksByType.map((type, index) => (
              <div key={index} className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 mr-2 rounded-sm" 
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm capitalize">{type.type}</span>
                <span className="text-sm ml-2 text-muted-foreground">({type.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass-dark rounded-xl p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Visão geral</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">Total de tarefas</h4>
            <p className="text-2xl font-bold">{dashboardStats.totalTasks}</p>
          </div>
          
          <div className="glass p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">Concluídas</h4>
            <p className="text-2xl font-bold">{dashboardStats.completedTasks}</p>
          </div>
          
          <div className="glass p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">Em andamento</h4>
            <p className="text-2xl font-bold">{dashboardStats.inProgressTasks}</p>
          </div>
          
          <div className="glass p-4 rounded-lg">
            <h4 className="text-sm text-muted-foreground mb-1">Clientes ativos</h4>
            <p className="text-2xl font-bold">{dashboardStats.clientsActive}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Top performers</h4>
          <div className="space-y-3">
            {dashboardStats.topPerformers.map((performer, index) => (
              <div key={index} className="glass p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{performer.name}</span>
                  <span className="text-sm text-muted-foreground">{performer.tasks} tarefas</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary animate-pulse-subtle"
                    style={{ width: `${performer.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
