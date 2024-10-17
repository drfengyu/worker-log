export default {
  async fetch(request, env, ctx) {
    const clonedRequest = request.clone();
    try {
      if (clonedRequest.method === 'POST') {
        const requestBody = await clonedRequest.text();
        console.log(`${requestBody}`);

        // 解析请求体为 JSON
        const data = JSON.parse(requestBody);
        const content = data.content;

        if (content != null) {
          // 使用当前时间作为键
          const now = new Date();
          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          const hours = now.getHours().toString().padStart(2, '0');
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const seconds = now.getSeconds().toString().padStart(2, '0');
          const logKey = `log-${year}${month}${day}${hours}${minutes}${seconds}`;

          try {
            // 使用 Cloudflare Workers 的 KV API 直接存储 content 值
            await env.WORKER_LOG.put(logKey, content, { expirationTtl: 60 * 60 * 24 * 7 });
            console.log('Content stored successfully');
          } catch (error) {
            console.error(`Error storing content in KV: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error parsing JSON: ${error.message}`);
      //return new Response('Invalid JSON', { status: 400 });
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


