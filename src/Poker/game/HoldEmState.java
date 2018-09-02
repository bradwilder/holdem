package Poker.game;

public enum HoldEmState
{
   BLINDS(0),
   DEAL_HOLES(1),
   BET_PREFLOP(2),
   DEAL_FLOP(3),
   BET_FLOP(4),
   DEAL_TURN(5),
   BET_TURN(6),
   DEAL_RIVER(7),
   BET_RIVER(8),
   WINNER(9),
   NO_STATE(99);
   
   private final int m_iIndex;
   private static final int NUM_STATES = 10;
   
   HoldEmState(int index)
   {
      m_iIndex = index;
   }
   
   public int getIndex()
   {
      return m_iIndex;
   }
   
   public static HoldEmState stateFromIndex(int i)
   {
      if (i < 0 || i >= NUM_STATES)
      {
         return NO_STATE;
      }
      return values()[i];
   }
   
   public HoldEmState getNextState()
   {
      return HoldEmState.values()[m_iIndex + 1 % NUM_STATES];
   }
}
