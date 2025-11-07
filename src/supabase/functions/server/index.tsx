import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Supabase client with service role for admin operations
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Supabase client for authenticated user operations
const getSupabaseClient = (accessToken: string) => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  );
};

// Printful API Helper
const printfulApi = async (endpoint: string, method = 'GET', body?: any) => {
  const apiKey = Deno.env.get('PRINTFUL_API_KEY');
  if (!apiKey) {
    throw new Error('Printful API key not configured');
  }

  const response = await fetch(`https://api.printful.com/${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': Deno.env.get('PRINTFUL_STORE_ID') ?? ''
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Printful API error (${endpoint}):`, error);
    throw new Error(`Printful API error: ${response.status} - ${error}`);
  }

  return await response.json();
};

// ==================== ROUTES ====================

// Health Check
app.get('/make-server-891a09ab/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== PRODUCTS ====================

// Get all active products
app.get('/make-server-891a09ab/products', async (c) => {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ products });
  } catch (error) {
    console.error('Error in GET /products:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get single product
app.get('/make-server-891a09ab/products/:id', async (c) => {
  try {
    const productId = c.req.param('id');
    const supabase = getSupabaseAdmin();
    
    const { data: product, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return c.json({ error: error.message }, 404);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Error in GET /products/:id:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Sync product from Printful (Admin only)
app.post('/make-server-891a09ab/products/sync', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { sync_product_id } = await c.req.json();
    
    if (!sync_product_id) {
      return c.json({ error: 'sync_product_id is required' }, 400);
    }

    // Get product info from Printful
    const printfulData = await printfulApi(`store/products/${sync_product_id}`);
    const syncProduct = printfulData.result.sync_product;
    const syncVariants = printfulData.result.sync_variants;

    // Insert or update product in Supabase
    const { data: product, error: productError } = await supabase
      .from('products')
      .upsert({
        printful_sync_product_id: sync_product_id,
        name: syncProduct.name,
        description: syncProduct.name,
        price: parseFloat(syncVariants[0]?.retail_price || '0'),
        category: 'Clothing',
        images: syncVariants[0]?.files?.map((f: any) => f.preview_url) || [],
        mockup_images: syncVariants[0]?.files?.map((f: any) => f.preview_url) || [],
        sizes: [...new Set(syncVariants.map((v: any) => v.size))],
        colors: [...new Set(syncVariants.map((v: any) => v.color))],
        printful_sync_variants: syncVariants,
        is_active: true
      })
      .select()
      .single();

    if (productError) {
      console.error('Error syncing product:', productError);
      return c.json({ error: productError.message }, 500);
    }

    // Sync variants
    for (const variant of syncVariants) {
      await supabase.from('product_variants').upsert({
        product_id: product.id,
        printful_variant_id: variant.id,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        price: parseFloat(variant.retail_price || '0'),
        retail_price: parseFloat(variant.retail_price || '0'),
        is_available: variant.is_available
      });
    }

    return c.json({ 
      success: true, 
      product,
      message: 'Product synced successfully from Printful'
    });
  } catch (error) {
    console.error('Error in POST /products/sync:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create product (Admin)
app.post('/make-server-891a09ab/products', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const productData = await c.req.json();

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        badge: productData.badge,
        images: productData.images || [],
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Error in POST /products:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== ORDERS ====================

// Create order
app.post('/make-server-891a09ab/orders', async (c) => {
  try {
    const orderData = await c.req.json();
    const supabase = getSupabaseAdmin();

    // Generate order number
    const orderNumber = `KLTZ${Date.now().toString().slice(-8)}`;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: orderData.user_id,
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shipping_cost || 0,
        tax: orderData.tax || 0,
        total: orderData.total,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ 
      success: true, 
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error in POST /orders:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Fulfill order with Printful
app.post('/make-server-891a09ab/orders/:id/fulfill', async (c) => {
  try {
    const orderId = c.req.param('id');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Create Printful order
    const printfulOrder = {
      recipient: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address1: order.shipping_address.address,
        city: order.shipping_address.city,
        state_code: order.shipping_address.state || '',
        country_code: order.shipping_address.country || 'IN',
        zip: order.shipping_address.pincode
      },
      items: order.items.map((item: any) => ({
        sync_variant_id: item.printful_variant_id,
        quantity: item.quantity,
        retail_price: item.price.toString()
      })),
      retail_costs: {
        currency: 'INR',
        subtotal: order.subtotal.toString(),
        shipping: order.shipping_cost.toString(),
        tax: order.tax.toString(),
        total: order.total.toString()
      }
    };

    const printfulResponse = await printfulApi('orders', 'POST', printfulOrder);

    // Update order with Printful ID
    await supabase
      .from('orders')
      .update({
        printful_order_id: printfulResponse.result.id,
        printful_status: printfulResponse.result.status,
        status: 'processing'
      })
      .eq('id', orderId);

    return c.json({ 
      success: true, 
      printful_order: printfulResponse.result,
      message: 'Order sent to Printful for fulfillment'
    });
  } catch (error) {
    console.error('Error in POST /orders/:id/fulfill:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user orders
app.get('/make-server-891a09ab/user/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ orders });
  } catch (error) {
    console.error('Error in GET /user/orders:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== PRINTFUL WEBHOOKS ====================

app.post('/make-server-891a09ab/webhooks/printful', async (c) => {
  try {
    const payload = await c.req.json();
    const supabase = getSupabaseAdmin();

    console.log('Printful webhook received:', payload.type);

    // Log webhook
    await supabase.from('printful_webhooks').insert({
      event_type: payload.type,
      payload: payload,
      processed: false
    });

    // Handle different webhook types
    switch (payload.type) {
      case 'package_shipped': {
        const { order, shipment } = payload.data;
        
        await supabase
          .from('orders')
          .update({
            status: 'shipped',
            printful_status: 'shipped',
            tracking_number: shipment.tracking_number,
            tracking_url: shipment.tracking_url
          })
          .eq('printful_order_id', order.id);

        console.log(`Order ${order.id} marked as shipped with tracking ${shipment.tracking_number}`);
        break;
      }

      case 'package_returned': {
        const { order } = payload.data;
        
        await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            printful_status: 'returned'
          })
          .eq('printful_order_id', order.id);

        console.log(`Order ${order.id} marked as returned`);
        break;
      }

      case 'order_failed': {
        const { order, reason } = payload.data;
        
        await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            printful_status: 'failed'
          })
          .eq('printful_order_id', order.id);

        console.error(`Order ${order.id} failed: ${reason}`);
        break;
      }

      case 'stock_updated': {
        // Sync stock updates
        console.log('Stock updated:', payload.data);
        break;
      }

      default:
        console.log('Unhandled webhook type:', payload.type);
    }

    // Mark webhook as processed
    await supabase
      .from('printful_webhooks')
      .update({ processed: true })
      .eq('payload', payload);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error in POST /webhooks/printful:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== DESIGN UPLOADS ====================

app.post('/make-server-891a09ab/designs/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { design_name, design_url, product_type } = await c.req.json();

    const { data: design, error } = await supabase
      .from('design_uploads')
      .insert({
        user_id: user.id,
        design_name,
        design_url,
        product_type,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error uploading design:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ 
      success: true, 
      design,
      message: 'Design uploaded successfully and pending approval'
    });
  } catch (error) {
    console.error('Error in POST /designs/upload:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== WISHLIST ====================

app.get('/make-server-891a09ab/user/wishlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: wishlist, error } = await supabase
      .from('wishlists')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ wishlist });
  } catch (error) {
    console.error('Error in GET /user/wishlist:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post('/make-server-891a09ab/user/wishlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { product_id } = await c.req.json();

    const { data, error } = await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        product_id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to wishlist:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /user/wishlist:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete('/make-server-891a09ab/user/wishlist/:product_id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization required' }, 401);
    }

    const productId = c.req.param('product_id');
    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /user/wishlist/:product_id:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Start server
Deno.serve(app.fetch);
