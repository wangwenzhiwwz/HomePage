export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const url = new URL(request.url);
    if (!url.pathname.split("/").pop()?.includes(".")) {
      url.pathname = `${url.pathname.replace(/\/$/, "")}/index.html`;
      const directoryIndex = await env.ASSETS.fetch(new Request(url, request));
      if (directoryIndex.status !== 404) return directoryIndex;
    }

    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
};
