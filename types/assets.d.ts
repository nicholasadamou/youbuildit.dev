// Ambient declarations for side-effect asset imports (e.g. `import './globals.css'`).
// TypeScript 6 type-checks side-effect imports and needs these declarations.
// Empty module bodies allow `import './x.css'` (side-effect) while making value
// imports (`import styles from './x.css'`) a type error, matching how global CSS
// is used here (no CSS modules).
declare module '*.css' {}
declare module '*.scss' {}
