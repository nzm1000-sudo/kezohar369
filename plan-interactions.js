/* ════════════════════════════════════════════════════════════════════════════
   Architectural plan interactions — click building → show info
   ════════════════════════════════════════════════════════════════════════════ */

(() => {
  const BUILDINGS = {
    prayer: {
      name: 'היכל התפילה המרכזי',
      subtitle: 'Sanctuary · לב המתחם',
      description: 'אולם תפילה מלכותי עם כיפה של פאר, ארון קודש חצוב אבן ירושלמית, ופרוכת ידית זהב. מיועד לתפילות שבת, חג, ומניינים המוניים.',
      stats: [
        ['קיבולת', '500 מתפללים'],
        ['קומות', '2 — גברים ועזרת נשים'],
        ['גובה כיפה', '14 מטרים'],
      ],
    },
    midrash: {
      name: 'בית המדרש והכוללים',
      subtitle: 'Torah Study · 24/7',
      description: 'מרחב לימוד מרכזי הפעיל סביב השעון. כולל 6 חדרי כולל נפרדים, ספריית תורה עשירה, וחצר לימוד מקורה.',
      stats: [
        ['מקומות לימוד', '200'],
        ['מעגלי לימוד', '6'],
        ['פעילות', '24 שעות'],
      ],
    },
    mikveh: {
      name: 'מתחם המקוואות',
      subtitle: 'Ritual Baths · הידור בטהרה',
      description: 'מקוואות נפרדים לגברים ולנשים, בהידור מרבי. אבן ירושלמית, מערכות סינון מתקדמות, וחדרי הכנה יוקרתיים.',
      stats: [
        ['מקוואות', '2 — גברים ונשים'],
        ['חדרי הכנה', '8 חדרים פרטיים'],
        ['הידור', 'מאושר לחומרות'],
      ],
    },
    community: {
      name: 'אולם הקהילה הרב־תכליתי',
      subtitle: 'Community Hall',
      description: 'אולם רב־תכליתי לשיעורי תורה של קהל הרחב, אירועי מרכז, שמחות קהילתיות, ובריתות מילה.',
      stats: [
        ['קיבולת', '300 מקומות'],
        ['שימושים', 'שיעורים · אירועים · שמחות'],
        ['ציוד', 'מערכת שמע מקצועית'],
      ],
    },
    chesed: {
      name: 'מרכז "חסד יסובבנו"',
      subtitle: 'Chesed Center',
      description: 'בית הפעילות של קרן החסד. מחסני מזון, משרדי סיוע, וחדרי קבלת פונים. שם המתחם — "חסד יסובבנו".',
      stats: [
        ['משפחות', 'כ-150 בחלוקה שבועית'],
        ['מחסן מזון', 'מלא · 24/7'],
        ['משרדי קבלה', '3'],
      ],
    },
  };

  const infoWrap = document.getElementById('campusInfo');
  if (!infoWrap) return;
  const inner = infoWrap.querySelector('.campus__info-inner');
  if (!inner) return;

  const renderInfo = (id) => {
    if (!id) {
      inner.innerHTML = `
        <span class="info__ornament" aria-hidden="true">✦</span>
        <h3 class="info__title">קריית כזוהר הרקיע</h3>
        <p class="info__subtitle">מבט על המתחם כולו</p>
        <div class="divider divider--subtle"><span class="divider__line"></span><span class="divider__diamond">✦</span><span class="divider__line"></span></div>
        <p class="info__text">מתחם רוחני של חמישה מבנים מרכזיים, המשתרעים סביב חצר מרכזית מוצלת עצים.</p>
        <ul class="info__stats">
          <li><span>מבנים</span><strong>5</strong></li>
          <li><span>יעד קומות</span><strong>עד 3</strong></li>
          <li><span>פעילות</span><strong>24 שעות</strong></li>
        </ul>
        <p class="info__hint">לחצו על מבנה להרחבה</p>
      `;
      return;
    }
    const data = BUILDINGS[id];
    if (!data) return;
    inner.innerHTML = `
      <span class="info__ornament" aria-hidden="true">✦</span>
      <h3 class="info__title">${data.name}</h3>
      <p class="info__subtitle">${data.subtitle}</p>
      <div class="divider divider--subtle"><span class="divider__line"></span><span class="divider__diamond">✦</span><span class="divider__line"></span></div>
      <p class="info__text">${data.description}</p>
      <ul class="info__stats">
        ${data.stats.map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join('')}
      </ul>
    `;
  };

  // SVG building click
  document.querySelectorAll('.plan__building').forEach(g => {
    const handler = () => renderInfo(g.dataset.building);
    g.addEventListener('click', handler);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });

  // Legend buttons (same as before)
  document.querySelectorAll('[data-building]').forEach(btn => {
    btn.addEventListener('click', () => renderInfo(btn.dataset.building));
  });
})();
