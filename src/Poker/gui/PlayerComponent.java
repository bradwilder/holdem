package Poker.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.JTextField;

import Poker.game.Card;
import Poker.game.HoldEm;
import Poker.game.Player;
import Poker.gui.custom.DeckStyle;
import Poker.gui.custom.FeltColors;
import Poker.hand.Hand;

public class PlayerComponent extends JComponent implements MouseListener
{
   private static final long serialVersionUID = -1326876496947785604L;
   
   private Player player;
   private int position;
   private boolean isSimulation;
   private HoldEm game;
   private static Color currColor = FeltColors.getDefaultColor();
   private HoleCardComponent cards;
   private ActionComponent action;
   private JTextArea playerInfo;
   private HandComponent hand;
   private final JButton sitHere = new JButton("<Move Here>");
   private GUIListener listener = new GUIListener();
   private static Dimension playerSize;
   
   /**
    * Default constructor
    * @param player the Player that this component represents
    * @param position the position of this player
    */
   public PlayerComponent(Player player, int position, boolean isSimulation, HoldEm game, Dimension playerSize)
   {
      this.player = player;
      this.position = position;
      PlayerComponent.playerSize = playerSize;
      this.isSimulation = isSimulation;
      this.game = game;
      if (player != null)
      {
         setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
         if (isSimulation)
         {
            playerInfo = new JTextArea(player.getName(), 2, 1);
            action = new ActionComponent(true);
         }
         else
         {
            playerInfo = new JTextArea(player.toString(), 2, 1);
            action = new ActionComponent();
         }
         playerInfo.setFont(GUIConstants.playerFont);
         playerInfo.setEditable(false);
         cards = new HoleCardComponent(this);
         hand = new HandComponent();
         if (position / 5 == 0)
         {
            add(action);
            add(playerInfo);
            add(cards);
            add(hand);
         }
         else
         {
            add(playerInfo);
            add(cards);
            add(hand);
            add(action);
         }
      }
      else
      {
         setLayout(new BorderLayout());
         sitHere.addActionListener(listener);
         if (!isSimulation)
         {
            add(sitHere, BorderLayout.CENTER);
         }
      }
      setBorder(GUIConstants.standard);
   }
   
   private class GUIListener implements ActionListener
   {
      /**
       * This method handles button events 
       * @param event is the ActionEvent generated
       */
      public void actionPerformed(ActionEvent event)
      {
         Object source = event.getSource();
         if (source == sitHere)
         {  

         }
//         else if (source == cards.getPeek())
//         {
//            Peek();
//         }
      }
   }
   
   private static class HandComponent extends JComponent
   {
      private static final long serialVersionUID = -3386463796111105173L;
      
      private JTextField currHand, perc;
      
      public HandComponent()
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         currHand = new JTextField("");
         currHand.setEditable(false);
         perc = new JTextField("");
         perc.setEditable(false);
         add(currHand);
         add(perc);
      }
      
      public void setCurrHand(String newHand)
      {
         currHand.setText(newHand);
      }
      
      public void setPerc(String newPerc)
      {
         perc.setText(newPerc + "%");
      }
   }
   
   private static class HoleCardComponent extends JComponent
   {
      private static final long serialVersionUID = 6292857593161814141L;
      
      private JPanel cardPanels[];
      private JLabel cardLabels[];
      private boolean showing;
      private MouseListener m_oListener;
      
      /**
       * Default constructor
       */
      public HoleCardComponent(MouseListener oListener)
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         cardPanels = new JPanel[2];
         cardLabels = new JLabel[2];
         
         showing = false;
         for (int i = 0; i < 2; i++)
         {
            cardPanels[i] = new JPanel();
            cardLabels[i] = new JLabel(new ImageIcon());
            m_oListener = oListener;
            
            add(cardPanels[i]);
            cardPanels[i].add(cardLabels[i]);
            cardPanels[i].setBackground(currColor);
         }
         setBackground(currColor);
      }
      
      /**
       * Folds (clears) this player's hole cards
       */
      public void foldCards()
      {
         for (int i = 0; i < 2; i++)
         {
            cardLabels[i].setIcon(new ImageIcon());
         }
      }
      
      /**
       * Updates this player's hole cards
       * @param cards the new hole Cards
       */
      public void addFaceUp(Card cards[])
      {
         for (int i = 0; i < 2; i++)
         {
            cardLabels[i].setIcon(DeckStyle.getSelectedDeckStyle().getCardImage(cards[i]));
         }
         showing = true;
      }
      
      public void addFaceDown()
      {
         for (int i = 0; i < 2; i++)
         {
            cardLabels[i].setIcon(DeckStyle.getSelectedDeckStyle().getBackImage());
         }
         showing = false;
      }
      
      public boolean areShowing()
      {
         return showing;
      }
      
      public void enablePeek(boolean bEnabled)
      {
         if (bEnabled)
         {
            cardLabels[0].addMouseListener(m_oListener);
            cardLabels[1].addMouseListener(m_oListener);
         }
         else
         {
            cardLabels[0].removeMouseListener(m_oListener);
            cardLabels[1].removeMouseListener(m_oListener);
         }
      }
      
      private void changeColor(Color color)
      {
         currColor = color;
         for (int i = 0; i < 2; i++)
         {
            cardPanels[i].setBackground(currColor);
         }
      }
      
      /**
       * Returns the preferred screen dimensions of this component
       * @return returns the desired Dimension object
       */
      public Dimension getPreferredSize()
      {
         return new Dimension(200, 150);
      }
   }
   
   private static class ActionComponent extends JComponent
   {
      private static final long serialVersionUID = -4588558866542104934L;
      
      private JPanel dealerPanel;
      private JLabel dealerLabel;
      private JTextField betAmount;
      private JTextField chipsThisRound;
      private static final String dealerLoc = System.getProperty("user.dir") + "/dealer/dealer.png";
      private static final ImageIcon dealer = new ImageIcon(dealerLoc);
      
      /**
       * Default constructor
       */
      public ActionComponent()
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         dealerPanel = new JPanel();
         dealerLabel = new JLabel(new ImageIcon());
         add(dealerPanel);
         dealerPanel.add(dealerLabel);
         betAmount = new JTextField("");
         betAmount.setBorder(BorderFactory.createTitledBorder("Action"));
         betAmount.setHorizontalAlignment(JTextField.CENTER);
         betAmount.setEditable(false);
         chipsThisRound = new JTextField("");
         chipsThisRound.setBorder(BorderFactory.createTitledBorder("Round"));
         chipsThisRound.setHorizontalAlignment(JTextField.CENTER);
         chipsThisRound.setEditable(false);
         add(betAmount);
         add(chipsThisRound);
         setBorder(GUIConstants.light);
      }
      
      /**
       * Simulation constructor
       */
      public ActionComponent(boolean isSimulation)
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         dealerPanel = new JPanel();
         dealerLabel = new JLabel();
         add(dealerPanel);
         dealerPanel.add(dealerLabel);
         betAmount = new JTextField("");
         betAmount.setEditable(false);
      }
      
      /**
       * Returns the preferred screen dimensions of this component
       * @return returns the desired Dimension object
       */
      public Dimension getPreferredSize()
      {
         return new Dimension(200, 40);
      }
   }
   
   /**
    * Returns the table position of this player
    * @return the table position of this player
    */
   public int getPosition()
   {
      return position;
   }
   
   public void Raise(int bet)
   {
      updateAction("Raise " + bet);
   }
   
   public void Call(int call)
   {
      updateAction("Call " + call);
   }
   
   public void Check()
   {
      updateAction("Check");
   }
   
   public void Fold()
   {
      foldCards();
      updateAction("Fold");
   }
   
   public void clear()
   {
      foldCards();
      clearDealer();
      clearActionRound();
   }
   
   public void clearActionRound()
   {
      clearAction();
      clearChipsThisRound();
   }
   
   /**
    * Folds this players hole cards
    */
   private void foldCards()
   {
      cards.foldCards();
      clearCurrHand();
   }
   
   public void enablePeek()
   {
      cards.enablePeek(true);
   }
   
   public void disablePeek()
   {
      cards.enablePeek(false);
   }
   
   private void showCards()
   {
      cards.addFaceUp(player.getHoleCards());
      // TODO: figure out a way to get the board cards in here
//         setCurrHand();
   }
   
   private void hideCards()
   {
      cards.addFaceDown();
      clearCurrHand();
   }
   
   public void Peek()
   {
      if (cards.areShowing())
      {
         hideCards();
      }
      else
      {
         showCards();
      }
   }
   
   public void reset()
   {
      resetCards();
      if (!isSimulation)
      {
         updateAction("");
      }
   }

   
   public void refreshDeck()
   {
      if (player == null || !player.hasHoleCards())
      {
         return;
      }
      
      if (isSimulation)
      {
         showCards();
      }
      else if (player.hasHoleCards())
      {
         if (cards.areShowing())
         {
            showCards();
         }
         else
         {
            hideCards();
         }
      }
      else
      {
         foldCards();
      }
   }
   
   /**
    * Updates this players hole cards
    */
   public void resetCards()
   {
      if (player == null)
      {
         return;
      }
      if (isSimulation)
      {
         showCards();
      }
      else if (player.hasHoleCards())
      {
         hideCards();
      }
      else
      {
         foldCards();
      }
   }
   
   private void updateAction(String newAction)
   {
      updateChipInfo();
      setAction(newAction);
   }
   
   public void updateChipInfo()
   {
      playerInfo.setText(player.toString());
      updateChipsThisRound();
   }
   
   // TODO: figure out if there's a better way to get the board cards
   public void setCurrHand(Card[] aoBoardCards)
   {
      Hand oCurrentHand = player.getHand(aoBoardCards);
      
      if (!player.hasHoleCards() || oCurrentHand == null)
      {
         clearCurrHand();
      }
      else
      {
         hand.setCurrHand(oCurrentHand.toString());
      }
   }
   
   private void clearCurrHand()
   {
      hand.setCurrHand("");
   }
   
   public void setCurrPerc(int perc)
   {
      hand.setPerc("" + perc);
   }
   
   public void clearCurrPerc()
   {
      hand.setPerc("");
   }
   
   public void addDealer()
   {
      action.dealerLabel.setIcon(ActionComponent.dealer);
   }
   
   public void clearDealer()
   {
      action.dealerLabel.setIcon(new ImageIcon());
   }
   
   public void setAction(String newAction)
   {
      action.betAmount.setText(newAction);
   }
   
   public void clearAction()
   {
      setAction("");
   }
   
   public void updateChipsThisRound()
   {
      int chipsThisRound = game.getChipsThisRound(player);
      if (chipsThisRound == 0)
      {
         clearChipsThisRound();
      }
      else
      {
         action.chipsThisRound.setText("" + chipsThisRound);
      }
   }
   
   private void clearChipsThisRound()
   {
      action.chipsThisRound.setText("");
   }
   
   /**
    * Returns whether there is an actual Player here
    * @return whether there is an actual Player here
    */
   public boolean hasPlayer()
   {
      return (player != null);
   }
   
   public void setBorderStandard()
   {
      setBorder(GUIConstants.standard);
   }
   
   public void setBorderSelected()
   {
      setBorder(GUIConstants.selected);
   }
   
   public void setBorderWinner()
   {
      setBorder(GUIConstants.winner);
   }
   
   public void changeHolesColor(Color newColor)
   {
      cards.changeColor(newColor);
   }
   
   public void mouseClicked(MouseEvent e)
   {
      Peek();
   }
   
   public void mouseEntered(MouseEvent e)
   {
   }

   public void mouseExited(MouseEvent e)
   {
   }

   public void mousePressed(MouseEvent e)
   {
   }

   public void mouseReleased(MouseEvent e)
   {
   }
   
   /**
    * Returns the preferred screen dimensions
    * @return returns the desired Dimension object
    */
   public Dimension getPreferredSize()
   {
      return playerSize;
   }
}
