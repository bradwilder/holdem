package Poker.hand;

import Poker.game.DeckConstants.Value;

public class Straight extends Hand
{
   protected Value high;
   
   public Straight(Value high)
   {
      super(Rank.STRAIGHT);
      this.high = high;
   }
   
   public Value getHigh()
   {
      return high;
   }
   
   public String toString()
   {
      return "Straight - " + high.toString() + " high";
   }
   
   public int compare(Hand handToCompare)
   {
      int iCompare = compareRank(handToCompare);
      if (iCompare != 0)
      {
         return iCompare;
      }
      
      Value highToCompare = ((Straight) handToCompare).getHigh();
      return high.getIndex() - highToCompare.getIndex();
   }
}
