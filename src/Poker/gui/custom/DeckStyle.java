package Poker.gui.custom;

import java.io.File;

import javax.swing.ImageIcon;

import Poker.game.Card;
import Poker.game.DeckConstants.Suit;
import Poker.game.DeckConstants.Value;

public class DeckStyle
{
   private static DeckStyle selectedDeckStyle = null;
   
   private static final int DEFAULT_BACK_INDEX = 53;
   
   private static final String CARDS_DIR          = System.getProperty("user.dir") + "/cards/",
                               BACKS_EXTERNAL_DIR = CARDS_DIR + "backs/",
                               CARDS_EXT          = ".png";
   
   private String deckPath;
   private String backPath;
   private int selectedBackIndex;
   private String name;
   
   public static DeckStyle getSelectedDeckStyle()
   {
      if (selectedDeckStyle == null)
      {
         selectedDeckStyle = Decks.getDefaultDeck();
      }
      return selectedDeckStyle;
   }
   
   public static void setSelectedDeckStyle(DeckStyle deckStyle)
   {
      selectedDeckStyle = deckStyle;
   }
   
   public DeckStyle(String path, String name)
   {
      this(path, name, "");
   }
   
   public DeckStyle(String path, String name, String externalBackDir)
   {
      deckPath = constructFullPathForDeck(path);
      backPath = constructFullPathForBack(externalBackDir, path);
      selectedBackIndex = 0;
      this.name = name;
   }
   
   public String toString()
   {
      return name;
   }
   
   public ImageIcon[] getImageSamplesForStyle()
   {
      ImageIcon[] images = new ImageIcon[4];
      images[0] = getCardImage(new Card(Suit.SPADES, Value.ACE));
      images[1] = getCardImage(new Card(Suit.HEARTS, Value.TWO));
      images[2] = getCardImage(new Card(Suit.CLUBS, Value.QUEEN));
      images[3] = new ImageIcon(constructDefaultBackFileName());
      return images;
   }
   
   public ImageIcon[] getBacksForStyle()
   {      
      ImageIcon[] images;
      if (deckPath.equals(backPath))
      {
         images = new ImageIcon[1];
         images[0] = new ImageIcon(constructDefaultBackFileName());
      }
      else
      {
         int numBacks = new File(backPath).listFiles().length;
         images = new ImageIcon[numBacks];
         for (int i = 0; i < numBacks; i++)
         {
            images[i] = new ImageIcon(constructBackFileName(backPath, i));
         }
      }
      
      return images;
   }
   
   public ImageIcon getCardImage(Card card)
   {
      return new ImageIcon(deckPath + card.getCode() + CARDS_EXT);
   }
   
   public ImageIcon getBackImage()
   {
      return new ImageIcon(constructBackFileName(backPath, selectedBackIndex));
   }
   
   public ImageIcon getBackImageByIndex(int index)
   {
      return new ImageIcon(constructBackFileName(backPath, index));
   }
   
   private String constructDefaultBackFileName()
   {
      return constructBackFileName(deckPath, 0);
   }
   
   private String constructBackFileName(String backPath, int backIndex)
   {
      return backPath + getBackNumFromIndex(backIndex) + CARDS_EXT;
   }
   
   public void setSelectedBack(int index)
   {
      selectedBackIndex = index;
   }
   
   private static String constructFullPathForDeck(String newDeckDir)
   {
      return CARDS_DIR + newDeckDir + "/";
   }
   
   private static String constructFullPathForBack(String externalBackDir, String deckPath)
   {
      if (externalBackDir.equals(""))
      {
         return constructFullPathForDeck(deckPath);
      }
      else
      {
         return BACKS_EXTERNAL_DIR + externalBackDir + "/";
      }
   }
   
   private static int getBackNumFromIndex(int backIndex)
   {
      return backIndex + DEFAULT_BACK_INDEX;
   }
}