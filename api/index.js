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

    // সব possible field check করা
    const medias = parsed.medias || parsed.links || parsed.formats || parsed.videos || parsed.data || [];
    const title = parsed.title || parsed.meta?.title || parsed.video_title || "Video";
    const thumbnail = parsed.thumbnail || parsed.meta?.thumb || parsed.thumb || parsed.cover || null;

    let qualities = [];
    if (Array.isArray(medias) && medias.length > 0) {
      qualities = medias.map(m => ({
        quality: m.quality || m.label || m.resolution || m.type || "HD",
        url: m.url || m.link || m.src || m.download_url || "",
        size: m.size || m.filesize || null,
        ext: m.ext || m.format || "mp4",
      })).filter(m => m.url);
    }

    // Direct download link থাকলে
    if (qualities.length === 0) {
      if (parsed.url) qualities.push({ quality: "HD", url: parsed.url, ext: "mp4" });
      if (parsed.download_url) qualities.push({ quality: "HD", url: parsed.download_url, ext: "mp4" });
      if (parsed.video_url) qualities.push({ quality: "HD", url: parsed.video_url, ext: "mp4" });
    }

    return res.status(200).json({
      status: true,
      title,
      thumbnail,
      raw: parsed, // debug এর জন্য
      qualities,
      joinUs: CREDIT,
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message, joinUs: CREDIT });
  }
};
