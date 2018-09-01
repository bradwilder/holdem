package Poker.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JComponent;

public class InnerTableComponentSim extends InnerTable
{
   private static final long serialVersionUID = -5522339643668771650L;
   
   private ButtonPanel buttons;
   
   public InnerTableComponentSim()
   {
      super();
      buttons = new ButtonPanel();
      add(buttons, BorderLayout.SOUTH);
      clear();
   }
   
   private static class ButtonPanel extends JComponent
   {
      private static final long serialVersionUID = 7038234100831765330L;
      
      private JButton deal, felt, sounds, deck;
      
      public ButtonPanel()
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         
         deal = new JButton("Deal");
         deal.setBackground(Color.LIGHT_GRAY);
         deal.setEnabled(true);
         felt = new JButton("Felt");
         felt.setBackground(Color.LIGHT_GRAY);
         felt.setEnabled(true);
         sounds = new JButton("Sounds");
         sounds.setBackground(Color.LIGHT_GRAY);
         sounds.setEnabled(true);
         deck = new JButton("Deck");
         deck.setBackground(Color.LIGHT_GRAY);
         deck.setEnabled(true);
         add(deal);
         add(felt);
         add(sounds);
         add(deck);
      }
      
      public Dimension getPreferredSize()
      {
         return new Dimension(1024, 50);
      }
   }
   
   public JButton getDeal()
   {
      return buttons.deal;
   }
   
   public JButton getFelt()
   {
      return buttons.felt;
   }
   
   public JButton getSounds()
   {
      return buttons.sounds;
   }
   
   public JButton getDeck()
   {
      return buttons.deck;
   }
   
   public void clearPot()
   {
      info.pot.setText("");
   }
   
   public void clearAction()
   {
      info.action.setText("");
   }
}
