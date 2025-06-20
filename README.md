Widgets I've created to improve the efficiency, output, and overall happiness of myself, my team, and those I trust at work.

# ASM Next Call Widget
ASM Next Call gives a 1-click solution to a 4-click problem, reducing fatigue and the existential dread that plagues us all.

Under normal circumstances with 2 calls per minute we are required to click a *minimum* of 3,840 times.

With my solution, we click a *maximum* of 960 times, which can be even lower with the countdown loop.

That's 2,880 less clicks--*and that's the minimum.*

My solution also reduces our wrap up time by a 1-4 seconds.

All of these statistics are assuming that the employee is "focused," which is usually not the case. Meaning that, most likely, the impacts of this solution are far greater than what has been calculated. Although mental fatigue cannot be directly measured, it is undoubtably relieved with this solution and can enable the dialer to give more efforts towards the quality of their call and keeping personal and team morale high.

[CLICK HERE FOR THE CODE](https://github.com/DanielMadden/programmers-are-lazy-id-rather-automate-my-job/blob/main/ASMNextCall.js)

## The Widget
<img src="https://github.com/user-attachments/assets/0071ee00-57cc-4d57-9f11-a6dfa862ade1" width="540">

## Invisibility
<img src="https://github.com/user-attachments/assets/b56b0f82-acef-4f5b-ac6a-d1d767755d32" width="270">

Widget will go near-invisible when the mouse is not on it.

## Complex Behaviors

## Looping
When "START LOOP" has been pressed, the loop will be active and the button will then say "STOP LOOP."
### Loop countdown
When the loop is active, it will trigger a countdown once conditions are met. The countdown will do an initial high pitched beep, then medium pitched beeps every second until the timer ends (default 3 seconds). Once the timer ends, a low pitched beep will sound and the ASM Next Call will be triggered. 

These are the conditions that will trigger a countdown:
- Agent Call: Dialing has lasted longer than 35 seconds
- Agent Call: Live Call has connected
  
### Stopping the loop countdown
The loop countdown can be stopped in two ways:
1. Pressing the "STOP LOOP" button
2. Hovering back over the widget after originally hovering off of it

# Tab / Toast Killer Widget

This widget keeps the tab count under 10 and removes the annoying toast notifications. It can mass kill or run a continous loop.

[CLICK HERE FOR THE CODE](https://github.com/DanielMadden/programmers-are-lazy-id-rather-automate-my-job/blob/main/TabToastKiller.js)
