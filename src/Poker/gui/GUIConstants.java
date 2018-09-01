package Poker.gui;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Toolkit;

import javax.swing.border.LineBorder;

public final class GUIConstants
{
   // From PlayerComponent
   public static final LineBorder standard = new LineBorder(Color.BLACK, 2);
   public static final LineBorder light = new LineBorder(Color.BLACK, 1);
   public static final LineBorder selected = new LineBorder(Color.YELLOW, 2);
   public static final LineBorder winner = new LineBorder(Color.RED, 2);
   public static final Font playerFont = new Font("SansSerif", Font.BOLD, 16);
   
   // From InnerTable
   public static final Font infoFont = new Font("SansSerif", Font.BOLD, 14);
   public static final LineBorder innerstandard = new LineBorder(Color.BLACK, 1);
   
   public static final Dimension fullScreenSize = Toolkit.getDefaultToolkit().getScreenSize();
   
   public static final Dimension tableSize = fullScreenSize;
}
