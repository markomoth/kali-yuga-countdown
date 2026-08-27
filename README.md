# Kali Yuga Countdown

A responsive, dependency-free single-page countdown to the traditional end of Kali Yuga. It runs directly from the repository root and is suitable for GitHub Pages project subpaths.

## Run locally

Because ES modules are used in the browser, serve the repository with any static file server, for example:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Test

```sh
npm test
```

## Typography

The stylesheet requests the open-source Cormorant Garamond and Inter families from Google Fonts, with carefully chosen system fallbacks. No font files or runtime packages are required; if the page is used offline, the fallback stack preserves the intended serif/sans-serif hierarchy.

## Chronology

The implementation uses an astronomical year representation internally so the commonly cited epoch of 3102 BCE can be calculated safely. The page explains the traditional 432,000-year duration, the conventional 428,899 CE ending year, and the fact that the exact day and second are a modern implementation convention.
