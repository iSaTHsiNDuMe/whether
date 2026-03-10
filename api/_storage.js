let memoryLocations = [];

async function readFromVercelKv() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  const response = await fetch(`${url}/get/locations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to read from Vercel KV.");
  }

  const data = await response.json();

  if (!data.result) {
    return [];
  }

  const parsed = JSON.parse(data.result);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeToVercelKv(locations) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return false;
  }

  const response = await fetch(`${url}/set/locations/${encodeURIComponent(JSON.stringify(locations))}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to write to Vercel KV.");
  }

  return true;
}

async function getLocations() {
  const kvLocations = await readFromVercelKv();

  if (kvLocations !== null) {
    return kvLocations;
  }

  return memoryLocations;
}

async function saveLocationEntry(entry) {
  const current = await getLocations();
  const updated = [...current, entry];
  const savedToKv = await writeToVercelKv(updated);

  if (!savedToKv) {
    memoryLocations = updated;
  }

  return updated;
}

module.exports = {
  getLocations,
  saveLocationEntry
};
