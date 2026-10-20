# Apple-minimal redesign implementation

## Design intent
- Monochrome black/white/gray palette with large whitespace and restrained motion.
- Preserve the static HTML/CSS/JS architecture and GitHub Pages deployment.
- Keep all content records, public URLs, legacy redirects, and original media assets.

## Implemented in this branch
- Added a shared refinement stylesheet loaded by the shared site shell after page-specific styles.
- Normalized shared theme variables, reduced shadows and motion, and refined long-form article readability.
- Simplified homepage spacing and typography.
- Refined portfolio card treatment while preserving the existing gallery and viewer.
- Aligned the design reference page with the monochrome direction.

## Validation plan
1. Run `node scripts/check-site.mjs` on Node.js 18 or newer.
2. Confirm all legacy route targets and all dynamic content image/href paths.
3. Test Home → Works → image viewer and Home → Blog → article.
4. Test light/dark/system themes, keyboard focus, reduced-motion behavior, and mobile widths (320, 390, 768, 1280 px).
5. Confirm GitHub Pages deployment only after review and merge.

## Constraints
- No content IDs, article slugs, URLs, or legacy redirect files are to be removed.
- The main branch is not modified by this redesign branch.
- Automated source checks do not replace browser-level visual and interaction testing.
