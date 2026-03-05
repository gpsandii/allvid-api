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
    const json = await response.json();
    const parsed = json.data || json;

    const resources = parsed.resources || [];
    const qualities = resources
      .filter(r => r.type === "video" && r.download_url)
      .map(r => ({
        quality: r.quality,
        url: r.download_url,
        size: r.size,
        ext: r.format,
      }));

    const audio = resources
      .filter(r => r.type === "audio" && r.download_url)
      .map(r => ({
        quality: r.quality,
        url: r.download_url,
        size: r.size,
        ext: r.format,
      }));

    return res.status(200).json({
      status: true,
      title: parsed.title || "Video",
      thumbnail: parsed.thumbnail || null,
      duration: parsed.duration || null,
      video: qualities,
      audio: audio,
      joinUs: CREDIT,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message, joinUs: CREDIT });
  }
};
