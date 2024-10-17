/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Update this URL to match your server's address
    axios.get('http://142.93.221.113/wp-json/wp/v2/posts')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

  return (
    <div className="w-full h-10 mt-24 p-4">
      <h1 className="text-2xl font-bold text-yellow-600 mb-6">Posts</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <li 
            key={post.id} 
            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title.rendered}</h2>
            <div 
              className="mb-4" 
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            ></div>
            <a 
              href={post.link} 
              className="text-yellow-500 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
