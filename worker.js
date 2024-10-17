/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
  async fetch(request, env, ctx) {
    const clonedRequest = request.clone();

    if (clonedRequest.method === 'POST') {
      const requestBody = await clonedRequest.text();
      console.log(`POST request body: ${requestBody}`);

      // 解析请求体为 JSON
      const data = JSON.parse(requestBody);

      // 提取 content 值
      const content = data.content;

      // 创建一个唯一的键，使用日期格式
      const logKey = `log-${Date.now()}`;

      try {
        // 使用 Cloudflare Workers 的 KV API 直接存储 content 值
        await env.WORKER_LOG.put(logKey, content, { expirationTtl: 60 * 60 * 24*7 });
        console.log('Content stored successfully');
      } catch (error) {
        console.error(`Error storing content in KV: ${error.message}`);
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
