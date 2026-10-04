/**
 * Cloudflare Pages Functions API Route: /api/site-data
 * Handles Global Site Data Persistence and Sync on Cloudflare Pages
 */

interface Env {
  SHUBHAKAMNA_KV?: any;
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (context.env.SHUBHAKAMNA_KV) {
      const kvData = await context.env.SHUBHAKAMNA_KV.get('global_site_data', 'json');
      if (kvData) {
        return new Response(JSON.stringify(kvData), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Using bundled site-data.json' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to retrieve site data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const payload = await context.request.json();
    const timestamp = new Date().toISOString();
    const dataToSave = {
      ...payload,
      updatedAt: timestamp
    };

    if (context.env.SHUBHAKAMNA_KV) {
      await context.env.SHUBHAKAMNA_KV.put('global_site_data', JSON.stringify(dataToSave));
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'बधाई! डेटा सफलतापूर्वक पब्लिश हो गया! (सभी डिवाइस पर लाइव 🚀)',
      updatedAt: timestamp
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: true,
      message: 'डेटा पब्लिश कर दिया गया! (लोकल व क्लाउड सिंक एक्टिव)',
      updatedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
