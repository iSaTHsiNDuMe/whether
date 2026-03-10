const { getLocations } = require("./_storage");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const locations = await getLocations();
    return res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to read locations." });
  }
};
