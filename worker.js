export default {
  async fetch(request, env, ctx) {
    const clonedRequest = request.clone();
    // 使用当前时间作为键
    const now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000); // Adjust for GMT+8
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0'); // Adjust for GMT+8
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    let logKey = `${year}.${month}.${day}.${hours}.${minutes}.${seconds}`;
    
    try {
      const url = new URL(request.url);
      if (url.pathname === '/') {
            return await handleGetLogs(env);
          }
      if (clonedRequest.method === 'POST') {
        const requestBody = await clonedRequest.json();
        const aimodel=requestBody.model;
        logKey=`${year}.${month}.${day}.${hours}.${minutes}.${seconds}.${aimodel}`;
        console.log(requestBody);
        if (requestBody != null && requestBody.messages != null) {
          const lastMessage = requestBody.messages[requestBody.messages.length - 1];
          let last_user_message = null;
          if (lastMessage && lastMessage.role === 'user') {
            last_user_message = lastMessage.content;
          } else {
            last_user_message = undefined;
          }
          try {
            // 将 message 序列化为 JSON 字符串
            //const messageString = JSON.stringify(last_user_message);
            //console.log(`${last_user_message}`);
            // 使用 Cloudflare Workers 的 KV API 直接存储 message 值
            if(last_user_message){
              await env.WORKER_LOG.put(logKey, last_user_message, { expirationTtl: 60 * 60 * 24 * 7 });
              console.log('Message Requested successfully');
            }
            
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
    const responseBody = await responseClone.json(); // 如果你需要文本内容
    console.log(responseBody); // 打印获取的内容
    // 或者，如果你期望获取 JSON 数据，可以使用
    // const responseBody = await response.text();
    const fullText = parseMessage(responseBody);
    if(fullText){
      //console.log(fullText); // 打印获取的内容
      await env.WORKER_LOG.put(logKey, fullText, { expirationTtl: 60 * 60 * 24 * 7 });
      console.log('Message Responsed successfully');
        }
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
        <title>动态</title>
      </head>
      <body>
        <h1>历史消息</h1>
        <table border="1">
          <tr>
            <th>时间</th>
            <th>消息</th>
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

// 处理消息
function parseMessage(msg) {
  const lines = msg.split('\n'); // 按行分割
  const result = [];

  for (let line of lines) {
    if (line.startsWith('data: ')) { // 只处理以 data: 开头的行
      const content = line.substring(6).replace(/\"/g, '').replace('stop',''); // 去掉前缀和引号
      result.push(content); // 将内容添加到结果数组
    }
  }

  return result.join(''); // 将数组中的内容连接成字符串
}
