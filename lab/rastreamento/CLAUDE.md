# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rastrei.me** is a client-side preventive health screening tool for Brazilian users. Users input their age, biological sex, and risk factors, and receive personalized exam recommendations based on guidelines from INCA, Ministério da Saúde, USPSTF, and Brazilian medical societies (SBC, SBD, SBU).

## Development

This is a static site with no build system, bundler, or dependencies. The entire app is three files:

- `index.html` — single-page structure (header, hero, how-it-works, form, results, about, footer)
- `app.js` — recommendation engine and form handling
- `styles.css` — all styling with CSS custom properties

To develop, open `index.html` directly in a browser or use any static file server (e.g., `python3 -m http.server`). There are no tests, linters, or CI pipelines.

## Architecture

The recommendation engine in `app.js` is a rule-based filter over the `EXAMS` array. Each exam object has:
- `appliesTo(profile)` — predicate that receives `{ age, sex, risks }` (risks is a `Set` of checkbox values)
- `frequency(profile)` — returns a frequency string, sometimes varying by risk factors
- Static fields: `id`, `name`, `category`, `icon`, `description`

On form submit, the app builds a profile from the form inputs, filters `EXAMS` by `appliesTo`, then renders matching exams sorted by category via `renderResults()`.

All processing is client-side — no data is sent to any server. The results section is toggled via the `hidden` attribute.

## Language

All user-facing content is in Brazilian Portuguese (pt-BR). Code identifiers and comments are in English.
