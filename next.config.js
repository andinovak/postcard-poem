/** @type {import('next').NextConfig} */
const withYaml = require('next-plugin-yaml')

module.exports = withYaml({
  images: {
    domains: ['postcardpoems.co.uk', 'www.postcardpoems.co.uk', 'fancy-blini-926232.netlify.app'],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/config.yml',
        destination: '/admin/config.yml',
      },
    ]
  },
  webpack: (cfg) => {
    cfg.module.rules.push({
      test: /\.md$/,
      loader: 'frontmatter-markdown-loader',
      options: {},
    })
    return cfg
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
})
