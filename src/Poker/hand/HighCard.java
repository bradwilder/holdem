package Poker.hand;

import Poker.game.DeckConstants.Value;

public class HighCard extends Hand
{
   private Value cardValues[];
   
   public HighCard(Value values[])
   {
      super(Rank.HIGH_CARD);
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
      return cardValues[0].toString() + " high";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      return compareHighCards((HighCard) handToCompare);
   }
   
   private int compareHighCards(HighCard hc)
   {
      for (int i = 0; i < 5; i++)
      {
         if (cardValues[i] != hc.getCardValue(i))
         {
            return cardValues[i].getIndex() - hc.getCardValue(i).getIndex();
         }
      }
      
      return 0;
   }
}
