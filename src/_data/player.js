const contentful = require('contentful');

// Initialize Contentful client
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID || 'a70tz55cwe4z',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'EnlBGBwpy9yKfbK97HDJlrXsBoUZVoLr4bRzX3hDh5s',
});

module.exports = async () => {
  // Fetch player data from Contentful
  const response = await client.getEntries({
    content_type: 'player',
    order: 'sys.createdAt',
  });

  // Transform the fetched data and add permalink
  return response.items.map(player => ({
    title: player.fields.title,
    slug: player.fields.slug,
    image: player.fields.image?.fields?.file?.url,
    description: player.fields.description,
    date: player.fields.date,
    permalink: `/player/${player.fields.slug}/index.html`  // Add permalink to data
  }));
};
