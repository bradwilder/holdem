package Poker.tests;

import java.util.ArrayList;

import Poker.game.Card;
import Poker.game.Player;
import Poker.game.Pots;
import junit.framework.TestCase;

public class PotsTest extends TestCase
{
   private Pots m_oPotMgr;
   
   private Player player0;
   private Player player1;
   private Player player2;
   private Player player3;
   private Player player4;
   private Player player5;
   
   private Card[] cards;
   
   private ArrayList<Player> m_oPlayerList;
   
   protected void setUp() throws Exception
   {
      super.setUp();
      
      player0 = new Player("brad", 0);
      player1 = new Player("jeff", 1);
      player2 = new Player("matt", 2);
      player3 = new Player("mitch", 3);
      player4 = new Player("dad", 4);
      player5 = new Player("brenda", 5);
      
      m_oPlayerList = new ArrayList<Player>();
      m_oPlayerList.add(player0);
      m_oPlayerList.add(player1);
      m_oPlayerList.add(player2);
      m_oPlayerList.add(player3);
      m_oPlayerList.add(player4);
      m_oPlayerList.add(player5);
      
      cards = new Card[2];
      
      m_oPotMgr = new Pots(m_oPlayerList);
   }
   
   protected void tearDown() throws Exception
   {
      super.tearDown();
   }
   
	public void testFoldPlayer()
	{
	   player0.setChips(100);
	   player1.setChips(175);
	   player2.setChips(50);
	   player3.setChips(150);
	   player4.setChips(80);
	   player5.setChips(200);
	   
      cards[0] = new Card();
      cards[1] = new Card();
      
      player0.DealHoleCards(cards);
      player1.DealHoleCards(cards);
      player2.DealHoleCards(cards);
      player3.DealHoleCards(cards);
      player4.DealHoleCards(cards);
      player5.DealHoleCards(cards);
	   	   
	   int iTotalPotSize = 0;
	   int thisBet = 0;
	   
	   thisBet = 100;
	   m_oPotMgr.addToPot(thisBet, player0);
	   iTotalPotSize += thisBet;
	   assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
	   assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player0) == thisBet);
	   assertTrue(m_oPotMgr.getCurrentBet() == 100);
	   
	   thisBet = 100;
	   m_oPotMgr.addToPot(thisBet, player1);
	   iTotalPotSize += thisBet;
	   assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
	   assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player1) == thisBet);
	   assertTrue(m_oPotMgr.getCurrentBet() == 100);
	   
	   thisBet = 50;
	   m_oPotMgr.addToPot(thisBet, player2);
	   iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player2) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      
      thisBet = 150;
      m_oPotMgr.addToPot(thisBet, player3);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player3) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      
      thisBet = 80;
      m_oPotMgr.addToPot(thisBet, player4);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player4) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      
      thisBet = 175;
      m_oPotMgr.addToPot(thisBet, player5);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player5) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 175);
      
      assertTrue(player5.getChips() == 25);
      m_oPotMgr.foldPlayer(player1);
      assertTrue(player5.getChips() == 50);
      iTotalPotSize -= 25;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player5) == 150);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      assertTrue(m_oPotMgr.isPotEven());
	}
	
	public void testClearRounds()
   {
      player0.setChips(10000);
      player1.setChips(10000);
      player2.setChips(100);
      player3.setChips(150);
      player4.setChips(50);
      player5.setChips(10000);
      
      cards[0] = new Card();
      cards[1] = new Card();
      
      player0.DealHoleCards(cards);
      player1.DealHoleCards(cards);
      player2.DealHoleCards(cards);
      player3.DealHoleCards(cards);
      player4.DealHoleCards(cards);
      player5.DealHoleCards(cards);
            
      int iTotalPotSize = 0;
      int thisBet = 0;
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player0);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player0) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player1);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player1) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player2);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player2) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 150;
      m_oPotMgr.addToPot(thisBet, player3);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player3) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 50;
      m_oPotMgr.addToPot(thisBet, player4);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player4) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 150;
      m_oPotMgr.addToPot(thisBet, player5);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player5) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      assertTrue(!m_oPotMgr.isPotEven());
      
      m_oPotMgr.foldPlayer(player0);
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 50;
      m_oPotMgr.addToPot(thisBet, player1);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getCurrentBet() == 150);
      assertTrue(m_oPotMgr.isPotEven());
      
      m_oPotMgr.clearRound();
      
      thisBet = 500;
      m_oPotMgr.addToPot(thisBet, player1);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player1) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 500);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 500;
      m_oPotMgr.addToPot(thisBet, player5);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player5) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 500);
      assertTrue(m_oPotMgr.isPotEven());
   }
	
	public void testAllIn()
   {
      player0.setChips(100);
      player1.setChips(100);
      player2.setChips(100);
      player3.setChips(100);
      player4.setChips(10000);
      player5.setChips(100);
      
      cards[0] = new Card();
      cards[1] = new Card();
      
      player0.DealHoleCards(cards);
      player1.DealHoleCards(cards);
      player2.DealHoleCards(cards);
      player3.DealHoleCards(cards);
      player4.DealHoleCards(cards);
      player5.DealHoleCards(cards);
            
      int iTotalPotSize = 0;
      int thisBet = 0;
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player0);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player0) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player1);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player1) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player2);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player2) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player3);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player3) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player4);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player4) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(!m_oPotMgr.isPotEven());
      
      thisBet = 100;
      m_oPotMgr.addToPot(thisBet, player5);
      iTotalPotSize += thisBet;
      assertTrue(m_oPotMgr.getTotalSize() == iTotalPotSize);
      assertTrue(m_oPotMgr.getChipsThisRoundForPlayer(player5) == thisBet);
      assertTrue(m_oPotMgr.getCurrentBet() == 100);
      assertTrue(m_oPotMgr.isPotEven());
   }
}
