package Poker.gui.custom;

import java.util.HashMap;
import java.util.Map;

public class Decks
{
   private static final String DEFAULT_DECK_NAME = "Default";
   
   private static final DeckStyle[] DECKS = { new DeckStyle(DEFAULT_DECK_NAME, DEFAULT_DECK_NAME, DEFAULT_DECK_NAME),
                                              new DeckStyle("Classic", "Classic", "Classic"),
                                              new DeckStyle("CasinoBW", "Casino B&W"),
                                              new DeckStyle("Simple", "Simple", "Variety"),
                                              new DeckStyle("NoFaces", "No Faces"),
                                              new DeckStyle("Corners", "Corners", "Variety"),
                                              new DeckStyle("Xes", "Xes", "Variety"),
                                              new DeckStyle("Round", "Round"),
                                              new DeckStyle("SlightlyStylized", "Slightly Stylized"),
                                              new DeckStyle("Linux", "Linux"),
                                              new DeckStyle("Konqi", "Konqi", "Konqi"),
                                              new DeckStyle("MarineLife", "Marine Life", "MarineLife"),
                                              new DeckStyle("Fantasy", "Fantasy"),
                                              new DeckStyle("Nu-Mam", "Nu-Mam", "Nu-Mam"),
                                              new DeckStyle("Courtly", "Courtly", DEFAULT_DECK_NAME),
                                              new DeckStyle("Shakespeare", "Shakespeare"),
                                              new DeckStyle("French", "French"),
                                              new DeckStyle("JoanOfArc", "Joan Of Arc"),
                                              new DeckStyle("Liege", "Liege"),
                                              new DeckStyle("Revolution1", "Revolution1"),
                                              new DeckStyle("Revolution2", "Revolution2"),
                                              new DeckStyle("Revolution3", "Revolution3"),
                                              new DeckStyle("MigeonCostume", "Migeon Costume"),
                                              new DeckStyle("Ladies", "Ladies"),
                                              new DeckStyle("Houbigant", "Houbigant"),
                                              new DeckStyle("PrinceCharles", "Prince Charles", "PrinceCharles"),
                                              new DeckStyle("Divine", "Divine"),
                                              new DeckStyle("Briscola", "Briscola", "Briscola"),
                                              new DeckStyle("UkiyoeSharaku", "Ukiyoe Sharaku"),
                                              new DeckStyle("UkiyoeFuji", "Ukiyoe Fuji", "UkiyoeFuji"),
                                              new DeckStyle("IndiaPantheon", "India Pantheon"),
                                              new DeckStyle("Deck1750", "1750"),
                                              new DeckStyle("Traugott1800", "Traugott 1800"),
                                              new DeckStyle("Traugott1834", "Traugott 1834"),
                                              new DeckStyle("Gortz1841", "Gortz 1841"),
                                              new DeckStyle("Gortz1842", "Gortz 1842"),
                                              new DeckStyle("Culemann1850a", "Culemann 1850 a"),
                                              new DeckStyle("Culemann1850b", "Culemann 1850 b"),
                                              new DeckStyle("Grimaud1890", "Grimaud 1890"),
                                              new DeckStyle("DondorfWhist", "Dondorf Whist") };
   
   private static final Map<String, DeckStyle> deckMap;
   
   static
   {
      deckMap = new HashMap<String, DeckStyle>();
      
      for (DeckStyle deckStyle : DECKS)
      {
         deckMap.put(deckStyle.toString(), deckStyle);
      }
   }
   
   public static DeckStyle getDefaultDeck()
   {
      return getDeckByName(DEFAULT_DECK_NAME);
   }
   
   public static DeckStyle getDeckByName(String name)
   {
      return deckMap.get(name);
   }
   
   public static int getNumDecks()
   {
      return deckMap.size();
   }
   
   public static DeckStyle[] getDecks()
   {
      return DECKS;
   }
}
