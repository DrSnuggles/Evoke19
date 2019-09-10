# evoke 2019 Results demo

Includes:
- ANSI / ASCII PC
- ANSI / ASCII Amiga
- Freestyle Gfx
- Pixel Gfx
- Party song
- Original libertine track
- Tracked libertine remixes
- Streamed music

Since there is no Renoise js playback routine available i decided to use an export (MP3/48kHz/320kbps).

## Idea

Show grafix while playing audio :)

~~Learn or do somthing new (at least for me: PWA(on-/offline detection and local data storage) )
or i just start with webworkers first
or with type="module"..~~

Reuse something old (lds.js + jsgoniometer)

~~Use friends work (webMPT with generic audio processor with Jürgen Wothke). I wait till his ~~
~~Use friends work (OpenMPT (libopenmpt+chiptune2))~~
~~Cowbell ??~~

Ammigaaaaaaaaaaaaaaaaa (style)

### Progress

Day 1: gathered all data, play using Wothke audio processor 0.1
Day 2: make amiga style with windows on a workbench. i'm not a designer 0.2
Day 3: wife
Day 4: work, still found time to play a bit with workers, ES6 modules, constructor
Day 5: windows and screens are moveable 0.3
Day5b: use SnuPlayer as constructor and finally use latest libopenmpt (based on chiptune2)

ToDo:
- AUDIO
  - make use of webworkers for audio playback => workers got no direct audioCtx
  - want to switch to latest libopenmpt version => last checked i still found js version best
  - make player look like DeliPlayer? HELP !!! => maybe use demozoo/cowbell
    - plays mp3/ogg/wav/flac + libopenmpt compatible
    - seek bar
    - displays samples infos or in mp3 included pics
    - more scopes

## evoke 2019 Infos

### Tracked music rulez
Competition: Tracked Music - “Libertine” Remix

This year, we decided to honour another PC demoscene classic:
“Libertine”, the soundtrack from Cascada’s “Hex Appeal” (1993).
Minimalistic sample usage and a catchy melody make it a particularly thankful remix candidate.The compo is endorsed by the original composer, Zodiak/Cascada.

The original song (libertine.mod) is available for download at Modland. Please keep in mind that despite the .mod file extension, this is a 6-channel Fast Tracker 2 module.
* Supported formats: XM IT S3M MOD RNS XRNS
* You are only allowed to use the original samples, no additional samples are allowed. You are not allowed to duplicate, cut or modify a sample via your tracker’s sample editor, apart from setting, moving or removing a loop. All other sample modifications have to be done via tracker commands. The original order of samples in the sample list has to remain intact.
* Some of the original melodies should be recognisable at least somewhere in you remix.
* Usage of VST plugins is NOT allowed.
* If you use Renoise, you are NOT allowed to use the internal effect and instrument devices. Also, you are allowed to use only one effect column at a time.
* Maximum playing time: 3:30, longer songs will be faded out from 3:30 to 3:40.
* Playback with current versions of OpenMPT (XM, S3M, IT), 8bitbubsy’s ProTracker (MOD), or Renoise (RNS, XRNS).