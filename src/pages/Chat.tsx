
import React, { useState } from 'react';
import { MessageSquare, Users, Briefcase, User, Search, PlusCircle, AtSign, Paperclip, Send, Smile, ChevronDown, Bell, BellOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { clients, users } from '@/lib/data';

type ChatType = 'clients' | 'projects' | 'groups' | 'direct';
type ChatChannel = {
  id: number;
  name: string;
  type: ChatType;
  unreadCount: number;
  isMuted: boolean;
  lastMessage?: string;
  avatar?: string;
};

// Sample chat data
const chatChannels: ChatChannel[] = [
  { id: 1, name: 'Marca X', type: 'clients', unreadCount: 5, isMuted: false, lastMessage: 'Novo briefing disponível', avatar: '/lovable-uploads/94174d70-177d-4594-803f-abf234f836ca.png' },
  { id: 2, name: 'Marca Y', type: 'clients', unreadCount: 0, isMuted: true, lastMessage: 'Aprovado o layout' },
  { id: 3, name: 'Campanha Verão', type: 'projects', unreadCount: 2, isMuted: false, lastMessage: 'Reunião amanhã às 10h' },
  { id: 4, name: 'Lançamento Produto', type: 'projects', unreadCount: 0, isMuted: false, lastMessage: 'Materiais atualizados' },
  { id: 5, name: 'Time de Design', type: 'groups', unreadCount: 8, isMuted: false, lastMessage: 'Nova paleta enviada' },
  { id: 6, name: 'Marketing', type: 'groups', unreadCount: 0, isMuted: true, lastMessage: 'Vamos revisar o cronograma' },
  { id: 7, name: 'João Silva', type: 'direct', unreadCount: 3, isMuted: false, lastMessage: 'Você viu o feedback?', avatar: 'https://ui.shadcn.com/avatars/01.png' },
  { id: 8, name: 'Ana Oliveira', type: 'direct', unreadCount: 0, isMuted: false, lastMessage: 'Enviando as referências', avatar: 'https://ui.shadcn.com/avatars/03.png' },
];

interface ChatMessage {
  id: number;
  userId: number;
  content: string;
  timestamp: Date;
  attachments?: {name: string, type: string, url: string}[];
  reactions?: {emoji: string, count: number}[];
  isThread?: boolean;
  threadId?: number;
}

// Sample message data for the selected channel
const sampleMessages: ChatMessage[] = [
  {
    id: 1,
    userId: 1,
    content: "Pessoal, estou enviando o briefing atualizado da campanha",
    timestamp: new Date(2023, 4, 15, 9, 30),
    attachments: [
      { name: "briefing-campanha.pdf", type: "pdf", url: "#" }
    ]
  },
  {
    id: 2,
    userId: 2,
    content: "Obrigado! Já estou analisando e retorno com dúvidas.",
    timestamp: new Date(2023, 4, 15, 9, 45),
    reactions: [
      { emoji: "👍", count: 2 }
    ]
  },
  {
    id: 3,
    userId: 3,
    content: "Temos alguma referência visual para seguir?",
    timestamp: new Date(2023, 4, 15, 10, 15)
  },
  {
    id: 4,
    userId: 1,
    content: "Sim, estou enviando algumas referências que o cliente gostou",
    timestamp: new Date(2023, 4, 15, 10, 30),
    attachments: [
      { name: "referencia1.jpg", type: "image", url: "#" },
      { name: "referencia2.jpg", type: "image", url: "#" }
    ]
  },
  {
    id: 5,
    userId: 2,
    content: "Precisamos definir a paleta de cores até amanhã. @Ana você pode ajudar com isso?",
    timestamp: new Date(2023, 4, 15, 11, 0),
    reactions: [
      { emoji: "✅", count: 1 }
    ]
  }
];

// Sample users (would come from your user database)
const sampleUsers = [
  { id: 1, name: "Carlos Mendes", avatar: "https://ui.shadcn.com/avatars/04.png" },
  { id: 2, name: "João Silva", avatar: "https://ui.shadcn.com/avatars/01.png" },
  { id: 3, name: "Ana Oliveira", avatar: "https://ui.shadcn.com/avatars/03.png" }
];

export default function Chat() {
  const [activeFilter, setActiveFilter] = useState<ChatType>('clients');
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(chatChannels[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  
  // Filter channels based on active filter and search query
  const filteredChannels = chatChannels.filter(channel => {
    const matchesType = channel.type === activeFilter;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // Format timestamp for messages
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Find user by ID
  const getUserById = (id: number) => {
    return sampleUsers.find(user => user.id === id) || { name: "Usuário", avatar: "" };
  };
  
  // Toggle mute status for a channel
  const toggleMute = (channelId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, you would update the channel's muted status in your state/database
    console.log(`Toggle mute for channel ${channelId}`);
  };
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // In a real app, you would add the new message to your state/database
    console.log(`Sending message: ${message}`);
    setMessage('');
  };
  
  return (
    <div className="h-screen flex">
      {/* Chat Sidebar */}
      <div className="w-[280px] flex-shrink-0 glass-dark border-r border-border/40 flex flex-col">
        <div className="p-4 border-b border-border/40">
          <h2 className="text-lg font-semibold mb-3">Chat</h2>
          
          <div className="flex mb-4">
            <button 
              onClick={() => setActiveFilter('clients')}
              className={`flex-1 py-2 text-sm flex justify-center items-center gap-1 rounded-l-lg ${activeFilter === 'clients' ? 'bg-primary text-primary-foreground' : 'bg-muted/20 hover:bg-muted/30'}`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Clientes</span>
            </button>
            <button 
              onClick={() => setActiveFilter('projects')}
              className={`flex-1 py-2 text-sm flex justify-center items-center gap-1 ${activeFilter === 'projects' ? 'bg-primary text-primary-foreground' : 'bg-muted/20 hover:bg-muted/30'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Projetos</span>
            </button>
            <button 
              onClick={() => setActiveFilter('groups')}
              className={`flex-1 py-2 text-sm flex justify-center items-center gap-1 ${activeFilter === 'groups' ? 'bg-primary text-primary-foreground' : 'bg-muted/20 hover:bg-muted/30'}`}
            >
              <Users className="w-4 h-4" />
              <span>Grupos</span>
            </button>
            <button 
              onClick={() => setActiveFilter('direct')}
              className={`flex-1 py-2 text-sm flex justify-center items-center gap-1 rounded-r-lg ${activeFilter === 'direct' ? 'bg-primary text-primary-foreground' : 'bg-muted/20 hover:bg-muted/30'}`}
            >
              <User className="w-4 h-4" />
              <span>DMs</span>
            </button>
          </div>
          
          <div className="flex items-center px-3 py-2 bg-background/20 rounded-lg w-full">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Buscar canais..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-2">
          <div className="flex justify-between items-center p-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {activeFilter === 'clients' ? 'Clientes' : 
               activeFilter === 'projects' ? 'Projetos' : 
               activeFilter === 'groups' ? 'Grupos' : 'Mensagens Diretas'}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-md hover:bg-muted/20">
                    <PlusCircle className="w-4 h-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Criar novo {activeFilter === 'clients' ? 'cliente' : 
                    activeFilter === 'projects' ? 'projeto' : 
                    activeFilter === 'groups' ? 'grupo' : 'mensagem direta'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-1 mt-2">
            {filteredChannels.map(channel => (
              <div 
                key={channel.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer
                           ${selectedChannel?.id === channel.id ? 'bg-primary/20' : 'hover:bg-muted/20'}`}
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={channel.avatar} />
                    <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium flex items-center">
                      {channel.name}
                      {channel.isMuted && <BellOff className="ml-1 w-3 h-3 text-muted-foreground" />}
                    </div>
                    {channel.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate w-36">{channel.lastMessage}</p>
                    )}
                  </div>
                </div>
                
                {channel.unreadCount > 0 && (
                  <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                    {channel.unreadCount}
                  </Badge>
                )}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild onClick={(e) => toggleMute(channel.id, e)}>
                      <button className="ml-1 p-1 opacity-0 hover:opacity-100 group-hover:opacity-100 rounded-md hover:bg-muted/20">
                        {channel.isMuted ? 
                          <Bell className="w-3 h-3 text-muted-foreground" /> : 
                          <BellOff className="w-3 h-3 text-muted-foreground" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{channel.isMuted ? 'Ativar notificações' : 'Silenciar notificações'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
            
            {filteredChannels.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">Nenhum canal encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Content */}
      {selectedChannel ? (
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={selectedChannel.avatar} />
                <AvatarFallback>{selectedChannel.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-medium">{selectedChannel.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {activeFilter === 'clients' ? 'Canal do cliente' : 
                   activeFilter === 'projects' ? 'Canal do projeto' : 
                   activeFilter === 'groups' ? 'Canal do grupo' : 'Mensagem direta'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 rounded-lg hover:bg-muted/20">
                      <Search className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Buscar neste canal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild onClick={(e) => toggleMute(selectedChannel.id, e)}>
                    <button className="p-2 rounded-lg hover:bg-muted/20">
                      {selectedChannel.isMuted ? 
                        <Bell className="w-4 h-4" /> : 
                        <BellOff className="w-4 h-4" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{selectedChannel.isMuted ? 'Ativar notificações' : 'Silenciar notificações'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {sampleMessages.map(message => {
              const user = getUserById(message.userId);
              return (
                <div key={message.id} className="flex items-start group">
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                      
                      <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm mt-1">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="glass py-1 px-2 rounded-md flex items-center text-xs">
                            <Paperclip className="w-3 h-3 mr-1" />
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.reactions.map((reaction, index) => (
                          <div key={index} className="bg-muted/30 py-0.5 px-2 rounded-full flex items-center text-xs">
                            <span className="mr-1">{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="rounded-lg glass-dark border border-border/40 p-2">
              <div className="flex items-center mb-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <AtSign className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-right">
                  <span className="text-xs text-muted-foreground">Digite / para comandos</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <textarea 
                  className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-10 text-sm placeholder:text-muted-foreground"
                  placeholder={`Mensagem para ${selectedChannel.name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                />
                
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium">Selecione um canal para começar</h2>
            <p className="text-muted-foreground mt-2">Escolha um canal na barra lateral para iniciar uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
}
