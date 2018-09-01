package Poker.hand;

import Poker.game.DeckConstants.Value;

public class TwoPair extends Hand
{
   private Value pairValues[];
   private Value kicker;
   
   public TwoPair(Value values[])
   {
      super(Rank.TWO_PAIR);
      pairValues = new Value[2];
      for (int i = 0; i < 2; i++)
      {
         pairValues[i] = values[i];
      }
      kicker = values[2];
   }
   
   public Value getPairValue(int i)
   {
      return pairValues[i];
   }
   
   public Value getKicker()
   {
      return kicker;
   }
   
   public String toString()
   {
      return "2 Pair - " + pairValues[0].toString() + "s and " + pairValues[1].toString() + "s";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      return compareTwoPair((TwoPair) handToCompare);
   }
   
   private int compareTwoPair(TwoPair tp)
   {
      for (int i = 0; i < 2; i++)
      {
         if (pairValues[i] != tp.getPairValue(i))
         {
            return pairValues[i].getIndex() - tp.getPairValue(i).getIndex();
         }
      }
      
      return kicker.getIndex() - tp.getKicker().getIndex();
   }
}
