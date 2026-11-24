# Instant LiDAR project page

Static project page for https://kangx326.github.io/Instant-LiDAR/ .

Serve this directory over HTTP (for example `python3 -m http.server 8000`) to use the interactive point clouds. Opening `index.html` directly shows the static content, but browsers restrict local fetches. There is no build step, analytics, external font, CDN, or runtime dependency.

## Presentation

- The hero shows an actual saved Instant LiDAR scan with a pausable 3D orbit.
- Overview and method precede the experiments. Cosmos × Instant LiDAR remains the final application section.
- Reconstruction charts separate Waymo and Physical AI. Geometry and time are available together.
- The point-cloud explorer synchronizes the camera between NuRec / LiDAR-EVS and Instant LiDAR. Drag, scroll, keyboard arrows, plus/minus, and mobile pinch gestures are supported. Presets show the whole scene, a street corner, or a top view.
- Detection plots separate conditioning, held-out, and shifted queries. Their scale is fixed across all settings.
- All 66 seconds of the 1080p Cosmos workflow are retained, with narration, captions, and chapter navigation.

The visual organization is inspired by https://supermimic.github.io/ . All HTML, CSS, JavaScript, and Instant LiDAR visualization assets are original to this project page; no SuperMimic artwork or code is used.

## Evidence and data

Scientific values come from the supplied manuscript (`assets/instant-lidar-paper.pdf`). `app.js` stores the reported tables without changing values. The 66-second Waymo average, 127-second Physical AI average, and approximately 51-second application example have distinct scopes.

`assets/explorer/manifest.json` describes six saved rendered scans: Waymo w100pap1, frame 22, original sensor pose and a 3 m left shift, for NuRec, LiDAR-EVS, and Instant LiDAR. Each `.bin` stores interleaved little-endian float32 x/y/z/intensity. The export retains every point within the common x/y bounds [-45,45] m and uses the original vehicle coordinate system. No extra translation, geometry synthesis, or subsampling is performed. File lengths, point counts, and SHA-256 digests are recorded in the manifest.

Both panels use the same camera and intensity transfer (0–0.3, square-root gamma). The viewer only visualizes saved scans; it does not run model inference or a Gaussian renderer. Detection overlays use the saved score-ordered, same-class frame matching at a score threshold of 0.3 and IoU thresholds of 0.7/0.5/0.5. They are qualitative overlays, not per-frame AP. Aggregate AP comes from the paper and is presented separately. There is no measured ground-truth scan at the shifted pose.

WebGL is required for 3D. Static previews and videos remain available without WebGL. Initial loading fetches only the hero scan; other scans load when the explorer approaches the viewport or a method is selected. Rendering stops when a canvas is off-screen; reduced-motion preferences disable automatic rotation.

## Files

- `index.html`, `styles.css`: content and responsive layout.
- `app.js`: benchmark charts, detection settings, video chapters, citation.
- `viewer.js`: dependency-free WebGL point rendering and synchronized controls.
- `assets/workflow.mp4`: complete 66-second application video, unchanged.
- `assets/reconstruction.mp4`: complete previously approved comparison, unchanged.
- `assets/explorer/`: browser data, manifest, and static fallback views.

Local export and browser verification scripts are retained in the working project's `tmp/instant-lidar-redesign/` directory. Older page source is archived in `tmp/instant-lidar-redesign/previous-site/`.
