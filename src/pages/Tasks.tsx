
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from '@/components/TaskCard';
import { tasks as initialTasks, clients, TaskStatus, getPriorityColor, getStatusColor } from '@/lib/data';
import { Filter, Plus, Search, ChevronDown } from 'lucide-react';

export default function Tasks() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [tasks, setTasks] = useState(initialTasks);
  
  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    let matchesClient = true;
    let matchesStatus = true;
    
    if (selectedClient !== null) {
      matchesClient = task.clientId === selectedClient;
    }
    
    if (selectedStatus !== null) {
      matchesStatus = task.status === selectedStatus;
    }
    
    return matchesClient && matchesStatus;
  });
  
  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    doing: filteredTasks.filter(task => task.status === 'doing'),
    review: filteredTasks.filter(task => task.status === 'review'),
    done: filteredTasks.filter(task => task.status === 'done')
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item was dropped in the same place, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Get the task ID and convert to number
    const taskId = parseInt(draggableId);
    
    // Find the task
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    // Update task status based on destination column
    const newStatus = destination.droppableId as TaskStatus;
    
    // Create a new tasks array with the updated task
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus
        };
      }
      return task;
    });
    
    // Update state
    setTasks(updatedTasks);
    console.log(`Task ${taskId} moved from ${source.droppableId} to ${destination.droppableId}`);
  };
  
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground mt-1">Gerencie e organize as demandas de conteúdo</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass flex items-center px-3 py-2 rounded-lg w-[200px]">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Buscar tarefas..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="relative">
            <button 
              className={`
                px-3 py-2 rounded-lg flex items-center gap-2 
                ${activeFilter === 'client' ? 'bg-primary/20' : 'glass'}
              `}
              onClick={() => setActiveFilter(activeFilter === 'client' ? null : 'client')}
            >
              <span>Cliente</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeFilter === 'client' && (
              <div className="absolute top-full mt-1 right-0 z-10 glass-dark border border-border/40 rounded-lg p-2 w-[200px]">
                <div 
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer mb-1
                    ${selectedClient === null ? 'bg-primary/20' : 'hover:bg-muted/20'}
                  `}
                  onClick={() => setSelectedClient(null)}
                >
                  Todos os clientes
                </div>
                
                {clients.map(client => (
                  <div 
                    key={client.id} 
                    className={`
                      px-3 py-2 text-sm rounded-md cursor-pointer flex items-center gap-2
                      ${selectedClient === client.id ? 'bg-primary/20' : 'hover:bg-muted/20'}
                    `}
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: client.primaryColor }}
                    />
                    <span>{client.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              className={`
                px-3 py-2 rounded-lg flex items-center gap-2 
                ${activeFilter === 'status' ? 'bg-primary/20' : 'glass'}
              `}
              onClick={() => setActiveFilter(activeFilter === 'status' ? null : 'status')}
            >
              <span>Status</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeFilter === 'status' && (
              <div className="absolute top-full mt-1 right-0 z-10 glass-dark border border-border/40 rounded-lg p-2 w-[200px]">
                <div 
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer mb-1
                    ${selectedStatus === null ? 'bg-primary/20' : 'hover:bg-muted/20'}
                  `}
                  onClick={() => setSelectedStatus(null)}
                >
                  Todos os status
                </div>
                
                {(['todo', 'doing', 'review', 'done'] as TaskStatus[]).map(status => (
                  <div 
                    key={status} 
                    className={`
                      px-3 py-2 text-sm rounded-md cursor-pointer flex items-center gap-2
                      ${selectedStatus === status ? 'bg-primary/20' : 'hover:bg-muted/20'}
                    `}
                    onClick={() => setSelectedStatus(status)}
                  >
                    <div className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(status)}`}>
                      {status === 'todo' ? 'A fazer' : 
                       status === 'doing' ? 'Em andamento' : 
                       status === 'review' ? 'Em revisão' : 'Concluído'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nova tarefa</span>
          </button>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <h3 className="font-medium">A Fazer</h3>
                <span className="text-sm text-muted-foreground">({tasksByStatus.todo.length})</span>
              </div>
              
              <button className="p-1 rounded-lg hover:bg-muted/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <Droppable droppableId="todo">
              {(provided) => (
                <div 
                  className="space-y-3 min-h-[50px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasksByStatus.todo.map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard {...task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {tasksByStatus.todo.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nenhuma tarefa neste status</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
          
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <h3 className="font-medium">Em Andamento</h3>
                <span className="text-sm text-muted-foreground">({tasksByStatus.doing.length})</span>
              </div>
              
              <button className="p-1 rounded-lg hover:bg-muted/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <Droppable droppableId="doing">
              {(provided) => (
                <div 
                  className="space-y-3 min-h-[50px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasksByStatus.doing.map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard {...task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {tasksByStatus.doing.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nenhuma tarefa neste status</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
          
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <h3 className="font-medium">Em Revisão</h3>
                <span className="text-sm text-muted-foreground">({tasksByStatus.review.length})</span>
              </div>
              
              <button className="p-1 rounded-lg hover:bg-muted/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <Droppable droppableId="review">
              {(provided) => (
                <div 
                  className="space-y-3 min-h-[50px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasksByStatus.review.map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard {...task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {tasksByStatus.review.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nenhuma tarefa neste status</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
          
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h3 className="font-medium">Concluído</h3>
                <span className="text-sm text-muted-foreground">({tasksByStatus.done.length})</span>
              </div>
              
              <button className="p-1 rounded-lg hover:bg-muted/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <Droppable droppableId="done">
              {(provided) => (
                <div 
                  className="space-y-3 min-h-[50px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasksByStatus.done.map((task, index) => (
                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard {...task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {tasksByStatus.done.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nenhuma tarefa neste status</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
