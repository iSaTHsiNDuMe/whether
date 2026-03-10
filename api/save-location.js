const { saveLocationEntry } = require("./_storage");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { tag, latitude, longitude, ip, place, timestamp, weather } = req.body || {};

    if (!tag || typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ error: "Invalid location payload." });
    }

    const entry = {
      tag,
      latitude,
      longitude,
      ip: ip || "Unknown",
      place: place || "Unknown place",
      timestamp: timestamp || new Date().toISOString(),
      weather: weather || null
    };

    const all = await saveLocationEntry(entry);

    return res.status(201).json({ message: "Location saved.", data: entry, all });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save location." });
  }
};
