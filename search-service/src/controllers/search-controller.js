const Search = require("../models/Search");
const logger = require("../utils/logger");

const searchPostController = async (req, res) => {
  logger.info("Search endpoint hit!");
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    // ১. ক্যাশ কি (Cache Key) তৈরি
    const cacheKey = `search:${query.toLowerCase()}`;

    // ২. চেক করুন ডাটা Redis-এ আছে কি না
    const cachedResults = await req.redisClient.get(cacheKey);
    if (cachedResults) {
      logger.info("Serving from Redis Cache");
      return res.json(JSON.parse(cachedResults));
    }

    // ৩. Redis-এ না থাকলে MongoDB থেকে অনুসন্ধান করুন
    const results = await Search.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    // ৪. ফলাফল Redis ক্যাশে সংরক্ষণ করুন (৩০০ সেকেন্ড = ৫ মিনিট)
    await req.redisClient.set(cacheKey, JSON.stringify(results), "EX", 300);

    res.json(results);
  } catch (e) {
    logger.error("Error while searching post", e);
    res.status(500).json({
      success: false,
      message: "Error while searching post",
    });
  }
};

module.exports = { searchPostController };