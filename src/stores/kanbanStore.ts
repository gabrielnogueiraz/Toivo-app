import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Board, Task, Pomodoro } from '@/types/board';

interface KanbanState {
  // Estado dos boards
  boards: Board[];
  activeBoard: Board | null;
  
  // Estado das tarefas
  activeTasks: Task[];
  
  // Estado do pomodoro
  activePomodoro: Pomodoro | null;
  
  // Estados de UI
  isLoading: boolean;
  error: string | null;
  
  // Ações
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (board: Board | null) => void;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  removeBoard: (id: string) => void;
  
  setActiveTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
  
  setActivePomodoro: (pomodoro: Pomodoro | null) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Ações utilitárias
  reset: () => void;
}

const initialState = {
  boards: [],
  activeBoard: null,
  activeTasks: [],
  activePomodoro: null,
  isLoading: false,
  error: null,
};

export const useKanbanStore = create<KanbanState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Board actions
      setBoards: (boards) => set({ boards }),
      setActiveBoard: (board) => set({ activeBoard: board }),
      addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
      updateBoard: (id, updates) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === id ? { ...board, ...updates } : board
        ),
        activeBoard: state.activeBoard?.id === id 
          ? { ...state.activeBoard, ...updates } 
          : state.activeBoard
      })),
      removeBoard: (id) => set((state) => ({
        boards: state.boards.filter(board => board.id !== id),
        activeBoard: state.activeBoard?.id === id ? null : state.activeBoard
      })),
      
      // Task actions
      setActiveTasks: (tasks) => set({ activeTasks: tasks }),
      addTask: (task) => set((state) => ({ activeTasks: [...state.activeTasks, task] })),
      updateTask: (id, updates) => set((state) => ({
        activeTasks: state.activeTasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      })),
      removeTask: (id) => set((state) => ({
        activeTasks: state.activeTasks.filter(task => task.id !== id)
      })),
      moveTask: (taskId, newColumnId) => set((state) => ({
        activeTasks: state.activeTasks.map(task => 
          task.id === taskId ? { ...task, columnId: newColumnId } : task
        )
      })),
      
      // Pomodoro actions
      setActivePomodoro: (pomodoro) => set({ activePomodoro: pomodoro }),
      
      // UI actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'kanban-store',
    }
  )
);
