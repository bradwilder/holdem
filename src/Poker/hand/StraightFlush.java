package Poker.hand;

import Poker.game.DeckConstants.Value;

public class StraightFlush extends Straight
{   
   public StraightFlush(Value high)
   {
      super(high);
      m_oRank = Rank.STRAIGHT_FLUSH;
   }
   
   public String toString()
   {
      return "Straight flush - " + high.getIndex() + " high";
   }
}
