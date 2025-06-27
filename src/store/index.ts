import { create } from 'zustand'

// Base store interface
interface BaseStore {
  // Add common state here
}

// Create the base store
export const useStore = create<BaseStore>()((set) => ({
  // Add common actions here
}))
