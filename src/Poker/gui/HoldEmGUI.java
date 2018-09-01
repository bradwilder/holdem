package Poker.gui;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import Poker.game.HoldEm;

public class HoldEmGUI extends JFrame implements ActionListener, ChangeListener
{
   private static final long serialVersionUID = -5790390681107302130L;
// private static JMenuItem newGame, quitMenu; // 'File' menu items
   private static JMenuItem tableColor, sounds, deck; // 'Table' menu items
   private static JMenuItem autoPost, muckLoser, // 'Player' menu items
         showWinner, seat; // 'Player' menu items
   private TableComponent table;
   
   /**
    * Window constructor
    */
   public HoldEmGUI(HoldEm game)
   {
      super("Texas Hold 'Em");
      setSize(GUIConstants.fullScreenSize);
      setDefaultLookAndFeelDecorated(true);
      setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
      getContentPane().setLayout(new BorderLayout());
            
      setJMenuBar(createMenus());
      
      table = new TableComponent(game);
      InnerTableComponent inner = (InnerTableComponent) table.getInner();
      inner.getFold().addActionListener(this);
      inner.getCheck().addActionListener(this);
      inner.getCall().addActionListener(this);
      inner.getRaise().addActionListener(this);
      inner.getRaiseValue().addChangeListener(this);
      getContentPane().add(table, BorderLayout.CENTER);
      
      pack();
      setVisible(true);
   }
   
   /**
    * Creates the menu bar
    */
   private JMenuBar createMenus()
   {
      JMenuBar menuBar = new JMenuBar();
// JMenu FileMenu = new JMenu("File");
      JMenu TableMenu = new JMenu("Table");
      JMenu PlayerMenu = new JMenu("Player");
      JMenu PlayerBetMenu = new JMenu("Player Bet Options");
      
// newGame = new JMenuItem("New Game");
// FileMenu.add(newGame);
// newGame.addActionListener(listener);
      
// quitMenu = new JMenuItem("Quit");
// FileMenu.add(quitMenu);
// quitMenu.addActionListener(listener);
      
      tableColor = new JMenuItem("Change Felt Color");
      TableMenu.add(tableColor);
      tableColor.setEnabled(true);
      tableColor.addActionListener(this);
      
      sounds = new JMenuItem("Toggle Sound");
      TableMenu.add(sounds);
      sounds.setEnabled(true);
      sounds.addActionListener(this);
      
      deck = new JMenuItem("Deck");
      TableMenu.add(deck);
      deck.setEnabled(true);
      deck.addActionListener(this);
      
      autoPost = new JMenuItem("Auto-Post Blinds...");
      PlayerBetMenu.add(autoPost);
      autoPost.setEnabled(true);
      autoPost.addActionListener(this);
      
      muckLoser = new JMenuItem("Always Muck Losing Hand...");
      PlayerBetMenu.add(muckLoser);
      muckLoser.setEnabled(true);
      muckLoser.addActionListener(this);
      
      showWinner = new JMenuItem("Always Show Winning Hand...");
      PlayerBetMenu.add(showWinner);
      showWinner.setEnabled(true);
      showWinner.addActionListener(this);
      
      PlayerMenu.add(PlayerBetMenu);
      
      seat = new JMenuItem("Change Seats");
      PlayerMenu.add(seat);
      seat.setEnabled(true);
      seat.addActionListener(this);
      
// menuBar.add(FileMenu);
      menuBar.add(TableMenu);
      menuBar.add(PlayerMenu);
      
      return menuBar;
   }
   
   public void actionPerformed(ActionEvent event)
   {
      Object source = event.getSource();
      InnerTableComponent inner = (InnerTableComponent) table.getInner();
      
      /*
       * if (source==newGame) {
       *  } else if (source==quitMenu) {
       *  } else
       */if (source == inner.getFold())
         table.sendFold();
      else if (source == inner.getCheck())
         table.sendCall(false);
      else if (source == inner.getCall())
         table.sendCall(true);
      else if (source == inner.getRaise())
         table.sendRaise();
      else if (source == tableColor)
         table.changeTableColor();
      else if (source == sounds)
         table.toggleSounds();
      else if (source == deck)
         table.changeDeck();
      else if (source == autoPost)
      {  

      }
      else if (source == muckLoser)
      {  

      }
      else if (source == showWinner)
      {  

      }
      else if (source == seat)
      {  

      }
   }
   
   public void stateChanged(ChangeEvent event)
   {
      // if (!((JSlider) event.getSource()).getValueIsAdjusting())
      table.updateRaiseAmount();
   }
}
