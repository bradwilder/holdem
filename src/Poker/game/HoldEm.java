package Poker.game;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import Poker.hand.Hand;

public class HoldEm
{
   private ArrayList<Player> Players;
   private HoldEmState state;
   private boolean isSimulation;
   private int dealer;
   private Pots pots;
   private Deck deck;
   private Board board;
   private ActionLog actionLog;
   private ArrayList<HoldEmEvents> eventListeners = new ArrayList<HoldEmEvents>();
   
   public HoldEm(ArrayList<Player> Players, boolean isSimulation, Deck deck)
   {
      this.isSimulation = isSimulation;
      this.Players = Players;
      
      this.deck = deck;
      board = new Board();
      actionLog = new ActionLog();
      
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
   
   public List<ActionLogEntry> getLogEntries()
   {
      return actionLog.getLog();
   }
   
   public GameState startHand()
   {
      deck.shuffle();
      board.clear();
      
      List<Player> players = getPlayersForMainPot();
      if (players.size() < 2)
      {
         return null;
      }
      pots = new Pots(players, Chip.BIG_BLIND, state);
      
      for (Player player : Players)
      {
         player.Fold();
      }
      
      if (isSimulation())
      {
         state = HoldEmState.DEAL_HOLES;
      }
      else
      {
         state = HoldEmState.BLINDS;
         dealCards();
      }
      
      pots.startRound(state);
      
      if (!changeDealer())
      {
         return null;
      }
      actionLog.addEntry("Started hand");
      
      return generateNextAction();
   }
   
   private boolean changeDealer()
   {
      return (dealer = getNextPlayerAtTable(dealer)) >= 0;
   }
   
   private List<Player> getPlayersForMainPot()
   {
      List<Player> players = new ArrayList<Player>();
      for (int i = getNextPlayerAtTable(dealer); i != dealer; i = getNextPlayerAtTable(i))
      {
         players.add(getPlayer(i));
      }
      players.add(getPlayer(dealer));
      return players;
   }
   
   public String getNextAction()
   {
//      if (potsRight)
//      {
//         return "";
//      }
//      Player player = getActionPlayer();
//      int call = getCall();
//      int minRaise = getMinRaise();
//      StringBuilder action = new StringBuilder(player.getName() + "\n");
//      int currBet = pots.getCurrentBet();
//      switch (state)
//      {
//      case BLINDS:
//         if (!gotSB)
//         {
//            if (call == getSmallBlind())
//            {
//               action.append("Post Small Blind Of " + call + "?");
//            }
//            else
//            {
//               action.append("Post " + call + " Toward Small Blind (All In)?");
//            }
//         }
//         else if (call == getBigBlind())
//         {
//            action.append("Post Big Blind Of " + call + "?");
//         }
//         else
//         {
//            action.append("Post " + call + " Toward Big Blind (All In)?");
//         }
//         break;
//      case BET_PREFLOP:
//         if (currBet == bigBlind && actionOn == bigBlindOn && minRaise > 0)
//         {
//            action.append("Option: Check or Raise?");
//            break;
//         }
//      case BET_FLOP:
//      case BET_TURN:
//      case BET_RIVER:
//         if (currBet == 0 && minRaise > 0)
//         {
//            action.append("Check or Open?");
//         }
//         else if (minRaise > 0)
//         {
//            action.append("Call " + call + ", Raise, or Fold?");
//         }
//         else
//         {
//            action.append("Call " + call + " (All In) or Fold?");
//         }
//         break;
//      default:
//         return "";
//      }
//      return action.toString();
      return "";
   }
   
   public GameState generateNextAction()
   {
      boolean isBettingRound = false;
      switch (state)
      {
         case BLINDS:
         case BET_PREFLOP:
         case BET_FLOP:
         case BET_TURN:
         case BET_RIVER:
            isBettingRound = true;
            break;
         default:
      }
      
      return isBettingRound ? new GameState(state, getActionPlayer(), getCall(), getMinRaise(), getMaxRaise(), getTotalPotSize(), getPlayersSimple()) : new GameState(state, getTotalPotSize(), getPlayersSimple());
   }
   
   private List<PlayerSimple> getPlayersSimple()
   {
      List<PlayerSimple> playersSimple = new ArrayList<PlayerSimple>();
      
      for (Player player : Players)
      {
         PlayerSimple playerSimple = new PlayerSimple(player.getName(), player.getChips(), player.hasHoleCards(), pots.getChipsThisRound(player));
         playersSimple.add(playerSimple);
      }
      
      return playersSimple;
   }
   
   public GameState Bet(int bet) throws Exception
   {
      actionLog.addEntry(pots.addToPot(bet));
      if (pots.isPotEven() && !pots.isHandOver())
      {
         moveState();
      }
      
      return generateNextAction();
   }
   
   public GameState Check() throws Exception
   {
      return Bet(0);
   }
   
   public GameState Fold() throws Exception
   {
      actionLog.addEntries(pots.fold());
      if (pots.isPotEven() && !pots.isHandOver())
      {
         moveState();
      }
      else if (pots.isHandOver())
      {
         state = HoldEmState.WINNER;
         Pot wonMainPot = pots.awardPot(getBoard());
         List<Player> winners = wonMainPot.getWinners(getBoard());
         ActionLogEntry entry;
         if (winners.size() == 1)
         {
            entry = new ActionLogEntry(winners.get(0), "won pot of " + wonMainPot.getSize());
         }
         else
         {
            entry = new ActionLogEntry(winners, "split pot of " + wonMainPot.getSize());
         }
         
         actionLog.addEntry(entry);
      }
      
      return generateNextAction();
   }
   
   private void moveState()
   {
      if (!isBettingOver())
      {
         switch (state)
         {
            case BLINDS:
            case DEAL_HOLES:
               state = HoldEmState.BET_PREFLOP;
               break;
            case BET_PREFLOP:
            case DEAL_FLOP:
               state = HoldEmState.BET_FLOP;
               break;
            case BET_FLOP:
            case DEAL_TURN:
               state = HoldEmState.BET_TURN;
               break;
            case BET_TURN:
            case DEAL_RIVER:
               state = HoldEmState.BET_RIVER;
               break;
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
      else
      {
         state = HoldEmState.WINNER;
      }
      
      pots.startRound(state);
   }
   
   // TODO: this will be only used by simulation
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
   
   private void dealCards()
   {
      List<Player> players = pots.getMainPot().getPlayers();
      for (Player player : players)
      {
         Card cards[] = new Card[2];
         for (int j = 0; j < 2; j++)
         {
            cards[j] = deck.dealCard();
         }
         player.DealHoleCards(cards);
      }
      
      Card[] cards = new Card[5];
      for (int i = 0; i < 5; i++)
      {
         cards[i] = deck.dealCard();
      }
      board.addBoard(cards);
   }
   
   // TODO: this will be only used by simulation
   public GameState deal()
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
            return generateNextAction();
      }
      
      changeState();
      if (isSimulation)
      {
         changeState();
      }
      pots.startRound(state);
      
      return generateNextAction();
   }
   
   // TODO: this will be only used by simulation
   private void dealHoles()
   {
      List<Player> players = pots.getMainPot().getPlayers();
      for (Player player : players)
      {
         Card cards[] = new Card[2];
         for (int j = 0; j < 2; j++)
         {
            cards[j] = deck.dealCard();
         }
         player.DealHoleCards(cards);
      }
      emitEvent("holesDealt");
      actionLog.addEntry("Dealt hole cards");
   }
   
   // TODO: this will be only used by simulation
   private void dealFlop()
   {
      Card[] cards = new Card[3];
      for (int i = 0; i < 3; i++)
      {
         cards[i] = deck.dealCard();
      }
      board.addFlop(cards);
      emitEvent("flopDealt");
      actionLog.addEntry("Dealt flop");
   }
   
   // TODO: this will be only used by simulation
   private void dealTurn()
   {
      board.addTurn(deck.dealCard());
      emitEvent("turnRiverDealt");
      actionLog.addEntry("Dealt turn");
   }
   
   // TODO: this will be only used by simulation
   private void dealRiver()
   {
      board.addRiver(deck.dealCard());
      emitEvent("turnRiverDealt");
      actionLog.addEntry("Dealt river");
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
      Card[] cards;
      switch (state)
      {
         case BLINDS:
         case DEAL_HOLES:
         case BET_PREFLOP:
            return null;
         case DEAL_FLOP:
         case BET_FLOP:
            return board.getFlop();
         case DEAL_TURN:
         case BET_TURN:
            cards = new Card[4];
            System.arraycopy(board.getFlop(), 0, cards, 0, 3);
            cards[3] = board.getTurn();
            return cards;
         default:
            cards = new Card[5];
            System.arraycopy(board.getFlop(), 0, cards, 0, 3);
            cards[3] = board.getTurn();
            cards[4] = board.getRiver();
            return cards;
      }
   }
   
   public boolean isSimulation()
   {
      return isSimulation;
   }
   
   private int getCall()
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
      
      int call = 0;
      try
      {
         call = pots.getCall(); 
      }
      catch (Exception x)
      {
         
      }
      
      return call;
   }
   
   private int getMinRaise()
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
      
      int minRaise = 0;
      try
      {
         minRaise = pots.getMinRaise(); 
      }
      catch (Exception x)
      {
         // TODO: ???
      }
      return minRaise;
   }
   
   private int getMaxRaise()
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
      
      int maxRaise = 0;
      try
      {
         maxRaise = pots.getMaxRaise(); 
      }
      catch (Exception x)
      {
         // TODO: ???
      }
      return maxRaise;
   }
   
   public Player getDealerPlayer()
   {
      return getPlayer(dealer);
   }
   
   private Player getActionPlayer()
   {
      return pots.getNextActionPlayer();
   }
   
   public int getPlayersCount()
   {
      return Players.size();
   }
   
   public Player getPlayer(int i)
   {
      return Players.get(i);
   }
   
   public boolean isBettingOver()
   {
      return pots.isBettingOver();
   }
   
   public String potsToString()
   {
      return pots.toString();
   }
   
   public Pot getMainPot()
   {
      return pots.getMainPot();
   }
   
   public int getChipsThisRound(Player player)
   {
      return pots.getChipsThisRound(player);
   }
   
   public Pot awardPot()
   {
      return pots.awardPot(getBoard());
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
   
   private int getNextPlayerAtTable(int i) throws IllegalArgumentException
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
   
   public Hand getWinningHand()
   {
      return getMainPot().getBestHand(getBoard());
   }
   
   public List<Player> getWinners()
   {
      return getMainPot().getWinners(getBoard());
   }
}
