package Poker.tests;

import java.util.ArrayList;

import junit.framework.TestCase;
import Poker.game.Chip;
import Poker.game.Deck;
import Poker.game.HoldEm;
import Poker.game.HoldEmState;
import Poker.game.GameState;
import Poker.game.Player;
import Poker.game.PlayerAction;

public class HoldEmTest extends TestCase
{
   private HoldEm game;
   private ArrayList<Player> playerList;
   
   public void testNoLimit()
   {
      Player[] players = new Player[6];
      players[0] = new Player("0", 0);
      players[1] = new Player("1", 1);
      players[2] = new Player("2", 2);
      players[3] = new Player("3", 3);
      players[4] = new Player("4", 4);
      players[5] = new Player("5", 5);
      
      playerList = new ArrayList<Player>();
      for (int i = 0; i < 6; i++)
      {
         playerList.add(players[i]);
      }
      
      game = new HoldEm(playerList, false, new Deck());
      game.startHand();
      
      Player player0 = game.getPlayer(0);
      Player player1 = game.getPlayer(1);
      Player player2 = game.getPlayer(2);
      Player player3 = game.getPlayer(3);
      Player player4 = game.getPlayer(4);
      Player player5 = game.getPlayer(5);
      
      verifyHoldEm(HoldEmState.BLINDS, player0, 0, 0, Chip.BIG_BLIND / 2, 0);
      
      GameState gameState = game.generateNextAction();
      
      try
      {
         gameState = game.Bet(gameState.playerAction.call);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BLINDS, player1, 0, 0, Chip.BIG_BLIND, 10);
      
      try
      {
         gameState = game.Bet(gameState.playerAction.call);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 30);
      
      gameState = game.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, player2, 40, 2000, 20, 30);
      
      try
      {
         gameState = game.Bet(50);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player2.getChips() == 1950);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player3, 80, 2000, 50, 80);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player3.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player4, 80, 2000, 50, 80);
      
      try
      {
         gameState = game.Bet(90);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player4.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player5, 130, 2000, 90, 170);
      
      try
      {
         gameState = game.Bet(90);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player5.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player0, 120, 1990, 80, 260);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player1, 110, 1980, 70, 260);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player2, 80, 1950, 40, 260);
      
      try
      {
         gameState = game.Bet(40);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player2.getChips() == 1910);
      verifyHoldEm(HoldEmState.DEAL_FLOP, 300);
      
      gameState = game.deal();
      verifyHoldEm(HoldEmState.BET_FLOP, player2, 20, 1910, 0, 300);
      
      try
      {
         gameState = game.Check();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player2.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_FLOP, player4, 20, 1910, 0, 300);
      
      try
      {
         gameState = game.Bet(70);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player4.getChips() == 1840);
      verifyHoldEm(HoldEmState.BET_FLOP, player5, 140, 1910, 70, 370);
      
      try
      {
         gameState = game.Bet(470);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player5.getChips() == 1440);
      verifyHoldEm(HoldEmState.BET_FLOP, player2, 870, 1910, 470, 840);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player2.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_FLOP, player4, 800, 1840, 400, 840);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player4.getChips() == 1840);
      
      
      // TODO: figure out how to award player 5 the hand and move on to next hand
      //assertTrue(game.);
      //assertTrue(game.getState() == HoldEmState.WINNER);
      // TODO: is this necessary?
      //while (!game.isMainAwarded())
      //{
      //   game.awardPot();
      //}
      //assertTrue(player0.getChips() == 2280);
      
      /*game.startHand();
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, 10, 0);
      
      game.Bet(game.getCall());
      assertTrue(player2.getChips() == 1970);
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, 20, 10);
      
      game.Bet(game.getCall());
      assertTrue(player3.getChips() == 1890);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 0, 0, 0, 30);
      
      game.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, 40, 70, 20, 30);
      
      game.Bet(20);
      assertTrue(player4.getChips() == 1980);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 40, 90, 20, 50);
      
      game.Bet(20);
      assertTrue(player5.getChips() == 1820);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 40, 110, 20, 70);
      
      game.Bet(20);
      assertTrue(player0.getChips() == 2260);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 40, 130, 20, 90);
      
      game.Bet(20);
      assertTrue(player1.getChips() == 1970);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 30, 130, 10, 110);
      
      game.Bet(10);
      assertTrue(player2.getChips() == 1960);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 20, 120, 0, 120);
      
      game.Check();
      assertTrue(player3.getChips() == 1890);
      verifyHoldEm(HoldEmState.DEAL_FLOP, 0, 0, 0, 120);
      */
   }
   
   public void testFoldYieldsWinner()
   {
      Player[] players = new Player[6];
      players[0] = new Player("0", 0);
      players[1] = new Player("1", 1);
      players[2] = new Player("2", 2);
      players[3] = new Player("3", 3);
      players[4] = new Player("4", 4);
      players[5] = new Player("5", 5);
      
      playerList = new ArrayList<Player>();
      for (int i = 0; i < 6; i++)
      {
         playerList.add(players[i]);
      }
      
      game = new HoldEm(playerList, false, new Deck());
      game.startHand();
      
      Player player0 = game.getPlayer(0);
      Player player1 = game.getPlayer(1);
      Player player2 = game.getPlayer(2);
      Player player3 = game.getPlayer(3);
      Player player4 = game.getPlayer(4);
      Player player5 = game.getPlayer(5);
      
      verifyHoldEm(HoldEmState.BLINDS, player0, 0, 0, Chip.BIG_BLIND / 2, 0);
      
      GameState gameState = game.generateNextAction();
      
      try
      {
         gameState = game.Bet(gameState.playerAction.call);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BLINDS, player1, 0, 0, Chip.BIG_BLIND, 10);
      
      try
      {
         gameState = game.Bet(gameState.playerAction.call);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 30);
      
      gameState = game.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, player2, 40, 2000, 20, 30);
      
      try
      {
         gameState = game.Bet(50);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player2.getChips() == 1950);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player3, 80, 2000, 50, 80);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player3.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player4, 80, 2000, 50, 80);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player4.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player5, 80, 2000, 50, 80);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player5.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player0, 70, 1990, 40, 80);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player1, 60, 1980, 30, 80);
      
      try
      {
         gameState = game.Fold();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.WINNER, 0);
      
      // TODO: figure out how to jump to winner state and award pot(s)
      //assertTrue(game.);
      //assertTrue(game.getState() == HoldEmState.WINNER);
      // TODO: is this necessary?
      //while (!game.isMainAwarded())
      //{
      //   game.awardPot();
      //}
      //assertTrue(player0.getChips() == 2280);
   }
   
   public void testAllInShowdown()
   {
      Player[] players = new Player[6];
      players[0] = new Player("0", 0, 100);
      players[1] = new Player("1", 1, 100);
      players[2] = new Player("2", 2, 100);
      players[3] = new Player("3", 3, 100);
      players[4] = new Player("4", 4, 10000);
      players[5] = new Player("5", 5, 100);
      
      playerList = new ArrayList<Player>();
      for (int i = 0; i < 6; i++)
      {
         playerList.add(players[i]);
      }
      
      game = new HoldEm(playerList, false, new Deck());
      game.startHand();
      
      Player player0 = game.getPlayer(0);
      Player player1 = game.getPlayer(1);
      Player player2 = game.getPlayer(2);
      Player player3 = game.getPlayer(3);
      Player player4 = game.getPlayer(4);
      Player player5 = game.getPlayer(5);
      
      verifyHoldEm(HoldEmState.BLINDS, player0, 0, 0, Chip.BIG_BLIND / 2, 0);
      
      GameState gameState = game.generateNextAction();
      
      try
      {
         gameState = game.Bet(gameState.playerAction.call);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player0.getChips() == 90);
      verifyHoldEm(HoldEmState.BLINDS, player1, 0, 0, Chip.BIG_BLIND, 10);
      
      try
      {
         gameState = game.Bet(gameState.playerAction.call);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player1.getChips() == 80);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 30);
      
      gameState = game.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, player2, 40, 100, 20, 30);
      
      try
      {
         gameState = game.Bet(100);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player2.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player3, 0, 0, 100, 130);
      
      try
      {
         gameState = game.Bet(100);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player3.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player4, 0, 0, 100, 230);
      
      try
      {
         gameState = game.Bet(100);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player4.getChips() == 9900);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player5, 0, 0, 100, 330);
      
      try
      {
         gameState = game.Bet(100);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player5.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player0, 0, 0, 90, 430);
      
      try
      {
         gameState = game.Bet(90);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player0.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, player1, 0, 0, 80, 520);
      
      try
      {
         gameState = game.Bet(80);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(player1.getChips() == 0);
      verifyHoldEm(HoldEmState.DEAL_FLOP, 600);
      
      gameState = game.deal();
      verifyHoldEm(HoldEmState.DEAL_TURN, 600);
      
      gameState = game.deal();
      verifyHoldEm(HoldEmState.DEAL_RIVER, 600);
      
      gameState = game.deal();
      verifyHoldEm(HoldEmState.WINNER, 600);
      
      // TODO: award winner
      //assertTrue(game.);
      //assertTrue(game.getState() == HoldEmState.WINNER);
      // TODO: is this necessary?
      //while (!game.isMainAwarded())
      //{
      //   game.awardPot();
      //}
      //assertTrue(player0.getChips() == 2280);
   }
   
   public void testRefundIncontestableBet()
   {
      
   }
   
   public void testRefundDeatPot()
   {
      
   }
   
   public void testListeners()
   {
      
   }
   
   private void verifyHoldEm(HoldEmState expectedGameState, Player player, int expectedMinRaise, int expectedMaxRaise, int expectedCall, int expectedTotalPotSize)
   {
      GameState nextAction = game.generateNextAction();
      PlayerAction playerAction = nextAction.playerAction;
      
      if (player == null)
      {
         assertTrue(playerAction == null);
      }
      else
      {
         assertTrue(playerAction.player == player);
         assertTrue(playerAction.minRaise == expectedMinRaise);
         assertTrue(playerAction.maxRaise == expectedMaxRaise);
         assertTrue(playerAction.call == expectedCall);
      }
      
      assertTrue(nextAction.state == expectedGameState);
      assertTrue(game.getTotalPotSize() == expectedTotalPotSize);
   }
   
   private void verifyHoldEm(HoldEmState expectedGameState, int expectedTotalPotSize)
   {
      GameState nextAction = game.generateNextAction();
      PlayerAction playerAction = nextAction.playerAction;
      
      assertTrue(playerAction.player == null);
      assertTrue(nextAction.state == expectedGameState);
      assertTrue(game.getTotalPotSize() == expectedTotalPotSize);
   }
}
