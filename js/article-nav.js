(function () {
  const content = window.WWZ_CONTENT;
  if (!content?.posts?.length) return;

  const root = document.body?.dataset.contentRoot || "";
  const resolve = path => new URL(`${root}${path}`, location.href);
  const normalizedPath = path => path.replace(/\/index\.html$/, "/").replace(/\/+$/, "/");
  const currentPath = normalizedPath(location.pathname);
  const current = content.posts.find(post => post.href && normalizedPath(resolve(post.href).pathname) === currentPath);
  if (!current) return;

  document.body.classList.add("wwz-article-page");
  const hero = document.querySelector(".article-hero") || document.querySelector("main section");
  hero?.classList.add("wwz-article-hero");

  const jump = document.createElement("div");
  jump.className = "wwz-article-jump";
  jump.innerHTML = `
    <i class="fa-solid fa-note-sticky" aria-hidden="true"></i>
    <label for="wwz-article-select">切换文章</label>
    <select id="wwz-article-select" aria-label="快速切换 Blog 文章">
      ${content.posts.map(post => `<option value="${post.id}"${post === current ? " selected" : ""}>${post.title}</option>`).join("")}
    </select>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
  if (hero) hero.insertAdjacentElement("beforebegin", jump);

  jump.querySelector("select").addEventListener("change", event => {
    const post = content.posts.find(item => item.id === event.target.value);
    if (!post?.href) return;
    const destination = resolve(post.href);
    if (window.self !== window.top) {
      parent.postMessage({ type:"wwz:navigate", href:destination.href }, location.origin);
    } else {
      location.href = destination.href;
    }
  });

  const related = content.posts.filter(post => post !== current && post.href).slice(0, 3);
  const section = document.createElement("section");
  section.className = "wwz-related-posts";
  section.setAttribute("aria-labelledby", "wwz-related-title");
  section.innerHTML = `
    <div class="wwz-related-heading">
      <div><span>Keep reading</span><h2 id="wwz-related-title">继续浏览 Blog</h2></div>
      <a href="${root}article.html">查看全部 <i class="fa-solid fa-arrow-right"></i></a>
    </div>
    <div class="wwz-related-grid">
      ${related.map(post => `
        <a class="wwz-related-card" href="${root}${post.href}">
          <img src="${root}${post.image}" loading="lazy" decoding="async" alt="">
          <div><span>${post.category} · ${post.readTime}</span><h3>${post.title}</h3><p>${post.excerpt}</p></div>
        </a>`).join("")}
    </div>`;

  const article = document.querySelector("article.content-article") || document.querySelector(".article-body");
  article?.insertAdjacentElement("afterend", section);
})();
