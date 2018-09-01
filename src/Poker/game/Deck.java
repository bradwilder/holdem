package Poker.game;

import java.util.Random;

public class Deck
{
   private static Card[] CARDS;
   
   private Card[] deck = new Card[DeckConstants.NUM_CARDS];
   private int cardIndex;
   private Random random;
   
   static
   {
      for (int i = 0; i < DeckConstants.NUM_CARDS; i++)
      {
         CARDS[i] = new Card(i);
      }
   }
   
   public Deck()
   {
      shuffle();
   }
   
   public void shuffle()
   {
      cardIndex = 0;
      long lSeed = System.nanoTime() / 1000;
      random = new Random(lSeed);
      
      int remaining = DeckConstants.NUM_CARDS;
      for (int i = 0; i < DeckConstants.NUM_CARDS; i++)
      {
         int randomIndex = random.nextInt(remaining);
         deck[i] = CARDS[randomIndex];
         remaining--;
      }
   }
   
   public Card dealCard()
   {
      if (cardIndex == DeckConstants.NUM_CARDS - 1)
      {
         return null;
      }
      
      return CARDS[cardIndex++];
   }
}
