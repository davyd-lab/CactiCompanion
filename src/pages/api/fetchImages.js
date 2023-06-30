// pages/api/fetchImages.js
import { fetchImages } from '../../../utils';

export default async (req, res) => {
  try {
    const { query: { cactusName } } = req;
    const images = await fetchImages(cactusName);
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Unable to fetch images.' });
  }
};