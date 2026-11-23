const REDIRECTS = {
  "/portfolio-masonry.html": "/works.html",
  "/article.html": "/blog.html",
  "/styles.html": "/design-system.html",
  "/team.html": "/about.html",
  "/article/BE6500-SSH/index.html": "/articles/be6500-ssh/",
  "/article/BE6500-SSH/": "/articles/be6500-ssh/",
  "/article/BE6500-SSH": "/articles/be6500-ssh/",
  "/article/LiunxOrder/index.html": "/articles/linux-server-setup/",
  "/article/LiunxOrder/": "/articles/linux-server-setup/",
  "/article/LiunxOrder": "/articles/linux-server-setup/",
  "/article/xui/index.html": "/articles/3x-ui/",
  "/article/xui/": "/articles/3x-ui/",
  "/article/xui": "/articles/3x-ui/",
  "/article/hysteria2/index.html": "/articles/hysteria-2/",
  "/article/hysteria2/": "/articles/hysteria-2/",
  "/article/hysteria2": "/articles/hysteria-2/",
  "/projects/": "/#tools",
  "/projects": "/#tools"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = REDIRECTS[url.pathname] || REDIRECTS[url.pathname.replace(/\/index\.html$/, '/')];
    if (target) {
      return Response.redirect(new URL(target + url.search + url.hash, request.url), 301);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    if (!url.pathname.split("/").pop()?.includes(".")) {
      url.pathname = `${url.pathname.replace(/\/$/, "")}/index.html`;
      const directoryIndex = await env.ASSETS.fetch(new Request(url, request));
      if (directoryIndex.status !== 404) return directoryIndex;
    }

    url.pathname = "/404.html";
    const notFound = await env.ASSETS.fetch(new Request(url, request));
    if (notFound.status !== 404) return notFound;

    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
};
