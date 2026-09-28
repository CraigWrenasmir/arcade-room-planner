# Arcade room planner

A browser-based furniture planner for a 15 m² office in Newcastle's City Arcade. No account is required. Built for exact furniture sizing inside an adjustable, photograph-informed room estimate.

## Use it

- Choose a table, desk, bookcase, chair, sofa, cabinet, rug or plant. Enter width, depth and height in centimetres. These are the complete outer dimensions before rotation.
- Drag pieces in the 3D room or floor plan, or enter centre positions. Desktop palette items can also be dragged into the scene.
- Rotate, duplicate, remove, undo and redo. The optional grid is 50 cm; movement can snap to 5 cm.
- Adjust room measurements in **The room**. Area lock keeps the floor at 15 m² by deriving the other wall length.
- **Share layout** copies a link containing a snapshot. The recipient edits their own copy. There is no live shared session or backend.
- Your current arrangement and up to 12 named layouts are saved in this browser's local storage. Export JSON for portable editable backups.
- Download a GLB for Blender via File → Import → glTF 2.0. Geometry is in metres. GLB exports include all walls even when the web view is a cutaway.

Keyboard: arrows move a selected piece 5 cm; Shift + arrow moves 1 cm; R rotates 90°; Delete removes; Cmd/Ctrl Z undoes.

## Measurement evidence and limits

**Only the supplied 15 m² area is known.** Initial internal dimensions are 3.50 m × (15/3.50) m, with an estimated 3.20 m ceiling. These proportions cannot be established precisely from the photographs. A measured wall length would substantially improve the plan. All openings, fixture sizes, positions, and door clearance are also estimates.

The reconstruction was informed by five current photos, a 32-second walkthrough and two older listing images. Looking from the entrance toward the windows, there are two rear sash windows, a sink cabinet at the rear right, a three-panel mirror on the left wall, and a front entrance near the right corner. The current white walls and charcoal floor take precedence over the older cream finishes. Original source media is not included in this repository.

Furniture outer dimensions are normalized to the entered centimetre values. Fit alerts compare rectangular footprints; they do not model access around chairs or irregular object surfaces. The door alert uses a conservative square around the estimated swing. The public page defaults to an empty room. Furniture shown in any demonstration is an example layout.

## Run locally

```sh
npm ci
npm start
```

Open http://localhost:4287. Static browser assets are in `dist/`. Three.js 0.186.1 and the required controls/exporter are vendored there, with the MIT licence in `dist/vendor/THREE-LICENSE.txt`, so runtime assets load from this site rather than a third-party CDN.

`npm run check` checks application syntax. GitHub Pages serves the reviewed static directory from the `codex/github-pages` branch.

## Privacy

There is no analytics, account system, external API or upload service. Layouts are saved locally. Share links put the layout in the URL fragment; anyone you share the link with can read that layout. Downloaded JSON files contain room dimensions, item names, colours and placements.

Experimental WebMCP read/add tools are feature-detected. Their registration and valid/invalid execution were tested against both an API shim and the native Codex browser WebMCP interface, with state read-back.
