export type Transaction = {
    id: string;
    amount: number;
    createdAt: Date;
    status: string;
    type: string;
    currency: string;
    user: {
      name: string;
      email: string;
      id: string;
    };
  };
  
export type TransactionsListProps = {
    transactions: Transaction[];
  };

 export type Report = {
    id: string;
    title: string;
    description: string;
    user: {
      name: string;
      email: string; 
      id: string;    
        };
    createdAt: string; 
    status: string; 
  };
  
// ReportsList Component
export type ReportsListProps = {
    reports: Report[];
  };

 export interface Player {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
  }
  
 export interface Game {
    id: string;
    areBalancesUpdated: boolean;
    blackPlayer: Player;
    blackPlayerId: string;
    board: string;
    endTime: string;
    gameOutCome: string;
    isFriendly: boolean;
    result: string;
    stake: string;
    startTime: string;
    status: string;
    whitePlayer: Player;
    whitePlayerId: string;
  }
  
  
  // GamesList Component
export  type GamesListProps = {
    games: Game[];
  };
  
 export type user = {
    email: string;
    id: string;
    name: string;
    role: string;
    status: string;
  };
  
export  type usersProps = {
    users: user[];
  };
  