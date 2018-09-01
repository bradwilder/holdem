package Poker.hand;

import Poker.game.DeckConstants.Value;

public class Pair extends Hand
{
   private Value pairValue;
   private Value kickers[];
   
   public Pair(Value values[])
   {
      super(Rank.PAIR);
      pairValue = values[0];
      kickers = new Value[3];
      for (int i = 0; i < 3; i++)
      {
         kickers[i] = values[i + 1];
      }
   }
   
   public Value getPairValue()
   {
      return pairValue;
   }
   
   public Value getKicker(int i)
   {
      return kickers[i];
   }
   
   public String toString()
   {
      return "Pair of " + pairValue.toString() + "s";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      return comparePair((Pair) handToCompare);
   }
   
   private int comparePair(Pair p)
   {
      if (pairValue != p.getPairValue())
      {
         return pairValue.getIndex() - p.getPairValue().getIndex();
      }
      
      for (int i = 0; i < 3; i++)
      {
         if (kickers[i] != p.getKicker(i))
         {
            return kickers[i].getIndex() - p.getKicker(i).getIndex();
         }
      }
      
      return 0;
   }
}
