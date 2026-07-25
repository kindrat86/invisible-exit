# invisibleexit — граблі та правила

## Деплой
- **`vercel build` ОБОВʼЯЗКОВО перед `vercel deploy --prebuilt`.** `npm run build` пише в `dist/`,
  а `--prebuilt` відвантажує `.vercel/output/` — це РІЗНІ директорії, і тут немає кроку
  синхронізації (на відміну від sipiteno). Якщо пропустити `vercel build`, деплой ТИХО
  відвантажить старий артефакт, поверне READY і оновить alias — виглядає як успіх, але фікс
  не поїхав. 07-25: так було втрачено фікс прес-кіту (dist мав `index-DbeUyxIN`,
  `.vercel/output` — годинної давнини `index-dB_6G45D`).
- Перевіряй ПОЗИТИВНИМ контролем: не «старого рядка немає» (він і так відсутній у HTML,
  бо контент рендериться з JS-бандла), а «НОВИЙ рядок присутній». Перевіряй по URL деплою,
  не по aliased-домену (CDN кеш s-maxage=86400).
- `vercel build && vercel deploy --prebuilt --prod --archive=tgz`
- Git author = `sales@sipiteno.com`

## Критичні граблі
- Застарілий Service Worker може віддавати стару версію на перший load — перевіряй у чистому профілі/hard reload
- tsc-помилки в репо PRE-EXISTING — не блокер, не намагайся "полагодити все"
- Дерево часто некомітнуте — не робити reset/clean без перевірки
- 07-23: був катастрофічний брейк — 404 на асетах. Після деплою перевір Network-таб: жодних 404 на js/css/img
- Email-gated /freedom + libsql web-client fix — живі, не ламати
- Флот 4005 сторінок: sitemap index + IndexNow + /site-index.html hub — при змінах URL-ів оновлюй sitemap
- **Locale-префікси (`/es/…`, `/ru/…`, 96 кодів) = 301 на англійську сторінку в `vercel.json` → `redirects`.** i18n з апки ВИДАЛЕНО (нема `:lang` route, нема i18n-бібліотеки, нема locale-даних). До 07-25 там стояли два `rewrites` → `/index.html`, тобто HTTP 200 + SPA-shell, який після гідрації рендерив «Page Not Found» + noindex + canonical=/404 → **soft-404 без обмежень**: GSC мав 618 таких URL = 47% усіх показів сайту. JSON не тримає коментарі — тому пояснення тут. Не повертай ці rewrites; якщо додаєш новий top-level route, спершу перевір, що його ім'я не збігається з жодним із 96 кодів мов
- Лінки на статичні файли (`/site-index.html`, `/network`) у React-компонентах — ТІЛЬКИ `<a href>`, ніколи `<Link to>`: react-router перехопить навігацію і покаже SPA-404
