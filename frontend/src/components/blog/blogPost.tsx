import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Update this URL to match your server's address
    axios
      .get(`https://cfg8st-3002.csb.app/api/posts/${id}`)
      .then((response: any) => {
        console.log(response.data);
        setPost(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  if (!post) return <></>;
  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg">
      <img
        src={`https://cfg8st-3002.csb.app${post.postImage.url}`}
        alt={post.postImage.alt || "Blog Post Image"}
        className="w-full h-auto rounded-md mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.postMeta.description}</p>
      <p className="text-gray-500 mb-4 italic">
        Keywords: {post.postMeta.keywords}
      </p>

      {post &&
        post.layout.map((section: any, index: any) => (
          <div key={index} className="mb-6">
            {section.content.map((contentBlock: any, blockIndex: any) => (
              <>
                <Type child={contentBlock} />
                <div key={blockIndex} className="mb-4">
                  {contentBlock.children.map((child: any, childIndex: any) => {
                    return (
                      <>
                        <Layout child={child} childIndex={childIndex} />
                      </>
                    );
                  })}
                </div>
              </>
            ))}
          </div>
        ))}
    </div>
  );
}

const Type = (child: any) => {
  console.log(child);
  if (child.type && child.type == "upload") {
    return (
      <>
        <img
          src={`https://cfg8st-3002.csb.app${child.value.url}`}
          alt="mklsa"
        />
      </>
    );
  }
};

const Layout = ({ child, childIndex }: any) => {
  if (child.url) {
    return (
      <a
        key={childIndex}
        href={child.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-blue-600 hover:underline ${
          child.bold ? "font-bold" : ""
        } ${child.italic ? "italic" : ""}`}
      >
        {child.children.map((c: any, i: any) => (
          <Layout child={c} childIndex={i + childIndex} />
        ))}
      </a>
    );
  }

  return (
    <span
      key={childIndex}
      className={`${child.bold ? "font-bold" : ""} ${
        child.italic ? "italic" : ""
      }`}
    >
      {child.text}
    </span>
  );
};
