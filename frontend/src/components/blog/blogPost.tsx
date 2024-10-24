import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../spinner";

const deploy = true;
const BLOG_API_LINK = deploy
  ? "https://chess-bet2.onrender.com"
  : "https://cfg8st-3002.csb.app";

const BlogContent = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BLOG_API_LINK}/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!post) return null;

  return (
    <div className="max-w-[70%] mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <img
        src={`${BLOG_API_LINK}${post.postImage.url}`}
        alt={post.postImage.alt || "Blog Post Image"}
        className="w-full max-h-[500px] rounded-md mb-4"
      />
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.postMeta.description}</p>
      <p className="text-gray-500 mb-4 italic">
        Keywords: {post.postMeta.keywords}
      </p>

      {post.layout.map((section: any, index: number) => (
        <div key={index} className="mb-6">
          {section.content.map((contentBlock: any, blockIndex: number) => (
            <div key={blockIndex} className="mb-4 text-justify">
              {contentBlock.type ? (
                <Type child={contentBlock} childIndex={blockIndex} />
              ) : (
                contentBlock.children.map((child: any, childIndex: number) => (
                  <Layout
                    key={childIndex}
                    child={child}
                    childIndex={childIndex}
                  />
                ))
              )}
            </div>
          ))}
        </div>
      ))}

      <OtherBlogs />
    </div>
  );
};

const OtherBlogs = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BLOG_API_LINK}/api/posts?limit=3`);
        setPosts(response.data.docs);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
      <div className="flex flex-wrap justify-center  gap-4">
        {posts.map((post, i) => (
          <ContainerBlog key={i} post={post} />
        ))}
      </div>
    </div>
  );
};

const ContainerBlog: React.FC<{ post: any }> = ({ post }) => {
  return (
    <a href={`/blog/${post.id}`} className="w-[330px]">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 mb-4">
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

const Type = ({ child, childIndex }: { child: any; childIndex: number }) => {
  const renderChildren = () =>
    child.children.map((c: any, i: number) => (
      <Layout key={i} child={c} childIndex={i + childIndex} />
    ));

  switch (child.type) {
    case "upload":
      return (
        <img
          src={`${BLOG_API_LINK}${child.value.url}`}
          alt={child.value.alt || "Image"}
          className="w-full h-auto max-w-full max-h-[300px] rounded-md mb-4"
        />
      );
    case "h1":
      return <h1 className="text-3xl font-bold mb-4">{renderChildren()}</h1>;
    case "h2":
      return (
        <h2 className="text-2xl font-semibold mb-3">{renderChildren()}</h2>
      );
    case "h3":
      return <h3 className="text-xl font-medium mb-2">{renderChildren()}</h3>;
    case "h4":
      return <h4 className="text-lg font-medium mb-2">{renderChildren()}</h4>;
    case "h5":
      return <h5 className="text-base font-medium mb-2">{renderChildren()}</h5>;
    case "h6":
      return <h6 className="text-sm font-medium mb-2">{renderChildren()}</h6>;
    case "ul":
      return (
        <ul className="list-disc list-inside pl-5 mb-4">{renderChildren()}</ul>
      );
    case "ol":
      return (
        <ol className="list-decimal list-inside pl-5 mb-4">
          {renderChildren()}
        </ol>
      );
    case "indent":
      return <div className="w-full pl-6 mb-4">{renderChildren()}</div>;
    default:
      return null;
  }
};

const Layout = ({ child, childIndex }: { child: any; childIndex: number }) => {
  if (child.type === "link" && child.url) {
    return (
      <a
        href={child.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-blue-600 hover:underline ${
          child.bold ? "font-bold" : ""
        } ${child.italic ? "italic" : ""}`}
      >
        {child.children.map((c: any, i: number) => (
          <Layout key={i} child={c} childIndex={i + childIndex} />
        ))}
      </a>
    );
  } else if (child.type === "li") {
    return (
      <li className="mb-2" key={childIndex}>
        {child.children.map((c: any, i: number) => (
          <Layout key={i} child={c} childIndex={i + childIndex} />
        ))}
      </li>
    );
  }

  return <BlogText key={childIndex} child={child} />;
};

const BlogText = ({ child }: { child: any }) => {
  let content = <>{child.text}</>;

  if (child.bold) {
    content = <strong>{content}</strong>;
  }
  if (child.italic) {
    content = <em>{content}</em>;
  }
  if (child.strikethrough) {
    content = <s>{content}</s>;
  }
  if (child.code) {
    content = (
      <code className="bg-gray-100 text-red-500 p-1 rounded-md break-words">
        {content}
      </code>
    );
  }

  return <>{content}</>;
};

export default BlogContent;
