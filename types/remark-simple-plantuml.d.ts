declare module '@akebifiky/remark-simple-plantuml' {
  import type { Plugin } from 'unified';

  interface PlantUMLOptions {
    baseUrl?: string;
    format?: string;
  }

  const remarkSimplePlantUML: Plugin<[PlantUMLOptions?]>;
  export default remarkSimplePlantUML;
}
