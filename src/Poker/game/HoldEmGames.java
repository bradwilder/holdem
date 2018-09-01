package Poker.game;

public class HoldEmGames
{
   public static final HoldEmGame SIMULATION   = new HoldEmGame("Simulation",   Chip.BIG_BLIND,       Chip.BIG_BLIND);
   public static final HoldEmGame NO_LIMIT     = new HoldEmGame("No Limit",     Chip.BIG_BLIND,       0);
   public static final HoldEmGame POT_LIMIT    = new HoldEmGame("Pot Limit",    Chip.BIG_BLIND,       0);
   public static final HoldEmGame CACTUS_PETES = new HoldEmGame("Cactus Petes", Chip.CACTP_BIG_BLIND, 0);
   
   public static final HoldEmGame[] GAMES = { NO_LIMIT,
                                              POT_LIMIT,
                                              CACTUS_PETES };
   
   public static HoldEmGame getGame(String sName)
   {
      for (int i = 0; i < GAMES.length; i++)
      {
         if (sName.equals(GAMES[i].getName()))
         {
            return GAMES[i];
         }
      }
      
      return SIMULATION;
   }
   
   public static String[] getNames()
   {
      String[] asGameTypeNames = new String[GAMES.length];
      for (int i = 0; i < GAMES.length; i++)
      {
         asGameTypeNames[i] = GAMES[i].getName();
      }
      return asGameTypeNames;
   }
}
