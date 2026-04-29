/**
 * 备用随机 SVG 图标 - 优化设计
 */
export const fallbackSVGIcons = [
  `<svg width="80" height="80" viewBox="0 0 24 24" fill="url(#gradient1)" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" stop-color="#7209b7" />
         <stop offset="100%" stop-color="#4cc9f0" />
       </linearGradient>
     </defs>
     <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
   </svg>`,
  `<svg width="80" height="80" viewBox="0 0 24 24" fill="url(#gradient2)" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" stop-color="#4361ee" />
         <stop offset="100%" stop-color="#4cc9f0" />
       </linearGradient>
     </defs>
     <circle cx="12" cy="12" r="10"/>
     <path d="M12 7v5l3.5 3.5 1.42-1.42L14 11.58V7h-2z" fill="#fff"/>
   </svg>`,
  `<svg width="80" height="80" viewBox="0 0 24 24" fill="url(#gradient3)" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" stop-color="#7209b7" />
         <stop offset="100%" stop-color="#4361ee" />
       </linearGradient>
     </defs>
     <path d="M12 .587l3.668 7.431L24 9.172l-6 5.843 1.416 8.252L12 19.771l-7.416 3.496L6 15.015 0 9.172l8.332-1.154z"/>
   </svg>`,
];



function getRandomSVG() {
  return fallbackSVGIcons[Math.floor(Math.random() * fallbackSVGIcons.length)];
}

/**
 * 本地图标库映射表
 * 格式：域名 -> 本地图标路径
 */
const LOCAL_ICON_MAP = {
  // 开发工具
  'github.com': '/icons/github.svg',
  // 办公协作
  'feishu.cn': '/icons/server.svg',  // 临时用 server 替代
  'notion.site': '/icons/notion.svg',
  // 视频娱乐
  'bilibili.com': '/icons/bilibili.svg',
  // 云服务/AI
  'cloudflare.com': '/icons/cloudflare.svg',
  'aliyun.com': '/icons/alibabacloud.svg',
  'volcengine.com': '/icons/cloudflare.svg',
  'bigmodel.cn': '/icons/server.svg',
  'minimaxi.com': '/icons/server.svg',
  // VPS/服务器
  'racknerd.com': '/icons/server.svg',
  'hellohub.top': '/icons/server.svg',
  'acck.io': '/icons/server.svg',
  // 监控工具
  'zjimi.xyz': '/icons/grafana.svg',
  // 其他工具
  'ping0.cc': '/icons/tools.svg',
  'google.com': '/icons/google.svg',
};

/**
 * 从 URL 提取域名
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    // 提取主域名（如 platform.minimaxi.com -> minimaxi.com）
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  } catch (e) {
    return '';
  }
}

/**
 * 渲染单个网站卡片（优化版）
 */
function renderSiteCard(site) {
  let logoSrc = site.logo;
  
  // 三层回退机制：
  // 1. site.logo（Yandex API）
  // 2. 本地图标库
  // 3. 随机 SVG
  
  if (!logoSrc) {
    const domain = extractDomain(site.url);
    // 查找本地图标库
    if (domain && LOCAL_ICON_MAP[domain]) {
      logoSrc = LOCAL_ICON_MAP[domain];
    }
  }
  
  const logoHTML = logoSrc
    ? `<img src="${logoSrc}" alt="${site.name}"/>`
    : getRandomSVG();

  return `
    <div class="channel-card" data-id="${site.id}">
      <div class="channel-number">${site.id}</div>
      <h3 class="channel-title">${site.name || '未命名'}</h3>
      <span class="channel-tag">${site.catelog}</span>
      <div class="logo-wrapper">${logoHTML}</div>
      <p class="channel-desc">${site.desc || '暂无描述'}</p>
      <a href="${site.url}" target="_blank" class="channel-link">${site.url}</a>
      <button class="copy-btn" data-url="${site.url}" title="复制链接">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
      <div class="copy-success">已复制!</div>
    </div>
  `;
}

function escapeHTML(input) {
  if (input === null || input === undefined) {
    return '';
  }
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(url) {
  if (!url) {
    return '';
  }
  const trimmed = String(url).trim();
  // 支持 data: 协议（base64 图片）
  if (/^data:image\//i.test(trimmed)) {
    return trimmed;
  }
  try {
    const direct = new URL(trimmed);
    if (direct.protocol === 'http:' || direct.protocol === 'https:') {
      return direct.href;
    }
  } catch (error) {
    try {
      const fallback = new URL(`https://${trimmed}`);
      if (fallback.protocol === 'http:' || fallback.protocol === 'https:') {
        return fallback.href;
      }
    } catch (e) {
      return '';
    }
  }
  return '';
}

function normalizeSortOrder(value) {
  if (value === undefined || value === null || value === '') {
    return 9999;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    const clamped = Math.max(-2147483648, Math.min(2147483647, Math.round(parsed)));
    return clamped;
  }
  return 9999;
}

function isSubmissionEnabled(env) {
  const flag = env.ENABLE_PUBLIC_SUBMISSION;
  if (flag === undefined || flag === null) {
    return true;
  }
  const normalized = String(flag).trim().toLowerCase();
  return normalized === 'true';
}

const SESSION_COOKIE_NAME = 'nav_admin_session';
const SESSION_PREFIX = 'session:';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12小时会话

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) {
        acc[pair] = '';
      } else {
        const key = pair.slice(0, separatorIndex).trim();
        const value = pair.slice(separatorIndex + 1).trim();
        acc[key] = value;
      }
      return acc;
    }, {});
}

function buildSessionCookie(token, options = {}) {
  const { maxAge = SESSION_TTL_SECONDS } = options;
  const segments = [
    `${SESSION_COOKIE_NAME}=${token}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'SameSite=Strict',
    'Secure',
  ];
  return segments.join('; ');
}

async function createAdminSession(env) {
  const token = crypto.randomUUID();
  await env.NAV_AUTH.put(`${SESSION_PREFIX}${token}`, JSON.stringify({ createdAt: Date.now() }), {
    expirationTtl: SESSION_TTL_SECONDS,
  });
  return token;
}

async function refreshAdminSession(env, token, payload) {
  await env.NAV_AUTH.put(`${SESSION_PREFIX}${token}`, payload, { expirationTtl: SESSION_TTL_SECONDS });
}

async function destroyAdminSession(env, token) {
  if (!token) return;
  await env.NAV_AUTH.delete(`${SESSION_PREFIX}${token}`);
}

async function validateAdminSession(request, env) {
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) {
    return { authenticated: false };
  }
  const sessionKey = `${SESSION_PREFIX}${token}`;
  const payload = await env.NAV_AUTH.get(sessionKey);
  if (!payload) {
    return { authenticated: false };
  }
  // 会话有效，刷新TTL
  await refreshAdminSession(env, token, payload);
  return { authenticated: true, token };
}

async function isAdminAuthenticated(request, env) {
  const { authenticated } = await validateAdminSession(request, env);
  return authenticated;
}

  
  /**
   * 处理 API 请求
   */
  const api = {
    async handleRequest(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname.replace('/api', ''); // 去掉 "/api" 前缀
        const method = request.method;
        const id = url.pathname.split('/').pop(); // 获取最后一个路径段，作为 id (例如 /api/config/1)
        try {
            if (path === '/config') {
                switch (method) {
                    case 'GET':
                        return await this.getConfig(request, env, ctx, url);
                    case 'POST':
                        if (!(await isAdminAuthenticated(request, env))) {
                            return this.errorResponse('Unauthorized', 401);
                        }
                        return await this.createConfig(request, env, ctx);
                    default:
                        return this.errorResponse('Method Not Allowed', 405)
                }
            }
            if (path === '/config/submit' && method === 'POST') {
              if (!isSubmissionEnabled(env)) {
                return this.errorResponse('Public submission disabled', 403);
              }
              return await this.submitConfig(request, env, ctx);
           }
           if (path === '/categories' && method === 'GET') {
              if (!(await isAdminAuthenticated(request, env))) {
                  return this.errorResponse('Unauthorized', 401);
              }
              return await this.getCategories(request, env, ctx);
           }
            if (path.startsWith('/categories/') && path.endsWith('/sites')) {
                if (!(await isAdminAuthenticated(request, env))) {
                    return this.errorResponse('Unauthorized', 401);
                }
                const categoryName = decodeURIComponent(path.replace('/categories/', '').replace('/sites', ''));
                switch (method) {
                    case 'DELETE':
                        return await this.deleteCategorySites(request, env, ctx, categoryName);
                    default:
                        return this.errorResponse('Method Not Allowed', 405);
                }
            }
            // 批量删除分类
            if (path === '/categories/batch-delete') {
                if (!(await isAdminAuthenticated(request, env))) {
                    return this.errorResponse('Unauthorized', 401);
                }
                if (method === 'POST') {
                    return await this.batchDeleteCategories(request, env, ctx);
                }
                return this.errorResponse('Method Not Allowed', 405);
            }
            if (path.startsWith('/categories/')) {
                if (!(await isAdminAuthenticated(request, env))) {
                    return this.errorResponse('Unauthorized', 401);
                }
                const categoryName = decodeURIComponent(path.replace('/categories/', ''));
                switch (method) {
                    case 'PUT':
                        return await this.updateCategoryOrder(request, env, ctx, categoryName);
                    case 'PATCH':
                        return await this.renameCategory(request, env, ctx, categoryName);
                    default:
                        return this.errorResponse('Method Not Allowed', 405);
                }
            }
            if (path === `/config/${id}` && /^\d+$/.test(id)) {
                switch (method) {
                    case 'PUT':
                        if (!(await isAdminAuthenticated(request, env))) {
                            return this.errorResponse('Unauthorized', 401);
                        }
                        return await this.updateConfig(request, env, ctx, id);
                    case 'DELETE':
                        if (!(await isAdminAuthenticated(request, env))) {
                            return this.errorResponse('Unauthorized', 401);
                        }
                        return await this.deleteConfig(request, env, ctx, id);
                    default:
                        return this.errorResponse('Method Not Allowed', 405)
                }
            }
            // 【书签隐藏功能】切换隐藏状态 API - 从 path 中提取 id
            if (path.includes('/toggle-hidden') && method === 'PUT') {
                const idMatch = path.match(/^\/config\/(\d+)\/toggle-hidden$/);
                if (idMatch) {
                    const toggleId = idMatch[1];
                    if (!(await isAdminAuthenticated(request, env))) {
                        return this.errorResponse('Unauthorized', 401);
                    }
                    return await this.toggleHidden(request, env, ctx, toggleId);
                }
            }
              if (path.startsWith('/pending/') && /^\d+$/.test(id)) {
                switch (method) {
                    case 'PUT':
                        if (!(await isAdminAuthenticated(request, env))) {
                            return this.errorResponse('Unauthorized', 401);
                        }
                        return await this.approvePendingConfig(request, env, ctx, id);
                    case 'DELETE':
                        if (!(await isAdminAuthenticated(request, env))) {
                            return this.errorResponse('Unauthorized', 401);
                        }
                        return await this.rejectPendingConfig(request, env, ctx, id);
                    default:
                        return this.errorResponse('Method Not Allowed', 405)
                }
            }
            if (path === '/config/import' && method === 'POST') {
                if (!(await isAdminAuthenticated(request, env))) {
                    return this.errorResponse('Unauthorized', 401);
                }
                return await this.importConfig(request, env, ctx);
            }
            if (path === '/config/export' && method === 'GET') {
                if (!(await isAdminAuthenticated(request, env))) {
                    return this.errorResponse('Unauthorized', 401);
                }
                return await this.exportConfig(request, env, ctx);
            }
            if (path === '/config/batch-category' && method === 'PUT') {
                if (!(await isAdminAuthenticated(request, env))) {
                    return this.errorResponse('Unauthorized', 401);
                }
                return await this.batchUpdateCategory(request, env, ctx);
            }
            if (path === '/pending' && method === 'GET') {
              if (!(await isAdminAuthenticated(request, env))) {
                  return this.errorResponse('Unauthorized', 401);
              }
              return await this.getPendingConfig(request, env, ctx, url);
            }
            if (path === '/check-url' && method === 'GET') {
              if (!(await isAdminAuthenticated(request, env))) {
                  return this.errorResponse('Unauthorized', 401);
              }
              return await this.checkUrlExists(request, env, ctx, url);
            }
            if (path === '/cache/clear' && method === 'POST') {
              if (!(await isAdminAuthenticated(request, env))) {
                  return this.errorResponse('Unauthorized', 401);
              }
              return await this.clearCache(request, env, ctx);
            }
            return this.errorResponse('Not Found', 404);
        } catch (error) {
            return this.errorResponse(`Internal Server Error: ${error.message}`, 500);
        }
    },
      async getConfig(request, env, ctx, url) {
              const catalog = url.searchParams.get('catalog');
              const page = parseInt(url.searchParams.get('page') || '1', 10);
              const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
              const keyword = url.searchParams.get('keyword');
              const offset = (page - 1) * pageSize;

              // 【性能优化】Cache API 缓存 - 只缓存首页公开请求（不含认证的请求）
              // 后台管理需要实时数据，不使用缓存
              const cache = caches.default;
              let cacheKey = null;
              const isPublicRequest = !request.headers.get('Authorization') &&
                                       !request.headers.get('Cookie');
              let shouldUseCache = isPublicRequest && !keyword; // 公开请求且无搜索关键词时使用缓存

              if (shouldUseCache) {
                  const cacheUrl = new URL(request.url);
                  cacheKey = new Request(cacheUrl.toString(), request);
                  const cachedResponse = await cache.match(cacheKey);

                  if (cachedResponse) {
                      return cachedResponse;
                  }
              }

              try {
                  // 【书签隐藏功能】公开请求过滤隐藏书签
                  const hiddenFilter = isPublicRequest ? 'AND (hidden IS NULL OR hidden = 0)' : '';

                  // [优化] 排序逻辑：默认排序(9999)的书签按创建时间降序排在最前面，自定义排序的按sort_order升序
                  let query = `SELECT * FROM sites WHERE 1=1 ${hiddenFilter} ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime('%s', create_time) ELSE sort_order END ASC LIMIT ? OFFSET ?`;
                  let countQuery = `SELECT COUNT(*) as total FROM sites WHERE 1=1 ${hiddenFilter}`;
                  let queryBindParams = [pageSize, offset];
                  let countQueryParams = [];

                  if (catalog) {
                      query = `SELECT * FROM sites WHERE catelog = ? ${hiddenFilter} ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime('%s', create_time) ELSE sort_order END ASC LIMIT ? OFFSET ?`;
                      countQuery = `SELECT COUNT(*) as total FROM sites WHERE catelog = ? ${hiddenFilter}`
                      queryBindParams = [catalog, pageSize, offset];
                      countQueryParams = [catalog];
                  }

                  if (keyword) {
                      const likeKeyword = `%${keyword}%`;
                      // 检查是否是纯数字（ID 搜索）
                      const isIdSearch = /^\d+$/.test(keyword.trim());

                      if (isIdSearch) {
                          // ID 前缀匹配 + 名称/URL/分类模糊搜索
                          const idLikeKeyword = `${keyword.trim()}%`;  // ID 前缀匹配：2 → 2%
                          query = `SELECT * FROM sites WHERE (CAST(id AS TEXT) LIKE ? OR name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter} ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime('%s', create_time) ELSE sort_order END ASC LIMIT ? OFFSET ?`;
                          countQuery = `SELECT COUNT(*) as total FROM sites WHERE (CAST(id AS TEXT) LIKE ? OR name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter}`;
                          queryBindParams = [idLikeKeyword, likeKeyword, likeKeyword, likeKeyword, pageSize, offset];
                          countQueryParams = [idLikeKeyword, likeKeyword, likeKeyword, likeKeyword];

                          if (catalog) {
                              query = `SELECT * FROM sites WHERE catelog = ? AND (CAST(id AS TEXT) LIKE ? OR name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter} ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime('%s', create_time) ELSE sort_order END ASC LIMIT ? OFFSET ?`;
                              countQuery = `SELECT COUNT(*) as total FROM sites WHERE catelog = ? AND (CAST(id AS TEXT) LIKE ? OR name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter}`;
                              queryBindParams = [catalog, idLikeKeyword, likeKeyword, likeKeyword, likeKeyword, pageSize, offset];
                              countQueryParams = [catalog, idLikeKeyword, likeKeyword, likeKeyword, likeKeyword];
                          }
                      } else {
                          query = `SELECT * FROM sites WHERE (name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter} ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime('%s', create_time) ELSE sort_order END ASC LIMIT ? OFFSET ?`;
                          countQuery = `SELECT COUNT(*) as total FROM sites WHERE (name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter}`;
                          queryBindParams = [likeKeyword, likeKeyword, likeKeyword, pageSize, offset];
                          countQueryParams = [likeKeyword, likeKeyword, likeKeyword];

                          if (catalog) {
                              query = `SELECT * FROM sites WHERE catelog = ? AND (name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter} ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime('%s', create_time) ELSE sort_order END ASC LIMIT ? OFFSET ?`;
                              countQuery = `SELECT COUNT(*) as total FROM sites WHERE catelog = ? AND (name LIKE ? OR url LIKE ? OR catelog LIKE ?) ${hiddenFilter}`;
                              queryBindParams = [catalog, likeKeyword, likeKeyword, likeKeyword, pageSize, offset];
                              countQueryParams = [catalog, likeKeyword, likeKeyword, likeKeyword];
                          }
                      }
                  }
  
                  const { results } = await env.NAV_DB.prepare(query).bind(...queryBindParams).all();
                  const countResult = await env.NAV_DB.prepare(countQuery).bind(...countQueryParams).first();
                  const total = countResult ? countResult.total : 0;
  
                // 【修复】后台管理请求禁用浏览器缓存，公开请求可以缓存
                const cacheControl = shouldUseCache
                    ? 's-maxage=60' // 公开请求缓存 60 秒
                    : 'no-store, no-cache, must-revalidate'; // 后台请求禁用缓存

                const response = new Response(
                  JSON.stringify({
                      code: 200,
                      data: results,
                      total,
                      page,
                      pageSize
                  }),
                  { headers: {
                      'Content-Type': 'application/json',
                      'Cache-Control': cacheControl
                  } }
              );

              // 【性能优化】将响应存入缓存
              if (shouldUseCache && cacheKey) {
                  ctx.waitUntil(cache.put(cacheKey, response.clone()));
              }

              return response;
              
              } catch (e) {
                  return this.errorResponse(`Failed to fetch config data: ${e.message}`, 500)
              }
          },
      async getPendingConfig(request, env, ctx, url) {
            const page = parseInt(url.searchParams.get('page') || '1', 10);
            const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
            const offset = (page - 1) * pageSize;
            try {
                const { results } = await env.NAV_DB.prepare(`
                        SELECT * FROM pending_sites ORDER BY create_time DESC LIMIT ? OFFSET ?
                    `).bind(pageSize, offset).all();
                  const countResult = await env.NAV_DB.prepare(`
                      SELECT COUNT(*) as total FROM pending_sites
                      `).first();
                const total = countResult ? countResult.total : 0;
                  return new Response(
                      JSON.stringify({
                        code: 200,
                        data: results,
                          total,
                        page,
                        pageSize
                      }),
                      {headers: {'Content-Type': 'application/json'}}
                  );
            } catch (e) {
                return this.errorResponse(`Failed to fetch pending config data: ${e.message}`, 500);
            }
        },
        async checkUrlExists(request, env, ctx, url) {
            try {
                const checkUrl = url.searchParams.get('url');
                if (!checkUrl) {
                    return this.errorResponse('URL parameter is required', 400);
                }

                // 标准化 URL（去除末尾斜杠）
                const normalizedUrl = checkUrl.replace(/\/+$/, '');

                const { results } = await env.NAV_DB.prepare(
                    'SELECT id, name, url FROM sites WHERE url = ? OR url = ?'
                ).bind(normalizedUrl, normalizedUrl + '/').all();

                const site = results.length > 0 ? results[0] : null;
                return new Response(JSON.stringify({
                    code: 200,
                    exists: results.length > 0,
                    duplicateSite: site,
                    existingSite: site  // 兼容旧代码
                }), { headers: { 'Content-Type': 'application/json' } });
            } catch (e) {
                return this.errorResponse(`Failed to check URL: ${e.message}`, 500);
            }
        },
        // 清除 Cloudflare 边缘缓存
        async clearCache(request, env, ctx) {
            try {
                const cache = caches.default;
                const baseUrl = new URL(request.url);
                const clearedUrls = [];

                // 清除首页配置缓存
                const configUrl = new URL(baseUrl.origin + '/api/config');
                const configKey = new Request(configUrl.toString());
                await cache.delete(configKey);
                clearedUrls.push('/api/config');

                // 清除分类缓存
                const categoriesUrl = new URL(baseUrl.origin + '/api/categories');
                const categoriesKey = new Request(categoriesUrl.toString());
                await cache.delete(categoriesKey);
                clearedUrls.push('/api/categories');

                return new Response(JSON.stringify({
                    code: 200,
                    message: '缓存已清除',
                    clearedUrls
                }), { headers: { 'Content-Type': 'application/json' } });
            } catch (e) {
                return this.errorResponse(`清除缓存失败: ${e.message}`, 500);
            }
        },
        async approvePendingConfig(request, env, ctx, id) {
            try {
                // 获取 action 参数：force(强制添加), update(更新已有)
                const url = new URL(request.url);
                const action = url.searchParams.get('action');

                const { results } = await env.NAV_DB.prepare('SELECT * FROM pending_sites WHERE id = ?').bind(id).all();
                if(results.length === 0) {
                    return this.errorResponse('Pending config not found', 404);
                }
                const config = results[0];

                // 检查 URL 是否已存在
                const normalizedUrl = config.url.replace(/\/+$/, '');
                const { results: existingSites } = await env.NAV_DB.prepare(
                    'SELECT id, name FROM sites WHERE url = ? OR url = ?'
                ).bind(normalizedUrl, normalizedUrl + '/').all();

                // 如果存在且不是强制模式或更新模式，返回错误提示
                if (existingSites.length > 0 && !action) {
                    return new Response(JSON.stringify({
                        code: 409,
                        message: 'URL 已存在',
                        existingSite: existingSites[0]
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                // 【优化】自动获取 Yandex favicon（如果 logo 为空）
                let finalLogo = config.logo;
                if (!finalLogo && config.url) {
                    try {
                        const urlObj = new URL(config.url);
                        const domain = urlObj.hostname;
                        finalLogo = `https://favicon.yandex.net/favicon/v2/${domain}`;
                    } catch (e) {
                        finalLogo = null;
                    }
                }

                // 更新模式：更新已有书签
                if (action === 'update' && existingSites.length > 0) {
                    await env.NAV_DB.prepare(`
                        UPDATE sites SET name = ?, url = ?, logo = ?, desc = ?, catelog = ?
                        WHERE id = ?
                    `).bind(config.name, config.url, finalLogo, config.desc, config.catelog, existingSites[0].id).run();
                    await env.NAV_DB.prepare('DELETE FROM pending_sites WHERE id = ?').bind(id).run();
                    return new Response(JSON.stringify({
                        code: 200,
                        message: '书签更新成功',
                        action: 'updated',
                        updatedId: existingSites[0].id
                    }), { headers: { 'Content-Type': 'application/json' } });
                }

                // 默认或强制模式：新增书签
                // 使用默认值 9999，依靠 create_time DESC 排序让新书签排在前面
                const newSortOrder = 9999;

                await env.NAV_DB.prepare(`
                    INSERT INTO sites (name, url, logo, desc, catelog, sort_order)
                    VALUES (?, ?, ?, ?, ?, ?)
                `).bind(config.name, config.url, finalLogo, config.desc, config.catelog, newSortOrder).run();

                // [新增] 查询刚插入的书签ID
                const { results: newSite } = await env.NAV_DB.prepare(
                    'SELECT id FROM sites WHERE url = ? ORDER BY id DESC LIMIT 1'
                ).bind(config.url).all();
                const newSiteId = newSite.length > 0 ? newSite[0].id : null;

                await env.NAV_DB.prepare('DELETE FROM pending_sites WHERE id = ?').bind(id).run();

                return new Response(JSON.stringify({
                    code: 200,
                    message: 'Pending config approved successfully',
                    action: action || 'normal',
                    newSiteId: newSiteId  // [新增] 返回新书签ID
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }catch(e) {
                return this.errorResponse(`Failed to approve pending config : ${e.message}`, 500);
            }
        },
        async rejectPendingConfig(request, env, ctx, id) {
            try{
                await env.NAV_DB.prepare('DELETE FROM pending_sites WHERE id = ?').bind(id).run();
                return new Response(JSON.stringify({
                    code: 200,
                    message: 'Pending config rejected successfully',
                }), {headers: {'Content-Type': 'application/json'}});
            } catch(e) {
                return this.errorResponse(`Failed to reject pending config: ${e.message}`, 500);
            }
        },
       async submitConfig(request, env, ctx) {
          try{
              if (!isSubmissionEnabled(env)) {
                  return this.errorResponse('Public submission disabled', 403);
              }
              const config = await request.json();
              const { name, url, logo, desc, catelog } = config;
              const sanitizedName = (name || '').trim();
              const sanitizedUrl = (url || '').trim();
              const sanitizedCatelog = (catelog || '').trim();

              // 【优化】自动获取 Yandex favicon（国内可访问）
              let sanitizedLogo = (logo || '').trim();
              if (!sanitizedLogo && sanitizedUrl) {
                  try {
                      const urlObj = new URL(sanitizedUrl);
                      const domain = urlObj.hostname;
                      sanitizedLogo = `https://favicon.yandex.net/favicon/v2/${domain}`;
                  } catch (e) {
                      sanitizedLogo = null;
                  }
              }
              if (!sanitizedLogo) sanitizedLogo = null;

              const sanitizedDesc = (desc || '').trim() || null;
  
              if (!sanitizedName || !sanitizedUrl || !sanitizedCatelog ) {
                  return this.errorResponse('Name, URL and Catelog are required', 400);
              }
              await env.NAV_DB.prepare(`
                  INSERT INTO pending_sites (name, url, logo, desc, catelog)
                  VALUES (?, ?, ?, ?, ?)
            `).bind(sanitizedName, sanitizedUrl, sanitizedLogo, sanitizedDesc, sanitizedCatelog).run();
  
            return new Response(JSON.stringify({
              code: 201,
              message: 'Config submitted successfully, waiting for admin approve',
            }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            })
          } catch(e) {
              return this.errorResponse(`Failed to submit config : ${e.message}`, 500);
          }
      },
      
      
    async createConfig(request, env, ctx) {
          try{
              const config = await request.json();
              //- [新增] 从请求体中获取 sort_order
              const { name, url, logo, desc, catelog, sort_order } = config;
              const sanitizedName = (name || '').trim();
              const sanitizedUrl = (url || '').trim();
              const sanitizedCatelog = (catelog || '').trim();

              // 【优化】自动获取 Yandex favicon（国内可访问）
              let sanitizedLogo = (logo || '').trim();
              if (!sanitizedLogo && sanitizedUrl) {
                  try {
                      const urlObj = new URL(sanitizedUrl);
                      const domain = urlObj.hostname;
                      sanitizedLogo = `https://favicon.yandex.net/favicon/v2/${domain}`;
                  } catch (e) {
                      sanitizedLogo = null;
                  }
              }
              if (!sanitizedLogo) sanitizedLogo = null;

              const sanitizedDesc = (desc || '').trim() || null;
              const sortOrderValue = normalizeSortOrder(sort_order);

              if (!sanitizedName || !sanitizedUrl || !sanitizedCatelog ) {
                  return this.errorResponse('Name, URL and Catelog are required', 400);
              }
              //- [优化] INSERT 语句增加了 sort_order 字段
              const insert = await env.NAV_DB.prepare(`
                    INSERT INTO sites (name, url, logo, desc, catelog, sort_order)
                    VALUES (?, ?, ?, ?, ?, ?)
              `).bind(sanitizedName, sanitizedUrl, sanitizedLogo, sanitizedDesc, sanitizedCatelog, sortOrderValue).run(); // 如果sort_order未提供，则默认为9999

              // 【修复】创建后清除列表缓存
              const cache = caches.default;
              const cacheUrl = new URL(request.url);
              cacheUrl.pathname = '/api/config';
              // 注意：不能使用原始 request 作为缓存键，因为 body 已被读取
              const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
              ctx.waitUntil(cache.delete(cacheKey));

            return new Response(JSON.stringify({
              code: 201,
              message: 'Config created successfully',
              data: { id: insert.meta.last_row_id }
            }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            })
          } catch(e) {
              return this.errorResponse(`Failed to create config : ${e.message}`, 500);
          }
      },
  
  
		async updateConfig(request, env, ctx, id) {
          try {
              const config = await request.json();
              //- [新增] 从请求体中获取 sort_order 和 hidden
              const { name, url, logo, desc, catelog, sort_order, hidden } = config;
              const sanitizedName = (name || '').trim();
              const sanitizedUrl = (url || '').trim();
              const sanitizedCatelog = (catelog || '').trim();

              // 【优化】自动获取 Yandex favicon（国内可访问）
              let sanitizedLogo = (logo || '').trim();
              if (!sanitizedLogo && sanitizedUrl) {
                  try {
                      const urlObj = new URL(sanitizedUrl);
                      const domain = urlObj.hostname;
                      sanitizedLogo = `https://favicon.yandex.net/favicon/v2/${domain}`;
                  } catch (e) {
                      sanitizedLogo = null;
                  }
              }
              if (!sanitizedLogo) sanitizedLogo = null;

              const sanitizedDesc = (desc || '').trim() || null;
              const sortOrderValue = normalizeSortOrder(sort_order);
              // 【书签隐藏功能】hidden 字段，默认 false
              const hiddenValue = hidden === true || hidden === 1 ? 1 : 0;

            if (!sanitizedName || !sanitizedUrl || !sanitizedCatelog) {
              return this.errorResponse('Name, URL and Catelog are required', 400);
            }
            //- [优化] UPDATE 语句增加了 sort_order 和 hidden 字段
            const update = await env.NAV_DB.prepare(`
                UPDATE sites
                SET name = ?, url = ?, logo = ?, desc = ?, catelog = ?, sort_order = ?, hidden = ?, update_time = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(sanitizedName, sanitizedUrl, sanitizedLogo, sanitizedDesc, sanitizedCatelog, sortOrderValue, hiddenValue, id).run();

            // 【修复】更新后清除列表缓存
            const cache = caches.default;
            const cacheUrl = new URL(request.url);
            cacheUrl.pathname = '/api/config';
            // 使用 GET 请求作为缓存键，避免 ReadableStream 被重复读取
            const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
            ctx.waitUntil(cache.delete(cacheKey));

            return new Response(JSON.stringify({
                code: 200,
                message: 'Config updated successfully',
                update
            }), { headers: { 'Content-Type': 'application/json' }});
          } catch (e) {
              return this.errorResponse(`Failed to update config: ${e.message}`, 500);
          }
      },
  
      async deleteConfig(request, env, ctx, id) {
          try{
              const del = await env.NAV_DB.prepare('DELETE FROM sites WHERE id = ?').bind(id).run();

              // 【修复】删除后清除列表缓存
              const cache = caches.default;
              // 清除所有 /api/config 相关的缓存
              const cacheUrl = new URL(request.url);
              cacheUrl.pathname = '/api/config';
              const cacheKey = new Request(cacheUrl.toString(), request);
              ctx.waitUntil(cache.delete(cacheKey));

              return new Response(JSON.stringify({
                  code: 200,
                  message: 'Config deleted successfully',
                  del
              }), {headers: {'Content-Type': 'application/json'}});
          } catch(e) {
            return this.errorResponse(`Failed to delete config: ${e.message}`, 500);
          }
      },

      // 【书签隐藏功能】切换书签隐藏状态
      async toggleHidden(request, env, ctx, id) {
          try {
              // 先获取当前状态
              const current = await env.NAV_DB.prepare(
                  'SELECT hidden FROM sites WHERE id = ?'
              ).bind(id).first();

              if (!current) {
                  return this.errorResponse('书签不存在', 404);
              }

              // 切换状态（如果 hidden 是 1 或 true，则设为 0，否则设为 1）
              const newHidden = (current.hidden === 1 || current.hidden === true) ? 0 : 1;

              await env.NAV_DB.prepare(
                  'UPDATE sites SET hidden = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?'
              ).bind(newHidden, id).run();

              // 清除缓存
              const cache = caches.default;
              const cacheUrl = new URL(request.url);
              cacheUrl.pathname = '/api/config';
              const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
              ctx.waitUntil(cache.delete(cacheKey));

              return new Response(JSON.stringify({
                  code: 200,
                  message: newHidden === 1 ? '书签已隐藏' : '书签已显示',
                  hidden: newHidden === 1
              }), { headers: { 'Content-Type': 'application/json' }});
          } catch(e) {
              return this.errorResponse(`切换隐藏状态失败: ${e.message}`, 500);
          }
      },

      async batchUpdateCategory(request, env, ctx) {
          try {
              const { ids, category } = await request.json();
              if (!ids || !Array.isArray(ids) || ids.length === 0) {
                  return this.errorResponse('无效的ID列表', 400);
              }
              if (!category || category.trim() === '') {
                  return this.errorResponse('分类名称不能为空', 400);
              }

              const placeholders = ids.map(() => '?').join(',');
              const stmt = env.NAV_DB.prepare(
                  `UPDATE sites SET catelog = ? WHERE id IN (${placeholders})`
              ).bind(category.trim(), ...ids);

              const result = await stmt.run();

              // 【修复】批量修改分类后清除列表缓存
              const cache = caches.default;
              const cacheUrl = new URL(request.url);
              cacheUrl.pathname = '/api/config';
              const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
              ctx.waitUntil(cache.delete(cacheKey));

              return new Response(JSON.stringify({
                  code: 200,
                  message: `成功修改 ${ids.length} 个书签的分类`,
                  result
              }), {headers: {'Content-Type': 'application/json'}});
          } catch(e) {
              return this.errorResponse(`批量修改分类失败: ${e.message}`, 500);
          }
      },

      async importConfig(request, env, ctx) {
        try {
          // 使用 clone 避免 "ReadableStream is disturbed" 错误
          const jsonData = await request.clone().json();
          let sitesToImport = [];

          // [优化] 智能判断导入的JSON文件格式
          // 1. 如果 jsonData 本身就是数组 (新的、正确的导出格式)
          if (Array.isArray(jsonData)) {
            sitesToImport = jsonData;
          }
          // 2. 如果 jsonData 是一个对象，且包含一个名为 'data' 的数组 (兼容旧的导出格式)
          else if (jsonData && typeof jsonData === 'object' && Array.isArray(jsonData.data)) {
            sitesToImport = jsonData.data;
          }
          // 3. 如果两种都不是，则格式无效
          else {
            return this.errorResponse('Invalid JSON data. Must be an array of site configurations, or an object with a "data" key containing the array.', 400);
          }

          if (sitesToImport.length === 0) {
            return new Response(JSON.stringify({
              code: 201,
              message: '导入成功，但文件中没有找到数据。'
            }), { headers: {'Content-Type': 'application/json'} });
          }

          // [新增] 查询数据库中已存在的URL，用于去重
          const { results: existingSites } = await env.NAV_DB.prepare('SELECT url, name FROM sites').all();
          const existingUrlSet = new Set(existingSites.map(site => site.url.trim().toLowerCase()));

          // [新增] 过滤重复书签，记录跳过的书签信息
          const skippedBookmarks = [];
          const uniqueSitesToImport = [];

          sitesToImport.forEach(item => {
            const url = (item.url || '').trim().toLowerCase();
            if (url && existingUrlSet.has(url)) {
              skippedBookmarks.push({
                name: item.name || '未命名',
                url: item.url || ''
              });
            } else {
              uniqueSitesToImport.push(item);
            }
          });

          // [新增] 如果没有新书签需要导入
          if (uniqueSitesToImport.length === 0) {
            return new Response(JSON.stringify({
              code: 201,
              message: `导入完成：全部 ${sitesToImport.length} 个书签已存在，已跳过。`,
              skipped: skippedBookmarks,
              addedCount: 0,
              skippedCount: sitesToImport.length
            }), { headers: {'Content-Type': 'application/json'} });
          }

          const insertStatements = uniqueSitesToImport.map(item => {
                const sanitizedName = (item.name || '').trim() || null;
                const sanitizedUrl = (item.url || '').trim() || null;
                const sanitizedLogo = (item.logo || '').trim() || null;
                const sanitizedDesc = (item.desc || '').trim() || null;
                const sanitizedCatelog = (item.catelog || '').trim() || null;
                const sortOrderValue = normalizeSortOrder(item.sort_order);
                return env.NAV_DB.prepare(`
                        INSERT INTO sites (name, url, logo, desc, catelog, sort_order)
                        VALUES (?, ?, ?, ?, ?, ?)
                  `).bind(sanitizedName, sanitizedUrl, sanitizedLogo, sanitizedDesc, sanitizedCatelog, sortOrderValue);
            })

          // 使用 D1 的 batch 操作，效率更高
          await env.NAV_DB.batch(insertStatements);

          // [新增] 查询刚插入的书签ID（根据URL查询）
          const importedUrls = uniqueSitesToImport.map(item => (item.url || '').trim().toLowerCase());
          const placeholders = importedUrls.map(() => '?').join(',');
          const { results: newSites } = await env.NAV_DB.prepare(
            `SELECT id FROM sites WHERE LOWER(url) IN (${placeholders})`
          ).bind(...importedUrls).all();
          const addedIds = newSites.map(site => site.id);

          // 【修复】导入后清除列表缓存（仅在非本地环境）
          if (typeof caches !== 'undefined' && caches.default) {
            const cacheUrl = new URL(request.url);
            cacheUrl.pathname = '/api/config';
            const cacheKey = new Request(cacheUrl.toString(), request);
            ctx.waitUntil(caches.default.delete(cacheKey));
          }

          // [新增] 构建详细的返回信息
          let message = `导入成功：新增 ${uniqueSitesToImport.length} 个书签`;
          if (skippedBookmarks.length > 0) {
            message += `，跳过 ${skippedBookmarks.length} 个重复书签`;
          }

          return new Response(JSON.stringify({
              code: 201,
              message: message,
              addedCount: uniqueSitesToImport.length,
              skippedCount: skippedBookmarks.length,
              skipped: skippedBookmarks,
              addedIds: addedIds  // [新增] 返回新增书签的ID列表
          }), {
              status: 201,
              headers: {'Content-Type': 'application/json'}
          });
        } catch (error) {
          return this.errorResponse(`Failed to import config : ${error.message} | Stack: ${error.stack?.split('\n')?.[0] || 'no stack'}`, 500);
        }
      },
  
async exportConfig(request, env, ctx) {
        try{
          // [优化] 导出的数据将不再被包裹在 {code, data} 对象中
          const { results } = await env.NAV_DB.prepare('SELECT * FROM sites ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime(\'%s\', create_time) ELSE sort_order END ASC').all();
          
          // JSON.stringify 的第二和第三个参数用于“美化”输出的JSON，
          // null 表示不替换任何值，2 表示使用2个空格进行缩进。
          // 这使得导出的文件非常易于阅读和手动编辑。
          const pureJsonData = JSON.stringify(results, null, 2); 

          return new Response(pureJsonData, {
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                // 确保浏览器将其作为文件下载
                'Content-Disposition': 'attachment; filename="config.json"'
              }
          });
        } catch(e) {
          return this.errorResponse(`Failed to export config: ${e.message}`, 500)
        }
      },
      async getCategories(request, env, ctx) {
          try {
              const categoryOrderMap = new Map();
              try {
                  const { results: orderRows } = await env.NAV_DB.prepare('SELECT catelog, sort_order FROM category_orders').all();
                  orderRows.forEach(row => {
                      categoryOrderMap.set(row.catelog, normalizeSortOrder(row.sort_order));
                  });
              } catch (error) {
                  if (!/no such table/i.test(error.message || '')) {
                      throw error;
                  }
              }

              const { results } = await env.NAV_DB.prepare(`
                SELECT catelog, COUNT(*) AS site_count, MIN(sort_order) AS min_site_sort
                FROM sites
                GROUP BY catelog
              `).all();

              const data = results.map(row => ({
                  catelog: row.catelog,
                  site_count: row.site_count,
                  sort_order: categoryOrderMap.has(row.catelog)
                    ? categoryOrderMap.get(row.catelog)
                    : normalizeSortOrder(row.min_site_sort),
                  explicit: categoryOrderMap.has(row.catelog),
                  min_site_sort: row.min_site_sort === null ? 9999 : normalizeSortOrder(row.min_site_sort)
              }));

              data.sort((a, b) => {
                  if (a.sort_order !== b.sort_order) {
                      return a.sort_order - b.sort_order;
                  }
                  if (a.min_site_sort !== b.min_site_sort) {
                      return a.min_site_sort - b.min_site_sort;
                  }
                  return a.catelog.localeCompare(b.catelog, 'zh-Hans-CN', { sensitivity: 'base' });
              });

              return new Response(JSON.stringify({
                  code: 200,
                  data
              }), { headers: { 'Content-Type': 'application/json' } });
          } catch (e) {
              return this.errorResponse(`Failed to fetch categories: ${e.message}`, 500);
          }
      },
      async updateCategoryOrder(request, env, ctx, categoryName) {
          try {
              const body = await request.json();
              if (!categoryName) {
                  return this.errorResponse('Category name is required', 400);
              }

              const normalizedCategory = categoryName.trim();
              if (!normalizedCategory) {
                  return this.errorResponse('Category name is required', 400);
              }

              if (body && body.reset) {
                  await env.NAV_DB.prepare('DELETE FROM category_orders WHERE catelog = ?')
                      .bind(normalizedCategory)
                      .run();
                  return new Response(JSON.stringify({
                      code: 200,
                      message: 'Category order reset successfully'
                  }), { headers: { 'Content-Type': 'application/json' } });
              }

              const sortOrderValue = normalizeSortOrder(body ? body.sort_order : undefined);
              await env.NAV_DB.prepare(`
                INSERT INTO category_orders (catelog, sort_order)
                VALUES (?, ?)
                ON CONFLICT(catelog) DO UPDATE SET sort_order = excluded.sort_order
              `).bind(normalizedCategory, sortOrderValue).run();

              return new Response(JSON.stringify({
                  code: 200,
                  message: 'Category order updated successfully'
              }), { headers: { 'Content-Type': 'application/json' } });
          } catch (e) {
              return this.errorResponse(`Failed to update category order: ${e.message}`, 500);
          }
      },

      async deleteCategorySites(request, env, ctx, categoryName) {
          try {
              if (!categoryName) {
                  return this.errorResponse('Category name is required', 400);
              }

              const normalizedCategory = categoryName.trim();
              if (!normalizedCategory) {
                  return this.errorResponse('Category name is required', 400);
              }

              // 先查询该分类下的书签数量
              const { results: countResult } = await env.NAV_DB.prepare(
                  'SELECT COUNT(*) as count FROM sites WHERE catelog = ?'
              ).bind(normalizedCategory).all();
              const deletedCount = countResult[0]?.count || 0;

              // 删除该分类下的所有书签
              await env.NAV_DB.prepare(
                  'DELETE FROM sites WHERE catelog = ?'
              ).bind(normalizedCategory).run();

              // 删除该分类的排序记录
              await env.NAV_DB.prepare(
                  'DELETE FROM category_orders WHERE catelog = ?'
              ).bind(normalizedCategory).run();

              return new Response(JSON.stringify({
                  code: 200,
                  message: 'Category sites deleted successfully',
                  deleted: deletedCount
              }), { headers: { 'Content-Type': 'application/json' } });
          } catch (e) {
              return this.errorResponse(`Failed to delete category sites: ${e.message}`, 500);
          }
      },

      // 重命名分类
      async renameCategory(request, env, ctx, oldName) {
          try {
              if (!oldName) {
                  return this.errorResponse('Category name is required', 400);
              }

              const body = await request.json();
              const newName = (body.new_name || '').trim();

              if (!newName) {
                  return this.errorResponse('New category name is required', 400);
              }

              const normalizedOldName = oldName.trim();
              if (normalizedOldName === newName) {
                  return this.errorResponse('New name is the same as old name', 400);
              }

              // 检查新名称是否已存在
              const { results: existing } = await env.NAV_DB.prepare(
                  'SELECT catelog FROM sites WHERE catelog = ? LIMIT 1'
              ).bind(newName).all();

              if (existing.length > 0) {
                  return this.errorResponse('Category name already exists', 400);
              }

              // 更新 sites 表中的分类名
              await env.NAV_DB.prepare(
                  'UPDATE sites SET catelog = ? WHERE catelog = ?'
              ).bind(newName, normalizedOldName).run();

              // 更新 category_orders 表中的记录
              await env.NAV_DB.prepare(
                  'UPDATE category_orders SET catelog = ? WHERE catelog = ?'
              ).bind(newName, normalizedOldName).run();

              return new Response(JSON.stringify({
                  code: 200,
                  message: 'Category renamed successfully'
              }), { headers: { 'Content-Type': 'application/json' } });
          } catch (e) {
              return this.errorResponse(`Failed to rename category: ${e.message}`, 500);
          }
      },

      // 批量删除分类
      async batchDeleteCategories(request, env, ctx) {
          try {
              const body = await request.json();
              const categories = body.categories || [];

              if (!Array.isArray(categories) || categories.length === 0) {
                  return this.errorResponse('Categories array is required', 400);
              }

              let totalDeleted = 0;

              for (const category of categories) {
                  const normalizedCategory = category.trim();
                  if (!normalizedCategory) continue;

                  // 统计书签数量
                  const { results: countResult } = await env.NAV_DB.prepare(
                      'SELECT COUNT(*) as count FROM sites WHERE catelog = ?'
                  ).bind(normalizedCategory).all();
                  totalDeleted += countResult[0]?.count || 0;

                  // 删除书签
                  await env.NAV_DB.prepare(
                      'DELETE FROM sites WHERE catelog = ?'
                  ).bind(normalizedCategory).run();

                  // 删除排序记录
                  await env.NAV_DB.prepare(
                      'DELETE FROM category_orders WHERE catelog = ?'
                  ).bind(normalizedCategory).run();
              }

              return new Response(JSON.stringify({
                  code: 200,
                  message: 'Categories deleted successfully',
                  deleted: totalDeleted
              }), { headers: { 'Content-Type': 'application/json' } });
          } catch (e) {
              return this.errorResponse(`Failed to batch delete categories: ${e.message}`, 500);
          }
      },

       errorResponse(message, status) {
          return new Response(JSON.stringify({code: status, message: message}), {
              status: status,
              headers: { 'Content-Type': 'application/json' },
          });
      }
    };
  
  
  /**
   * 处理后台管理页面请求
   */
  const admin = {
  async handleRequest(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/admin/logout') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      const { token } = await validateAdminSession(request, env);
      if (token) {
        await destroyAdminSession(env, token);
      }
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/admin',
          'Set-Cookie': buildSessionCookie('', { maxAge: 0 }),
        },
      });
    }

    if (url.pathname === '/admin') {
      if (request.method === 'POST') {
        const formData = await request.formData();
        const name = (formData.get('name') || '').trim();
        const password = (formData.get('password') || '').trim();

        const storedUsername = await env.NAV_AUTH.get('admin_username');
        const storedPassword = await env.NAV_AUTH.get('admin_password');

        const isValid =
          storedUsername &&
          storedPassword &&
          name === storedUsername &&
          password === storedPassword;

        if (isValid) {
          const token = await createAdminSession(env);
          return new Response(null, {
            status: 302,
            headers: {
              Location: '/admin',
              'Set-Cookie': buildSessionCookie(token),
            },
          });
        }

        return this.renderLoginPage('账号或密码错误，请重试。');
      }

      const session = await validateAdminSession(request, env);
      if (session.authenticated) {
        return this.renderAdminPage();
      }

      return this.renderLoginPage();
    }
    
    if (url.pathname.startsWith('/static')) {
      return this.handleStatic(request, env, ctx);
    }
    
    return new Response('页面不存在', {status: 404});
  },
     async handleStatic(request, env, ctx) {
        const url = new URL(request.url);
        const filePath = url.pathname.replace('/static/', '');
  
        let contentType = 'text/plain';
        if (filePath.endsWith('.css')) {
           contentType = 'text/css';
        } else if (filePath.endsWith('.js')) {
           contentType = 'application/javascript';
        }
  
        try {
            const fileContent = await this.getFileContent(filePath)
            return new Response(fileContent, {
              headers: { 'Content-Type': contentType }
            });
        } catch (e) {
           return new Response('Not Found', {status: 404});
        }
  
      },
    async getFileContent(filePath) {
        const fileContents = {
           'admin.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>书签管理后台</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236c8fba'/%3E%3Cstop offset='100%25' stop-color='%23305580'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23f59e0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='2' y='2' width='28' height='28' rx='6' fill='url(%23a)'/%3E%3Cpath d='M8 20 L8 14 Q8 11 11 11 L21 11 Q24 11 24 14 L24 20' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='3' fill='url(%23b)'/%3E%3Cg stroke='%23fbbf24' stroke-width='1.5' stroke-linecap='round' opacity='0.9'%3E%3Cline x1='16' y1='9' x2='16' y2='6'/%3E%3Cline x1='11' y1='10.5' x2='9' y2='8.5'/%3E%3Cline x1='21' y1='10.5' x2='23' y2='8.5'/%3E%3C/g%3E%3Ccircle cx='12' cy='8' r='1' fill='%23fcd34d' opacity='0.7'/%3E%3Ccircle cx='20' cy='9' r='0.8' fill='%23fcd34d' opacity='0.5'/%3E%3C/svg%3E" type="image/svg+xml"/>
  <link rel="stylesheet" href="/static/admin.css">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- 顶部导航栏 -->
  <nav class="top-navbar">
    <div class="navbar-left">
      <button class="sidebar-toggle" id="sidebarToggle" aria-label="切换菜单">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
      <a href="/" class="navbar-brand" title="回到首页">
        <svg class="brand-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="brand-text">书签管理</span>
      </a>
    </div>
    <div class="navbar-center">
      <div class="global-search">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" id="globalSearch" placeholder="搜索书签...">
        <button class="search-clear" id="searchClear" type="button" aria-label="清空搜索" style="display:none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <span class="search-count" id="searchCount">找到 0 条</span>
      </div>
    </div>
    <div class="navbar-right">
      <a href="/" class="nav-btn" title="回到首页">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        <span class="btn-text">回到首页</span>
      </a>
      <button type="button" class="nav-btn refresh-btn" id="forceRefreshBtn" title="强制刷新（清除缓存）">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        <span class="btn-text">刷新</span>
      </button>
      <form method="post" action="/admin/logout" class="logout-form">
        <button type="submit" class="nav-btn logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span class="btn-text">退出</span>
        </button>
      </form>
    </div>
  </nav>

  <!-- 侧边栏遮罩 -->
  <div class="sidebar-overlay" id="sidebarOverlay"></div>

  <!-- 侧边栏 -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="user-info">
        <div class="user-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="user-details">
          <span class="user-name">管理员</span>
          <span class="user-role">已登录</span>
        </div>
      </div>
      <button class="sidebar-close" id="sidebarClose" aria-label="关闭菜单">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <span class="nav-section-title">导航菜单</span>
        <ul class="nav-list">
          <li class="nav-item active" data-page="bookmarks">
            <a href="#bookmarks">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span>书签列表</span>
              <span class="nav-badge nav-badge-info" id="bookmarksBadge">0</span>
            </a>
          </li>
          <li class="nav-item" data-page="pending">
            <a href="#pending">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>待审核</span>
              <span class="nav-badge nav-badge-pending" id="pendingBadge" style="display:none;">0</span>
            </a>
          </li>
          <li class="nav-item" data-page="categories">
            <a href="#categories">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M3 12h18M3 18h18"/>
                <circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="6" cy="12" r="2" fill="currentColor"/><circle cx="6" cy="18" r="2" fill="currentColor"/>
              </svg>
              <span>分类排序</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <span class="nav-section-title">数据管理</span>
        <ul class="nav-list">
          <li class="nav-item" data-action="import">
            <a href="#" id="sidebarImport">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>导入数据</span>
            </a>
          </li>
          <li class="nav-item" data-action="export">
            <a href="#" id="sidebarExport">
              <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>导出数据</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="sidebar-footer">
      <a href="https://github.com/Ekko7778/my-nav" target="_blank" rel="noopener noreferrer" title="GitHub 仓库">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white" alt="GitHub" class="version-badge" style="cursor:pointer; margin-top: -1px;" />
      </a>
      <img src="https://img.shields.io/badge/v1.0.39-blue?style=flat" alt="v1.0.39" class="version-badge" />
    </div>
  </aside>

  <!-- 主内容区 -->
  <main class="main-content">
    <!-- 书签列表页 -->
    <section class="content-page active" id="page-bookmarks">
      <div class="page-header">
        <h1 class="page-title">书签列表</h1>
        <div class="page-actions">
          <select id="categoryFilter" class="category-filter-select">
            <option value="">全部分类</option>
          </select>
          <button class="btn btn-primary" id="showAddForm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            添加书签
          </button>
        </div>
      </div>

      <!-- 添加书签卡片 -->
      <div class="add-form-card collapsed" id="addFormCard">
        <div class="card-header" id="addFormToggle">
          <span>添加新书签</span>
          <svg class="collapse-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </div>
        <div class="card-body">
          <div class="add-new">
            <input type="text" id="addName" placeholder="名称 *" required>
            <input type="text" id="addUrl" placeholder="URL *" required>
            <div class="category-input-wrapper">
              <input type="text" id="addCatelog" placeholder="分类 *" required autocomplete="off">
              <span id="addCategoryDropdownBtn" class="dropdown-arrow" title="选择分类">▼</span>
              <div id="addCategoryDropdown" class="category-dropdown"></div>
            </div>
            <input type="number" id="addSortOrder" placeholder="排序 (数字小靠前)">
            <input type="text" id="addLogo" placeholder="Logo (可选)">
            <input type="text" id="addDesc" placeholder="描述 (可选)">
            <button id="addBtn">添加</button>
          </div>
        </div>
      </div>

      <!-- 表格卡片 -->
      <div class="table-card">
        <!-- 批量操作工具栏 -->
        <div class="batch-actions" id="batchActions">
          <span class="batch-count">已选择 <strong id="selectedCount">0</strong> 项</span>
          <button class="btn btn-secondary" id="batchCancelBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            取消
          </button>
          <button class="btn btn-danger" id="batchDeleteBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
            </svg>
            批量删除
          </button>
          <button class="btn btn-primary" id="batchCategoryBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22,19a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V5A2,2,0,0,1,4,3H9l2,3h9a2,2,0,0,1,2,2z"/>
            </svg>
            批量修改分类
          </button>
          <button class="btn btn-secondary" id="batchFetchIconBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
            </svg>
            批量获取图标
          </button>
        </div>
        <div class="table-wrapper">
          <table id="configTable">
            <thead>
              <tr>
                <th><input type="checkbox" id="selectAll" title="全选"></th>
                <th>ID</th>
                <th>名称</th>
                <th>网址</th>
                <th>图标</th>
                <th>描述</th>
                <th>分类</th>
                <th>排序</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="configTableBody"></tbody>
          </table>
        </div>
        <div class="pagination" id="bookmarksPagination">
          <select id="pageSizeSelect">
            <option value="10" selected>10 条/页</option>
            <option value="20">20 条/页</option>
            <option value="50">50 条/页</option>
            <option value="100">100 条/页</option>
          </select>
          <button id="prevPage" disabled>上一页</button>
          <span id="currentPage">1</span>/<span id="totalPages">1</span>
          <button id="nextPage" disabled>下一页</button>
        </div>
      </div>
    </section>

    <!-- 待审核页 -->
    <section class="content-page" id="page-pending">
      <div class="page-header">
        <h1 class="page-title">待审核列表</h1>
      </div>
      <div class="table-card">
        <!-- 批量操作工具栏 -->
        <div class="batch-actions" id="pendingBatchActions">
          <span class="batch-count">已选择 <strong id="pendingSelectedCount">0</strong> 项</span>
          <button class="btn btn-secondary" id="pendingBatchCancelBtn">取消选择</button>
          <button class="btn btn-primary" id="pendingBatchApproveBtn">批量批准</button>
          <button class="btn btn-danger" id="pendingBatchRejectBtn">批量拒绝</button>
        </div>
        <div class="table-wrapper">
          <table id="pendingTable">
            <thead>
              <tr>
                <th><input type="checkbox" id="pendingSelectAll"></th>
                <th>ID</th>
                <th>名称</th>
                <th>网址</th>
                <th>图标</th>
                <th>描述</th>
                <th>分类</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="pendingTableBody"></tbody>
          </table>
        </div>
        <div class="pagination" id="pendingPagination">
          <button id="pendingPrevPage" disabled>上一页</button>
          <span id="pendingCurrentPage">1</span>/<span id="pendingTotalPages">1</span>
          <button id="pendingNextPage" disabled>下一页</button>
        </div>
      </div>
    </section>

    <!-- 分类排序页 -->
    <section class="content-page" id="page-categories">
      <div class="page-header">
        <h1 class="page-title">分类排序</h1>
      </div>
      <p class="category-hint">拖拽分类行调整顺序，移到哪行就排到哪个位置。</p>
      <div class="table-card">
        <!-- 批量操作栏 -->
        <div class="batch-actions" id="categoryBatchActions">
          <span class="batch-count">已选择 <strong id="categorySelectedCount">0</strong> 项</span>
          <button id="categoryCancelSelect" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            取消
          </button>
          <button id="categoryBatchDelete" class="btn btn-danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
            </svg>
            批量删除
          </button>
        </div>
        <div class="table-wrapper">
          <table id="categoryTable">
            <thead>
              <tr>
                <th class="checkbox-col">
                  <input type="checkbox" id="categorySelectAll" class="category-checkbox">
                </th>
                <th>排序</th>
                <th>分类</th>
                <th>书签数量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="categoryTableBody">
              <tr><td colspan="5">加载中...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>


  <!-- 拖拽位置提示 -->
  <div class="drag-hint" id="dragHint"></div>

  <!-- 拖拽导入模态框 -->
  <div class="modal" id="importModal">
    <div class="modal-content import-modal-content">
      <span class="modal-close" id="importModalClose">×</span>
      <h2>导入书签</h2>
      <div class="import-drop-zone" id="importDropZone">
        <div class="import-drop-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <p class="import-drop-text">拖拽 JSON 文件到这里</p>
        <p class="import-drop-hint">或点击选择文件</p>
        <input type="file" id="importFileModal" accept=".json" style="position:absolute;opacity:0;width:0;height:0;">
      </div>
      <div class="import-file-info" id="importFileInfo" style="display:none;">
        <span class="import-file-name" id="importFileName"></span>
        <button type="button" class="import-file-remove" id="importFileRemove">×</button>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn-cancel" id="importModalCancel">取消</button>
        <button type="button" class="btn-primary" id="importModalConfirm" disabled>导入</button>
      </div>
    </div>
  </div>

  <!-- 编辑模态框 -->
  <div class="modal" id="editModal">
    <div class="modal-content">
      <span class="modal-close">×</span>
      <h2>编辑站点</h2>
      <form id="editForm">
        <input type="hidden" id="editId">
        <label for="editName">名称:</label>
        <input type="text" id="editName" required placeholder="网站显示名称"><br>
        <label for="editUrl">URL:</label>
        <input type="text" id="editUrl" required placeholder="https://example.com"><br>
        <label for="editLogo">Logo(可选):</label>
        <input type="text" id="editLogo" placeholder="图标URL或留空自动获取"><br>
        <label for="editDesc">描述(可选):</label>
        <textarea id="editDesc" rows="2" placeholder="简短描述网站内容"></textarea><br>
        <label for="editCatelog">分类:</label>
        <div class="category-input-wrapper">
          <input type="text" id="editCatelog" required placeholder="输入或选择分类" autocomplete="off">
          <span id="categoryDropdownBtn" class="dropdown-arrow" title="选择分类">▼</span>
          <div id="categoryDropdown" class="category-dropdown"></div>
        </div><br>
        <label for="editSortOrder">排序:</label>
        <input type="number" id="editSortOrder" placeholder="数字越小越靠前"><br>
        <button type="submit">保存</button>
      </form>
    </div>
  </div>

  <!-- 批量修改分类模态框 -->
  <div class="modal" id="batchCategoryModal">
    <div class="modal-content">
      <span class="modal-close" id="batchCategoryClose">×</span>
      <h2>批量修改分类</h2>
      <p class="modal-desc">将为选中的 <strong id="batchCategoryCount">0</strong> 个书签修改分类</p>
      <form id="batchCategoryForm">
        <label for="batchCategoryInput">选择或输入新分类:</label>
        <div class="category-input-wrapper">
          <input type="text" id="batchCategoryInput" required placeholder="输入或选择分类" autocomplete="off">
          <span id="batchCategoryDropdownBtn" class="dropdown-arrow" title="选择分类">▼</span>
          <div id="batchCategoryDropdown" class="category-dropdown"></div>
        </div><br>
        <div class="modal-actions">
          <button type="button" id="batchCategoryCancel" class="btn-cancel">取消</button>
          <button type="submit" class="btn-primary">确认修改</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 分类编辑模态框 -->
  <div class="modal" id="categoryEditModal">
    <div class="modal-content">
      <span class="modal-close" id="categoryEditClose">×</span>
      <h2>编辑分类</h2>
      <form id="categoryEditForm">
        <input type="hidden" id="categoryEditOldName">
        <label for="categoryEditName">分类名称:</label>
        <input type="text" id="categoryEditName" required placeholder="输入新分类名称"><br>
        <div class="modal-actions">
          <button type="button" id="categoryEditCancel" class="btn-cancel">取消</button>
          <button type="submit" class="btn-primary">保存</button>
        </div>
      </form>
    </div>
  </div>

  <script src="/static/admin.js"></script>
</body>
</html>`,
            'admin.css': `/* ========== CSS 变量系统 ========== */
:root {
  --primary-50: #e8f4fc;
  --primary-100: #c5e3f6;
  --primary-500: #3390ec;
  --primary-600: #2b7fd4;
  --primary-700: #236eb8;
  --gray-50: #f8f9fa;
  --gray-100: #f1f3f5;
  --gray-200: #e9ecef;
  --gray-300: #dee2e6;
  --gray-400: #ced4da;
  --gray-500: #adb5bd;
  --gray-600: #6c757d;
  --gray-700: #495057;
  --gray-800: #343a40;
  --gray-900: #212529;
  --success: #28a745;
  --warning: #ffc107;
  --error: #dc3545;
  --info: #17a2b8;
  --sidebar-width: 256px;
  --sidebar-collapsed: 64px;
  --navbar-height: 60px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
}

/* ========== 基础重置 ========== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; overflow: hidden; }
body {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--gray-100);
  color: var(--gray-800);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ========== 顶部导航栏 ========== */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
  z-index: 1000;
  box-shadow: var(--shadow-md);
}
.navbar-left { display: flex; align-items: center; gap: var(--spacing-md); }
.sidebar-toggle {
  display: none;
  background: transparent;
  border: none;
  color: white;
  padding: var(--spacing-sm);
  cursor: pointer;
  border-radius: var(--radius-md);
}
.sidebar-toggle:hover { background: rgba(255,255,255,0.1); }
.navbar-brand { display: flex; align-items: center; gap: var(--spacing-sm); text-decoration: none; color: white; }
.navbar-brand:hover { opacity: 0.9; }
.brand-icon { width: 28px; height: 28px; }
.brand-text { font-size: 1.2rem; font-weight: 600; }
.navbar-center { flex: 1; max-width: 400px; margin: 0 var(--spacing-lg); }
.global-search { position: relative; width: 100%; }
.global-search input {
  width: 100%;
  height: 38px;
  padding: 0 var(--spacing-md) 0 36px;
  border: none;
  border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 0.9rem;
}
.global-search input::placeholder { color: rgba(255,255,255,0.7); }
.global-search input:focus { outline: none; background: rgba(255,255,255,0.25); }
.global-search .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  opacity: 0.7;
}
.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: all var(--transition-fast);
}
.search-clear:hover { background: rgba(255,255,255,0.3); opacity: 1; }
.global-search input:not(:placeholder-shown) { padding-right: 36px; }
.navbar-right { display: flex; align-items: center; gap: var(--spacing-sm); }
.nav-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background var(--transition-fast);
}
.nav-btn:hover { background: rgba(255,255,255,0.2); }
.nav-btn svg { width: 18px; height: 18px; }
.logout-form { margin: 0; }
.logout-btn:hover { background: rgba(220,53,69,0.8) !important; }

/* ========== 侧边栏遮罩 ========== */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 850;
  opacity: 0;
  transition: opacity var(--transition-normal);
}
.sidebar-overlay.active { opacity: 1; }

/* ========== 侧边栏 ========== */
.sidebar {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--navbar-height));
  background: white;
  border-right: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal), width var(--transition-normal);
  z-index: 900;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
.sidebar-header { padding: var(--spacing-lg); border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; justify-content: space-between; }
.user-info { display: flex; align-items: center; gap: var(--spacing-md); flex: 1; }
.sidebar-close {
  display: none;
  background: transparent;
  border: none;
  color: var(--gray-500);
  padding: var(--spacing-sm);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}
.sidebar-close:hover { background: var(--gray-100); color: var(--gray-700); }
.user-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.user-avatar svg { width: 22px; height: 22px; }
.user-details { display: flex; flex-direction: column; }
.user-name { font-weight: 600; color: var(--gray-800); font-size: 0.95rem; }
.user-role { font-size: 0.8rem; color: var(--gray-500); }
.sidebar-nav { flex: 1; padding: var(--spacing-md) 0; }
.nav-section { margin-bottom: var(--spacing-md); }
.nav-section-title {
  display: block;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--gray-500);
  letter-spacing: 0.05em;
}
.nav-list { list-style: none; }
.nav-item a {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--gray-600);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}
.nav-item a:hover { background: var(--gray-50); color: var(--primary-600); }
.nav-item.active a {
  background: var(--primary-50);
  color: var(--primary-600);
  border-left-color: var(--primary-500);
  font-weight: 500;
}
.nav-icon { width: 20px; height: 20px; flex-shrink: 0; }
.nav-badge {
  margin-left: auto;
  background: var(--error);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}
.nav-badge-info {
  background: #94a3b8;
  color: white;
}
.nav-badge-info:hover {
  background: #64748b;
}
.nav-badge-pending {
  background: var(--error);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.nav-badge-pending:hover {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
  transform: scale(1.05);
}

/* ========== 搜索栏计数 ========== */
.search-count {
  position: absolute;
  right: 40px;
  top: 50%;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
  will-change: opacity, transform;
  opacity: 0;
  transform: translateY(-50%) scale(0.8);
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.search-count.visible {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

/* ========== 侧边栏底部版本号 ========== */
.sidebar-footer {
  padding: var(--spacing-md) calc(var(--spacing-lg) + var(--spacing-md) * 2);
  border-top: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}
.version-badge {
  vertical-align: middle;
  margin-top: 3px;
}

/* ========== 主内容区 ========== */
.main-content {
  margin-left: var(--sidebar-width);
  margin-top: var(--navbar-height);
  padding: var(--spacing-lg);
  height: calc(100vh - var(--navbar-height));
  overflow-y: auto;
  transition: margin-left var(--transition-normal);
}
.content-page { display: none; }
.content-page.active { display: block; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* ========== 页面头部 ========== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}
.page-title { font-size: 1.5rem; font-weight: 600; color: var(--gray-800); }
.page-actions { display: flex; gap: var(--spacing-sm); align-items: center; }
.category-filter-select {
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  min-width: 120px;
}
.category-filter-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-50);
}

/* ========== 按钮系统 ========== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn svg { width: 18px; height: 18px; }
.btn-primary { background: var(--primary-500); color: white; }
.btn-primary:hover { background: var(--primary-600); box-shadow: var(--shadow-md); }
.btn-secondary { background: var(--gray-200); color: var(--gray-700); }
.btn-secondary:hover { background: var(--gray-300); }

/* Loading Spinner */
.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--gray-400);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========== 添加表单卡片 ========== */
.add-form-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
  margin-bottom: var(--spacing-lg);
  overflow: visible; /* 允许下拉框显示 */
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.add-form-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  border-color: var(--gray-300);
}
.add-form-card .card-body {
  max-height: 500px;
  opacity: 1;
  padding: var(--spacing-lg);
  transition: max-height 0.3s ease-out, opacity 0.25s ease-out, padding 0.3s ease-out;
}
.add-form-card.collapsed .card-body {
  max-height: 0;
  opacity: 0;
  padding: 0 var(--spacing-lg);
}
.add-form-card.collapsed .collapse-icon { transform: rotate(180deg); }
.add-form-card.collapsed { overflow: hidden; } /* 折叠时隐藏内容 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  cursor: pointer;
  font-weight: 500;
  color: var(--gray-700);
  user-select: none;
}
.card-header:hover { background: var(--gray-100); }
.collapse-icon { width: 20px; height: 20px; transition: transform var(--transition-fast); }
.card-body { padding: var(--spacing-lg); }

/* ========== 表单 ========== */
.add-new {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}
.add-new > input {
  flex: 1 1 180px;
  min-width: 150px;
  padding: 10px 12px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.add-new > input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-50);
}
.add-new > .category-input-wrapper {
  flex: 1 1 180px;
  min-width: 150px;
}
.add-new > .category-input-wrapper input {
  width: 100%;
  padding: 10px 30px 10px 12px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  box-sizing: border-box;
}
.add-new > .category-input-wrapper input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-50);
}
.add-new > button {
  flex: 0 0 auto;
  padding: 10px 20px;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background var(--transition-fast);
}
.add-new > button:hover { background: var(--primary-600); }

/* ========== 表格卡片 ========== */
.table-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; }
th, td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
  color: var(--gray-700);
  vertical-align: middle;
}
th {
  background: var(--gray-50);
  font-weight: 600;
  color: var(--gray-600);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
th:last-child {
  text-align: right;
}
tr:hover { background: var(--gray-50); }

/* 固定列宽 */
#configTable th:nth-child(1), #configTable td:nth-child(1) { width: 3%; min-width: 40px; text-align: center; }
#configTable th:nth-child(2), #configTable td:nth-child(2) { width: 4%; min-width: 50px; }
#configTable th:nth-child(3), #configTable td:nth-child(3) { width: 12%; min-width: 100px; max-width: 120px; }
#configTable th:nth-child(4), #configTable td:nth-child(4) { width: 20%; min-width: 150px; max-width: 200px; }
#configTable th:nth-child(5), #configTable td:nth-child(5) { width: 4%; min-width: 36px; text-align: center; }
#configTable th:nth-child(6), #configTable td:nth-child(6) { width: 18%; min-width: 120px; max-width: 180px; }
#configTable th:nth-child(7), #configTable td:nth-child(7) { width: 10%; min-width: 80px; max-width: 100px; }
#configTable th:nth-child(8), #configTable td:nth-child(8) { width: 4%; min-width: 36px; text-align: center; }
#configTable th:nth-child(9), #configTable td:nth-child(9) { width: 12%; min-width: 100px; max-width: 140px; }
/* 表头不换行 */
#configTable th { white-space: nowrap; }

/* 所有 td 单元格截断 */
#configTable td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 待审核表格样式 - 与书签表格保持一致 */
#pendingTable {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
#pendingTable th {
  white-space: nowrap;
}
#pendingTable td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#pendingTable th:nth-child(1), #pendingTable td:nth-child(1) { width: 3%; min-width: 40px; text-align: center; }
#pendingTable th:nth-child(2), #pendingTable td:nth-child(2) { width: 5%; min-width: 50px; text-align: center; }
#pendingTable th:nth-child(3), #pendingTable td:nth-child(3) { width: 15%; min-width: 100px; max-width: 150px; }
#pendingTable th:nth-child(4), #pendingTable td:nth-child(4) { width: 25%; min-width: 150px; max-width: 250px; }
#pendingTable th:nth-child(5), #pendingTable td:nth-child(5) { width: 5%; min-width: 50px; text-align: center; }
#pendingTable th:nth-child(6), #pendingTable td:nth-child(6) { width: 20%; min-width: 120px; max-width: 180px; }
#pendingTable th:nth-child(7), #pendingTable td:nth-child(7) { width: 10%; min-width: 80px; max-width: 100px; }
#pendingTable th:nth-child(8), #pendingTable td:nth-child(8) { width: 12%; min-width: 100px; max-width: 140px; }
#pendingTable a {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name-cell, .url-cell, .desc-cell, .catelog-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.url-cell a {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logo-cell {
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);
}
.actions { }
.actions-buttons { display: flex; gap: var(--spacing-xs); align-items: center; justify-content: flex-end; }
.actions button, .actions-buttons button, .category-actions button {
  padding: 5px 10px;
  font-size: 0.8rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}
.actions-buttons button:hover, .category-actions button:hover { opacity: 0.8; }
.edit-btn { background: #007AFF; color: white; }
.del-btn, .reject-btn { background: var(--error); color: white; }
.approve-btn { background: var(--success); color: white; }

/* ========== 分类排序 ========== */
.category-hint { margin: 0 0 var(--spacing-md); font-size: 0.85rem; color: var(--gray-500); }

/* 拖拽手柄 */
.drag-handle {
  width: 24px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  font-size: 16px;
  letter-spacing: -2px;
  cursor: grab;
  user-select: none;
  transition: color var(--transition-fast);
}
.drag-handle:hover {
  color: var(--primary-500);
}
.drag-handle:active {
  cursor: grabbing;
}

/* 序号 */
.sort-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gray-700);
  cursor: grab;
}
.sort-index:active {
  cursor: grabbing;
}

/* 拖拽位置提示 */
.drag-hint {
  position: fixed;
  padding: 4px 10px;
  background: var(--primary-500);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 12px;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.15s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.drag-hint.show {
  opacity: 1;
}

/* 拖拽排序样式 */
#categoryTable tbody tr {
  cursor: grab;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
#categoryTable tbody tr:active {
  cursor: grabbing;
}
#categoryTable tbody tr.dragging {
  opacity: 0.5;
  background: var(--primary-50);
}

.category-actions { display: flex; gap: var(--spacing-xs); flex-wrap: nowrap; align-items: center; }
.category-actions button:disabled { opacity: 0.5; cursor: not-allowed; }
.category-edit-btn { background: var(--primary-500); color: white; }
.category-delete-btn { background: var(--error); color: white; }
.batch-delete-btn { background: var(--error); color: white; }

/* 复选框列 */
.checkbox-col { width: 40px; text-align: center; padding-right: 4px; box-sizing: border-box; }
.category-checkbox { width: 16px; height: 16px; cursor: pointer; margin-right: 2px; }

/* ========== 分页 ========== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--gray-200);
}
.pagination button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
}
.pagination button:hover:not(:disabled) { background: var(--gray-200); }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination select {
  padding: var(--spacing-sm) var(--spacing-md);
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.pagination select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-50);
}
.pagination span { color: var(--gray-600); font-size: 0.9rem; }

/* ========== 批量操作工具栏 ========== */
.batch-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease-out, opacity 0.2s ease-out, padding 0.25s ease-out;
}
.batch-actions.show {
  display: flex;
  max-height: 60px;
  opacity: 1;
  padding: 10px 20px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.batch-count {
  color: #495057;
  font-size: 0.9rem;
  font-weight: 500;
}
.batch-count strong {
  color: #2184f5;
  font-weight: 700;
}
.batch-actions .btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.batch-actions .btn:hover {
  transform: translateY(-1px);
}
.batch-actions .btn:active {
  transform: translateY(0);
}
.batch-actions .btn svg {
  flex-shrink: 0;
}
.batch-actions .btn-secondary {
  background: #e9ecef;
  color: #495057;
}
.batch-actions .btn-secondary:hover {
  background: #dee2e6;
}
.batch-actions .btn-danger {
  background: #dc3545;
  color: white;
}
.batch-actions .btn-danger:hover {
  background: #c82333;
}
.batch-actions .btn-primary {
  background: #217af7;
  color: white;
}
.batch-actions .btn-primary:hover {
  background: #1667c4;
}

/* ========== 复选框样式 ========== */
.row-checkbox, #selectAll, .pending-row-checkbox, #pendingSelectAll {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary);
}

/* ========== 模态框 ========== */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
}
.modal.show {
  display: flex;
}
.modal-content {
  background: white;
  margin: 8% auto;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: var(--shadow-lg);
}
.modal-close {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 24px;
  color: var(--gray-500);
  cursor: pointer;
  line-height: 1;
}
.modal-close:hover { color: var(--gray-800); }
.modal-content h2 { margin-bottom: var(--spacing-md); color: var(--gray-800); }
.modal-content form { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.modal-content label { font-size: 0.85rem; font-weight: 500; color: var(--gray-600); }
.modal-content input {
  padding: 10px 12px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.modal-content input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-50);
}
.modal-content textarea {
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  resize: vertical;
  min-height: 60px;
  line-height: 1.5;
}
.modal-content textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-50);
}
.modal-content button[type="submit"] {
  padding: 10px 20px;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
}
.modal-content button[type="submit"]:hover { background: var(--primary-600); }

/* 模态框按钮区域 */
.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: var(--spacing-md);
  justify-content: flex-end;
}
.modal-actions .btn-cancel,
.modal-actions .btn-primary {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  box-sizing: border-box;
  border: 1px solid transparent;
  height: 40px;
  line-height: 1;
}
.modal-actions .btn-cancel {
  background: #f5f5f5;
  color: #666;
  border-color: #d9d9d9;
}
.modal-actions .btn-cancel:hover {
  background: #e8e8e8;
  border-color: #bbb;
}
.modal-actions .btn-primary {
  background: var(--primary-500);
  color: white;
}
.modal-actions .btn-primary:hover {
  background: var(--primary-600);
}

/* ========== 分类输入框 ========== */
.category-input-wrapper {
  position: relative;
}
.category-input-wrapper input {
  width: 100%;
  padding-right: 30px;
  box-sizing: border-box;
}
.dropdown-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 10px;
  color: var(--gray-500);
  pointer-events: auto;
  user-select: none;
  transition: color 0.2s;
}
.dropdown-arrow:hover {
  color: var(--gray-700);
}
.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  background: white;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1100;
  display: none;
  margin-top: 2px;
}
.category-dropdown.show {
  display: block;
}
.category-dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.category-dropdown-item:hover {
  background: var(--primary-50);
  color: var(--primary-600);
}

/* ========== 确认对话框 ========== */
.custom-dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}
.custom-dialog-overlay.active { opacity: 1; visibility: visible; }
.custom-dialog {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  min-width: 300px;
  max-width: 90%;
  box-shadow: var(--shadow-lg);
  transform: scale(0.9);
  transition: transform 0.2s;
}
.custom-dialog-overlay.active .custom-dialog { transform: scale(1); }
.custom-dialog-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.custom-dialog-title .icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.custom-dialog-title .icon.warning { background: #fff3cd; color: #856404; }
.custom-dialog-title .icon.error { background: #f8d7da; color: #721c24; }
.custom-dialog-title .icon.success { background: #d4edda; color: #155724; }
.custom-dialog-title .icon.info { background: #cce5ff; color: #004085; }
.custom-dialog-message { color: var(--gray-600); font-size: 0.9rem; margin-bottom: var(--spacing-md); }
.custom-dialog-buttons { display: flex; gap: var(--spacing-sm); justify-content: flex-end; }
.custom-dialog-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
}
.custom-dialog-btn.cancel { background: var(--gray-100); color: var(--gray-700); }
.custom-dialog-btn.cancel:hover { background: var(--gray-200); }
.custom-dialog-btn.confirm { background: var(--error); color: white; }
.custom-dialog-btn.confirm:hover { background: #c82333; }
.custom-dialog-btn.confirm.blue { background: var(--primary-500); }
.custom-dialog-btn.confirm.blue:hover { background: var(--primary-600); }

/* ========== 统一 Toast 提示 ========== */
.toast {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.toast-success { background: rgba(40, 167, 69, 0.9); }
.toast-error { background: rgba(220, 53, 69, 0.9); }
.toast-warning { background: rgba(255, 193, 7, 0.9); color: #212529; }
.toast-info { background: rgba(0, 123, 255, 0.9); }

/* ========== 拖拽导入区域 ========== */
.import-modal-content {
  width: 400px;
  max-width: 90%;
  margin: auto;
  padding: 20px;
}
.import-modal-content h2 {
  margin: 0 0 12px 0;
  font-size: 18px;
}
.import-drop-zone {
  border: 2px dashed var(--gray-300);
  border-radius: 12px;
  padding: 24px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--gray-50);
  text-align: center;
}
[data-theme="dark"] .import-drop-zone {
  border-color: var(--gray-600);
  background: rgba(255,255,255,0.05);
}
.import-drop-zone:hover,
.import-drop-zone.drag-over {
  border-color: var(--primary-500);
  background: var(--primary-50);
}
[data-theme="dark"] .import-drop-zone:hover,
[data-theme="dark"] .import-drop-zone.drag-over {
  background: rgba(59, 130, 246, 0.1);
}
.import-drop-icon {
  margin-bottom: 6px;
  color: var(--gray-400);
}
.import-drop-text {
  color: var(--gray-600);
  font-size: 14px;
  margin: 0 0 4px 0;
}
.import-drop-hint {
  color: var(--gray-400);
  font-size: 12px;
  margin: 0;
}
.import-file-info {
  margin-top: 16px;
  padding: 12px;
  background: var(--gray-100);
  border-radius: 8px;
}
[data-theme="dark"] .import-file-info {
  background: rgba(255,255,255,0.1);
}
.import-file-name {
  flex: 1;
  text-align: left;
  font-size: 14px;
  color: var(--gray-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.import-file-remove {
  color: var(--gray-500);
  cursor: pointer;
  font-size: 18px;
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
}
.import-file-remove:hover {
  color: var(--danger-color, #dc3545);
}

/* ========== 导入结果弹窗 ========== */
.import-result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  backdrop-filter: blur(8px);
}
.import-result-content {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
[data-theme="dark"] .import-result-content {
  background: #1e1e2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.import-result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}
.import-result-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}
.import-result-icon.success { background: #28a745; color: white; }
.import-result-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}
.import-result-close {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.import-result-close:hover { background: var(--danger-color); color: white; }
.import-result-stats {
  display: flex;
  padding: 24px;
  gap: 20px;
  justify-content: center;
}
.stat-item {
  text-align: center;
  padding: 16px 32px;
  border-radius: 12px;
  background: var(--bg-secondary);
}
.stat-item.added { border: 2px solid #28a745; }
.stat-item.skipped { border: 2px solid #ffc107; }
.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}
.stat-item.added .stat-number { color: #28a745; }
.stat-item.skipped .stat-number { color: #ffc107; }
.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
.import-result-skipped {
  padding: 0 24px 24px;
}
.skipped-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: background 0.2s;
}
.skipped-header:hover { background: var(--hover-bg); }
.toggle-icon { transition: transform 0.3s; font-size: 0.75rem; }
.skipped-list:not(.collapsed) + .skipped-header .toggle-icon,
.skipped-header:has(+ .skipped-list:not(.collapsed)) .toggle-icon { transform: rotate(180deg); }
.skipped-list {
  margin-top: 8px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
}
.skipped-list.collapsed {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  border: none;
  overflow: hidden;
}
.skipped-item {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
}
.skipped-item:last-child { border-bottom: none; }
.skipped-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 4px;
}
.skipped-url {
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.2s;
}
.skipped-url:hover { color: var(--primary-500); }
.import-result-btn {
  margin: 0 24px 24px;
  padding: 12px 24px;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.import-result-btn:hover { background: var(--primary-600); }

/* ========== 新书签高亮样式 ========== */
.row-highlight {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%) !important;
  border-left: 3px solid #22c55e;
  animation: highlightPulse 2s ease-in-out;
}
.row-highlight td:first-child {
  padding-left: 13px; /* 补偿左边框 */
}
@keyframes highlightPulse {
  0%, 100% { background: linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.08) 100%); }
  50% { background: linear-gradient(90deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.03) 100%); }
}
[data-theme="dark"] .row-highlight {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.1) 100%) !important;
}

/* ========== 书签隐藏样式 ========== */
.row-hidden {
  background: linear-gradient(90deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.05) 100%) !important;
  opacity: 0.7;
}
.row-hidden td {
  color: #9ca3af !important;
}
[data-theme="dark"] .row-hidden {
  background: linear-gradient(90deg, rgba(75, 85, 99, 0.3) 0%, rgba(75, 85, 99, 0.15) 100%) !important;
}
.show-btn {
  background: #22c55e !important;
  color: white !important;
}
.hide-btn {
  background: #6b7280 !important;
  color: white !important;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .sidebar { width: var(--sidebar-collapsed); }
  .sidebar .user-details, .sidebar .nav-section-title, .sidebar .nav-item span, .sidebar .nav-badge { display: none; }
  .sidebar .nav-item a { justify-content: center; padding: var(--spacing-md); }
  .main-content { margin-left: var(--sidebar-collapsed); }
  .navbar-center { display: none; }
}
@media (max-width: 768px) {
  .sidebar-toggle { display: flex; }
  .sidebar { transform: translateX(-100%); width: var(--sidebar-width); box-shadow: var(--shadow-lg); }
  .sidebar.open { transform: translateX(0); }
  /* 移动端展开时恢复显示文字和关闭按钮 */
  .sidebar.open .user-details,
  .sidebar.open .nav-section-title,
  .sidebar.open .nav-item a > span:not(.nav-badge) { display: flex !important; }
  /* 徽章由 JavaScript 控制显示，不强制显示 */
  .sidebar.open .nav-item a { justify-content: flex-start; padding: var(--spacing-md) var(--spacing-lg); }
  .sidebar.open .sidebar-close { display: flex; }
  .sidebar.open + .sidebar-overlay, .sidebar-overlay.active { display: block; }
  .main-content { margin-left: 0; padding: var(--spacing-md); }
  .navbar-brand .brand-text { display: none; }
  .nav-btn .btn-text { display: none; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .add-new > input { flex: 1 1 100%; }

  /* 移动端表格响应式 - 整个内容区域可滑动 */
  .content-page {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .table-wrapper {
    overflow: visible;
    margin: 0;
    padding: 0;
  }
  #configTable {
    min-width: 600px;
    width: max-content;
  }
  /* 待审核和分类排序页面也支持滑动 */
  .content-page > * {
    min-width: max-content;
  }
  /* 移动端批量操作按钮 */
  .batch-actions {
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
  .batch-actions button {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  /* 移动端筛选和添加区域 */
  .page-actions {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    width: 100%;
  }
  .page-actions select,
  .page-actions button {
    flex: 1;
    min-width: 120px;
  }
}
`,
          'admin.js': `
          // ========== 侧边栏导航逻辑 ==========
          const sidebar = document.getElementById('sidebar');
          const sidebarToggle = document.getElementById('sidebarToggle');
          const sidebarOverlay = document.getElementById('sidebarOverlay');
          const navItems = document.querySelectorAll('.nav-item[data-page]');
          const contentPages = document.querySelectorAll('.content-page');

          function openSidebar() {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
          function closeSidebar() {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
          }

          if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
              sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
            });
          }
          // 移动端关闭按钮
          const sidebarClose = document.getElementById('sidebarClose');
          if (sidebarClose) {
            sidebarClose.addEventListener('click', closeSidebar);
          }
          if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
          }

          // 强制刷新按钮（清除所有缓存）
          const forceRefreshBtn = document.getElementById('forceRefreshBtn');
          if (forceRefreshBtn) {
            forceRefreshBtn.addEventListener('click', async () => {
              const btn = forceRefreshBtn;
              btn.disabled = true;
              btn.innerHTML = '<span class="btn-text">清除中...</span>';

              try {
                // 1. 调用后端 API 清除 Cloudflare 边缘缓存
                await fetch('/api/cache/clear', { method: 'POST' });

                // 2. 清除浏览器 Cache API 缓存
                if ('caches' in window) {
                  const cacheNames = await caches.keys();
                  await Promise.all(cacheNames.map(name => caches.delete(name)));
                }

                // 3. 清除 localStorage
                localStorage.clear();

                // 4. 强制刷新页面
                location.href = location.href.split('?')[0] + '?t=' + Date.now();
              } catch (e) {
                console.log('清除缓存时出错:', e);
                btn.disabled = false;
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg><span class="btn-text">刷新</span>';
                Toast.error('清除缓存失败');
              }
            });
          }

          // 侧边栏页面切换
          navItems.forEach(item => {
            item.addEventListener('click', (e) => {
              e.preventDefault();
              const pageId = item.dataset.page;

              navItems.forEach(i => i.classList.remove('active'));
              item.classList.add('active');

              contentPages.forEach(page => {
                page.classList.remove('active');
                if (page.id === 'page-' + pageId) {
                  page.classList.add('active');
                }
              });

              if (window.innerWidth < 768) closeSidebar();

              if (pageId === 'categories') fetchCategories();
              if (pageId === 'pending') fetchPendingConfigs();

              // 点击书签列表时，清除筛选显示所有书签
              // 除非是从分类排序页面点击分类名称跳转过来的
              if (pageId === 'bookmarks' && !window.skipCategoryFilterClear) {
                  currentSearchKeyword = '';
                  currentCategoryFilter = '';
                  currentPage = 1;
                  // 清空搜索框
                  const globalSearch = document.getElementById('globalSearch');
                  const searchClear = document.getElementById('searchClear');
                  const categoryFilterSelect = document.getElementById('categoryFilter');
                  if (globalSearch) globalSearch.value = '';
                  if (searchClear) searchClear.style.display = 'none';
                  if (categoryFilterSelect) categoryFilterSelect.value = '';
                  // 刷新书签列表
                  fetchConfigs(1, '', '');
              }
              // 重置标志
              window.skipCategoryFilterClear = false;
            });
          });

          // ========== 表单卡片折叠 ==========
          const addFormCard = document.getElementById('addFormCard');
          const addFormToggle = document.getElementById('addFormToggle');
          const showAddFormBtn = document.getElementById('showAddForm');

          if (addFormToggle) {
            addFormToggle.addEventListener('click', () => {
              const isCollapsed = addFormCard.classList.contains('collapsed');
              addFormCard.classList.toggle('collapsed');
              // 展开时自动聚焦到第一个输入框
              if (isCollapsed) {
                setTimeout(() => {
                  document.getElementById('addName').focus();
                }, 50);
              }
            });
          }
          if (showAddFormBtn) {
            showAddFormBtn.addEventListener('click', () => {
              addFormCard.classList.remove('collapsed');
              document.getElementById('addName').focus();
            });
          }

          // ========== 全局搜索 ==========
          const globalSearch = document.getElementById('globalSearch');
          const searchClear = document.getElementById('searchClear');

          // 更新清空按钮显示状态
          function updateSearchClear() {
            if (searchClear && globalSearch) {
              searchClear.style.display = globalSearch.value ? 'flex' : 'none';
            }
          }

          if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
              currentSearchKeyword = e.target.value.trim();
              currentPage = 1;
              fetchConfigs(currentPage, currentSearchKeyword);
              updateSearchClear();
            });
          }

          // 清空搜索按钮
          if (searchClear) {
            searchClear.addEventListener('click', () => {
              if (globalSearch) {
                globalSearch.value = '';
                currentSearchKeyword = '';
                currentPage = 1;
                fetchConfigs(currentPage, '');
                updateSearchClear();
                globalSearch.focus();
              }
            });
          }

          // ========== 侧边栏导入导出 ==========
          const sidebarImport = document.getElementById('sidebarImport');
          const sidebarExport = document.getElementById('sidebarExport');

          // 拖拽导入弹窗相关元素
          const importModal = document.getElementById('importModal');
          const importDropZone = document.getElementById('importDropZone');
          const importFileModal = document.getElementById('importFileModal');
          const importFileInfo = document.getElementById('importFileInfo');
          const importFileName = document.getElementById('importFileName');
          const importFileRemove = document.getElementById('importFileRemove');
          const importModalClose = document.getElementById('importModalClose');
          const importModalCancel = document.getElementById('importModalCancel');
          const importModalConfirm = document.getElementById('importModalConfirm');

          let selectedFile = null;

          // 打开导入弹窗
          function openImportModal() {
            importModal.classList.add('show');
            // 重置状态
            selectedFile = null;
            importFileInfo.style.display = 'none';
            importModalConfirm.disabled = true;
            importDropZone.classList.remove('drag-over');
          }

          // 关闭导入弹窗
          function closeImportModal() {
            importModal.classList.remove('show');
            selectedFile = null;
            importFileModal.value = '';
          }

          // 显示选中的文件
          function showSelectedFile(file) {
            selectedFile = file;
            importFileName.textContent = file.name;
            importFileInfo.style.display = 'flex';
            importModalConfirm.disabled = false;
          }

          // 处理文件导入
          function processFile(file) {
            if (!file || !file.name.endsWith('.json')) {
              showMessage('请选择 JSON 文件', 'error');
              return;
            }
            showSelectedFile(file);
          }

          // 执行导入
          function doImport() {
            if (!selectedFile) return;

            const reader = new FileReader();
            reader.onload = function(event) {
              try {
                const jsonData = JSON.parse(event.target.result);
                fetch('/api/config/import', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(jsonData)
                }).then(res => res.json())
                  .then(data => {
                    closeImportModal();
                    if (data.code === 201) {
                      if (data.addedIds && data.addedIds.length > 0) {
                        data.addedIds.forEach(id => highlightedIds.add(id));
                      }
                      showImportResult(data);
                      fetchConfigs();
                    } else {
                      showMessage(data.message, 'error');
                    }
                  }).catch(err => {
                    closeImportModal();
                    showMessage('网络错误', 'error');
                  });
              } catch (error) {
                closeImportModal();
                showMessage('JSON 格式不正确', 'error');
              }
            };
            reader.readAsText(selectedFile);
          }

          // 侧边栏导入按钮
          if (sidebarImport) {
            sidebarImport.addEventListener('click', (e) => {
              e.preventDefault();
              openImportModal();
            });
          }

          // 侧边栏导出按钮
          if (sidebarExport) {
            sidebarExport.addEventListener('click', (e) => {
              e.preventDefault();
              exportConfig();
            });
          }

          // 拖拽区域 - 点击打开文件选择器
          if (importDropZone) {
            importDropZone.addEventListener('click', () => {
              importFileModal.click();
            });

            // 拖拽事件
            importDropZone.addEventListener('dragover', (e) => {
              e.preventDefault();
              importDropZone.classList.add('drag-over');
            });

            importDropZone.addEventListener('dragleave', (e) => {
              e.preventDefault();
              importDropZone.classList.remove('drag-over');
            });

            importDropZone.addEventListener('drop', (e) => {
              e.preventDefault();
              importDropZone.classList.remove('drag-over');
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                processFile(files[0]);
              }
            });
          }

          // 隐藏的文件输入
          if (importFileModal) {
            importFileModal.addEventListener('change', (e) => {
              if (e.target.files.length > 0) {
                processFile(e.target.files[0]);
              }
            });
          }

          // 移除已选文件
          if (importFileRemove) {
            importFileRemove.addEventListener('click', () => {
              selectedFile = null;
              importFileInfo.style.display = 'none';
              importFileModal.value = '';
              importModalConfirm.disabled = true;
            });
          }

          // 关闭/取消按钮
          if (importModalClose) {
            importModalClose.addEventListener('click', closeImportModal);
          }
          if (importModalCancel) {
            importModalCancel.addEventListener('click', closeImportModal);
          }
          if (importModal) {
            importModal.addEventListener('click', (e) => {
              if (e.target === importModal) {
                closeImportModal();
              }
            });
          }

          // 确认导入按钮
          if (importModalConfirm) {
            importModalConfirm.addEventListener('click', doImport);
          }

          // ========== DOM 元素引用 ==========
          const configTableBody = document.getElementById('configTableBody');
          const prevPageBtn = document.getElementById('prevPage');
          const nextPageBtn = document.getElementById('nextPage');
          const currentPageSpan = document.getElementById('currentPage');
          const totalPagesSpan = document.getElementById('totalPages');
          const pageSizeSelect = document.getElementById('pageSizeSelect');

          const pendingTableBody = document.getElementById('pendingTableBody');
          const pendingPrevPageBtn = document.getElementById('pendingPrevPage');
          const pendingNextPageBtn = document.getElementById('pendingNextPage');
          const pendingCurrentPageSpan = document.getElementById('pendingCurrentPage');
          const pendingTotalPagesSpan = document.getElementById('pendingTotalPages');

          const categoryTableBody = document.getElementById('categoryTableBody');

          // ========== 工具函数 ==========
          var escapeHTML = function(value) {
            var result = '';
            if (value !== null && value !== undefined) {
              result = String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            }
            return result;
          };
          
          var normalizeUrl = function(value) {
            var trimmed = String(value || '').trim();
            var normalized = '';
            // 支持 data: 格式的 base64 图片
            if (/^data:/i.test(trimmed)) {
              normalized = trimmed;
            } else if (/^https?:\\/\\//i.test(trimmed)) {
              normalized = trimmed;
            } else if (/^[\\w.-]+\\.[\\w.-]+/.test(trimmed)) {
              normalized = 'https://' + trimmed;
            }
            return normalized;
          };
          
          const addBtn = document.getElementById('addBtn');
          const addName = document.getElementById('addName');
          const addUrl = document.getElementById('addUrl');
          const addLogo = document.getElementById('addLogo');
          const addDesc = document.getElementById('addDesc');
          const addCatelog = document.getElementById('addCatelog');
		  const addSortOrder = document.getElementById('addSortOrder');

          // 注意：importBtn/exportBtn 已移至侧边栏，此处不再需要
          // importFile 在上方已声明，此处不再重复声明

          // ========== 数据变量 ==========
          let currentPage = 1;
          let pageSize = 10;
          let totalItems = 0;
          let allConfigs = []; // 保存所有配置数据
          let currentSearchKeyword = ''; // 保存当前搜索关键词
          let currentCategoryFilter = ''; // 保存当前分类筛选
          let highlightedIds = new Set(); // [新增] 高亮书签ID集合

          let pendingCurrentPage = 1;
            let pendingPageSize = 10;
            let pendingTotalItems = 0;
            let allPendingConfigs = []; // 保存所有待审核配置数据
          let categoriesData = []; // 保存分类排序数据
          
          // 使用 HTML 模板中预定义的编辑模态框
          const editModal = document.getElementById('editModal');
          
          const modalClose = editModal.querySelector('.modal-close');
          modalClose.addEventListener('click', () => {
            editModal.style.display = 'none';
          });
          
          const editForm = document.getElementById('editForm');
          editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const name = document.getElementById('editName').value;
            const url = document.getElementById('editUrl').value;
            const logo = document.getElementById('editLogo').value;
            const desc = document.getElementById('editDesc').value;
            const catelog = document.getElementById('editCatelog').value;
                const sort_order = document.getElementById('editSortOrder').value; // [新增]
            const payload = {
                name: name.trim(),
                url: url.trim(),
                logo: logo.trim(),
                desc: desc.trim(),
                catelog: catelog.trim()
            };
            if (sort_order !== '') {
                payload.sort_order = Number(sort_order);
            }
            fetch(\`/api/config/\${id}\`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            }).then(res => res.json())
              .then(data => {
                if (data.code === 200) {
                  showMessage('修改成功', 'success');
                  fetchConfigs();
                  editModal.style.display = 'none'; // 关闭弹窗
                } else {
                  showMessage(data.message, 'error');
                }
              }).catch(err => {
                showMessage('网络错误', 'error');
              })
          });
          
          
          function fetchConfigs(page = currentPage, keyword = currentSearchKeyword, category = currentCategoryFilter) {
              let url = \`/api/config?page=\${page}&pageSize=\${pageSize}\`;
              if(keyword) {
                  url = \`/api/config?page=\${page}&pageSize=\${pageSize}&keyword=\${keyword}\`
              }
              if(category) {
                  url += \`&catalog=\${encodeURIComponent(category)}\`;
              }
              fetch(url)
                  .then(res => res.json())
                  .then(data => {
                      if (data.code === 200) {
                          totalItems = data.total;
                          currentPage = data.page;
                                                 totalPagesSpan.innerText = Math.ceil(totalItems / pageSize);
                          currentPageSpan.innerText = currentPage;
                          allConfigs = data.data; // 保存所有数据
                          renderConfig(allConfigs);
                          updatePaginationButtons();

                          // 更新书签总数徽章
                          const bookmarksBadge = document.getElementById('bookmarksBadge');
                          if (bookmarksBadge) {
                              bookmarksBadge.textContent = data.total;
                          }

                          // 更新搜索计数显示
                          const searchCount = document.getElementById('searchCount');
                          if (searchCount) {
                              if (keyword) {
                                  searchCount.textContent = '找到 ' + data.total + ' 条';
                                  searchCount.classList.add('visible');
                              } else {
                                  searchCount.classList.remove('visible');
                              }
                          }
                      } else {
                          showMessage(data.message, 'error');
                      }
                  }).catch(err => {
                  showMessage('网络错误', 'error');
              })
          }
          function renderConfig(configs) {
          configTableBody.innerHTML = '';
           if (configs.length === 0) {
                configTableBody.innerHTML = '<tr><td colspan="10">没有配置数据</td></tr>';
                return
            }
          configs.forEach(config => {
              const row = document.createElement('tr');
              // [新增] 检查是否在高亮集合中
              const isHighlighted = highlightedIds.has(config.id);
              if (isHighlighted) {
                row.classList.add('row-highlight');
                row.dataset.highlightId = config.id;
              }
              // 【书签隐藏功能】检查是否隐藏
              const isHidden = config.hidden === 1 || config.hidden === true;
              if (isHidden) {
                row.classList.add('row-hidden');
              }
              const safeName = escapeHTML(config.name || '');
              const normalizedUrl = normalizeUrl(config.url);
              const displayUrl = config.url ? escapeHTML(config.url) : '未提供';
              const urlCell = normalizedUrl
                ? \`<a href="\${escapeHTML(normalizedUrl)}" target="_blank" rel="noopener noreferrer">\${escapeHTML(normalizedUrl)}</a>\`
                : displayUrl;
              const normalizedLogo = normalizeUrl(config.logo);
              const logoCell = normalizedLogo
                ? \`<img src="\${escapeHTML(normalizedLogo)}" alt="\${safeName}" style="width:30px;" />\`
                : 'N/A';
              const descCell = config.desc ? escapeHTML(config.desc) : 'N/A';
              const catelogCell = escapeHTML(config.catelog || '');
              const sortValue = config.sort_order === 9999 || config.sort_order === null || config.sort_order === undefined
                ? '默认'
                : escapeHTML(config.sort_order);
               row.innerHTML = \`
                 <td><input type="checkbox" class="row-checkbox" data-id="\${config.id}"></td>
                 <td>\${config.id}</td>
                  <td class="name-cell" title="\${safeName}">\${safeName}</td>
                  <td class="url-cell" title="\${escapeHTML(config.url || '')}">\${urlCell}</td>
                  <td class="logo-cell">\${logoCell}</td>
                  <td class="desc-cell" title="\${config.desc ? escapeHTML(config.desc) : ''}">\${descCell}</td>
                  <td class="catelog-cell">\${catelogCell}</td>
				 <td>\${sortValue}</td>
                  <td class="actions">
                    <div class="actions-buttons">
                      <button class="edit-btn" data-id="\${config.id}">编辑</button>
                      <button class="\${isHidden ? 'show-btn' : 'hide-btn'}" data-id="\${config.id}">\${isHidden ? '显示' : '隐藏'}</button>
                      <button class="del-btn" data-id="\${config.id}">删除</button>
                    </div>
                  </td>
               \`;
              // [新增] 悬停时移除高亮
              if (isHighlighted) {
                row.addEventListener('mouseenter', function() {
                  this.classList.remove('row-highlight');
                  highlightedIds.delete(parseInt(this.dataset.highlightId));
                }, { once: true });
              }
              configTableBody.appendChild(row);
          });
            bindActionEvents();
            bindCheckboxEvents();
          }

          function bindActionEvents() {
           document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    handleEdit(id);
                })
           });

          document.querySelectorAll('.del-btn').forEach(btn => {
               btn.addEventListener('click', function() {
                  const id = this.dataset.id;
                   handleDelete(id)
               })
          })

         // 【书签隐藏功能】显示/隐藏按钮事件
         document.querySelectorAll('.show-btn, .hide-btn').forEach(btn => {
              btn.addEventListener('click', async function() {
                  const id = this.dataset.id;
                  await handleToggleHidden(id, this);
              })
         })
         }

         // 【书签隐藏功能】切换隐藏状态
         async function handleToggleHidden(id, btn) {
            try {
              const res = await fetch(\`/api/config/\${id}/toggle-hidden\`, {
                method: 'PUT'
              });
              const data = await res.json();
              if (data.code === 200) {
                const row = btn.closest('tr');
                if (data.hidden) {
                  row.classList.add('row-hidden');
                  btn.textContent = '显示';
                  btn.classList.remove('hide-btn');
                  btn.classList.add('show-btn');
                  showMessage('书签已隐藏', 'success');
                } else {
                  row.classList.remove('row-hidden');
                  btn.textContent = '隐藏';
                  btn.classList.remove('show-btn');
                  btn.classList.add('hide-btn');
                  showMessage('书签已显示', 'success');
                }
              } else {
                showMessage(data.message || '操作失败', 'error');
              }
            } catch (e) {
              showMessage('切换状态失败: ' + e.message, 'error');
            }
         }

          // ========== 批量操作功能 ==========
          const selectAllCheckbox = document.getElementById('selectAll');
          const batchActionsBar = document.getElementById('batchActions');
          const selectedCountSpan = document.getElementById('selectedCount');
          const batchDeleteBtn = document.getElementById('batchDeleteBtn');
          const batchCategoryBtn = document.getElementById('batchCategoryBtn');
          const batchCancelBtn = document.getElementById('batchCancelBtn');

          // 获取选中的ID数组
          function getSelectedIds() {
            const checkboxes = document.querySelectorAll('.row-checkbox:checked');
            return Array.from(checkboxes).map(cb => cb.dataset.id);
          }

          // 更新批量操作工具栏状态
          function updateBatchActions() {
            const selectedIds = getSelectedIds();
            const count = selectedIds.length;

            if (selectedCountSpan) {
              selectedCountSpan.textContent = count;
            }

            if (batchActionsBar) {
              if (count > 0) {
                batchActionsBar.classList.add('show');
              } else {
                batchActionsBar.classList.remove('show');
              }
            }

            // 更新全选框状态
            if (selectAllCheckbox) {
              const allCheckboxes = document.querySelectorAll('.row-checkbox');
              const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
              selectAllCheckbox.checked = allCheckboxes.length > 0 && checkedCount === allCheckboxes.length;
              selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
            }
          }

          // 绑定复选框事件
          function bindCheckboxEvents() {
            document.querySelectorAll('.row-checkbox').forEach(cb => {
              cb.addEventListener('change', updateBatchActions);
            });
          }

          // 全选/取消全选
          if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
              const checkboxes = document.querySelectorAll('.row-checkbox');
              checkboxes.forEach(cb => {
                cb.checked = this.checked;
              });
              updateBatchActions();
            });
          }

          // 批量删除
          if (batchDeleteBtn) {
            batchDeleteBtn.addEventListener('click', async function() {
              const ids = getSelectedIds();
              if (ids.length === 0) {
                showMessage('请先选择要删除的书签', 'error');
                return;
              }

              const confirmed = await showConfirm(\`确认删除选中的 \${ids.length} 个书签吗？此操作不可恢复。\`, {
                title: '批量删除确认',
                type: 'error'
              });
              if (!confirmed) return;

              let successCount = 0;
              for (const id of ids) {
                try {
                  const res = await fetch(\`/api/config/\${id}\`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.code === 200) {
                    successCount++;
                  }
                } catch (e) {
                  console.error('删除失败:', id, e);
                }
              }

              showMessage(\`成功删除 \${successCount} 个书签\`, 'success');
              // 清除所有选中状态
              selectAllCheckbox.checked = false;
              document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
              updateBatchActions();
              fetchConfigs(currentPage);
            });
          }

          // 批量修改分类模态框
          const batchCategoryModal = document.getElementById('batchCategoryModal');
          const batchCategoryClose = document.getElementById('batchCategoryClose');
          const batchCategoryInput = document.getElementById('batchCategoryInput');
          const batchCategoryForm = document.getElementById('batchCategoryForm');
          const batchCategoryDropdown = document.getElementById('batchCategoryDropdown');
          const batchCategoryDropdownBtn = document.getElementById('batchCategoryDropdownBtn');
          const batchCategoryCountEl = document.getElementById('batchCategoryCount');

          function openBatchCategoryModal() {
            const ids = getSelectedIds();
            batchCategoryCountEl.textContent = ids.length;
            batchCategoryInput.value = '';
            loadCategoriesForBatchModal();
            batchCategoryModal.style.display = 'block';
          }

          function closeBatchCategoryModal() {
            batchCategoryModal.style.display = 'none';
          }

          function loadCategoriesForBatchModal() {
            fetch('/api/categories')
              .then(res => res.json())
              .then(data => {
                if (data.code === 200 && data.data && data.data.length > 0) {
                  batchCategoryDropdown.innerHTML = '';
                  data.data.forEach(item => {
                    const option = document.createElement('div');
                    option.className = 'category-dropdown-item';
                    option.textContent = item.catelog;
                    option.addEventListener('click', () => {
                      batchCategoryInput.value = item.catelog;
                      batchCategoryDropdown.classList.remove('show');
                    });
                    batchCategoryDropdown.appendChild(option);
                  });
                }
              })
              .catch(e => {
                console.error('加载分类列表失败:', e);
              });
          }

          // 下拉框显示/隐藏
          if (batchCategoryDropdownBtn) {
            batchCategoryDropdownBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              batchCategoryDropdown.classList.toggle('show');
            });
          }

          // 输入框聚焦时显示下拉框
          if (batchCategoryInput) {
            batchCategoryInput.addEventListener('focus', () => {
              batchCategoryDropdown.classList.add('show');
            });
          }

          // 点击外部关闭下拉框
          document.addEventListener('click', (e) => {
            if (!e.target.closest('.category-input-wrapper')) {
              batchCategoryDropdown.classList.remove('show');
            }
          });

          // 表单提交
          if (batchCategoryForm) {
            batchCategoryForm.addEventListener('submit', async function(e) {
              e.preventDefault();
              const category = batchCategoryInput.value.trim();
              if (!category) {
                showMessage('请输入分类名称', 'error');
                return;
              }

              try {
                const res = await fetch('/api/config/batch-category', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ids: getSelectedIds(), category })
                });
                const data = await res.json();
                if (data.code === 200) {
                  showMessage(\`成功修改 \${getSelectedIds().length} 个书签的分类\`, 'success');
                  closeBatchCategoryModal();
                  selectAllCheckbox.checked = false;
                  fetchConfigs(currentPage);
                } else {
                  showMessage(data.message || '修改失败', 'error');
                }
              } catch (e) {
                showMessage('网络错误', 'error');
              }
            });
          }

          // 模态框取消按钮
          const batchCategoryCancel = document.getElementById('batchCategoryCancel');
          if (batchCategoryCancel) {
            batchCategoryCancel.addEventListener('click', closeBatchCategoryModal);
          }

          // 批量操作工具栏取消按钮
          if (batchCancelBtn) {
            batchCancelBtn.addEventListener('click', function() {
              // 清除所有选中状态
              document.querySelectorAll('.row-checkbox').forEach(cb => {
                cb.checked = false;
              });
              if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
              }
              updateBatchActions();
            });
          }

          // 关闭按钮
          if (batchCategoryClose) {
            batchCategoryClose.addEventListener('click', closeBatchCategoryModal);
          }

          // 点击模态框外部关闭
          if (batchCategoryModal) {
            batchCategoryModal.addEventListener('click', function(e) {
              if (e.target === batchCategoryModal) {
                closeBatchCategoryModal();
              }
            });
          }

          // 批量修改分类按钮点击
          if (batchCategoryBtn) {
            batchCategoryBtn.addEventListener('click', function() {
              const ids = getSelectedIds();
              if (ids.length === 0) {
                showMessage('请先选择要修改分类的书签', 'error');
                return;
              }
              openBatchCategoryModal();
            });
          }

          // 批量获取图标
          const batchFetchIconBtn = document.getElementById('batchFetchIconBtn');
          if (batchFetchIconBtn) {
            batchFetchIconBtn.addEventListener('click', async function() {
              const ids = getSelectedIds();
              if (ids.length === 0) {
                showMessage('请先选择要获取图标的书签', 'error');
                return;
              }

              const confirmed = await showConfirm(\`将为选中的 \${ids.length} 个书签重新获取图标，确认继续？\`, {
                title: '批量获取图标',
                type: 'info'
              });
              if (!confirmed) return;

              batchFetchIconBtn.disabled = true;
              batchFetchIconBtn.innerHTML = '<span class="loading-spinner"></span> 获取中...';

              let successCount = 0;
              let failCount = 0;

              for (const id of ids) {
                // 从 allConfigs 获取完整数据
                const config = allConfigs.find(c => String(c.id) === String(id));
                if (!config || !config.url) {
                  failCount++;
                  continue;
                }

                try {
                  const urlObj = new URL(config.url);
                  const domain = urlObj.hostname;
                  const newLogo = \`https://favicon.yandex.net/favicon/v2/\${domain}\`;

                  const res = await fetch(\`/api/config/\${id}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: config.name,
                      url: config.url,
                      logo: newLogo,
                      desc: config.desc,
                      catelog: config.catelog,
                      sort_order: config.sort_order
                    })
                  });
                  const data = await res.json();
                  if (data.code === 200) {
                    successCount++;
                  } else {
                    failCount++;
                  }
                } catch (e) {
                  failCount++;
                }
              }

              batchFetchIconBtn.disabled = false;
              batchFetchIconBtn.innerHTML = \`
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
                </svg>
                批量获取图标
              \`;

              if (successCount > 0) {
                showMessage(\`成功获取 \${successCount} 个图标\${failCount > 0 ? '，失败 ' + failCount + ' 个' : ''}\`, 'success');
                fetchConfigs();
              } else {
                showMessage('获取图标失败', 'error');
              }
            });
          }

          // 分类筛选功能
          const categoryFilterSelect = document.getElementById('categoryFilter');

          function filterByCategory(category) {
            currentCategoryFilter = category;
            currentPage = 1;
            fetchConfigs(currentPage, currentSearchKeyword, currentCategoryFilter);
          }

          if (categoryFilterSelect) {
            categoryFilterSelect.addEventListener('change', function() {
              filterByCategory(this.value);
            });
          }

          function updateCategoryFilterSelect(categories) {
            if (!categoryFilterSelect) return;
            const currentValue = categoryFilterSelect.value;
            categoryFilterSelect.innerHTML = '<option value="">全部分类</option>';
            categories.forEach(item => {
              const option = document.createElement('option');
              option.value = item.catelog;
              option.textContent = item.catelog;
              categoryFilterSelect.appendChild(option);
            });
            // 恢复之前选中的值
            if (currentValue) {
              categoryFilterSelect.value = currentValue;
            }
          }

          function fetchCategories() {
            if (!categoryTableBody) {
              return;
            }
            // 不显示"加载中..."，避免页面闪烁
            fetch('/api/categories')
              .then(res => res.json())
              .then(data => {
                if (data.code === 200) {
                  categoriesData = data.data || [];
                  renderCategories(categoriesData);
                  updateCategoryDropdown(categoriesData);
                  updateCategoryFilterSelect(categoriesData);
                  initCategoryDropdown();
                  initCategoryEditModal();
                  initCategoryBatchActions();
                  // 更新添加表单的分类下拉
                  updateAddCategoryDropdown(categoriesData);
                  initAddCategoryDropdown();
                } else {
                  showMessage(data.message || '加载分类失败', 'error');
                  categoryTableBody.innerHTML = '<tr><td colspan="4">加载失败</td></tr>';
                }
              }).catch(() => {
                showMessage('网络错误', 'error');
                categoryTableBody.innerHTML = '<tr><td colspan="4">加载失败</td></tr>';
              });
          }

          // 更新分类下拉列表
          function updateCategoryDropdown(categories) {
            const dropdown = document.getElementById('categoryDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '';
            if (categories && categories.length > 0) {
              categories.forEach(item => {
                const div = document.createElement('div');
                div.className = 'category-dropdown-item';
                div.textContent = item.catelog;
                div.addEventListener('click', () => {
                  document.getElementById('editCatelog').value = item.catelog;
                  dropdown.classList.remove('show');
                });
                dropdown.appendChild(div);
              });
            }
          }

          // 更新添加表单的分类下拉列表
          function updateAddCategoryDropdown(categories) {
            const dropdown = document.getElementById('addCategoryDropdown');
            if (!dropdown) return;
            dropdown.innerHTML = '';
            if (categories && categories.length > 0) {
              categories.forEach(item => {
                const div = document.createElement('div');
                div.className = 'category-dropdown-item';
                div.textContent = item.catelog;
                div.addEventListener('click', () => {
                  document.getElementById('addCatelog').value = item.catelog;
                  dropdown.classList.remove('show');
                });
                dropdown.appendChild(div);
              });
            }
          }

          // 初始化添加表单的分类下拉按钮事件
          function initAddCategoryDropdown() {
            const btn = document.getElementById('addCategoryDropdownBtn');
            const dropdown = document.getElementById('addCategoryDropdown');
            const input = document.getElementById('addCatelog');
            if (!btn || !dropdown || !input) return;

            // 点击下拉箭头切换下拉菜单
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              dropdown.classList.toggle('show');
            });

            // 点击输入框也显示下拉菜单
            input.addEventListener('focus', () => {
              dropdown.classList.add('show');
            });

            // 点击外部关闭下拉菜单
            document.addEventListener('click', (e) => {
              if (!e.target.closest('.category-input-wrapper')) {
                dropdown.classList.remove('show');
              }
            });
          }

          // 初始化分类下拉按钮事件（编辑模态框）
          function initCategoryDropdown() {
            const btn = document.getElementById('categoryDropdownBtn');
            const dropdown = document.getElementById('categoryDropdown');
            const input = document.getElementById('editCatelog');
            if (!btn || !dropdown || !input) return;

            // 点击下拉箭头切换下拉菜单
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              dropdown.classList.toggle('show');
            });

            // 点击输入框也显示下拉菜单
            input.addEventListener('focus', () => {
              dropdown.classList.add('show');
            });

            // 点击外部关闭下拉菜单
            document.addEventListener('click', (e) => {
              if (!e.target.closest('.category-input-wrapper')) {
                dropdown.classList.remove('show');
              }
            });
          }

          // 选中的分类集合
          let selectedCategories = new Set();

          function renderCategories(categories) {
            if (!categoryTableBody) {
              return;
            }
            categoryTableBody.innerHTML = '';
            selectedCategories.clear();
            updateCategoryBatchActions();

            if (!categories || categories.length === 0) {
              categoryTableBody.innerHTML = '<tr><td colspan="5">暂无分类数据</td></tr>';
              return;
            }

            categories.forEach((item, index) => {
              const row = document.createElement('tr');
              row.setAttribute('data-index', index);
              row.setAttribute('data-category', item.catelog);
              row.setAttribute('draggable', 'true');  // 启用拖拽

              // 复选框列
              const checkboxCell = document.createElement('td');
              checkboxCell.className = 'checkbox-col';
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.className = 'category-checkbox';
              checkbox.setAttribute('data-category', item.catelog);
              checkbox.addEventListener('change', function() {
                if (this.checked) {
                  selectedCategories.add(item.catelog);
                } else {
                  selectedCategories.delete(item.catelog);
                }
                updateCategoryBatchActions();
              });
              checkboxCell.appendChild(checkbox);
              row.appendChild(checkboxCell);

              // 排序列：序号（可拖拽）
              const sortCell = document.createElement('td');
              const sortIndex = document.createElement('span');
              sortIndex.className = 'sort-index';
              sortIndex.textContent = index + 1;
              sortIndex.title = '拖拽排序';
              sortCell.appendChild(sortIndex);
              row.appendChild(sortCell);

              // 分类名称
              const nameCell = document.createElement('td');
              nameCell.textContent = item.catelog;
              nameCell.style.cursor = 'pointer';
              nameCell.style.color = 'var(--primary-500)';
              nameCell.title = '点击筛选该分类的书签';
              nameCell.addEventListener('click', () => {
                // 设置标志，跳过导航点击时的筛选清除
                window.skipCategoryFilterClear = true;
                // 跳转到书签列表页面并设置分类筛选
                const navItem = document.querySelector('.nav-item[data-page="bookmarks"]');
                if (navItem) navItem.click();
                // 设置分类筛选
                const categoryFilter = document.getElementById('categoryFilter');
                if (categoryFilter) {
                  categoryFilter.value = item.catelog;
                  // 触发筛选
                  filterByCategory(item.catelog);
                }
              });
              row.appendChild(nameCell);

              // 书签数量
              const countCell = document.createElement('td');
              countCell.textContent = item.site_count;
              row.appendChild(countCell);

              // 操作列
              const actionCell = document.createElement('td');
              const actionDiv = document.createElement('div');
              actionDiv.className = 'category-actions';

              // 编辑按钮
              const editBtn = document.createElement('button');
              editBtn.className = 'category-edit-btn';
              editBtn.textContent = '编辑';
              editBtn.setAttribute('data-category', item.catelog);
              actionDiv.appendChild(editBtn);

              // 删除按钮
              const deleteBtn = document.createElement('button');
              deleteBtn.className = 'category-delete-btn';
              deleteBtn.textContent = '删除';
              deleteBtn.setAttribute('data-category', item.catelog);
              deleteBtn.setAttribute('data-count', item.site_count);
              actionDiv.appendChild(deleteBtn);

              actionCell.appendChild(actionDiv);
              row.appendChild(actionCell);
              categoryTableBody.appendChild(row);
            });

            bindCategoryEvents();
          }

          // 更新批量操作栏状态
          function updateCategoryBatchActions() {
            const batchActions = document.getElementById('categoryBatchActions');
            const selectedCount = document.getElementById('categorySelectedCount');
            const selectAll = document.getElementById('categorySelectAll');

            if (batchActions && selectedCount) {
              const count = selectedCategories.size;
              selectedCount.textContent = count;
              if (count > 0) {
                batchActions.classList.add('show');
              } else {
                batchActions.classList.remove('show');
              }
            }

            // 更新全选状态
            if (selectAll) {
              const checkboxes = categoryTableBody.querySelectorAll('.category-checkbox');
              const checkedCount = selectedCategories.size;
              selectAll.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
              selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
            }
          }

          // 拖拽排序事件（使用闭包保存状态，只初始化一次）
          let categoryDragState = {
            initialized: false,
            draggedRow: null,
            draggedIndex: null
          };

          function bindCategoryEvents() {
            if (!categoryTableBody) {
              return;
            }

            // 防止重复绑定事件
            if (categoryDragState.initialized) {
              return;
            }
            categoryDragState.initialized = true;

            const dragHint = document.getElementById('dragHint');

            // 使用事件委托处理拖拽
            categoryTableBody.addEventListener('dragstart', function(e) {
              const row = e.target.closest('tr');
              if (!row) return;
              categoryDragState.draggedRow = row;
              categoryDragState.draggedIndex = parseInt(row.getAttribute('data-index'));
              row.classList.add('dragging');
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', row.getAttribute('data-category'));
            });

            categoryTableBody.addEventListener('dragend', function(e) {
              const row = e.target.closest('tr');
              if (row) row.classList.remove('dragging');
              if (dragHint) dragHint.classList.remove('show');
              categoryDragState.draggedRow = null;
              categoryDragState.draggedIndex = null;
            });

            categoryTableBody.addEventListener('dragover', function(e) {
              e.preventDefault();
              const row = e.target.closest('tr');
              if (!row) return;

              e.dataTransfer.dropEffect = 'move';
              if (dragHint && categoryDragState.draggedRow && categoryDragState.draggedRow !== row) {
                const rows = Array.from(categoryTableBody.querySelectorAll('tr'));
                const targetIdx = rows.indexOf(row);
                dragHint.textContent = targetIdx + 1;
                dragHint.style.left = (e.clientX + 15) + 'px';
                dragHint.style.top = (e.clientY - 10) + 'px';
                dragHint.classList.add('show');
              }
            });

            categoryTableBody.addEventListener('drop', async function(e) {
              e.preventDefault();
              const targetRow = e.target.closest('tr');
              if (!targetRow || !categoryDragState.draggedRow || categoryDragState.draggedRow === targetRow) return;

              // 判断拖拽行的位置，决定插入到目标行之前还是之后
              const rows = Array.from(categoryTableBody.querySelectorAll('tr'));
              const draggedIdx = rows.indexOf(categoryDragState.draggedRow);
              const targetIdx = rows.indexOf(targetRow);

              if (draggedIdx < targetIdx) {
                // 拖拽行在目标行之前，插入到目标行之后
                targetRow.parentNode.insertBefore(categoryDragState.draggedRow, targetRow.nextSibling);
              } else {
                // 拖拽行在目标行之后，插入到目标行之前
                targetRow.parentNode.insertBefore(categoryDragState.draggedRow, targetRow);
              }

              // 更新序号显示
              categoryTableBody.querySelectorAll('tr').forEach((row, idx) => {
                const sortIndex = row.querySelector('.sort-index');
                if (sortIndex) {
                  sortIndex.textContent = idx + 1;
                }
              });

              // 获取新的顺序并保存
              const allRows = categoryTableBody.querySelectorAll('tr');
              const categories = Array.from(allRows).map(r => r.getAttribute('data-category')).filter(c => c);

              try {
                const updatePromises = categories.map((cat, index) =>
                  fetch('/api/categories/' + encodeURIComponent(cat), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sort_order: index })
                  })
                );
                await Promise.all(updatePromises);
                showMessage('排序已更新', 'success');
              } catch (error) {
                showMessage('保存排序失败', 'error');
                console.error('Save order error:', error);
              }
            });

            // 删除按钮事件 - 使用事件委托避免重复绑定
            categoryTableBody.onclick = async function(e) {
              const deleteBtn = e.target.closest('.category-delete-btn');
              if (deleteBtn) {
                const category = deleteBtn.getAttribute('data-category');
                if (!category) return;

                const confirmed = await showConfirm(\`确定删除该分类下的所有书签吗？此操作不可恢复。\`, {
                  title: '删除确认',
                  type: 'error'
                });
                if (!confirmed) return;

                fetch(\`/api/categories/\${encodeURIComponent(category)}/sites\`, {
                  method: 'DELETE'
                }).then(res => res.json())
                  .then(data => {
                    if (data.code === 200) {
                      showMessage(\`已删除 \${data.deleted || ''} 个书签\`, 'success');
                      fetchCategories();
                      fetchConfigs();
                    } else {
                      showMessage(data.message || '删除失败', 'error');
                    }
                  }).catch(() => {
                    showMessage('网络错误', 'error');
                  });
                return;
              }

              const editBtn = e.target.closest('.category-edit-btn');
              if (editBtn) {
                const category = editBtn.getAttribute('data-category');
                if (!category) return;

                // 打开编辑模态框
                document.getElementById('categoryEditOldName').value = category;
                document.getElementById('categoryEditName').value = category;
                document.getElementById('categoryEditModal').style.display = 'block';
                return;
              }

              // 复选框事件
              const checkbox = e.target.closest('.category-checkbox');
              if (checkbox) {
                const cat = checkbox.getAttribute('data-category');
                if (checkbox.checked) {
                  selectedCategories.add(cat);
                } else {
                  selectedCategories.delete(cat);
                }
                updateCategoryBatchActions();
              }
            };

            // 全选复选框事件 - 克隆节点避免重复绑定
            const categorySelectAll = document.getElementById('categorySelectAll');
            if (categorySelectAll) {
              const newSelectAll = categorySelectAll.cloneNode(true);
              categorySelectAll.parentNode.replaceChild(newSelectAll, categorySelectAll);
              newSelectAll.addEventListener('change', function() {
                const checkboxes = categoryTableBody.querySelectorAll('.category-checkbox');
                checkboxes.forEach(cb => {
                  // 跳过表头的全选复选框（没有 data-category）
                  const cat = cb.getAttribute('data-category');
                  if (!cat) return;

                  cb.checked = this.checked;
                  if (this.checked) {
                    selectedCategories.add(cat);
                  } else {
                    selectedCategories.delete(cat);
                  }
                });
                updateCategoryBatchActions();
              });
            }
          }

          // 分类编辑模态框是否已初始化
          let categoryEditModalInitialized = false;

          // 初始化分类编辑模态框事件（只执行一次）
          function initCategoryEditModal() {
            if (categoryEditModalInitialized) return;

            const modal = document.getElementById('categoryEditModal');
            const closeBtn = document.getElementById('categoryEditClose');
            const cancelBtn = document.getElementById('categoryEditCancel');
            const form = document.getElementById('categoryEditForm');

            if (!modal) return;

            categoryEditModalInitialized = true;

            // 关闭按钮
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
              });
            }

            // 取消按钮
            if (cancelBtn) {
              cancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
              });
            }

            // 点击背景关闭
            modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                modal.style.display = 'none';
              }
            });

            // 表单提交
            if (form) {
              form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const oldName = document.getElementById('categoryEditOldName').value;
                const newName = document.getElementById('categoryEditName').value.trim();

                if (!newName) {
                  showMessage('分类名称不能为空', 'error');
                  return;
                }

                if (oldName === newName) {
                  modal.style.display = 'none';
                  return;
                }

                try {
                  const res = await fetch('/api/categories/' + encodeURIComponent(oldName), {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ new_name: newName })
                  });
                  const data = await res.json();

                  if (data.code === 200) {
                    showMessage('分类已重命名', 'success');
                    modal.style.display = 'none';
                    fetchCategories();
                    fetchConfigs();
                  } else {
                    showMessage(data.message || '重命名失败', 'error');
                  }
                } catch (error) {
                  showMessage('网络错误', 'error');
                }
              });
            }
          }

          // 初始化批量操作事件（使用克隆节点避免重复绑定）
          function initCategoryBatchActions() {
            const cancelBtn = document.getElementById('categoryCancelSelect');
            const deleteBtn = document.getElementById('categoryBatchDelete');

            // 取消选择 - 克隆节点移除旧事件
            if (cancelBtn) {
              const newCancelBtn = cancelBtn.cloneNode(true);
              cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
              newCancelBtn.addEventListener('click', () => {
                selectedCategories.clear();
                categoryTableBody.querySelectorAll('.category-checkbox').forEach(cb => {
                  cb.checked = false;
                });
                updateCategoryBatchActions();
              });
            }

            // 批量删除 - 克隆节点移除旧事件
            if (deleteBtn) {
              const newDeleteBtn = deleteBtn.cloneNode(true);
              deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
              newDeleteBtn.addEventListener('click', async () => {
                if (selectedCategories.size === 0) return;

                const confirmed = await showConfirm(\`确定删除选中的 \${selectedCategories.size} 个分类及其所有书签吗？此操作不可恢复。\`, {
                  title: '批量删除确认',
                  type: 'error'
                });
                if (!confirmed) return;

                try {
                  const res = await fetch('/api/categories/batch-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ categories: Array.from(selectedCategories) })
                  });
                  const data = await res.json();

                  if (data.code === 200) {
                    showMessage(\`已删除 \${data.deleted || 0} 个书签\`, 'success');
                    selectedCategories.clear();
                    fetchCategories();
                    fetchConfigs();
                  } else {
                    showMessage(data.message || '批量删除失败', 'error');
                  }
                } catch (error) {
                  showMessage('网络错误', 'error');
                }
              });
            }
          }

    // [优化] 点击编辑时，获取并填充排序字段
          function handleEdit(id) {
            fetch(\`/api/config?page=1&pageSize=1000\`) // A simple way to get all configs to find the one to edit
            .then(res => res.json())
            .then(data => {
                const configToEdit = data.data.find(c => c.id == id);
                if (!configToEdit) {
                    showMessage('找不到要编辑的数据', 'error');
                    return;
                }
                document.getElementById('editId').value = configToEdit.id;
                document.getElementById('editName').value = configToEdit.name;
                document.getElementById('editUrl').value = configToEdit.url;
                document.getElementById('editLogo').value = configToEdit.logo || '';
                document.getElementById('editDesc').value = configToEdit.desc || '';
                document.getElementById('editCatelog').value = configToEdit.catelog;
                document.getElementById('editSortOrder').value = configToEdit.sort_order === 9999 ? '' : configToEdit.sort_order; // [新增]

                editModal.style.display = 'block';
            });
          }
          async function handleDelete(id) {
            const confirmed = await showConfirm('确认删除该站点吗？此操作不可恢复。', {
              title: '删除确认',
              type: 'error'
            });
            if (!confirmed) return;
             fetch(\`/api/config/\${id}\`, {
                  method: 'DELETE'
              }).then(res => res.json())
                 .then(data => {
                     if (data.code === 200) {
                         showToast('删除成功', 'success');
                         fetchConfigs();
                     } else {
                         showToast(data.message, 'error');
                     }
                 }).catch(err => {
                      showToast('网络错误', 'error');
                 })
          }

          // showMessage 也使用统一的 Toast 模块
          function showMessage(message, type = 'error') {
            Toast.show(message, type, 2000);
          }

          // 自定义确认对话框
          function showConfirm(message, options = {}) {
            return new Promise((resolve) => {
              const {
                title = '确认操作',
                confirmText = '确定',
                cancelText = '取消',
                type = 'warning' // warning, error, success
              } = options;

              const overlay = document.createElement('div');
              overlay.className = 'custom-dialog-overlay';

              const iconSymbols = {
                warning: '!',
                error: '✕',
                success: '✓',
                info: 'i'
              };

              overlay.innerHTML = \`
                <div class="custom-dialog">
                  <div class="custom-dialog-title">
                    <span class="icon \${type}">\${iconSymbols[type]}</span>
                    \${title}
                  </div>
                  <div class="custom-dialog-message">\${message}</div>
                  <div class="custom-dialog-buttons">
                    <button class="custom-dialog-btn cancel">\${cancelText}</button>
                    <button class="custom-dialog-btn confirm \${type === 'error' ? '' : 'blue'}">\${confirmText}</button>
                  </div>
                </div>
              \`;

              document.body.appendChild(overlay);
              document.body.style.overflow = 'hidden';

              // 触发动画
              requestAnimationFrame(() => {
                overlay.classList.add('active');
              });

              // 键盘事件处理函数 - 先定义，确保 closeDialog 可以引用它
              let handleKeydown = null;

              const closeDialog = (result) => {
                // 移除键盘事件监听器
                if (handleKeydown) {
                  document.removeEventListener('keydown', handleKeydown);
                  handleKeydown = null;
                }
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                  if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                  }
                }, 200);
                resolve(result);
              };

              overlay.querySelector('.custom-dialog-btn.cancel').addEventListener('click', () => closeDialog(false));
              overlay.querySelector('.custom-dialog-btn.confirm').addEventListener('click', () => closeDialog(true));

              // 点击背景关闭
              overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                  closeDialog(false);
                }
              });

              // 键盘事件处理
              handleKeydown = (e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  closeDialog(false);  // ESC 取消
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  closeDialog(true);   // 回车确认
                } else if (e.key === ' ') {
                  // 阻止空格键触发底层按钮
                  e.preventDefault();
                  e.stopPropagation();
                }
              };
              document.addEventListener('keydown', handleKeydown);
            });
          }

          // 统一 Toast 模块（后台）
          const Toast = {
            show(message, type = 'info', duration = 2000) {
              const toast = document.createElement('div');
              toast.className = \`toast toast-\${type}\`;
              toast.textContent = message;
              document.body.appendChild(toast);

              requestAnimationFrame(() => {
                toast.classList.add('show');
              });

              setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                  toast.remove();
                }, 300);
              }, duration);
            },
            success(msg, duration) { this.show(msg, 'success', duration); },
            error(msg, duration) { this.show(msg, 'error', duration); },
            warning(msg, duration) { this.show(msg, 'warning', duration); },
            info(msg, duration) { this.show(msg, 'info', duration); }
          };

          // 向后兼容
          function showToast(message, type = 'error') {
            Toast.show(message, type, 2000);
          }

          function updatePaginationButtons() {
            const totalPages = Math.ceil(totalItems / pageSize);
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage >= totalPages;
            // 总数 ≤ pageSize 时隐藏分页
            const pagination = document.getElementById('bookmarksPagination');
            if (pagination) {
              pagination.style.display = totalItems <= pageSize ? 'none' : 'flex';
            }
          }
          
          prevPageBtn.addEventListener('click', () => {
          if(currentPage > 1) {
              fetchConfigs(currentPage -1);
          }
          });
          nextPageBtn.addEventListener('click', () => {
            if (currentPage < Math.ceil(totalItems/pageSize)) {
              fetchConfigs(currentPage + 1);
            }
          });

          // 分页大小选择器事件
          pageSizeSelect.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value, 10);
            currentPage = 1;
            fetchConfigs(1);
          });
          
          addBtn.addEventListener('click', async () => {
            const name = addName.value;
            const url = addUrl.value;
            const logo = addLogo.value;
            const desc = addDesc.value;
             const catelog = addCatelog.value;
          const sort_order = addSortOrder.value; // [新增]
            if(!name ||    !url || !catelog) {
              showToast('名称,URL,分类 必填', 'error');
              return;
          }

          // 【新增】检查URL是否已存在
          try {
            const checkRes = await fetch('/api/check-url?url=' + encodeURIComponent(url.trim()));
            const checkData = await checkRes.json();
            if (checkData.exists) {
              const existing = checkData.duplicateSite;
              showToast('URL已存在: ' + existing.name + ' (ID: ' + existing.id + ')', 'error');
              return;
            }
          } catch (e) {
            console.error('检查URL失败:', e);
            // 继续添加，不阻塞流程
          }

          const payload = {
             name: name.trim(),
             url: url.trim(),
             logo: logo.trim(),
             desc: desc.trim(),
             catelog: catelog.trim()
          };
          if (sort_order !== '') {
             payload.sort_order = Number(sort_order);
          }
          fetch('/api/config', {        method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
          }).then(res => res.json())
          .then(data => {
             if(data.code === 201) {
                 const newId = data.data?.id;
                 showToast(newId ? '添加成功，ID: ' + newId : '添加成功', 'success');
                addName.value = '';
                addUrl.value = '';
                addLogo.value = '';
                addDesc.value = '';
                 addCatelog.value = '';
        addSortOrder.value = ''; // [新增]
                 fetchConfigs();
             }else {
                showToast(data.message, 'error');
             }
          }).catch(err => {
            showToast('网络错误', 'error');
          })
          });

          // 为添加表单添加回车提交功能
          ['addName', 'addUrl', 'addCatelog', 'addSortOrder', 'addLogo', 'addDesc'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
              input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.getElementById('addBtn').click();
                }
              });
            }
          });


          // [新增] HTML 转义函数，防止 XSS
          function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          }

          // [新增] 显示导入结果详情
          function showImportResult(data) {
            const { message, addedCount, skippedCount, skipped } = data;

            // 如果没有跳过的书签，直接显示简单消息
            if (!skippedCount || skippedCount === 0) {
              showMessage(message, 'success');
              return;
            }

            // 有跳过的书签，显示详细弹窗
            const modal = document.createElement('div');
            modal.className = 'import-result-modal';
            modal.innerHTML = \`
              <div class="import-result-content">
                <div class="import-result-header">
                  <span class="import-result-icon success">✓</span>
                  <span class="import-result-title">导入完成</span>
                  <button class="import-result-close" onclick="this.closest('.import-result-modal').remove()">×</button>
                </div>
                <div class="import-result-stats">
                  <div class="stat-item added">
                    <span class="stat-number">\${addedCount}</span>
                    <span class="stat-label">新增书签</span>
                  </div>
                  <div class="stat-item skipped">
                    <span class="stat-number">\${skippedCount}</span>
                    <span class="stat-label">跳过重复</span>
                  </div>
                </div>
                <div class="import-result-skipped">
                  <div class="skipped-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
                    <span>已跳过的重复书签</span>
                    <span class="toggle-icon">▼</span>
                  </div>
                  <div class="skipped-list collapsed">
                    \${skipped.map(item => \`
                      <div class="skipped-item">
                        <span class="skipped-name">\${escapeHtml(item.name)}</span>
                        <a class="skipped-url" href="\${escapeHtml(item.url)}" target="_blank" title="\${escapeHtml(item.url)}">\${escapeHtml(item.url.length > 50 ? item.url.substring(0, 50) + '...' : item.url)}</a>
                      </div>
                    \`).join('')}
                  </div>
                </div>
                <button class="import-result-btn" onclick="this.closest('.import-result-modal').remove()">确定</button>
              </div>
            \`;

            document.body.appendChild(modal);

            // 点击背景关闭
            modal.addEventListener('click', function(e) {
              if (e.target === modal) {
                modal.remove();
              }
            });
          }

          // 导出函数（供侧边栏按钮调用）
          function exportConfig() {
            // 创建输入对话框
            const overlay = document.createElement('div');
            overlay.className = 'custom-dialog-overlay active';
            overlay.innerHTML = \`
              <div class="custom-dialog" style="min-width: 400px;">
                <div class="custom-dialog-title">
                  <span class="icon info">📁</span>
                  <span>导出书签</span>
                </div>
                <div class="custom-dialog-message" style="text-align: left;">
                  <label style="display: block; margin-bottom: 8px; font-weight: 500;">文件名称</label>
                  <input type="text" id="exportFileName" value="我的书签_\${new Date().toLocaleDateString('zh-CN').replace(/\\//g, '-')}" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s;" placeholder="输入文件名">
                  <style>#exportFileName:focus { border-color: var(--primary-500); }</style>
                </div>
                <div class="custom-dialog-buttons">
                  <button class="custom-dialog-btn cancel">取消</button>
                  <button class="custom-dialog-btn confirm blue">导出</button>
                </div>
              </div>
            \`;
            document.body.appendChild(overlay);

            const input = document.getElementById('exportFileName');
            const cancelBtn = overlay.querySelector('.custom-dialog-btn.cancel');
            const confirmBtn = overlay.querySelector('.custom-dialog-btn.confirm');

            // 聚焦输入框并选中文本
            setTimeout(() => { input.focus(); input.select(); }, 100);

            // 关闭对话框
            function closeDialog() {
              overlay.classList.remove('active');
              setTimeout(() => overlay.remove(), 200);
            }

            // 执行导出
            function doExport() {
              const fileName = (input.value.trim() || '我的书签') + '.json';
              closeDialog();

              fetch('/api/config/export')
                .then(res => res.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = fileName;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  showMessage('导出成功', 'success');
                }).catch(err => {
                  showMessage('网络错误', 'error');
                });
            }

            cancelBtn.addEventListener('click', closeDialog);
            confirmBtn.addEventListener('click', doExport);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

            // 回车确认
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') doExport();
              if (e.key === 'Escape') closeDialog();
            });
          }

          // 更新待审核数量徽章
          function updatePendingBadge(count) {
            const badge = document.getElementById('pendingBadge');
            if (badge) {
              badge.textContent = count;
              badge.style.display = count > 0 ? 'block' : 'none';
            }
          }

          function fetchPendingConfigs(page = pendingCurrentPage) {
                  fetch(\`/api/pending?page=\${page}&pageSize=\${pendingPageSize}\`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.code === 200) {
                               pendingTotalItems = data.total;
                               pendingCurrentPage = data.page;
                               pendingTotalPagesSpan.innerText = Math.ceil(pendingTotalItems/ pendingPageSize);
                                pendingCurrentPageSpan.innerText = pendingCurrentPage;
                               allPendingConfigs = data.data;
                                 renderPendingConfig(allPendingConfigs);
                                updatePendingPaginationButtons();
                               updatePendingBadge(pendingTotalItems); // 更新徽章数量
                        } else {
                            showMessage(data.message, 'error');
                        }
                      }).catch(err => {
                      showMessage('网络错误', 'error');
                   })
          }
          
            function renderPendingConfig(configs) {
                  pendingTableBody.innerHTML = '';
                  // 重置全选复选框
                  const pendingSelectAllCheckbox = document.getElementById('pendingSelectAll');
                  if (pendingSelectAllCheckbox) pendingSelectAllCheckbox.checked = false;
                  updatePendingBatchActions();

                  if(configs.length === 0) {
                      pendingTableBody.innerHTML = '<tr><td colspan="8">没有待审核数据</td></tr>';
                      return
                  }
                configs.forEach(config => {
                    const row = document.createElement('tr');
                    const safeName = escapeHTML(config.name || '');
                    const normalizedUrl = normalizeUrl(config.url);
                    const urlCell = normalizedUrl
                      ? \`<a href="\${escapeHTML(normalizedUrl)}" target="_blank" rel="noopener noreferrer">\${escapeHTML(normalizedUrl)}</a>\`
                      : (config.url ? escapeHTML(config.url) : '未提供');
                    const normalizedLogo = normalizeUrl(config.logo);
                    const logoCell = normalizedLogo
                      ? \`<img src="\${escapeHTML(normalizedLogo)}" alt="\${safeName}" style="width:30px;" />\`
                      : 'N/A';
                    const descCell = config.desc ? escapeHTML(config.desc) : 'N/A';
                    const catelogCell = escapeHTML(config.catelog || '');
                    row.innerHTML = \`
                      <td><input type="checkbox" class="pending-row-checkbox" data-id="\${config.id}"></td>
                      <td>\${config.id}</td>
                       <td>\${safeName}</td>
                       <td>\${urlCell}</td>
                       <td>\${logoCell}</td>
                       <td>\${descCell}</td>
                       <td>\${catelogCell}</td>
                        <td class="actions">
                            <div class="actions-buttons">
                              <button class="approve-btn" data-id="\${config.id}">批准</button>
                              <button class="reject-btn" data-id="\${config.id}">拒绝</button>
                            </div>
                        </td>
                      \`;
                    pendingTableBody.appendChild(row);
                });
                bindPendingActionEvents();
                bindPendingCheckboxEvents();
            }
           function bindPendingActionEvents() {
               document.querySelectorAll('.approve-btn').forEach(btn => {
                   btn.addEventListener('click', function() {
                       const id = this.dataset.id;
                       handleApprove(id);
                   })
               });
              document.querySelectorAll('.reject-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                         const id = this.dataset.id;
                         handleReject(id);
                     })
              })
           }

          async function handleApprove(id) {
             // 先获取待审核数据，检查 URL 是否已存在
             try {
                 const pendingRes = await fetch(\`/api/pending\`);
                 const pendingData = await pendingRes.json();
                 const pendingItem = pendingData.data?.find(item => item.id == id);

                 if (!pendingItem) {
                     showMessage('找不到待审核项', 'error');
                     return;
                 }

                 // 检查 URL 是否已存在
                 const checkRes = await fetch(\`/api/check-url?url=\${encodeURIComponent(pendingItem.url)}\`);
                 const checkData = await checkRes.json();

                 if (checkData.exists) {
                     // URL 已存在，弹窗让用户选择
                     const existingSite = checkData.duplicateSite;
                     const action = await showUrlDuplicateDialog(pendingItem, existingSite);

                     if (!action) return; // 用户取消

                     // 根据选择执行不同操作
                     await executeApprove(id, action);
                 } else {
                     // URL 不存在，正常批准
                     const confirmed = await showConfirm('确定批准该站点吗？', { title: '批准确认', type: 'success' });
                     if (!confirmed) return;
                     await executeApprove(id);
                 }
             } catch (err) {
                 showMessage('检查失败：' + err.message, 'error');
             }
          }

          // 显示 URL 重复对话框
          async function showUrlDuplicateDialog(pendingItem, existingSite) {
             return new Promise((resolve) => {
                 const overlay = document.createElement('div');
                 overlay.className = 'custom-dialog-overlay active';
                 overlay.innerHTML = \`
                     <div class="custom-dialog" style="min-width: 400px;">
                         <div class="custom-dialog-title">
                             <span class="icon warning">⚠️</span>
                             <span>URL 已存在</span>
                         </div>
                         <div class="custom-dialog-message">
                             <p style="margin-bottom: 12px;">待审核书签的 URL 与已有书签重复：</p>
                             <div style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
                                 <p style="margin: 0 0 8px;"><strong>待审核：</strong>\${pendingItem.name}</p>
                                 <p style="margin: 0 0 8px; color: #666; font-size: 12px;">\${pendingItem.url}</p>
                                 <p style="margin: 0 0 8px;"><strong>已存在：</strong>\${existingSite.name} (ID: \${existingSite.id})</p>
                             </div>
                             <p style="color: #666; font-size: 13px;">请选择操作方式：</p>
                         </div>
                         <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px;">
                             <button class="dialog-cancel-btn" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">取消</button>
                             <button class="dialog-update-btn" style="padding: 8px 16px; border: none; background: #3b82f6; color: white; border-radius: 6px; cursor: pointer;">更新已有</button>
                             <button class="dialog-force-btn" style="padding: 8px 16px; border: none; background: #f59e0b; color: white; border-radius: 6px; cursor: pointer;">强制添加</button>
                         </div>
                     </div>
                 \`;
                 document.body.appendChild(overlay);

                 overlay.querySelector('.dialog-cancel-btn').onclick = () => {
                     overlay.remove();
                     resolve(null);
                 };
                 overlay.querySelector('.dialog-update-btn').onclick = () => {
                     overlay.remove();
                     resolve('update');
                 };
                 overlay.querySelector('.dialog-force-btn').onclick = () => {
                     overlay.remove();
                     resolve('force');
                 };
             });
          }

          // 执行批准操作
          async function executeApprove(id, action = null) {
             let url = \`/api/pending/\${id}\`;
             if (action) {
                 url += \`?action=\${action}\`;
             }

             try {
                 const res = await fetch(url, { method: 'PUT' });
                 const data = await res.json();

                 if (data.code === 200) {
                     // [新增] 将新书签ID添加到高亮集合
                     if (data.newSiteId) {
                       highlightedIds.add(data.newSiteId);
                     }
                     const idMsg = data.newSiteId ? '，ID: ' + data.newSiteId : '';
                     const msg = action === 'update' ? '书签更新成功' :
                                 action === 'force' ? '强制添加成功' + idMsg : '批准成功' + idMsg;
                     showMessage(msg, 'success');
                     fetchPendingConfigs();
                     fetchConfigs();
                 } else if (data.code === 409) {
                     // 仍然返回 409，说明需要用户确认
                     showMessage(data.message, 'warning');
                 } else {
                     showMessage(data.message, 'error');
                 }
             } catch (err) {
                 showMessage('网络错误', 'error');
             }
          }
           async function handleReject(id) {
               const confirmed = await showConfirm('确定拒绝该站点吗？', { title: '拒绝确认', type: 'error' });
               if (!confirmed) return;
              fetch(\`/api/pending/\${id}\`, {
                     method: 'DELETE'
                }).then(res => res.json())
                   .then(data => {
                     if(data.code === 200) {
                         showMessage('拒绝成功', 'success');
                        fetchPendingConfigs();
                    } else {
                       showMessage(data.message, 'error');
                   }
                  }).catch(err => {
                        showMessage('网络错误', 'error');
                })
           }

          // ========== 待审核批量操作 ==========
          // 获取选中的待审核 ID
          function getPendingSelectedIds() {
              const checkboxes = document.querySelectorAll('.pending-row-checkbox:checked');
              return Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
          }

          // 更新批量操作工具栏状态
          function updatePendingBatchActions() {
              const count = getPendingSelectedIds().length;
              const countEl = document.getElementById('pendingSelectedCount');
              const batchActions = document.getElementById('pendingBatchActions');
              if (countEl) countEl.textContent = count;
              if (batchActions) batchActions.classList.toggle('show', count > 0);

              // 更新全选复选框状态
              const pendingSelectAllCheckbox = document.getElementById('pendingSelectAll');
              const totalCheckboxes = document.querySelectorAll('.pending-row-checkbox').length;
              if (pendingSelectAllCheckbox) {
                  pendingSelectAllCheckbox.checked = count > 0 && count === totalCheckboxes;
              }
          }

          // 绑定待审核复选框事件
          function bindPendingCheckboxEvents() {
              // 单行复选框变化
              document.querySelectorAll('.pending-row-checkbox').forEach(checkbox => {
                  checkbox.addEventListener('change', updatePendingBatchActions);
              });
          }

          // 批量批准
          async function handlePendingBatchApprove() {
              const ids = getPendingSelectedIds();
              if (ids.length === 0) {
                  showMessage('请先选择要批准的项', 'warning');
                  return;
              }

              const confirmed = await showConfirm(\`确认批准选中的 \${ids.length} 个待审核项吗？<br><small style="color:#666;">如遇重复URL将自动强制添加</small>\`, { title: '批量批准确认', type: 'success' });
              if (!confirmed) return;

              let successCount = 0;
              let failCount = 0;
              let duplicateCount = 0;

              for (const id of ids) {
                  try {
                      // 先尝试正常批准
                      let res = await fetch(\`/api/pending/\${id}\`, { method: 'PUT' });
                      let data = await res.json();

                      // 如果是 URL 重复，自动强制添加
                      if (data.code === 409) {
                          res = await fetch(\`/api/pending/\${id}?action=force\`, { method: 'PUT' });
                          data = await res.json();
                          if (data.code === 200) {
                              duplicateCount++;
                              successCount++;
                          } else {
                              failCount++;
                          }
                      } else if (data.code === 200) {
                          successCount++;
                      } else {
                          failCount++;
                      }
                  } catch (err) {
                      failCount++;
                  }
              }

              if (successCount > 0) {
                  let msg = \`成功批准 \${successCount} 个待审核项\`;
                  if (duplicateCount > 0) {
                      msg += \`（其中 \${duplicateCount} 个为强制添加）\`;
                  }
                  showMessage(msg, 'success');
              }
              if (failCount > 0) {
                  showMessage(\`\${failCount} 个项批准失败\`, 'error');
              }

              fetchPendingConfigs();
              fetchConfigs();
          }

          // 批量拒绝
          async function handlePendingBatchReject() {
              const ids = getPendingSelectedIds();
              if (ids.length === 0) {
                  showMessage('请先选择要拒绝的项', 'warning');
                  return;
              }

              const confirmed = await showConfirm(\`确认拒绝选中的 \${ids.length} 个待审核项吗？\`, { title: '批量拒绝确认', type: 'error' });
              if (!confirmed) return;

              let successCount = 0;
              let failCount = 0;

              for (const id of ids) {
                  try {
                      const res = await fetch(\`/api/pending/\${id}\`, { method: 'DELETE' });
                      const data = await res.json();
                      if (data.code === 200) {
                          successCount++;
                      } else {
                          failCount++;
                      }
                  } catch (err) {
                      failCount++;
                  }
              }

              if (successCount > 0) {
                  showMessage(\`成功拒绝 \${successCount} 个待审核项\`, 'success');
              }
              if (failCount > 0) {
                  showMessage(\`\${failCount} 个项拒绝失败\`, 'error');
              }

              fetchPendingConfigs();
          }

          // 取消选择
          function handlePendingBatchCancel() {
              document.querySelectorAll('.pending-row-checkbox').forEach(cb => cb.checked = false);
              const pendingSelectAllCheckbox = document.getElementById('pendingSelectAll');
              if (pendingSelectAllCheckbox) pendingSelectAllCheckbox.checked = false;
              updatePendingBatchActions();
          }

          // 全选/取消全选
          const pendingSelectAllCheckbox = document.getElementById('pendingSelectAll');
          if (pendingSelectAllCheckbox) {
              pendingSelectAllCheckbox.addEventListener('change', function() {
                  const isChecked = this.checked;
                  document.querySelectorAll('.pending-row-checkbox').forEach(cb => cb.checked = isChecked);
                  updatePendingBatchActions();
              });
          }

          // 批量操作按钮事件绑定
          const pendingBatchCancelBtn = document.getElementById('pendingBatchCancelBtn');
          if (pendingBatchCancelBtn) {
              pendingBatchCancelBtn.addEventListener('click', handlePendingBatchCancel);
          }

          const pendingBatchApproveBtn = document.getElementById('pendingBatchApproveBtn');
          if (pendingBatchApproveBtn) {
              pendingBatchApproveBtn.addEventListener('click', handlePendingBatchApprove);
          }

          const pendingBatchRejectBtn = document.getElementById('pendingBatchRejectBtn');
          if (pendingBatchRejectBtn) {
              pendingBatchRejectBtn.addEventListener('click', handlePendingBatchReject);
          }

          function updatePendingPaginationButtons() {
              const totalPages = Math.ceil(pendingTotalItems / pendingPageSize);
              pendingPrevPageBtn.disabled = pendingCurrentPage === 1;
              pendingNextPageBtn.disabled = pendingCurrentPage >= totalPages;
              // 总数 ≤ pageSize 时隐藏分页
              const pagination = document.getElementById('pendingPagination');
              if (pagination) {
                pagination.style.display = pendingTotalItems <= pendingPageSize ? 'none' : 'flex';
              }
           }
          
           pendingPrevPageBtn.addEventListener('click', () => {
               if (pendingCurrentPage > 1) {
                   fetchPendingConfigs(pendingCurrentPage - 1);
               }
           });
            pendingNextPageBtn.addEventListener('click', () => {
               if (pendingCurrentPage < Math.ceil(pendingTotalItems/pendingPageSize)) {
                   fetchPendingConfigs(pendingCurrentPage + 1)
               }
            });
          
          fetchConfigs();
          fetchPendingConfigs();
          if (categoryTableBody) {
            fetchCategories();
          }
          `
    }
    return fileContents[filePath]
    },
  
    async renderAdminPage() {
    const html = await this.getFileContent('admin.html');
    return new Response(html, {
        headers: {'Content-Type': 'text/html; charset=utf-8'}
    });
    },
  
    async renderLoginPage(message = '') {
      const hasError = Boolean(message);
      const safeMessage = hasError ? escapeHTML(message) : '';
      const html = `<!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>管理员登录 - 拾光集</title>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236c8fba'/%3E%3Cstop offset='100%25' stop-color='%23305580'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23f59e0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='2' y='2' width='28' height='28' rx='6' fill='url(%23a)'/%3E%3Cpath d='M8 20 L8 14 Q8 11 11 11 L21 11 Q24 11 24 14 L24 20' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='3' fill='url(%23b)'/%3E%3Cg stroke='%23fbbf24' stroke-width='1.5' stroke-linecap='round' opacity='0.9'%3E%3Cline x1='16' y1='9' x2='16' y2='6'/%3E%3Cline x1='11' y1='10.5' x2='9' y2='8.5'/%3E%3Cline x1='21' y1='10.5' x2='23' y2='8.5'/%3E%3C/g%3E%3Ccircle cx='12' cy='8' r='1' fill='%23fcd34d' opacity='0.7'/%3E%3Ccircle cx='20' cy='9' r='0.8' fill='%23fcd34d' opacity='0.5'/%3E%3C/svg%3E" type="image/svg+xml"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
          }

          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(180deg, #1e3c72 0%, #2a5298 50%, #3390ec 100%);
            padding: 1rem;
            position: relative;
            overflow: hidden;
          }

          /* Telegram 风格云朵背景 */
          .clouds {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            overflow: hidden;
          }

          .cloud {
            position: absolute;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
            filter: blur(1px);
          }

          .cloud::before, .cloud::after {
            content: '';
            position: absolute;
            background: inherit;
            border-radius: 50%;
          }

          .cloud-1 {
            width: 200px;
            height: 60px;
            top: 10%;
            left: -100px;
            animation: cloudMove 35s linear infinite;
          }
          .cloud-1::before { width: 80px; height: 80px; top: -40px; left: 40px; }
          .cloud-1::after { width: 100px; height: 100px; top: -50px; left: 80px; }

          .cloud-2 {
            width: 150px;
            height: 50px;
            top: 25%;
            left: -75px;
            animation: cloudMove 45s linear infinite;
            animation-delay: -10s;
          }
          .cloud-2::before { width: 60px; height: 60px; top: -30px; left: 30px; }
          .cloud-2::after { width: 80px; height: 80px; top: -40px; left: 60px; }

          .cloud-3 {
            width: 180px;
            height: 55px;
            top: 60%;
            left: -90px;
            animation: cloudMove 40s linear infinite;
            animation-delay: -20s;
          }
          .cloud-3::before { width: 70px; height: 70px; top: -35px; left: 35px; }
          .cloud-3::after { width: 90px; height: 90px; top: -45px; left: 75px; }

          .cloud-4 {
            width: 120px;
            height: 40px;
            top: 75%;
            left: -60px;
            animation: cloudMove 50s linear infinite;
            animation-delay: -5s;
          }
          .cloud-4::before { width: 50px; height: 50px; top: -25px; left: 25px; }
          .cloud-4::after { width: 65px; height: 65px; top: -32px; left: 50px; }

          .cloud-5 {
            width: 160px;
            height: 48px;
            top: 45%;
            left: -80px;
            animation: cloudMove 55s linear infinite;
            animation-delay: -30s;
          }
          .cloud-5::before { width: 65px; height: 65px; top: -32px; left: 32px; }
          .cloud-5::after { width: 85px; height: 85px; top: -42px; left: 70px; }

          @keyframes cloudMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(100vw + 300px)); }
          }

          .login-container {
            background: white;
            padding: 2.5rem 2rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            width: 100%;
            max-width: 380px;
            position: relative;
            z-index: 1;
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .logo-section {
            text-align: center;
            margin-bottom: 2rem;
          }

          .logo-icon {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, #3390ec 0%, #2b7fd4 100%);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            box-shadow: 0 4px 16px rgba(51, 144, 236, 0.3);
          }

          .logo-icon svg {
            width: 36px;
            height: 36px;
            color: white;
          }

          .login-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 0 0.25rem 0;
            color: #222;
          }

          .login-subtitle {
            font-size: 0.875rem;
            color: #707579;
            margin: 0;
          }

          .form-group {
            margin-bottom: 1.25rem;
            position: relative;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            font-size: 0.875rem;
            color: #707579;
          }

          .input-wrapper {
            position: relative;
          }

          .input-wrapper svg {
            position: absolute;
            left: 0.875rem;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #a4acb5;
            transition: color 0.2s;
          }

          input[type="text"], input[type="password"] {
            width: 100%;
            padding: 0.875rem 1rem 0.875rem 2.75rem;
            border: 2px solid #dadce0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.2s;
            background: #fff;
            color: #222;
          }

          input::placeholder {
            color: #a4acb5;
          }

          input:focus {
            border-color: #3390ec;
            background: white;
            outline: none;
            box-shadow: 0 0 0 3px rgba(51, 144, 236, 0.15);
          }

          input:focus + svg, .input-wrapper:focus-within svg {
            color: #3390ec;
          }

          button {
            width: 100%;
            padding: 0.875rem;
            background: #3390ec;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
          }

          button:hover {
            background: #2b7fd4;
          }

          button:active {
            transform: scale(0.98);
          }

          button:disabled {
            background: #a4acb5;
            cursor: not-allowed;
            transform: none;
          }

          button.loading {
            position: relative;
            color: transparent;
          }

          button.loading::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin-left: -10px;
            margin-top: -10px;
            border: 2px solid transparent;
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .error-message {
            color: #db4437;
            font-size: 0.875rem;
            margin-top: 0.75rem;
            text-align: center;
            display: none;
            padding: 0.625rem;
            background: rgba(219, 68, 55, 0.08);
            border-radius: 8px;
          }

          .divider {
            display: flex;
            align-items: center;
            margin: 1.25rem 0;
            color: #a4acb5;
            font-size: 0.8125rem;
          }

          .divider::before, .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #dadce0;
          }

          .divider span {
            padding: 0 0.875rem;
          }

          .back-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.625rem;
            color: #3390ec;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 10px;
            transition: background 0.2s;
          }

          .back-link:hover {
            background: rgba(51, 144, 236, 0.08);
          }

          .back-link svg {
            width: 18px;
            height: 18px;
            margin-right: 0.5rem;
          }

          @media (max-width: 480px) {
            .login-container {
              padding: 2rem 1.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="clouds">
          <div class="cloud cloud-1"></div>
          <div class="cloud cloud-2"></div>
          <div class="cloud cloud-3"></div>
          <div class="cloud cloud-4"></div>
          <div class="cloud cloud-5"></div>
        </div>
        <div class="login-container">
          <div class="logo-section">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 class="login-title">管理员登录</h1>
            <p class="login-subtitle">登录拾光集管理后台</p>
          </div>
          <form method="post" action="/admin" novalidate>
            <div class="form-group">
              <label for="username">用户名</label>
              <div class="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input type="text" id="username" name="name" required autocomplete="username" placeholder="请输入用户名">
              </div>
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <div class="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="请输入密码">
              </div>
            </div>
            ${hasError ? `<div class="error-message" style="display:block;">${safeMessage}</div>` : ''}
            <button type="submit" id="loginBtn">登 录</button>
          </form>
          <script>
            const form = document.querySelector('form');
            const btn = document.getElementById('loginBtn');
            const errorDiv = document.querySelector('.error-message');

            form.addEventListener('submit', function() {
              btn.disabled = true;
              btn.classList.add('loading');
              btn.textContent = '登录中...';
              if (errorDiv) errorDiv.style.display = 'none';
            });
          </script>
          <div class="divider"><span>或</span></div>
          <a href="/" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </a>
        </div>
      </body>
      </html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  };
  
  
  /**
   * 优化后的主逻辑：处理请求，返回优化后的 HTML
   */
  async function handleRequest(request, env, ctx) {
    const url = new URL(request.url);
    const catalog = url.searchParams.get('catalog');

    // 【书签隐藏功能】检测是否管理员登录，管理员显示所有书签
    const isAdmin = await isAdminAuthenticated(request, env);
    const hiddenFilter = isAdmin ? '' : 'WHERE (hidden IS NULL OR hidden = 0)';

    let sites = [];
    try {
      const { results } = await env.NAV_DB.prepare(`SELECT * FROM sites ${hiddenFilter} ORDER BY CASE WHEN sort_order >= 9999 THEN 0 ELSE 1 END, CASE WHEN sort_order >= 9999 THEN -strftime('%s', create_time) ELSE sort_order END ASC`).all();
      sites = results;
    } catch (e) {
      return new Response(`Failed to fetch data: ${e.message}`, { status: 500 });
    }

    const totalSites = sites.length;
    // 获取所有分类
    const categoryMinSort = new Map();
    const categorySet = new Set();
    sites.forEach((site) => {
      const categoryName = (site.catelog || '').trim() || '未分类';
      categorySet.add(categoryName);
      const rawSort = Number(site.sort_order);
      const normalized = Number.isFinite(rawSort) ? rawSort : 9999;
      if (!categoryMinSort.has(categoryName) || normalized < categoryMinSort.get(categoryName)) {
        categoryMinSort.set(categoryName, normalized);
      }
    });

    const categoryOrderMap = new Map();
    try {
      const { results: orderRows } = await env.NAV_DB.prepare('SELECT catelog, sort_order FROM category_orders').all();
      orderRows.forEach(row => {
        categoryOrderMap.set(row.catelog, normalizeSortOrder(row.sort_order));
      });
    } catch (error) {
      if (!/no such table/i.test(error.message || '')) {
        return new Response(`Failed to fetch category orders: ${error.message}`, { status: 500 });
      }
    }

    const catalogsWithMeta = Array.from(categorySet).map((name) => {
      const fallbackSort = categoryMinSort.has(name) ? normalizeSortOrder(categoryMinSort.get(name)) : 9999;
      const order = categoryOrderMap.has(name) ? categoryOrderMap.get(name) : fallbackSort;
      return {
        name,
        order,
        fallback: fallbackSort,
      };
    });

    catalogsWithMeta.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      if (a.fallback !== b.fallback) {
        return a.fallback - b.fallback;
      }
      return a.name.localeCompare(b.name, 'zh-Hans-CN', { sensitivity: 'base' });
    });

    const catalogs = catalogsWithMeta.map(item => item.name);

    // 根据 URL 参数确定当前分类（用于侧边栏高亮和标题）
    const requestedCatalog = (catalog || '').trim();
    const catalogExists = Boolean(requestedCatalog && catalogs.includes(requestedCatalog));
    const currentCatalog = catalogExists ? requestedCatalog : '';
    // 始终渲染所有书签，客户端通过 CSS hidden 过滤
    const currentSites = sites;
    const catalogLinkMarkup = catalogs.map((cat) => {
      const safeCat = escapeHTML(cat);
      const isActive = catalogExists && cat === currentCatalog;
      const linkClass = isActive ? 'bg-secondary-100 text-primary-700 catalog-link active' : 'hover:bg-gray-100 catalog-link';
      const iconClass = isActive ? 'text-primary-600' : 'text-gray-400';
      const catCount = sites.filter((s) => {
        const catValue = (s.catelog || '').trim() || '未分类';
        return catValue === cat;
      }).length;
      const badgeClass = isActive ? 'bg-primary-200 text-primary-700' : 'bg-gray-200 text-gray-600';
      return `
        <a href="javascript:void(0)" data-catalog="${safeCat}" class="flex items-center justify-between px-3 py-2 rounded-xl ${linkClass} w-full group transition-all duration-200">
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 ${iconClass} catalog-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="text-sm">${safeCat}</span>
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full ${badgeClass} font-medium catalog-badge">${catCount}</span>
        </a>
      `;
    }).join('');

    const currentCatalogCount = catalogExists
      ? sites.filter((s) => {
          const catValue = (s.catelog || '').trim() || '未分类';
          return catValue === currentCatalog;
        }).length
      : sites.length;
    const headingPlainText = catalogExists
      ? `${currentCatalog} · ${currentCatalogCount} 个网站`
      : `全部收藏 · ${sites.length} 个网站`;
    const headingText = escapeHTML(headingPlainText);
    const headingDefaultAttr = escapeHTML(headingPlainText);
    const headingActiveAttr = catalogExists ? escapeHTML(currentCatalog) : '';
    const submissionEnabled = isSubmissionEnabled(env);

    // 优化后的 HTML
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>拾光集 - 精品网址导航</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet"/>
      <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236c8fba'/%3E%3Cstop offset='100%25' stop-color='%23305580'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23f59e0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='2' y='2' width='28' height='28' rx='6' fill='url(%23a)'/%3E%3Cpath d='M8 20 L8 14 Q8 11 11 11 L21 11 Q24 11 24 14 L24 20' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='3' fill='url(%23b)'/%3E%3Cg stroke='%23fbbf24' stroke-width='1.5' stroke-linecap='round' opacity='0.9'%3E%3Cline x1='16' y1='9' x2='16' y2='6'/%3E%3Cline x1='11' y1='10.5' x2='9' y2='8.5'/%3E%3Cline x1='21' y1='10.5' x2='23' y2='8.5'/%3E%3C/g%3E%3Ccircle cx='12' cy='8' r='1' fill='%23fcd34d' opacity='0.7'/%3E%3Ccircle cx='20' cy='9' r='0.8' fill='%23fcd34d' opacity='0.5'/%3E%3C/svg%3E" type="image/svg+xml"/>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                primary: {
                  50: '#f3f5f9',
                  100: '#e1e7f1',
                  200: '#c3d0e3',
                  300: '#9cb3d1',
                  400: '#6c8fba',
                  500: '#416d9d',
                  600: '#305580',
                  700: '#254267',
                  800: '#1d3552',
                  900: '#192e45',
                  950: '#101e2d',
                },
                secondary: {
                  50: '#fdf8f3',
                  100: '#f6ede1',
                  200: '#ead6ba',
                  300: '#dfc19a',
                  400: '#d2aa79',
                  500: '#b88d58',
                  600: '#a17546',
                  700: '#835b36',
                  800: '#6b492c',
                  900: '#5a3e26',
                  950: '#2f1f13',
                },
                accent: {
                  50: '#f2faf6',
                  100: '#d9f0e5',
                  200: '#b4dfcb',
                  300: '#89caa9',
                  400: '#61b48a',
                  500: '#3c976d',
                  600: '#2e7755',
                  700: '#265c44',
                  800: '#204b38',
                  900: '#1b3e30',
                  950: '#0e221b',
                },
              },
              fontFamily: {
                sans: ['Noto Sans SC', 'sans-serif'],
              },
            }
          }
        }
      </script>
      <style>
        /* 自定义滚动条 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #edf1f7;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c3d0e3;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #416d9d;
        }
        
        /* 卡片悬停效果 */
        .site-card {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .site-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* 复制成功提示动画 */
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .copy-success-animation {
          animation: fadeInOut 2s ease forwards;
        }
        
        /* 移动端侧边栏 */
        @media (max-width: 768px) {
          .mobile-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .mobile-sidebar.open {
            transform: translateX(0);
          }
          .mobile-overlay {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
          .mobile-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }
        }
        
        /* 多行文本截断 */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* 侧边栏控制 */
        #sidebar-toggle {
          display: none;
        }
        
        @media (min-width: 769px) {
          #sidebar-toggle:checked ~ .sidebar {
            margin-left: -16rem;
          }
          #sidebar-toggle:checked ~ .main-content {
            margin-left: 0;
          }
        }

        /* 分类输入框下拉菜单 */
        .category-input-wrapper {
          position: relative;
        }
        .category-input-wrapper input {
          padding-right: 30px;
        }
        .dropdown-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 10px;
          color: #6b7280;
          user-select: none;
          transition: color 0.2s;
        }
        .dropdown-arrow:hover {
          color: #374151;
        }
        .category-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          width: 100%;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 190px;
          overflow-y: auto;
          z-index: 1100;
          display: none;
          margin-top: 2px;
        }
        .category-dropdown.show {
          display: block;
        }
        .category-dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          transition: background 0.15s;
          font-size: 14px;
        }
        .category-dropdown-item:hover {
          background: #fef3e2;
          color: #d97706;
        }

      </style>
    </head>
    <body class="bg-primary-50 font-sans text-gray-800">
      <!-- 侧边栏开关 -->
      <input type="checkbox" id="sidebar-toggle" class="hidden">
      
      <!-- 移动端导航按钮 -->
      <div class="fixed top-4 left-4 z-50 lg:hidden">
        <button id="sidebarToggle" class="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- 移动端遮罩层 - 只在移动端显示 -->
      <div id="mobileOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 mobile-overlay lg:hidden"></div>
      
      <!-- 桌面侧边栏开关按钮 -->
      <div class="fixed top-4 left-4 z-50 hidden lg:block">
        <label for="sidebar-toggle" class="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 inline-block cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>
      
      <!-- 侧边栏导航 -->
      <aside id="sidebar" class="sidebar fixed left-0 top-0 h-full w-64 bg-white shadow-md border-r border-primary-100/60 z-50 overflow-y-auto mobile-sidebar lg:transform-none transition-all duration-300">
        <div class="p-6">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-primary-600 tracking-tight">拾光集</h2>
            <button id="closeSidebar" class="p-1 rounded-full hover:bg-gray-100 lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <label for="sidebar-toggle" class="p-1 rounded-full hover:bg-gray-100 hidden lg:block cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </label>
          </div>
          
          <div class="mb-6">
            <div class="relative">
              <input id="searchInput" type="text" placeholder="搜索书签..." class="w-full pl-10 pr-10 py-2.5 border border-primary-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition text-sm">
              <!-- 搜索图标 -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <!-- 清除按钮 -->
              <button id="sidebarSearchClear" type="button" class="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition hidden" aria-label="清空搜索">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">分类导航</h3>
            <div class="space-y-1">
              <a href="javascript:void(0)" data-catalog="" class="flex items-center justify-between px-3 py-2 rounded-xl ${catalogExists ? 'hover:bg-gray-100' : 'bg-secondary-100 text-primary-700'} w-full transition-all duration-200 catalog-link ${!catalogExists ? 'active' : ''}">
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 ${catalogExists ? 'text-gray-400' : 'text-primary-600'} catalog-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span class="text-sm">全部</span>
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full ${catalogExists ? 'bg-gray-200 text-gray-600' : 'bg-primary-200 text-primary-700'} font-medium catalog-badge">${totalSites}</span>
              </a>
              ${catalogLinkMarkup}
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-200">
            ${submissionEnabled ? `
            <button id="addSiteBtnSidebar" class="w-full flex items-center justify-center px-4 py-2.5 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition duration-300 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              添加新书签
            </button>` : `
            <div class="w-full px-4 py-3 text-xs text-primary-600 bg-white border border-secondary-100 rounded-xl">
              访客书签提交功能已关闭
            </div>`}

            <a href="/admin" class="mt-4 flex items-center px-4 py-2 text-gray-600 hover:text-primary-500 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              后台管理
            </a>
          </div>
        </div>
      </aside>
      
      <!-- 主内容区 -->
      <main class="main-content lg:ml-64 transition-all duration-300">
        <!-- 顶部横幅 - 精简版（固定磨砂玻璃） -->
        <header class="sticky top-0 z-20 bg-white/80 backdrop-blur-xl text-gray-800 py-4 px-6 md:px-8 border-b border-primary-100/60">
          <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <h1 class="text-xl md:text-2xl font-semibold tracking-tight truncate text-primary-700">拾光集导航</h1>
                <span class="hidden sm:inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-[10px] text-primary-600 font-medium">
                  精选 · 真实 · 有温度
                </span>
              </div>
              <p class="mt-1 text-xs md:text-sm text-gray-500 truncate">
                从效率工具到灵感站点，只为帮助你更快找到值得信赖的优质资源。
              </p>
            </div>
            <!-- 统计卡片 -->
            <div class="shrink-0 rounded-xl bg-primary-50/80 backdrop-blur-md border border-primary-100/60 px-5 py-3">
              <div class="flex items-center gap-6">
                <div class="text-center">
                  <p class="text-xl md:text-2xl font-bold text-primary-700">${totalSites}</p>
                  <p class="text-[10px] text-primary-500">书签</p>
                </div>
                <div class="w-px h-8 bg-primary-200/60"></div>
                <div class="text-center">
                  <p class="text-xl md:text-2xl font-bold text-primary-700">${catalogs.length}</p>
                  <p class="text-[10px] text-primary-500">分类</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- 网站列表 -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <!-- 当前分类/搜索提示 -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800" data-role="list-heading" data-default="${headingDefaultAttr}" data-active="${headingActiveAttr}">
              ${headingText}
            </h2>
            <div class="text-sm text-gray-500 hidden md:block">
              <script>
                 fetch('https://v1.hitokoto.cn')
                      .then(response => response.json())
                      .then(data => {
                       const hitokoto = document.getElementById('hitokoto_text')
                      hitokoto.href = 'https://hitokoto.cn/?uuid=' + data.uuid
                      hitokoto.innerText = data.hitokoto
                      })
                      .catch(console.error)
              </script>
              <div id="hitokoto"><a href="#" target="_blank" id="hitokoto_text">疏影横斜水清浅，暗香浮动月黄昏。</a></div>
            </div>
          </div>
          
          <!-- 网站卡片网格 -->
          <div class="rounded-2xl border border-primary-100/60 bg-white p-4 sm:p-6 shadow-sm">
            <div id="sitesGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              ${currentSites.length === 0 ? `
                <div class="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p class="text-lg font-medium text-gray-500">暂无书签</p>
                  <p class="text-sm mt-1">请先在后台添加书签</p>
                  <a href="/admin" class="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    前往后台添加
                  </a>
                </div>
              ` : currentSites.map((site) => {
              const rawName = site.name || '未命名';
              const rawCatalog = site.catelog || '未分类';
              const rawDesc = site.desc || '';
              const normalizedUrl = sanitizeUrl(site.url);
              const hrefValue = escapeHTML(normalizedUrl || '#');
              const displayUrlText = normalizedUrl || site.url || '';
              const safeDisplayUrl = displayUrlText ? escapeHTML(displayUrlText) : '未提供链接';
              const dataUrlAttr = escapeHTML(normalizedUrl || '');
              const logoUrl = sanitizeUrl(site.logo);
              const cardInitial = escapeHTML((rawName.trim().charAt(0) || '站').toUpperCase());
              const safeName = escapeHTML(rawName);
              const safeCatalog = escapeHTML(rawCatalog);
              const safeDesc = escapeHTML(rawDesc);
              const safeDataName = escapeHTML(site.name || '');
              const safeDataCatalog = escapeHTML(site.catelog || '');
              const hasValidUrl = Boolean(normalizedUrl);
              const isHiddenByCatalog = catalogExists && safeDataCatalog !== escapeHTML(currentCatalog);
              return `
                <div class="site-card group bg-white border border-primary-100/60 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 overflow-hidden${isHiddenByCatalog ? ' hidden' : ''}" data-id="${site.id}" data-name="${safeDataName}" data-url="${dataUrlAttr}" data-catalog="${safeDataCatalog}">
                  <div class="p-5">
                    <a href="${hrefValue}" ${hasValidUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="block">
                      <div class="flex items-start">
                        <div class="flex-shrink-0 mr-4">
                          ${
                            logoUrl
                              ? `<img src="${escapeHTML(logoUrl)}" alt="${safeName}" class="w-10 h-10 rounded-lg object-cover bg-gray-100" onerror="this.style.display='none';this.parentElement.querySelector('.fallback-icon').style.display='flex';"><div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-semibold text-lg shadow-inner fallback-icon" style="display:none">${cardInitial}</div>`
                              : `<div class="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-semibold text-lg shadow-inner">${cardInitial}</div>`
                          }
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="text-base font-medium text-gray-900 truncate" title="${safeName}">${safeName}</h3>
                          <span class="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-secondary-100 text-primary-700">
                            ${safeCatalog}
                          </span>
                        </div>
                      </div>
                      
                      <p class="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-1 min-h-[20px]" title="${safeDesc}">${safeDesc}</p>
                    </a>
                    
                    <div class="mt-3 flex items-center justify-between">
                      <span class="text-xs text-primary-600 truncate max-w-[140px]" title="${safeDisplayUrl}">${safeDisplayUrl}</span>
                      <button class="copy-btn flex items-center px-2 py-1 ${hasValidUrl ? 'bg-accent-100 text-accent-700 hover:bg-accent-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} rounded-full text-xs font-medium transition-all duration-200" data-url="${dataUrlAttr}" ${hasValidUrl ? '' : 'disabled'}>
                        <svg class="copy-icon h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <svg class="check-icon h-3 w-3 mr-1 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="copy-text">复制</span>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
            </div>
          </div>
        </section>
        
        <!-- 页脚 -->
        <footer class="py-8 px-6 mt-12">
          <div class="max-w-5xl mx-auto text-center">
            <p class="text-gray-400 text-sm">© ${new Date().getFullYear()} 拾光集 | 愿你在此找到方向</p>
          </div>
        </footer>
      </main>
      
      <!-- 返回顶部按钮 -->
      <button id="backToTop" class="fixed bottom-8 right-8 p-3 rounded-full bg-accent-500 text-white shadow-lg opacity-0 invisible transition-all duration-300 hover:bg-accent-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
        </svg>
      </button>
      
      ${submissionEnabled ? `
      <!-- 添加网站模态框 -->
      <div id="addSiteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 opacity-0 invisible transition-all duration-300">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform translate-y-8 transition-all duration-300">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">添加新书签</h2>
              <button id="closeModal" class="text-gray-400 hover:text-gray-500">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form id="addSiteForm" class="space-y-4">
              <div>
                <label for="addSiteName" class="block text-sm font-medium text-gray-700">名称</label>
                <input type="text" id="addSiteName" required placeholder="例如：GitHub" class="mt-1 block w-full px-3 py-2 border border-primary-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 placeholder:text-gray-300 placeholder:text-xs">
              </div>

              <div>
                <label for="addSiteUrl" class="block text-sm font-medium text-gray-700">网址</label>
                <input type="text" id="addSiteUrl" required placeholder="https://example.com" class="mt-1 block w-full px-3 py-2 border border-primary-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 placeholder:text-gray-300 placeholder:text-xs">
              </div>

              <div>
                <label for="addSiteLogo" class="block text-sm font-medium text-gray-700">Logo (可选)</label>
                <input type="text" id="addSiteLogo" placeholder="留空自动获取网站图标" class="mt-1 block w-full px-3 py-2 border border-primary-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 placeholder:text-gray-300 placeholder:text-xs">
              </div>

              <div>
                <label for="addSiteDesc" class="block text-sm font-medium text-gray-700">描述 (可选)</label>
                <textarea id="addSiteDesc" rows="2" placeholder="简短描述这个网站的用途" class="mt-1 block w-full px-3 py-2 border border-primary-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 placeholder:text-gray-300 placeholder:text-xs"></textarea>
              </div>

              <div>
                <label for="addSiteCatelog" class="block text-sm font-medium text-gray-700">分类</label>
                <div class="category-input-wrapper mt-1">
                  <input type="text" id="addSiteCatelog" required placeholder="选择或输入分类名称" class="block w-full px-3 py-2 border border-primary-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 placeholder:text-gray-300 placeholder:text-xs" autocomplete="off">
                  <span id="addSiteCategoryDropdownBtn" class="dropdown-arrow" title="选择分类">▼</span>
                  <div id="addSiteCategoryDropdown" class="category-dropdown"></div>
                </div>
              </div>
              
              <div class="flex justify-end pt-4">
                <button type="button" id="cancelAddSite" class="bg-white py-2 px-4 border border-primary-100 rounded-md shadow-sm text-sm font-medium text-primary-600 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200 mr-3">
                  取消
                </button>
                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-400">
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      ` : ''}
      
      <script>
        // 管理员登录状态（由服务端注入）
        window.IS_ADMIN = ${isAdmin ? 'true' : 'false'};

        // 统一 Toast 模块
        const Toast = {
          show(message, type = 'info', duration = 2000) {
            const toast = document.createElement('div');
            toast.className = \`toast toast-\${type}\`;
            toast.textContent = message;
            document.body.appendChild(toast);

            requestAnimationFrame(() => {
              toast.classList.add('show');
            });

            setTimeout(() => {
              toast.classList.remove('show');
              setTimeout(() => {
                toast.remove();
              }, 300);
            }, duration);
          },
          success(msg, duration) { this.show(msg, 'success', duration); },
          error(msg, duration) { this.show(msg, 'error', duration); },
          warning(msg, duration) { this.show(msg, 'warning', duration); },
          info(msg, duration) { this.show(msg, 'info', duration); }
        };

        // 向后兼容
        window.showToast = (msg, type = 'error') => Toast.show(msg, type);
        window.showMessage = (msg, type = 'error') => Toast.show(msg, type);

        document.addEventListener('DOMContentLoaded', function() {
          // 侧边栏控制
          const sidebar = document.getElementById('sidebar');
          const mobileOverlay = document.getElementById('mobileOverlay');
          const sidebarToggle = document.getElementById('sidebarToggle');
          const closeSidebar = document.getElementById('closeSidebar');
          
          function openSidebar() {
            sidebar.classList.add('open');
            mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          }
          
          function closeSidebarMenu() {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
          }
          
          if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
          if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarMenu);
          if (mobileOverlay) mobileOverlay.addEventListener('click', closeSidebarMenu);

          // 客户端分类切换（无页面刷新）
          const catalogLinks = document.querySelectorAll('.catalog-link');
          const siteCards = document.querySelectorAll('.site-card');
          const heading = document.querySelector('[data-role="list-heading"]');
          const searchInput = document.getElementById('searchInput');
          let activeCatalog = '${catalogExists ? escapeHTML(currentCatalog) : ''}';

          function updateActiveLink(catalogName) {
            catalogLinks.forEach(link => {
              const linkCatalog = link.dataset.catalog;
              const isActive = (!catalogName && linkCatalog === '') || (linkCatalog === catalogName);
              link.classList.toggle('bg-secondary-100', isActive);
              link.classList.toggle('text-primary-700', isActive);
              link.classList.toggle('hover:bg-gray-100', !isActive);
              link.classList.toggle('active', isActive);
              const icon = link.querySelector('.catalog-icon');
              if (icon) {
                icon.classList.toggle('text-primary-600', isActive);
                icon.classList.toggle('text-gray-400', !isActive);
              }
              const badge = link.querySelector('.catalog-badge');
              if (badge) {
                badge.classList.toggle('bg-primary-200', isActive);
                badge.classList.toggle('text-primary-700', isActive);
                badge.classList.toggle('bg-gray-200', !isActive);
                badge.classList.toggle('text-gray-600', !isActive);
              }
            });
          }

          function switchCatalog(catalogName) {
            activeCatalog = catalogName;
            if (searchInput) searchInput.value = '';
            const sidebarSearchClear = document.getElementById('sidebarSearchClear');
            if (sidebarSearchClear) sidebarSearchClear.classList.add('hidden');

            siteCards.forEach(card => {
              if (!catalogName || card.dataset.catalog === catalogName) {
                card.classList.remove('hidden');
              } else {
                card.classList.add('hidden');
              }
            });

            const visibleCount = document.querySelectorAll('.site-card:not(.hidden)').length;
            if (heading) {
              if (catalogName) {
                heading.textContent = catalogName + ' · ' + visibleCount + ' 个网站';
                heading.dataset.active = catalogName;
              } else {
                heading.textContent = '全部收藏 · ' + visibleCount + ' 个网站';
                heading.dataset.active = '';
              }
            }

            updateActiveLink(catalogName);

            const newUrl = catalogName ? '?catalog=' + encodeURIComponent(catalogName) : window.location.pathname;
            history.pushState({ catalog: catalogName }, '', newUrl);

            window.scrollTo({ top: 0, behavior: 'smooth' });
          }

          catalogLinks.forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              switchCatalog(this.dataset.catalog);
            });
          });

          window.addEventListener('popstate', function(e) {
            const catalogName = e.state && e.state.catalog !== undefined ? e.state.catalog : '';
            activeCatalog = catalogName;
            if (searchInput) searchInput.value = '';
            siteCards.forEach(card => {
              if (!catalogName || card.dataset.catalog === catalogName) {
                card.classList.remove('hidden');
              } else {
                card.classList.add('hidden');
              }
            });
            updateActiveLink(catalogName);
            const visibleCount = document.querySelectorAll('.site-card:not(.hidden)').length;
            if (heading) {
              if (catalogName) {
                heading.textContent = catalogName + ' · ' + visibleCount + ' 个网站';
              } else {
                heading.textContent = '全部收藏 · ' + visibleCount + ' 个网站';
              }
            }
          });

          // 复制链接功能
          document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              const url = this.getAttribute('data-url');
              if (!url || this.disabled) {
                return;
              }

              const copyIcon = this.querySelector('.copy-icon');
              const checkIcon = this.querySelector('.check-icon');
              const copyText = this.querySelector('.copy-text');

              const showSuccess = () => {
                // 切换到成功状态
                copyIcon.classList.add('hidden');
                checkIcon.classList.remove('hidden');
                copyText.textContent = '已复制';
                this.classList.remove('bg-accent-100', 'text-accent-700', 'hover:bg-accent-200');
                this.classList.add('bg-green-100', 'text-green-700');

                // 1.5秒后恢复
                setTimeout(() => {
                  copyIcon.classList.remove('hidden');
                  checkIcon.classList.add('hidden');
                  copyText.textContent = '复制';
                  this.classList.remove('bg-green-100', 'text-green-700');
                  this.classList.add('bg-accent-100', 'text-accent-700', 'hover:bg-accent-200');
                }, 1500);
              };

              navigator.clipboard.writeText(url).then(showSuccess).catch(err => {
                console.error('复制失败:', err);
                // 备用复制方法
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                  document.execCommand('copy');
                  showSuccess();
                } catch (e) {
                  console.error('备用复制也失败了:', e);
                  Toast.show('复制失败，请手动复制', 'error');
                }
                document.body.removeChild(textarea);
              });
            });
          });
          
          // 返回顶部按钮
          const backToTop = document.getElementById('backToTop');
          
          window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
              backToTop.classList.remove('opacity-0', 'invisible');
            } else {
              backToTop.classList.add('opacity-0', 'invisible');
            }
          });
          
          if (backToTop) {
            backToTop.addEventListener('click', function() {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            });
          }
          
          // 添加网站模态框
          const addSiteModal = document.getElementById('addSiteModal');
          const addSiteBtnSidebar = document.getElementById('addSiteBtnSidebar');
          const closeModalBtn = document.getElementById('closeModal');
          const cancelAddSite = document.getElementById('cancelAddSite');
          const addSiteForm = document.getElementById('addSiteForm');
          
          function openModal() {
            if (addSiteModal) {
              addSiteModal.classList.remove('opacity-0', 'invisible');
              const modalContent = addSiteModal.querySelector('.max-w-md');
              if (modalContent) modalContent.classList.remove('translate-y-8');
              document.body.style.overflow = 'hidden';
              // 自动聚焦到第一个输入框
              setTimeout(() => {
                const firstInput = document.getElementById('addSiteName');
                if (firstInput) firstInput.focus();
              }, 100);
            }
          }
          
          function closeModal() {
            if (addSiteModal) {
              addSiteModal.classList.add('opacity-0', 'invisible');
              const modalContent = addSiteModal.querySelector('.max-w-md');
              if (modalContent) modalContent.classList.add('translate-y-8');
              document.body.style.overflow = '';
            }
          }
          
          if (addSiteBtnSidebar) {
            addSiteBtnSidebar.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              openModal();
            });
          }
          
          if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
              closeModal();
            });
          }
          
          if (cancelAddSite) {
            cancelAddSite.addEventListener('click', closeModal);
          }

          // 表单提交处理
          if (addSiteForm) {
            addSiteForm.addEventListener('submit', function(e) {
              e.preventDefault();
              
              const name = document.getElementById('addSiteName').value;
              const url = document.getElementById('addSiteUrl').value;
              const logo = document.getElementById('addSiteLogo').value;
              const desc = document.getElementById('addSiteDesc').value;
              const catelog = document.getElementById('addSiteCatelog').value;
              
              fetch('/api/config/submit', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, url, logo, desc, catelog })
              })
              .then(res => res.json())
              .then(data => {
                if (data.code === 201) {
                  // 显示成功消息
                  const successDiv = document.createElement('div');
                  successDiv.className = 'fixed top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in';
                  successDiv.textContent = '提交成功，等待管理员审核';
                  document.body.appendChild(successDiv);
                  
                  setTimeout(() => {
                    successDiv.classList.add('opacity-0');
                    setTimeout(() => {
                      if (document.body.contains(successDiv)) {
                        document.body.removeChild(successDiv);
                      }
                    }, 300);
                  }, 2500);
                  
                  closeModal();
                  addSiteForm.reset();
                } else {
                  showToast(data.message || '提交失败', 'error');
                }
              })
              .catch(err => {
                console.error('网络错误:', err);
                showToast('网络错误，请稍后重试', 'error');
              });
            });
          }

          // 首页分类下拉菜单初始化
          function initAddSiteCategoryDropdown() {
            const btn = document.getElementById('addSiteCategoryDropdownBtn');
            const dropdown = document.getElementById('addSiteCategoryDropdown');
            const input = document.getElementById('addSiteCatelog');
            if (!btn || !dropdown || !input) return;

            // 更新下拉选项
            function updateDropdownOptions() {
              dropdown.innerHTML = '';
              const catalogs = ${JSON.stringify(catalogs)};
              catalogs.forEach(cat => {
                const div = document.createElement('div');
                div.className = 'category-dropdown-item';
                div.textContent = cat;
                div.addEventListener('click', () => {
                  input.value = cat;
                  dropdown.classList.remove('show');
                });
                dropdown.appendChild(div);
              });
            }

            // 点击箭头切换下拉菜单
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              updateDropdownOptions();
              dropdown.classList.toggle('show');
            });

            // 点击输入框也显示下拉菜单
            input.addEventListener('focus', () => {
              updateDropdownOptions();
              dropdown.classList.add('show');
            });

            // 点击外部关闭下拉菜单
            document.addEventListener('click', (e) => {
              if (!e.target.closest('.category-input-wrapper')) {
                dropdown.classList.remove('show');
              }
            });
          }
          initAddSiteCategoryDropdown();

          // 搜索功能
          const sidebarSearchClear = document.getElementById('sidebarSearchClear');
          const sitesGrid = document.getElementById('sitesGrid');

          if (searchInput && sitesGrid) {
            const toggleClearBtn = () => {
              if (sidebarSearchClear) {
                sidebarSearchClear.classList.toggle('hidden', !searchInput.value);
              }
            };

            searchInput.addEventListener('input', function() {
              const keyword = this.value.toLowerCase().trim();
              toggleClearBtn();

              siteCards.forEach(card => {
                const catalogMatch = !activeCatalog || card.dataset.catalog === activeCatalog;
                if (!catalogMatch) {
                  card.classList.add('hidden');
                  return;
                }
                const name = (card.getAttribute('data-name') || '').toLowerCase();
                const url = (card.getAttribute('data-url') || '').toLowerCase();
                const catalogValue = (card.getAttribute('data-catalog') || '').toLowerCase();

                if (!keyword || name.includes(keyword) || url.includes(keyword) || catalogValue.includes(keyword)) {
                  card.classList.remove('hidden');
                } else {
                  card.classList.add('hidden');
                }
              });

              // 搜索结果提示
              const visibleCards = sitesGrid.querySelectorAll('.site-card:not(.hidden)');
              if (heading) {
                if (keyword) {
                  heading.textContent = '搜索结果 · ' + visibleCards.length + ' 个网站';
                } else if (activeCatalog) {
                  heading.textContent = activeCatalog + ' · ' + visibleCards.length + ' 个网站';
                } else {
                  heading.textContent = '全部收藏 · ' + visibleCards.length + ' 个网站';
                }
              }
            });

            if (sidebarSearchClear) {
              sidebarSearchClear.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.focus();
              });
            }
          }

        });
      </script>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    });
}


// 导出主模块
export default {
async fetch(request, env, ctx) {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/api')) {
    return api.handleRequest(request, env, ctx);
  } else if (url.pathname === '/admin' || url.pathname === '/admin/logout' || url.pathname.startsWith('/static')) {
    return admin.handleRequest(request, env, ctx);
  } else {
    return handleRequest(request, env, ctx);
  }
},
};
