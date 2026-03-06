# SpeakUp Mascot — Web CSS Sprite

Use the Speaky mascot on a website or in any HTML page with a single element and CSS classes.

## Assets

- **Sprite sheet:** `../assets/speakup-mascot-sheet.png` (3 frames in one row: friendly, analytical, celebratory).

## Files

- **mascot-sprite.css** — Base class `.speakup-mascot` and modifiers `.pose-friendly`, `.pose-analytical`, `.pose-celebratory`. Percentage-based `background-position` so you can calibrate by adjusting the container size.
- **mascot-sprite-example.html** — Static example with one pose and labels, plus buttons that call `setMascotPose(poseName)` to switch poses.

## Usage

1. Link the stylesheet and use one element plus one pose class:

```html
<link rel="stylesheet" href="mascot-sprite.css" />

<div id="mascot" class="speakup-mascot pose-friendly"></div>
<p class="speakup-mascot__label">WELCOME! Speaky is ready to help you shine!</p>
```

2. Switch poses from JavaScript:

```js
function setMascotPose(poseName) {
  const el = document.getElementById('mascot');
  if (!el) return;
  el.classList.remove('pose-friendly', 'pose-analytical', 'pose-celebratory');
  el.classList.add('pose-' + poseName);
}
setMascotPose('analytical'); // or 'friendly', 'celebratory'
```

## Calibration

If the sprite frame boundaries don’t line up, adjust in **mascot-sprite.css**:

- **Container size:** `.speakup-mascot` `width` / `height` (one frame’s viewport).
- **Positions:** `.pose-analytical` uses `-33.333% 0`, `.pose-celebratory` uses `-66.666% 0`. If your sheet has different spacing, change these (e.g. to pixel values like `-300px 0` after you know one frame width).

## Running the example

Serve the project root (so `../assets/speakup-mascot-sheet.png` resolves), then open:

`http://localhost:8080/web/mascot-sprite-example.html`

Or from repo root: `npx serve .` and visit `/web/mascot-sprite-example.html`.
