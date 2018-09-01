package Poker.gui.custom;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import sun.audio.AudioPlayer;
import sun.audio.AudioStream;

public final class Audio
{
   private static boolean soundOn = true;
   private static final String cwd = System.getProperty("user.dir");
   private static final String soundsDir = cwd + "/sounds/";
   private static final String soundsExt = ".au";
   private static final String foldFN = soundsDir + "fold" + soundsExt;
   private static final String checkFN = soundsDir + "check" + soundsExt;
   private static final String callFN = soundsDir + "call" + soundsExt;
   private static final String raiseFN = soundsDir + "raise" + soundsExt;
   private static final String holesFN = soundsDir + "holes" + soundsExt;
   private static final String flopFN = soundsDir + "flop" + soundsExt;
   private static final String turnRiverFN = soundsDir + "turnRiver" + soundsExt;
   private static final String winSmallPotFN = soundsDir + "winSmallPot" + soundsExt;
   private static final String winLargePotFN = soundsDir + "winLargePot" + soundsExt;
   
   private static void playAudio(String fileName)
   {
      if (!soundOn)
      {
         return;
      }
      try
      {
         InputStream inStream = new FileInputStream(fileName);
         AudioStream audioStream = new AudioStream(inStream);
         AudioPlayer.player.start(audioStream);
      }
      catch (IOException e)
      {
         System.out.println("Error with " + fileName + " AudioStream: " + e);
      }
   }
   
   public static void toggleSounds()
   {
      soundOn = !soundOn;
   }
   
   public static void turnAudioOn()
   {
      soundOn = true;
   }
   
   public static void turnAudioOff()
   {
      soundOn = false;
   }
   
   public static void playFoldAudio()
   {
      playAudio(foldFN);
   }
   
   public static void playCheckAudio()
   {
      playAudio(checkFN);
   }
   
   public static void playCallAudio()
   {
      playAudio(callFN);
   }
   
   public static void playRaiseAudio()
   {
      playAudio(raiseFN);
   }
   
   public static void playHolesAudio()
   {
      playAudio(holesFN);
   }
   
   public static void playFlopAudio()
   {
      playAudio(flopFN);
   }
   
   public static void playTurnRiverAudio()
   {
      playAudio(turnRiverFN);
   }
   
   public static void playSmallPotAudio()
   {
      playAudio(winSmallPotFN);
   }
   
   public static void playLargePotAudio()
   {
      playAudio(winLargePotFN);
   }
}