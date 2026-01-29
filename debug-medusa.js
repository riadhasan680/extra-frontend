const axios = require('axios');

const MEDUSA_URL = "http://localhost:9000";

const fs = require('fs');

const originalLog = console.log;
console.log = function(...args) {
    originalLog.apply(console, args);
    fs.appendFileSync('debug-output.txt', args.join(' ') + '\n');
};
const originalError = console.error;
console.error = function(...args) {
    originalError.apply(console, args);
    fs.appendFileSync('debug-output.txt', 'ERROR: ' + args.join(' ') + '\n');
};

async function run() {
  try {
    console.log("1. Attempting Admin Login...");
    // Try default credentials
    const authRes = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
        email: "admin@medusa-test.com",
        password: "supersecret"
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    
    // Medusa v2 might use cookie or token
    // In v2, it sets a cookie 'connect.sid' or similar, but for API usage often returns token or we need cookie jar.
    // Medusa v2 Auth: /auth/user/emailpass returns just success?
    
    console.log("Login Success!");
    console.log("Auth Data:", JSON.stringify(authRes.data, null, 2));
    
    // We need to handle cookies if it uses cookies.
    console.log("Auth Headers:", JSON.stringify(authRes.headers, null, 2));
    const cookie = authRes.headers['set-cookie'];
    const token = authRes.data.token || authRes.data.access_token;

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie ? cookie.join('; ') : ''
        }
    };
    
    if (token) {
        console.log("Using Bearer Token");
        axiosConfig.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Get Sales Channels
    console.log("\n2. Fetching Sales Channels...");
    const scRes = await axios.get(`${MEDUSA_URL}/admin/sales-channels`, axiosConfig);
    const salesChannels = scRes.data.sales_channels;
    const targetSCId = "sc_01KFTX66D2TDDQQEY3ASM3R2XK";
    const targetSC = salesChannels.find(sc => sc.id === targetSCId);
    
    if (targetSC) {
        console.log(`Found Target SC: ${targetSC.name} (${targetSC.id})`);
    } else {
        console.log(`Target SC ${targetSCId} not found in list (might be hidden or pagination).`);
    }

    // 3. Get Stock Locations
    console.log("\n3. Fetching Stock Locations...");
    const slRes = await axios.get(`${MEDUSA_URL}/admin/stock-locations`, axiosConfig);
    const stockLocations = slRes.data.stock_locations;
    
    let defaultLocation = stockLocations[0];
    if (!defaultLocation) {
        console.log("Creating Stock Location...");
        const createSL = await axios.post(`${MEDUSA_URL}/admin/stock-locations`, { name: "Default Location" }, axiosConfig);
        defaultLocation = createSL.data.stock_location;
    }
    console.log(`Using Stock Location: ${defaultLocation.id}`);

    // 4. Link SC to Stock Location
    // Medusa v2 Admin API for linking?
    // POST /admin/sales-channels/:id/stock-locations
    if (targetSC) {
        console.log(`Linking SC ${targetSC.id} to Location ${defaultLocation.id}...`);
        try {
            await axios.post(`${MEDUSA_URL}/admin/sales-channels/${targetSC.id}/stock-locations`, {
                location_id: defaultLocation.id
            }, axiosConfig);
            console.log("Linked Successfully!");
        } catch (e) {
            console.log("Link failed (maybe already linked):", e.response?.data?.message || e.message);
        }
    }

    // 5. Find Inventory Item for Variant
    const variantId = "variant_01KG5P8WAA7M9XWVRKD275X401";
    console.log(`\n5. Checking Inventory for Variant ${variantId}...`);
    
    // Get Product directly
    const prodId = "prod_01KG5P8W6RH5WSHF176SQ4JSDR";
    // In Medusa v2, use 'fields' or 'expand'
    const prodRes = await axios.get(`${MEDUSA_URL}/admin/products/${prodId}?fields=+variants.id,+variants.sku,+variants.inventory_quantity,+variants.manage_inventory`, axiosConfig);
    const product = prodRes.data.product;
    const variant = product.variants.find(v => v.id === variantId);
    
    if (variant) {
          console.log("Variant Found:", JSON.stringify(variant, null, 2));
          
          // FIX: Disable Inventory Management for Service Product
          // This avoids the "Sales Channel not linked to Inventory" error complexity
          // since services don't need stock tracking.
          if (variant.manage_inventory) {
              console.log("Variant has manage_inventory=true. Disabling for Service...");
              try {
                  await axios.post(`${MEDUSA_URL}/admin/products/${prodId}/variants/${variant.id}`, {
                      manage_inventory: false,
                      allow_backorder: true // Optional, but good for services
                  }, axiosConfig);
                  console.log("Variant updated: manage_inventory = false");
              } catch (e) {
                  console.log("Failed to update variant:", e.response?.data?.message || e.message);
              }
          } else {
              console.log("Variant already has manage_inventory = false");
          }
          
          // Skip complex inventory linking since we disabled it.
          /* 
          // 5.1 Update Variant with SKU if missing
          if (!variant.sku) {
              console.log("Variant has no SKU. Updating...");
              try {
                  const updateRes = await axios.post(`${MEDUSA_URL}/admin/products/${prodId}/variants/${variant.id}`, {
                      sku: "sku-3-streams",
                      manage_inventory: true
                  }, axiosConfig);
                  variant.sku = "sku-3-streams";
                  console.log("Variant SKU updated to sku-3-streams");
              } catch (e) {
                  console.log("Failed to update SKU:", e.response?.data?.message || e.message);
              }
          }
          
          // Find inventory item by SKU
          if (variant.sku) {
              const invRes = await axios.get(`${MEDUSA_URL}/admin/inventory-items?sku=${variant.sku}`, axiosConfig);
              let inventoryItem = invRes.data.inventory_items[0];
              
              if (inventoryItem) {
                  console.log(`Inventory Item Found: ${inventoryItem.id}`);
                  
                  // Check levels
                  const levelsRes = await axios.get(`${MEDUSA_URL}/admin/inventory-items/${inventoryItem.id}/location-levels`, axiosConfig);
                  const levels = levelsRes.data.inventory_levels;
                  console.log("Inventory Levels:", JSON.stringify(levels, null, 2));
                  
                  const hasLevel = levels.find(l => l.location_id === defaultLocation.id);
                  if (!hasLevel) {
                      console.log("Creating Inventory Level...");
                      await axios.post(`${MEDUSA_URL}/admin/inventory-items/${inventoryItem.id}/location-levels`, {
                          location_id: defaultLocation.id,
                          stocked_quantity: 5000
                      }, axiosConfig);
                  } else {
                      console.log(`Inventory Level exists with quantity: ${hasLevel.stocked_quantity}`);
                  }
              } else {
                  console.log("No Inventory Item found for SKU:", variant.sku);
                  
                  console.log("Creating Inventory Item...");
                  const createInv = await axios.post(`${MEDUSA_URL}/admin/inventory-items`, {
                      sku: variant.sku,
                      title: variant.title,
                      requires_shipping: false
                  }, axiosConfig);
                  inventoryItem = createInv.data.inventory_item;
                  console.log(`Created Inventory Item: ${inventoryItem.id}`);
                  
                  // Create Level
                  console.log("Creating Inventory Level...");
                  await axios.post(`${MEDUSA_URL}/admin/inventory-items/${inventoryItem.id}/location-levels`, {
                      location_id: defaultLocation.id,
                      stocked_quantity: 5000
                  }, axiosConfig);
              }
          }
          */
     } else {
         console.log("Variant not found in product!");
     }
    
    // Try to link SC to SL using different endpoint if previous failed
    // Medusa v1: POST /admin/stock-locations/:id/sales-channels
    console.log("\nTrying alternative link endpoint...");
    try {
         await axios.post(`${MEDUSA_URL}/admin/stock-locations/${defaultLocation.id}/sales-channels`, {
             add: [targetSC.id]
         }, axiosConfig);
         console.log("Linked SC to SL via stock-locations endpoint!");
     } catch (e) {
          console.log("Alternative link failed:", e.response?.data?.message || e.message);
     }

     // 6. Test Store API Add to Cart
     console.log("\n6. Testing Store API Add to Cart...");
     const storeConfig = {
         headers: {
             'x-publishable-api-key': 'pk_4e5e929832e5a84f8a671766a38c7cdf90f8f39ee424b985a4c64394c4f7e335',
             'Content-Type': 'application/json'
         }
     };
     
     try {
         // Create Cart
         const cartRes = await axios.post(`${MEDUSA_URL}/store/carts`, {}, storeConfig);
         const cartId = cartRes.data.cart.id;
         console.log(`Cart Created: ${cartId}`);
         
         // Add Line Item
         console.log(`Adding Variant ${variantId} to Cart...`);
         await axios.post(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
             variant_id: variantId,
             quantity: 1
         }, storeConfig);
         console.log("SUCCESS! Item added to cart.");
         
     } catch (e) {
         console.log("Store API Test Failed:", e.response?.data?.message || e.message);
         if (e.response?.data) {
             console.log("Error Data:", JSON.stringify(e.response.data, null, 2));
         }
     }

    // List Publishable Keys
    console.log("\n4. Fetching Publishable Keys...");
    try {
        const keysRes = await axios.get(`${MEDUSA_URL}/admin/publishable-api-keys`, axiosConfig);
        console.log("Publishable Keys found:", keysRes.data.publishable_api_keys.length);
        keysRes.data.publishable_api_keys.forEach(k => {
            console.log(`- ID: ${k.id} | Title: ${k.title} | Created: ${k.created_at}`);
        });
        
        // Use the first key for testing
        const validKey = keysRes.data.publishable_api_keys[0]?.id;
        if (validKey) {
            console.log(`\nTesting Store API with Key: ${validKey}`);
            try {
                 const testRes = await axios.get(`${MEDUSA_URL}/store/products`, {
                    headers: { 'x-publishable-api-key': validKey },
                    params: { 
                        "metadata[ui_style]": "extra-life",
                        "expand": "variants,variants.prices,images"
                    }
                });
                console.log("Store API Success! Products:", testRes.data.products.length);
            } catch (err) {
                console.log("Store API Failed with valid key:", err.response?.data || err.message);
            }
        }
    } catch (e) {
        console.log("Failed to list keys:", e.response?.data || e.message);
    }

    console.log("\nDone.");

  } catch (error) {
    console.error("Script Failed:", error.message);
    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

run();