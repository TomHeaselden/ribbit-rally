# Development checks

These are the quick Python + [Playwright](https://playwright.dev/python/) scripts used while building the game. They open the built page (`out/renderer/index.html`) in a headless browser to take screenshots, simulate full races, measure sound levels and catch page errors. Screenshots and sound files they make go into `tests/output/`.

```bash
pip install playwright pillow numpy matplotlib
python -m playwright install chromium
npm run build                 # builds out/renderer/index.html
python tests/t55.py           # page loads with no errors (prints 0)
python tests/t13.py 0 25 61   # simulate full races on tracks 0, 25 and 61
```

Useful ones:

| Script | What it checks |
|---|---|
| `t55.py` | the page loads and runs with no JavaScript errors |
| `t13.py <track numbers>` | runs whole races with AI drivers and reports finishing times |
| `t79.py` | screenshots of the speedometer on desktop and phone layouts |
| `t81.py` | drives a race with sound on and logs the gear changes |
| `t82.py` | rubbing against rivals doesn't slow you down |
| `t84.py` | the music keeps playing while switching level tabs |
| `t92.py` | frog voice lines (uses a stand-in speech voice) |
| `t102.py` | draws each frog's hover dance as a sheet of frames (`dance-poses.png`) |
| `t103.py` | frogs dance on hover and stop when they talk |
| `t109.py <track numbers>` | two-player races driven to the finish, with the results text |
| `t110.py` | split-screen screenshots: side by side, stacked, and a tablet with two sets of buttons |
| `t111.py` | game controllers drive each player, and the two-player results screen |

The rest are one-off checks from earlier development, kept for reference. The Swiftshader browser flags some of them use (`--use-angle=swiftshader`) let WebGL run on machines without a graphics card.
