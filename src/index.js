const TELEGRAM_API_DOMAIN = 'api.telegram.org';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/' || url.pathname === '') {
      return new Response('Telegram Bot API Proxy - CloudFlare Workers', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const telegramUrl = new URL(request.url);
    telegramUrl.hostname = TELEGRAM_API_DOMAIN;
    telegramUrl.protocol = 'https:';

    const modifiedRequest = new Request(telegramUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });

    try {
      const response = await fetch(modifiedRequest);
      const modifiedResponse = new Response(response.body, response);
      
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return modifiedResponse;
    } catch (error) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'Proxy request failed',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
