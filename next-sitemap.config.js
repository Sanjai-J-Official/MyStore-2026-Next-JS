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
      // Fetch dynamic products
      const pRes = await fetch('https://www.fromthehiddenleafstore.com/api/products');
      const pData = await pRes.json();
      const productsPaths = pData.data.map(product => ({
        loc: `/products/${product.slug}`,
        lastmod: new Date().toISOString(),
      }));

      // Fetch dynamic published blogs
      const bRes = await fetch('https://www.fromthehiddenleafstore.com/api/blogs');
      const bData = await bRes.json();
      // Handle the data array - note that blogs API returns blogs including drafts if hit internally,
      // but 'https://www.fromthehiddenleafstore.com/api/blogs' probably doesn't filter drafts natively. 
      // Safe approximation assuming production API returns everything including drafts: filter locally
      const blogsPaths = (bData.data || [])
        .filter(blog => blog.visibility === 'published')
        .map(blog => ({
          loc: `/blog/${blog.slug}`,
          lastmod: new Date().toISOString(),
        }));

      return [...productsPaths, ...blogsPaths];

    } catch (err) {
      console.error('Sitemap error:', err);
      return [];
    }
  },
};