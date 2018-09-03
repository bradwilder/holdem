package Poker.tests;

import java.util.ArrayList;

import junit.framework.TestCase;
import Poker.game.Chip;
import Poker.game.Deck;
import Poker.game.HoldEm;
import Poker.game.HoldEmState;
import Poker.game.Player;

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
      
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, Chip.BIG_BLIND / 2, 0);
      
      game.Bet(game.getCall());
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, Chip.BIG_BLIND, 10);
      
      game.Bet(game.getCall());
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 0, 0, 0, 30);
      
      game.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, 40, 2000, 20, 30);
      
      game.Bet(50);
      assertTrue(player2.getChips() == 1950);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 80, 2000, 50, 80);
      
      game.Fold();
      assertTrue(player3.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 80, 2000, 50, 80);
      
      game.Bet(90);
      assertTrue(player4.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 130, 2000, 90, 170);
      
      game.Bet(90);
      assertTrue(player5.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 120, 1990, 80, 260);
      
      game.Fold();
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 110, 1980, 70, 260);
      
      game.Fold();
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 80, 1950, 40, 260);
      
      game.Bet(40);
      assertTrue(player2.getChips() == 1910);
      verifyHoldEm(HoldEmState.DEAL_FLOP, 0, 0, 0, 300);
      
      game.deal();
      verifyHoldEm(HoldEmState.BET_FLOP, 20, 1910, 0, 300);
      
      game.Check();
      assertTrue(player2.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_FLOP, 20, 1910, 0, 300);
      
      game.Bet(70);
      assertTrue(player4.getChips() == 1840);
      verifyHoldEm(HoldEmState.BET_FLOP, 140, 1910, 70, 370);
      
      game.Bet(470);
      assertTrue(player5.getChips() == 1440);
      verifyHoldEm(HoldEmState.BET_FLOP, 870, 1910, 470, 840);
      
      game.Fold();
      assertTrue(player2.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_FLOP, 800, 1840, 400, 840);
      
      game.Fold();
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
      
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, Chip.BIG_BLIND / 2, 0);
      
      game.Bet(game.getCall());
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, Chip.BIG_BLIND, 10);
      
      game.Bet(game.getCall());
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 0, 0, 0, 30);
      
      game.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, 40, 2000, 20, 30);
      
      game.Bet(50);
      assertTrue(player2.getChips() == 1950);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 80, 2000, 50, 80);
      
      game.Fold();
      assertTrue(player3.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 80, 2000, 50, 80);
      
      game.Fold();
      assertTrue(player4.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 80, 2000, 50, 80);
      
      game.Fold();
      assertTrue(player5.getChips() == 2000);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 70, 1990, 40, 80);
      
      game.Fold();
      assertTrue(player0.getChips() == 1990);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 60, 1980, 30, 80);
      
      game.Fold();
      assertTrue(player1.getChips() == 1980);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 0, 0, 0);
      
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
      
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, Chip.BIG_BLIND / 2, 0);
      
      game.Bet(game.getCall());
      assertTrue(player0.getChips() == 90);
      verifyHoldEm(HoldEmState.BLINDS, 0, 0, Chip.BIG_BLIND, 10);
      
      game.Bet(game.getCall());
      assertTrue(player1.getChips() == 80);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 0, 0, 0, 30);
      
      game.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, 40, 100, 20, 30);
      
      game.Bet(100);
      assertTrue(player2.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 0, 100, 130);
      
      game.Bet(100);
      assertTrue(player3.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 0, 100, 230);
      
      game.Bet(100);
      assertTrue(player4.getChips() == 9900);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 0, 100, 330);
      
      game.Bet(100);
      assertTrue(player5.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 0, 90, 430);
      
      game.Bet(90);
      assertTrue(player0.getChips() == 0);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 0, 80, 520);
      
      game.Bet(80);
      assertTrue(player1.getChips() == 0);
      verifyHoldEm(HoldEmState.DEAL_FLOP, 0, 0, 0, 600);
      
      game.deal();
      verifyHoldEm(HoldEmState.DEAL_TURN, 0, 0, 0, 600);
      
      game.deal();
      verifyHoldEm(HoldEmState.DEAL_RIVER, 0, 0, 0, 600);
      
      game.deal();
      verifyHoldEm(HoldEmState.WINNER, 0, 0, 0, 600);
      
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
   
   private void verifyHoldEm(HoldEmState iGameState, int iMinRaise, int iMaxRaise, int iCall, int iTotalPotSize)
   {
      assertTrue(game.getState() == iGameState);
      assertTrue(game.getMinRaise() == iMinRaise);
      assertTrue(game.getMaxRaise() == iMaxRaise);
      assertTrue(game.getCall() == iCall);
      assertTrue(game.getTotalPotSize() == iTotalPotSize);
   }
}
