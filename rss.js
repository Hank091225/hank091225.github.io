/* ===========================================================
   RSS 生成器：从 content.js 实时生成 feed.xml
   更新作品后，打开本页点「下载 feed.xml」覆盖即可
   =========================================================== */
(function () {
  const S = window.SITE;
  const works = [...S.works].sort(window.byDateDesc);

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function build(baseRaw) {
    const b = (baseRaw || "https://your-domain.com").replace(/\/+$/, "");
    const now = new Date().toUTCString();
    const items = works.map(w => {
      const link = `${b}/article.html?a=${w.slug}`;
      const pub = new Date(w.date + "T08:00:00").toUTCString();
      return `    <item>
      <title>${esc(w.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <category>${esc(w.category)}</category>
      <dc:creator>${esc(S.author.name)}</dc:creator>
      <pubDate>${pub}</pubDate>
      <description>${esc(w.dek || w.excerpt || "")}</description>
    </item>`;
    }).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(S.author.name)} · ${esc(S.author.outlet)}</title>
    <link>${esc(b)}/</link>
    <atom:link href="${esc(b)}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(S.author.role)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`;
  }

  document.getElementById("app").innerHTML =
    window.renderMasthead("") +
    `<main class="wrap-read">
       <div class="section-head" style="margin-top:40px">
         <h2>RSS 订阅源</h2><span class="line"></span><span class="kicker">feed.xml</span>
       </div>
       <p style="color:var(--ink-soft);font-size:17px;line-height:1.8;margin:0 0 26px">
         这里实时根据 <code style="font-family:var(--sans);background:var(--paper-2);padding:1px 6px;border-radius:4px">content.js</code>
         生成订阅源。每次更新作品后，回到这里点 <b style="color:var(--ink)">下载 feed.xml</b>，
         用它覆盖项目里的同名文件即可——订阅你的读者就会收到新文章。
       </p>
       <div class="rss-field">
         <label for="rssBase">网站域名</label>
         <input id="rssBase" type="text" value="${esc(S.siteUrl || "https://your-domain.com")}">
       </div>
       <div class="rss-actions">
         <button class="btn-primary" id="rssDownload">下载 feed.xml</button>
         <button class="btn-ghost" id="rssCopy">复制全部</button>
         <span class="meta" id="rssMsg"></span>
       </div>
       <pre class="rss-pre" id="rssOut"></pre>
     </main>` +
    window.renderFooter();

  const baseInput = document.getElementById("rssBase");
  const out = document.getElementById("rssOut");
  const msg = document.getElementById("rssMsg");

  function refresh() { out.textContent = build(baseInput.value); }
  refresh();
  baseInput.addEventListener("input", refresh);

  document.getElementById("rssCopy").addEventListener("click", () => {
    navigator.clipboard.writeText(out.textContent).then(() => {
      msg.textContent = "已复制到剪贴板"; setTimeout(() => msg.textContent = "", 2200);
    });
  });
  document.getElementById("rssDownload").addEventListener("click", () => {
    const blob = new Blob([out.textContent], { type: "application/rss+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "feed.xml";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(a.href);
    msg.textContent = "已下载，记得覆盖项目里的 feed.xml"; setTimeout(() => msg.textContent = "", 3500);
  });

  document.title = `RSS 订阅 · ${S.author.name}`;
})();
