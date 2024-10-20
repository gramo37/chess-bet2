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
  emailVerified?:string | undefined;
  referralId?:string | undefined
};

export type Transaction = {
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

type ChatStore = {
  isChatVisible: boolean;
  isTawkLoaded: boolean,
  setTawkLoaded: (visible: boolean) => void;
  toggleChat: () => void;
  setChatVisibility: (visible: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isChatVisible: true,
  isTawkLoaded: false,
  setTawkLoaded:(visible:boolean)=>set({isTawkLoaded:visible}),
  toggleChat: () => set((state) => ({ isChatVisible: !state.isChatVisible })),
  setChatVisibility: (visible: boolean) => set({ isChatVisible: visible }),
}));

export default usePersonStore;
