import create from "zustand";

type TUser = {
  balance?: string | undefined;
  id?: string | undefined;
  token?: string | undefined;
  rating?: number | undefined;
  name?: string | undefined;
  email?: string | undefined;
  role?: string | undefined;
  totalEarnings?: string | undefined;
};

type Transaction = {
  id: string;
  amount: number;
  currency: number;
  finalamountInUSD: number;
  type: string;
  status: string;
  createdAt: string;
};

type Game = {
  id: string;
  whitePlayerId: string;
  blackPlayerId: string;
  whitePlayer: { id: string; name: string };
  blackPlayer: { id: string; name: string };
  status: string;
  result: string;
  startTime: string;
  endTime?: string;
  stake: string;
  isFriendly: boolean;
};

type State = {
  user: TUser | null;
  transactions: Transaction[] | null;
  games: Game[] | null;
};

type Action = {
  updateUser: (user: State["user"]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setGames: (games: Game[]) => void;
};

const usePersonStore = create<State & Action>((set) => ({
  user: null,
  isLoading: false,
  transactions: null,
  games: null,

  updateUser: (user) => {
    if (user?.balance) set({ user: { ...user, balance: user?.balance } });
    else set({ user });
  },

  setTransactions: (transactions) => set(() => ({ transactions })),

  setGames: (games) => set(() => ({ games })),
}));

export default usePersonStore;
