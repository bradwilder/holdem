package Poker.tests;

import java.util.ArrayList;

import junit.framework.TestCase;
import Poker.game.Player;
import Poker.game.Pot;

// TODO: revisit these test cases:
/*
TEST CASES:
add(int iChipsToAdd, List<Player> oPlayers)
  Add with null players ???
add(int iChipsToAdd, Player oPlayer)
  Add with null player ???
addPlayer(Player oPlayer)
  Add null player ???
getPlayerChipsInPot(Player oPlayer)
  Test with addPlayer(), add()
  With null player
removePlayer(Player oPlayer)
  Remove null player ???
sub(int iChipsToRemove, Player oPlayer)
  Sub with null player ???
  With betting capped successful sub
  With betting capped failure to sub
  With action capped
*/
/*
TEST CASES:
Pot(int iPotNum)
  Create pot successfully
  Negative pot number
Pot(int iSize, int iPotNum)
  Create pot successfully
  Negative pot number
  Negative size
add(int iChipsToAdd, Player oPlayer)
  Verify with getNumPlayers(), getSize()
  Add successfully
  Add 0 chips
  Add negative chips
  Add with null player ???
  Add with player that isn't yet in pot
  With betting capped successful add
  With betting capped failure to add
  With action capped
addPlayer(Player oPlayer)
  Verify with getNumPlayers()
  Add successfully
  Add player that is already in pot
  Add null player ???
awardPotString(Card[] aoBoardCards)
  Test with no hole cards
  Test with no board cards
  Test with null board cards
  Test with single winner
  Test with 2 winners
  Test with more than 2 winners
capAction()
  Verify with isActionCapped()
  Cap and uncap
  Cap with betting NOT yet capped
capBetting(int iCap)
  Verify with getBettingCap(), isBettingCapped(), isActionCapped()
  Cap with positive value
  Cap with 0
  Cap with negative value
clear()
  Clear successfully
  Clear already clear pot
clearPlayers()
  Clear successfully
  Clear already clear pot
getBestHand(Card[] aoBoardCards, List<Player> oPlayersOut)
  Test with no hole cards
  Test with no board cards
  Test with null board cards
  Test with single winner
  Test with 2 winners
  Test with more than 2 winners
  Test with null in-out parameter
getBettingCap()
  Test with capBetting()
getNumPlayers()
  Test with addPlayer(), add()
  Test with 0 players
getPlayer(int iIndex)
  Test with addPlayer(), add()
  Test with 0 players
getPlayerChipsInPot(Player oPlayer)
  Test with addPlayer(), add()
  With null player
getPlayers()
  Test with addPlayer(), add()
  Test with 0 players
getPotNum()
  Test with setPotNum()
getSize()
  Get with sizes of 0, nonzero
hasPlayer(Player oPlayer)
  Test with addPlayer(), add()
hasWinnerDefault(Card[] aoBoardCards)
  Test with no hole cards
  Test with no board cards
  Test with null board cards
  Test with single winner
  Test with all players having same hand
isActionCapped()
  Test with capAction()
isBettingCapped()
  Test with capBetting()
isContested()
  With 0 players
  With 1 player
  With more than 1 player
removePlayer(Player oPlayer)
  Remove successfully (should remove chips in pot???)
  Remove player not in pot
  Remove with 0 players in pot
  Remove null player
setPotNum(int iNewPotNum)
  Verify with getPotNum()
  Set with positive value
  Set with 0
  Set with negative value
sub(int iChipsToRemove, Player oPlayer)
  Verify with getNumPlayers(), getSize()
  Sub successfully
  Sub more than player added
  Sub more than pot size
  Sub 0 chips
  Sub negative chips
  Sub with null player ???
  Sub with player that isn't yet in pot
  With betting capped successful sub
  With betting capped failure to sub
  With action capped
toString()
  With sizes of 0, nonzero
  For side pot, main pot
*/

public class PotTest extends TestCase
{
   private Player m_oPlayer1;
   private Player m_oPlayer2;
   private Player m_oPlayer3;
   private Player m_oPlayer4;
   private Player m_oPlayer5;
   private Player m_oPlayer6;
   private ArrayList<Player> players;
   
   protected void setUp() throws Exception
   {
      super.setUp();
      
      m_oPlayer1 = new Player("brad", 0);
      m_oPlayer2 = new Player("jeff", 1);
      m_oPlayer3 = new Player("matt", 2);
      m_oPlayer4 = new Player("mitch", 3);
      m_oPlayer5 = new Player("dad", 4);
      m_oPlayer6 = new Player("brenda", 5);
      
      players = new ArrayList<Player>();
      players.add(m_oPlayer1);
      players.add(m_oPlayer2);
      players.add(m_oPlayer3);
      players.add(m_oPlayer4);
      players.add(m_oPlayer5);
      players.add(m_oPlayer6);
   }
   
   public void testConstructors()
   {
      Pot pot = new Pot(players);
      verifyEmpty(pot, players.size());
   }
   
   public void testAdd()
   {
      Player player0;
      Player player1;
      Player player2;
      Player player3;
      Player player4;
      Player player5;
      
      player0 = new Player("0", 0, 2000);
      player1 = new Player("1", 1, 2000);
      player2 = new Player("2", 2, 100);
      player3 = new Player("3", 3, 2000);
      player4 = new Player("4", 4, 150);
      player5 = new Player("5", 5, 50);
      
      players = new ArrayList<Player>();
      players.add(player0);
      players.add(player1);
      players.add(player2);
      players.add(player3);
      players.add(player4);
      players.add(player5);
      
      Pot pot = new Pot(players);
      
      Pot newPot = null;
      
      // Test cases:
      // 1. Simple add
      // 2. Simple raise
      // 3. Simple split
      // 0 bets 200
      player0.Bet(200);
      try
      {
         newPot = pot.add(200, player0);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      verify(pot, 200, false, 200);
      assertTrue(pot.getRoundCount(player0) == 200);
      assertNull(newPot);
      
      // 1 bets 400
      player1.Bet(400);
      try
      {
         newPot = pot.add(400, player1);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      verify(pot, 600, false, 400);
      assertTrue(pot.getRoundCount(player1) == 400);
      assertNull(newPot);
      
      // 2 bets 100 (all in)
      player2.Bet(100);
      try
      {
         newPot = pot.add(100, player2);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      verify(pot, 300, true, 100);
      assertTrue(pot.getRoundCount(player0) == 100);
      assertTrue(pot.getRoundCount(player1) == 100);
      assertTrue(pot.getRoundCount(player2) == 100);
      verify(newPot, 400, false, 300);
      assertTrue(newPot.getRoundCount(player0) == 100);
      assertTrue(newPot.getRoundCount(player1) == 300);
   }
   
   public void testCurrentRound()
   {
      
   }
   
   /*public void testPot()
   {
      // Test properties of an empty pot
      verifyEmptyPot();
      
      // Test adding a bet and a single player
      int iBetToAdd = 50;
      int iTotalBet = 0;
      iTotalBet += iBetToAdd;
      try
      {
         m_oPot.add(iBetToAdd, m_oPlayer1);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      m_oPlayerHelper1.m_iExpectedChipsInPot += iBetToAdd;
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test adding a bet for the same single player
      iTotalBet += iBetToAdd;
      try
      {
         m_oPot.add(iBetToAdd, m_oPlayer1);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      m_oPlayerHelper1.m_iExpectedChipsInPot += iBetToAdd;
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test adding a negative bet for a different player
      try
      {
         m_oPot.add(-10, m_oPlayer2);
         assertTrue(false);
      }
      catch (Exception x)
      {
         // Not much to do here
      }
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test adding a 0 bet for a different player
      try
      {
         m_oPot.add(0, m_oPlayer2);
         assertTrue(false);
      }
      catch (Exception x)
      {
         // Not much to do here
      }
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test removing player
//      m_oPot.removePlayer(m_oPlayer2);
//      m_oPlayerHelper2.reset();
//      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test removing the same player
//      m_oPot.removePlayer(m_oPlayer2);
//      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test clearing the pot
//      iTotalBet = 0;
//      m_oPot.clear();
//      resetPlayerHelpers();
//      verifyEmptyPot();
      
      // Test clearing an already clear pot
//      iTotalBet = 0;
//      m_oPot.clear();
//      verifyEmptyPot();
      
      // Re-run similar tests as above
      // Test adding a bet and a single player
      iTotalBet = iBetToAdd;
      try
      {
         m_oPot.add(iBetToAdd, m_oPlayer1);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      m_oPlayerHelper1.m_iExpectedChipsInPot += iBetToAdd;
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test adding a bet for the same single player
      iTotalBet += iBetToAdd;
      try
      {
         m_oPot.add(iBetToAdd, m_oPlayer1);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      m_oPlayerHelper1.m_iExpectedChipsInPot += iBetToAdd;
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test adding a negative bet for a different player
      try
      {
         m_oPot.add(-10, m_oPlayer2);
         assertTrue(false);
      }
      catch (Exception x)
      {
         // Not much to do here
      }
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test adding a 0 bet for a different player
      try
      {
         m_oPot.add(0, m_oPlayer2);
         assertTrue(false);
      }
      catch (Exception x)
      {
         // Not much to do here
      }
      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test removing player
//      m_oPot.removePlayer(m_oPlayer2);
//      m_oPlayerHelper2.reset();
//      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // Test removing the same player
//      m_oPot.removePlayer(m_oPlayer2);
//      verifyPot(iTotalBet, false, false, 0, 1, "Main Pot (" + iTotalBet + ")");
      
      // This is needed because of test cases that were removed, so all the following cases didn't need to be updated
      // TODO: figure out what this is doing
//      iTotalBet += iBetToAdd;
//      try
//      {
//         m_oPot.add(iBetToAdd, m_oPlayer5);
//      }
//      catch (Exception x)
//      {
//         assertTrue(false);
//      }
//      m_oPlayerHelper5.m_iExpectedChipsInPot += iBetToAdd;
//      verifyPot(iTotalBet, true, false, 0, 2, "Main Pot (" + iTotalBet + ")");
      
//      iTotalBet += iBetToAdd;
//      try
//      {
//         m_oPot.add(iBetToAdd, m_oPlayer3);
//      }
//      catch (Exception x)
//      {
//         assertTrue(false);
//      }
//      m_oPlayerHelper3.m_iExpectedChipsInPot += iBetToAdd;
//      verifyPot(iTotalBet, true, false, 0, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test subtracting more than the pot size
//      try
//      {
//         m_oPot.sub(iTotalBet + 10, m_oPlayer1);
//         assertTrue(false);
//      }
//      catch (Exception x)
//      {
//         // Not much to do here
//      }
//      verifyPot(iTotalBet, true, false, 0, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test subtracting more than a player has contributed to the pot
//      int iBradChipsInPot = m_oPot.getPlayerChipsInPot(m_oPlayer1);
//      try
//      {
//         m_oPot.sub(iBradChipsInPot + 10, m_oPlayer1);
//         assertTrue(false);
//      }
//      catch (Exception x)
//      {
//         // Not much to do here
//      }
//      verifyPot(iTotalBet, true, false, 0, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test subtracting 0
//      try
//      {
//         m_oPot.sub(0, m_oPlayer1);
//         assertTrue(false);
//      }
//      catch (Exception x)
//      {
//         // Not much to do here
//      }
//      verifyPot(iTotalBet, true, false, 0, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test subtracting negative value
//      try
//      {
//         m_oPot.sub(-10, m_oPlayer1);
//         assertTrue(false);
//      }
//      catch (Exception x)
//      {
//         // Not much to do here
//      }
//      verifyPot(iTotalBet, true, false, 0, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test subtracting for player that isn't in the pot
//      try
//      {
//         m_oPot.sub(10, m_oPlayer6);
//         assertTrue(false);
//      }
//      catch (Exception x)
//      {
//         // Not much to do here
//      }
//      verifyPot(iTotalBet, true, false, 0, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test subtracting
//      iTotalBet -= iBetToAdd;
//      try
//      {
//         m_oPot.sub(iBetToAdd, m_oPlayer1);
//      }
//      catch (Exception x)
//      {
//         assertTrue(false);
//      }
//      m_oPlayerHelper1.m_iExpectedChipsInPot -= iBetToAdd;
//      verifyPot(iTotalBet, true, false, 0, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test current bet
      int currentBet = 100;
//      try
//      {
//         m_oPot.capBetting(currentBet);
//      }
//      catch (Exception x)
//      {
//         assertTrue(false);
//      }
//      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // TODO: This is here because of other test cases that have been removed
//      iTotalBet += 25 + 25;
//      try
//      {
//         m_oPot.add(25, m_oPlayer5);
//         m_oPot.add(25, m_oPlayer3);
//      }
//      catch (Exception x)
//      {
//         assertTrue(false);
//      }
//      m_oPlayerHelper5.m_iExpectedChipsInPot += 25;
//      m_oPlayerHelper3.m_iExpectedChipsInPot += 25;
//      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test methods that require cards
      Card[] aoBoardCards = new Card[5];
      aoBoardCards[0] = new Card(Suit.CLUBS, Value.ACE);
      aoBoardCards[1] = new Card(Suit.CLUBS, Value.EIGHT);
      aoBoardCards[2] = new Card(Suit.CLUBS, Value.QUEEN);
      aoBoardCards[3] = new Card(Suit.DIAMONDS, Value.EIGHT);
      aoBoardCards[4] = new Card(Suit.HEARTS, Value.ACE);
      
      // Test awardPotString() with no hole cards
      //assertTrue(m_oPot.awardPotString(aoBoardCards, "Main Pot").equals(""));
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test awardPotString() with null board cards
      //assertTrue(m_oPot.awardPotString(null, "Main Pot").equals(""));
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test getBestHand() with no hole cards
      ArrayList<Player> oTempList = new ArrayList<Player>();
      oTempList = new ArrayList<Player>();
      Hand oBestHand = m_oPot.getBestHand(aoBoardCards, oTempList);
      assertTrue(oTempList.size() == 0);
      assertTrue(oBestHand == null);
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test awardPotString() with one winner
      Card[] aoHoleCards1 = new Card[2];
      aoHoleCards1[0] = new Card(Suit.CLUBS, Value.FOUR);
      aoHoleCards1[1] = new Card(Suit.CLUBS, Value.KING);
      m_oPlayer1.DealHoleCards(aoHoleCards1);
      Hand oBradsHand = new Flush(new Value[] {Value.ACE, Value.KING, Value.QUEEN, Value.EIGHT, Value.FOUR});
      
      Card[] aoHoleCards2 = new Card[2];
      aoHoleCards2[0] = new Card(Suit.HEARTS, Value.EIGHT);
      aoHoleCards2[1] = new Card(Suit.CLUBS, Value.FIVE);
      m_oPlayer3.DealHoleCards(aoHoleCards2);
      Hand oMattsHand = new FullHouse(new Value[] {Value.EIGHT, Value.ACE});
      
      Card[] aoHoleCards3 = new Card[2];
      aoHoleCards3[0] = new Card(Suit.DIAMONDS, Value.SEVEN);
      aoHoleCards3[1] = new Card(Suit.CLUBS, Value.SIX);
      m_oPlayer5.DealHoleCards(aoHoleCards3);
      Hand oDadsHand = new TwoPair(new Value[] {Value.ACE, Value.EIGHT, Value.QUEEN});
      
      //assertTrue(m_oPot.awardPotString(aoBoardCards, "Main Pot").equals("matt wins Main Pot (" + iTotalBet + ")"));
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test getBestHand() with null board cards
      oTempList = new ArrayList<Player>();
      oBestHand = m_oPot.getBestHand(null, oTempList);
      assertTrue(oTempList.size() == 0);
      assertTrue(oBestHand == null);
      
      // Test getBestHand() with no board cards
      oTempList = new ArrayList<Player>();
      Card[] oCards = new Card[0];
      oBestHand = m_oPot.getBestHand(oCards, oTempList);
      assertTrue(oTempList.size() == 0);
      assertTrue(oBestHand == null);
      
      // Test getBestHand() with not enough board cards
      oTempList = new ArrayList<Player>();
      oCards = new Card[2];
      oCards[0] = new Card(Suit.SPADES, Value.EIGHT);
      oCards[1] = new Card(Suit.SPADES, Value.JACK);
      oBestHand = m_oPot.getBestHand(null, oTempList);
      assertTrue(oTempList.size() == 0);
      assertTrue(oBestHand == null);
      
      // Test getBestHand() with null in-out parameter
      oBestHand = m_oPot.getBestHand(null, null);
      assertTrue(oTempList.size() == 0);
      assertTrue(oBestHand == null);
      
      // Test getBestHand() with one winner
      oTempList = new ArrayList<Player>();
      oBestHand = m_oPot.getBestHand(aoBoardCards, oTempList);
      assertTrue(oTempList.size() == 1);
      assertTrue(oTempList.contains(m_oPlayer3));
      assertTrue(oBestHand.compare(oMattsHand) == 0);
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test getBestHand() with two winners
      aoHoleCards3[0] = new Card(Suit.SPADES, Value.EIGHT);
      aoHoleCards3[1] = new Card(Suit.CLUBS, Value.SIX);
      m_oPlayer5.DealHoleCards(aoHoleCards3);
      oDadsHand = new FullHouse(new Value[] {Value.EIGHT, Value.ACE});
      oTempList = new ArrayList<Player>();
      oBestHand = m_oPot.getBestHand(aoBoardCards, oTempList);
      assertTrue(oTempList.size() == 2);
      assertTrue(oTempList.contains(m_oPlayer3));
      assertTrue(oTempList.contains(m_oPlayer5));
      assertTrue(oBestHand.compare(oMattsHand) == 0);
      assertTrue(oBestHand.compare(oDadsHand) == 0);
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test awardPotString() with two winners
      //String sAwardPotString = m_oPot.awardPotString(aoBoardCards, "Main Pot");
      //assertTrue(sAwardPotString.contains("matt"));
      //assertTrue(sAwardPotString.contains("dad"));
      //assertTrue(sAwardPotString.contains("split Main Pot (" + iTotalBet + ")"));
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test getBestHand() with three winners
      aoBoardCards = new Card[5];
      aoBoardCards[0] = new Card(Suit.CLUBS, Value.ACE);
      aoBoardCards[1] = new Card(Suit.CLUBS, Value.EIGHT);
      aoBoardCards[2] = new Card(Suit.CLUBS, Value.QUEEN);
      aoBoardCards[3] = new Card(Suit.CLUBS, Value.FOUR);
      aoBoardCards[4] = new Card(Suit.CLUBS, Value.KING);
      
      aoHoleCards1 = new Card[2];
      aoHoleCards1[0] = new Card(Suit.HEARTS, Value.EIGHT);
      aoHoleCards1[1] = new Card(Suit.HEARTS, Value.FIVE);
      m_oPlayer1.DealHoleCards(aoHoleCards1);
      oBradsHand = new Flush(new Value[] {Value.ACE, Value.KING, Value.QUEEN, Value.EIGHT, Value.FOUR});
      
      aoHoleCards2 = new Card[2];
      aoHoleCards2[0] = new Card(Suit.DIAMONDS, Value.EIGHT);
      aoHoleCards2[1] = new Card(Suit.DIAMONDS, Value.FIVE);
      m_oPlayer3.DealHoleCards(aoHoleCards2);
      oMattsHand = new Flush(new Value[] {Value.ACE, Value.KING, Value.QUEEN, Value.EIGHT, Value.FOUR});
      
      aoHoleCards3 = new Card[2];
      aoHoleCards3[0] = new Card(Suit.SPADES, Value.EIGHT);
      aoHoleCards3[1] = new Card(Suit.SPADES, Value.FIVE);
      m_oPlayer5.DealHoleCards(aoHoleCards3);
      oDadsHand = new Flush(new Value[] {Value.ACE, Value.KING, Value.QUEEN, Value.EIGHT, Value.FOUR});
      
      oTempList = new ArrayList<Player>();
      oBestHand = m_oPot.getBestHand(aoBoardCards, oTempList);
      assertTrue(oTempList.size() == 3);
      assertTrue(oTempList.contains(m_oPlayer1));
      assertTrue(oTempList.contains(m_oPlayer3));
      assertTrue(oTempList.contains(m_oPlayer5));
      assertTrue(oBestHand.compare(oBradsHand) == 0);
      assertTrue(oBestHand.compare(oMattsHand) == 0);
      assertTrue(oBestHand.compare(oDadsHand) == 0);
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
      
      // Test awardPotString() with three winners
      //sAwardPotString = m_oPot.awardPotString(aoBoardCards, "Main Pot");
      //assertTrue(sAwardPotString.contains("brad"));
      //assertTrue(sAwardPotString.contains("matt"));
      //assertTrue(sAwardPotString.contains("dad"));
      //assertTrue(sAwardPotString.contains("split Main Pot (" + iTotalBet + ")"));
      verifyPot(iTotalBet, true, true, currentBet, 3, "Main Pot (" + iTotalBet + ")");
   }
   
   public void testCappingBetting()
   {
      int iBetToAdd = 50;
      int iTotalBet = 0;
      try
      {
         m_oPot.add(iBetToAdd, m_oPlayer1);
         iTotalBet += iBetToAdd;
         m_oPot.add(iBetToAdd, m_oPlayer3);
         iTotalBet += iBetToAdd;
         m_oPot.add(2 * iBetToAdd, m_oPlayer2);
         iTotalBet += 2 * iBetToAdd;
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      
//      // Test capping with negative value
//      try
//      {
//         m_oPot.capBetting(-50);
//         assertTrue(false);
//      }
//      catch (Exception x)
//      {
//         assertTrue(m_oPot.isBettingCapped() == false);
//      }
//      
//      // Test capping with 0
//      try
//      {
//         m_oPot.capBetting(0);
//         assertTrue(false);
//      }
//      catch (Exception x)
//      {
//         assertTrue(m_oPot.isBettingCapped() == false);
//      }
//      
//      // Test capping with valid value
//      try
//      {
//         m_oPot.capBetting(2 * iBetToAdd);
//      }
//      catch (Exception x)
//      {
//         assertTrue(false);
//      }
      
      // Test adding a value within the betting cap
      try
      {
         iTotalBet += iBetToAdd;
         m_oPot.add(iBetToAdd, m_oPlayer3);
         assertTrue(m_oPot.getSize() == iTotalBet);
      }
      catch (Exception x)
      {
         assertTrue(false);
      }
      
      // Test adding more than the betting cap
      try
      {
         m_oPot.add(3 * iBetToAdd, m_oPlayer1);
         assertTrue(false);
      }
      catch (Exception x)
      {
         assertTrue(m_oPot.getSize() == iTotalBet);
      }
      
      // Test adding more than the betting cap when combined with chips already in this pot
      try
      {
         m_oPot.add(2 * iBetToAdd, m_oPlayer1);
         assertTrue(false);
      }
      catch (Exception x)
      {
         assertTrue(m_oPot.getSize() == iTotalBet);
      }
   }*/
   
   /*private void verifyPot(int iSize, boolean bIsContested, boolean bIsBettingCapped, int currentBet, int iNumPlayers, String sPotString)
   {
	   assertTrue(m_oPot.getSize() == iSize);
	   assertTrue(m_oPot.isContested() == bIsContested);
	   assertTrue(m_oPot.isBettingCapped() == bIsBettingCapped);
	   //assertTrue(m_oPot.getCurrentBet() == currentBet); // TODO: fix this
	   assertTrue(m_oPot.getNumPlayers() == iNumPlayers);
	   assertTrue(m_oPot.toString("Main Pot").equals(sPotString));
	   
	   for (int i = 0; i < m_oPlayerList.size(); i++)
	   {
	      PlayerHelper oPlayerHelper = m_oPlayerList.get(i);
	      if (oPlayerHelper.m_iExpectedChipsInPot == 0)
	      {
             assertTrue(m_oPot.findPlayer(oPlayerHelper.m_oPlayer) == null);
             assertTrue(m_oPot.getPlayerRoundCount(oPlayerHelper.m_oPlayer) == 0);
	      }
	      else
	      {
             assertTrue(m_oPot.findPlayer(oPlayerHelper.m_oPlayer) != null);
             assertTrue(m_oPot.getPlayerRoundCount(oPlayerHelper.m_oPlayer) == oPlayerHelper.m_iExpectedChipsInPot);
	      }
	   }
   }
   
   private void verifyEmptyPot()
   {
      assertTrue(m_oPot.getSize() == 0);
      assertTrue(!m_oPot.isContested());
      assertTrue(!m_oPot.isBettingCapped());
      assertTrue(m_oPot.isPotEven());
      assertTrue(m_oPot.getCurrentBet() == 0);
      assertTrue(m_oPot.getNumPlayers() == 0);
   }*/
   
   private void verify(Pot pot, int iSize, boolean bIsBettingCapped, int currentBet)
   {
      assertTrue(pot.getSize() == iSize);
      assertTrue(pot.isBettingCapped() == bIsBettingCapped);
      assertTrue(pot.getCurrentBet() == currentBet);
   }
   
   private void verifyEmpty(Pot pot, int players)
   {
      assertTrue(pot.getSize() == 0);
      assertTrue(!pot.isBettingCapped());
      assertTrue(pot.isPotEven());
      assertTrue(pot.getCurrentBet() == 0);
      assertTrue(pot.getNumPlayers() == players);
   }
}
