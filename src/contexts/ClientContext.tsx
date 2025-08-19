import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
  id: string;
  name: string;
  type: 'Pvt Ltd' | 'LLP' | 'OPC' | 'Partnership' | 'Proprietorship';
  pan?: string;
  cin?: string;
  gst?: string;
  tan?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  logo?: string;
}

interface ClientContextType {
  clients: Client[];
  currentClient: Client | null;
  setCurrentClient: (client: Client | null) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  isLoading: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};

// Mock data for initial clients
const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Solutions Pvt Ltd',
    type: 'Pvt Ltd',
    pan: 'ABCTY1234D',
    cin: 'U72900DL2020PTC123456',
    gst: '07ABCTY1234D1Z5',
    tan: 'DELR12345F',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2', 
    name: 'InnovateTech LLP',
    type: 'LLP',
    pan: 'AABCI9999C',
    gst: '27AABCI9999C1ZX',
    status: 'active',
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    name: 'StartupVenture OPC',
    type: 'OPC',
    pan: 'DEFGH5678K',
    cin: 'U74999MH2023OPC123789',
    status: 'active', 
    createdAt: '2024-03-05',
  }
];

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and set first client as default
    const timer = setTimeout(() => {
      if (clients.length > 0 && !currentClient) {
        setCurrentClient(clients[0]);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [clients, currentClient]);

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
    
    // Update current client if it's the one being updated
    if (currentClient?.id === id) {
      setCurrentClient(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    
    // Reset current client if it's the one being deleted
    if (currentClient?.id === id) {
      setCurrentClient(clients.length > 1 ? clients.find(c => c.id !== id) || null : null);
    }
  };

  return (
    <ClientContext.Provider value={{
      clients,
      currentClient,
      setCurrentClient,
      addClient,
      updateClient,
      deleteClient,
      isLoading
    }}>
      {children}
    </ClientContext.Provider>
  );
};