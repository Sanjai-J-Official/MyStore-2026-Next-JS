/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fromthehiddenleafstore.com', // change this
  generateRobotsTxt: true,

  exclude: [
    '/api/*',
    '/admin/*',
    '/cart',
    '/checkout'
  ],
};
