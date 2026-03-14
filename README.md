Project Demogorgon

1. Project Overview

Project Demogorgon is a real-world multiplayer hunting game inspired by the Stranger Things universe.

Players move physically around a real environment while their phones act as Hawkins Lab radar devices that detect nearby signals.

One player is secretly assigned as the Demogorgon, while the remaining players become Security Agents attempting to survive.

Players must interpret radar signals, hide using stealth, and avoid the Demogorgon while navigating inside a defined game arena.

The game combines real-world movement, multiplayer networking, smartphone sensors, and radar-based gameplay mechanics to create a suspenseful asymmetric hunting experience.

⸻

2. Core Gameplay Concept

The game simulates a Hawkins Lab containment scenario where strange signals from the Upside Down have been detected.

Security agents are deployed to investigate using experimental radar devices.

However, one of the players is secretly the Demogorgon hunting the agents.

Players must rely on radar signals and situational awareness to survive.

A special player role, the Sheriff, has the ability to eliminate the Demogorgon using a single bullet.

⸻

3. Game Arena (Map System)

The game takes place inside a virtual arena centered around the starting location.

Arena size: 100 meter radius.

The starting point becomes the center of the arena.

Players must remain inside the arena.

If a player leaves the arena, their signal is lost and their radar dot disappears until they return inside the arena.

The arena ensures a controlled gameplay area, consistent radar detection, and easier game balancing.

⸻

4. Game Start Dispersal Phase

At the start of each match, all players are initially in the same location.

To prevent immediate detection, the game includes a 10-second dispersal phase.

When the host starts the game:

Roles are assigned to all players.

A 10-second countdown begins.

Players move away from the starting point and spread out across the arena.

During this phase the following systems are disabled:

Radar detection
Proximity warnings
Special abilities

When the countdown reaches zero, the hunt begins and radar detection becomes active.

A warning beep sound plays during the final seconds of the countdown to build tension before the game starts.

⸻

5. Player Roles

The game includes three player roles: Security Agents, Sheriff, and Demogorgon.

⸻

5.1 Security Agents

Security agents are the main players attempting to survive the Demogorgon.

Abilities:

Security agents can see radar signals of nearby players, receive proximity warnings, and activate stealth mode by standing still.

Limitations:

Security agents cannot identify which radar dot represents the Demogorgon. They must interpret radar signals themselves.

⸻

5.2 Sheriff

One player is randomly assigned as the Sheriff.

The Sheriff has a single bullet that can eliminate the Demogorgon.

If the Sheriff successfully shoots the Demogorgon, Security wins immediately.

If the Sheriff shoots an innocent player, the innocent player dies.

All players receive the same elimination notification so they cannot determine whether the Sheriff or the Demogorgon caused the elimination.

After firing the bullet, the Sheriff cannot shoot again.

To balance gameplay, the Sheriff radar range is reduced to 5 meters while normal player radar range is 10 meters.

Sheriff warning messages are weaker and display messages such as “Strange Signal Detected”.

⸻

5.3 Demogorgon

The Demogorgon is the hunter role.

Its objective is to capture all security agents before the game timer expires.

Advantages of the Demogorgon include a stronger radar system, larger detection range, and a special invisibility ability.

The Demogorgon radar range is approximately 15 meters.

The Demogorgon radar can display the exact positions of nearby players.

⸻

6. Radar System

The radar system is the core gameplay mechanic.

Each player’s phone functions as a radar device detecting nearby signals.

Security players see nearby players as identical radar dots.

Dots have no labels and no role indicators, so players cannot determine which signal represents the Demogorgon.

Players must analyze radar signals and react accordingly.

The Demogorgon radar is more advanced and shows exact player locations with an extended detection range.

⸻

7. Proximity Warning System

When the Demogorgon approaches a player, warning alerts are triggered.

Warnings include visual alerts, vibration, and sound effects.

Example message: “Demogorgon Nearby”.

Even when warnings are triggered, the radar still does not identify which radar dot is the Demogorgon.

⸻

8. Capture Mechanism

If the Demogorgon gets extremely close to a player, the player is captured.

Captured players are removed from the radar and marked as eliminated in the player list.

All players receive a notification indicating that a player has been eliminated.

⸻

9. Motion-Based Stealth Mode

Players can hide using the phone’s accelerometer sensor.

If a player remains still for approximately 5 seconds, stealth mode activates.

While in stealth mode, the player’s radar signal disappears and they cannot be detected by radar.

Moving again disables stealth mode and the player becomes visible on radar.

⸻

10. Demogorgon Invisibility Ability

The Demogorgon can temporarily become invisible.

The invisibility duration is approximately 10 seconds with a cooldown of about 60 to 90 seconds.

During invisibility the Demogorgon disappears from radar and proximity warnings stop triggering.

If the Demogorgon gets extremely close to a player, heartbeat sounds may still occur.

⸻

11. Noise Detection Mechanic

The game uses the phone microphone to detect sound levels.

If a player makes loud noises such as talking, running, or shouting, their radar signal becomes stronger and easier to detect.

This simulates the Demogorgon tracking players by sound.

⸻

12. Radar Signal Processing

Bluetooth RSSI signals are used to estimate distance between players.

Since RSSI values can be unstable, the system applies signal smoothing.

Multiple RSSI readings are collected and averaged before calculating distance.

This prevents radar dots from jumping randomly and improves radar stability.

⸻

13. Radar Visualization

The radar interface includes a circular radar display, radar sweep animation, moving player dots, and a center marker representing the player.

Dots move smoothly to simulate real radar tracking.

This interface mimics real radar equipment.

⸻

14. Game Timer

Each match lasts approximately 5 minutes.

A visible countdown timer increases tension and urgency.

⸻

15. Player Status Panel

The interface displays player status showing who is still alive and who has been eliminated.

Example:

Players
Mike – Alive
Dustin – Alive
Lucas – Eliminated
Eleven – Alive

⸻

16. Game End Conditions

The game ends in one of two ways.

Demogorgon Victory: All security agents are captured.

Security Victory: The Sheriff eliminates the Demogorgon or the game timer expires before all players are captured.

⸻

17. Technical Architecture

Frontend technologies include React, Vite, Tailwind CSS, and Socket.io client.

Frontend responsibilities include radar visualization, UI components, alerts, animations, and sensor interaction.

Backend technologies include Node.js, Express, and Socket.io.

Backend responsibilities include multiplayer lobby management, role assignment, proximity calculations, game state management, and real-time synchronization.

⸻

18. Sensors Used

The game integrates several smartphone sensors.

Bluetooth is used for proximity detection between devices.

The accelerometer is used for motion detection to activate stealth mode.

The microphone is used for noise detection to increase radar signal strength when players make noise.

⸻

19. Project Folder Structure

project-demogorgon
frontend
components
pages
radar
lobby
alerts

backend
server
game
sockets

sensors
bluetooth
motion
noise

docs
architecture.md
game-rules.md

⸻

20. Gameplay Loop

Players join the multiplayer lobby.

The host starts the game.

Roles are randomly assigned.

A 10-second dispersal phase begins allowing players to spread out.

Radar detection activates.

The Demogorgon hunts players while security agents attempt to survive.

The Sheriff may attempt to eliminate the Demogorgon.

The game ends when victory conditions are met.

⸻

21. Key Innovation

Project Demogorgon combines real-world movement, radar-based detection, asymmetric multiplayer gameplay, and smartphone sensor integration.

Players must interpret uncertain radar signals rather than receiving exact information, creating suspense, strategy, and immersive gameplay.
