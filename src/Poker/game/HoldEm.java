package Poker.game;

import java.lang.reflect.Method;
import java.util.ArrayList;

import Poker.hand.Hand;

public class HoldEm
{
   // TODO: make this an array, so we don't have to keep the position in the player object; or, use empty players to signify empty seats
   private ArrayList<Player> Players; // list of Players
   private int bigBlind; //  value of big blind; TODO: move to Pots
   private HoldEmState state; // state of game
   private boolean isSimulation;
   private int dealer; // position within Players of dealer button
   private int currentRaise; // TODO: move to Pots
   private int shortStackOverRaise; // TODO: move to Pots
   private int actionOn; // position within main pot of bet action; TODO: move to Pots
   private int bigBlindOn; // position within main pot of big blind; TODO: move to Pots
   private boolean gotSB; // whether the small blind has been resolved
   private boolean gotBB; // whether the big blind has been resolved
   private boolean checkOption; // whether the big blind has checked the option
   private boolean checkAround; // whether the table has checked around; TODO: move to Pots if necessary
   private boolean potsRight; // whether the pot's right; TODO: move to Pots
   private Pots pots; // the main pot, and any side pots
   private Deck deck; // the deck of cards
   private Board board; // the community cards
   //   private Player lastAggressor; // last Player to raise during last betting round
   private ArrayList<HoldEmEvents> eventListeners = new ArrayList<HoldEmEvents>();
   
   public static enum HoldEmState
   {
      BLINDS(0), DEAL_HOLES(1), BET_PREFLOP(2), DEAL_FLOP(3), BET_FLOP(
            4), DEAL_TURN(5), BET_TURN(
                  6), DEAL_RIVER(7), BET_RIVER(8), WINNER(9), NO_STATE(99);
      
      private final int m_iIndex;
      private static final int NUM_STATES = 10;
      
      HoldEmState(int index)
      {
         m_iIndex = index;
      }
      
      public int getIndex()
      {
         return m_iIndex;
      }
      
      public static HoldEmState stateFromIndex(int i)
      {
         if (i < 0 || i >= NUM_STATES)
         {
            return NO_STATE;
         }
         return values()[i];
      }
      
      public HoldEmState getNextState()
      {
         return HoldEmState.values()[m_iIndex + 1 % NUM_STATES];
      }
   }
   
   public HoldEm(ArrayList<Player> Players, boolean isSimulation)
   {
      this.isSimulation = isSimulation;
      this.Players = Players;
      //bigBlind = gameType.getBigBlind();
      bigBlind = Chip.BIG_BLIND;
      
      deck = new Deck();
      board = new Board();
      
      // Initialize dealer
      dealer = Players.size() - 1;
   }
   
   public void addEventListener(HoldEmEvents listener)
   {
      eventListeners.add(listener);
   }
   
   private void emitEvent(String method)
   {
      for (HoldEmEvents listener : eventListeners)
      {
         try
         {
            Method toInvoke = HoldEmEvents.class.getMethod(method);
            toInvoke.invoke(listener);
         }
         catch (Exception x)
         {
            // TODO: should this do anything?
         }
      }
   }
   
   public boolean startHand()
   {
      deck.shuffle();
      if (isSimulation())
      {
         state = HoldEmState.DEAL_HOLES;
      }
      else
      {
         state = HoldEmState.BLINDS;
      }
      board.clear();
      gotSB = false;
      gotBB = false;
      checkOption = false;
      //      lastAggressor = null;
      clearPlayerHands();
      clearRound();
      
      if (!changeDealer())
      {
         return false;
      }
      ArrayList<Player> players = getPlayersForMainPot();
      if (players.size() < 2)
      {
         return false;
      }
      pots = new Pots(players);
      startActionOn();
      return true;
   }
   
   private boolean changeDealer()
   {
      return (dealer = nextPlayerNotSittingOut(dealer)) >= 0;
   } // :)
   
   private ArrayList<Player> getPlayersForMainPot()
   {
      ArrayList<Player> players = new ArrayList<Player>();
      for (int i = nextPlayerNotSittingOut(
            dealer); i != dealer; i = nextPlayerNotSittingOut(i))
      {
         players.add(getPlayer(i));
      }
      players.add(getPlayer(dealer));
      return players;
   }
   
   private void clearPlayerHands()
   {
      for (int i = 0; i < getPlayersCount(); i++)
      {
         Players.get(i).Fold();
      }
   }
   
   private void clearRound()
   {
//      if (gameType == HoldEmGames.CACTUS_PETES)
//      {
//         if (state.compareTo(HoldEmState.BET_FLOP) <= 0)
//         {
//            lastRaise = Chip.CACTP_ROUND_1;
//         }
//         else
//         {
//            lastRaise = Chip.CACTP_ROUND_2;
//         }
//      }
//      else
//      {
         currentRaise = bigBlind;
//      }
      shortStackOverRaise = 0;
      checkAround = false;
      potsRight = false;
      pots.clearRound();
   } // :\
   
   public String getNextAction()
   {
      if (isPotRight())
      {
         return "";
      }
      Player player = getActionPlayer();
      int call = getCall();
      int minRaise = getMinRaise();
      StringBuilder action = new StringBuilder(player.getName() + "\n");
      int currBet = pots.getCurrentBet();
      switch (state)
      {
      case BLINDS:
         if (!gotSB)
         {
            if (call == getSmallBlind())
            {
               action.append("Post Small Blind Of " + call + "?");
            }
            else
            {
               action.append("Post " + call + " Toward Small Blind (All In)?");
            }
         }
         else if (call == getBigBlind())
         {
            action.append("Post Big Blind Of " + call + "?");
         }
         else
         {
            action.append("Post " + call + " Toward Big Blind (All In)?");
         }
         break;
      case BET_PREFLOP:
         if (currBet == bigBlind && actionOn == bigBlindOn && minRaise > 0)
         {
            action.append("Option: Check or Raise?");
            break;
         }
      case BET_FLOP:
      case BET_TURN:
      case BET_RIVER:
         if (currBet == 0 && minRaise > 0)
         {
            action.append("Check or Open?");
         }
         else if (minRaise > 0)
         {
            action.append("Call " + call + ", Raise, or Fold?");
         }
         else
         {
            action.append("Call " + call + " (All In) or Fold?");
         }
         break;
      default:
         return "";
      }
      return action.toString();
   }
   
   public void Bet(int bet)
   {
      if (bet == 0)
      {
         Check();
         return;
      }
      
      Player player = getActionPlayer();
      if (state == HoldEmState.BLINDS)
      {
         if (!gotSB)
         {
            gotSB = true;
            //currBet = bet;
            addToPot(bet, player);
         }
         else
         {
            gotBB = true;
            bigBlindOn = actionOn;
            //currBet = Math.max(bet, currBet);
            addToPot(bet, player);
            changeState();
         }
         changeActionOn();
      }
      else
      {
         // Player.getChipsThisRound() will not yet reflect the new bet, so add it in
         int chipsThisRound = pots.getChipsThisRoundForPlayer(player) + bet;
         int currBet = pots.getCurrentBet();
         int incrAmount = chipsThisRound - currBet;
         int raise = chipsThisRound - (currBet - shortStackOverRaise);
         boolean raised = false;
         if (incrAmount > 0)
         {
            raised = true;
            if (raise < currentRaise)
            {
               shortStackOverRaise = raise;
            }
            else
            {
               shortStackOverRaise = 0;
            }
            currentRaise = Math.max(currentRaise, raise);
         }
         //currBet = Math.max(currBet, chipsThisRound);
         if (state == HoldEmState.BET_RIVER)
         {
            if (raised)
            {
               //               lastAggressor = player;
            }
         }
         addToPot(bet, player);
         if (!checkPotRight())
         {
            changeActionOn();
         }
         else if (!isHandOver())
         {
            changeState();
         }
      }
   }
   
   public void Check()
   {
      changeActionOn();
      if (state == HoldEmState.BET_PREFLOP)
      {
         checkOption = true;
      }
      else if (actionOn == 0)
      {
         checkAround = true;
      }
      if (checkPotRight())
      {
         if (!isHandOver())
         {
            changeState();
         }
      }
   }
   
   public void Fold()
   {
      Player player = getActionPlayer();
      //player.Fold();
      //pots.removePlayer(player);
      foldActionOn();
      if (state == HoldEmState.BET_PREFLOP)
      {
         int currBet = pots.getCurrentBet();
         if (currBet == bigBlind && actionOn == bigBlindOn)
         {
            checkOption = true;
         }
         else if (currBet == 0 && actionOn == 0)
         {
            checkAround = true;
         }
      }
      pots.foldPlayer(player);
      if (checkPotRight())
      {
         if (!isHandOver())
         {
            changeState();
         }
      }
      else if (getActionPlayer().isAllIn())
      {
         changeActionOn();
      }
   }
   
   // TODO: move to Pots
   private boolean checkPotRight()
   {
      if (getMainPlayersCount() == 1)
      {
         state = HoldEmState.WINNER;
         return potsRight = true;
      }
      int currBet = pots.getCurrentBet();
      switch (state)
      {
      case BLINDS:
         return gotBB;
      case BET_PREFLOP:
         if (currBet == bigBlind)
         {
            if (checkOption)
            {
               return potsRight = checkOption;
            }
            else
            {
               return false;
            }
         }
      case BET_FLOP:
      case BET_TURN:
      case BET_RIVER:
         if (currBet > 0)
         {
            for (int i = 0; i < getMainPlayersCount(); i++)
            {
               Player player = getMainPlayer(i);
               if (!player.isAllIn()
                     && pots.getChipsThisRoundForPlayer(player) < currBet)
               {
                  return false;
               }
            }
            return setPotRight();
         }
         else if ((actionOn == 0 && checkAround) || maxChipsSubsequentPlayers() == 0)
         {
            return setPotRight();
         }
         else
         {
            return false;
         }
      default:
         return setPotRight();
      }
   }
   
   private boolean setPotRight()
   {
      return potsRight = true;
   }
   
   private boolean hasEligibleMainPlayers()
   {
      int count = 0;
      for (int i = 0; i < getMainPlayersCount(); i++)
      {
         if (!getMainPlayer(i).isAllIn())
         {
            count++;
         }
      }
      return count >= 2;
   }
   
   private void startActionOn()
   {
      actionOn = firstMainPlayerNotAllIn();
   }
   
   private boolean changeActionOn()
   {
      return (actionOn = nextMainPlayerNotAllIn(actionOn)) >= 0;
   }
   
   private void foldActionOn()
   {
      actionOn = actionOn % getMainPlayersCount();
   }
   
   private void addToPot(int chips, Player player)
   {
      pots.addToPot(chips, player);
   }
   
   private void changeState()
   {
      if (!isBettingOver())
      {
         state = state.getNextState();
      }
      else
      {
         switch (state)
         {
         case BLINDS:
            state = HoldEmState.DEAL_HOLES;
            break;
         case DEAL_HOLES:
         case BET_PREFLOP:
            state = HoldEmState.DEAL_FLOP;
            break;
         case DEAL_FLOP:
         case BET_FLOP:
            state = HoldEmState.DEAL_TURN;
            break;
         case DEAL_TURN:
         case BET_TURN:
            state = HoldEmState.DEAL_RIVER;
            break;
         case DEAL_RIVER:
         case BET_RIVER:
            state = HoldEmState.WINNER;
            break;
         case WINNER:
            state = state.getNextState();
            break;
         default:
            // TODO: throw exception here
         }
      }
   }
   
   public HoldEmState deal()
   {
      switch (state)
      {
      case DEAL_HOLES:
         dealHoles();
         break;
      case DEAL_FLOP:
         dealFlop();
         break;
      case DEAL_TURN:
         dealTurn();
         break;
      case DEAL_RIVER:
         dealRiver();
         break;
      default:
         startHand();
         if (isSimulation())
         {
            deal();
         }
      }
      return state;
   }
   
   private void dealHoles()
   {
      for (int i = 0; i < getMainPlayersCount(); i++)
      {
         Card cards[] = new Card[2];
         for (int j = 0; j < 2; j++)
         {
            cards[j] = deck.dealCard();
         }
         getMainPlayer(i).DealHoleCards(cards);
      }
      changeState();
      emitEvent("holesDealt");
   }
   
   private void dealFlop()
   {
      Card[] cards = new Card[3];
      for (int i = 0; i < 3; i++)
      {
         cards[i] = deck.dealCard();
      }
      board.addFlop(cards);
      changeState();
      clearRound();
      startActionOn();
      emitEvent("flopDealt");
   }
   
   private void dealTurn()
   {
      board.addTurn(deck.dealCard());
      changeState();
      clearRound();
      startActionOn();
      emitEvent("turnRiverDealt");
   }
   
   private void dealRiver()
   {
      board.addRiver(deck.dealCard());
      changeState();
      clearRound();
      startActionOn();
      emitEvent("turnRiverDealt");
   }
   
   public Card[] getFlop()
   {
      return board.getFlop();
   }
   
   public Card getTurn()
   {
      return board.getTurn();
   }
   
   public Card getRiver()
   {
      return board.getRiver();
   }
   
   public Card[] getBoard()
   {
      return board.getBoard();
   }
   
   public boolean isSimulation()
   {
      return isSimulation;
   }
   
   public int getBigBlind()
   {
      return bigBlind;
   }
   
   public void changeBigBlind(int newBigBlind)
   {
      bigBlind = newBigBlind;
   }
   
   public void incrBigBlind(int incr)
   {
      bigBlind += incr;
   }
   
   public int getSmallBlind()
   {
      // TODO: change so this isn't always half
      return bigBlind / 2;
   }
   
   // TODO: move to Pots
   public int getCall()
   {
      switch (state)
      {
      case DEAL_HOLES:
      case DEAL_FLOP:
      case DEAL_TURN:
      case DEAL_RIVER:
      case WINNER:
         return 0;
      default:
         // TODO: throw exception here maybe?
      }
      
      Player player = getActionPlayer();
      int playerChips = player.getChips();
      int currOwed;
      if (state == HoldEmState.BLINDS)
      {
         int maxChipsRemainingPlayers = maxChipsRemainingPlayers();
         if (!gotSB)
         {
            currOwed = Math.min(maxChipsRemainingPlayers, getSmallBlind());
         }
         else
         {
            currOwed = Math.min(maxChipsRemainingPlayers, getBigBlind());
         }
      }
      else
      {
         currOwed = pots.getCurrentBet()
               - pots.getChipsThisRoundForPlayer(player);
      }
      return Math.min(playerChips, currOwed);
   }
   
   // TODO: move to Pots
   public int getMinRaise()
   {
      switch (state)
      {
      case BLINDS:
      case DEAL_HOLES:
      case DEAL_FLOP:
      case DEAL_TURN:
      case DEAL_RIVER:
      case WINNER:
         return 0;
      default:
         // TODO: throw exception here maybe?
      }
      
      Player player = getActionPlayer();
      int playerChips = player.getChips();
      int call = getCall();
      
      if (playerChips == call)
      {
         return 0;
      }
      
      if (isSimulation)
      {
         return Chip.BIG_BLIND;
      }
//      else if (gameType == HoldEmGames.CACTUS_PETES)
//      {
//         if (state == HoldEmState.BET_PREFLOP)
//         {
//            int currBet = pots.getCurrentBet();
//            if (currBet == Chip.CACTP_ROUND_1MAX + Chip.CACTP_BIG_BLIND)
//            {
//               return 0;
//            }
//            else if (state == HoldEmState.BET_FLOP)
//            {
//               if (currBet == Chip.CACTP_ROUND_1MAX)
//               {
//                  return 0;
//               }
//               else if (currBet == Chip.CACTP_ROUND_2MAX)
//               {
//                  return 0;
//               }
//            }
//         }
//      }
      int newRaise = call - shortStackOverRaise + currentRaise;
      newRaise = Math.min(newRaise, maxChipsRemainingPlayers() - pots.getChipsThisRoundForPlayer(player));
      return Math.min(playerChips, newRaise);
   }
   
   // TODO: move to Pots
   public int getMaxRaise()
   {
      switch (state)
      {
      case BLINDS:
      case DEAL_HOLES:
      case DEAL_FLOP:
      case DEAL_TURN:
      case DEAL_RIVER:
      case WINNER:
         return 0;
      default:
         // TODO: Throw exception here maybe?
      }
      
      Player player = getActionPlayer();
      int playerChips = player.getChips();
      int call = getCall();
      
      if (playerChips == call)
      {
         return 0;
      }
      
      int maxChipsRemainingPlayers = maxChipsRemainingPlayers();
      if (isSimulation)
      {
         return Chip.BIG_BLIND;
      }
      else /*if (gameType == HoldEmGames.NO_LIMIT)*/
      {
         return Math.min(playerChips, maxChipsRemainingPlayers);
      }
//      else if (gameType == HoldEmGames.POT_LIMIT)
//      {
//         int newRaise = getTotalPotSize() + 2 * call;
//         newRaise = Math.min(newRaise, maxChipsRemainingPlayers
//               - pots.getChipsThisRoundForPlayer(player));
//         return Math.min(playerChips, newRaise);
//      }
//      else if (gameType == HoldEmGames.CACTUS_PETES)
//      {
//         return getMinRaise();
//      }
//      else
//      {
//         return Chip.BIG_BLIND;
//      }
   }
   
   private int maxChipsSubsequentPlayers()
   {
      int maxChips = 0;
      for (int i = actionOn; i < getMainPlayersCount(); i++)
      {
         maxChips = Math.max(maxChips, getMainPlayer(i).getChips());
      }
      return maxChips;
   }
   
   // TODO: move to Pots
   private int maxChipsRemainingPlayers()
   {
      int maxChips = 0;
      for (int i = nextMainPlayer(actionOn); i != actionOn; i = nextMainPlayer(
            i))
      {
         Player player = getMainPlayer(i);
         int playerChips = player.getChips()
               + pots.getChipsThisRoundForPlayer(player);
         maxChips = Math.max(maxChips, playerChips);
      }
      return maxChips;
   }
   
   public int getDealerPos()
   {
      return getPlayer(dealer).getPosition();
   }
   
   public int getActionPos()
   {
      return getActionPlayer().getPosition();
   }
   
   public Player getActionPlayer()
   {
      return getMainPlayer(actionOn);
   }
   
   public int getPlayersCount()
   {
      return Players.size();
   }
   
   public Player getPlayer(int i)
   {
      return (Player) Players.get(i);
   }
   
   public Pots getPots()
   {
      return pots;
   }
   
   public int getMainPlayersCount()
   {
      return pots.getMainPot().getPlayers().size();
   }
   
   public Player getMainPlayer(int index)
   {
      return pots.getMainPot().getPlayers().get(index);
   }
   
   private boolean isPotRight()
   {
      return potsRight;
   }
   
   private boolean isHandOver()
   {
      return potsRight && getMainPlayersCount() == 1;
   }
   
   public boolean isBettingOver()
   {
      return potsRight && !hasEligibleMainPlayers();
   }
   
   public String potsToString()
   {
      return pots.toString();
   }
   
   public Pot getMainPot()
   {
      return pots.getMainPot();
   }
   
   public Pot awardPot()
   {
      return pots.awardPot(getBoard());
   }
   
   public int getMainPotSize()
   {
      return getMainPot().getSize();
   }
   
   public boolean isMainAwarded()
   {
      //return !pots.hasMainPot();
      return false;
   }
   
   public int getTotalPotSize()
   {
      return pots.getTotalSize();
   }
   
   public HoldEmState getState()
   {
      return state;
   }
   
   private int nextPlayerNotSittingOut(int i) throws IllegalArgumentException
   {
      int players = getPlayersCount();
      if (i >= players)
      {
         throw new IllegalArgumentException();
      }
      
      int start = i;
      do
      {
         i = (i + 1) % players;
         if (i == start)
         {
            return -1;
         }
      } while (getPlayer(i) == null);
      return i;
   }
   
   // TODO: move to Pots
   private int nextMainPlayer(int i)
   {
      int players = getMainPlayersCount();
      if (i >= players)
      {
         throw new IllegalArgumentException();
      }
      
      int start = i;
      i = (i + 1) % players;
      if (i == start)
      {
         return -1;
      }
      return i;
   }
   
   // TODO: move to Pots
   private int nextMainPlayerNotAllIn(int i) throws IllegalArgumentException
   {
      int players = getMainPlayersCount();
      if (i >= players)
      {
         throw new IllegalArgumentException();
      }
      
      int start = i;
      do
      {
         i = (i + 1) % players;
         if (i == start)
         {
            return -1;
         }
      } while (getMainPlayer(i).isAllIn());
      return i;
   }
   
   // TODO: move to Pots
   private int firstMainPlayerNotAllIn() throws IllegalArgumentException
   {
      int players = getMainPlayersCount();
      int i = 0;
      if (i >= players)
      {
         throw new IllegalArgumentException();
      }
      
      int start = i;
      while (getMainPlayer(i).isAllIn())
      {
         i = (i + 1) % players;
         if (i == start)
         {
            return -1;
         }
      }
      return i;
   }
   
   public Hand getWinningHand(ArrayList<Player> oPlayersOut)
   {
      return getMainPot().getBestHand(getBoard(), oPlayersOut);
   }
}
