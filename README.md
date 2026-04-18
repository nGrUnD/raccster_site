# Raccster Pages

Статический сайт с инструкцией по подключению VPN / прокси и переходом к покупке через Telegram-бота.

## Что уже готово

- Сайт лежит в `public/`
- Автодеплой на GitHub Pages лежит в `.github/workflows/deploy-pages.yml`
- Кастомный домен задан через `public/CNAME`

## Что нужно заменить перед запуском

1. Откройте `public/script.js`
2. Вставьте ссылку подключения от Семена в константу:

```js
const MANUAL_CONNECTION_URL = "https://ваша-ссылка-подключения";
```

После этого кнопка ручного подключения на сайте станет активной.

## Локальный просмотр

Сайт полностью статический, поэтому для быстрого просмотра можно:

1. Просто открыть `public/index.html` в браузере
2. Или поднять локальный сервер любым удобным способом, например через VS Code Live Server

## Как включить GitHub Pages

1. Запушьте репозиторий на GitHub
2. Откройте репозиторий на GitHub
3. Перейдите в `Settings` → `Pages`
4. В секции `Build and deployment` выберите `Source: GitHub Actions`
5. Убедитесь, что workflow `Deploy GitHub Pages` успешно отработал после пуша в `main`

После успешного workflow GitHub сам опубликует содержимое папки `public/`.

## Как подключить домен `raccster.com`

Важно: даже если репозиторий private, сайт на GitHub Pages остаётся публичным.

1. Сначала откройте `Settings` → `Pages` и убедитесь, что там указан кастомный домен `raccster.com`
2. У регистратора домена добавьте A-записи для apex-домена:

```txt
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

3. Удалите конфликтующие A/AAAA/CNAME записи для корня домена, если они уже есть
4. Дождитесь обновления DNS, это может занять до 24 часов
5. После обновления DNS включите `Enforce HTTPS` в настройках GitHub Pages

Если хотите, чтобы `www.raccster.com` тоже открывал сайт, добавьте CNAME для `www` на ваш GitHub Pages hostname после первой публикации.

## Как обновлять сайт дальше

1. Вносите изменения в файлы внутри `public/`
2. Коммитьте изменения
3. Пушьте в `main`
4. GitHub Actions автоматически заново развернёт сайт

## Структура

```txt
public/
  index.html
  styles.css
  script.js
  CNAME
.github/
  workflows/
    deploy-pages.yml
```

## Полезные ссылки

- [GitHub Docs: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Docs: Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
