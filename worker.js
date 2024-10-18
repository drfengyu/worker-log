export default {
  async fetch(request, env, ctx) {
    const clonedRequest = request.clone();
    try {
      const url = new URL(request.url);
      if (url.pathname === '/') {
            return await handleGetLogs(env);
          }
      if (clonedRequest.method === 'POST') {
        const requestBody = await clonedRequest.json();
        
        
        if (requestBody != null && requestBody.messages != null) {
          // 提取 message 字段
          const message = requestBody.messages;
          last_user_message = message[-1]['content'] if message[-1]['role'] == 'user' else None
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
            const messageString = JSON.stringify(last_user_message);
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
    const responseClone = response.clone(); // 克隆响应
    // 使用 tee() 方法分割响应体
    //const [clone1, clone2] = response.body.tee();
    
    // 读取第一个流的内容
    //const text = await streamToText(clone1); // Use a custom function to read the stream
    //console.log(text); // Print the text content
    
    // 你可以在此处执行其他操作
    // const jsonData = await clone2.json(); // 如果需要解析为 JSON

    const responseBody = await responseClone.text(); // 如果你需要文本内容
    // 或者，如果你期望获取 JSON 数据，可以使用
    // const responseBody = await response.json();
  
    console.log(responseBody); // 打印获取的内容
        
    // 返回原始响应
    return response;
    } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    return new Response('Internal Server Error', { status: 500 });
    }

  }
};

async function handleGetLogs(env) {
  try {
    const logs = [];
    // 从 KV 中获取所有键
    const list = await env.WORKER_LOG.list();
    for (const key of list.keys) {
      const value = await env.WORKER_LOG.get(key.name);
      logs.push({ key: key.name, value });
    }

    // 生成 HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>日志</title>
      </head>
      <body>
        <h1>过去时间的日志记录</h1>
        <table border="1">
          <tr>
            <th>时间</th>
            <th>值</th>
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
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    });
  } catch (error) {
    console.error(`Error retrieving logs: ${error.message}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Helper function to read a stream as text
async function streamToText(stream) {
    const reader = stream.getReader();
    let result = '';
    let done, value;

    while ({ done, value } = await reader.read(), !done) {
        result += new TextDecoder("utf-8").decode(value);
    }

    return result;
}
