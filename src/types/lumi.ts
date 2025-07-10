export interface LumiMessage {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  error?: string;
}

export interface LumiContext {
  mood?: string;
  timeOfDay?: string;
  currentDate?: string;
  [key: string]: any;
}

export interface LumiMemory {
  id: string;
  userId: string;
  type: 'WORK_CONTEXT' | 'PERSONAL_CONTEXT' | 'EMOTIONAL_STATE' | 'PRODUCTIVITY_INSIGHT';
  content: string;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  tags: string[];
  createdAt: string;
  emotionalContext?: string;
}

export interface LumiAskRequest {
  message: string;
  userId: string;
  context?: LumiContext;
}

export interface LumiAskResponse {
  success: boolean;
  data: {
    message: string;
    context: LumiContext;
    memories?: LumiMemory[];
  };
  error?: string;
}

export interface LumiCreateMemoryRequest {
  userId: string;
  type: LumiMemory['type'];
  content: string;
  importance?: LumiMemory['importance'];
  tags?: string[];
}

export interface LumiGetMemoriesRequest {
  type?: LumiMemory['type'];
  limit?: number;
  offset?: number;
}

export interface LumiStreamChunk {
  chunk: string;
  done: boolean;
}

export interface LumiContextResponse {
  user: {
    id: string;
    name: string;
    preferences: Record<string, any>;
  };
  memories: LumiMemory[];
  currentTasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    priority: string;
  }>;
  recentActivity: Array<{
    type: string;
    timestamp: string;
    description: string;
  }>;
}
