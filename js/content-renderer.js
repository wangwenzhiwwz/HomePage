(function () {
  const content = window.WWZ_CONTENT;
  if (!content) return;

  const prefix = document.body?.dataset.contentRoot || "";
  const local = (path) => /^(https?:|data:)/.test(path) ? path : `${prefix}${path}`;
  const externalAttrs = (path) => /^https?:/.test(path) ? ' target="_blank" rel="noopener noreferrer"' : "";
  const escape = (value) => String(value).replace(/[&<>"']/g, character => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  })[character]);
  const postOpen = (post, className) => post.href
    ? `<a class="${className}" href="${local(post.href)}"${externalAttrs(post.href)}>`
    : `<article class="${className} is-static" aria-label="${escape(post.title)}">`;
  const postClose = (post) => post.href ? "</a>" : "</article>";

  const videoButton = (video, className = "video-mini") => `
    <button class="${className} js-video" type="button" data-video="${escape(video.embed)}" aria-label="播放 ${escape(video.title)}">
      <span class="media"><img src="${local(video.image)}" loading="lazy" decoding="async" alt="${escape(video.title)}"><span class="play"><i class="fa-solid fa-play"></i></span></span>
      ${className === "video-mini" ? `<span><h3>${escape(video.title)}</h3><span class="mini-meta">${escape(video.description)} · ${escape(video.year)}</span></span>` : ""}
    </button>`;

  const featured = content.videos.find(video => video.id === content.featuredVideoId) || content.videos[0];
  const homeFeature = document.querySelector("[data-content='home-featured-video']");
  if (homeFeature) {
    homeFeature.innerHTML = `${videoButton(featured, "video-main")}
      <div class="feature-copy"><span class="tag">Featured · ${escape(featured.year)}</span><h3>${escape(featured.title)}</h3>
      <span class="meta">${escape(featured.description)}</span><p>${escape(featured.summary || featured.description)}</p>
      <button class="video-main underline js-video" type="button" data-video="${escape(featured.embed)}">Watch film <i class="fa-solid fa-arrow-right"></i></button></div>`;
  }

  const homeVideoRow = document.querySelector("[data-content='home-video-row']");
  if (homeVideoRow) {
    homeVideoRow.innerHTML = content.videos.filter(video => video.id !== featured.id).slice(0, 3).map(video => videoButton(video)).join("");
  }

  const homePosts = document.querySelector("[data-content='home-posts']");
  if (homePosts) {
    const leadPost = content.posts.find(post => post.featured) || content.posts[0];
    const orderedPosts = [leadPost, ...content.posts.filter(post => post !== leadPost)];
    homePosts.innerHTML = orderedPosts.slice(0, 3).map((post, index) => `
      ${postOpen(post, `note${index ? " compact" : ""}`)}
        <img src="${local(post.image)}" loading="lazy" decoding="async" alt="${escape(post.title)}">
        <div class="note-body"><div class="note-meta"><span>${escape(post.date)}</span><span>${escape(post.readTime)}</span><span>${escape(post.category)}</span></div>
        <h3>${escape(post.title)}</h3><p>${escape(post.excerpt)}</p>${post.href ? `<span class="${index ? "text-link" : "underline"}">Read article <i class="fa-solid fa-arrow-right"></i></span>` : ""}</div>
      ${postClose(post)}`).join("");
  }

  const blogFeatured = document.querySelector("[data-content='blog-featured']");
  if (blogFeatured) {
    const post = content.posts.find(item => item.featured) || content.posts[0];
    blogFeatured.innerHTML = `<a href="${local(post.href)}"${externalAttrs(post.href)} class="glass-card featured-card">
      <div class="featured-img-col"><img src="${local(post.image)}" decoding="async" alt="${escape(post.title)}" class="featured-img"></div>
      <div class="featured-content"><div class="article-meta"><span class="text-primary"><i class="fa-solid fa-star"></i> Featured</span><span>•</span><span>${escape(post.date)}</span><span>•</span><span>${escape(post.readTime)} read</span></div>
      <h2 class="fw-bold mb-3 display-6">${escape(post.title)}</h2><p class="text-secondary mb-4">${escape(post.excerpt)}</p>
      <div class="d-flex gap-2">${post.tags.map(tag => `<span class="article-tag">${escape(tag)}</span>`).join("")}</div></div></a>`;
  }

  const blogGrid = document.querySelector("[data-content='blog-grid']");
  if (blogGrid) {
    const gridPosts = content.posts.filter(post => !post.featured);
    blogGrid.innerHTML = gridPosts.map(post => `
      <div class="col-md-6 col-xl-4" data-category="${escape(post.category)}">${postOpen(post, "glass-card d-flex flex-column")}
        <img src="${local(post.image)}" loading="lazy" decoding="async" class="blog-card-img" alt="${escape(post.title)}">
        <div class="article-meta"><span><i class="fa-regular fa-calendar"></i> ${escape(post.date)}</span><span><i class="fa-regular fa-clock"></i> ${escape(post.readTime)}</span><span class="article-tag">${escape(post.category)}</span></div>
        <h3 class="blog-title">${escape(post.title)}</h3><p class="blog-excerpt">${escape(post.excerpt)}</p>
      ${postClose(post)}</div>`).join("");

    const filterBar = document.querySelector(".filter-bar");
    const categories = [...new Set(gridPosts.map(post => post.category))];
    if (filterBar) {
      filterBar.innerHTML = ["All", ...categories].map((category, index) =>
        `<button class="filter-btn${index === 0 ? " active" : ""}" type="button" aria-pressed="${index === 0}">${escape(category)}</button>`
      ).join("");
    }
    filterBar?.addEventListener("click", event => {
      const button = event.target.closest(".filter-btn");
      if (!button) return;
      const category = button.textContent.trim();
      filterBar.querySelectorAll(".filter-btn").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      blogGrid.querySelectorAll("[data-category]").forEach(card => {
        card.hidden = category !== "All" && card.dataset.category !== category;
      });
    });
  }

  window.WWZContent = { local, escape, featured };
})();
