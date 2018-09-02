package Poker.game;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import Poker.game.HoldEmState;

public class Pots
{
   private List<Pot> potList = new ArrayList<Pot>();
   private int currentPotIndex = 0;
   private int currentRaise = 0;
   private int shortStackOverraise = 0;
   private int actionIndex = 0;
   private boolean bettingOver;
   private boolean gotSmallBlind;
   private boolean gotBigBlind;
   //private Player lastAggressor; // TODO: figure this out
   private int bigBlind;
   private HoldEmState state;
   
   public Pots(List<Player> players, int bigBlind, HoldEmState state)
   {
      potList.add(new Pot(players));
      this.bigBlind = bigBlind;
      
      startRound(state);
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
   
   private Player getMainPlayer(int index) throws NoSuchElementException
   {
      int count = getMainPlayersCount();
      if (count == 0 || count <= index)
      {
         return null;
      }
      return getMainPot().getPlayers().get(index);
   }
   
   public Player getNextActionPlayer()
   {
      int startingIndex = actionIndex;
      Pot currentPot = getCurrentPot();
      while (true)
      {
         Player player = currentPot.getPlayer(actionIndex);
         if (player.getChips() > 0)
         {
            return player;
         }
         
         moveActionIndex();
         if (actionIndex == startingIndex)
         {
            return null;
         }
      }
   }
   
   private void moveActionIndex()
   {
      actionIndex = (actionIndex + 1) % getCurrentPot().getNumPlayers();
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
      boolean bettingEven = true;
      switch (state)
      {
         case BLINDS:
            return gotSmallBlind && gotBigBlind;
         default:
            for (int i = currentPotIndex; i < potList.size(); i++)
            {
               Pot oPot = potList.get(i);
               if (!oPot.isPotEven())
               {
                  bettingEven = false;
               }
            }
      }
      
      return bettingEven && bettingOver;
   }
   
   private int getBigBlind()
   {
      return bigBlind;
   }
   
   private int getSmallBlind()
   {
      return bigBlind / 2;
   }
   
   public void startRound(HoldEmState state)
   {
      this.state = state;
      
      if (state != HoldEmState.BET_PREFLOP)
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
         
         if (pot != null)
         {
            pot.clearRound();
         }
         
         actionIndex = 0;
      }
      
      bettingOver = getCurrentPot() == null;
      
      currentRaise = bigBlind;
      shortStackOverraise = 0;
   }
   
   public int fold() throws Exception
   {
      Player player = getNextActionPlayer();
      if (player == null)
      {
         throw new Exception("Tried to fold with no action player");
      }
      
      int ret = fold(player);
      
      // actionIndex should always point to a valid index within the current pot
      // If we remove the last player, this will reset the index back to 0 instead of leaving it pointing to nothing
      actionIndex = actionIndex % getCurrentPot().getNumPlayers();
      
      return ret;
   }
   
   public int fold(Player player)
   {
      if (player.hasHoleCards())
      {
         player.Fold();
         
         for (Pot pot : potList)
         {
            pot.fold(player);
         }
         
         return refundIncontestableBet();
      }
      
      return 0;
   }
   
   public int getChipsThisRound(Player player)
   {
      int chipsThisRound = 0;
      for (int i = currentPotIndex; i < potList.size(); i++)
      {
         chipsThisRound += potList.get(i).getRoundCount(player);
      }
      return chipsThisRound;
   }
   
   private int refundIncontestableBet()
   {
      int currentBet = getCurrentBet();
      
      Player playerMatchingCurrBet = null;
      List<Player> players = getMainPlayers();
      for (Player oPlayer : players)
      {
         if (getChipsThisRound(oPlayer) == currentBet)
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
         int iThisPotBet = getLastPot().getRoundCount(playerMatchingCurrBet);
         int iRefund = iThisPotBet;
         for (Player oPlayer : players)
         {
            if (oPlayer.hasHoleCards() && oPlayer != playerMatchingCurrBet)
            {
               int iPlayerChips = oPlayer.getChips();
               int iChipsThisRound = getChipsThisRound(oPlayer);
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
      
      return 0;
   }
   
   private int refundDeadPot(Player player)
   {
      Pot lastPot = getLastPot();
      if (lastPot == getMainPot() || lastPot.isContested())
      {
         return 0;
      }
      int iPotSize = lastPot.getSize();
      player.changeChips(iPotSize);
      removePot(lastPot);
      return iPotSize;
   }
   
   public void addToPot(int toAdd) throws Exception
   {
      Player player = getNextActionPlayer();
      if (player == null)
      {
         throw new Exception("Tried to add to pot with no action player");
      }
      
      addToPot(toAdd, player);
      moveActionIndex();
   }
   
   private void addToPot(int toAdd, Player player)
   {
      if (toAdd == 0)
      {
         check();
      }
      else
      {
         player.Bet(toAdd);
         
         int chipsThisRound = getChipsThisRound(player);
         int currBet = getCurrentBet();
         int incrAmount = chipsThisRound - currBet;
         int raise = chipsThisRound - (currBet - shortStackOverraise);
         //boolean raised = false;
         if (incrAmount > 0)
         {
         //   raised = true;
            if (raise < currentRaise)
            {
               shortStackOverraise = raise;
            }
            else
            {
               shortStackOverraise = 0;
            }
            currentRaise = Math.max(currentRaise, raise);
         }
         
         //if (raised)
         //{
         //   lastAggressor = player;
         //}
         
         addToPot(toAdd, player, currentPotIndex);
         
         if (state == HoldEmState.BLINDS)
         {
            if (!gotSmallBlind)
            {
               gotSmallBlind = true;
            }
            else if (!gotBigBlind)
            {
               gotBigBlind = true;
            }
         }
         else
         {
            // Set this to true so isPotEven() will only rely on whether the betting is even
            bettingOver = true; 
         }
      }
   }
   
   private void addToPot(int toAdd, Player player, int potIndex)
   {
      try
      {
         Pot pot = potList.get(potIndex);
         
         int iAmountOwedToCurrentPot = pot.getRoundOwed(player);
         
         if (iAmountOwedToCurrentPot == 0 && pot.isBettingCapped())
         {
            addToPot(toAdd, player, potIndex + 1);
         }
         else
         {
            if (pot.isBettingCapped())
            {
               int iRemaingChips = 0;
               if (iAmountOwedToCurrentPot > toAdd)
               {
                  // This player couldn't cover the current bet
                  Pot newPot = pot.add(toAdd, player);
                  if (newPot != null)
                  {
                     potList.add(potIndex + 1, newPot);
                  }
               }
               else
               {
                  pot.add(iAmountOwedToCurrentPot, player);
                  iRemaingChips = toAdd - iAmountOwedToCurrentPot;
                  
                  if (iRemaingChips > 0)
                  {
                     addToPot(iRemaingChips, player, potIndex + 1);
                  }
               }
            }
            else
            {
               // No one in the current pot is all in yet (except possibly this player)
               Pot newPot = pot.add(toAdd, player);
               if (newPot != null)
               {
                  potList.add(potIndex + 1, newPot);
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
   
   private void check()
   {
      switch (state)
      {
         case BET_PREFLOP:
            if (actionIndex == 1)
            {
               // This means the big blind (always in the second position) has checked the option
               bettingOver = true;
            }
            break;
         default:
            if (actionIndex == getCurrentPot().getNumPlayers() - 1)
            {
               // When the last player checks the table has checked around
               bettingOver = true;
            }
      }
      
      moveActionIndex();
   }
   
   public int getCall() throws Exception
   {
      Player player = getNextActionPlayer();
      
      if (player == null)
      {
         throw new Exception("No action player");
      }
      
      int playerChips = player.getChips();
      int currOwed = 0;
      int maxChipsRemainingPlayers = maxChipsRemainingPlayers();
      switch (state)
      {
         case BLINDS:
            if (!gotSmallBlind)
            {
               currOwed = Math.min(maxChipsRemainingPlayers, getSmallBlind());
            }
            else if (!gotBigBlind)
            {
               currOwed = Math.min(maxChipsRemainingPlayers, getBigBlind());
            }
            break;
         default:
            int trueCurrentBet = Math.max(getCurrentBet(), bigBlind); 
            currOwed = trueCurrentBet - getChipsThisRound(player);
      }
      
      return Math.min(playerChips, currOwed);
   }
   
   private int maxChipsRemainingPlayers()
   {
      int maxChips = 0;
      Pot currentPot = getCurrentPot();
      
      for (int currentActionIndex = (actionIndex + 1) % currentPot.getNumPlayers(); currentActionIndex != actionIndex; currentActionIndex = (currentActionIndex + 1) % currentPot.getNumPlayers())
      {
         Player player = currentPot.getPlayer(currentActionIndex);
         int playerChips = player.getChips() + getChipsThisRound(player);
         maxChips = Math.max(maxChips, playerChips);
      }
      
      return maxChips;
   }
   
   public int getMinRaise() throws Exception
   {
      Player player = getNextActionPlayer();
      int playerChips = player.getChips();
      
      int call = getCall();
      
      if (playerChips == call)
      {
         return 0;
      }
      
      int newRaise = call - shortStackOverraise + currentRaise;
      newRaise = Math.min(newRaise, maxChipsRemainingPlayers() - getChipsThisRound(player));
      return Math.min(playerChips, newRaise);
   }
   
   public int getMaxRaise() throws Exception
   {
      Player player = getNextActionPlayer();
      int playerChips = player.getChips();
      
      int call = getCall();
      
      if (playerChips == call)
      {
         return 0;
      }
      
      int maxChipsRemainingPlayers = maxChipsRemainingPlayers();
      return Math.min(playerChips, maxChipsRemainingPlayers);
   }
   
   public Pot awardPot(Card[] boardCards)
   {
      Pot pot = getLastPot();
      awardChips(pot, boardCards);
      return pot;
   }
   
   private void awardChips(Pot pot, Card[] boardCards)
   {
      ArrayList<Player> oWinners = new ArrayList<Player>();
      pot.getBestHand(boardCards, oWinners);
      int iNumWinners = oWinners.size();
      int iPotSize = pot.getSize();
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
            List<Player> oPlayers = getFirstPlayersInPotByPosition(iRem, pot);
            for (int i = 0; i < oPlayers.size(); i++)
            {
               oPlayers.get(i).changeChips(1);
            }
         }
      }
      removePot(pot);
   }
   
   private List<Player> getFirstPlayersInPotByPosition(int playersNeeded, Pot pot)
   {
      if (playersNeeded > pot.getNumPlayers())
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
         if (pot.contains(oPlayer))
         {
            oPlayers.add(oPlayer);
            iPlayersFound++;
            if (iPlayersFound == playersNeeded)
            {
            	return oPlayers;
            }
         }
         
         i++;
      }
      return null;
   }   
   
   private void removePot(Pot pot)
   {
      int iPotIndex = potList.indexOf(pot);
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

   private static String getPotName(int potIndex)
   {
      if (potIndex == 0)
      {
         return "Main Pot";
      }
      else
      {
         return "Side Pot " + potIndex;
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
