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
      while (currentPot != null)
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
      
      return null;
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
   
   private boolean hasEligiblePlayers()
   {
      int count = 0;
      Pot currentPot = getCurrentPot();
      if (currentPot != null)
      {
         for (int i = 0; i < currentPot.getNumPlayers(); i++)
         {
            if (!currentPot.getPlayer(i).isAllIn())
            {
               count++;
            }
         }
      }
      return count >= 2;
   }
   
   public boolean isBettingOver()
   {
      return isPotEven() && !hasEligiblePlayers();
   }
   
   public boolean isHandOver()
   {
      return getMainPlayersCount() <= 1;
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
   
   public List<ActionLogEntry> fold() throws Exception
   {
      Player player = getNextActionPlayer();
      if (player == null)
      {
         throw new Exception("Tried to fold with no action player");
      }
      
      List<ActionLogEntry> entries = new ArrayList<ActionLogEntry>();
      
      if (player.hasHoleCards())
      {
         player.Fold();
         
         for (Pot pot : potList)
         {
            pot.fold(player);
         }
         
         entries.add(new ActionLogEntry(player, "folded"));
         
         ActionLogEntry refund = refundIncontestableBet();
         if (refund != null)
         {
            entries.add(refund);
         }
      }
      
      // actionIndex should always point to a valid index within the current pot
      // If we remove the last player, this will reset the index back to 0 instead of leaving it pointing to nothing
      if (getCurrentPlayerCount() > 0)
      {
         actionIndex = actionIndex % getCurrentPlayerCount();
      }
      
      return entries;
   }
   
   private int getCurrentPlayerCount()
   {
      Pot currentPot = getCurrentPot();
      if (currentPot != null)
      {
         return currentPot.getNumPlayers();
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
   
   private ActionLogEntry refundIncontestableBet()
   {
      if (isHandOver())
      {
         return null;
      }
      
      int currentBet = getCurrentBet();
      
      Player playerMatchingCurrBet = null;
      List<Player> players = getCurrentPot().getPlayers();
      for (Player player : players)
      {
         if (getChipsThisRound(player) == currentBet)
         {
            // If we just found a second player matching the current bet, we can exit now
            if (playerMatchingCurrBet != null)
            {
               return null;
            }
            playerMatchingCurrBet = player;
         }
      }
      
      if (playerMatchingCurrBet != null)
      {
         Pot lastPot = getLastPot();
         int lastPotBet = lastPot.getRoundCount(playerMatchingCurrBet);
         int refund = lastPotBet;
         for (Player oPlayer : players)
         {
            if (oPlayer.hasHoleCards() && oPlayer != playerMatchingCurrBet)
            {
               int iPlayerChips = oPlayer.getChips();
               int iCurrOwed = currentBet - getChipsThisRound(oPlayer);
               int iAmountUnder = (iCurrOwed > iPlayerChips ? iCurrOwed - iPlayerChips : 0);
               refund = Math.min(refund, iAmountUnder);
            }
         }
         
         if (refund > 0)
         {
            if (refund == lastPotBet)
            {
               if (lastPot.isContested())
               {
                  return null;
               }
               playerMatchingCurrBet.changeChips(refund);
               removePot(lastPot);
               return new ActionLogEntry(playerMatchingCurrBet, "refunded " + refund);
            }
            else
            {
               playerMatchingCurrBet.changeChips(refund);
               try
               {
                  getLastPot().sub(refund, playerMatchingCurrBet);
               }
               catch (Exception x)
               {
                  System.err.println("ERROR: " + x.getMessage());
                  x.printStackTrace();
                  return null;
               }
               return new ActionLogEntry(playerMatchingCurrBet, "refunded " + refund);
            }
         }
      }
      
      return null;
   }
   
   public ActionLogEntry addToPot(int toAdd) throws Exception
   {
      Player player = getNextActionPlayer();
      if (player == null)
      {
         throw new Exception("Tried to add to pot with no action player");
      }
      
      ActionLogEntry entry = addToPot(toAdd, player);
      moveActionIndex();
      
      return entry;
   }
   
   private ActionLogEntry addToPot(int toAdd, Player player)
   {
      ActionLogEntry entry;
      
      if (toAdd == 0)
      {
         switch (state)
         {
            case BET_PREFLOP:
               if (actionIndex == 1)
               {
                  // This means the big blind (always in the second position) has checked the option
                  bettingOver = true;
                  entry = new ActionLogEntry(player, "checked the option");
               }
               else
               {
                  entry = new ActionLogEntry(player, "checked");
               }
               break;
            default:
               entry = new ActionLogEntry(player, "checked");
               if (actionIndex == getCurrentPot().getNumPlayers() - 1)
               {
                  // When the last player checks the table has checked around
                  bettingOver = true;
               }
         }
      }
      else
      {
         player.Bet(toAdd);
         
         int chipsThisRound = getChipsThisRound(player) + toAdd;
         int currBet = getCurrentBet();
         int incrAmount = chipsThisRound - currBet;
         int raise = chipsThisRound - (currBet - shortStackOverraise);
         //boolean raised = false;
         String action;
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
            if (!gotSmallBlind)
            {
               action = "called " + chipsThisRound + " small blind";
            }
            else if (!gotBigBlind)
            {
               action = "called " + chipsThisRound + " big blind";
            }
            else
            {
               action = "raised to " + chipsThisRound;
            }
         }
         else if (chipsThisRound < currBet)
         {
            action = "called " + toAdd;
         }
         else
         {
            action = "called";
         }
         
         if (player.getChips() == 0)
         {
            action += " (all in)";
         }
         entry = new ActionLogEntry(player, action);
         
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
      
      return entry;
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
            int currentBet = getCurrentBet();
            if (currentBet > 0)
            {
               int trueCurrentBet = Math.max(getCurrentBet(), bigBlind);
               currOwed = trueCurrentBet - getChipsThisRound(player);
            }
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
      int minRaise = Math.min(playerChips, newRaise); 
      return minRaise == call ? 0 : minRaise;
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
      int maxRaise = Math.min(playerChips, maxChipsRemainingPlayers); 
      return maxRaise == call ? 0 : maxRaise;
   }
   
   public Pot awardPot(Card[] boardCards)
   {
      Pot pot = getLastPot();
      if (pot != null)
      {
         List<Player> oWinners = pot.getWinners(boardCards);
         if (oWinners != null)
         {
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
      }
      return pot;
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
