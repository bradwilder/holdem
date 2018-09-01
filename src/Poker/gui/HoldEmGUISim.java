package Poker.gui;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JFrame;

import Poker.game.HoldEm;

public class HoldEmGUISim extends JFrame implements ActionListener
{
   private static final long serialVersionUID = -7326870804239183149L;
   private TableComponentSim table;
   
   public HoldEmGUISim(HoldEm game)
   {
      super("Texas Hold 'Em Simulator");
      setSize(GUIConstants.fullScreenSize);
      setDefaultLookAndFeelDecorated(true);
      setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
      getContentPane().setLayout(new BorderLayout());
            
      table = new TableComponentSim(game);
      InnerTableComponentSim inner = (InnerTableComponentSim) table.getInner();
      inner.getDeal().addActionListener(this);
      inner.getFelt().addActionListener(this);
      inner.getSounds().addActionListener(this);
      inner.getDeck().addActionListener(this);
      getContentPane().add(table, BorderLayout.CENTER);
      
      pack();
      setVisible(true);
   }
   
   public void actionPerformed(ActionEvent event)
   {
      Object source = event.getSource();
      InnerTableComponentSim inner = (InnerTableComponentSim) table.getInner();
      
      if (source == inner.getDeal())
      {
         table.deal();
      }
      else if (source == inner.getFelt())
      {
         table.changeTableColor();
      }
      else if (source == inner.getSounds())
      {
         table.toggleSounds();
      }
      else if (source == inner.getDeck())
      {
         table.changeDeck();
      }
   }
}
