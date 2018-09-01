package Poker.tests;

import Poker.game.Card;
import Poker.game.DeckConstants.Suit;
import Poker.game.DeckConstants.Value;
import Poker.hand.Hand;
import Poker.hand.*;
import junit.framework.TestCase;

public class HandTest extends TestCase
{
   private Card[] m_aoBoardCards;
   private Card[] m_aoHoleCards;
   private Hand m_oHand;
   private Hand m_oHand2;
   private Value[] m_aoValuesToCompare;
   
   protected void setUp() throws Exception
   {
      super.setUp();
   }
   
   protected void tearDown() throws Exception
   {
      super.tearDown();
   }
   
   public void testNoHandPreflop()
   {
      // Test with not enough board cards; should only happen in Hold 'Em pre-flop
      m_aoBoardCards = new Card[0];
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.SIX);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      assertTrue(m_oHand == null);
   }
   
   public void testHighCard()
   {
      // Test with a hand that has only a high card
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.HEARTS, Value.TWO);
      m_aoBoardCards[1] = new Card(Suit.HEARTS, Value.THREE);
      m_aoBoardCards[2] = new Card(Suit.HEARTS, Value.SEVEN);
      m_aoBoardCards[3] = new Card(Suit.HEARTS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.KING);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.SIX);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[5];
      m_aoValuesToCompare[0] = Value.KING;
      m_aoValuesToCompare[1] = Value.QUEEN;
      m_aoValuesToCompare[2] = Value.NINE;
      m_aoValuesToCompare[3] = Value.SEVEN;
      m_aoValuesToCompare[4] = Value.SIX;
      m_oHand2 = new HighCard(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal high card hands
      m_aoValuesToCompare[2] = Value.EIGHT;
      m_oHand2 = new HighCard(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
      
      
      // Compare a high card hand with a better hand
      m_aoValuesToCompare = new Value[4];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.KING;
      m_aoValuesToCompare[2] = Value.QUEEN;
      m_aoValuesToCompare[3] = Value.NINE;
      m_oHand2 = new Pair(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testPair()
   {
      // Test with a hand that has only a pair
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.HEARTS, Value.TWO);
      m_aoBoardCards[1] = new Card(Suit.HEARTS, Value.THREE);
      m_aoBoardCards[2] = new Card(Suit.HEARTS, Value.SEVEN);
      m_aoBoardCards[3] = new Card(Suit.HEARTS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.KING);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.THREE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[4];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.KING;
      m_aoValuesToCompare[2] = Value.QUEEN;
      m_aoValuesToCompare[3] = Value.NINE;
      m_oHand2 = new Pair(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal pair hands
      m_aoValuesToCompare[2] = Value.TEN;
      m_oHand2 = new Pair(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
      
      
      // Compare a pair hand with a better hand
      m_aoValuesToCompare = new Value[3];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.KING;
      m_aoValuesToCompare[2] = Value.QUEEN;
      m_oHand2 = new ThreeOfAKind(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testTwoPair()
   {
      // Test with a hand that has only two pair, and which actually has three pair
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.HEARTS, Value.SEVEN);
      m_aoBoardCards[1] = new Card(Suit.HEARTS, Value.THREE);
      m_aoBoardCards[2] = new Card(Suit.HEARTS, Value.SEVEN);
      m_aoBoardCards[3] = new Card(Suit.HEARTS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.KING);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.QUEEN);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.THREE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[3];
      m_aoValuesToCompare[0] = Value.QUEEN;
      m_aoValuesToCompare[1] = Value.SEVEN;
      m_aoValuesToCompare[2] = Value.KING;
      m_oHand2 = new TwoPair(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare a two-pair hand with a better hand
      m_aoValuesToCompare = new Value[3];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.KING;
      m_aoValuesToCompare[2] = Value.QUEEN;
      m_oHand2 = new ThreeOfAKind(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testThreeOfAKind()
   {
      // Test with a hand that has only three of a kind
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.HEARTS, Value.SIX);
      m_aoBoardCards[1] = new Card(Suit.HEARTS, Value.THREE);
      m_aoBoardCards[2] = new Card(Suit.HEARTS, Value.SEVEN);
      m_aoBoardCards[3] = new Card(Suit.HEARTS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.THREE);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.THREE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[3];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.QUEEN;
      m_aoValuesToCompare[2] = Value.NINE;
      m_oHand2 = new ThreeOfAKind(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal three-of-a-kind hands
      m_aoValuesToCompare[0] = Value.TWO;
      m_aoValuesToCompare[1] = Value.KING;
      m_oHand2 = new ThreeOfAKind(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
      
      
      // Compare a three-of-a-kind hand with a better hand
      m_aoValuesToCompare = new Value[3];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.KING;
      m_oHand2 = new FullHouse(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testStraight()
   {
      // Test with a hand that has only a straight, but with a six-card straight
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.DIAMONDS, Value.NINE);
      m_aoBoardCards[1] = new Card(Suit.CLUBS, Value.TEN);
      m_aoBoardCards[2] = new Card(Suit.CLUBS, Value.JACK);
      m_aoBoardCards[3] = new Card(Suit.CLUBS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.KING);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.ACE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_oHand2 = new Straight(Value.ACE);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal straight hands
      m_oHand2 = new Straight(Value.SEVEN);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
      
      
      // Compare a straight hand with a better hand
      m_oHand2 = new StraightFlush(Value.SIX);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testFlush()
   {
      // Test with a hand that has a flush, and also has a straight and a pair
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.CLUBS, Value.NINE);
      m_aoBoardCards[1] = new Card(Suit.CLUBS, Value.TEN);
      m_aoBoardCards[2] = new Card(Suit.CLUBS, Value.JACK);
      m_aoBoardCards[3] = new Card(Suit.CLUBS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.HEARTS, Value.KING);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.CLUBS, Value.ACE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[5];
      m_aoValuesToCompare[0] = Value.ACE;
      m_aoValuesToCompare[1] = Value.QUEEN;
      m_aoValuesToCompare[2] = Value.JACK;
      m_aoValuesToCompare[3] = Value.TEN;
      m_aoValuesToCompare[4] = Value.NINE;
      m_oHand2 = new Flush(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal high card hands
      m_aoValuesToCompare[4] = Value.EIGHT;
      m_oHand2 = new Flush(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
      
      
      // Compare a flush hand with a better hand
      m_aoValuesToCompare = new Value[4];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.KING;
      m_aoValuesToCompare[2] = Value.QUEEN;
      m_oHand2 = new FullHouse(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testFullHouse()
   {
      // Test with a hand that has only a full house
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.DIAMONDS, Value.SEVEN);
      m_aoBoardCards[1] = new Card(Suit.HEARTS, Value.THREE);
      m_aoBoardCards[2] = new Card(Suit.HEARTS, Value.SEVEN);
      m_aoBoardCards[3] = new Card(Suit.HEARTS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.THREE);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.THREE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[2];
      m_aoValuesToCompare[0] = Value.THREE;
      m_aoValuesToCompare[1] = Value.SEVEN;
      m_oHand2 = new FullHouse(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Test with two three-of-a-kinds; should only return a full house
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.SEVEN);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.THREE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[2];
      m_aoValuesToCompare[0] = Value.SEVEN;
      m_aoValuesToCompare[1] = Value.THREE;
      m_oHand2 = new FullHouse(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal full house hands
      m_aoValuesToCompare[0] = Value.SIX;
      m_aoValuesToCompare[1] = Value.FOUR;
      m_oHand2 = new FullHouse(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
      
      
      // Compare a full house hand with a better hand
      m_aoValuesToCompare = new Value[2];
      m_aoValuesToCompare[0] = Value.TWO;
      m_aoValuesToCompare[1] = Value.KING;
      m_oHand2 = new FourOfAKind(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testFourOfAKind()
   {
      // Test with a hand that has only a four of a kind, and also a full house
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.DIAMONDS, Value.SEVEN);
      m_aoBoardCards[1] = new Card(Suit.HEARTS, Value.THREE);
      m_aoBoardCards[2] = new Card(Suit.HEARTS, Value.SEVEN);
      m_aoBoardCards[3] = new Card(Suit.HEARTS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.THREE);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.CLUBS, Value.SEVEN);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.SEVEN);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_aoValuesToCompare = new Value[2];
      m_aoValuesToCompare[0] = Value.SEVEN;
      m_aoValuesToCompare[1] = Value.QUEEN;
      m_oHand2 = new FourOfAKind(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal four-of-a-kind hands
      m_aoValuesToCompare[0] = Value.SIX;
      m_aoValuesToCompare[1] = Value.ACE;
      m_oHand2 = new FullHouse(m_aoValuesToCompare);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
      
      
      // Compare a four-of-a-kind hand with a better hand
      m_oHand2 = new StraightFlush(Value.NINE);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
   }
   
   public void testStraightFlush()
   {
      // Test with a hand that has a straight flush, and with a card of a different suit that makes a higher straight
      m_aoBoardCards = new Card[5];
      m_aoBoardCards[0] = new Card(Suit.CLUBS, Value.NINE);
      m_aoBoardCards[1] = new Card(Suit.CLUBS, Value.TEN);
      m_aoBoardCards[2] = new Card(Suit.CLUBS, Value.JACK);
      m_aoBoardCards[3] = new Card(Suit.CLUBS, Value.QUEEN);
      m_aoBoardCards[4] = new Card(Suit.CLUBS, Value.KING);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.SPADES, Value.ACE);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_oHand2 = new StraightFlush(Value.KING);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Test without a full board
      m_aoBoardCards = new Card[4];
      m_aoBoardCards[0] = new Card(Suit.CLUBS, Value.NINE);
      m_aoBoardCards[1] = new Card(Suit.CLUBS, Value.TEN);
      m_aoBoardCards[2] = new Card(Suit.CLUBS, Value.JACK);
      m_aoBoardCards[3] = new Card(Suit.CLUBS, Value.QUEEN);
      
      m_aoHoleCards = new Card[2];
      m_aoHoleCards[0] = new Card(Suit.SPADES, Value.NINE);
      m_aoHoleCards[1] = new Card(Suit.CLUBS, Value.KING);
      
      m_oHand = Hand.makeHand(m_aoBoardCards, m_aoHoleCards);
      m_oHand2 = new StraightFlush(Value.KING);
      assertTrue(m_oHand.compare(m_oHand2) == 0);
      
      
      // Compare two unequal straight flush hands
      m_oHand2 = new StraightFlush(Value.ACE);
      assertTrue(m_oHand.compare(m_oHand2) < 0);
      
      
      // Compare a straight flush hand with a lesser hand
      m_oHand2 = new Straight(Value.ACE);
      assertTrue(m_oHand.compare(m_oHand2) > 0);
   }
}
