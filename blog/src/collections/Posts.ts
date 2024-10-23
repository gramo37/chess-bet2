import { CollectionConfig } from 'payload/types';
import Quote from '../blocks/Quote';
import Content from '../blocks/Content';
import Alert from '../blocks/Alert';

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['title', 'author', 'tags', 'status','category'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'postMeta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          minLength: 20,
          maxLength: 100,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          minLength: 40,
          maxLength: 160,
        },
        {
          name: 'keywords',
          label: 'Keywords',
          type: 'text',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Post Media',
          fields: [
            {
              name: 'postImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          label: 'Post Layout',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                Quote,
                Content,
                Alert
              ],
            },
          ]
        }
      ]
    },
// add sidebar fields here
  ],
}
export default Posts;