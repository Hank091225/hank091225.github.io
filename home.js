/* ===========================================================
   首页渲染：精选置顶 + 年份归档时间线
   =========================================================== */
(function () {
  const S = window.SITE;
  const works = [...S.works].sort(window.byDateDesc);

  /* —— 精选区 —— */
  function renderFeatured() {
    const feat = works.filter(w => w.featured);
    if (!feat.length) return "";
    const [lead, ...rest] = feat;
    const ld = window.fmtDate(lead.date);

    const leadHtml = `
      <a class="card-link lead" href="article.html?a=${lead.slug}">
        ${window.ph(lead.cover, lead.coverNote, "ar-3-2")}
        <div class="card-meta">
          <span class="tag">${lead.category}</span>
          <span class="meta date-mono">${ld.label}</span>
        </div>
        <h3 class="lead-title">${lead.title}</h3>
        <p class="lead-dek">${lead.dek}</p>
        <div class="meta">阅读约 ${lead.readMins} 分钟 →</div>
      </a>`;

    const sideHtml = rest.map(w => {
      const d = window.fmtDate(w.date);
      return `
      <a class="card-link mini" href="article.html?a=${w.slug}">
        <div class="card-meta">
          <span class="tag">${w.category}</span>
          <span class="meta date-mono">${d.label}</span>
        </div>
        <h3 class="mini-title">${w.title}</h3>
        <p class="mini-dek">${w.dek}</p>
      </a>`;
    }).join("");

    return `
    <section class="reveal" id="featuredSection">
      <div class="section-head">
        <h2>精选</h2><span class="line"></span><span class="kicker">Selected</span>
      </div>
      <div class="featured">
        ${leadHtml}
        <div class="lead-side">${sideHtml}</div>
      </div>
    </section>`;
  }

  /* —— 年份归档 —— */
  function renderArchive() {
    // 按年份分组
    const byYear = {};
    works.forEach(w => {
      const y = window.fmtDate(w.date).y;
      (byYear[y] = byYear[y] || []).push(w);
    });
    const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

    const rail = years.map(y =>
      `<a href="#y${y}" data-year="${y}">${y}</a>`).join("");

    const blocks = years.map(y => {
      const entries = byYear[y].map(w => {
        const d = window.fmtDate(w.date);
        const text = (w.title + " " + w.dek + " " + w.category + " " + (w.excerpt || "")).toLowerCase();
        return `
        <a class="entry card-link" href="article.html?a=${w.slug}" data-cat="${w.category}" data-text="${text.replace(/"/g, "&quot;")}">
          <div class="entry-main">
            <div class="entry-top">
              <span class="meta date-mono">${d.short}</span>
              <span class="tag">${w.category}</span>
            </div>
            <h3 class="entry-title">${w.title}</h3>
            <p class="entry-dek">${w.dek}</p>
          </div>
          <div class="entry-thumb">${window.ph(w.cover, w.coverNote, "ar-4-3")}</div>
        </a>`;
      }).join("");
      return `
      <div class="year-block" id="y${y}" data-year="${y}">
        <div class="year-label">${y}</div>
        ${entries}
      </div>`;
    }).join("");

    // 栏目（按出现顺序去重）
    const cats = [];
    works.forEach(w => { if (!cats.includes(w.category)) cats.push(w.category); });
    const chips = `<button class="chip" data-cat="all" aria-pressed="true">全部</button>` +
      cats.map(c => `<button class="chip" data-cat="${c}" aria-pressed="false">${c}</button>`).join("");

    return `
    <section class="reveal" style="margin-top:64px">
      <div class="section-head">
        <h2>全部文章</h2><span class="line"></span>
        <span class="kicker">${works.length} 篇 · 按年归档</span>
      </div>
      <div class="controls">
        <label class="search" id="searchWrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input id="searchInput" type="search" placeholder="搜索标题、关键词、栏目…" autocomplete="off">
          <button class="clear" id="searchClear" type="button" aria-label="清除" title="清除">×</button>
        </label>
        <div class="chips" id="catChips">${chips}</div>
        <span class="result-count" id="resultCount"></span>
      </div>
      <div class="no-results" id="noResults" style="display:none"></div>
      <div class="archive">
        <nav class="year-rail" id="yearRail">${rail}</nav>
        <div class="year-cols">${blocks}</div>
      </div>
    </section>`;
  }

  /* —— 组装 —— */
  document.getElementById("app").innerHTML =
    window.renderMasthead("home") +
    `<main class="wrap">${renderFeatured()}${renderArchive()}</main>` +
    window.renderFooter();

  document.title = `${S.author.name} · ${S.author.outlet} 记者`;
  window.initReveal();

  /* —— 年份导航高亮 —— */
  const rail = document.getElementById("yearRail");
  const railLinks = rail ? [...rail.querySelectorAll("a")] : [];
  const blocks = [...document.querySelectorAll(".year-block")];
  if (blocks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          const y = e.target.dataset.year;
          railLinks.forEach(l => l.classList.toggle("active", l.dataset.year === y));
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    blocks.forEach(b => spy.observe(b));
  }
  railLinks.forEach(l => l.addEventListener("click", (ev) => {
    ev.preventDefault();
    const t = document.getElementById(l.getAttribute("href").slice(1));
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" });
  }));

  /* —— 搜索 + 标签筛选 —— */
  const search    = document.getElementById("searchInput");
  const clearBtn  = document.getElementById("searchClear");
  const searchWrap= document.getElementById("searchWrap");
  const chips     = [...document.querySelectorAll("#catChips .chip")];
  const resultEl  = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");
  const entries   = [...document.querySelectorAll(".entry")];
  const featured  = document.getElementById("featuredSection");
  let activeCat = "all";

  function applyFilter() {
    const q = (search.value || "").trim().toLowerCase();
    searchWrap.classList.toggle("has-value", q.length > 0);
    const filtering = q.length > 0 || activeCat !== "all";
    let shown = 0;
    entries.forEach(e => {
      const okCat  = activeCat === "all" || e.dataset.cat === activeCat;
      const okText = !q || (e.dataset.text || "").includes(q);
      const vis = okCat && okText;
      e.classList.toggle("hidden", !vis);
      if (vis) shown++;
    });
    blocks.forEach(b => {
      const any = !!b.querySelector(".entry:not(.hidden)");
      b.classList.toggle("hidden", !any);
      const link = railLinks.find(l => l.dataset.year === b.dataset.year);
      if (link) link.classList.toggle("hidden", !any);
    });
    if (featured) featured.style.display = filtering ? "none" : "";
    resultEl.textContent = filtering ? `找到 ${shown} 篇` : "";
    if (filtering && shown === 0) {
      noResults.style.display = "";
      noResults.innerHTML = `没有匹配 <b>「${q || activeCat}」</b> 的文章，换个关键词或栏目试试。`;
    } else {
      noResults.style.display = "none";
    }
  }

  if (search) {
    search.addEventListener("input", applyFilter);
    clearBtn.addEventListener("click", () => { search.value = ""; applyFilter(); search.focus(); });
    chips.forEach(c => c.addEventListener("click", () => {
      activeCat = c.dataset.cat;
      chips.forEach(x => x.setAttribute("aria-pressed", x === c ? "true" : "false"));
      applyFilter();
    }));
  }
})();
