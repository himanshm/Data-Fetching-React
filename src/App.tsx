import { type ReactNode, useEffect, useState } from 'react';
import { z } from 'zod';

import BlogPosts, { type BlogPost } from './components/BlogPosts.tsx';
import { get } from './util/http.ts';
import fetchingImg from './assets/data-fetching.png';
import ErrorMessage from './components/ErrorMessage.tsx';

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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPosts = async function () {
      setIsFetching(true);
      try {
        const data = await get(
          'https://jsonplaceholder.typicode.com/posts',
          expectedResponseDataSchema
        );

        const blogPosts: BlogPost[] = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });

        setFetchedPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        // setError('Failed to fetch posts!');
      }

      setIsFetching(false);
    };

    fetchPosts();
  }, []);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if (isFetching) {
    content = <p id='loading-fallback'>Fetching posts...</p>;
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
