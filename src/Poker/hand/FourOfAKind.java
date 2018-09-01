package Poker.hand;

import Poker.game.DeckConstants.Value;

public class FourOfAKind extends Hand
{
   private Value fourKindValue;
   private Value kicker;
   
   public FourOfAKind(Value values[])
   {
      super(Rank.FOUR_KIND);
      fourKindValue = values[0];
      kicker = values[1];
   }
   
   public Value getFourKindValue()
   {
      return fourKindValue;
   }
   
   public Value getKicker()
   {
      return kicker;
   }
   
   public String toString()
   {
      return "4 of a kind - " + fourKindValue.toString() + "s";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      return compareFourKinds((FourOfAKind) handToCompare);
   }
   
   private int compareFourKinds(FourOfAKind foak)
   {
      Value value = foak.getFourKindValue();
      if (fourKindValue != value)
      {
         return fourKindValue.getIndex() - value.getIndex();
      }
      
      return kicker.getIndex() - foak.getKicker().getIndex();
   }
}
