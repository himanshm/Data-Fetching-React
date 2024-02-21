import { type ReactNode, useEffect, useState } from 'react';

import BlogPosts, { type BlogPost } from './components/BlogPosts.tsx';
import { get } from './util/http.ts';
import fetchingImg from './assets/data-fetching.png';

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();

  /* This get function here is marked as async and out of the box by default, async will ensure that this function wraps any data that you might be returning into a promise. So it will always yield a promise that will then eventually resolve to the data you are returning. Therefore, we actually need to wait for this promise to resolve, */

  // the effect function shouldn't return a promise. Instead, if it does return anything at all, it should return such a cleanup function.

  useEffect(() => {
    const fetchPosts = async function () {
      const data = (await get(
        'https://jsonplaceholder.typicode.com/posts'
      )) as RawDataBlogPost[];

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
