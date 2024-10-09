import { Request,Response } from "express";
import { db } from "../../db";

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


  export async function DashboardStats(req:Request,res:Response) {
    const { startDate } = req.query;
    const end = new Date(new Date().setHours(23, 59, 59, 999));
    let start: Date | undefined;
    if (typeof startDate === 'string' && startDate.trim() !== '') {
      start = new Date(startDate);
    } 
    
  try {
    // Fetch users who won as white
    const activeUsers = await db.user.count({
      where:{
        status:'ACTIVE',
        OR:[
          {role:'MODRATOR'},
          {role:'USER'}
        ]
      }
    })
    
    const suspendedUsers = await db.user.count({
      where:{
        status:'SUSPENDED',
      }
    })
    
    
    const moderatorsUsers = await db.user.count({
      where:{
        role:"MODRATOR",
      }
    })

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
        stake:true
      },
    });

    // Fetch users who won as black
    const blackWinners = await db.game.findMany({
      where: {
        result: 'BLACK_WINS',
        status: 'COMPLETED',
        ...(start && {
          startTime: {
            gte: start, 
            lte: end,   
          },
        }),
      },
      select: {
        blackPlayerId: true,
        stake:true
      },
    });
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
    const allWinners = [
      ...whiteWinners,...blackWinners
    ];
    const totalWinners = allWinners.length;
        // Convert stake from string to float and calculate business profits through games 
        const businessProfit =
        [...whiteWinners, ...blackWinners]
          .map(game => parseFloat(game.stake))
          .reduce((acc, stake) => acc + stake * 0.15, 0);
  
    res.json({ totalWinners ,businessProfit,totalGamesPlayed,activeUsers,suspendedUsers,moderatorsUsers});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total winners.' });
  }
  }
