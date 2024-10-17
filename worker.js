export default {
  async fetch(request, env, ctx) {
    const clonedRequest = request.clone();

    if (clonedRequest.method === 'POST') {
      const requestBody = await clonedRequest.text();
      console.log(`${requestBody}`);

      try {
        // 解析请求体为 JSON
        const data = JSON.parse(requestBody);
        const content = data.content;

        if (content != null) {
          // 创建一个唯一的键，使用日期格式
          const logKey = `log-${Date.now()}`;

          try {
            // 使用 Cloudflare Workers 的 KV API 直接存储 content 值
            await env.WORKER_LOG.put(logKey, content, { expirationTtl: 60 * 60 * 24 * 7 });
            console.log('Content stored successfully');
          } catch (error) {
            console.error(`Error storing content in KV: ${error.message}`);
          }
        }
      } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        //return new Response('Invalid JSON', { status: 400 });
      }
    }

    try {
      const response = await fetch(request);
      return response;
    } catch (error) {
      console.error(`Fetch error: ${error.message}`);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

