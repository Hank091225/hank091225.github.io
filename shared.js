/* ===========================================================
   共享渲染逻辑：报头、页脚、占位图、工具函数
   =========================================================== */
(function () {
  const S = window.SITE;
  if (!S) { console.error("content.js 未加载"); return; }

  /* —— 工具 —— */
  const MONTHS = ["", "1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  window.fmtDate = function (iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return { y, m, d, label: `${y} 年 ${m} 月 ${d} 日`, short: `${m}.${String(d).padStart(2,"0")}` };
  };
  window.byDateDesc = (a, b) => (a.date < b.date ? 1 : -1);
  window.findWork = (slug) => S.works.find(w => w.slug === slug);

  /* —— 占位图 / 封面 —— */
  window.ph = function (cover, note, ratioClass) {
    if (cover) {
      return `<div class="cover ${ratioClass}"><img src="${cover}" alt="${note || ""}" loading="lazy"></div>`;
    }
    return `<div class="ph ${ratioClass}"><span>${note || "配图"}</span></div>`;
  };

  /* —— 报头 —— */
  window.renderMasthead = function (current) {
    const a = S.author;
    const nav = [
      { id: "home",    href: "index.html",   label: "文章" },
      { id: "contact", href: "contact.html", label: "联系" }
    ];
    return `
    <header class="masthead">
      <div class="wrap">
        <div class="masthead-inner">
          <div class="brand">
            <h1 class="brand-name"><a href="index.html">
              <span class="seal" aria-hidden="true">${a.seal}</span>${a.name}
            </a></h1>
            <div class="brand-meta">
              <b>${a.outlet}</b><br>${a.role}
            </div>
          </div>
          <nav class="site-nav">
            ${nav.map(n => `<a href="${n.href}"${n.id === current ? ' aria-current="page"' : ""}>${n.label}</a>`).join("")}
            <span class="nav-tools">
              <a class="icon-btn" href="feed.xml" title="RSS 订阅" aria-label="RSS 订阅">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <button class="icon-btn" type="button" onclick="toggleTheme()" title="切换夜读模式" aria-label="切换深色模式">
                <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
                <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
              </button>
            </span>
          </nav>
        </div>
      </div>
    </header>
    <div class="wrap"><div class="rule"></div></div>`;
  };

  /* —— 页脚 —— */
  window.renderFooter = function () {
    const a = S.author;
    const links = a.channels
      .filter(c => c.href)
      .map(c => `<a href="${c.href}">${c.label}</a>`).join("");
    return `
    <footer class="site-foot">
      <div class="wrap">
        <div class="foot-grid">
          <div>
            <div class="foot-sign">${a.name}</div>
            <div class="foot-fine">${a.outlet} · ${a.role}</div>
          </div>
          <div class="foot-links">
            <a href="index.html">文章</a>
            <a href="contact.html">联系</a>
            ${links}
          </div>
        </div>
        <div class="foot-fine">© ${new Date().getFullYear()} ${a.name}. 文字与图片版权所有，转载请联系。</div>
      </div>
    </footer>`;
  };

  /* —— 主题切换（夜读模式） —— */
  window.toggleTheme = function () {
    const root = document.documentElement;
    const cur = root.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    root.classList.add("theming");
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("zy-theme", next); } catch (e) {}
    // 下一帧恢复过渡（用于 hover 等正常交互）；节流环境下不恢复也无妨
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theming")));
  };

  /* —— 滚动入场 —— */
  /* —— 滚动入场（已停用，保留空函数以兼容调用） —— */
  window.initReveal = function () {};
})();
