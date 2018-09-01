package Poker.game;

public final class DeckConstants
{
   public static final int NO_CARD   = 52,
                           NUM_CARDS = Suit.NUM_SUITS * Value.NUM_VALUES;
   
   public static enum Suit
   {
      SPADES  (0),
      HEARTS  (1),
      CLUBS   (2),
      DIAMONDS(3),
      NO_SUIT (99);
      
      public static final int NUM_SUITS  = 4;
      
      private final int index;
      
      Suit(int index)
      {
         this.index = index;
      }
      
      public int getIndex()
      {
         return index;
      }
      
      public static Suit suitFromIndex(int i)
      {
         if (i < 0 || i >= NUM_SUITS)
         {
            return NO_SUIT;
         }
         return values()[i];
      }
      
      public static Suit suitFromCode(int code)
      {
         if (code < 0 || code >= NUM_CARDS)
         {
            return Suit.NO_SUIT;
         }
         
         int suit = code / Value.NUM_VALUES;
         return Suit.suitFromIndex(suit);
      }
      
      public String toString()
      {
         if (index == SPADES.index)
         {
            return "Spades";
         }
         else if (index == HEARTS.index)
         {
            return "Hearts";
         }
         else if (index == CLUBS.index)
         {
            return "Clubs";
         }
         else if (index == DIAMONDS.index)
         {
            return "Diamonds";
         }
         else
         {
            return "<NO SUIT>";
         }
      }
   }
   
   public static enum Value
   {
      TWO     (0),
      THREE   (1),
      FOUR    (2),
      FIVE    (3),
      SIX     (4),
      SEVEN   (5),
      EIGHT   (6),
      NINE    (7),
      TEN     (8),
      JACK    (9),
      QUEEN   (10),
      KING    (11),
      ACE     (12),
      NO_VALUE(98);
      
      public static final int NUM_VALUES  = 13;
      
      private final int index;
      
      Value(int index)
      {
         this.index = index;
      }
      
      public int getIndex()
      {
         return index;
      }
      
      public static Value valueFromIndex(int i)
      {
         if (i < 0 || i >= NUM_VALUES)
         {
            return NO_VALUE;
         }
         return values()[i];
      }
      
      public static Value valueFromCode(int code)
      {
         if (code < 0 || code >= NUM_CARDS)
         {
            return Value.NO_VALUE;
         }
         
         int value = code % NUM_VALUES;
         return Value.valueFromIndex(value);
      }
      
      public String toString()
      {
         if (index == ACE.index)
         {
            return "Ace";
         }
         else if (index == TWO.index)
         {
            return "2";
         }
         else if (index == THREE.index)
         {
            return "3";
         }
         else if (index == FOUR.index)
         {
            return "4";
         }
         else if (index == FIVE.index)
         {
            return "5";
         }
         else if (index == SIX.index)
         {
            return "6";
         }
         else if (index == SEVEN.index)
         {
            return "7";
         }
         else if (index == EIGHT.index)
         {
            return "8";
         }
         else if (index == NINE.index)
         {
            return "9";
         }
         else if (index == TEN.index)
         {
            return "10";
         }
         else if (index == JACK.index)
         {
            return "Jack";
         }
         else if (index == QUEEN.index)
         {
            return "Queen";
         }
         else if (index == KING.index)
         {
            return "King";
         }
         else
         {
            return "<NO VALUE>";
         }
      }
   }
   
   public static int codeFromSuitValue(Suit suit, Value value)
   {
      if (suit == Suit.NO_SUIT || value == Value.NO_VALUE)
      {
         return NO_CARD;
      }
      
      return Value.NUM_VALUES * suit.getIndex() + value.getIndex();
   }
   
   public static String toString(Suit oSuit, Value oValue)
   {
      if (oSuit == Suit.NO_SUIT || oValue == Value.NO_VALUE)
      {
         return "";
      }
            
      StringBuilder cardInfo = new StringBuilder();
      cardInfo.append(oValue.toString());
      cardInfo.append(" of ");
      cardInfo.append(oSuit.toString());
      return cardInfo.toString();
   }
}
