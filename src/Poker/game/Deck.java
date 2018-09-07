package Poker.game;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class Deck
{
   private Integer[] deck = new Integer[DeckConstants.NUM_CARDS];
   private int cardIndex;
   
   public Deck()
   {
      for (int i = 0; i < DeckConstants.NUM_CARDS; i++)
      {
         deck[i] = i;
      }
   }
   
   public void shuffle()
   {
      List<Integer> cards = Arrays.asList(deck);
      
      cardIndex = 0;
      long lSeed = System.nanoTime() / 1000;
      Random random = new Random(lSeed);
      
      int remaining = DeckConstants.NUM_CARDS;
      for (int i = 0; i < DeckConstants.NUM_CARDS; i++)
      {
         int randomIndex = random.nextInt(remaining);
         deck[i] = cards.remove(randomIndex);
         remaining--;
      }
   }
   
   public Card dealCard()
   {
      if (cardIndex == DeckConstants.NUM_CARDS - 1)
      {
         return null;
      }
      
      return new Card(deck[cardIndex++]);
   }
}
