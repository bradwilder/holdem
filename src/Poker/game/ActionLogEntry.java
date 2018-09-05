package Poker.game;

import java.util.ArrayList;
import java.util.List;

public class ActionLogEntry
{
   public List<Player> players = new ArrayList<Player>();
   public String action;
   
   public ActionLogEntry(String action)
   {
      this.action = action;
   }
   
   public ActionLogEntry(Player player, String action)
   {
      if (player != null)
      {
         this.players.add(player);
      }
      this.action = action;
   }
   
   public ActionLogEntry(List<Player> players, String action)
   {
      this.players = players;
      this.action = action;
   }
   
   public String toString()
   {
      if (players.size() == 0)
      {
         return "<" + action + ">";
      }
      else
      {
         if (players.size() == 1)
         {
            return players.get(0).getName() + " " + action;
         }
         else
         {
            String playerStr = players.get(0).getName();
            for (int i = 1; i < players.size() - 1; i++)
            {
               Player player = players.get(i);
               playerStr += ", " + player.getName();
            }
            playerStr += " and " + players.get(players.size() - 1).getName();
            
            return playerStr + " " + action;
         }
      }
   }
}
