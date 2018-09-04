package Poker.gui;

import java.awt.BorderLayout;
import java.util.List;

import Poker.game.HoldEm;
import Poker.game.Player;
import Poker.hand.Hand;

public class TableComponentSim extends Table
{
   private static final long serialVersionUID = -881700383175876558L;
   
   public TableComponentSim(HoldEm game)
   {
      super(game);
      inner = new InnerTableComponentSim();
      add(inner, BorderLayout.CENTER);
      
      game.startHand();
   }
   
   public void deal()
   {
      switch (m_oGame.generateNextAction().state)
      {
         case DEAL_HOLES:
            break;
         case DEAL_FLOP:
            break;
         case DEAL_TURN:
         case DEAL_RIVER:
            break;
         default:
            clearWinners();
      }
      m_oGame.deal();
      update();
   }
   
   private void update()
   {
      updateBoard();
      updateBestHands();
   }
   
   private void updateBestHands()
   {
      switch (m_oGame.generateNextAction().state)
      {
         case BET_FLOP:
         case DEAL_TURN:
         case BET_TURN:
         case DEAL_RIVER:
            showBestHands();
            break;
         case BET_RIVER:
         case WINNER:
            showWinners();
            break;
         default:
            clearWinners();
      }
   }
   
   private void showBestHands()
   {
      List<Player> oWinners = m_oGame.getWinners();
      ((InnerTableComponentSim) inner).changeWinner(oWinners.toString());
      updatePlayerHands();
   }
   
   private void showWinners()
   {
      List<Player> oWinners = m_oGame.getWinners();
      Hand oBestHand = m_oGame.getWinningHand();
      ((InnerTableComponentSim) inner).changeWinner(oBestHand.toString() + "\n" + getPlayerNames(oWinners));
      updatePlayerHands();
      setWinnerBorder(oWinners);
   }
   
   private static String getPlayerNames(List<Player> oPlayers)
   {
      int iPlayerCnt = oPlayers.size();
      if (iPlayerCnt == 0)
      {
         return "";
      }
      else if (iPlayerCnt == 1)
      {
         return oPlayers.get(0).getName();
      }
      else
      {
         StringBuilder oPlayerNames = new StringBuilder();
         for (int i = 0; i < iPlayerCnt - 1; i++)
         {
            oPlayerNames.append(oPlayers.get(i).getName());
            oPlayerNames.append(", ");
         }
         oPlayerNames.append(oPlayers.get(iPlayerCnt - 1).getName());
         return oPlayerNames.toString();
      }
   }
   
   private void clearWinners()
   {
      ((InnerTableComponentSim) inner).clearWinner();
      resetPlayers();
      List<Player> oWinners = m_oGame.getWinners();
      resetWinnerBorder(oWinners);
   }
}
