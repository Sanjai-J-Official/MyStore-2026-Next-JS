/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.fromthehiddenleafstore.com',
  generateRobotsTxt: true,

  exclude: [
    '/api/*',
    '/admin/*',
    '/cart',
    '/checkout'
  ],

  additionalPaths: async () => {
    try {
      const res = await fetch('https://www.fromthehiddenleafstore.com/api/products');
      const result = await res.json();

      const products = result.data; 
      return products.map(product => ({
        loc: `/products/${product.slug}`,
        lastmod: new Date().toISOString(),
      }));

    } catch (err) {
      console.error('Sitemap error:', err);
      return [];
    }
  },
};