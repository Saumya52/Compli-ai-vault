// Client API utility functions
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ClientData {
  _id?: string;
  name: string;
  type?: string;
  since: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClientData {
  name: string;
  type?: string;
  since: Date;
}

export const createClient = async (clientData: CreateClientData): Promise<ApiResponse<ClientData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/create-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.client,
      message: result.message
    };
  } catch (error) {
    console.error('Create client error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create client'
    };
  }
};

export const getAllClients = async (): Promise<ApiResponse<ClientData[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/get-all-clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.clients || [],
      message: result.message
    };
  } catch (error) {
    console.error('Get all clients error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch clients'
    };
  }
};

export const getClient = async (clientId: string): Promise<ApiResponse<ClientData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/get-client/${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.client,
      message: result.message
    };
  } catch (error) {
    console.error('Get client error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch client'
    };
  }
};

// Transform API client to UI client format
export const transformApiClientToUI = (apiClient: ClientData) => {
  return {
    id: apiClient._id || '',
    name: apiClient.name,
    type: (apiClient.type || 'Pvt Ltd') as 'Pvt Ltd' | 'LLP' | 'OPC' | 'Partnership' | 'Proprietorship',
    status: 'active' as const,
    createdAt: apiClient.since ? new Date(apiClient.since).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    // Add other fields as needed for UI compatibility
    pan: '',
    cin: '',
    gst: '',
    tan: ''
  };
};