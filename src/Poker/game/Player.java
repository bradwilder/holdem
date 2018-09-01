package Poker.game;

import java.util.Arrays;

import Poker.hand.Hand;

public class Player
{
   private String m_sName;
   private int m_iChips;
   private int m_iPosition; // TODO: remove
   private Card m_aoHoleCards[] = new Card[2];
   
   public Player(String sName, int iPosition)
   {
      create(sName, Chip.PLAYER_CHIPS, iPosition);
   }
   
   public Player(String sName, int iPosition, int iChips)
   {
      create(sName, iChips, iPosition);
   }
   
   private void create(String sName, int iChips, int iPosition)
   {
      m_sName = sName;
      m_iChips = iChips;
      m_iPosition = iPosition;
   }
   
   public void Fold()
   {
      Arrays.fill(m_aoHoleCards, null);
   }
   
   public void DealHoleCards(Card cards[])
   {
      m_aoHoleCards = cards.clone();
   }
   
   public String getName()
   {
      return m_sName;
   }
   
   public int getChips()
   {
      return m_iChips;
   }
   
   public int getPosition()
   {
      return m_iPosition;
   }
   
   public Card[] getHoleCards()
   {
      return m_aoHoleCards;
   }
   
   public boolean hasHoleCards()
   {
      return m_aoHoleCards[0] != null;
   }
   
   public Hand getHand(Card[] aoBoardCards)
   {
      if (!hasHoleCards())
      {
         return null;
      }
      
      return Hand.makeHand(aoBoardCards, m_aoHoleCards);
   }
   
   public boolean isAllIn()
   {
      return getChips() == 0 && hasHoleCards();
   }
   
   public void setChips(int newChips)
   {
      m_iChips = newChips;
   }
   
   public void Bet(int betAmount)
   {
      changeChips(-betAmount);
   }
   
   public void changeChips(int change)
   {
      m_iChips += change;
   }
   
   public String toString()
   {
      return m_sName + "\n" + m_iChips;
   }
}
