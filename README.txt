CUDDLE TOWN / עיר החמודים — character-care game
==================================================

HOW TO PLAY
  Open index.html in Chrome / Edge / Safari (double-click is enough), or upload the folder to
  GitHub Pages (Settings -> Pages -> deploy from the main branch).
  Everything is saved automatically in the browser (localStorage).
  The 3D views need an internet connection once per page load (three.js is loaded from cdnjs).
  Offline, the game keeps working with the 2D art.

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

3D CHARACTERS
  Every character is a real 3D model (procedural three.js, no external files): studio lights,
  reflections, soft shadow, blinking, breathing and mood animations.
  Drag the character to turn it around, tap it to make it jump.
  The "3D / 2D" button in the corner of the scene switches between the two looks.
  Hugsy wears his full outfit in 2D and 3D: striped knit beanie, brown aviator goggles,
  quilted golden zip vest with a striped hem, and a striped scarf. Items bought in the shop
  replace the matching piece (hat / glasses / neck / body).

HUGSY'S LAUNDRY
  Hugsy's outfit gets dirty while he plays and eats (see the "Outfit" bar). The "Laundry day"
  activity (living room) washes the vest, beanie, goggles and scarf in four wash games.
  There is also a daily "Wash Hugsy's outfit" mission and an epilogue story chapter.

ACCOUNTS  (the person button at the bottom)
  Create a profile (name + password) so every player keeps their own progress on this device.
  When you create one you can move your current progress into it.
  Sign in / log out / delete account are in the same window.
  Moving to another device: use "Backup: progress code" (copy the code or download it as a file)
  and "Restore from a progress code" on the other device.
  Notes: profiles live in this browser only (nothing is sent anywhere). Passwords are stored as a
  salted hash, which keeps family members out of each other's profiles - it is not bank-grade
  security. Clearing the browser data deletes profiles, so keep a progress code as a backup.

MINI-GAMES: every activity is a full game (47 engines), e.g.
  real foosball (8 rods + AI), penalty shootout (shoot AND keep), basketball slingshot physics,
  tennis match, frisbee catch (the frisbee always lands inside the field, with a landing shadow),
  PIVOT with Ross (tap in the slow-motion green zone - always winnable), 3-lane runner, flying,
  jumping, mazes with fog of war, hide & seek, crane, cleaning with soap/scrub/rinse/dry,
  multi-step cooking (chop/stir/bake), rhythm lanes, dress-up orders, surgery, photo shoots,
  haggling, and "grand finale" chains.
  Each character has its own set of games and skins.

LANGUAGES  (gear button): Hebrew, English, Arabic, Russian, Spanish.
  Joey / Hugsy / friends' original lines always stay in English.

FILES
  index.html              page shell
  css/style.css           all styling
  js/i18n.js              languages + interface strings
  js/art.js               shaded SVG characters (incl. realistic people)
  js/art_hugsy.js         Hugsy's plush art + beanie / goggles / vest / scarf (with dirt levels)
  js/scenes.js            SVG scenery for every world / room
  js/games.js, gk.js      game helpers + shared game kit
  js/g_*.js               the full mini-game engines
  js/activity_map.js      which game + skin each activity uses
  js/data_*.js            characters, activities, foods, unlocks, story chapters
  js/core.js              game logic, screens, missions, story, VIP
  js/accounts.js          profiles, password hashing, progress codes
  js/world3d_build.js     realistic 3D apartments / furniture (three.js)
  js/models3d_a.js        3D kit + Hugsy with his outfit
  js/models3d_b.js        3D plush pets
  js/models3d_c.js        3D people (also used in the apartment)
  js/stage3d.js           the 3D character stage (lights, camera, animation, input)
  js/world3d.js           3D free-roam logic
