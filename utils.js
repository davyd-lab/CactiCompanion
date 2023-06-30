  // Function to get images from Api for good programmable search (Google Images)
 export async function fetchImages(query) {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_CUSTOM_SEARCH_API_KEY}&cx=${process.env.NEXT_PUBLIC_SEARCH_ENGINE_ID}&q=${query}&searchType=image`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      }
    );
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const json = await response.json();
      return json.items.map(item => item.link); // Returning only the image URLs
    }
  }