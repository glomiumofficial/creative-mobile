# Glomium — mobile site (m.glomium.co)

Separate visual pass for phones — vertical composition, stacked "creative / INFINITELY" lockup, single "Contact" link, no side nav. Same brand/system as the desktop site (white bg, `--green` #10AF8B, Jost).

Upload the contents of this folder to the `m.glomium.co` host:

```
index.html
site.js
assets/
  wordmark-green.png
  favicon.png
```

Tuning in `site.js`:
- `props.scrollLength` — svh multiple of scroll travel (default 5.6).
- `props.startZoom` — how tight the opening crop on the infinity leg is (default 22, higher = tighter).
- `bwEnd` calc in `measure()` — how much of the screen width the fully zoomed-out mark fills (0.86 currently).
