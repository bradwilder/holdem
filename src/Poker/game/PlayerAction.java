package Poker.game;

public class PlayerAction
{
   public Player player;
   public int call;
   public int minRaise;
   public int maxRaise;
   
   public PlayerAction(Player player, int call, int minRaise, int maxRaise)
   {
      this.player = player;
      this.call = call;
      this.minRaise = minRaise;
      this.maxRaise = maxRaise;
   }
}
