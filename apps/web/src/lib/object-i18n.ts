import type { Language } from "@/lib/i18n";

type LabelPair = {
  en: string;
  zh: string;
};

type ObjectLabelMap = Record<
  string,
  {
    singular: LabelPair;
    plural: LabelPair;
  }
>;

type AttributeLabelMap = Record<string, Record<string, LabelPair>>;

type StageLabelMap = Record<string, LabelPair>;

const SYSTEM_OBJECT_LABELS: ObjectLabelMap = {
  people: {
    singular: { en: "Person", zh: "联系人" },
    plural: { en: "People", zh: "联系人" },
  },
  companies: {
    singular: { en: "Company", zh: "公司" },
    plural: { en: "Companies", zh: "公司" },
  },
  deals: {
    singular: { en: "Deal", zh: "交易" },
    plural: { en: "Deals", zh: "交易" },
  },
};

const SYSTEM_ATTRIBUTE_LABELS: AttributeLabelMap = {
  people: {
    name: { en: "Name", zh: "姓名" },
    email_addresses: { en: "Email Addresses", zh: "邮箱地址" },
    phone_numbers: { en: "Phone Numbers", zh: "电话号码" },
    job_title: { en: "Job Title", zh: "职位" },
    company: { en: "Company", zh: "公司" },
    location: { en: "Location", zh: "地点" },
    description: { en: "Description", zh: "描述" },
  },
  companies: {
    name: { en: "Name", zh: "名称" },
    domains: { en: "Domains", zh: "域名" },
    description: { en: "Description", zh: "描述" },
    team: { en: "Team", zh: "团队" },
    primary_location: { en: "Primary Location", zh: "主要地点" },
    categories: { en: "Categories", zh: "分类" },
  },
  deals: {
    name: { en: "Name", zh: "名称" },
    value: { en: "Value", zh: "金额" },
    stage: { en: "Stage", zh: "阶段" },
    expected_close_date: { en: "Expected Close Date", zh: "预计成交日期" },
    owner: { en: "Owner", zh: "负责人" },
    company: { en: "Company", zh: "公司" },
    associated_people: { en: "Associated People", zh: "关联联系人" },
  },
};

const DEAL_STAGE_LABELS: StageLabelMap = {
  Lead: { en: "Lead", zh: "线索" },
  Qualified: { en: "Qualified", zh: "已确认" },
  Proposal: { en: "Proposal", zh: "提案" },
  Negotiation: { en: "Negotiation", zh: "谈判" },
  Won: { en: "Won", zh: "赢单" },
  Lost: { en: "Lost", zh: "丢单" },
};

function pickLabel(
  labels: LabelPair | undefined,
  language: Language,
  fallback: string
): string {
  if (!labels) return fallback;
  return language === "zh" ? labels.zh : labels.en;
}

export function localizeObjectName(
  slug: string,
  fallback: string,
  language: Language,
  kind: "singular" | "plural"
): string {
  return pickLabel(SYSTEM_OBJECT_LABELS[slug]?.[kind], language, fallback);
}

export function localizeAttributeTitle(
  objectSlug: string,
  attributeSlug: string,
  fallback: string,
  language: Language
): string {
  return pickLabel(
    SYSTEM_ATTRIBUTE_LABELS[objectSlug]?.[attributeSlug],
    language,
    fallback
  );
}

export function localizeStatusTitle(
  objectSlug: string,
  attributeSlug: string,
  fallback: string,
  language: Language
): string {
  if (objectSlug === "deals" && attributeSlug === "stage") {
    return pickLabel(DEAL_STAGE_LABELS[fallback], language, fallback);
  }
  return fallback;
}

export function localizeAttributes<
  T extends {
    slug: string;
    title: string;
    statuses?: Array<{ title: string }>;
  },
>(
  objectSlug: string,
  attributes: T[],
  language: Language
): T[] {
  return attributes.map((attr) => ({
    ...attr,
    title: localizeAttributeTitle(objectSlug, attr.slug, attr.title, language),
    statuses: attr.statuses?.map((status) => ({
      ...status,
      title: localizeStatusTitle(
        objectSlug,
        attr.slug,
        status.title,
        language
      ),
    })),
  }));
}

