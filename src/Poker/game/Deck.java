package Poker.game;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Deck
{
   private List<Card> cards = new ArrayList<Card>();
   
   private Card[] deck = new Card[DeckConstants.NUM_CARDS];
   private int cardIndex;
   private Random random;
   
   private void createCards()
   {
      for (int i = 0; i < DeckConstants.NUM_CARDS; i++)
      {
         cards.add(new Card(i));
      }
   }
   
   public Deck()
   {
      shuffle();
   }
   
   public void shuffle()
   {
      createCards();
      
      cardIndex = 0;
      long lSeed = System.nanoTime() / 1000;
      random = new Random(lSeed);
      
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
      
      return deck[cardIndex++];
   }
}
