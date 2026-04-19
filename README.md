# Raccster Pages

Статический сайт с публикацией на `GitHub Pages` и редактированием контента через `Sanity CMS`.

## Как теперь устроен сайт

- Дизайн и статика лежат в `public/`
- `public/index.html` больше не редактируется руками, он генерируется сборкой
- Шаблон страницы лежит в `src/templates/index.html`
- Fallback-контент лежит в `src/content/defaults.json`
- Схема админки `Sanity` лежит в `sanity/`
- Автодеплой настроен в `.github/workflows/deploy-pages.yml`

## Быстрый старт для разработчика

1. Установите зависимости:

```bash
npm install
```

2. Для локального запуска сборки создайте `.env` по образцу `.env.example`
3. Соберите сайт:

```bash
npm run build
```

4. Если `Sanity` не настроен, сборка возьмёт данные из `src/content/defaults.json`

## Что редактирует коллега

Коллега не работает с кодом и не заходит в GitHub. Он:

1. Открывает админку `Sanity Studio`
2. Находит документ `Landing page`
3. Меняет заголовки, тексты, ссылки и FAQ
4. Нажимает `Publish`

После публикации контент может:

- либо автоматически пересобрать сайт через webhook
- либо ждать ручного запуска workflow в GitHub

## Как настроить Sanity

### 1. Создать проект

```bash
npx sanity@latest init
```

Удобно создать отдельный проект `Raccster CMS`, после чего сохранить:

- `projectId`
- `dataset` (обычно `production`)

### 2. Подключить схему из репозитория

В этом репозитории уже подготовлены:

- `sanity.config.js`
- `sanity.cli.js`
- `sanity/schemaTypes/landingPageType.js`

Скопируйте значения `SANITY_STUDIO_PROJECT_ID` и `SANITY_STUDIO_DATASET` в `.env`, затем запустите студию:

```bash
npm run sanity:dev
```

### 3. Пригласить редактора

В панели `Sanity` добавьте коллегу как редактора проекта. Ему не нужен доступ к GitHub.

### 4. Опубликовать студию

Чтобы у коллеги была отдельная веб-админка:

```bash
npm run sanity:deploy
```

После деплоя `Sanity` даст отдельный URL студии, который можно отправить коллеге.

## Как сайт получает данные из Sanity

Во время сборки `scripts/build.mjs`:

1. читает `src/content/defaults.json`
2. пытается загрузить документ `landingPage` из `Sanity`
3. объединяет CMS-данные с fallback-значениями
4. генерирует `public/index.html`

Если `Sanity` временно не настроен, проект всё равно собирается на локальных дефолтах.

## Какие секреты нужны в GitHub

Добавьте в `Settings` → `Secrets and variables` → `Actions`:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_READ_TOKEN`

`SANITY_READ_TOKEN` лучше создать read-only.

## Как включить автопубликацию после Publish в Sanity

### Вариант 1. Через webhook в GitHub

Workflow уже умеет запускаться по `repository_dispatch` с типом `sanity-publish`.

Создайте в `Sanity` webhook на запрос:

```txt
POST https://api.github.com/repos/<owner>/<repo>/dispatches
```

С телом:

```json
{
  "event_type": "sanity-publish"
}
```

И заголовком:

```txt
Authorization: Bearer <github-token>
Accept: application/vnd.github+json
```

Токен GitHub должен иметь право запускать workflow в этом репозитории.

### Вариант 2. Вручную

Если webhook пока не настроен, можно запускать `Deploy GitHub Pages` вручную через вкладку `Actions`.

## Как включить GitHub Pages

1. Запушьте репозиторий на GitHub
2. Откройте репозиторий на GitHub
3. Перейдите в `Settings` → `Pages`
4. В секции `Build and deployment` выберите `Source: GitHub Actions`
5. Убедитесь, что workflow `Deploy GitHub Pages` успешно отрабатывает

После успешного workflow GitHub опубликует содержимое папки `public/`.

## Как подключить домен `raccster.com`

Важно: даже если репозиторий private, сайт на GitHub Pages остаётся публичным.

1. В `Settings` → `Pages` укажите кастомный домен `raccster.com`
2. Добавьте A-записи для корня домена:

```txt
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

3. Добавьте `CNAME` для `www` на ваш `*.github.io` хост
4. Дождитесь обновления DNS
5. Включите `Enforce HTTPS`

## Структура

```txt
.github/
  workflows/
    deploy-pages.yml
public/
  CNAME
  index.html
  script.js
  styles.css
sanity/
  schemaTypes/
scripts/
  build.mjs
src/
  content/
    defaults.json
  templates/
    index.html
sanity.cli.js
sanity.config.js
```

## Полезные ссылки

- [GitHub Docs: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Docs: Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Sanity](https://www.sanity.io/)
