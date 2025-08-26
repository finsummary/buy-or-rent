import { makeSource } from 'contentlayer/source-files';
import { Post } from './src/lib/contentlayer/posts';

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
});

