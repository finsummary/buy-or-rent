// contentlayer.config.ts
import { makeSource } from "contentlayer/source-files";

// src/lib/contentlayer/posts.ts
import { defineDocumentType } from "contentlayer/source-files";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "")
    }
  }
}));

// contentlayer.config.ts
var contentlayer_config_default = makeSource({
  contentDirPath: "posts",
  documentTypes: [Post]
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-ACAJPVW3.mjs.map
