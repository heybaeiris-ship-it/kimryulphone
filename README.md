# iPhone Website — cleaned edition

Open `index.html` in a browser, or use VS Code Live Server.

## Included
- Lock screen, home, Instagram, Notes, Spotify, Phone, Photos, Messages and existing interactions from the supplied code.
- Instagram and Notes are read-only and seeded from `script.js`, so all visitors see the same published content regardless of localStorage.
- Spotify song list row styles are included.

## Customize the published content
- Edit `defaultNotes` at the start of `script.js`.
- Edit `igInitialData` in `script.js` (profile, posts, captions, stories).
- Replace `images/ig-avatar.svg`, `ig-post1.svg`, `ig-post2.svg`, `ig-post3.svg` with your own images, or change paths in `igInitialData`.

## IMPORTANT: original media not included in uploaded code
The original `images/` and `audio/` assets were not attached. This archive includes only four clearly labeled Instagram sample SVGs. Copy your real files from the original project, preserving case-sensitive filenames, including:

- images/wallpaper.png, images/lock-wallpaper.PNG, images/phone-profile.jpg, images/my-playlist.JPG
- images/post1.jpg, images/post2.jpg, images/post3.jpg
- images/song1.png, images/song2.JPG, images/song3.JPG
- images/contact1.jpg, images/contact2.jpg, images/contact3.jpg
- images/photos/photo1.JPG through photo8.JPG
- audio/ringtone.mp3, audio/voice.mp3, audio/song1.mp3 through song3.mp3

Without these assets the corresponding images/audio cannot load. No copyrighted songs or original photos have been fabricated.

## Notes
The CSS was consolidated conservatively: unused legacy `.music-*` layout rules were removed; working rules for other apps were retained to avoid regressions. For true security, don't put private information in this client-side site. Test all app interactions after restoring your assets.
