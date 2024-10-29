/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../spinner";

const deploy = true;
const BLOG_API_LINK = deploy
  ? "https://chess-bet2.onrender.com"
  : "https://cfg8st-3002.csb.app";

// Define types for post and pagination
interface Post {
  id: string;
  title: string;
  postImage: {
    url: string;
    alt: string;
  };
  postMeta: {
    description: string;
  };
  createdAt: string;
}

interface PageInfo {
  page: number;
  totalPage: number;
}

const BlogPost: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <a href={`blog/${post.id}`}>
      <div className="bg-white border border-gray-200 w-[330px] hover:cursor-pointer rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 mb-4">
        <img
          className="w-full h-48 object-cover"
          src={`${BLOG_API_LINK}${post.postImage.url}`}
          alt={post.postImage.alt}
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-2">
            {post.postMeta.description.length > 70
              ? `${post.postMeta.description.substring(0, 70)}...`
              : post.postMeta.description}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </a>
  );
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<PageInfo>({ page: 1, totalPage: 1 });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${BLOG_API_LINK}/api/posts?page=${page.page}`
        );
        const data = response.data;
        setPosts(data.docs);
        setPage({ page: data.page, totalPage: data.totalPages });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page.page]);

  if (loading)
    return (
      <div className="bg-black flex justify-center items-center h-[400px]">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <p className="text-red-500 text-center">Error loading posts: {error}</p>
    );
    if (!posts || posts.length === 0) {
      return <p className=" text-center">No blogs available at the moment.</p>;
    }
    

  return (
    <div className="w-full p-4 bg-black">
      <h1 className="text-4xl text-center mt-4 mb-8 text-white font-bold">
        Blogs
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        {posts.map((post) => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
};

interface PaginationProps {
  page: PageInfo;
  onPageChange: (pageInfo: PageInfo) => void; // Function to handle page change
}

const Pagination: React.FC<PaginationProps> = ({ page, onPageChange }) => {
  const { page: currentPage, totalPage } = page;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange({ page: currentPage - 1, totalPage });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      onPageChange({ page: currentPage + 1, totalPage });
    }
  };

  return (
    <nav className="mt-6">
      <ul className="flex items-center justify-center space-x-2">
        <li>
          <button
            onClick={handlePreviousPage}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-white bg-yellow-500 border border-blue-400 rounded-l-lg hover:bg-yellow-600 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </li>

        {[...Array(totalPage)].map((_, index) => (
          <li key={index}>
            <button
              onClick={() => onPageChange({ page: index + 1, totalPage })}
              className={`flex items-center justify-center px-4 h-10 leading-tight text-white bg-yellow-500 border border-blue-400 hover:bg-yellow-600 ${
                currentPage === index + 1 ? "bg-yellow-600" : ""
              }`}
            >
              {index + 1}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={handleNextPage}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-white bg-yellow-500 border border-blue-400 rounded-r-lg hover:bg-yellow-600 ${
              currentPage === totalPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPage}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Blog;
