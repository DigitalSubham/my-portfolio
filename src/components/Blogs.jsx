import React, { useState, useEffect } from "react";

const Blogs = () => {
  const [articles, setArticles] = useState([]);

  const Secret_KEY = `a5859a91-5eb1-46b5-b95d-4f6fe86c6e2d`;

  // React component
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/me/articles", {
          headers: {
            Authorization: Secret_KEY,
          },
        });
        const data = await response.json();
        console.log(data);
        setArticles(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {articles.map((article) => (
        <div key={article._id}>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <p>
            <a href={article.url}>Read more</a>{" "}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
