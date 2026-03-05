const https = require("https");

const CREDIT = "Telegram - @gp_sandii_h4x - Instagram - @GP_SANDII_H4X - Youtube - @ssbsakibyt40k";
const VIDSSAVE_AUTH = "20250901majwlqo";
const VIDSSAVE_DOMAIN = "api-ak.vidssave.com";

const SUPPORTED = ["youtube.com","youtu.be","instagram.com","facebook.com","fb.watch","tiktok.com","twitter.com","x.com","dailymotion.com","vimeo.com","pinterest.com","reddit.com"];

function detectSource(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "Facebook";
  if (url.includes("tiktok.com")) return "TikTok";
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter/X";
  return "Other";
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { url } = req.query;
  if (!url) return res.status(400).json({ status: false, error: "?url= দিন", joinUs: CREDIT });
  try {
    const apiUrl = "https://api.vidssave.com/api/contentsite_api/media/parse?auth=" + VIDSSAVE_AUTH + "&domain=" + VIDSSAVE_DOMAIN + "&origin=source&link=" + encodeURIComponent(url);
    const data = await fetchData(apiUrl);
    const parsed = JSON.parse(data);
    const medias = parsed.medias || parsed.links || parsed.formats || [];
    return res.status(200).json({
      status: true,
      title: parsed.title || "Video",
      thumbnail: parsed.thumbnail || null,
      duration: parsed.duration || null,
      source: detectSource(url),
      qualities: medias.map(m => ({ quality: m.quality || "HD", url: m.url || m.link || "", size: m.size || null, ext: m.ext || "mp4" })).filter(m => m.url),
      joinUs: CREDIT,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message, joinUs: CREDIT });
  }
};

function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 30000 }, (r) => { let d = ""; r.on("data", c => d += c); r.on("end", () => resolve(d)); }).on("error", rejeENDOFFILE
