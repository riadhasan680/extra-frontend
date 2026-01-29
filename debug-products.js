const axios = require('axios');

const MEDUSA_URL = "http://localhost:9000";
const PUBLISHABLE_KEY = "pk_4e5e929832e5a84f8a671766a38c7cdf90f8f39ee424b985a4c64394c4f7e335"; // Using the VALID key from .env.local

async function testProductFetch() {
  console.log("Testing GET /store/products with user-requested params...");
  
  try {
    const response = await axios.get(`${MEDUSA_URL}/store/products`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY
      },
      params: {
        "metadata[ui_style]": "extra-life",
        "expand": "variants,variants.prices,images"
      }
    });
    console.log("Success! Products found:", response.data.products.length);
  } catch (error) {
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
    
    // Try without expand to see if that's the issue
    try {
        console.log("\nRetrying without 'expand'...");
        await axios.get(`${MEDUSA_URL}/store/products`, {
            headers: { 'x-publishable-api-key': PUBLISHABLE_KEY },
            params: { "metadata[ui_style]": "extra-life" }
        });
        console.log("Success without expand!");
    } catch (e) {
        console.log("Still failed without expand:", e.response?.data);
    }

    // Try Medusa v2 'fields' approach
    try {
        console.log("\nRetrying with Medusa v2 'fields'...");
        const res = await axios.get(`${MEDUSA_URL}/store/products`, {
            headers: { 'x-publishable-api-key': PUBLISHABLE_KEY },
            params: { 
                fields: "id,title,subtitle,description,handle,thumbnail,metadata,*variants,*variants.prices,*images"
            }
        });
        console.log("Success with 'fields'! Count:", res.data.products.length);
        if (res.data.products.length > 0) {
             console.log("First product metadata:", res.data.products[0].metadata);
        }
    } catch (e) {
        console.log("Failed with 'fields':", e.response?.data || e.message);
    }
  }
}

testProductFetch();
