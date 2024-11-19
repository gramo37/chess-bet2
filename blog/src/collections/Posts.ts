import { CollectionConfig } from "payload/types";
import Content from "../blocks/Content";

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    defaultColumns: ["title", "tags", "category"],
    useAsTitle: "title",
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return {
        _status: { equals: "published" }, // Ensures only published posts are accessible
      };
    },
  },
  versions: {
    drafts: true, // Enable drafts
  },
  fields: [
    {
      name: "postMeta",
      type: "group",
      label: "SEO Metadata",
      fields: [
        {
          name: "title",
          label: "SEO Title",
          type: "text",
          required: true,
          minLength: 20,
          maxLength: 100,
        },
        {
          name: "description",
          label: "Meta Description",
          type: "textarea",
          required: true,
          minLength: 40,
          maxLength: 160,
        },
        {
          name: "keywords",
          type: "array",
          labels: {
            singular: "Keyword",
            plural: "Keywords",
          },
          fields: [{ name: "keyword", type: "text" }],
        },
      ],
    },
    {
      name: "title",
      label: "Post Title",
      type: "text",
      required: true,
    },
    {
      name: "tags",
      label: "Tags",
      type: "relationship",
      relationTo: "tags", // Matches the slug of the Tags collection
      hasMany: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Media",
          fields: [
            {
              name: "postImage",
              label: "Post Image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
          ],
        },
        {
          label: "Content Layout",
          fields: [
            {
              name: "layout",
              type: "blocks",
              blocks: [Content],
            },
          ],
        },
      ],
    },
  ],
};

export default Posts;
