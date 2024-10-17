name = "your-worker-name" # 你的 Worker 的名称
[env]
# 在这里设置环境变量
# 例如：
# WORKER_LOG = "your-kv-binding-name"
[workers.routes]
# 路由配置，指定 Worker 应响应对哪些路径的请求
# 例如：
# / = "worker.js" # 所有到达根路径的请求都将由 "worker.js" 处理

[workers.bindings]
# KV 绑定配置
# 例如：
# WORKER_LOG = { name = "your-kv-namespace-id" }

# 如果你的 Worker 使用其他服务，如 Databases 或 R2，你也可以在这里配置它们
# [workers.bindings.YOUR_DATABASE]
#   name = "your-database-namespace-id"
#   key = "your-database-key" # 如果需要的话，可以设置一个密钥
