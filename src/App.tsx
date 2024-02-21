import { type ReactNode, useEffect, useState } from 'react';
import { z } from 'zod';

import BlogPosts, { type BlogPost } from './components/BlogPosts.tsx';
import { get } from './util/http.ts';
import fetchingImg from './assets/data-fetching.png';

const rawDataBlogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

// z.array() is a Zod method that creates a new schema based on another schema
// as the name suggests, it's simply an array containing the expected objects

const expectedResponseDataSchema = z.array(rawDataBlogPostSchema);

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();

  useEffect(() => {
    const fetchPosts = async function () {
      const data = await get(
        'https://jsonplaceholder.typicode.com/posts',
        expectedResponseDataSchema
      );

      // const parsedData = expectedResponseDataSchema.parse(data);

      // No more type casting via "as" needed!
      // Instead, here, TypeScript "knows" that parsedData will be an array
      // full with objects as defined by the above schema

      const blogPosts: BlogPost[] = data.map((rawPost) => {
        return {
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body,
        };
      });

      setFetchedPosts(blogPosts);
    };

    fetchPosts();
  }, []);

  let content: ReactNode;

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }
  return (
    <main>
      <img
        src={fetchingImg}
        alt='an abstract image depicting data fetching'
      />
      {content}
    </main>
  );
}

export default App;
