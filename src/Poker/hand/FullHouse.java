package Poker.hand;

import Poker.game.DeckConstants.Value;

public class FullHouse extends Hand
{
   private Value threeKindValue;
   private Value pairValue;
   
   public FullHouse(Value values[])
   {
      super(Rank.FULL_HOUSE);
      threeKindValue = values[0];
      pairValue = values[1];
   }
   
   public Value getThreeKindValue()
   {
      return threeKindValue;
   }
   
   public Value getPairValue()
   {
      return pairValue;
   }
   
   public String toString()
   {
      return "Full House - " + threeKindValue.toString() + "s " + "full of " + pairValue.toString() + "s";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      Value threeKindValueToCompare = ((FullHouse) handToCompare).getThreeKindValue();
      Value pairValueToCompare = ((FullHouse) handToCompare).getPairValue();
      if (threeKindValue != threeKindValueToCompare)
      {
         return threeKindValue.getIndex() - threeKindValueToCompare.getIndex();
      }
      
      return pairValue.getIndex() - pairValueToCompare.getIndex();
   }
}
