# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A collection of Chrome extensions. No build tools, package manager, or test framework — extensions are plain JS loaded directly as unpacked extensions via `chrome://extensions/`.

## Architecture

Each extension lives in its own subdirectory (e.g., `youtube/`) with a MV3 `manifest.json`.

**`youtube/`** — Hides addictive YouTube UI elements (home feed, shorts, suggested videos, end screens). Two-file structure:
- `background.js` — Re-injects the content script on SPA navigations via `chrome.webNavigation.onHistoryStateUpdated`
- `content.js` — Injects `<style>` blocks with CSS `!important` overrides targeting YouTube's internal element selectors. Handles page-specific logic (home, shorts redirect, watch page)

**`way2go/`** — Rewrites XHR requests to `www.goprogram.com` to remove the `www`. Uses `declarativeNetRequest` with a static ruleset — no JS needed.

**`googlemapsdark/`** — Applies dark mode to Google Maps based on system `prefers-color-scheme`. `style.css` inverts page colors and re-inverts imagery (images, videos, background-image elements, label overlays, and the Street View canvas). `content.js` flags Street View via a `data-street-view` attribute on `<html>` by watching the URL for `,3a,` with the Navigation API. The manifest `matches` list covers `www.google.<tld>/maps*` for every domain in https://www.google.com/supported_domains, since country domains like `www.google.com.my` serve Maps too.

## Development

Load the extension folder as unpacked in `chrome://extensions/` with Developer Mode enabled. Reload the extension after changes.
