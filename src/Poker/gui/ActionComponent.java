package Poker.gui;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JSlider;
import javax.swing.JTextArea;
import javax.swing.JTextField;

public class ActionComponent extends JComponent
{
   private static final long serialVersionUID = -1386398465215477269L;
   
   private JTextArea m_oAction;
   private Buttons m_oButtons;
   private Raise m_oRaise;
   
   public ActionComponent(int iCallAmount)
   {
      setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
      
      m_oAction = new JTextArea("ACTION", 2, 1);
      m_oAction.setEditable(false);
      m_oAction.setBorder(GUIConstants.innerstandard);
      m_oAction.setFont(GUIConstants.infoFont);
      add(m_oAction);
      
      m_oButtons = new Buttons(iCallAmount);
      add(m_oButtons);
      
      m_oRaise = new Raise();
      add(m_oRaise);
   }
   
   private static class Buttons extends JComponent
   {
      private static final long serialVersionUID = -7748891214904306715L;
      
      private JButton m_oRaise;
      private JButton m_oFold;
      private JButton m_oCheckCall;
      
      public Buttons(int iCallAmount)
      {
         setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
         
         m_oRaise = new JButton("Raise");
         m_oRaise.setBackground(Color.LIGHT_GRAY);
         m_oRaise.setEnabled(false);
         add(m_oRaise);
         
         m_oCheckCall = new JButton(getCheckCallButtonText(iCallAmount));
         m_oCheckCall.setBackground(Color.LIGHT_GRAY);
         m_oCheckCall.setEnabled(false);
         add(m_oCheckCall);
         
         m_oFold = new JButton("Fold");
         m_oFold.setBackground(Color.LIGHT_GRAY);
         m_oFold.setEnabled(false);
         add(m_oFold);
      }
      
      private String getCheckCallButtonText(int iCallAmount)
      {
         return iCallAmount == 0 ? "Check" : "Call " + iCallAmount;
      }
      
      private void setButtons(boolean raise, int iCallAmount, boolean fold)
      {
         m_oRaise.setEnabled(raise);
         m_oCheckCall.setEnabled(true);
         m_oCheckCall.setText(getCheckCallButtonText(iCallAmount));
         m_oFold.setEnabled(fold);
      }
      
      public Dimension getPreferredSize()
      {
         return new Dimension(100, 120);
      }
   }
   
   private static class Raise extends JComponent
   {
      private static final long serialVersionUID = 7056948643228709231L;
      
      private JTextField raiseField;
      private JSlider raiseValue;
      private static Font raiseFont = new Font("SansSerif", Font.BOLD, 22);
      
      public Raise()
      {
         setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
         
         raiseValue = new JSlider();
         setRaiseSliderEnabled(false);
         raiseValue.setMinorTickSpacing(1);
         
         raiseField = new JTextField(3);
         raiseField.setText("");
         raiseField.setBorder(BorderFactory.createTitledBorder("Raise Amount"));
         raiseField.setHorizontalAlignment(JTextField.CENTER);
         raiseField.setEditable(false);
         raiseField.setFont(raiseFont);
         
         add(raiseField);
         add(raiseValue);
      }
      
      private void setRaise(int min, int max)
      {
         remove(raiseValue);
         int diff = max - min;
         if (min == 0)
         {
            setRaiseSliderEnabled(false);
            clearRaiseField();
         }
         else if (diff == 0)
         {
            setRaiseSliderEnabled(false);
            setRaiseField(min, false);
         }
         else
         {
            raiseValue.setMinimum(min);
            raiseValue.setMaximum(max);
            raiseValue.setValue(min);
            if (diff <= 150)
            {
               raiseValue.setMajorTickSpacing(5);
               raiseValue.setPaintLabels(true);
            }
            else
            {
               raiseValue.setMajorTickSpacing(diff / 5);
               raiseValue.setPaintLabels(false);
            }
            setRaiseSliderEnabled(true);
            setRaiseField(min, true);
         }
         raiseValue.setInverted(false);
         add(raiseValue);
      }
      
      private void setRaiseSliderEnabled(boolean enable)
      {
         raiseValue.setPaintLabels(enable);
         raiseValue.setPaintTicks(enable);
         raiseValue.setPaintTrack(enable);
         raiseValue.setEnabled(enable);
      }
      
      private void setRaiseField(int min, boolean editable)
      {
         raiseField.setText("" + min);
         raiseField.setEditable(editable);
      }
      
      private void clearRaiseField()
      {
         raiseField.setText("");
         raiseField.setEditable(false);
      }
      
      public Dimension getPreferredSize()
      {
         return new Dimension(924, 120);
      }
   }
   
//   public Dimension getPreferredSize()
//   {
//      return new Dimension(1024, 120);
//   }
}
