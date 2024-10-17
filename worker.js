export default {
  async fetch(request, env, ctx) {
    const clonedRequest = request.clone();
    try {
      if (clonedRequest.method === 'POST') {
        const requestBody = await clonedRequest.json();
        const url = new URL(request.url);
        if (url.pathname === '/') {
            return await handleGetLogs(env);
          }
        if (requestBody != null && requestBody.messages != null) {
          // 提取 message 字段
          const message = requestBody.messages;
          
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
            // 将 message 序列化为 JSON 字符串
            const messageString = JSON.stringify(message);
            console.log(`${messageString}`);
            // 使用 Cloudflare Workers 的 KV API 直接存储 message 值
            await env.WORKER_LOG.put(logKey, messageString, { expirationTtl: 60 * 60 * 24 * 7 });
            console.log('Message stored successfully');
          } catch (error) {
            console.error(`Error storing message in KV: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error parsing JSON: ${error.message}`);
      //return new Response('Invalid JSON', { status: 400 });
    }

    try {
      const response = await fetch(request);
      console.log(`${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      console.error(`Fetch error: ${error.message}`);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

async function handleGetLogs(env) {
  try {
    const logs = [];
    // 从 KV 中获取所有键
    for await (const key of env.WORKER_LOG.list()) {
      const value = await env.WORKER_LOG.get(key.name);
      logs.push({ key: key.name, value });
    }

    // 生成 HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Logs</title>
      </head>
      <body>
        <h1>Key-Value Logs</h1>
        <table border="1">
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
          ${logs.map(log => `
            <tr>
              <td>${log.key}</td>
              <td>${log.value}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error(`Error retrieving logs: ${error.message}`);
    return new Response('Internal Server Error', { status: 500 });
  }

};
