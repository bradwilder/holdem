package Poker.game;

public class PlayerState
{
   private Player player;
   private int call;
   private int minRaise;
   private int maxRaise;
   
   public PlayerState(Player player, int call, int minRaise, int maxRaise)
   {
      this.player = player;
      this.call = call;
      this.minRaise = minRaise;
      this.maxRaise = maxRaise;
   }
   
   public Player getPlayer()
   {
      return player;
   }
   
   public int getCall()
   {
      return call;
   }
   
   public int getMinRaise()
   {
      return minRaise;
   }
   
   public int getMaxRaise()
   {
      return maxRaise;
   }
}
