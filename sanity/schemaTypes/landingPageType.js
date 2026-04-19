import { defineArrayMember, defineField, defineType } from "sanity";

const navLinkField = defineArrayMember({
  type: "object",
  name: "navLink",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Href",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "href",
    },
  },
});

const actionField = {
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "newTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: true,
    }),
  ],
};

const downloadField = defineArrayMember({
  type: "object",
  name: "download",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: ["Windows", "macOS"],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Download URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "platform",
      subtitle: "url",
    },
  },
});

const faqItemField = defineArrayMember({
  type: "object",
  name: "faqItem",
  fields: [
    defineField({
      name: "title",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Answer",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});

const fastStartStepField = defineArrayMember({
  type: "object",
  name: "fastStartStep",
  fields: [
    defineField({
      name: "number",
      title: "Step number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkLabel",
      title: "Optional link label",
      type: "string",
    }),
    defineField({
      name: "linkUrl",
      title: "Optional link URL",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});

const appChoiceField = defineArrayMember({
  type: "object",
  name: "appChoice",
  fields: [
    defineField({
      name: "name",
      title: "App name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "downloads",
      title: "Downloads",
      type: "array",
      of: [downloadField],
      validation: (rule) => rule.min(1).required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
    },
  },
});

export const landingPageType = defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  groups: [
    { name: "global", title: "Global" },
    { name: "hero", title: "Hero" },
    { name: "fastStart", title: "Fast start" },
    { name: "manualGuide", title: "Manual guide" },
    { name: "buySection", title: "Buy section" },
    { name: "faq", title: "FAQ" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "HTML title",
      type: "string",
      group: "global",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      group: "global",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brandName",
      title: "Brand name",
      type: "string",
      group: "global",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      group: "global",
      of: [navLinkField],
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: "hero",
      title: "Hero block",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "lead",
          title: "Lead text",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "primaryAction",
          title: "Primary button",
          ...actionField,
        }),
        defineField({
          name: "secondaryAction",
          title: "Secondary button",
          ...actionField,
        }),
        defineField({
          name: "statusCard",
          title: "Status card",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "fastStart",
      title: "Fast start section",
      type: "object",
      group: "fastStart",
      fields: [
        defineField({
          name: "kicker",
          title: "Kicker",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [fastStartStepField],
          validation: (rule) => rule.min(1).required(),
        }),
      ],
    }),
    defineField({
      name: "manualGuide",
      title: "Manual guide section",
      type: "object",
      group: "manualGuide",
      fields: [
        defineField({
          name: "kicker",
          title: "Kicker",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "appChoices",
          title: "Apps",
          type: "array",
          of: [appChoiceField],
          validation: (rule) => rule.min(1).required(),
        }),
        defineField({
          name: "connectionStep",
          title: "Connection step",
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Step number",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "buttonLabel",
              title: "Button label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "buttonUrl",
              title: "Button URL",
              type: "url",
            }),
            defineField({
              name: "helperText",
              title: "Helper text",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineField({
          name: "activationStep",
          title: "Activation step",
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Step number",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "checklist",
              title: "Checklist",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.min(1).required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "buySection",
      title: "Buy section",
      type: "object",
      group: "buySection",
      fields: [
        defineField({
          name: "kicker",
          title: "Kicker",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "cardTitle",
          title: "Card title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "cardDescription",
          title: "Card description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "action",
          title: "Action button",
          ...actionField,
        }),
      ],
    }),
    defineField({
      name: "faqSection",
      title: "FAQ section",
      type: "object",
      group: "faq",
      fields: [
        defineField({
          name: "kicker",
          title: "Kicker",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [faqItemField],
          validation: (rule) => rule.min(1).required(),
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "string",
      group: "global",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Landing page",
        subtitle: "Raccster content document",
      };
    },
  },
});
