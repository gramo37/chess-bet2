import create from "zustand";

type TUser = {
  balance: string;
  id?: string | undefined;
  token?: string | undefined;
  rating?: number | undefined;
  name?: string | undefined;
  email?: string | undefined;
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
  updateUser: (user) => {
    set({ user: { ...user, balance: user?.balance?.replace("n", "") ?? "" } });
  },
  setIsLoading: (isLoading) => set(() => ({ isLoading })), // Action to update isLoading
}));

export default usePersonStore;
