module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const CREDIT = "Telegram - @gp_sandii_h4x - Instagram - @GP_SANDII_H4X - Youtube - @ssbsakibyt40k";
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: false, error: "?url= দিন", joinUs: CREDIT });
  }

  try {
    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://api.vidssave.com/api/contentsite_api/media/parse?auth=20250901majwlqo&domain=api-ak.vidssave.com&origin=source&link=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const parsed = await response.json();
    const medias = parsed.medias || parsed.links || parsed.formats || [];

    return res.status(200).json({
      status: true,
      title: parsed.title || "Video",
      thumbnail: parsed.thumbnail || null,
      duration: parsed.duration || null,
      qualities: medias.map(m => ({ quality: m.quality || "HD", url: m.url || m.link || "", size: m.size || null, ext: m.ext || "mp4" })).filter(m => m.url),
      joinUs: CREDIT,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message, joinUs: CREDIT });
  }
};
