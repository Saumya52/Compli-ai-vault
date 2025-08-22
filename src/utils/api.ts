// API utility functions
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TaskUploadData {
  status: string;
  name: string;
  description: string;
  priority: string;
  assignedTo: string;
  entity: string;
  bucket: string;
  dueDate: number; // Excel date serial number
  recurringFrequency: string;
  tags: string;
  estimatedHours: number;
  closureRightsEmail: string;
}

export const uploadTasksCSV = async (file: File): Promise<ApiResponse<TaskUploadData[]>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/tasks/upload-tasks`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result,
      message: result.message
    };
  } catch (error) {
    console.error('CSV upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

export const createTask = async (taskData: any): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/create-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result,
      message: result.message
    };
  } catch (error) {
    console.error('Task creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Task creation failed'
    };
  }
};

export const reassignTask = async (taskId: string, assigneeData: any): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/reassign-task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assigneeData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result,
      message: result.message
    };
  } catch (error) {
    console.error('Task reassignment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Task reassignment failed'
    };
  }
};

// Utility function to convert Excel date serial number to JavaScript Date
export const excelDateToJSDate = (excelDate: number): Date => {
  if (excelDate <= 0) {
    return new Date(); // Return current date for invalid values
  }
  
  // Excel date serial number starts from January 1, 1900
  // Excel incorrectly treats 1900 as a leap year, so we need to adjust
  const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
  const msPerDay = 24 * 60 * 60 * 1000;
  
  return new Date(excelEpoch.getTime() + excelDate * msPerDay);
};

// Utility function to transform uploaded task data
export const transformUploadedTaskForAPI = (uploadedTask: TaskUploadData) => {
  return {
    title: uploadedTask.name,
    description: uploadedTask.description,
    status: uploadedTask.status.replace(' ', '_'), // Convert "in progress" to "in_progress"
    priority: uploadedTask.priority,
    assignedTo: uploadedTask.assignedTo,
    dueDate: uploadedTask.dueDate ? excelDateToJSDate(uploadedTask.dueDate) : new Date(),
    bucket: uploadedTask.bucket,
    frequency: uploadedTask.recurringFrequency || 'one-time',
    entity: uploadedTask.entity,
    tags: uploadedTask.tags ? uploadedTask.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    estimatedHours: uploadedTask.estimatedHours || 0,
    closureRightsEmail: uploadedTask.closureRightsEmail || ''
  };
};

// Keep the old function for UI display purposes
export const transformUploadedTask = (uploadedTask: TaskUploadData) => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: uploadedTask.name,
    description: uploadedTask.description,
    status: uploadedTask.status.replace(' ', '_'), // Convert "in progress" to "in_progress"
    priority: uploadedTask.priority,
    assignee: uploadedTask.assignedTo,
    assigneeName: uploadedTask.assignedTo,
    dueDate: uploadedTask.dueDate ? excelDateToJSDate(uploadedTask.dueDate) : new Date(),
    createdDate: new Date(),
    bucket: uploadedTask.bucket,
    frequency: uploadedTask.recurringFrequency || 'one-time',
    entity: uploadedTask.entity,
    tags: uploadedTask.tags ? uploadedTask.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    dependencies: [],
    hasDocumentsPending: false,
    hasValidationIssues: false,
    estimatedHours: uploadedTask.estimatedHours || 0,
    completedHours: 0,
    lastUpdated: new Date(),
    aiSuggestions: [],
    closureRightsEmail: uploadedTask.closureRightsEmail || ''
  };
};

export const uploadTaskDocument = async (taskId: string, file: File, documentType?: string): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);
    if (documentType) {
      formData.append('documentType', documentType);
    }

    const response = await fetch(`${API_BASE_URL}/tasks/upload-task-doc`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.doc || result.data || result,
      message: result.message
    };
  } catch (error) {
    console.error('Document upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Document upload failed'
    };
  }
};

export const getTaskComments = async (taskId: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
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
      data: result.comments || result.data || [],
      message: result.message
    };
  } catch (error) {
    console.error('Get comments error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch comments'
    };
  }
};

export const addTaskComment = async (taskId: string, commentData: {
  content: string;
  userId: string;
  userName: string;
}): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result,
      message: result.message
    };
  } catch (error) {
    console.error('Add comment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add comment'
    };
  }
};

export const getTaskDocuments = async (taskId: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/documents`, {
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
      data: result.documents || result.data || [],
      message: result.message
    };
  } catch (error) {
    console.error('Get documents error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch documents'
    };
  }
};
export const getAllTasks = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/get-all-tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      data: result.tasks || [], // ✅ directly unwrap tasks array
      message: result.message,
    };
  } catch (error) {
    console.error("Get all tasks error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch tasks",
    };
  }
};
