package Poker.gui;

import java.awt.BorderLayout;
import java.util.ArrayList;

import Poker.game.HoldEm;
import Poker.game.Player;
import Poker.hand.Hand;

public class TableComponentSim extends Table
{
   private static final long serialVersionUID = -881700383175876558L;

   /**
    * Basic constructor
    * @param game the HoldEm game to play on this component
    * @param screenHeight the height of the component
    * @param screenWidth the width of the component
    */
   public TableComponentSim(HoldEm game)
   {
      super(game);
      inner = new InnerTableComponentSim();
      add(inner, BorderLayout.CENTER);
      
      game.startHand();
   }
   
   public void deal()
   {
      switch (m_oGame.generateNextAction().getState())
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
      switch (m_oGame.generateNextAction().getState())
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
      ArrayList<Player> oWinners = new ArrayList<Player>();
      ((InnerTableComponentSim) inner).changeWinner(m_oGame.getWinningHand(oWinners).toString());
      updatePlayerHands();
   }
   
   private void showWinners()
   {
      ArrayList<Player> oWinners = new ArrayList<Player>();
      Hand oBestHand = m_oGame.getWinningHand(oWinners);
      ((InnerTableComponentSim) inner).changeWinner(oBestHand.toString() + "\n" + getPlayerNames(oWinners));
      updatePlayerHands();
      setWinnerBorder(oWinners);
   }
   
   private static String getPlayerNames(ArrayList<Player> oPlayers)
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
      ArrayList<Player> oWinners = new ArrayList<Player>();
      m_oGame.getWinningHand(oWinners);
      resetWinnerBorder(oWinners);
   }
}
