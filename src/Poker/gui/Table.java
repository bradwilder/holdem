package Poker.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.ScrollPane;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Timer;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.border.LineBorder;

import Poker.game.Card;
import Poker.game.HoldEm;
import Poker.game.HoldEmEvents;
import Poker.game.Player;
import Poker.game.Pot;
import Poker.gui.custom.Audio;
import Poker.gui.custom.DeckStyle;
import Poker.gui.custom.Decks;
import Poker.gui.custom.FeltColors;

public class Table extends JComponent implements HoldEmEvents
{
   private static final long serialVersionUID = -5160981359011917822L;
   
   private static final int s_iNumPlayersInStrip = 5;
   
   protected HoldEm m_oGame;              // the current game
   protected PlayerComponent Players[];   // the array of PlayerComponents
   protected PlayerStripComponent top;    // the top row of players
   protected PlayerStripComponent bottom; // the bottom row of players
   protected InnerTable inner;            // the inner part of the table
   protected Timer timer;
   
   /**
    * Basic constructor
    * @param game the HoldEm game to play on this component
    * @param screenHeight the height of the component
    * @param screenWidth the width of the component
    */
   public Table(HoldEm game)
   {
      m_oGame = game;
      m_oGame.addEventListener(this);
      
      int screenWidth = (int) GUIConstants.tableSize.getWidth();
      int screenHeight = (int) GUIConstants.tableSize.getHeight();
      Dimension stripSize = new Dimension(screenWidth, screenHeight / 4);
      Dimension playerSize = new Dimension(screenWidth / s_iNumPlayersInStrip, screenHeight / 4);
      
      setLayout(new BorderLayout());
      
      Players = new PlayerComponent[10];
      PlayerComponent Plr5to1[] = new PlayerComponent[s_iNumPlayersInStrip];
      PlayerComponent Plr6to10[] = new PlayerComponent[s_iNumPlayersInStrip];
      boolean isSimulation = game.isSimulation();
      int playersNum = game.getPlayersCount();
      for (int i = 0; i < 10; i++)
      {
         if (i < playersNum)
         {
            Players[i] = new PlayerComponent(game.getPlayer(i), i, isSimulation, game, playerSize);
         }
         else
         {
            Players[i] = new PlayerComponent(null, i, isSimulation, game, playerSize);
         }
      }
         
      for (int i = 0; i < s_iNumPlayersInStrip; i++)
      {
         Plr5to1[s_iNumPlayersInStrip - 1 - i] = Players[i]; // 4-i to swap positions (4-0)
         Plr6to10[i] = Players[s_iNumPlayersInStrip + i]; // i+5 to get 5-9
      }
      
      bottom = new PlayerStripComponent(Plr5to1, stripSize);
      top = new PlayerStripComponent(Plr6to10, stripSize);
      add(top, BorderLayout.NORTH);
      add(bottom, BorderLayout.SOUTH);
   }
   
   public void holesDealt()
   {
      Audio.playHolesAudio();
   }
   
   public void flopDealt()
   {
      Audio.playFlopAudio();
   }
   
   public void turnRiverDealt()
   {
      Audio.playTurnRiverAudio();
   }
   
   private static class PlayerStripComponent extends JComponent
   {
      private static final long serialVersionUID = -4342436498344787705L;
            
      private PlayerComponent players[];
      private Dimension m_oDimension;
      
      /**
       * Default constructor
       * @param players the Players this component represents
       */
      public PlayerStripComponent(PlayerComponent players[], Dimension oDimension)
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         
         this.players = new PlayerComponent[s_iNumPlayersInStrip];
         for (int i = 0; i < s_iNumPlayersInStrip; i++)
         {
            this.players[i] = players[i];
            add(this.players[i]);
         }
         
         m_oDimension = oDimension;
      }
      
      public Dimension getPreferredSize()
      {
         return m_oDimension;
      }
   }
   
   private class DeckWindow extends JFrame
   {
      private static final long serialVersionUID = 7404379619191288745L;
      
      DeckPanel deckPane;
      
      public DeckWindow()
      {
         super("Deck Options");
         
         deckPane = new DeckPanel();
         deckPane.setOpaque(true);
         setContentPane(deckPane);
         
         pack();
         setVisible(true);
      }
      
      private class DeckPanel extends JPanel implements ActionListener, MouseListener
      {
         private static final long serialVersionUID = -3908051229681360441L;
         
         private ScrollPane scrollPane;
         private PicturePanel picturePanel;
         private BackPanel backPanel;
         
         JButton select;
         ButtonGroup group;
//         JFrame frame;
         
         private class PicturePanel extends JComponent
         {
            private static final long serialVersionUID = 8926442100401207573L;
            
            JLabel[] pictures;
//            String backPath;
            
            public PicturePanel()
            {
               setLayout(new GridLayout(0, 4, 15, 15));
               setPreferredSize(new Dimension(400, 150));
               
               pictures = new JLabel[4];
               for (int i = 0; i < 4; i++)
               {
                  pictures[i] = new JLabel();
                  pictures[i].setPreferredSize(new Dimension(100, 150));
                  add(pictures[i]);
               }
               
               setPictures(Decks.getDefaultDeck());
            }
            
            public void setPictures(DeckStyle deckStyle)
            {
               ImageIcon[] images = deckStyle.getImageSamplesForStyle();
               for (int i = 0; i < 4; i++)
               {
                  pictures[i].setIcon(images[i]);
               }
            }
            
//            public String getBackPath()
//            {
//               return backPath;
//            }
            
            public void setBack(DeckStyle deckStyle, int backNum)
            {
               if (backNum != -1)
               {
                  pictures[3].setIcon(deckStyle.getBackImageByIndex(backNum));
               }
            }
         }
         
         private class BackPanel extends JComponent
         {
            private static final long serialVersionUID = -2367801817787294413L;
            
            private JLabel[] backs;
            private DeckStyle deckSelected;
            private int backSelected;
            private int numBacks;
            
            public BackPanel()
            {
               setLayout(new GridLayout(3, 4, 20, 20));
               setPreferredSize(new Dimension(600, 750));
               setBorder(new LineBorder(Color.BLACK, 4));
               
               backs = new JLabel[12];
               
               for (int i = 0; i < 12; i++)
               {
                  backs[i] = new JLabel();
                  backs[i].setPreferredSize(new Dimension(100, 150));
                  add(backs[i]);
               }
               
               setPictures(Decks.getDefaultDeck());
            }
            
            public void setPictures(DeckStyle deckStyle)
            {
               ImageIcon[] images = deckStyle.getBacksForStyle();
               for (int i = 0; i < 12; i++)
               {
                  if (i < images.length)
                  {
                     backs[i].setIcon(images[i]);
                  }
                  else
                  {
                     backs[i].setIcon(new ImageIcon());
                  }
               }
                              
               numBacks = images.length;
               deckSelected = deckStyle;
               backSelected = -1;
            }
            
            public JLabel getBack(int i)
            {
               return backs[i];
            }
            
            public int getBackSelected()
            {
               return backSelected;
            }
            
            public DeckStyle getDeckSelected()
            {
               return deckSelected;
            }
            
            public int getBackOffset(JLabel clicked)
            {
               for (int i = 0; i < numBacks; i++)
               {
                  if (clicked == backs[i])
                  {
                     return backSelected = i;
                  }
               }
               return 0;
            }
         }
         
         public DeckPanel()
         {
            super(new BorderLayout());
            
            picturePanel = new PicturePanel();
            backPanel = new BackPanel();
            for (int i = 0; i < 12; i++)
            {
               backPanel.getBack(i).addMouseListener(this);
            }
            
            scrollPane = new ScrollPane(ScrollPane.SCROLLBARS_ALWAYS);
            scrollPane.setPreferredSize(new Dimension(400, 600));
            
            select = new JButton("Select");
            select.addActionListener(this);
            
            int numDecks = Decks.getNumDecks();
            DeckStyle[] deckStyles = Decks.getDecks();
            
            JRadioButton[] deckButtons = new JRadioButton[numDecks];
            group = new ButtonGroup();
            JPanel radioPanel = new JPanel(new GridLayout(0, 1));
            for (int i = 0; i < numDecks; i++)
            {
               DeckStyle deckStyle = deckStyles[i];
               deckButtons[i] = new JRadioButton(deckStyle.toString());
               deckButtons[i].setActionCommand(deckStyle.toString());
               group.add(deckButtons[i]);
               deckButtons[i].addActionListener(this);
               radioPanel.add(deckButtons[i]);
            }
            
            deckButtons[0].setSelected(true);
            
            scrollPane.add(radioPanel);
            add(scrollPane, BorderLayout.WEST);
            add(picturePanel, BorderLayout.CENTER);
            add(select, BorderLayout.SOUTH);
            add(backPanel, BorderLayout.EAST);
            setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
         }
         
         public void actionPerformed(ActionEvent e)
         {
            String selection = group.getSelection().getActionCommand();
            DeckStyle selectedDeck = Decks.getDeckByName(selection);
            if (e.getSource() == select)
            {
               int backNum = backPanel.getBackSelected();
               if (backNum != -1)
               {
                  selectedDeck.setSelectedBack(backNum);
               }
               DeckStyle.setSelectedDeckStyle(selectedDeck);
               updateDeck();
               exit();
            }
            else
            {
               picturePanel.setPictures(selectedDeck);
               backPanel.setPictures(selectedDeck);
            }
         }
         
         public void mouseClicked(MouseEvent e)
         {
            JLabel source = (JLabel) e.getComponent();
            int offset = backPanel.getBackOffset(source);
            picturePanel.setBack(backPanel.getDeckSelected(), offset);
         }
         
         public void mousePressed(MouseEvent e)
         {}
         
         public void mouseReleased(MouseEvent e)
         {}
         
         public void mouseEntered(MouseEvent e)
         {}
         
         public void mouseExited(MouseEvent e)
         {}
      }
      
      private void exit()
      {
         setVisible(false);
         dispose();
      }
   }
   
   protected void updateBoard()
   {
      switch (m_oGame.getState())
      {
         case BET_FLOP:
         case DEAL_TURN:
            inner.addFlop(getCardIcons(m_oGame.getFlop()));
            break;
         case BET_TURN:
         case DEAL_RIVER:
            inner.addTurn(getCardIcon(m_oGame.getTurn()));
            break;
         case BET_RIVER:
         case WINNER:
            inner.addRiver(getCardIcon(m_oGame.getRiver()));
            break;
         default:
            inner.clearCards();
      }
   }
   
   private ImageIcon[] getCardIcons(Card[] aoCards)
   {
      ImageIcon[] aoIcons = new ImageIcon[aoCards.length];
      for (int i = 0; i < aoCards.length; i++)
      {
         aoIcons[i] = getCardIcon(aoCards[i]);
      }
      
      return aoIcons;
   }
   
   private ImageIcon getCardIcon(Card oCard)
   {
      return DeckStyle.getSelectedDeckStyle().getCardImage(oCard);
   }
   
   protected void updatePlayerHands()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].setCurrHand(m_oGame.getBoard());
      }
   }
   
   protected void updatePlayerChips()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].updateChipInfo();
      }
   }
   
   protected void resetPlayers()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].reset();
      }
   }
   
   protected void resetCardsPlayers()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].resetCards();
      }
   }
   
   protected void clearPlayers()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].clear();
      }
   }
   
   protected void peekPlayers()
   {
      for (int i = 0; i < m_oGame.getMainPlayersCount(); i++)
      {
         Players[m_oGame.getMainPlayer(i).getPosition()].Peek();
      }
   }
   
   protected void peekPlayers(Pot oPot)
   {
      Iterator<Player> oPlayers = oPot.getPlayers().iterator();
      while (oPlayers.hasNext())
      {
         Player oPlayer = oPlayers.next();
         Players[oPlayer.getPosition()].Peek();
      }
   }
   
   protected void clearPlayersAction()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].clearActionRound();
      }
   }
   
   protected void setWinnerBorder(ArrayList<Player> winner)
   {
      for (int i = 0; i < winner.size(); i++)
      {
         Players[winner.get(i).getPosition()].setBorderWinner();
      }
   }
   
   protected void resetWinnerBorder(ArrayList<Player> winner)
   {
      for (int i = 0; i < winner.size(); i++)
      {
         Players[winner.get(i).getPosition()].setBorderStandard();
      }
   }
   
   public InnerTable getInner()
   {
      return inner;
   }
   
   public void changeTableColor()
   {
      Color color = FeltColors.chooseFeltColor();
      if (color != null)
      {
         inner.changeBoardColor(color);
         for (int i = 0; i < 10; i++)
         {
            if (Players[i].hasPlayer())
            {
               Players[i].changeHolesColor(color);
            }
         }
      }
   }
   
   public void toggleSounds()
   {
      Audio.toggleSounds();
   }
   
   public void changeDeck()
   {
      new DeckWindow();
   }
   
   private void updateDeck()
   {
      updatePlayersDeck();
      refreshBoard();
   }
   
   private void updatePlayersDeck()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].refreshDeck();
      }
   }
   
   private void refreshBoard()
   {
      switch (m_oGame.getState())
      {
         case WINNER:
         case BET_RIVER:
            inner.addRiver(getCardIcon(m_oGame.getRiver()));
         case DEAL_RIVER:
         case BET_TURN:
            inner.addTurn(getCardIcon(m_oGame.getTurn()));
         case DEAL_TURN:
         case BET_FLOP:
            inner.addFlop(getCardIcons(m_oGame.getFlop()));
         default:
            // TODO: throw exception here maybe?
      }
   }
   
   public Dimension getPreferredSize()
   {
      return GUIConstants.tableSize;
   }
}
