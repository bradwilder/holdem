package Poker.hand;

import Poker.game.DeckConstants.Value;

public class ThreeOfAKind extends Hand
{
   private Value threeKindValue;
   private Value kickers[];
   
   public ThreeOfAKind(Value values[])
   {
      super(Rank.THREE_KIND);
      threeKindValue = values[0];
      kickers = new Value[2];
      for (int i = 0; i < 2; i++)
      {
         kickers[i] = values[i + 1];
      }
   }
   
   public Value getThreeKindValue()
   {
      return threeKindValue;
   }
   
   public Value getKicker(int i)
   {
      return kickers[i];
   }
   
   public String toString()
   {
      return "3 of a kind - " + threeKindValue.toString() + "s";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      return compareThreeOfAKind((ThreeOfAKind) handToCompare);
   }
   
   private int compareThreeOfAKind(ThreeOfAKind tk)
   {
      if (threeKindValue != tk.getThreeKindValue())
      {
         return threeKindValue.getIndex() - tk.getThreeKindValue().getIndex();
      }
      
      for (int i = 0; i < 2; i++)
      {
         if (kickers[i] != tk.getKicker(i))
         {
            return kickers[i].getIndex() - tk.getKicker(i).getIndex();
         }
      }
      
      return 0;
   }
}
