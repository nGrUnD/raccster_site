import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const TEMPLATE_PATH = path.join(ROOT, "src", "templates", "index.html");
const DEFAULTS_PATH = path.join(ROOT, "src", "content", "defaults.json");
const OUTPUT_PATH = path.join(PUBLIC_DIR, "index.html");

const SANITY_QUERY = `*[_type == "landingPage"][0]{
  siteTitle,
  metaDescription,
  brandName,
  navLinks[]{
    label,
    href
  },
  hero{
    eyebrow,
    title,
    lead,
    primaryAction{
      label,
      href,
      newTab
    },
    secondaryAction{
      label,
      href,
      newTab
    },
    statusCard{
      label,
      title,
      description
    }
  },
  fastStart{
    kicker,
    title,
    description,
    steps[]{
      number,
      title,
      description,
      linkLabel,
      linkUrl
    }
  },
  manualGuide{
    kicker,
    title,
    description,
    appChoices[]{
      name,
      description,
      downloads[]{
        platform,
        url
      }
    },
    connectionStep{
      number,
      title,
      description,
      buttonLabel,
      buttonUrl,
      helperText
    },
    activationStep{
      number,
      title,
      description,
      checklist
    }
  },
  buySection{
    kicker,
    title,
    description,
    cardTitle,
    cardDescription,
    action{
      label,
      href,
      newTab
    }
  },
  faqSection{
    kicker,
    title,
    items[]{
      title,
      description
    }
  },
  footerText
}`;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}

function deepMerge(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) && override.length > 0 ? override : base;
  }

  if (typeof base !== "object" || base === null) {
    return override ?? base;
  }

  const result = { ...base };

  for (const [key, baseValue] of Object.entries(base)) {
    const overrideValue = override?.[key];
    result[key] = deepMerge(baseValue, overrideValue);
  }

  if (override && typeof override === "object") {
    for (const [key, overrideValue] of Object.entries(override)) {
      if (!(key in result)) {
        result[key] = overrideValue;
      }
    }
  }

  return result;
}

function renderAction(action, className) {
  const label = escapeHtml(action?.label || "");
  const href = action?.href ? ` href="${escapeAttribute(action.href)}"` : "";
  const target = action?.newTab ? ' target="_blank" rel="noreferrer"' : "";
  const extraClass = action?.href ? "" : " button-disabled";

  return `<a class="button ${className}${extraClass}"${href}${target}>${label}</a>`;
}

function renderNavLinks(navLinks) {
  return navLinks
    .map(
      (item) =>
        `<a href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a>`,
    )
    .join("");
}

function renderFastStartSteps(steps) {
  return steps
    .map((step) => {
      const link = step.linkLabel && step.linkUrl
        ? `<a class="text-link" href="${escapeAttribute(step.linkUrl)}" target="_blank" rel="noreferrer">${escapeHtml(step.linkLabel)}</a>`
        : "";

      return `<article class="step-card">
  <span class="step-number">${escapeHtml(step.number)}</span>
  <h3>${escapeHtml(step.title)}</h3>
  <p>${escapeHtml(step.description)}</p>
  ${link}
</article>`;
    })
    .join("");
}

function renderAppChoices(appChoices) {
  return appChoices
    .map((app) => {
      const downloads = (app.downloads || [])
        .map(
          (download) =>
            `<a class="mini-link" href="${escapeAttribute(download.url)}" target="_blank" rel="noreferrer">${escapeHtml(download.platform)}</a>`,
        )
        .join("");

      return `<div class="app-card">
  <div class="app-copy">
    <strong>${escapeHtml(app.name)}</strong>
    <span>${escapeHtml(app.description)}</span>
  </div>
  <div class="app-actions">${downloads}</div>
</div>`;
    })
    .join("");
}

function renderChecklist(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderFaqItems(items) {
  return items
    .map(
      (item) => `<article class="faq-card">
  <h3>${escapeHtml(item.title)}</h3>
  <p>${escapeHtml(item.description)}</p>
</article>`,
    )
    .join("");
}

function renderConnectionAction(step) {
  return renderAction(
    {
      label: step.buttonLabel,
      href: step.buttonUrl,
      newTab: true,
    },
    "button-secondary",
  );
}

function renderTemplate(template, content) {
  const replacements = {
    SITE_TITLE: escapeHtml(content.siteTitle),
    META_DESCRIPTION: escapeHtml(content.metaDescription),
    BRAND_NAME: escapeHtml(content.brandName),
    NAV_LINKS: renderNavLinks(content.navLinks),
    HERO_EYEBROW: escapeHtml(content.hero.eyebrow),
    HERO_TITLE: escapeHtml(content.hero.title),
    HERO_LEAD: escapeHtml(content.hero.lead),
    HERO_PRIMARY_ACTION: renderAction(content.hero.primaryAction, "button-primary"),
    HERO_SECONDARY_ACTION: renderAction(content.hero.secondaryAction, "button-secondary"),
    STATUS_LABEL: escapeHtml(content.hero.statusCard.label),
    STATUS_TITLE: escapeHtml(content.hero.statusCard.title),
    STATUS_DESCRIPTION: escapeHtml(content.hero.statusCard.description),
    FAST_START_KICKER: escapeHtml(content.fastStart.kicker),
    FAST_START_TITLE: escapeHtml(content.fastStart.title),
    FAST_START_DESCRIPTION: escapeHtml(content.fastStart.description),
    FAST_START_STEPS: renderFastStartSteps(content.fastStart.steps),
    MANUAL_KICKER: escapeHtml(content.manualGuide.kicker),
    MANUAL_TITLE: escapeHtml(content.manualGuide.title),
    MANUAL_DESCRIPTION: escapeHtml(content.manualGuide.description),
    APP_CHOICES: renderAppChoices(content.manualGuide.appChoices),
    CONNECTION_STEP_NUMBER: escapeHtml(content.manualGuide.connectionStep.number),
    CONNECTION_STEP_TITLE: escapeHtml(content.manualGuide.connectionStep.title),
    CONNECTION_STEP_DESCRIPTION: escapeHtml(
      content.manualGuide.connectionStep.description,
    ),
    CONNECTION_ACTION: renderConnectionAction(content.manualGuide.connectionStep),
    CONNECTION_HELPER_TEXT: escapeHtml(
      content.manualGuide.connectionStep.helperText,
    ),
    ACTIVATION_STEP_NUMBER: escapeHtml(content.manualGuide.activationStep.number),
    ACTIVATION_STEP_TITLE: escapeHtml(content.manualGuide.activationStep.title),
    ACTIVATION_STEP_DESCRIPTION: escapeHtml(
      content.manualGuide.activationStep.description,
    ),
    ACTIVATION_CHECKLIST: renderChecklist(
      content.manualGuide.activationStep.checklist,
    ),
    BUY_KICKER: escapeHtml(content.buySection.kicker),
    BUY_TITLE: escapeHtml(content.buySection.title),
    BUY_DESCRIPTION: escapeHtml(content.buySection.description),
    BUY_CARD_TITLE: escapeHtml(content.buySection.cardTitle),
    BUY_CARD_DESCRIPTION: escapeHtml(content.buySection.cardDescription),
    BUY_ACTION: renderAction(content.buySection.action, "button-primary"),
    FAQ_KICKER: escapeHtml(content.faqSection.kicker),
    FAQ_TITLE: escapeHtml(content.faqSection.title),
    FAQ_ITEMS: renderFaqItems(content.faqSection.items),
    FOOTER_TEXT: escapeHtml(content.footerText),
    CURRENT_YEAR: String(new Date().getFullYear()),
  };

  return Object.entries(replacements).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template,
  );
}

async function loadDefaults() {
  const raw = await readFile(DEFAULTS_PATH, "utf8");
  return JSON.parse(raw);
}

async function loadSanityContent(defaults) {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    console.log("Sanity env vars are missing, using local defaults.");
    return defaults;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION || "2025-02-19",
    token: process.env.SANITY_READ_TOKEN || undefined,
    useCdn: !process.env.SANITY_READ_TOKEN,
  });

  try {
    const remote = await client.fetch(SANITY_QUERY);

    if (!remote) {
      console.warn("No landingPage document found in Sanity, using defaults.");
      return defaults;
    }

    return deepMerge(defaults, remote);
  } catch (error) {
    console.error("Failed to fetch content from Sanity.");
    throw error;
  }
}

async function main() {
  const [template, defaults] = await Promise.all([
    readFile(TEMPLATE_PATH, "utf8"),
    loadDefaults(),
  ]);

  const content = await loadSanityContent(defaults);
  const html = renderTemplate(template, content);

  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(OUTPUT_PATH, html);

  console.log(`Built ${path.relative(ROOT, OUTPUT_PATH)} successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
