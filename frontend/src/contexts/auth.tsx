import create from "zustand";

type TUser = {
  id: string;
  token: string;
  balance: string;
  rating: number;
  name: string;
  email: string;
};

type State = {
  user: TUser | null;
  isLoading: boolean;
};

type Action = {
  updateUser: (user: State["user"]) => void;
  setIsLoading: (isLoading: boolean) => void;
};

const usePersonStore = create<State & Action>((set) => ({
  user: null,
  isLoading: false, // Initialize isLoading state
  updateUser: (user) => set(() => ({ user })),
  setIsLoading: (isLoading) => set(() => ({ isLoading })), // Action to update isLoading
}));

export default usePersonStore;
