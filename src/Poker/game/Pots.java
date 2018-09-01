package Poker.game;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

public class Pots
{
   private List<Pot> potList = new ArrayList<Pot>();
   private int currentPotIndex = 0;
   //private int shortStackOverraise = 0;
   //private int currentRaise = 0;
   
   public Pots(List<Player> players)
   {
      potList.add(new Pot(players));
   }
   
   public Pot getMainPot()
   {
      if (potList.size() == 0)
      {
         return null;
      }
      
      return potList.get(0);
   }
   
   private int getMainPlayersCount()
   {
      Pot main = getMainPot();
      if (main == null)
      {
         return 0;
      }
      return main.getNumPlayers();
   }
   
   private List<Player> getMainPlayers()
   {
      Pot main = getMainPot();
      if (main == null)
      {
         return null;
      }
      return main.getPlayers();
   }
   
   private Player getMainPlayer(int iIndex) throws NoSuchElementException
   {
      int count = getMainPlayersCount();
      if (count == 0 || count <= iIndex)
      {
         return null;
      }
      return getMainPot().getPlayers().get(iIndex);
   }
   
   private boolean hasMainPlayer(Player oPlayer)
   {
      Pot main = getMainPot();
      return main.playerExists(oPlayer);
   }
   
   public Pot getLastPot()
   {
      if (potList.size() == 0)
      {
         return null;
      }
      
      return potList.get(potList.size() - 1);
   }
   
   private Pot getCurrentPot()
   {
      if (currentPotIndex < potList.size())
      {
         return potList.get(currentPotIndex);
      }
      
      return null;
   }
   
   public int getTotalSize()
   {
      int iPotSize = 0;
      for (int i = 0; i < potList.size(); i++)
      {
         iPotSize += potList.get(i).getSize();
      }
      return iPotSize;
   }
   
   public int getCurrentBet()
   {
      int currentBet = 0;
      for (int i = currentPotIndex; i < potList.size(); i++)
      {
         currentBet += potList.get(i).getCurrentBet();
      }
      
      return currentBet;
   }
   
   public boolean isPotEven()
   {
      for (int i = currentPotIndex; i < potList.size(); i++)
      {
         Pot oPot = potList.get(i);
         if (!oPot.isPotEven())
         {
            return false;
         }
      }
      
      return true;
   }
   
   public void clearRound()
   {
      Pot pot = null;
      while ((pot = getCurrentPot()) != null)
      {
         if (pot.isBettingCapped())
         {
            currentPotIndex++;
         }
         else
         {
            break;
         }
      }
      
      pot = getCurrentPot();
      if (pot != null)
      {
         pot.clearRound();
      }
   }
   
   public int foldPlayer(Player player)
   {
      if (player.hasHoleCards())
      {
         player.Fold();
         
         for (Pot pot : potList)
         {
            pot.removePlayer(player);
         }
         
         int currentBet = getCurrentBet();
         
         Player playerMatchingCurrBet = null;
         List<Player> players = getMainPlayers();
         for (Player oPlayer : players)
         {
            if (getChipsThisRoundForPlayer(oPlayer) == currentBet)
            {
               // If we just found a second player matching the current bet, we can exit now
               if (playerMatchingCurrBet != null)
               {
                  return 0;
               }
               playerMatchingCurrBet = oPlayer;
            }
         }
         
         if (playerMatchingCurrBet != null)
         {
            int iThisPotBet = getLastPot().getPlayerRoundCount(playerMatchingCurrBet);
            int iRefund = iThisPotBet;
            for (Player oPlayer : players)
            {
               if (oPlayer.hasHoleCards() && oPlayer != playerMatchingCurrBet)
               {
                  int iPlayerChips = oPlayer.getChips();
                  int iChipsThisRound = getChipsThisRoundForPlayer(oPlayer);
                  int iCurrOwed = currentBet - iChipsThisRound;
                  int iAmountUnder = (iCurrOwed > iPlayerChips ? iCurrOwed - iPlayerChips : 0);
                  iRefund = Math.min(iRefund, iAmountUnder);
               }
            }
            
            if (iRefund > 0)
            {
               if (iRefund == iThisPotBet)
               {
                  return refundDeadPot(playerMatchingCurrBet);
               }
               else
               {
                  playerMatchingCurrBet.changeChips(iRefund);
                  try
                  {
                     getLastPot().sub(iRefund, playerMatchingCurrBet);
                  }
                  catch (Exception x)
                  {
                     System.err.println("ERROR: " + x.getMessage());
                     x.printStackTrace();
                     return 0;
                  }
                  return iRefund;
               }
            }
         }
      }
      
      return 0;
   }
   
   public int getChipsThisRoundForPlayer(Player oPlayer)
   {
      if (!hasMainPlayer(oPlayer))
      {
         return 0;
      }
      
      int iChipsThisRound = 0;
      for (int i = currentPotIndex; i < potList.size(); i++)
      {
         Pot oPot = potList.get(i);
         iChipsThisRound += oPot.getPlayerRoundCount(oPlayer);
      }
      
      return iChipsThisRound;
   }
   
   private int refundDeadPot(Player oPlayerInPot)
   {
      Pot oLastPot = getLastPot();
      if (oLastPot == getMainPot() || oLastPot.isContested())
      {
         return 0;
      }
      int iPotSize = oLastPot.getSize();
      oPlayerInPot.changeChips(iPotSize);
      removePot(oLastPot);
      return iPotSize;
   }
   
   public void addToPot(int iChips, Player oPlayer)
   {
      // TODO: think about where this should be done
      oPlayer.Bet(iChips);
      
      addToPot(iChips, oPlayer, currentPotIndex);
   }
   
   private void addToPot(int iChips, Player oPlayer, int iPotNum)
   {
      try
      {
         Pot pot = potList.get(iPotNum);
         
         int iAmountOwedToCurrentPot = pot.getPlayerRoundOwed(oPlayer);
         
         if (iAmountOwedToCurrentPot == 0 && pot.isBettingCapped())
         {
            addToPot(iChips, oPlayer, iPotNum + 1);
         }
         else
         {
            if (pot.isBettingCapped())
            {
               int iRemaingChips = 0;
               if (iAmountOwedToCurrentPot > iChips)
               {
                  // This player couldn't cover the current bet
                  Pot newPot = pot.add(iChips, oPlayer);
                  if (newPot != null)
                  {
                     potList.add(iPotNum + 1, newPot);
                  }
               }
               else
               {
                  pot.add(iAmountOwedToCurrentPot, oPlayer);
                  iRemaingChips = iChips - iAmountOwedToCurrentPot;
                  
                  if (iRemaingChips > 0)
                  {
                     addToPot(iRemaingChips, oPlayer, iPotNum + 1);
                  }
               }
            }
            else
            {
               // No one in the current pot is all in yet (except possibly this player)
               // Add this player's chips to the current pot; if this player is all in, cap the action, then potentially create
               // a new empty pot and migrate other player's chips into that
               Pot newPot = pot.add(iChips, oPlayer);
               if (newPot != null)
               {
                  potList.add(iPotNum + 1, newPot);
               }
            }
         }
      }
      catch (Exception x)
      {
         System.err.println("ERROR: " + x.getMessage());
         x.printStackTrace();
      }
   }
   
   public Pot awardPot(Card[] aoBoardCards)
   {
      Pot pot = getLastPot();
      awardChips(pot, aoBoardCards);
      return pot;
   }
   
   private void awardChips(Pot oPot, Card[] aoBoardCards)
   {
      ArrayList<Player> oWinners = new ArrayList<Player>();
      oPot.getBestHand(aoBoardCards, oWinners);
      int iNumWinners = oWinners.size();
      int iPotSize = oPot.getSize();
      if (iNumWinners == 1)
      {
         oWinners.get(0).changeChips(iPotSize);
      }
      else
      {
         int iRem = iPotSize % iNumWinners;
         int iChipsPerWinner = iPotSize / iNumWinners;
         for (int i = 0; i < iNumWinners; i++)
         {
            oWinners.get(i).changeChips(iChipsPerWinner);
         }
         if (iRem > 0)
         {
            List<Player> oPlayers = getFirstPlayersInPotByPosition(iRem, oPot);
            for (int i = 0; i < oPlayers.size(); i++)
            {
               oPlayers.get(i).changeChips(1);
            }
         }
      }
      removePot(oPot);
   }
   
   private List<Player> getFirstPlayersInPotByPosition(int iNumPlayersNeeded, Pot oPot)
   {
      if (iNumPlayersNeeded > oPot.getNumPlayers())
      {
         return null;
      }
      
      ArrayList<Player> oPlayers = new ArrayList<Player>();
      int iNumPlayers = getMainPlayersCount();
      int iPlayersFound = 0;
      int i = 0;
      while (i < iNumPlayers)
      {
         Player oPlayer = getMainPlayer(i);
         if (oPot.playerExists(oPlayer))
         {
            oPlayers.add(oPlayer);
            iPlayersFound++;
            if (iPlayersFound == iNumPlayersNeeded)
            {
            	return oPlayers;
            }
         }
         
         i++;
      }
      return null;
   }   
   
   private void removePot(Pot oPot)
   {
      int iPotIndex = potList.indexOf(oPot);
      if (iPotIndex >= 0)
      {
         potList.remove(iPotIndex);
      }
   }
   
   /*public String awardPotString(Card[] aoBoardCards, Pot oPot)
   {
      return oPot.awardPotString(aoBoardCards, getPotName(oPot));
   }
   
   private String getPotName(Pot oPot)
   {
      int iPotNum = m_oPotList.indexOf(oPot);
      return getPotName(iPotNum);
   }*/   

   private static String getPotName(int iPotNum)
   {
      if (iPotNum == 0)
      {
         return "Main Pot";
      }
      else
      {
         return "Side Pot " + iPotNum;
      }
   }   

   public String toString()
   {
      StringBuilder oPotsString = new StringBuilder(getMainPot().toString(getPotName(0)));
      for (int i = 1; i < potList.size(); i++)
      {
         oPotsString.append("   " + potList.get(i).toString(getPotName(i)));
      }
      return oPotsString.toString();
   }
}
