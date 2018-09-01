package Poker.hand;

import java.util.ArrayList;

import Poker.game.Card;
import Poker.game.DeckConstants;
import Poker.game.DeckConstants.Suit;
import Poker.game.DeckConstants.Value;

public abstract class Hand
{
   protected static enum Rank
   {
      HIGH_CARD     (0),
      PAIR          (1),
      TWO_PAIR      (2),
      THREE_KIND    (3),
      STRAIGHT      (4),
      FLUSH         (5),
      FULL_HOUSE    (6),
      FOUR_KIND     (7),
      STRAIGHT_FLUSH(8);
      
      private final int m_iIndex;
      
      Rank(int iIndex)
      {
         m_iIndex = iIndex;
      }
      
      public int getIndex()
      {
         return m_iIndex;
      }
   }
   
   protected Rank m_oRank;
   
   public Hand(Rank oRank)
   {
      m_oRank = oRank;
   }
   
   public Rank getRank()
   {
      return m_oRank;
   }
   
   abstract public String toString();
   
   abstract public int compare(Hand oHand);
   
   protected int compareRank(Hand oHandToCompare)
   {
      return m_oRank.compareTo(oHandToCompare.getRank());
   }
   
   public static Hand makeHand(Card[] aoBoardCards, Card[] aoHoleCards)
   {
      if (aoBoardCards == null || aoHoleCards == null)
      {
         return null;
      }
      
      // Count how many actual cards we have
      int iTotalCards = 0;
      int iBoardCards = 0;
      int iHoleCards = 0;
      for (int i = 0; i < aoBoardCards.length; i++)
      {
         if (aoBoardCards[i] != null)
         {
            iBoardCards++;
            iTotalCards++;
         }
      }
      for (int i = 0; i < aoHoleCards.length; i++)
      {
         if (aoHoleCards[i] != null)
         {
            iHoleCards++;
            iTotalCards++;
         }
      }
      
      Card[] aoAllCards = new Card[iTotalCards];
      
      // Add the board cards
      for (int i = 0; i < iBoardCards; i++)
      {
         aoAllCards[i] = aoBoardCards[i];
      }
      
      // Add the hole cards
      for (int i = 0; i < iHoleCards; i++)
      {
         aoAllCards[iBoardCards + i] = aoHoleCards[i];
      }
      
      return makeHand(aoAllCards);
   }
   
   public static Hand makeHand(Card[] aoCards)
   {
      if (aoCards.length < 5)
      {
         return null;
      }
      
      Suit oFlushSuit = findFlush(aoCards);
      if (oFlushSuit != Suit.NO_SUIT)
      {
         Value oStraightFlushHigh = findStraightFlush(aoCards, oFlushSuit);
         if (oStraightFlushHigh != Value.NO_VALUE)
         {
            return new StraightFlush(oStraightFlushHigh);
         }
         return new Flush(getFlush(aoCards, oFlushSuit));
      }
      
      Value oStraightHigh = findStraight(aoCards);
      if (oStraightHigh != Value.NO_VALUE)
      {
         return new Straight(oStraightHigh);
      }
      
      int[] aiValueCount = initializeValueCountArray(aoCards);
      int iPairCount = findPairs(aiValueCount);
      if (iPairCount == 0)
      {
         return new HighCard(getHighCard(aoCards));
      }
      if (hasTrip(aiValueCount))
      {
         if (hasQuad(aiValueCount))
         {
            return new FourOfAKind(getQuad(aiValueCount));
         }
         if (iPairCount >= 2)
         {
            return new FullHouse(getFullHouse(aiValueCount));
         }
         return new ThreeOfAKind(getTrip(aiValueCount));
      }
      else if (iPairCount > 1)
      {
         return new TwoPair(getTwoPair(aiValueCount));
      }
      return new Pair(getPair(aiValueCount));
   }
   
   private static Suit findFlush(Card[] aoCards)
   {
      int[] aiSuits = new int[DeckConstants.Suit.NUM_SUITS];
      for (int i = 0; i < aoCards.length; i++)
      {
         aiSuits[aoCards[i].getSuit().getIndex()]++;
      }
      for (int i = 0; i < aiSuits.length; i++)
      {
         if (aiSuits[i] >= 5)
         {
            return Suit.suitFromIndex(i);
         }
      }
      return Suit.NO_SUIT;
   }
   
   private static Value[] getFlush(Card[] aoCards, Suit oSuit)
   {
      Value[] aoValues = new Value[5];
      
      int iSuitCount = 0;
      for (int i = 0; i < aoCards.length; i++)
      {
         if (aoCards[i].getSuit() == oSuit)
         {
            iSuitCount++;
         }
      }
      
      Value[] aoTemp = new Value[iSuitCount];
      int iItemAddIndex = 0;
      for (int i = 0; i < aoCards.length; i++)
      {
         if (aoCards[i].getSuit() == oSuit)
         {
            aoTemp[iItemAddIndex] = aoCards[i].getValue();
            iItemAddIndex++;
         }
      }
      sort(aoTemp);
      for (int i = 0; i < 5; i++)
      {
         aoValues[i] = aoTemp[i];
      }
      return aoValues;
   }
   
   // Assumes there is a Flush of given suit
   private static Value findStraightFlush(Card[] aoCards, Suit oSuit)
   {
      ArrayList<Card> oSuitedCards = new ArrayList<Card>();
      for (int i = 0; i < aoCards.length; i++)
      {
         if (aoCards[i].getSuit() == oSuit)
         {
            oSuitedCards.add(aoCards[i]);
         }
      }
      
      // TODO: replace this this with toArray, or don't use arrays at all
      Card[] aoTemp2 = new Card[oSuitedCards.size()];
      for (int i = 0; i < oSuitedCards.size(); i++)
      {
         aoTemp2[i] = oSuitedCards.get(i);
      }
      return findStraight(aoTemp2);
   }
   
   private static Value findStraight(Card[] aoCards)
   {
      // (!) Ace can be high or low in a straight, so we have to add an extra value
      // (!) We will offset values by +1, and treat ace-low as 0
      
      // Initialize array used to determine presence of each value
      int iNumValues = DeckConstants.Value.NUM_VALUES + 1; // Add 1 extra value to account for the ace's dual role
      boolean[] abValuePresent = new boolean[iNumValues];
      for (int i = 0; i < iNumValues; i++)
      {
         abValuePresent[i] = false;
      }
      
      for (int i = 0; i < aoCards.length; i++)
      {
         abValuePresent[aoCards[i].getValue().getIndex() + 1] = true; // Offset +1 for each value
         // Additionally set the value for ace-low
         if (aoCards[i].getValue() == Value.ACE)
         {
            abValuePresent[0] = true;
         }
      }
      
      for (int i = iNumValues - 1; i >= 4; i--)
      {
         if (abValuePresent[i] &&
             abValuePresent[i - 1] &&
             abValuePresent[i - 2] &&
             abValuePresent[i - 3] &&
             abValuePresent[i - 4])
         {
            return Value.valueFromIndex(i - 1); // Finally, offset -1 to account for the offset described above
         }
      }
      return Value.NO_VALUE;
   }
   
   private static int findPairs(int[] aiValueCount)
   {
      int iPairs = 0;
      for (int i = 0; i < aiValueCount.length; i++)
      {
         if (aiValueCount[i] >= 2)
         {
            iPairs++;
         }
      }
      return iPairs;
   }
   
   private static Value[] getPair(int[] aiValueCount)
   {
      Value[] aoValues = new Value[4];
      for (int i = DeckConstants.Value.NUM_VALUES - 1; i >= 0; i--)
      {
         if (aiValueCount[i] == 2)
         {
            aoValues[0] = Value.valueFromIndex(i);
            aiValueCount[i] = 0;
            break;
         }
      }
      
      Value[] aoKickers = getKickers(aiValueCount, 3);
      aoValues[1] = aoKickers[0];
      aoValues[2] = aoKickers[1];
      aoValues[3] = aoKickers[2];
      
      return aoValues;
   }
   
   private static Value[] getTwoPair(int[] aiValueCount)
   {
      Value[] aoValues = new Value[3];
      int iPairs = 0;
      for (int i = DeckConstants.Value.NUM_VALUES - 1; i >= 0; i--)
      {
         if (aiValueCount[i] == 2)
         {
            aoValues[iPairs] = Value.valueFromIndex(i);
            aiValueCount[i] = 0;
            iPairs++;
            if (iPairs == 2)
            {
               break;
            }
         }
      }
      
      Value[] aoKickers = getKickers(aiValueCount, 2);
      aoValues[2] = aoKickers[0];
      
      return aoValues;
   }
   
   private static Value[] getFullHouse(int[] aiValueCount)
   {
      Value[] aoValues = new Value[2];
      for (int i = DeckConstants.Value.NUM_VALUES - 1; i >= 0; i--)
      {
         if (aiValueCount[i] == 3)
         {
            aoValues[0] = Value.valueFromIndex(i);
            aiValueCount[i] = 0;
            break;
         }
      }
      
      for (int i = DeckConstants.Value.NUM_VALUES - 1; i >= 0; i--)
      {
         if (aiValueCount[i] >= 2)
         {
            aoValues[1] = Value.valueFromIndex(i);
            break;
         }
      }
      
      return aoValues;
   }
   
   private static Value[] getTrip(int[] aiValueCount)
   {
      Value[] aoValues = new Value[3];
      for (int i = DeckConstants.Value.NUM_VALUES - 1; i >= 0; i--)
      {
         if (aiValueCount[i] == 3)
         {
            aoValues[0] = Value.valueFromIndex(i);
            aiValueCount[i] = 0;
            break;
         }
      }
      
      Value[] aoKickers = getKickers(aiValueCount, 2);
      aoValues[1] = aoKickers[0];
      aoValues[2] = aoKickers[1];
      
      return aoValues;
   }
   
   private static boolean hasTrip(int[] aiValueCount)
   {
      for (int i = 0; i < aiValueCount.length; i++)
      {
         if (aiValueCount[i] >= 3)
         {
            return true;
         }
      }
      return false;
   }
   
   private static Value[] getQuad(int[] aiValueCount)
   {
      Value[] aoValues = new Value[2];
      for (int i = DeckConstants.Value.NUM_VALUES - 1; i >= 0; i--)
      {
         if (aiValueCount[i] == 4)
         {
            aoValues[0] = Value.valueFromIndex(i);
            aiValueCount[i] = 0;
            break;
         }
      }
      
      Value[] aoKickers = getKickers(aiValueCount, 1);
      aoValues[1] = aoKickers[0];
      
      return aoValues;
   }
   
   private static boolean hasQuad(int[] aiValueCount)
   {
      for (int i = 0; i < aiValueCount.length; i++)
      {
         if (aiValueCount[i] >= 4)
         {
            return true;
         }
      }
      return false;
   }
   
   private static Value[] getHighCard(Card[] aoCards)
   {
      Value[] aoTemp = new Value[aoCards.length];
      for (int i = 0; i < aoCards.length; i++)
      {
         aoTemp[i] = aoCards[i].getValue();
      }
      sort(aoTemp);
      
      Value[] aoValues = new Value[5];
      for (int i = 0; i < 5; i++)
      {
         aoValues[i] = aoTemp[i];
      }
      return aoValues;
   }
   
   private static int[] initializeValueCountArray(Card[] aoCards)
   {
      int[] aiValueCount = new int[DeckConstants.Value.NUM_VALUES];
      for (int i = 0; i < aiValueCount.length; i++)
      {
         aiValueCount[i] = 0;
      }
      
      for (int i = 0; i < aoCards.length; i++)
      {
         aiValueCount[aoCards[i].getValue().getIndex()]++;
      }
      
      return aiValueCount;
   }
   
   private static Value[] getKickers(int[] aiValueCount, int iKickersNeeded)
   {
      Value[] aoKickers = new Value[iKickersNeeded];
      int iKickersFound = 0;
      for (int i = DeckConstants.Value.NUM_VALUES - 1; i >= 0; i--)
      {
         if (aiValueCount[i] > 0)
         {
            aoKickers[iKickersFound] = Value.valueFromIndex(i);
            iKickersFound++;
            if (iKickersFound == iKickersNeeded)
            {
               break;
            }
         }
      }
      return aoKickers;
   }
   
   private static void sort(Value[] aoValues)
   {
      int iNumValues = aoValues.length;
      boolean bDoMore = true;
      while (bDoMore)
      {
         iNumValues--;
         bDoMore = false;
         for (int i = 0; i < iNumValues; i++)
         {
            if (aoValues[i].getIndex() < aoValues[i + 1].getIndex())
            {
               Value oValue = aoValues[i];
               aoValues[i] = aoValues[i + 1];
               aoValues[i + 1] = oValue;
               bDoMore = true;
            }
         }
      }
   }
}
