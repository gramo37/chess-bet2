import { Request,Response } from "express";
import { db } from "../../db";


export async function DailyGames(req:Request,res:Response){
  const { startDate } = req.query;
  let start: Date | undefined;
  if (typeof startDate === 'string' && startDate.trim() !== '') {
    start = new Date(startDate);
  } 

  const end = new Date(new Date().setHours(23, 59, 59, 999));
    try {
        const totalGamesPlayed = await db.game.count({
          where: {
            status: 'COMPLETED',
            ...(start && {
              startTime: {
                gte: start, 
                lte: end,   
              },
            }),
          }
        });
        res.json({ totalGamesPlayed });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching daily games count.' });
      }
}

export async function UserProfits(req:Request,res:Response) {
    const { id } = req.params;

    try {
      const whiteWins = await db.game.findMany({
        where: {
          whitePlayerId: id,
          result: 'WHITE_WINS',
          status: 'COMPLETED',
        },
        select: {
          stake: true,
        },
      });
  
      const blackWins = await db.game.findMany({
        where: {
          blackPlayerId: id,
          result: 'BLACK_WINS',
          status: 'COMPLETED',
        },
        select: {
          stake: true,
        },
      });
  
      // Convert stake from string to float and calculate total earnings
      const totalEarnings =
        [...whiteWins, ...blackWins]
          .map(game => parseFloat(game.stake))
          .reduce((acc, stake) => acc + stake * 0.85, 0);
  
      res.json({ totalEarnings });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user profits.' });
    }
}

export async function BussinesProfits(req:Request,res:Response) {
    const { startDate } = req.query; // Optional start date query parameter
    let start: Date | undefined;
  if (typeof startDate === 'string' && startDate.trim() !== '') {
    start = new Date(startDate);
  } 
    const end = new Date(new Date().setHours(23, 59, 59, 999));

    try {
      const whiteWins = await db.game.findMany({
        where: {
          result: 'WHITE_WINS',
          status: 'COMPLETED',
          ...(start && {
            startTime: {
              gte: start, // Greater than or equal to start date if start is provided
              lte: end,   // Less than or equal to the end of today
            },
          }),
        },
        select: {
          stake: true,
        },
      });
  
      const blackWins = await db.game.findMany({
        where: {
          result: 'BLACK_WINS',
          status: 'COMPLETED',

        },
        select: {
          stake: true,
        },
      });
  
      // Convert stake from string to float and calculate business profits
      const businessProfit =
        [...whiteWins, ...blackWins]
          .map(game => parseFloat(game.stake))
          .reduce((acc, stake) => acc + stake * 0.15, 0);
  
      res.json({ businessProfit });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching business profits.' });
    }
    }

  export  async function UsersWinLoss(req:Request,res:Response) {
    const { startDate } = req.query;
    const end = new Date(new Date().setHours(23, 59, 59, 999));
    let start: Date | undefined;
    if (typeof startDate === 'string' && startDate.trim() !== '') {
      start = new Date(startDate);
    } 
    
  try {
    // Fetch users who won as white
    const whiteWinners = await db.game.findMany({
      where: {
        result: 'WHITE_WINS',
        status: 'COMPLETED',
        ...(start && {
          startTime: {
            gte: start, // Greater than or equal to start date if start is provided
            lte: end,   // Less than or equal to the end of today
          },
        }),
      },
      select: {
        whitePlayerId: true,
      },
    });

    // Fetch users who won as black
    const blackWinners = await db.game.findMany({
      where: {
        result: 'BLACK_WINS',
        status: 'COMPLETED',
       
      },
      select: {
        blackPlayerId: true,
      },
    });

    // Combine and filter unique winners
    const allWinners = [
      ...whiteWinners,...blackWinners
    ];

    // Send response with the total number of unique winners
    res.json({ totalWinners: allWinners.length });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total winners.' });
  }
  }

