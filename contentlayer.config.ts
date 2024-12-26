import { Pluggable } from "unified";

import {ComputedFields, defineDocumentType, makeSource,} from "contentlayer/source-files"; // eslint-disable-line

import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import remarkPlantUML from "@akebifiky/remark-simple-plantuml";
import remarkToc from "remark-toc";

const getSlug = (doc: any) => doc._raw.sourceFileName.replace(/\.mdx$/, ""); // eslint-disable-line

const challengeComputedFields: ComputedFields = {
	slug: {
		type: "string",
		resolve: (doc) => getSlug(doc),
	},
};

export const Challenge = defineDocumentType(() => ({
	name: "Challenge",
	filePathPattern: `challenges/**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: {type: "string", required: true},
		summary: {type: "string", required: true},
		difficulty: {
			type: "enum", // Enforce strict typing with enum
			options: ["Beginner", "Intermediate", "Advanced"], // Define allowed values
			required: true,
		},
		category: {type: "string", required: true},
		skills: {type: "list", required: true, of: { type: "string" }},
		estimatedTime: {type: "string", required: true},
	},
	computedFields: challengeComputedFields,
}));

export default makeSource({
	contentDirPath: "content",
	documentTypes: [Challenge],
	mdx: {
		remarkPlugins: [
			remarkPlantUML as Pluggable,
			[remarkToc, { heading: "Table of Contents", maxDepth: 4 }],
		],
		rehypePlugins: [
			rehypePrism as Pluggable,
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "wrap", // Wrap the heading text in an anchor link
				},
			],
		],
	},
});
