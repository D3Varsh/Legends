require('dotenv').config();
const contentful = require('contentful');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
module.exports = function(eleventyConfig) {
  // Contentful Configuration
  const client = contentful.createClient({
    space:'a70tz55cwe4z',
    accessToken:'EnlBGBwpy9yKfbK97HDJlrXsBoUZVoLr4bRzX3hDh5s'
  });

  // Fetch the player data from Contentful
  eleventyConfig.addCollection("players", async function() {
    // Fetch all players from Contentful 
    const response = await client.getEntries({
      content_type: "player"  // "player" is the Contentful content type ID
    });

    // Map the response to an array of players
    return response.items.map(item => {
      return {
        title: item.fields.title,
        slug: item.fields.slug,
        image: item.fields.image ? item.fields.image.fields.file.url : null,
        description: documentToHtmlString(item.fields.description),
        date: item.fields.date,
        permalink: `/players/{{ slug }}/index.html`,
        url: `/player/${item.fields.slug}/`  // Link to the individual player page
      };
    });
  });

  // Passthrough file copy for static assets (like CSS)   
  eleventyConfig.addPassthroughCopy("src/_includes/css");

  // Return the default config
  return {
    dir: {
      input: "src",    // The input directory for your templates
      output: "dist", // The output directory for the compiled site
    },
  };
};
