/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../spinner";

const BlogPost = ({ post }: { post: any }) => {
  return (
    <a href={`blog/${post.id}`}>
      <div className="bg-white border border-gray-200 max-w-full w-[330px] hover:cursor-pointer  rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 mb-4">
        <img
          className="w-full h-48 object-cover"
          src={`https://cfg8st-3002.csb.app${post.postImage.url}`}
          alt={post.postImage.alt}
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 ">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4">{post.postMeta.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </a>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Update this URL to match your server's address
    axios
      .get("https://cfg8st-3002.csb.app/api/posts")
      .then((response: any) => {
        console.log(response.data);
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="bg-black">
        <Spinner />
      </div>
    );
  if (error) return <p>Error loading posts: {error.message}</p>;

  return (
    <div className="w-full  p-4 h-[600px] bg-black">
      <h1 className="text-3xl text-center mt-4 mb-12 text-white">Blogs</h1>
      <div className="flex flex-wrap w-full justify-center gap-4 align-center">
        {posts &&
          posts.docs &&
          posts.docs.map((post: any) => <BlogPost key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default Blog;
