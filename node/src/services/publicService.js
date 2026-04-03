const { getSiteSettings, getHomeContent, getSeoSettings } = require("./settingsService");
const { getCategories, getProducts, getVideos, getBlogs } = require("./catalogService");

async function getPublicBootstrap() {
  const [siteSettings, homeContent, seo, categories, products, videos, blogs] =
    await Promise.all([
      getSiteSettings(),
      getHomeContent(),
      getSeoSettings(),
      getCategories(false),
      getProducts({ status: "published" }),
      getVideos({ status: "published" }),
      getBlogs({ status: "published" })
    ]);

  return {
    siteSettings,
    homeContent,
    seo,
    categories,
    products,
    videos,
    blogs
  };
}

module.exports = {
  getPublicBootstrap
};
