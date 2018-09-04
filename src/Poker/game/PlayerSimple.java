package Poker.game;

public class PlayerSimple
{
   public String name;
   public int chips;
   public boolean inHand;
   public int chipsThisRound;
   public Card[] holeCards;
   
   public PlayerSimple(String name, int chips, boolean inHand, int chipsThisRound)
   {
      this.name = name;
      this.chips = chips;
      this.inHand = inHand;
      this.chipsThisRound = chipsThisRound;
   }
}
