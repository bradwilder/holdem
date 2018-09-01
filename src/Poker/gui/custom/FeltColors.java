package Poker.gui.custom;

import java.awt.Color;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JOptionPane;

public class FeltColors
{
   private static final FeltColor[] FeltColors = { new FeltColor(new Color(69, 125, 50),   "Green"),
                                                   new FeltColor(new Color(83, 112, 84),   "Olive Green"),
                                                   new FeltColor(new Color(1, 80, 51),     "Dark Green"),
                                                   new FeltColor(new Color(71, 97, 72),    "Forest Green"),
                                                   new FeltColor(new Color(245, 69, 54),   "Red"),
                                                   new FeltColor(new Color(108, 0, 12),    "Wine"),
                                                   new FeltColor(new Color(105, 13, 50),   "Maroon"),
                                                   new FeltColor(new Color(97, 39, 35),    "Blackberry"),
                                                   new FeltColor(new Color(97, 56, 54),    "Burgundy"),
                                                   new FeltColor(new Color(76, 57, 61),    "Plum"),
                                                   new FeltColor(new Color(95, 50, 107),   "Deep Purple"),
                                                   new FeltColor(new Color(89, 33, 72),    "Purple"),
                                                   new FeltColor(new Color(143, 101, 113), "Lavender"),
                                                   new FeltColor(new Color(32, 74, 73),    "Teal"),
                                                   new FeltColor(new Color(63, 99, 131),   "Light Blue"),
                                                   new FeltColor(new Color(37, 38, 86),    "Royal Blue"),
                                                   new FeltColor(new Color(13, 44, 73),    "Midnight Blue") };
   
   private static final Map<String, FeltColor> feltColorMap;
   
   static
   {
      feltColorMap = new HashMap<String, FeltColor>();
      
      for (FeltColor feltColor : FeltColors)
      {
         feltColorMap.put(feltColor.toString(), feltColor);
      }
   }
   
   private static String[] getNames()
   {
      String[] colorNames = new String[FeltColors.length];
      for (int i = 0; i < FeltColors.length; i++)
      {
         colorNames[i] = FeltColors[i].toString();
      }
      return colorNames;
   }
   
   public static Color getDefaultColor()
   {
      return FeltColors[0].getColor();
   }
   
   public static Color chooseFeltColor()
   {
      String[] asColorNames = getNames();
      String newColor = (String) JOptionPane.showInputDialog(null, "Choose a new felt color", "Felt Color?", JOptionPane.QUESTION_MESSAGE, null, asColorNames, null);
      if (newColor == null)
      {
         return null;
      }
      else
      {
         return feltColorMap.get(newColor).getColor();
      }
   }
}
