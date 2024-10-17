以下是将你提供的内容转换为Markdown格式的结果：

```markdown
---
created: 2024-10-17T13:20:41 (UTC +08:00)
tags: []
source: https://developers.cloudflare.com/workers/wrangler/configuration/
author: 
---

# 配置 - Wrangler

> ## Excerpt
> Use a `wrangler.toml` configuration file to customize the development and deployment setup for your Worker project and other Developer Platform products.

---
Wrangler 可以选择使用配置文件来自定义 Worker 的开发和部署设置。`wrangler.toml`

最佳做法是将 Worker 视为配置 [Worker 的事实来源](https://developers.cloudflare.com/workers/wrangler/configuration/#source-of-truth)。`wrangler.toml`

## 示例配置`wrangler.toml`

```toml
# Top-level configuration
name = "my-worker"
main = "src/index.js"
compatibility_date = "2022-07-12"
workers_dev = false
route = {
  pattern = "example.org/*",
  zone_name = "example.org"
}
kv_namespaces = [
  {
    binding = "<MY_NAMESPACE>",
    id = "<KV_ID>"
  }
]
[env.staging]
name = "my-worker-staging"
route = {
  pattern = "staging.example.org/*",
  zone_name = "example.org"
}
kv_namespaces = [
  {
    binding = "<MY_NAMESPACE>",
    id = "<STAGING_KV_ID>"
  }
]
```

## 环境

当您定义不同的[环境](https://developers.cloudflare.com/workers/wrangler/environments/)时，Worker 的配置可能会变得复杂，并且每个环境都有自己的配置。有一个默认（顶级）环境和命名环境，它们提供特定于环境的配置。

这些密钥在键下定义，例如，您可以在命令中使用 / 标志进行预览或部署，例如 .`[env.name]``[env.staging]``-e``--env``wrangler``npx wrangler deploy --env staging`

大多数键都是可继承的，这意味着顶级配置可以在环境中使用。[绑定](https://developers.cloudflare.com/workers/runtime-apis/bindings/)（如 或 ）是不可继承的，需要显式定义。`vars``kv_namespaces`

此外，还有一些键_只能_显示在顶级。

## 仅限顶级键

顶级键适用于整个 Worker（因此适用于所有环境）。不能在命名环境中定义它们。

-   `keep_vars` 布尔 自选  
    -   Wrangler 是否应在部署时保留控制面板中配置的变量。请参阅[事实来源](https://developers.cloudflare.com/workers/wrangler/configuration/#source-of-truth)。
-   `send_metrics` 布尔 自选  
    -   Wrangler 是否应将此项目的使用指标发送到 Cloudflare。
-   `site` 对象 可选已弃用  
    -   有关更多信息，请参阅下面的 [Workers Sites](https://developers.cloudflare.com/workers/wrangler/configuration/#workers-sites) 部分。Cloudflare Pages 和 Workers Assets 比这种方法更受欢迎。

## 可继承的密钥

可继承的键可以在顶层进行配置，并且可以由特定于环境的配置继承（或覆盖）。

-   `name` 字符串 必填  
    -   您的 Worker 的名称。仅限字母数字字符（,,, 等）和破折号（）。不要使用下划线（）。`a``b``c``-``_`
-   `main` 字符串 必填  
    -   将要执行的 Worker 入口点的路径。例如：。`./src/index.ts`
-   `compatibility_date` 字符串 必填  
    -   表单中的日期，将用于确定使用的 Workers 运行时版本。请参阅[兼容性日期](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)。`yyyy-mm-dd`
-   `account_id` 字符串 自选  
    -   这是与您的区域关联的账户的 ID。您可能有多个账户，因此请确保使用与您提供的区域/路由关联的账户的 ID（如果您提供了一个）。也可以通过环境变量指定它。`CLOUDFLARE_ACCOUNT_ID`
-   `compatibility_flags` 字符串\[\] 自选  
    -   一个标志列表，这些标志启用 Workers 运行时即将推出的功能，通常与 一起使用。请参阅[兼容性日期](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)。`compatibility_date`
-   `workers_dev` 布尔 自选  
    -   允许使用子域来测试和部署您的 Worker。如果你有一个仅用于事件的 Worker，则可以将其设置为 。默认为 。`*.workers.dev``scheduled``false``true`
-   `route` 路线 自选  
    -   您的 Worker 应部署到的路由。只需或之一。请参阅 [路由类型](https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes)。`routes``route`
-   `routes` 路线 自选  
    -   您的 Worker 应部署到的路由数组。只需或之一。请参阅 [路由类型](https://developers.cloudflare.com/workers/wrangler/configuration/#types-of-routes)。`routes``route`
-   `tsconfig` 字符串 自选  
    -   自定义的路径 .`tsconfig`
-   `triggers` 对象 自选  
    -   cron 定义来触发 Worker 的函数。请参阅 [触发器](https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)。`scheduled`
-   `rules` 统治 自选  
    -   一个有序的规则列表，用于定义要导入的模块以及要导入它们的类型。您需要指定使用 和 modules 的规则，或者当您希望将文件视为 而不是 .`Text``Data``CompiledWasm``.js``ESModule``CommonJS`
-   `build` 建 自选  
    -   将自定义构建步骤配置为在构建 Worker 时由 Wrangler 运行。请参阅 [自定义版本](https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds).
-   `no_bundle` 布尔 自选  
    -   跳过内部构建步骤，直接部署 Worker 脚本。您必须有一个没有依赖项的纯 JavaScript Worker。
-   `minify` 布尔 自选  
    -   在上传之前缩小 Worker 脚本。
-   `node_compat` 布尔 自选  
    -   已弃用 — [请改为启用 `nodejs_compat_v2` 兼容性标志](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#enable-nodejs-with-workers)，该标志将启用内置 Node.js API，并根据需要添加 polyfill。与 Wrangler 捆绑时，设置会将 Node.js 内置模块和全局变量的 polyfill 添加到您的 Worker 代码中。这是由 which 驱动的，它本身是由 [rollup-plugin-node-polyfills ↗](https://github.com/ionic-team/rollup-plugin-node-polyfills/) 提供支持的。`node_compat = true``@esbuild-plugins/node-globals-polyfill`
-   `preserve_file_names` 布尔 自选  
    -   确定 Wrangler 是否保留与 Worker 捆绑的其他模块的文件名。 默认设置是在文件名前面加上内容哈希。 例如。`34de60b44167af5c5a709e62a4e20c4f18c9e3b6-favicon.ico`
-   `logpush` 布尔 自选  
    -   为 worker 启用 trace events logpush 的工作程序。任何具有此属性的脚本都将由为您的账户配置的 Workers Logpush 作业自动选取。默认为 。`false`
-   `limits` 限制 自选  
    -   配置要在运行时执行的限制。请参阅 [限制](https://developers.cloudflare.com/workers/wrangler/configuration/#limits)。

-   `observability`object 可选  
    -   为从 Worker 发出的遥测数据配置自动可观测性设置。请参阅 [可观测性](https://developers.cloudflare.com/workers/wrangler/configuration/#observability)。
-   `assets` 资产 自选  
    -   配置将提供的静态资产。请参阅 [资产](https://developers.cloudflare.com/workers/static-assets/binding/) 以了解更多详细信息。

### 使用模型

自 2024 年 3 月 1 日起，在 Worker 中配置的[使用模型](https://developers.cloudflare.com/workers/platform/pricing/#workers)将被忽略。标准[使用模型](https://developers.cloudflare.com/workers/platform/pricing/#example-pricing-standard-usage-model)适用。`wrangler.toml`

一些 Workers Enterprise 客户保留了更改使用模型的能力。您的使用模型必须通过Cloudflare仪表板进行配置，方法是转到**Workers & Pages**\>选择您的Worker **\>设置**\>**使用模型**。

## 不可继承的键

不可继承的键可以在顶层配置，但不能由环境继承，必须为每个环境指定。

-   `define` Record<string， string> 自选  
    -   部署 Worker 时要替换的值的映射。
-   `vars` 对象 自选  
    -   部署 Worker 时要设置的环境变量的映射。请参阅 [环境变量](https://developers.cloudflare.com/workers/configuration/environment-variables/).
-   `durable_objects` 对象 自选  
    -   您的 Worker 应绑定到的 Durable Object 的列表。请参阅 [Durable Objects](https://developers.cloudflare.com/workers/wrangler/configuration/#durable-objects)。
-   `kv_namespaces` 对象 自选  
    -   您的 Worker 应绑定到的 KV 命名空间列表。请参阅 [KV 命名空间](https://developers.cloudflare.com/workers/wrangler/configuration/#kv-namespaces)。
-   `r2_buckets` 对象 自选  
    -   您的 Worker 应绑定到的 R2 存储桶的列表。请参阅 [R2 存储桶](https://developers.cloudflare.com/workers/wrangler/configuration/#r2-buckets)。
-   `vectorize` 对象 自选  
    -   您的 Worker 应绑定到的 Vectorize 索引列表。请参阅 [矢量化索引](https://developers.cloudflare.com/workers/wrangler/configuration/#vectorize-indexes).
-   `services` 对象 自选  
    -   您的 Worker 应绑定到的服务绑定列表。请参阅 [服务绑定](https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings)。
-   `tail_consumers` 对象 自选  
    -   您的 Worker 向其发送数据的 Tail Worker 的列表。请参阅 [Tail Worker](https://developers.cloudflare.com/workers/observability/logs/tail-workers/)。

## 路线类型

路由有三种[类型：](https://developers.cloudflare.com/workers/configuration/routing/)[自定义域](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)、[路由](https://developers.cloudflare.com/workers/configuration/routing/routes/)和 [`workers.dev`](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)。

### 自定义域

[自定义域](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)允许您将 Worker 连接到域或子域，而无需更改 DNS 设置或执行任何证书管理。

-   `pattern` 字符串 必填  
    -   您的 Worker 应在其上运行的模式，例如 .`"example.com"`
-   `custom_domain` 布尔 自选  
    -   Worker 是否应位于 Custom Domain 上，而不是 Route 上。默认为 。`false`

例：

```toml
route = {
  pattern = "example.com",
  custom_domain = true
}
# or
routes = [
  {
    pattern = "shop.example.com",
    custom_domain = true
  }
]
```

### 路线

[路由](https://developers.cloudflare.com/workers/configuration/routing/routes/)允许用户将 URL 模式映射到 Worker。路由可以配置为 Zone ID 路由、Zone Name 路由或 Simple 路由。

#### Zone ID 路由

-   `pattern` 字符串 必填  
    -   您的 Worker 可以运行的模式，例如，。`"example.com/*"`
-   `zone_id` 字符串 必填  
    -   与您的关联的区域的 ID。请参阅 [查找区域和账户 ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/).`pattern`

例：

```toml
routes = [
  {
    pattern = "subdomain.example.com/*",
    zone_id = "<YOUR_ZONE_ID>"
  }
]
```

#### 区域名称路由

-   `pattern` 字符串 必填  
    -   您的 Worker 应在其上运行的模式，例如 .`"example.com/*"`
-   `zone_name` 字符串 必填  
    -   与您的关联的区域的名称。如果您使用的是 API 令牌，则需要 scope。`pattern``Account`

例：

```toml
routes = [
  {
    pattern = "subdomain.example.com/*",
    zone_name = "example.com"
  }
]
```

#### 简单路线

这是一个只需要模式的简单路由。

例：

### `workers.dev`

Cloudflare Workers 帐户带有一个子域，可在 Cloudflare 仪表板中配置。`workers.dev`

-   `workers_dev` 布尔 自选  
    -   Worker 是否在自定义账户子域上运行。默认为 。`workers.dev``true`

## 触发器

触发器允许您定义表达式以调用 Worker 的函数。请参阅[支持的 cron 表达式](https://developers.cloudflare.com/workers/configuration/cron-triggers/#supported-cron-expressions)。`cron``scheduled`

-   `crons` 字符串\[\] 必填  
    -   表达式数组。`cron`
    -   要禁用 Cron 触发器，请将 .注释掉密钥不会禁用 Cron Trigger。`crons = []``crons`

例：

```toml
[triggers]
crons = ["* * * * *"]
```

## 自定义版本

您可以配置将在部署 Worker 之前运行的自定义构建步骤。请参阅 [自定义版本](https://developers.cloudflare.com/workers/wrangler/custom-builds/).

-   `command` 字符串 自选  
    -   用于构建 Worker 的命令。在 Linux 和 macOS 上，该命令在 shell 和 Windows 的 shell 中执行。可以使用 和 shell 运算符。`sh``cmd``&&``||`
-   `cwd` 字符串 自选  
    -   执行命令的目录。
-   `watch_dir` 字符串 |字符串\[\] 自选  
    -   使用 时要监视更改的目录。默认为当前工作目录。`wrangler dev`

例：

```toml
[build]
command = "npm run build"
cwd = "build_cwd"
watch_dir = "build_watch_dir"
```

## 限制

您可以在运行时对 Worker 的行为施加限制。只有 [Standard Usage Model （标准使用模型](https://developers.cloudflare.com/workers/platform/pricing/#example-pricing-standard-usage-model)） 才支持限制。只有在部署到 Cloudflare 网络时才会强制执行限制，而不是在本地开发中。CPU 限制可以设置为最大 30000 毫秒（30 秒）。

每个 [isolate](https://developers.cloudflare.com/workers/reference/how-workers-works/#isolates) 都有一些内置的灵活性，以允许 Worker 不经常超过配置的限制运行。如果您的 Worker 开始持续达到限制，则其执行将根据配置的限制终止。

-   `cpu_ms` 数 自选  
    -   每次调用允许的最大 CPU 时间（以毫秒为单位）。

例：

## 绑定

### 浏览器渲染

[Workers 浏览器渲染 API](https://developers.cloudflare.com/browser-rendering/) 允许开发人员以编程方式控制无头浏览器实例并与之交互，并为其应用程序和产品创建自动化流程。

[浏览器绑定](https://developers.cloudflare.com/workers/runtime-apis/bindings/)将为您的 Worker 提供经过身份验证的终端节点，以便与专用的 Chromium 浏览器实例进行交互。

-   `binding` 字符串 必填  
    -   用于引用 D1 数据库的绑定名称。您设置的值 （string） 将用于在 Worker 中引用此数据库。绑定必须是[有效的 JavaScript 变量 name ↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variables) 。例如，or 两者都是绑定的有效名称。`binding = "MY_DB"``binding = "productionDB"`

例：

```toml
browser = {
  binding = "<BINDING_NAME>"
}
# or
[browser]
binding = "<BINDING_NAME>"
```

### D1 数据库

[D1](https://developers.cloudflare.com/d1/) 是 Cloudflare 的无服务器 SQL 数据库。Worker 可以通过为 D1 的[客户端 API](https://developers.cloudflare.com/d1/build-with-d1/d1-client-api/) 创建与每个数据库的[绑定](https://developers.cloudflare.com/workers/runtime-apis/bindings/)来查询 D1 数据库（或多个数据库）。

要将 D1 数据库绑定到 Worker，请将以下对象的数组分配给 key。`[[d1_databases]]`

-   `binding` 字符串 必填  
    -   用于引用 D1 数据库的绑定名称。您设置的值 （string） 将用于在 Worker 中引用此数据库。绑定必须是[有效的 JavaScript 变量 name ↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variables) 。例如，or 两者都是绑定的有效名称。`binding = "MY_DB"``binding = "productionDB"`
-   `database_name` 字符串 必填  
    -   数据库的名称。这是一个可读的名称，允许您区分不同的数据库，并在您首次创建数据库时设置。
-   `database_id` 字符串 必填  
    -   数据库的 ID。数据库 ID 在您首次使用或调用 时可用，并唯一标识您的数据库。`wrangler d1 create``wrangler d1 list`
-   `preview_database_id` 字符串 自选  
    -   此 D1 数据库的预览 ID。如果提供，将使用此 ID。否则，它将使用 .使用 时，此选项是必需的。`wrangler dev``database_id``wrangler dev --remote`
        
    -   数据库的 ID。数据库 ID 在您首次使用或调用 时可用，并唯一标识您的数据库。`wrangler d1 create``wrangler d1 list`
        
-   `migrations_dir` 字符串 自选  
    -   包含迁移文件的迁移目录。默认情况下，会创建一个名为 的文件夹。可用于指定包含迁移文件的其他文件夹。有关更多信息，请参阅 [D1 Wrangler `迁移`命令](https://developers.cloudflare.com/workers/wrangler/commands/#migrations-create)和 [D1 迁移](https://developers.cloudflare.com/d1/reference/migrations/)。`wrangler d1 migrations create``migrations``migrations_dir`

例：

```toml
d1_databases = [
  {
    binding = "<BINDING_NAME>",
    database_name = "<DATABASE_NAME>",
    database_id = "<DATABASE_ID>"
  }
]
# or
[[d1_databases]]
binding = "<BINDING_NAME>"
database_name = "<DATABASE_NAME>"
database_id = "<DATABASE_ID>"
```

### 调度命名空间绑定（Workers for Platforms）

Dispatch 命名空间绑定允许[动态 dispatch Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dynamic-dispatch-worker) 和 [dispatch 命名空间](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dispatch-namespace)之间的通信。Dispatch 命名空间绑定用于 [Workers for Platforms](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/)。Workers for Platforms 可帮助您代表客户以编程方式部署无服务器功能。

-   `binding` 字符串 必填  
    -   绑定名称。您设置的值 （string） 将用于在 Worker 中引用此数据库。绑定必须是[有效的 JavaScript 变量 name ↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variables) 。例如，or 两者都是绑定的有效名称。`binding = "MY_NAMESPACE"``binding = "productionNamespace"`
-   `namespace` 字符串 必填  
    -   [调度命名空间](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dispatch-namespace)的名称。
-   `outbound` 对象 自选  
    -   `service` 字符串 必填  
        要绑定到的[出站 Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/outbound-workers/) 的名称。
    -   `parameters`array optional  
        将数据从[动态调度 Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dynamic-dispatch-worker) 传递到[出站 Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/outbound-workers/) 的参数列表。

例：

```toml
[[dispatch_namespaces]]
binding = "<BINDING_NAME>"
namespace = "<NAMESPACE_NAME>"
outbound = {
  service = "<WORKER_NAME>",
  parameters = ["params_object"]
}
```

### 耐用对象

[Durable Objects](https://developers.cloudflare.com/durable-objects/) 为 Workers 平台提供低延迟协调和一致的存储。

要将 Durable Objects 绑定到 Worker，请将以下对象的数组分配给 key。`durable_objects.bindings`

-   `name` 字符串 必填  
    -   用于引用 Durable Object 的绑定的名称。
-   `class_name` 字符串 必填  
    -   Durable Object 的导出类名。
-   `script_name` 字符串 自选  
    -   定义 Durable Object 的工作程序的名称（如果它位于此工作程序外部）。此选项可用于本地和远程开发。在本地开发中，您必须在单独的进程中运行外部 Worker（通过 ）。在远程开发中，必须使用适当的远程绑定。`wrangler dev`
-   `environment` 字符串 自选  
    -   要绑定到的环境。`script_name`

例：

```toml
durable_objects.bindings = [
  {
    name = "<BINDING_NAME>",
    class_name = "<CLASS_NAME>"
  }
]
# or
[[durable_objects.bindings]]
name = "<BINDING_NAME>"
class_name = "<CLASS_NAME>"
```

#### 迁移

更改 Durable Object 类时，必须执行迁移。请参阅 [Durable Object 迁移](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/)。

-   `tag` 字符串 必填  
    -   此迁移的唯一标识符。
-   `new_classes` 字符串\[\] 自选  
    -   正在定义的新 Durable Objects。
-   `renamed_classes` 字符串，to： string}\[\] 自选  
    -   正在重命名的 Durable Object。
-   `deleted_classes` 字符串\[\] 自选  
    -   正在删除的 Durable Object。

例：

```toml
[[migrations]]
tag = "v1" # Should be unique for each entry
new_classes = ["DurableObjectExample"]
[[migrations]]
tag = "v2"
renamed_classes = [{from = "DurableObjectExample", to = "UpdatedName"}] # Array of rename directives
deleted_classes = ["DeprecatedClass"] # Array of deleted class names
```

### 电子邮件绑定

您可以将有关 Worker 活动的电子邮件从 Worker 发送到在 [Email Routing](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/#destination-addresses) 上验证的电子邮件地址。例如，当您想要了解正在触发的某些类型的事件时，这非常有用。

在将电子邮件地址绑定到 Worker 之前，您需要[启用电子邮件路由](https://developers.cloudflare.com/email-routing/get-started/)并至少有一个[经过验证的电子邮件地址](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/#destination-addresses)。然后，将数组分配给对象 （send\_email） 所需的电子邮件绑定类型。

-   `name` 字符串 必填  
    -   绑定名称。
-   `destination_address` 字符串 自选  
    -   您向其发送电子邮件的[所选电子邮件地址](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/#types-of-bindings)。
-   `allowed_destination_addresses` 字符串\[\] 自选  
    -   您向其发送电子邮件的电子邮件地址[的允许列表](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/#types-of-bindings)。

您可以向文件添加一种或多种类型的绑定。但是，每个属性都必须位于其自己的行上：`wrangler.toml`

例：

```toml
send_email = [
  {name = "<NAME_FOR_BINDING1>"},
  {name = "<NAME_FOR_BINDING2>", destination_address = "<YOUR_EMAIL>@example.com"},
  {name = "<NAME_FOR_BINDING3>", allowed_destination_addresses = ["<YOUR_EMAIL>@example.com", "<YOUR_EMAIL2>@example.com"]}
]
```

### 环境变量

[环境变量](https://developers.cloudflare.com/workers/configuration/environment-variables/)是一种绑定类型，允许您将文本字符串或 JSON 值附加到 Worker。

例：

```toml
name = "my-worker-dev"
[vars]
API_HOST = "example.com"
API_ACCOUNT_ID = "example_user"
SERVICE_X_DATA = {
  URL = "service-x-api.dev.example",
  MY_ID = 123
}
```

### 超高速驱动器

[Hyperdrive](https://developers.cloudflare.com/hyperdrive/) 绑定允许您从 Worker 中与任何 Postgres 数据库进行交互和查询。

-   `binding` 字符串 必填  
    -   绑定名称。
-   `id` 字符串 必填  
    -   Hyperdrive 配置的 ID。

例：

```toml
# required for database drivers to function
compatibility_flags = ["nodejs_compat_v2"]
[[hyperdrive]]
binding = "<BINDING_NAME>"
id = "<ID>"
```

### KV 命名空间

[Workers KV](https://developers.cloudflare.com/kv/api/) 是一种全球性的低延迟键值数据存储。它将数据存储在少数集中式数据中心中，然后在访问后将这些数据缓存在 Cloudflare 的数据中心。

要将 KV 命名空间绑定到 Worker，请将以下对象的数组分配给 key。`kv_namespaces`

-   `binding` 字符串 必填  
    -   用于引用 KV 命名空间的绑定名称。
-   `id` 字符串 必填  
    -   KV 命名空间的 ID。
-   `preview_id` 字符串 自选  
    -   此 KV 命名空间的预览 ID。当用于针对远程资源进行开发时**，此选项是必需的**。如果在本地开发 （无），则这是一个可选字段。 将对此 ID 用于 KV 命名空间。否则，将使用 .`wrangler dev --remote``--remote``wrangler dev``wrangler dev``id`

例：

```toml
kv_namespaces = [
  {
    binding = "<BINDING_NAME1>",
    id = "<NAMESPACE_ID1>"
  },
  {
    binding = "<BINDING_NAME2>",
    id = "<NAMESPACE_ID2>"
  }
]
# or
[[kv_namespaces]]
binding = "<BINDING_NAME1>"
id = "<NAMESPACE_ID1>"
[[kv_namespaces]]
binding = "<BINDING_NAME2>"
id = "<NAMESPACE_ID2>"
```

### 可观察性

[“可观察性](https://developers.cloudflare.com/workers/observability/logs/workers-logs)”设置允许您直接从 Cloudflare Worker 的仪表板自动摄取、存储、过滤和分析从 Cloudflare Workers 发出的日志数据。

-   `enabled`需要布尔值  
    -   当设置为 on a Worker 时，将保留 Worker 的日志。默认为所有新 Worker 启用。`true``true`
-   `head_sampling_rate`数字 可选  
    -   一个介于 0 和 1 之间的数字，其中 0 表示记录 100 个请求中的 0 个，1 表示记录每个请求。如果未指定，则将其配置为默认值 1 （100%）。阅读有关[基于头部的采样](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#head-based-sampling)的更多信息。`head_sampling_rate`

例：

```toml
[observability]
enabled = true
[observability]
enabled = true
head_sampling_rate = 0.1 # 10% of requests are logged
```

### 队列

[Queues](https://developers.cloudflare.com/queues/) 是 Cloudflare 的全球消息队列服务，提供[有保证的传输](https://developers.cloudflare.com/queues/reference/delivery-guarantees/)和[消息批处理](https://developers.cloudflare.com/queues/configuration/batching-retries/)。要使用 Worker 与队列交互，您需要一个生产者 Worker 向队列发送消息，并使用一个使用者 Worker 从 Queue 中提取批量消息。单个 Worker 可以生成多个 Queue 并从多个 Queues 消费。

要将 Queues 绑定到你的 producer Worker，请将以下对象的数组分配给 key。`[[queues.producers]]`

-   `queue` 字符串 必填  
    -   队列的名称，在 Cloudflare 仪表板上使用。
-   `binding` 字符串 必填  
    -   用于引用 Worker 中的队列的绑定名称。绑定必须是[有效的 JavaScript 变量 name ↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variables) 。例如，or 两者都是绑定的有效名称。`binding = "MY_QUEUE"``binding = "productionQueue"`
-   `delivery_delay` 数 自选  
    -   默认情况下[，延迟发送到队列的消息](https://developers.cloudflare.com/queues/configuration/batching-retries/#delay-messages)的秒数。可以按消息或按批次覆盖此字段。

例：

```toml
[[queues.producers]]
binding = "<BINDING_NAME>"
queue = "<QUEUE_NAME>"
delivery_delay = 60 # Delay messages by 60 seconds before they are delivered to a consumer
```

要将 Queues 绑定到你的使用者 Worker，请将以下对象的数组分配给 key。`[[queues.consumers]]`

-   `queue` 字符串 必填  
    -   队列的名称，在 Cloudflare 仪表板上使用。
-   `max_batch_size` 数 自选  
    -   每个批次中允许的最大消息数。
-   `max_batch_timeout` 数 自选  
    -   在将批处理发送到使用者 Worker 之前等待消息填充批处理的最大秒数。
-   `max_retries` 数 自选  
    -   消息的最大重试次数（如果消息失败或调用 [`retryAll（）`](https://developers.cloudflare.com/queues/configuration/javascript-apis/#messagebatch) 时）。
-   `dead_letter_queue` 字符串 自选  
    -   如果消息至少处理失败几次，则要发送消息的另一个队列的名称。`max_retries`
    -   如果未定义 a，则将丢弃反复处理失败的消息。`dead_letter_queue`
    -   如果没有指定名称的队列，则会自动创建该队列。
-   `max_concurrency` 数 自选  
    -   允许一次运行的并发使用者的最大数量。如果未设置此项，则意味着调用次数将扩展到[当前支持的最大值](https://developers.cloudflare.com/queues/platform/limits/)。
    -   有关使用者如何自动扩展的更多信息，尤其是在重试消息时，请参阅[使用者并发](https://developers.cloudflare.com/queues/configuration/consumer-concurrency/)。
-   `retry_delay` 数 自选  
    -   默认情况下，在将重试消息重新传送给使用者之前，[延迟重试消息](https://developers.cloudflare.com/queues/configuration/batching-retries/#delay-messages)的秒数。[在重试消息时](https://developers.cloudflare.com/queues/configuration/batching-retries/#explicit-acknowledgement-and-retries)，可以按消息或按批次覆盖此属性。

例：

```toml
[[queues.consumers]]
queue = "my-queue"
max_batch_size = 10
max_batch_timeout = 30
max_retries = 10
dead_letter_queue = "my-queue-dlq"
max_concurrency = 5
retry_delay = 120 # Delay retried messages by 2 minutes before re-attempting delivery
```

### R2 buckets

[Cloudflare R2 Storage](https://developers.cloudflare.com/r2) allows developers to store large amounts of unstructured data without the costly egress bandwidth fees associated with typical cloud storage services.

To bind R2 buckets to your Worker, assign an array of the below object to the key.`r2_buckets`

-   `binding` string required  
    -   The binding name used to refer to the R2 bucket.
-   `bucket_name` string required  
    -   The name of this R2 bucket.
-   `jurisdiction` string optional  
    -   The jurisdiction where this R2 bucket is located, if a jurisdiction has been specified. Refer to [Jurisdictional Restrictions](https://developers.cloudflare.com/r2/reference/data-location/#jurisdictional-restrictions).
-   `preview_bucket_name` string optional  
    -   The preview name of this R2 bucket. If provided, will use this name for the R2 bucket. Otherwise, it will use . This option is required when using .`wrangler dev``bucket_name``wrangler dev --remote`

Example:

```toml
r2_buckets = [
  {
    binding = "<BINDING_NAME1>",
    bucket_name = "<BUCKET_NAME1>"
  },
  {
    binding = "<BINDING_NAME2>",
    bucket_name = "<BUCKET_NAME2>"
  }
]
# or
[[r2_buckets]]
binding = "<BINDING_NAME1>"
bucket_name = "<BUCKET_NAME1>"
[[r2_buckets]]
binding = "<BINDING_NAME2>"
bucket_name = "<BUCKET_NAME2>"
```

### Vectorize indexes

A [Vectorize index](https://developers.cloudflare.com/vectorize/) allows you to insert and query vector embeddings for semantic search, classification and other vector search use-cases.

To bind Vectorize indexes to your Worker, assign an array of the below object to the key.`vectorize`

-   `binding` string required  
    -   The binding name used to refer to the bound index from your Worker code.
-   `index_name` string required  
    -   The name of the index to bind.

Example:

```toml
vectorize = [
  {
    binding = "<BINDING_NAME>",
    index_name = "<INDEX_NAME>"
  }
]
# or
[[vectorize]]
binding = "<BINDING_NAME>"
index_name = "<INDEX_NAME>"
```

### Service bindings

A service binding allows you to send HTTP requests to another Worker without those requests going over the Internet. The request immediately invokes the downstream Worker, reducing latency as compared to a request to a third-party service. Refer to [About Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/).

To bind other Workers to your Worker, assign an array of the below object to the key.`services`

-   `binding` string required  
    -   The binding name used to refer to the bound Worker.
-   `service` string required  
    -   The name of the Worker.
-   `entrypoint` string optional  
    -   The name of the [entrypoint](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/#named-entrypoints) to bind to. If you do not specify an entrypoint, the default export of the Worker will be used.

Example:

```toml
services = [
  {
    binding = "<BINDING_NAME>",
    service = "<WORKER_NAME>",
    entrypoint = "<ENTRYPOINT_NAME>"
  }
]
# or
[[services]]
binding = "<BINDING_NAME>"
service = "<WORKER_NAME>"
entrypoint = "<ENTRYPOINT_NAME>"
```

### Static assets

Refer to [Assets](https://developers.cloudflare.com/workers/static-assets/) for more details.

### Analytics Engine Datasets

[Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) provides analytics, observability and data logging from Workers. Write data points to your Worker binding then query the data using the [SQL API](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/).

To bind Analytics Engine datasets to your Worker, assign an array of the below object to the key.`analytics_engine_datasets`

-   `binding` string required  
    -   The binding name used to refer to the dataset.
-   `dataset` string optional  
    -   The dataset name to write to. This will default to the same name as the binding if it is not supplied.

Example:

```toml
analytics_engine_datasets = [
  {
    binding = "<BINDING_NAME>",
    dataset = "<DATASET_NAME>"
  }
]
# or
[[analytics_engine_datasets]]
binding = "<BINDING_NAME>"
dataset = "<DATASET_NAME>"
```

### mTLS Certificates

To communicate with origins that require client authentication, a Worker can present a certificate for mTLS in subrequests. Wrangler provides the [command](https://developers.cloudflare.com/workers/wrangler/commands#mtls-certificate) to upload and manage these certificates.`mtls-certificate`

To create a [binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/) to an mTLS certificate for your Worker, assign an array of objects with the following shape to the key.`mtls_certificates`

-   `binding` string required  
    -   The binding name used to refer to the certificate.
-   `certificate_id` string required  
    -   The ID of the certificate. Wrangler displays this via the and commands.`mtls-certificate upload``mtls-certificate list`

Example of a configuration that includes an mTLS certificate binding:`wrangler.toml`

```toml
mtls_certificates = [
  {
    binding = "<BINDING_NAME1>",
    certificate_id = "<CERTIFICATE_ID1>"
  },
  {
    binding = "<BINDING_NAME2>",
    certificate_id = "<CERTIFICATE_ID2>"
  }
]
# or
[[mtls_certificates]]
binding = "<BINDING_NAME1>"
certificate_id = "<CERTIFICATE_ID1>"
[[mtls_certificates]]
binding = "<BINDING_NAME2>"
certificate_id = "<CERTIFICATE_ID2>"
```

mTLS certificate bindings can then be used at runtime to communicate with secured origins via their [`fetch` method](https://developers.cloudflare.com/workers/runtime-apis/bindings/mtls).

### Workers AI

[Workers AI](https://developers.cloudflare.com/workers-ai/) allows you to run machine learning models, on the Cloudflare network, from your own code – whether that be from Workers, Pages, or anywhere via REST API.

Unlike other bindings, this binding is limited to one AI binding per Worker project.

-   `binding` string required  
    -   The binding name.

Example:

```toml
ai = {
  binding = "<AI>"
}
# or
[ai]
binding = "AI" # available in your Worker code on `env.AI`
```

## Assets

[Static assets](https://developers.cloudflare.com/workers/static-assets/) allows developers to run front-end websites on Workers. You can configure the directory of assets, an optional runtime binding, and routing configuration options.

You can only configure one collection of assets per Worker.

The following options are available under the key.`assets`

-   `directory` string required  
    -   Folder of static assets to be served.
-   `binding` string optional  
    -   The binding name used to refer to the assets. Optional, and only useful when a Worker script is set with .`main`
-   `html_handling`: "auto-trailing-slash" | "force-trailing-slash" | "drop-trailing-slash" | "none" optional, defaults to "auto-trailing-slash"  
    -   Determines the redirects and rewrites of requests for HTML content. Learn more about the various options in [assets routing](https://developers.cloudflare.com/workers/static-assets/routing/#html_handling).
-   `not_found_handling`: "single-page-application" | "404-page" | "none" optional, defaults to "none"  
    -   Determines the handling of requests that do not map to an asset. Learn more about the various options in [assets routing](https://developers.cloudflare.com/workers/static-assets/routing/#not_found_handling).

Example:

```toml
assets = {
  directory = "./public",
  binding = "ASSETS",
  html_handling = "force-trailing-slash",
  not_found_handling = "404-page"
}
```

## Bundling

You can bundle modules into your Worker using the key, making these modules available to be imported when your Worker is invoked. The key will be an array of the below object.`rules``rules`

-   `type` string required  
    -   The type of module. Must be one of: , , , or .`ESModule``CommonJS``CompiledWasm``Text``Data`
-   `globs` string\[\] required  
    -   An array of glob rules (for example, ). Refer to [glob ↗](https://man7.org/linux/man-pages/man7/glob.7.html).`["**/*.md"]`
-   `fallthrough` boolean optional  
    -   When set to on a rule, this allows you to have multiple rules for the same .`true``Type`

Example:

```toml
rules = [
  {
    type = "Text",
    globs = ["**/*.md"],
    fallthrough = true
  }
]
```

### Importing modules within a Worker

You can import and refer to these modules within your Worker, like so:

```javascript
import markdown from "./example.md";
export default {
  async fetch() {
    return new Response(markdown);
  },
};
```

## Local development settings

You can configure various aspects of local development, such as the local protocol or port.

-   `ip` string optional  
    -   IP address for the local dev server to listen on. Defaults to .`localhost`
-   `port` number optional  
    -   Port for the local dev server to listen on. Defaults to .`8787`
-   `local_protocol` string optional  
    -   Protocol that local dev server listens to requests on. Defaults to .`http`
-   `upstream_protocol` string optional  
    -   Protocol that the local dev server forwards requests on. Defaults to .`https`
-   `host` string optional  
    -   Host to forward requests to, defaults to the host of the first of the Worker.`route`

Example:

```toml
[dev]
ip = "192.168.1.1"
port = 8080
local_protocol = "http"
```

### Secrets

[Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) are a type of binding that allow you to [attach encrypted text values](https://developers.cloudflare.com/workers/wrangler/commands/#secret) to your Worker.

When developing your Worker or Pages Function, create a file in the root of your project to define secrets that will be used when running or , as opposed to using [environment variables in `wrangler.toml`](https://developers.cloudflare.com/workers/configuration/environment-variables/#compare-secrets-and-environment-variables). This works both in local and remote development modes.`.dev.vars``wrangler dev``wrangler pages dev`

The file should be formatted like a file, such as :`.dev.vars``dotenv``KEY="VALUE"`

```dotenv
SECRET_KEY="value"
API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
```

## Module Aliasing

You can configure Wrangler to replace all calls to import a particular package with a module of your choice, by configuring the field:`alias`

```toml
[alias]
"foo" = "./replacement-module-filepath"
```

```javascript
export const bar = "baz";
```

With the configuration above, any calls to or the module will be aliased to point to your replacement module:`import``require()``foo`

```javascript
import { bar } from "foo";
console.log(bar); // returns "baz"
```

### Example: Aliasing dependencies from NPM

You can use module aliasing to provide an implementation of an NPM package that does not work on Workers — even if you only rely on that NPM package indirectly, as a dependency of one of your Worker’s dependencies.

For example, some NPM packages depend on [`node-fetch` ↗](https://www.npmjs.com/package/node-fetch), a package that provided a polyfill of the [`fetch()` API](https://developers.cloudflare.com/workers/runtime-apis/fetch/), before it was built into Node.js.

`node-fetch` isn’t needed in Workers, because the API is provided by the Workers runtime. And doesn’t work on Workers, because it relies on currently unsupported Node.js APIs from the / modules.`fetch()``node-fetch``http``https`

You can alias all imports of to instead point directly to the API that is built into the Workers runtime:`node-fetch``fetch()`

```toml
[alias]
"node-fetch" = "./fetch-nolyfill"
```

### Example: Aliasing Node.js APIs

You can use module aliasing to provide your own polyfill implementation of a Node.js API that is not yet available in the Workers runtime.

For example, let’s say the NPM package you rely on calls [`fs.readFile` ↗](https://nodejs.org/api/fs.html#fsreadfilepath-options-callback). You can alias the fs module by adding the following to your Worker’s wrangler.toml:

```toml
[alias]
"fs" = "./fs-polyfill"
```

```javascript
export function readFile() {
  // ...
}
```

In many cases, this allows you to work provide just enough of an API to make a dependency work. You can learn more about Cloudflare Workers’ support for Node.js APIs on the [Cloudflare Workers Node.js API documentation page](https://developers.cloudflare.com/workers/runtime-apis/nodejs/).

## Source maps

[Source maps](https://developers.cloudflare.com/workers/observability/source-maps/) translate compiled and minified code back to the original code that you wrote. Source maps are combined with the stack trace returned by the JavaScript runtime to present you with a stack trace.

-   `upload_source_maps` boolean  
    -   When is set to , Wrangler will automatically generate and upload source map files when you run [`wrangler deploy`](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) or [`wrangler versions deploy`](https://developers.cloudflare.com/workers/wrangler/commands/#deploy-2).`upload_source_maps``true`

Example:

```toml
upload_source_maps = true
```

## Workers Sites

[Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/) allows you to host static websites, or dynamic websites using frameworks like Vue or React, on Workers.

-   `bucket` string required  
    -   The directory containing your static assets. It must be a path relative to your file.`wrangler.toml`
-   `include` string\[\] optional  
    -   An exclusive list of -style patterns that match file or directory names from your bucket location. Only matched items will be uploaded.`.gitignore`
-   `exclude` string\[\] optional  
    -   A list of -style patterns that match files or directories in your bucket that should be excluded from uploads.`.gitignore`

Example:

```toml
[site]
bucket = "./public"
include = ["upload_dir"]
exclude = ["ignore_dir"]
```

## Proxy support

Corporate networks will often have proxies on their networks and this can sometimes cause connectivity issues. To configure Wrangler with the appropriate proxy details, use the below environmental variables:

-   `https_proxy`
-   `HTTPS_PROXY`
-   `http_proxy`
-   `HTTP_PROXY`

To configure this on macOS, add before your Wrangler commands.`HTTP_PROXY=http://<YOUR_PROXY_HOST>:<YOUR_PROXY_PORT>`

Example:

```bash
$ HTTP_PROXY=http://localhost:8080 wrangler dev
```

If your IT team has configured your computer’s proxy settings, be aware that the first non-empty environment variable in this list will be used when Wrangler makes outgoing requests.

For example, if both and are set, Wrangler will只使用 进行外发请求。`https_proxy``http_proxy``https_proxy`

## Source of truth

We recommend treating your file as the source of truth for your Worker configuration, and to avoid making changes to your Worker via the Cloudflare dashboard if you are using Wrangler.`wrangler.toml`

If you need to make changes to your Worker from the Cloudflare dashboard, the dashboard will generate a TOML snippet for you to copy into your file, which will help ensure your file is always up to date.`wrangler.toml``wrangler.toml`

If you change your environment variables in the Cloudflare dashboard，Wrangler将在下次部署时覆盖它们。如果您想禁用此行为，请将添加到您的 .`keep_vars = true``wrangler.toml`

如果您在仪表板中更改路由，Wrangler将在下次部署时使用您在 的路由覆盖它们。要仅通过 Cloudflare 仪表板管理路由，请从您的文件中删除任何路由和 routes 键。然后将添加到您的文件。有关更多信息，请参阅 [Deprecations](https://developers.cloudflare.com/workers/wrangler/deprecations/#other-deprecated-behavior)。`wrangler.toml``wrangler.toml``workers_dev = false``wrangler.toml`

Wrangler不会删除您的机密（加密环境变量），除非您运行 .`wrangler secret delete <key>`
```

以上是将你提供的内容转换为Markdown格式的结果。如果你需要进一步的修改或调整，请告诉我！
