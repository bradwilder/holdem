package Poker.hand;

import Poker.game.DeckConstants.Value;

public class Flush extends Hand
{
   private Value cardValues[];
   
   public Flush(Value values[])
   {
      super(Rank.FLUSH);
      cardValues = new Value[5];
      for (int i = 0; i < 5; i++)
      {
         cardValues[i] = values[i];
      }
   }
   
   public Value getCardValue(int i)
   {
      return cardValues[i];
   }
   
   public String toString()
   {
      return "Flush - " + cardValues[0].toString() + " high";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      return compareFlush((Flush) handToCompare);
   }
   
   private int compareFlush(Flush f)
   {
      for (int i = 0; i < 5; i++)
      {
         if (cardValues[i] != f.getCardValue(i))
         {
            return cardValues[i].getIndex() - f.getCardValue(i).getIndex();
         }
      }
      
      return 0;
   }
}
