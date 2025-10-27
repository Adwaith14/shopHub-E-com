import React from 'react';

const Categories = () => {
  const categories = [
    {
      name: "Women's Fashion",
      count: '500+ Styles',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
      link: '#'
    },
    {
      name: "Men's Collection",
      count: '350+ Items',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80',
      link: '#'
    },
    {
      name: 'Accessories',
      count: '200+ Products',
      image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&q=80',
      link: '#'
    },
    {
      name: 'Footwear',
      count: '180+ Pairs',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
      link: '#'
    }
  ];

  return (
    <section className="categories">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Shop by Category</h2>
            <p className="section-subtitle">Explore our curated collections</p>
          </div>
          <a href="#" className="link-view-all">View All →</a>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <a href={category.link} key={index} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay"></div>
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.count}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
