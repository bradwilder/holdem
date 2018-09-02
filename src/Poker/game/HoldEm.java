package Poker.game;

import java.lang.reflect.Method;
import java.util.ArrayList;

import Poker.hand.Hand;

public class HoldEm
{
   // TODO: make this an array, so we don't have to keep the position in the player object; or, use empty players to signify empty seats
   private ArrayList<Player> Players;
   private HoldEmState state;
   private boolean isSimulation;
   private int dealer; // position within Players of dealer button
   private Pots pots;
   private Deck deck;
   private Board board;
   private ArrayList<HoldEmEvents> eventListeners = new ArrayList<HoldEmEvents>();
   
   public HoldEm(ArrayList<Player> Players, boolean isSimulation)
   {
      this.isSimulation = isSimulation;
      this.Players = Players;
      
      deck = new Deck();
      board = new Board();
      
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
      board.clear();
      
      if (isSimulation())
      {
         state = HoldEmState.DEAL_HOLES;
      }
      else
      {
         state = HoldEmState.BLINDS;
      }

      for (int i = 0; i < getPlayersCount(); i++)
      {
         Players.get(i).Fold();
      }
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
      pots = new Pots(players, Chip.BIG_BLIND, state);
      
      return true;
   }
   
   private boolean changeDealer()
   {
      return (dealer = nextPlayerNotSittingOut(dealer)) >= 0;
   }
   
   private ArrayList<Player> getPlayersForMainPot()
   {
      ArrayList<Player> players = new ArrayList<Player>();
      for (int i = nextPlayerNotSittingOut(dealer); i != dealer; i = nextPlayerNotSittingOut(i))
      {
         players.add(getPlayer(i));
      }
      players.add(getPlayer(dealer));
      return players;
   }
   
   private void clearRound()
   {
      pots.startRound(state);
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
   
   public void Bet(int bet)
   {
      if (bet == 0)
      {
         Check();
         return;
      }
      
      addToPot(bet);
      if (pots.isPotEven() && !isHandOver())
      {
         changeState();
      }
   }
   
   public void Check()
   {
      try
      {
         pots.addToPot(0);
      }
      catch (Exception x)
      {
         // TODO: how will this be handled?
      }
      if (pots.isPotEven())
      {
         if (!isHandOver())
         {
            changeState();
         }
      }
   }
   
   public void Fold()
   {
      try
      {
         pots.fold();
      }
      catch (Exception x)
      {
         // TODO: what to do here?
      }
      if (pots.isPotEven() && !isHandOver())
      {
         changeState();
      }
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
   
   private void addToPot(int chips)
   {
      try
      {
         pots.addToPot(chips);
      }
      catch (Exception x)
      {
         
      }
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
      emitEvent("flopDealt");
   }
   
   private void dealTurn()
   {
      board.addTurn(deck.dealCard());
      changeState();
      clearRound();
      emitEvent("turnRiverDealt");
   }
   
   private void dealRiver()
   {
      board.addRiver(deck.dealCard());
      changeState();
      clearRound();
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
      
      int call = 0;
      try
      {
         call = pots.getCall(); 
      }
      catch (Exception x)
      {
         // TODO: ???
      }
      
      return call;
   }
   
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
      return pots.getNextActionPlayer();
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
   
   private boolean isHandOver()
   {
      return pots.isPotEven() && getMainPlayersCount() == 1;
   }
   
   public boolean isBettingOver()
   {
      return pots.isPotEven() && !hasEligibleMainPlayers();
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
   
   public Hand getWinningHand(ArrayList<Player> oPlayersOut)
   {
      return getMainPot().getBestHand(getBoard(), oPlayersOut);
   }
}
