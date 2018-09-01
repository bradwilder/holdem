package Poker.gui.custom;

import java.awt.Color;

public class FeltColor
{
   private Color color;
   private String name;
   
   public FeltColor(Color color, String name)
   {
      this.color = color;
      this.name = name;
   }
   
   public Color getColor()
   {
      return color;
   }
   
   public String toString()
   {
      return name;
   }
}