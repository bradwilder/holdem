package Poker.main;

import java.util.ArrayList;

import javax.swing.JOptionPane;

import Poker.game.HoldEm;
import Poker.game.HoldEmGame;
import Poker.game.HoldEmGames;
import Poker.game.Player;
import Poker.gui.HoldEmGUI;
import Poker.gui.HoldEmGUISim;

public class Poker
{
   static HoldEm inputGame;
   static ArrayList<Player> players = new ArrayList<Player>();
   
   private static boolean searchName(String name)
   {
      for (int i = 0; i < players.size(); i++)
      {
         if (name.equals(((Player) players.get(i)).getName()))
         {
            return true;
         }
      }
      return false;
   }
   
   private static HoldEm startGame()
   {
      int playersCnt = 0;
      
      HoldEmGame gameType = HoldEmGames.SIMULATION;
      boolean isSimulation = JOptionPane.showOptionDialog(null, "Is this a simulation?", "Simulation?", 0, 3, null, null, null) == 0;
      
      if (!isSimulation)
      {
         String sGameType = (String) JOptionPane.showInputDialog(null, "Choose a game", "Game Type", JOptionPane.PLAIN_MESSAGE, null, HoldEmGames.getNames(), null);
         if (sGameType == null)
         {
            System.exit(0);
         }
         gameType = HoldEmGames.getGame(sGameType);
      }
      
      while (true)
      {
         String playersString = JOptionPane.showInputDialog(null, "Enter number of players, from 2-10", "Players?", 3);
         if (playersString == null)
         {
            System.exit(0);
         }
         try
         {
            playersCnt = Integer.parseInt(playersString);
            while (playersCnt < 2 || playersCnt > 10)
            {
               playersString = JOptionPane.showInputDialog(null, "Enter number of players, from 2-10", "Try Again.  Players?", 3);
               if (playersString == null)
               {
                  System.exit(0);
               }
               playersCnt = Integer.parseInt(playersString);
            }
            break;
         }
         catch (NumberFormatException e)
         {}
      }
      
      if (!isSimulation)
      {
         for (int i = 0; i < playersCnt; i++)
         {
            String playerName = JOptionPane.showInputDialog(null, "Enter name of player " + (i + 1), "Name?", 3);
            if (playerName == null)
            {
               System.exit(0);
            }
            
            while (playerName.equals("") || searchName(playerName))
            {
               playerName = JOptionPane.showInputDialog(null, "Enter name of player " + (i + 1), "Try Again.  Name?", 3);
               if (playerName == null)
               {
                  System.exit(0);
               }
            }
            players.add(new Player(playerName, i));
         }
      }
      else
      {
         for (int i = 0; i < playersCnt; i++)
         {
            players.add(new Player("Player " + (i + 1), i));
         }
      }
      return new HoldEm(players, isSimulation);
   }
   
   public static void main(String args[])
   {
      inputGame = startGame();
      
      javax.swing.SwingUtilities.invokeLater(new Runnable()
      {
         public void run()
         {
            if (inputGame.isSimulation())
            {
               new HoldEmGUISim(inputGame);
            }
            else
            {
               new HoldEmGUI(inputGame);
            }
         }
      });
   }
}
