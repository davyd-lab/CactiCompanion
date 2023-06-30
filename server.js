const express = require('express');
const app = express();

app.get('/api/fetchImages', async (req, res) => {
  // Extract the cactusName from the request's query parameters
  const cactusName = req.query.cactusName;

  if (!cactusName) {
    // If cactusName is not provided, respond with an error
    return res.status(400).json({ error: 'Missing cactusName parameter' });
  }

  // Fetch images using the Programmable Search Engine
  // This is just a placeholder - replace this with your actual function
  const images = await fetchImagesFromSearchEngine(cactusName);

  // Respond with the fetched images
  return res.json(images);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});