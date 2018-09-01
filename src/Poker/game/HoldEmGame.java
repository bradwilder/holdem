package Poker.game;

// TODO: how is this used? Is it used yet?
public class HoldEmGame
{
   // TODO: these should be private I believe
   String m_sName;
   int m_iBigBlind;
   int m_iMinRaise;
   int m_iMaxRaise; // TODO: when does this get set?
   
   public HoldEmGame(String sName, int iBigBlind, int iMinRaise)
   {
      m_sName = sName;
      m_iBigBlind = iBigBlind;
      m_iMinRaise = iMinRaise;
   }
   
   public String getName()
   {
      return m_sName;
   }
   
   public int getBigBlind()
   {
      return m_iBigBlind;
   }
   
   public int getMinRaise()
   {
      return m_iMinRaise;
   }
   
   public int getMaxRaise()
   {
      return m_iMaxRaise;
   }
}
