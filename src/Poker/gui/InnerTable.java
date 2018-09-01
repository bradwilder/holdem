package Poker.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GridLayout;

import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;

import Poker.gui.custom.FeltColors;

public class InnerTable extends JComponent
{
   private static final long serialVersionUID = 347994018394810853L;
   
   protected BoardComponent board;
   protected InfoComponent info;
   
   public InnerTable()
   {
      setLayout(new BorderLayout());
      
      board = new BoardComponent();
      info = new InfoComponent();
      
      add(info, BorderLayout.NORTH);
      add(board, BorderLayout.CENTER);
   }
   
   private static class BoardComponent extends JComponent
   {
      private static final long serialVersionUID = -7529817966472181099L;
      
      private JPanel cardPanels[];
      private JLabel cardLabels[];
      
      public BoardComponent()
      {
         setLayout(new GridLayout(1, 5));
         
         cardPanels = new JPanel[5];
         cardLabels = new JLabel[5];
         for (int i = 0; i < 5; i++)
         {
            cardPanels[i] = new JPanel();
            cardLabels[i] = new JLabel();
            add(cardPanels[i]);
            cardPanels[i].add(cardLabels[i]);
            cardPanels[i].setBackground(FeltColors.getDefaultColor());
         }
         
         setBorder(GUIConstants.innerstandard);
      }
      
      public void addFlop(ImageIcon[] cards)
      {
         for (int i = 0; i < 3; i++)
         {
            cardLabels[i].setIcon(cards[i]);
         }
      }
      
      public void addTurn(ImageIcon card)
      {
         cardLabels[3].setIcon(card);
      }
      
      public void addRiver(ImageIcon card)
      {
         cardLabels[4].setIcon(card);
      }
      
      public void clearCards()
      {
         for (int i = 0; i < 5; i++)
         {
            cardLabels[i].setIcon(new ImageIcon());
         }
      }
      
      private void changeColor(Color color)
      {
         for (int i = 0; i < 5; i++)
         {
            cardPanels[i].setBackground(color);
         }
      }
   }
   
   protected static class InfoComponent extends JComponent
   {
      private static final long serialVersionUID = 1448262466890984318L;
      
      protected JTextArea winner, pot, action;
      
      public InfoComponent()
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         winner = new JTextArea("WINNER", 2, 1);
         winner.setEditable(false);
         winner.setBorder(GUIConstants.innerstandard);
         winner.setFont(GUIConstants.infoFont);
         pot = new JTextArea("POT", 2, 1);
         pot.setEditable(false);
         pot.setBorder(GUIConstants.innerstandard);
         pot.setFont(GUIConstants.infoFont);
         action = new JTextArea("ACTION", 2, 1);
         action.setEditable(false);
         action.setBorder(GUIConstants.innerstandard);
         action.setFont(GUIConstants.infoFont);
         add(winner);
         add(pot);
         add(action);
      }
   }
   
   public void addFlop(ImageIcon[] cards)
   {
      board.addFlop(cards);
   }
   
   public void addTurn(ImageIcon card)
   {
      board.addTurn(card);
   }
   
   public void addRiver(ImageIcon card)
   {
      board.addRiver(card);
   }
   
   public void changeBoardColor(Color newColor)
   {
      board.changeColor(newColor);
   }
   
   public void clear()
   {
      clearCards();
      clearInfo();
   }
   
   public void clearCards()
   {
      board.clearCards();
   }
   
   private void clearInfo()
   {
      clearWinner();
      clearPot();
      clearAction();
   }
   
   public void changeWinner(String newWinner)
   {
      info.winner.setText("WINNER\n" + newWinner);
   }
   
   public void clearWinner()
   {
      info.winner.setText("WINNER");
   }
   
   public void changePot(String newPot)
   {
      info.pot.setText("POT\n" + newPot);
   }
   
   public void clearPot()
   {
      info.pot.setText("POT");
   }
   
   public void changeAction(String newAction)
   {
      info.action.setText("ACTION\n" + newAction);
   }
   
   public void clearAction()
   {
      info.action.setText("ACTION");
   }
}
