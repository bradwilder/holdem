package Poker.game;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import Poker.hand.Hand;

public class Pot
{
   private int totalSize = 0; 
   private boolean bettingCapped = false;
   private LinkedHashMap<Player, Integer> playerCounts = new LinkedHashMap<Player, Integer>();
   
   public Pot(List<Player> players)
   {
      for (Player player : players)
      {
         this.playerCounts.put(player, 0);
      }
   }
   
   private Pot(LinkedHashMap<Player, Integer> playerCounts, boolean bettingCapped)
   {
      this.playerCounts = playerCounts;
      this.bettingCapped = bettingCapped;
      for (Map.Entry<Player, Integer> playerCount : playerCounts.entrySet())
      {
         totalSize += playerCount.getValue();
      }
   }
   
   /*public void clear()
   {
      currentBet = 0;
      bettingCapped = false;
      players.clear();
      totalSize = 0;
   }*/
   
   public int getSize()
   {
      return totalSize;
   }
   
   public boolean isBettingCapped()
   {
      return bettingCapped;
   }
   
   public int getCurrentBet()
   {
      int maxBet = 0;
      for (Map.Entry<Player, Integer> playerCount : playerCounts.entrySet())
      {
         maxBet = Math.max(maxBet, playerCount.getValue());
      }
      
      return maxBet;
   }
   
   private Pot capBetting(int cap) throws Exception
   {
      if (cap <= 0)
      {
         throw new Exception("Tried to cap betting at " + cap);
      }
      
      LinkedHashMap<Player, Integer> newPlayerCounters = new LinkedHashMap<Player, Integer>();
      for (Map.Entry<Player, Integer> playerCount : playerCounts.entrySet())
      {
         Player player = playerCount.getKey();
         Integer value = playerCount.getValue();
         int roundCount = 0;
         if (value != null)
         {
            roundCount = value;
         }
         int deduction = Math.max(roundCount - cap, 0);
         if (deduction > 0)
         {
            sub(deduction, player);
         }
         
         int surplus = player.getChips() + roundCount - cap; 
         
         if (surplus > 0 || deduction > 0)
         {
            newPlayerCounters.put(player, deduction);
         }
      }
      
      Pot newPot = null;
      if (newPlayerCounters.entrySet().size() >= 2)
      {
         newPot = new Pot(newPlayerCounters, bettingCapped);
      }
      
      bettingCapped = true;
      
      return newPot;
   }
   
   public boolean isContested()
   {
      return getNumPlayers() >= 2;
   }
   
   public List<Player> getPlayers()
   {
      return new ArrayList<Player>(playerCounts.keySet());
   }
   
   public boolean playerExists(Player player)
   {
      return playerCounts.containsKey(player);
   }
   
   public int getNumPlayers()
   {
      return playerCounts.size();
   }
   
   public Hand getBestHand(Card[] boardCards, List<Player> playersOut)
   {
      // TODO: return players array
      if (getNumPlayers() == 0)
      {
         return null;
      }
      
      Hand oCurrentBestHand = null;
      
      if (playersOut == null)
      {
         playersOut = new ArrayList<Player>();
      }
      
      Iterator<Player> oPlayers = getPlayers().iterator();
      if (!oPlayers.hasNext())
      {
         return null;
      }
      
      // Add the first player into the list; this will start as the best hand
      playersOut.add(oPlayers.next());
      oCurrentBestHand = playersOut.get(0).getHand(boardCards);
      
      // If the best hand is null, that means there aren't enough board cards to make a hand, so return null
      if (oCurrentBestHand == null)
      {
         playersOut.clear();
         return null;
      }
      
      while (oPlayers.hasNext())
      {
         Player oPlayer = oPlayers.next();
         Hand oPlayerHand = oPlayer.getHand(boardCards);
         int iComp = oCurrentBestHand.compare(oPlayerHand);
         if (iComp <= 0)
         {
            if (iComp < 0)
            {
               playersOut.clear();
            }
            oCurrentBestHand = oPlayerHand;
            playersOut.add(oPlayer);
         }
      }
      
      return oCurrentBestHand;
   }
   
   public Pot add(int toAdd, Player player) throws Exception
   {
      if (toAdd <= 0)
      {
         throw new Exception("Attempted to add non-positive chip value " + toAdd);
      }
      
      int currentCount = getPlayerRoundCount(player);
      int totalCount = currentCount + toAdd;
      
      int currentBet = getCurrentBet();
      
      if (bettingCapped && totalCount > currentBet)
      {
         throw new Exception("Attempted to add " + toAdd + " chips to pot with current bet at " + currentBet + " and player's current bet at " + currentCount);
      }
      
      addToRound(player, toAdd);
      
      Pot newPot = null;
      if (totalCount < currentBet || player.getChips() == 0)
      {
         newPot = capBetting(totalCount);
      }
      
      return newPot;
   }
   
   private void addToRound(Player player, int toAdd)
   {
      int currentCount = getPlayerRoundCount(player);
      int newCount = currentCount + toAdd;
      playerCounts.put(player, newCount);
      totalSize += toAdd;
   }
   
   public void sub(int deduction, Player player) throws Exception
   {
      if (deduction > totalSize)
      {
         throw new Exception("Tried to remove " + deduction + " from pot with size " + totalSize);
      }
      
      if (deduction <= 0)
      {
         throw new Exception("Attempted to remove non-positive value " + deduction);
      }
      
      Integer roundCount = playerCounts.get(player);
      
      if (roundCount == null)
      {
         throw new Exception("Attempted to remove chips from player that doesn't exist");
      }
      
      if (roundCount < deduction)
      {
         throw new Exception("Tried to remove " + deduction + " from player with only " + roundCount);
      }
      
      roundCount -= deduction;
      playerCounts.put(player, roundCount);
      
      totalSize -= deduction;
   }
   
   public void removePlayer(Player player)
   {
      playerCounts.remove(player);
   }
   
   public boolean isPotEven()
   {
      int currentBet = getCurrentBet();
      
      for (Map.Entry<Player, Integer> playerCount : playerCounts.entrySet())
      {
         Player player = playerCount.getKey();
         if (currentBet != getPlayerRoundCount(player))
         {
            return false;
         }
      }
      
      return true;
   }
   
   public int getPlayerRoundCount(Player player)
   {
      Integer value = playerCounts.get(player);
      if (value != null)
      {
         return value;
      }
      
      return 0;
   }
   
   public int getPlayerRoundOwed(Player player)
   {
      return getCurrentBet() - getPlayerRoundCount(player);
   }
   
   public void clearRound()
   {
      for (Map.Entry<Player, Integer> playerCount : playerCounts.entrySet())
      {
         playerCount.setValue(0);
      }
   }
   
   /*public String awardPotString(Card[] aoBoardCards, String sPotName)
   {
      ArrayList<Player> oWinners = new ArrayList<Player>();
      getBestHand(aoBoardCards, oWinners);
      
      if (!isContested() || oWinners.size() == 0)
      {
         return "";
      }
      
      int iNumWinners = oWinners.size();
      
      StringBuilder oPotAwardString = new StringBuilder();
      if (iNumWinners == 1)
      {
         oPotAwardString.append(oWinners.get(0).getName() + " wins ");
      }
      else if (iNumWinners == 2)
      {
         oPotAwardString.append(oWinners.get(0).getName() + " and " + oWinners.get(1).getName() + " split ");
      }
      else if (iNumWinners >= 3)
      {
         for (int i = 0; i < iNumWinners - 1; i++)
         {
            oPotAwardString.append(oWinners.get(i).getName() + ", ");
         }
         oPotAwardString.append("and " + oWinners.get(iNumWinners - 1).getName() + " split ");
      }
      oPotAwardString.append(toString(sPotName));
      return oPotAwardString.toString();
   }*/
   
   public String toString(String potName)
   {
      return potName + " (" + getSize() + ")";
   }
}
