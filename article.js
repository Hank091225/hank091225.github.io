/* ===========================================================
   文章详情页渲染：?a=slug
   =========================================================== */
(function () {
  const S = window.SITE;
  const works = [...S.works].sort(window.byDateDesc);
  const slug = new URLSearchParams(location.search).get("a");
  const w = window.findWork(slug) || works[0];

  function renderBody(blocks) {
    return blocks.map(b => {
      switch (b.type) {
        case "h":     return `<h3>${b.text}</h3>`;
        case "quote": return `<blockquote>${b.text}${b.cite ? `<cite>${b.cite}</cite>` : ""}</blockquote>`;
        case "img":   return `<figure>${window.ph(b.src, b.note, "ar-3-2")}${b.caption ? `<figcaption class="cap">${b.caption}</figcaption>` : ""}</figure>`;
        case "p":
        default:      return `<p>${b.text}</p>`;
      }
    }).join("");
  }

  function pager() {
    const i = works.findIndex(x => x.slug === w.slug);
    const prev = works[i + 1]; // 更早一篇
    const next = works[i - 1]; // 更新一篇
    const cell = (item, label, side) => item
      ? `<a href="article.html?a=${item.slug}"><div class="pl">${label}</div><div class="pt">${item.title}</div></a>`
      : `<span class="empty" style="padding:30px 0;display:block"><div class="pl">${label}</div><div class="pt empty">${side}</div></span>`;
    return `<div class="pager">
      ${cell(next, "更新的一篇", "已经是最新")}
      ${cell(prev, "更早的一篇", "已经是最早")}
    </div>`;
  }

  const d = window.fmtDate(w.date);
  const a = S.author;

  const html =
    window.renderMasthead("") +
    `<div class="wrap-read">
       <a class="back" href="index.html">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
         返回全部文章
       </a>
     </div>
     <article>
       <div class="wrap-read">
         <div class="article-head">
           <div class="article-cat">
             <span class="kicker">${w.category}</span>
             <span class="meta date-mono">${d.label}</span>
           </div>
           <h1 class="article-title">${w.title}</h1>
           <p class="article-dek">${w.dek}</p>
           <div class="byline">
             <span class="who">${a.name}</span>
             <span class="dot">·</span><span>${a.outlet}</span>
             <span class="dot">·</span><span>阅读约 ${w.readMins} 分钟</span>
           </div>
         </div>
       </div>` +
       (w.cover || w.coverNote
         ? `<div class="wrap-read"><div class="hero">${window.ph(w.cover, w.coverNote, "ar-16-9")}${w.coverCaption ? `<div class="cap">${w.coverCaption}</div>` : ""}</div></div>`
         : "") +
       `<div class="wrap-read">
          <div class="article-body">${renderBody(w.body || [])}</div>
          <div class="endmark"><span aria-hidden="true">${a.seal}</span></div>
          ${pager()}
        </div>
     </article>` +
    window.renderFooter();

  document.getElementById("app").innerHTML = html;
  document.title = `${w.title} · ${a.name}`;
  window.scrollTo(0, 0);
  window.initReveal();
})();
