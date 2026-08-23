const chapters = [
  { id: 1, title: 'Chapter 1', range: 'Pages 1-10', start: 1, end: 10, href: 'chapter-01.html', ready: true },
  { id: 2, title: 'Chapter 2', range: 'Pages 11-20', start: 11, end: 20, href: 'chapter-02.html', ready: true },
  { id: 3, title: 'Chapter 3', range: 'Pages 21-30', start: 21, end: 30, href: 'chapter-03.html', ready: true },
  { id: 4, title: 'Chapter 4', range: 'Pages 31-40', start: 31, end: 40, href: 'chapter-04.html', ready: true },
  { id: 5, title: 'Chapter 5', range: 'Pages 41-50', start: 41, end: 50, href: 'chapter-05.html', ready: true },
  { id: 6, title: 'Chapter 6', range: 'Pages 51-60', start: 51, end: 60, href: 'chapter-06.html', ready: true },
  { id: 7, title: 'Chapter 7', range: 'Pages 61-68', start: 61, end: 68, href: 'chapter-07.html', ready: true }
];

const pad = number => String(number).padStart(2, '0');

function renderIndex() {
  const grid = document.querySelector('#chapter-grid');
  if (!grid) return;

  grid.innerHTML = chapters.map(chapter => {
    const status = chapter.ready ? 'Read chapter' : 'Coming after review';
    const link = chapter.ready ? chapter.href : '#';
    const lockedClass = chapter.ready ? '' : ' is-locked';
    return `
      <article class="panel chapter-card${lockedClass}">
        <h2>${chapter.title}</h2>
        <p>${chapter.range}</p>
        <a class="action-link" href="${link}">${status} <i class="fa-solid fa-arrow-right"></i></a>
      </article>
    `;
  }).join('');
}

// Work out how wide a page actually renders, so the browser can pick the right file.
//
// On desktop the two pages sit side by side and the image is capped by height
// (`max-height: min(82vh, 980px)` in comic.css), not width — so the slot width
// follows from each page's aspect ratio, and the column itself caps it at ~670px.
// Below 900px the grid collapses to one column and the image goes full width.
function sizesFor(width, height) {
  const ratio = width / height;
  const fromViewportHeight = (ratio * 82).toFixed(1);   // 82vh, expressed as a width
  const fromMaxHeight = Math.round(ratio * 980);         // the 980px hard cap
  return `(max-width: 900px) 92vw, min(${fromViewportHeight}vh, ${fromMaxHeight}px, 670px)`;
}

function imageBlock(page, type) {
  const isSketch = type === 'sketch';
  const originalExt = isSketch ? 'jpg' : 'png';
  const label = isSketch ? 'Sketch' : 'Comic';
  const key = pad(page);
  const originalSrc = `assets/${type}/page-${key}.${originalExt}`;
  const displaySrc = `assets/${type}-web/page-${key}.webp`;
  const smallSrc = `assets/${type}-web-640/page-${key}.webp`;
  const alt = isSketch ? `Original sketch for page ${page}` : `Finished comic page ${page}`;

  const size = (typeof PAGE_SIZES !== 'undefined' && PAGE_SIZES[type]) ? PAGE_SIZES[type][key] : null;
  if (!size) {
    return `
    <figure class="page-card">
      <h3>${label}</h3>
      <a href="${originalSrc}" target="_blank" rel="noopener">
        <img src="${displaySrc}" loading="lazy" decoding="async" alt="${alt}">
      </a>
    </figure>
  `;
  }

  const [width, height, smallWidth] = size;
  return `
    <figure class="page-card">
      <h3>${label}</h3>
      <a href="${originalSrc}" target="_blank" rel="noopener">
        <img src="${displaySrc}"
             srcset="${smallSrc} ${smallWidth}w, ${displaySrc} ${width}w"
             sizes="${sizesFor(width, height)}"
             width="${width}" height="${height}"
             loading="lazy" decoding="async" alt="${alt}">
      </a>
    </figure>
  `;
}

function renderChapter() {
  const root = document.querySelector('#chapter-root');
  if (!root) return;

  const id = Number(document.body.dataset.chapter);
  const chapter = chapters.find(item => item.id === id);
  if (!chapter) return;

  const pages = [];
  for (let page = chapter.start; page <= chapter.end; page += 1) pages.push(page);
  const prev = chapters.find(item => item.id === id - 1 && item.ready);
  const next = chapters.find(item => item.id === id + 1 && item.ready);

  root.innerHTML = `
    <header class="chapter-header">
      <p class="eyebrow">Comic / Sketch Comparison</p>
      <h1>${chapter.title}</h1>
      <p class="chapter-copy">${chapter.range}. Click any sketch or comic page to open the full-size image in a new tab.</p>
      <nav class="page-jump" aria-label="Jump to page">
        ${pages.map(page => `<a href="#page-${pad(page)}">${page}</a>`).join('')}
      </nav>
    </header>

    <section class="comic-stack" aria-label="${chapter.title} pages">
      ${pages.map(page => `
        <article class="page-section" id="page-${pad(page)}">
          <div class="page-heading"><h2>Page ${page}</h2><span>Comic / Sketch</span></div>
          <div class="comparison">
            ${imageBlock(page, 'comic')}
            ${imageBlock(page, 'sketch')}
          </div>
        </article>
      `).join('')}
    </section>

    <nav class="footer-actions" aria-label="Chapter navigation">
      ${prev ? `<a class="action-link" href="${prev.href}"><i class="fa-solid fa-arrow-left"></i> Previous</a>` : ''}
      <a class="action-link" href="index.html">Chapters</a>
      <a class="action-link" href="#top"><i class="fa-solid fa-arrow-up"></i> Top</a>
      ${next ? `<a class="action-link" href="${next.href}">Next <i class="fa-solid fa-arrow-right"></i></a>` : ''}
    </nav>
  `;
}

if (document.body.dataset.page === 'index') renderIndex();
if (document.body.dataset.page === 'chapter') renderChapter();
