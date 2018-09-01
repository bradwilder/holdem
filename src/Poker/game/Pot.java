package Poker.game;

import java.util.ArrayList;
import java.util.Iterator;

import Poker.hand.Hand;

public class Pot
{
   private int totalSize = 0; 
   private boolean bettingCapped = false;
   private ArrayList<PlayerCounter> players = new ArrayList<PlayerCounter>();
   
   public Pot()
   {
      
   }
   
   public Pot(ArrayList<Player> players)
   {
      for (Player player : players)
      {
         this.players.add(new PlayerCounter(player, 0));
      }
   }
   
   private Pot(ArrayList<PlayerCounter> players, boolean bettingCapped)
   {
      this.players = players;
      this.bettingCapped = bettingCapped;
      for (PlayerCounter player : players)
      {
         totalSize += player.getRoundCount();
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
      for (PlayerCounter player : players)
      {
         maxBet = Math.max(maxBet, player.getRoundCount());
      }
      
      return maxBet;
   }
   
   private Pot capBetting(int iCap) throws Exception
   {
      if (iCap <= 0)
      {
         throw new Exception("Tried to cap betting at " + iCap);
      }
      
      ArrayList<PlayerCounter> newPlayers = new ArrayList<PlayerCounter>(); 
      for (PlayerCounter player : players)
      {
         int deduction = player.getRoundCount() - iCap;
         if (deduction > 0)
         {
            PlayerCounter newPlayer = new PlayerCounter(player.player, deduction);
            newPlayers.add(newPlayer);
            
            removeFromRound(player, deduction);
         }
      }
      
      Pot newPot = null;
      if (newPlayers.size() > 0)
      {
         newPot = new Pot(newPlayers, bettingCapped);
      }
      
      bettingCapped = true;
      
      return newPot;
   }
   
   public boolean isContested()
   {
      return getNumPlayers() >= 2;
   }
   
   public ArrayList<Player> getPlayers()
   {
      // TODO: use map here
      ArrayList<Player> playerList = new ArrayList<Player>();
      for (int i = 0; i < players.size(); i++)
      {
         playerList.add(players.get(i).player);
      }
      return playerList;
   }
   
   public PlayerCounter findPlayer(Player oPlayer)
   {
      for (int i = 0; i < players.size(); i++)
      {
         PlayerCounter player = players.get(i); 
         if (player.player.equals(oPlayer))
         {
            return player;
         }
      }
      
      return null;
   }
   
   public int getNumPlayers()
   {
      return players.size();
   }
   
   public Hand getBestHand(Card[] aoBoardCards, ArrayList<Player> oPlayersOut)
   {
      // TODO: return players array
      if (getNumPlayers() == 0)
      {
         return null;
      }
      
      Hand oCurrentBestHand = null;
      
      if (oPlayersOut == null)
      {
         oPlayersOut = new ArrayList<Player>();
      }
      
      Iterator<Player> oPlayers = getPlayers().iterator();
      if (!oPlayers.hasNext())
      {
         return null;
      }
      
      // Add the first player into the list; this will start as the best hand
      oPlayersOut.add(oPlayers.next());
      oCurrentBestHand = oPlayersOut.get(0).getHand(aoBoardCards);
      
      // If the best hand is null, that means there aren't enough board cards to make a hand, so return null
      if (oCurrentBestHand == null)
      {
         oPlayersOut.clear();
         return null;
      }
      
      while (oPlayers.hasNext())
      {
         Player oPlayer = oPlayers.next();
         Hand oPlayerHand = oPlayer.getHand(aoBoardCards);
         int iComp = oCurrentBestHand.compare(oPlayerHand);
         if (iComp <= 0)
         {
            if (iComp < 0)
            {
               oPlayersOut.clear();
            }
            oCurrentBestHand = oPlayerHand;
            oPlayersOut.add(oPlayer);
         }
      }
      
      return oCurrentBestHand;
   }
   
   public Pot add(int toAdd, Player oPlayer) throws Exception
   {
      if (toAdd <= 0)
      {
         throw new Exception("Attempted to add non-positive chip value " + toAdd);
      }
      
      PlayerCounter player = findPlayer(oPlayer);
      
      int currentCount = 0;
      if (player != null)
      {
         currentCount = player.getRoundCount();
      }
      int totalCount = currentCount + toAdd;
      
      int currentBet = getCurrentBet();
      
      if (bettingCapped && totalCount > currentBet)
      {
         throw new Exception("Attempted to add " + toAdd + " chips to pot with current bet at " + currentBet + " and player's current bet at " + currentCount);
      }
      
      if (player != null)
      {
         addToRound(player, toAdd);
      }
      else
      {
         addToRound(oPlayer, toAdd);
      }
      
      Pot newPot = null;
      if (totalCount < currentBet || oPlayer.getChips() == 0)
      {
         newPot = capBetting(totalCount);
      }
      
      return newPot;
   }
   
   private void addToRound(PlayerCounter player, int toAdd)
   {
      player.addToRound(toAdd);
      totalSize += toAdd;
   }
   
   private void addToRound(Player player, int toAdd)
   {
      PlayerCounter newPlayer = new PlayerCounter(player, toAdd);
      addToRound(newPlayer, toAdd);
   }
   
   private void removeFromRound(PlayerCounter player, int deduction) throws Exception
   {
      if (deduction > totalSize)
      {
         throw new Exception("Tried to remove " + deduction + " from pot with size " + totalSize);
      }
      
      player.removeFromRound(deduction);
      totalSize -= deduction;
   }
   
   public void sub(int iChipsToRemove, Player oPlayer) throws Exception
   {
      PlayerCounter player = findPlayer(oPlayer);
      removeFromRound(player, iChipsToRemove);
   }
   
   public void addPlayer(Player oPlayer)
   {
      PlayerCounter player = findPlayer(oPlayer);
      if (player == null)
      {
         players.add(new PlayerCounter(oPlayer, 0));
      }
   }
   
   public void removePlayer(Player player)
   {
      for (int i = 0; i < players.size(); i++)
      {
         PlayerCounter playerCounter = players.get(i);
         if (playerCounter.player == player)
         {
            players.remove(i);
         }
      }
   }
   
   public boolean isPotEven()
   {
      int currentBet = getCurrentBet();
      
      for (PlayerCounter player : players)
      {
         if (currentBet != player.getRoundCount())
         {
            return false;
         }
      }
      
      return true;
   }
   
   public int getPlayerRoundCount(Player oPlayer)
   {
      try
      {
         PlayerCounter player = findPlayer(oPlayer);
         return player.getRoundCount();
      }
      catch (Exception x)
      {
         return 0;
      }
   }
   
   public int getPlayerRoundOwed(Player oPlayer)
   {
      return getCurrentBet() - getPlayerRoundCount(oPlayer);
   }
   
   public void clearRound()
   {
      for (PlayerCounter player : players)
      {
         player.clearRoundCount();
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
   
   public String toString(String sPotName)
   {
      return sPotName + " (" + getSize() + ")";
   }
   
   private class PlayerCounter
   {
      public Player player;
      private int roundCount;
      
      public PlayerCounter(Player player, int count)
      {
         this.player = player;
         this.roundCount = count;
      }
      
      public void addToRound(int toAdd)
      {
         roundCount += toAdd;
      }
      
      public void removeFromRound(int toRemove) throws Exception
      {
         if (toRemove <= 0)
         {
            throw new Exception("Attempted to remove non-positive value " + toRemove);
         }
         
         if (roundCount < toRemove)
         {
            throw new Exception("Tried to remove " + toRemove + " from player with only " + roundCount);
         }
         
         roundCount -= toRemove;
      }
      
      public int getRoundCount()
      {
         return roundCount;
      }
      
      public void clearRoundCount()
      {
         roundCount = 0;
      }
   }
}
