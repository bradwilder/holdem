package Poker.game;

public class GameState
{
   private HoldEmState state;
   private PlayerState playerAction;
   
   public GameState(HoldEmState state, Player player, int call, int minRaise, int maxRaise)
   {
      init(state, player, call, minRaise, maxRaise);
   }
   
   public GameState(HoldEmState state)
   {
      init(state, null, 0, 0, 0);
   }
   
   private void init(HoldEmState state, Player player, int call, int minRaise, int maxRaise)
   {
      this.state = state;
      this.playerAction = new PlayerState(player, call, minRaise, maxRaise);
   }
   
   public HoldEmState getState()
   {
      return state;
   }
   
   public PlayerState getAction()
   {
      return playerAction;
   }
}
