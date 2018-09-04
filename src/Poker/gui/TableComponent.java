package Poker.gui;

import java.awt.BorderLayout;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import Poker.game.Card;
import Poker.game.HoldEm;
import Poker.game.Player;
import Poker.game.PlayerState;
import Poker.game.Pot;
import Poker.gui.custom.Audio;

public class TableComponent extends Table
{
   private static final long serialVersionUID = 4824404789987018328L;
   
   public TableComponent(HoldEm game)
   {
      super(game);
      inner = new InnerTableComponent();
      add(inner, BorderLayout.CENTER);
      
      init();
   }
   
   private void init()
   {
      m_oGame.startHand();
      clearPlayers();
      addDealerButton();
      updateActionComponents();
      clearWinner();
      updatePot();
      updateBoard();
   } // :)
   
   private void addDealerButton()
   {
      Player player = m_oGame.getDealerPlayer();
      Players[player.getPosition()].addDealer();
   } // :)
   
   private class UpdateTask extends TimerTask
   {
      public void run()
      {
         timer.cancel();
         update();
      }
   } // :)
   
   private class InitTask extends TimerTask
   {
      public void run()
      {
         timer.cancel();
         init();
      }
   } // :)
   
   private class FoldTask extends TimerTask
   {
      public void run()
      {
         timer.cancel();
         updateFold();
      }
   } // :)
   
   private class DealAllInTask extends TimerTask
   {
      public void run()
      {
         timer.cancel();
         dealAllIn();
      }
   } // :)
   
   private class ShowWinnerAllInTask extends TimerTask
   {
      public void run()
      {
         timer.cancel();
         showWinnerAllIn();
      }
   } // :)
   
   private class ShowWinnerTask extends TimerTask
   {
      public void run()
      {
         timer.cancel();
         showWinner();
      }
   } // :)
   
   private void update()
   {
      updatePot();
      if (m_oGame.isBettingOver())
      {
         showDownAllIn();
         return;
      }
      switch (m_oGame.generateNextAction().getState())
      {
         case DEAL_HOLES:
         case DEAL_FLOP:
         case DEAL_TURN:
         case DEAL_RIVER:
            deal();
            break;
         case WINNER:
            // System.out.println("Got a WINNER!!!");
            clearActionComponents();
            if (!m_oGame.isMainAwarded())
            {
               showDown();
            }
            else
            {
               init();
            }
            break;
         default:
            updateActionComponents();
      }
   } // :\
   
   private void deal()
   {
      timer = new Timer();
      switch (m_oGame.generateNextAction().getState())
      {
         case DEAL_HOLES:
            dealHoles();
            clearAllBorders();
            clearAction();
            disableActionComponents();
            resetCardsPlayers();
            break;
         case DEAL_FLOP:
            dealFlop();
            clearActionComponents();
            break;
         case DEAL_TURN:
         case DEAL_RIVER:
            dealTurnRiver();
            clearActionComponents();
            break;
         default:
            // TODO: throw exception here maybe?
      }
      timer.schedule(new UpdateTask(), 1000);
   }
   
   private void dealHoles()
   {
      m_oGame.deal();
   }
   
   private void dealFlop()
   {
      dealBoard();
   }
   
   private void dealTurnRiver()
   {
      dealBoard();
   }
   
   private void dealBoard()
   {
      m_oGame.deal();
      updateBoard();
   }
   
   private void showSelectedPlayer()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Player player = m_oGame.getPlayer(i);
         int position = player.getPosition();
         if (player != m_oGame.generateNextAction().getAction().getPlayer())
         {
            deselectPlayer(Players[position]);
         }
         else
         {
            selectPlayer(Players[position]);
         }
      }
   }
   
   private void deselectPlayer(PlayerComponent player)
   {
      player.setBorderStandard();
      player.disablePeek();
      switch (m_oGame.generateNextAction().getState())
      {
         case BET_PREFLOP:
         case BET_FLOP:
         case BET_TURN:
         case BET_RIVER:
            player.resetCards();
            break;
         default:
            // TODO: throw exception here maybe?
      }
   }
   
   private void selectPlayer(PlayerComponent player)
   {
      player.setBorderSelected();
      player.clearAction();
      switch (m_oGame.generateNextAction().getState())
      {
         case BET_PREFLOP:
         case BET_FLOP:
         case BET_TURN:
         case BET_RIVER:
            player.enablePeek();
            break;
         default:
            // TODO: throw exception here maybe?
      }
   }
   
   private void disablePeeks()
   {
      for (int i = 0; i < m_oGame.getPlayersCount(); i++)
      {
         Players[m_oGame.getPlayer(i).getPosition()].disablePeek();
      }
   } // :)
   
   private void clearAllBorders()
   {
      for (int i = 0; i < 10; i++)
      {
         Players[i].setBorderStandard();
      }
   } // :)
   
   private void clearRaiseSlider()
   {
      ((InnerTableComponent) inner).setRaiseValue(0, 0);
   } // :)
   
   private void updateRaiseSlider()
   {
      PlayerState playerState = m_oGame.generateNextAction().getAction();
      ((InnerTableComponent) inner).setRaiseValue(playerState.getMinRaise(), playerState.getMaxRaise());
   }
   
   public void updateRaiseAmount()
   {
      ((InnerTableComponent) inner).getRaiseField().setText("" + ((InnerTableComponent) inner).getRaiseValue().getValue());
   }
   
   private void updateAction()
   {
      ((InnerTableComponent) inner).changeAction(m_oGame.getNextAction());
   }
   
   private void clearAction()
   {
      ((InnerTableComponent) inner).changeAction("");
   }
   
   private void updateButtons()
   {
      PlayerState playerState = m_oGame.generateNextAction().getAction();
      boolean raise = (playerState.getMinRaise() > 0);
      boolean call = (playerState.getCall() > 0);
      boolean check = (playerState.getCall() == 0);
      boolean fold = true;
      ((InnerTableComponent) inner).setButtons(raise, call, check, fold);
   } // :)
   
   private void clearButtons()
   {
      ((InnerTableComponent) inner).setButtons(false, false, false, false);
   } // :)
   
   private void updatePot()
   {
      ((InnerTableComponent) inner).changePot(m_oGame.potsToString());
   } // :)
   
   private void updateWinner(String winner)
   {
      ((InnerTableComponent) inner).changeWinner(winner);
   } // :)
   
   private void clearWinner()
   {
      updateWinner("");
   } // :)
   
   public void clearActionComponents()
   {
      clearAllBorders();
      clearAction();
      disableActionComponents();
      resetPlayers();
   } // :)
   
   private void disableActionComponents()
   {
      disablePeeks();
      clearRaiseSlider();
      clearButtons();
   } // :)
   
   public void updateActionComponents()
   {
      showSelectedPlayer();
      updateRaiseSlider();
      updateButtons();
      updateAction();
   } // :)
   
   private void showDown()
   {
      timer = new Timer();
      timer.schedule(new ShowWinnerTask(), 500);
   }
   
   private void showDownAllIn()
   {
      timer = new Timer();
      switch (m_oGame.generateNextAction().getState())
      {
         case DEAL_HOLES:
         case DEAL_FLOP:
         case DEAL_TURN:
         case DEAL_RIVER:
            clearActionComponents();
            peekPlayers();
            break;
         default:
            // TODO: throw exception here maybe?
      }
      timer.schedule(new DealAllInTask(), 1500);
   } // :)
   
   private void dealAllIn()
   {
      timer = new Timer();
      switch (m_oGame.generateNextAction().getState())
      {
         case DEAL_HOLES:
            dealHoles();
            peekPlayers();
            timer.schedule(new DealAllInTask(), 2000);
            return;
         case DEAL_FLOP:
            dealFlop();
            timer.schedule(new DealAllInTask(), 2000);
            break;
         case DEAL_TURN:
            dealTurnRiver();
            timer.schedule(new DealAllInTask(), 2000);
            break;
         case DEAL_RIVER:
            dealTurnRiver();
            timer.schedule(new ShowWinnerAllInTask(), 2000);
            break;
         case WINNER:
            peekPlayers(); // needs to change ???
            timer.schedule(new ShowWinnerAllInTask(), 500);
            return;
         default:
            // TODO: throw exception here maybe?
      }
      updatePlayerHands();
   } // :\
   
   private void showWinnerAllIn()
   {
      timer = new Timer();
      updatePot();
      if (!m_oGame.isMainAwarded())
      {
         Pot pot = m_oGame.awardPot();
         if (pot.getSize() > 1500)
         {
            Audio.playLargePotAudio();
         }
         else
         {
            Audio.playSmallPotAudio();
         }
         clearAllBorders();
         Card[] aoBoardCards = m_oGame.getBoard();
         List<Player> oWinners = pot.getWinners(aoBoardCards);
         setWinnerBorder(oWinners);
         //updateWinner(m_oGame.getPots().awardPotString(aoBoardCards, pot));
         timer.schedule(new ShowWinnerAllInTask(), 5000);
         return;
      }
      timer.schedule(new InitTask(), 3000);
   } // :)
   
   private void showWinner()
   {
      if (!m_oGame.isMainAwarded())
      {
         showWinnerDefault(m_oGame.awardPot());
      }
      
      if (!m_oGame.isMainAwarded())
      {
         timer = new Timer();
         timer.schedule(new ShowWinnerTask(), 3000);
      }
      else
      {
         timer = new Timer();
         timer.schedule(new UpdateTask(), 5000);
      }
   }
   
   private void showWinnerDefault(Pot pot)
   {
      updatePot(); // TODO: maybe need this?
      if (pot.getSize() > 1500)
      {
         Audio.playLargePotAudio();
      }
      else
      {
         Audio.playSmallPotAudio();
      }
      if (pot == m_oGame.getMainPot())
      {
         clearPlayersAction();
      }
      clearActionComponents();
      peekPlayers(pot);
      Card[] aoBoardCards = m_oGame.getBoard();
      List<Player> oWinners = pot.getWinners(aoBoardCards);
      setWinnerBorder(oWinners);
      //updateWinner(m_oGame.getPots().awardPotString(aoBoardCards, pot));
   } // :)
   
   public void sendFold()
   {
      timer = new Timer();
      PlayerState playerState = m_oGame.generateNextAction().getAction();
      Player player = playerState.getPlayer();
      if (player != null)
      {
         Players[player.getPosition()].Fold();
         Audio.playFoldAudio();
         disableActionComponents();
         timer.schedule(new FoldTask(), 1500);
      }
   } // :)
   
   private void updateFold()
   {
      try
      {
         m_oGame.Fold();
      }
      catch (Exception x)
      {
         // TODO
      }
      
      updatePlayerChips();
      update();
   } // :)
   
   public void sendCall(boolean call)
   {
      timer = new Timer();
      
      PlayerState playerState = m_oGame.generateNextAction().getAction();
      
      Player player = playerState.getPlayer();
      
      PlayerComponent playerComponent = Players[player.getPosition()];
      if (!call)
      {
         Audio.playCheckAudio();
         playerComponent.Check();
         try
         {
            m_oGame.Check();
         }
         catch (Exception x)
         {
            // TODO
         }
      }
      else
      {
         Audio.playCallAudio();
         int Call = playerState.getCall();
         playerComponent.Call(Call);
         try
         {
            m_oGame.Bet(Call);
         }
         catch (Exception x)
         {
            // TODO
         }
      }
      playerComponent.updateChipInfo();
      disableActionComponents();
      timer.schedule(new UpdateTask(), 1500);
   } // :)
   
   public void sendRaise()
   {
      timer = new Timer();
      PlayerState playerState = m_oGame.generateNextAction().getAction();
      Player player = playerState.getPlayer();
      if (player != null)
      {
         PlayerComponent playerComponent = Players[player.getPosition()];
         int raise = ((InnerTableComponent) inner).getRaiseAmount();
         raise = Math.max(raise, playerState.getMinRaise());
         raise = Math.min(raise, playerState.getMaxRaise());
         Audio.playRaiseAudio();
         playerComponent.Raise(raise);
         try
         {
            m_oGame.Bet(raise);
         }
         catch (Exception x)
         {
            // TODO
         }
         playerComponent.updateChipInfo();
         disableActionComponents();
         timer.schedule(new UpdateTask(), 1500);
      }
   } // :)
}
