CUDDLE TOWN / עיר החמודים — character-care game
==================================================

HOW TO PLAY
  Open index.html in Chrome / Edge / Safari (double-click is enough).
  Everything is saved automatically in the browser (localStorage).
  3D mode needs an internet connection once per page load (three.js is loaded from cdnjs).

MODES
  Regular version : Dubi MH, Efrochi (+ Mama Hen), Lemilam (a llama), Ruchi, Dubila,
                    Marshmallow Cat, Mishmish  +  "Family Mode" tab (Mom, Sister 18,
                    Dad, Brother 14, Sister 8).
                    No trace of Hugsy / Joey / the apartments / the friends anywhere.
  VIP Mode        : tap the "VIP Mode" button at the bottom of the screen and type the code
                    El135791   (case does not matter).
                    Unlocks Hugsy + Joey, the realistic apartments, the friends, the original
                    catchphrases, the cereal-box / "Dr. Hugsy" story and the free-roam 3D apartment.
                    Tap the button again to return to the regular version.

MINI-GAMES: every activity is a full game (47 engines), e.g.
  real foosball (8 rods + AI), penalty shootout (shoot AND keep), basketball slingshot physics,
  tennis match, frisbee catch, 3-lane 3D-style runner, flying, jumping, mazes with fog of war,
  hide & seek, crane, cleaning with soap/scrub/rinse/dry, multi-step cooking (chop/stir/bake),
  rhythm lanes, dress-up orders, surgery, photo shoots, haggling, and "grand finale" chains.
  Each character has its own set of games and skins.

LANGUAGES  (gear button): Hebrew, English, Arabic, Russian, Spanish.
  Joey / Hugsy / friends' original lines always stay in English.

FILES
  index.html              page shell
  css/style.css           all styling
  js/i18n.js              languages + interface strings
  js/art.js               shaded SVG characters (incl. realistic people)
  js/scenes.js            SVG scenery for every world / room
  js/games.js, gk.js      game helpers + shared game kit
  js/g_*.js               the full mini-game engines
  js/activity_map.js      which game + skin each activity uses
  js/data_*.js            characters, activities, foods, unlocks, story chapters
  js/core.js              game logic, screens, missions, story, VIP
  js/world3d_build.js     realistic 3D apartments / furniture / people (three.js)
  js/world3d.js           3D free-roam logic
