import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  articleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  articleCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease-in-out',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  articleTitle: {
    fontSize: '1.2em',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  articleText: {
    fontSize: '0.9em',
    color: '#34495e',
    marginBottom: '15px',
  },
  articleImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
};

const ArticleCard = ({ article }) => {
  const title = article?.attributes?.title || 'No Title';
  const sampleText = article?.attributes?.sample || 'No Sample Text';
  const imgData = article?.attributes?.img?.data;

  let imgUrl = null;
  if (imgData && imgData.length > 0 && imgData[0].attributes) {
    const formats = imgData[0].attributes.formats;
    if (formats && formats.thumbnail) {
      imgUrl = `http://139.84.236.241:1337${formats.thumbnail.url}`;
    } else if (imgData[0].attributes.url) {
      imgUrl = `http://139.84.236.241:1337${imgData[0].attributes.url}`;
    }
  } else if (typeof article?.attributes?.img === 'string') {
    imgUrl = article.attributes.img;
  }

  return (
    <div style={styles.articleCard}>
      <h2 style={styles.articleTitle}>{title}</h2>
      <p style={styles.articleText}>{sampleText}</p>
      {imgUrl && (
        <img 
          src={imgUrl} 
          alt={title} 
          style={styles.articleImage}
          onError={(e) => {
            console.error('Image failed to load:', imgUrl);
            e.target.style.display = 'none';
          }}
        />
      )}
      {!imgUrl && <p>No image available for this article</p>}
    </div>
  );
};

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://139.84.236.241:1337/api/articles?populate=img');
        setArticles(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError('Error fetching articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 style={styles.header}>Articles ({articles.length})</h1>
      <div style={styles.articleGrid}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div style={styles.app}>
      <ArticleList />
    </div>
  );
};

export default App;
