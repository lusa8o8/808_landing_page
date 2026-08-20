# 808 Digital Systems brand foundation

- Status: approved colour foundation
- Approved: 2026-08-20
- Scope: public web application and SnapBook product preview
- Source of truth: `apps/web/src/app/globals.css`

## Brand character

808 should feel studied, intentional, grounded, quietly premium, and commercially practical. It should communicate capable digital infrastructure without adopting the cold, guarded mood of a security or enterprise-operations product. Warmth comes from ivory and amber; authority comes from deep forest; restraint comes from generous space and limited decoration.

The working verbal position remains practical and unshowy. The visual system should support that position rather than turn the company into a generic creative-agency brand.

## Approved colour system

| Role | Token | Value | Primary use |
| --- | --- | --- | --- |
| Background | `--background` | `#F4EFE3` | Main page canvas and warm product surfaces |
| Foreground | `--foreground` | `#202B24` | Primary text on light surfaces |
| Primary | `--primary` | `#26372D` | Brand blocks, controls, icons, and dark-on-amber text |
| Accent | `--accent` | `#DCA548` | Emphasis and calls to action on forest surfaces |
| Strong accent | `--accent-strong` | `#8A5714` | Small amber-family text and links on ivory surfaces |
| Muted foreground | `--muted-foreground` | `#666C63` | Secondary text on ivory surfaces |
| Overlay | `--overlay` | `#17201B` | Hero, footer-adjacent bands, and dark page sections |

## Contrast and pairing rules

- Forest text on amber and amber on forest use the `--primary` / `--accent` pairing. Its measured contrast is `5.71:1`.
- Small accent-family text on ivory must use `--accent-strong`, not the brighter `--accent`. Its measured contrast is `5.30:1`.
- Muted text on ivory measures `4.70:1`; do not reduce its opacity for essential body copy.
- Main foreground on ivory measures `12.78:1`.
- Amber buttons use forest text. Do not use white or ivory text on the approved amber.
- Bright amber may be used as text on dark forest surfaces, where it has sufficient contrast.
- Focus indicators must remain visible against both the component fill and its surrounding surface.

## Current application decisions

- The hero is a dark forest typographic/calculator composition with a restrained warm grid and amber glow. It does not use a stock-photo collage.
- The calculator remains the only hero interaction.
- The marketing header has no divider line over the hero.
- SnapBook inherits the approved global brand tokens through its configurable theme boundary. Future client themes may override its surface colours without changing the booking workflow.
- White remains available for raised cards where separation from the ivory canvas is useful; it is not a primary brand colour.

## Deferred identity decisions

- Display and body typography beyond the current Space Grotesk and Inter baseline.
- Logo, wordmark, monogram, and favicon development.
- Illustration, photography, iconography, motion, and pattern rules beyond the current restrained grid.
- Print colour conversions, production specifications, and a distributable brand-kit package.
- Client-facing SnapBook co-branding and white-label rules.

These decisions should be resolved through a later brand-identity or brand-kit phase using this document and the live token implementation as constraints. Do not infer an editorial-serif typography system from the colour reference alone.
