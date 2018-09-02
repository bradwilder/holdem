package Poker.tests;

import java.util.ArrayList;

import junit.framework.TestCase;
import Poker.game.Chip;
import Poker.game.HoldEm;
import Poker.game.HoldEmState;
import Poker.game.Player;

public class HoldEmTest extends TestCase
{
   private HoldEm m_oHoldEm;
   private ArrayList<Player> m_oPlayerList;
   
   public HoldEmTest(String name)
   {
      super(name);
   }
   
   protected void setUp() throws Exception
   {
      super.setUp();
      Player[] players = new Player[6];
      players[0] = new Player("brad", 0);
      players[1] = new Player("jeff", 1);
      players[2] = new Player("matt", 2);
      players[3] = new Player("mitch", 3);
      players[4] = new Player("dad", 4);
      players[5] = new Player("brenda", 5);
      
      m_oPlayerList = new ArrayList<Player>();
      for (int i = 0; i < 6; i++)
      {
         m_oPlayerList.add(players[i]);
      }
   }
   
   protected void tearDown() throws Exception
   {
      super.tearDown();
   }
   
   public void testPotLimit()
   {
      m_oHoldEm = new HoldEm(m_oPlayerList, false);
      m_oHoldEm.startHand();
      
      Player bradPlayer = m_oHoldEm.getPlayer(0);
      Player jeffPlayer = m_oHoldEm.getPlayer(1);
      Player mattPlayer = m_oHoldEm.getPlayer(2);
      Player mitchPlayer = m_oHoldEm.getPlayer(3);
      Player dadPlayer = m_oHoldEm.getPlayer(4);
      Player brendaPlayer = m_oHoldEm.getPlayer(5);
      
      //assertTrue(m_oHoldEm.getSmallBlind() == Chip.BIG_BLIND / 2);
      //assertTrue(m_oHoldEm.getBigBlind() == Chip.BIG_BLIND);
      assertTrue(m_oHoldEm.getDealerPos() == 0);
      assertTrue(m_oHoldEm.getMainPlayersCount() == 6);
      assertTrue(m_oHoldEm.getMainPlayer(0).getName().equals("jeff"));
      assertTrue(m_oHoldEm.getMainPlayer(1).getName().equals("matt"));
      assertTrue(m_oHoldEm.getMainPlayer(2).getName().equals("mitch"));
      assertTrue(m_oHoldEm.getMainPlayer(3).getName().equals("dad"));
      assertTrue(m_oHoldEm.getMainPlayer(4).getName().equals("brenda"));
      assertTrue(m_oHoldEm.getMainPlayer(5).getName().equals("brad"));
      verifyHoldEm(HoldEmState.BLINDS, 1, 0, 0, Chip.BIG_BLIND / 2, "jeff\nPost Small Blind Of " + m_oHoldEm.getCall() + "?", 0, "Main Pot (0)");
      
      m_oHoldEm.Bet(m_oHoldEm.getCall());
      assertTrue(jeffPlayer.getChips() == 1990);
      verifyHoldEm(HoldEmState.BLINDS, 2, 0, 0, Chip.BIG_BLIND, "matt\nPost Big Blind Of " + m_oHoldEm.getCall() + "?", 10, "Main Pot (10)");
      
      m_oHoldEm.Bet(m_oHoldEm.getCall());
      assertTrue(mattPlayer.getChips() == 1980);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 3, 0, 0, 0, "", 30, "Main Pot (30)");
      
      m_oHoldEm.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, 3, 40, 70, 20, "mitch\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 30, "Main Pot (30)");
      
      m_oHoldEm.Bet(50);
      assertTrue(mitchPlayer.getChips() == 1950);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 4, 80, 180, 50, "dad\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 80, "Main Pot (80)");
      
      m_oHoldEm.Fold();
      assertTrue(dadPlayer.getChips() == 2000);
      assertTrue(m_oHoldEm.getMainPlayersCount() == 5);
      assertTrue(m_oHoldEm.getMainPlayer(0).getName().equals("jeff"));
      assertTrue(m_oHoldEm.getMainPlayer(1).getName().equals("matt"));
      assertTrue(m_oHoldEm.getMainPlayer(2).getName().equals("mitch"));
      assertTrue(m_oHoldEm.getMainPlayer(3).getName().equals("brenda"));
      assertTrue(m_oHoldEm.getMainPlayer(4).getName().equals("brad"));
      verifyHoldEm(HoldEmState.BET_PREFLOP, 5, 80, 180, 50, "brenda\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 80, "Main Pot (80)");
      
      m_oHoldEm.Bet(90);
      assertTrue(brendaPlayer.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 130, 350, 90, "brad\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 170, "Main Pot (170)");
      
      m_oHoldEm.Bet(90);
      assertTrue(bradPlayer.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 1, 120, 420, 80, "jeff\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 260, "Main Pot (260)");
      
      m_oHoldEm.Fold();
      assertTrue(jeffPlayer.getChips() == 1990);
      assertTrue(m_oHoldEm.getMainPlayersCount() == 4);
      assertTrue(m_oHoldEm.getMainPlayer(0).getName().equals("matt"));
      assertTrue(m_oHoldEm.getMainPlayer(1).getName().equals("mitch"));
      assertTrue(m_oHoldEm.getMainPlayer(2).getName().equals("brenda"));
      assertTrue(m_oHoldEm.getMainPlayer(3).getName().equals("brad"));
      verifyHoldEm(HoldEmState.BET_PREFLOP, 2, 110, 400, 70, "matt\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 260, "Main Pot (260)");
      
      m_oHoldEm.Fold();
      assertTrue(mattPlayer.getChips() == 1980);
      assertTrue(m_oHoldEm.getMainPlayersCount() == 3);
      assertTrue(m_oHoldEm.getMainPlayer(0).getName().equals("mitch"));
      assertTrue(m_oHoldEm.getMainPlayer(1).getName().equals("brenda"));
      assertTrue(m_oHoldEm.getMainPlayer(2).getName().equals("brad"));
      verifyHoldEm(HoldEmState.BET_PREFLOP, 3, 80, 340, 40, "mitch\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 260, "Main Pot (260)");
      
      m_oHoldEm.Bet(40);
      assertTrue(mitchPlayer.getChips() == 1910);
      verifyHoldEm(HoldEmState.DEAL_FLOP, 3, 0, 0, 0, "", 300, "Main Pot (300)");
      
      m_oHoldEm.deal();
      verifyHoldEm(HoldEmState.BET_FLOP, 3, 20, 300, 0, "mitch\nCheck or Open?", 300, "Main Pot (300)");
      
      m_oHoldEm.Check();
      assertTrue(mitchPlayer.getChips() == 1910);
      verifyHoldEm(HoldEmState.BET_FLOP, 5, 20, 300, 0, "brenda\nCheck or Open?", 300, "Main Pot (300)");
      
      m_oHoldEm.Bet(70);
      assertTrue(brendaPlayer.getChips() == 1840);
      verifyHoldEm(HoldEmState.BET_FLOP, 0, 140, 510, 70, "brad\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 370, "Main Pot (370)");
      
      m_oHoldEm.Bet(470);
      assertTrue(bradPlayer.getChips() == 1440);
      verifyHoldEm(HoldEmState.BET_FLOP, 3, 870, 1780, 470, "mitch\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 840, "Main Pot (840)");
      
      m_oHoldEm.Fold();
      assertTrue(mitchPlayer.getChips() == 1910);
      assertTrue(m_oHoldEm.getMainPlayersCount() == 2);
      assertTrue(m_oHoldEm.getMainPlayer(0).getName().equals("brenda"));
      assertTrue(m_oHoldEm.getMainPlayer(1).getName().equals("brad"));
      verifyHoldEm(HoldEmState.BET_FLOP, 5, 800, 1640, 400, "brenda\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 840, "Main Pot (840)");
      
      m_oHoldEm.Fold();
      assertTrue(brendaPlayer.getChips() == 1840);
      assertTrue(m_oHoldEm.getState() == HoldEmState.WINNER);
      // TODO: is this necessary?
      while (!m_oHoldEm.isMainAwarded())
      {
         m_oHoldEm.awardPot();
      }
      assertTrue(bradPlayer.getChips() == 2280);
      
      m_oHoldEm.startHand();
      assertTrue(m_oHoldEm.getDealerPos() == 1);
      assertTrue(m_oHoldEm.getMainPlayersCount() == 6);
      assertTrue(m_oHoldEm.getMainPlayer(0).getName().equals("matt"));
      assertTrue(m_oHoldEm.getMainPlayer(1).getName().equals("mitch"));
      assertTrue(m_oHoldEm.getMainPlayer(2).getName().equals("dad"));
      assertTrue(m_oHoldEm.getMainPlayer(3).getName().equals("brenda"));
      assertTrue(m_oHoldEm.getMainPlayer(4).getName().equals("brad"));
      assertTrue(m_oHoldEm.getMainPlayer(5).getName().equals("jeff"));
      verifyHoldEm(HoldEmState.BLINDS, 2, 0, 0, 10, "matt\nPost Small Blind Of " + m_oHoldEm.getCall() + "?", 0, "Main Pot (0)");
      
      m_oHoldEm.Bet(m_oHoldEm.getCall());
      assertTrue(mattPlayer.getChips() == 1970);
      verifyHoldEm(HoldEmState.BLINDS, 3, 0, 0, 20, "mitch\nPost Big Blind Of " + m_oHoldEm.getCall() + "?", 10, "Main Pot (10)");
      
      m_oHoldEm.Bet(m_oHoldEm.getCall());
      assertTrue(mitchPlayer.getChips() == 1890);
      verifyHoldEm(HoldEmState.DEAL_HOLES, 4, 0, 0, 0, "", 30, "Main Pot (30)");
      
      m_oHoldEm.deal();
      verifyHoldEm(HoldEmState.BET_PREFLOP, 4, 40, 70, 20, "dad\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 30, "Main Pot (30)");
      
      m_oHoldEm.Bet(20);
      assertTrue(dadPlayer.getChips() == 1980);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 5, 40, 90, 20, "brenda\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 50, "Main Pot (50)");
      
      m_oHoldEm.Bet(20);
      assertTrue(brendaPlayer.getChips() == 1820);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 0, 40, 110, 20, "brad\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 70, "Main Pot (70)");
      
      m_oHoldEm.Bet(20);
      assertTrue(bradPlayer.getChips() == 2260);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 1, 40, 130, 20, "jeff\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 90, "Main Pot (90)");
      
      m_oHoldEm.Bet(20);
      assertTrue(jeffPlayer.getChips() == 1970);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 2, 30, 130, 10, "matt\nCall " + m_oHoldEm.getCall() + ", Raise, or Fold?", 110, "Main Pot (110)");
      
      m_oHoldEm.Bet(10);
      assertTrue(mattPlayer.getChips() == 1960);
      verifyHoldEm(HoldEmState.BET_PREFLOP, 3, 20, 120, 0, "mitch\nOption: Check or Raise?", 120, "Main Pot (120)");
      
      m_oHoldEm.Check();
      assertTrue(mitchPlayer.getChips() == 1890);
      verifyHoldEm(HoldEmState.DEAL_FLOP, 4, 0, 0, 0, "", 120, "Main Pot (120)");
      
   }
   
   private void verifyHoldEm(HoldEmState iGameState, int iActionPos, int iMinRaise, int iMaxRaise, int iCall, String sNextAction, int iTotalPotSize, String sPotsString)
   {
      assertTrue(m_oHoldEm.getState() == iGameState);
      assertTrue(m_oHoldEm.getActionPos() == iActionPos);
      int minRaise = 0;
      try
      {
         minRaise = m_oHoldEm.getMaxRaise();
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      assertTrue(minRaise == iMinRaise);
      assertTrue(m_oHoldEm.getMaxRaise() == iMaxRaise);
      assertTrue(m_oHoldEm.getCall() == iCall);
      assertTrue(m_oHoldEm.getNextAction().equals(sNextAction));
      assertTrue(m_oHoldEm.getTotalPotSize() == iTotalPotSize);
      assertTrue(m_oHoldEm.potsToString().equals(sPotsString));
   }
   
}
