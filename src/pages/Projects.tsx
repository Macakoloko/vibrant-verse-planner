import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, ChevronDown, Search, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { tasks as initialTasks, clients, TaskStatus, getClientById, getTagById, getPriorityColor } from '@/lib/data';
import { cn } from '@/lib/utils';

interface KanbanColumn {
  id: TaskStatus | string;
  title: string;
  taskIds: number[];
  color: string;
}

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'todo', title: 'A fazer', taskIds: tasks.filter(task => task.status === 'todo').map(task => task.id), color: '#6B7280' },
    { id: 'doing', title: 'Em andamento', taskIds: tasks.filter(task => task.status === 'doing').map(task => task.id), color: '#3B82F6' },
    { id: 'review', title: 'Em revisão', taskIds: tasks.filter(task => task.status === 'review').map(task => task.id), color: '#F59E0B' },
    { id: 'done', title: 'Concluído', taskIds: tasks.filter(task => task.status === 'done').map(task => task.id), color: '#10B981' },
  ]);
  
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (getClientById(task.clientId)?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside of a droppable area
    if (!destination) return;
    
    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Find source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    // Create new arrays for updated columns
    const newColumns = [...columns];
    
    // Get the task id that's being moved
    const taskId = parseInt(draggableId);
    
    // Remove from source column
    const sourceColumnIndex = newColumns.findIndex(col => col.id === source.droppableId);
    newColumns[sourceColumnIndex] = {
      ...sourceColumn,
      taskIds: sourceColumn.taskIds.filter(id => id !== taskId)
    };
    
    // Add to destination column
    const destColumnIndex = newColumns.findIndex(col => col.id === destination.droppableId);
    const newTaskIds = [...destColumn.taskIds];
    newTaskIds.splice(destination.index, 0, taskId);
    newColumns[destColumnIndex] = {
      ...destColumn,
      taskIds: newTaskIds
    };
    
    // Update task status in our tasks state
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        // Convert the destination column id to a TaskStatus if it's one of our standard statuses
        let newStatus: TaskStatus = task.status;
        if (destination.droppableId === 'todo' || 
            destination.droppableId === 'doing' || 
            destination.droppableId === 'review' || 
            destination.droppableId === 'done') {
          newStatus = destination.droppableId as TaskStatus;
        }
        
        return {
          ...task,
          status: newStatus
        };
      }
      return task;
    });
    
    // Update our state
    setTasks(updatedTasks);
    setColumns(newColumns);
    
    console.log(`Task ${taskId} moved from ${source.droppableId} to ${destination.droppableId}`);
  };
  
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    
    const newColumnId = `column-${Date.now()}`;
    setColumns([
      ...columns,
      { 
        id: newColumnId, 
        title: newColumnTitle, 
        taskIds: [], 
        color: '#6B7280' // Default color
      }
    ]);
    
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };
  
  const handleQuickAddTask = (columnId: string) => {
    console.log(`Quick add task to column ${columnId}`);
    // In a real application, you would open a modal or form to add a task
  };
  
  return (
    <div className="p-6 animate-fade-in h-screen overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas tarefas com arrastar e soltar</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass flex items-center px-3 py-2 rounded-lg w-[200px] sm:w-[250px]">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Buscar tarefas..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova tarefa</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full pb-4">
            {columns.map(column => (
              <div key={column.id} className="glass-dark rounded-xl flex-shrink-0 w-80">
                <div className="p-4 border-b border-border/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="font-medium">{column.title}</h3>
                      <span className="text-sm text-muted-foreground">({column.taskIds.length})</span>
                    </div>
                    
                    <button 
                      className="p-1 rounded-lg hover:bg-muted/20 transition-colors"
                      onClick={() => handleQuickAddTask(column.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "p-3 min-h-[calc(100vh-230px)] overflow-y-auto",
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      )}
                    >
                      {column.taskIds.map((taskId, index) => {
                        const task = filteredTasks.find(t => t.id === taskId);
                        if (!task) return null;
                        
                        const client = getClientById(task.clientId);
                        const isExpanded = expandedTaskId === task.id;
                        
                        return (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "glass-dark rounded-xl p-4 mb-3 cursor-grab transition-all duration-200",
                                  snapshot.isDragging ? "shadow-lg scale-[1.02]" : "hover-scale",
                                  isExpanded ? "my-4" : ""
                                )}
                                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                              >
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
                                    getPriorityColor(task.priority)
                                  )}>
                                    {task.priority === 'low' ? 'Baixa' : 
                                     task.priority === 'medium' ? 'Média' : 
                                     task.priority === 'high' ? 'Alta' : 'Urgente'}
                                  </div>
                                </div>
                                
                                <h3 className="font-semibold text-base mb-2">{task.title}</h3>
                                
                                {!isExpanded && (
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                                )}
                                
                                {isExpanded && (
                                  <div className="my-3 bg-card/40 p-3 rounded-md">
                                    <p className="text-sm text-foreground mb-3">{task.description}</p>
                                    
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                      {task.tagIds.map(tagId => {
                                        const tag = getTagById(tagId);
                                        if (!tag) return null;
                                        
                                        return (
                                          <Badge 
                                            key={tagId}
                                            variant="outline"
                                            className="flex items-center text-xs gap-1 px-2"
                                            style={{ 
                                              backgroundColor: `${tag.color}20`, 
                                              color: tag.color,
                                              borderColor: `${tag.color}40`
                                            }}
                                          >
                                            {tag.name}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                    
                                    {task.comments && task.comments.length > 0 && (
                                      <div className="space-y-2 mb-3">
                                        <h4 className="text-xs font-medium text-muted-foreground">COMENTÁRIOS</h4>
                                        {task.comments.map((comment, idx) => (
                                          <div key={idx} className="glass p-2 rounded-md text-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                              <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                {comment.user.charAt(0)}
                                              </div>
                                              <span className="font-medium">{comment.user}</span>
                                              <span className="text-muted-foreground text-[10px]">
                                                {new Date(comment.timestamp).toLocaleDateString('pt-BR')}
                                              </span>
                                            </div>
                                            <p>{comment.message}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    <div className="glass text-xs p-2 rounded-md flex items-center">
                                      <input 
                                        type="text" 
                                        placeholder="Adicionar comentário..." 
                                        className="bg-transparent border-none outline-none w-full"
                                      />
                                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-primary" />
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex justify-between items-center">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {task.assignedTo.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                      
                      <button 
                        className="w-full p-2 border border-dashed border-border/40 rounded-lg text-sm text-muted-foreground hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 mt-2"
                        onClick={() => handleQuickAddTask(column.id)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tarefa Rápida</span>
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
            
            {isAddingColumn ? (
              <div className="glass-dark rounded-xl flex-shrink-0 w-80 p-4">
                <input
                  type="text"
                  className="w-full glass p-2 rounded-md text-sm mb-3"
                  placeholder="Nome da coluna..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    onClick={handleAddColumn}
                  >
                    Adicionar
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnTitle('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <button 
                className="flex-shrink-0 h-20 w-80 glass-dark rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
                onClick={() => setIsAddingColumn(true)}
              >
                <Plus className="w-5 h-5" />
                <span>Nova Coluna</span>
              </button>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
