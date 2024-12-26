// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkPlantUML from "@akebifiky/remark-simple-plantuml";
import remarkToc from "remark-toc";
var getSlug = (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "");
var challengeComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => getSlug(doc)
  }
};
var Challenge = defineDocumentType(() => ({
  name: "Challenge",
  filePathPattern: `challenges/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    difficulty: {
      type: "enum",
      // Enforce strict typing with enum
      options: ["Beginner", "Intermediate", "Advanced"],
      // Define allowed values
      required: true
    },
    category: { type: "string", required: true },
    skills: { type: "list", required: true, of: { type: "string" } },
    estimatedTime: { type: "string", required: true }
  },
  computedFields: challengeComputedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Challenge],
  mdx: {
    remarkPlugins: [
      remarkPlantUML,
      [remarkToc, { heading: "Table of Contents", maxDepth: 4 }]
    ],
    rehypePlugins: [
      rehypePrism,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap"
          // Wrap the heading text in an anchor link
        }
      ]
    ]
  }
});
export {
  Challenge,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-7LO6BJEE.mjs.map
