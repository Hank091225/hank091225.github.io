/* ===========================================================
   联系页渲染：简介 + 邮箱 + 社交媒体
   =========================================================== */
(function () {
  const S = window.SITE;
  const a = S.author;

  const bio = a.bio.map(p => `<p>${p}</p>`).join("");
  const channels = a.channels.map(c => `
    <div class="channel">
      <span class="channel-label">${c.label}</span>
      ${c.href
        ? `<a class="channel-value" href="${c.href}">${c.value}</a>`
        : `<span class="channel-value">${c.value}</span>`}
    </div>`).join("");

  document.getElementById("app").innerHTML =
    window.renderMasthead("contact") +
    `<main class="wrap-read">
       <div class="section-head" style="margin-top:40px">
         <h2>联系</h2><span class="line"></span><span class="kicker">Get in touch</span>
       </div>
       <div class="contact-hero reveal">
         <div>
           <h2 class="contact-name">${a.name}</h2>
           <p class="contact-role">${a.outlet} · ${a.role}</p>
           <div class="contact-bio">${bio}</div>
         </div>
         <div class="contact-portrait">${window.ph(a.portrait, "个人照片", "ar-4-3")}</div>
       </div>
       <div class="channels reveal">${channels}</div>
       <p class="foot-fine" style="margin-top:34px">有线索、有故事，或对某篇报道有不同看法，欢迎来信。我会读每一封。</p>
     </main>` +
    window.renderFooter();

  document.title = `联系 · ${a.name}`;
  window.initReveal();
})();
