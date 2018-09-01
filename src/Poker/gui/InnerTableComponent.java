package Poker.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JSlider;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;

public class InnerTableComponent extends InnerTable
{
   private static final long serialVersionUID = 217751692387896243L;
   
   private ButtonPanel buttonPanel;
   
   public InnerTableComponent()
   {
      super();
      buttonPanel = new ButtonPanel();
      add(buttonPanel, BorderLayout.SOUTH);
      setBorder(new LineBorder(Color.BLACK, 2));
   }
   
   private static class ButtonPanel extends JComponent
   {
      private static final long serialVersionUID = 4774616644017761435L;
      
      private Buttons buttons;
      private Raise raise;
      
      public ButtonPanel()
      {
         setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
         
         buttons = new Buttons();
         raise = new Raise();
         add(buttons);
         add(raise);
      }
      
      private static class Buttons extends JComponent
      {
         private static final long serialVersionUID = -7748891214904306715L;
         
         private JButton raise, fold, check, call;
         
         public Buttons()
         {
            setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
            
            raise = new JButton("Raise");
            raise.setBackground(Color.LIGHT_GRAY);
            raise.setEnabled(false);
            add(raise);
            
            call = new JButton("Call");
            call.setBackground(Color.LIGHT_GRAY);
            call.setEnabled(false);
            add(call);
            
            check = new JButton("Check");
            check.setBackground(Color.LIGHT_GRAY);
            check.setEnabled(false);
            add(check);
            
            fold = new JButton("Fold");
            fold.setBackground(Color.LIGHT_GRAY);
            fold.setEnabled(false);
            add(fold);
         }
         
         private void setButtons(boolean raise, boolean call, boolean check, boolean fold)
         {
            this.raise.setEnabled(raise);
            this.call.setEnabled(call);
            this.check.setEnabled(check);
            this.fold.setEnabled(fold);
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
      
      public Dimension getPreferredSize()
      {
         return new Dimension(1024, 120);
      }
   }
   
   public JButton getFold()
   {
      return buttonPanel.buttons.fold;
   }
   
   public JButton getCheck()
   {
      return buttonPanel.buttons.check;
   }
   
   public JButton getCall()
   {
      return buttonPanel.buttons.call;
   }
   
   public JButton getRaise()
   {
      return buttonPanel.buttons.raise;
   }
   
   public JSlider getRaiseValue()
   {
      return buttonPanel.raise.raiseValue;
   }
   
   public void setRaiseValue(int min, int max)
   {
      buttonPanel.raise.setRaise(min, max);
   }
   
   public void setButtons(boolean raise, boolean call, boolean check, boolean fold)
   {
      buttonPanel.buttons.setButtons(raise, call, check, fold);
   }
   
   public JTextField getRaiseField()
   {
      return buttonPanel.raise.raiseField;
   }
   
   public int getRaiseAmount()
   {
      return Integer.parseInt(getRaiseField().getText());
   }
}
