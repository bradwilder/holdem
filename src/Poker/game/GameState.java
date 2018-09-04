package Poker.game;

import java.util.List;

public class GameState
{
   public HoldEmState state;
   public PlayerAction playerAction;
   public int potSize;
   public List<PlayerSimple> players;
   
   public GameState(HoldEmState state, Player player, int call, int minRaise, int maxRaise, int potSize, List<PlayerSimple> players)
   {
      init(state, player, call, minRaise, maxRaise, potSize, players);
   }
   
   public GameState(HoldEmState state, int potSize, List<PlayerSimple> players)
   {
      init(state, null, 0, 0, 0, potSize, players);
   }
   
   private void init(HoldEmState state, Player player, int call, int minRaise, int maxRaise, int potSize, List<PlayerSimple> players)
   {
      this.state = state;
      this.playerAction = new PlayerAction(player, call, minRaise, maxRaise);
      this.potSize = potSize;
      this.players = players;
   }
}
