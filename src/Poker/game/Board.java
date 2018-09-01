package Poker.game;

import java.util.Arrays;

public class Board
{
   private Card m_aoBoard[] = new Card[s_iBoardSize];
   
   private static final int s_iBoardSize  = 5;
   private static final int s_iFlopSize   = 3;
   private static final int s_iTurnIndex  = 3;
   private static final int s_iRiverIndex = 4;
   
   public void addFlop(Card[] aoCard)
   {
      System.arraycopy(aoCard, 0, m_aoBoard, 0, s_iFlopSize);
   }
   
   public Card[] getFlop()
   {
      return Arrays.copyOfRange(m_aoBoard, 0, s_iFlopSize);
   }
   
   public void addTurn(Card oCard)
   {
      m_aoBoard[s_iTurnIndex] = oCard;
   }
   
   public Card getTurn()
   {
      return m_aoBoard[s_iTurnIndex];
   }
   
   public void addRiver(Card oCard)
   {
      m_aoBoard[s_iRiverIndex] = oCard;
   }
   
   public Card getRiver()
   {
      return m_aoBoard[s_iRiverIndex];
   }
   
   public Card[] getBoard()
   {
      return m_aoBoard;
   }
   
   public void clear()
   {
      m_aoBoard = new Card[s_iBoardSize];
   }
}
