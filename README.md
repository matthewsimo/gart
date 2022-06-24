# gart 

My simple generative art/creative coding environment built on sveltekit.

![gart sample](static/gart.png)

gart features:

- seeded pseudo random number generator
- GUI utils 
- animation support with simple flag
- default hotkeys, with support to easily add your own (see below)
- basic starter composition based on https://generativeartistry.com/tutorials/tiled-lines/ (Thanks for the inspiration Ruth & Tim!)

Some built in hotkeys:

- [space] - execute your clear handler
- [r] - execute clearAndRun (your clear handler thehn your run handlers)
- [s] - (in sample only currently) regen a seed (aka, the next run will use new random numbers) 
- [escape] - open/close GUI drawer

## Developing

Once you've created a project and installed dependencies with `pnpm install` start a development server with:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
The `--host` flag is useful if you want to "curate" on another device.