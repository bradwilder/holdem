package Poker.game;

import java.util.ArrayList;
import java.util.List;

public class ActionLog
{
   private List<ActionLogEntry> entries = new ArrayList<ActionLogEntry>();
   
   public void addEntry(Player player, String action)
   {
      addEntry(new ActionLogEntry(player, action));
   }
   
   public void addEntry(String action)
   {
      addEntry(new ActionLogEntry(action));
   }
   
   public void addEntry(ActionLogEntry entry)
   {
      entries.add(entry);
   }
   
   public void addEntries(List<ActionLogEntry> entries)
   {
      this.entries.addAll(entries);
   }
   
   public List<ActionLogEntry> getLog()
   {
      return entries;
   }
}
