import create from "zustand";

type TUser = {
  balance: string;
  id?: string | undefined;
  token?: string | undefined;
  rating?: number | undefined;
  name?: string | undefined;
  email?: string | undefined;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
};

type Game = {
  id: string;
  whitePlayerId: string;
  blackPlayerId: string;
  whitePlayer:{id:string,name:string};
  blackPlayer:{id:string,name:string};
  status: string;
  result: string;
  startTime: string;
  endTime?: string;
  stake: string;
  isFriendly: boolean;
};

type State = {
  user: TUser | null;
  isLoading: boolean;
  transactions: Transaction[] | null;
  games: Game[] | null;
};

type Action = {
  updateUser: (user: State["user"]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setGames: (games: Game[]) => void;
};

const usePersonStore = create<State & Action>((set) => ({
  user: null,
  isLoading: false, 
  transactions: null,
  games: null,
  
  updateUser: (user) => {
    set({ user: { ...user, balance: user?.balance ?? "" } });
  },
  
  setIsLoading: (isLoading) => set(() => ({ isLoading })), 
  
  setTransactions: (transactions) => set(() => ({ transactions })),
  
  setGames: (games) => set(() => ({ games })), 
}));

export default usePersonStore;
