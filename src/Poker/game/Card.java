package Poker.game;

import Poker.game.DeckConstants.Suit;
import Poker.game.DeckConstants.Value;

public class Card
{
   private Value m_oValue;
   private Suit  m_oSuit;
   
   public Card()
   {
      initializeWithCode(DeckConstants.NO_CARD);
   }
   
   public Card(int iCode)
   {
      initializeWithCode(iCode);
   }
   
   public Card(Suit oSuit, Value oValue)
   {
      m_oSuit = oSuit;
      m_oValue = oValue;
   }
   
   private void initializeWithCode(int iCode)
   {
      m_oSuit = Suit.suitFromCode(iCode);
      m_oValue = Value.valueFromCode(iCode);
   }
   
   public int getCode()
   {
      return DeckConstants.codeFromSuitValue(m_oSuit, m_oValue);
   }
   
   public Suit getSuit()
   {
      return m_oSuit;
   }
   
   public Value getValue()
   {
      return m_oValue;
   }
   
   public String toString()
   {
      return DeckConstants.toString(m_oSuit, m_oValue);
   }
}
