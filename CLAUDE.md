# invisibleexit — граблі та правила

## Деплой
- `vercel build && vercel deploy --prebuilt --prod --archive=tgz`
- Git author = `sales@sipiteno.com`

## Критичні граблі
- Застарілий Service Worker може віддавати стару версію на перший load — перевіряй у чистому профілі/hard reload
- tsc-помилки в репо PRE-EXISTING — не блокер, не намагайся "полагодити все"
- Дерево часто некомітнуте — не робити reset/clean без перевірки
- 07-23: був катастрофічний брейк — 404 на асетах. Після деплою перевір Network-таб: жодних 404 на js/css/img
- Email-gated /freedom + libsql web-client fix — живі, не ламати
- Флот 4005 сторінок: sitemap index + IndexNow + /site-index.html hub — при змінах URL-ів оновлюй sitemap
