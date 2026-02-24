"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RecordDetail } from "@/components/records/record-detail";
import { RelatedRecords } from "@/components/records/related-records";
import { ActivityTimeline } from "@/components/records/activity-timeline";
import { RecordNotes } from "@/components/notes/record-notes";
import { RecordTasks } from "@/components/tasks/record-tasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Trash2,
  Users,
  Building2,
  Handshake,
  Box,
} from "lucide-react";
import { extractPersonalName } from "@/lib/display-name";
import { useLanguage } from "@/components/language-provider";
import {
  localizeAttributes,
  localizeObjectName,
} from "@/lib/object-i18n";

interface ObjectData {
  id: string;
  slug: string;
  singularName: string;
  pluralName: string;
  icon: string;
  attributes: any[];
}

interface RecordData {
  id: string;
  objectId: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  values: Record<string, unknown>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  "building-2": Building2,
  handshake: Handshake,
};

export default function RecordDetailPage() {
  const { language } = useLanguage();
  const params = useParams<{ slug: string; recordId: string }>();
  const router = useRouter();
  const { slug, recordId } = params;

  const [object, setObject] = useState<ObjectData | null>(null);
  const [record, setRecord] = useState<RecordData | null>(null);
  const [related, setRelated] = useState<{ related: any[]; forward: any[] }>({
    related: [],
    forward: [],
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [objRes, recRes] = await Promise.all([
        fetch(`/api/v1/objects/${slug}`),
        fetch(`/api/v1/objects/${slug}/records/${recordId}`),
      ]);

      if (objRes.ok) setObject(await objRes.json().then((r) => r.data));
      if (recRes.ok) setRecord(await recRes.json().then((r) => r.data));

      // Load related and activity in parallel
      const [relRes, actRes] = await Promise.all([
        fetch(`/api/v1/objects/${slug}/records/${recordId}/related`),
        fetch(`/api/v1/objects/${slug}/records/${recordId}/activity`),
      ]);

      if (relRes.ok) setRelated(await relRes.json().then((r) => r.data));
      if (actRes.ok) setActivities(await actRes.json().then((r) => r.data));
    } finally {
      setLoading(false);
    }
  }, [slug, recordId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback(
    async (attrSlug: string, value: unknown) => {
      setRecord((prev) =>
        prev ? { ...prev, values: { ...prev.values, [attrSlug]: value } } : prev
      );

      await fetch(`/api/v1/objects/${slug}/records/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: { [attrSlug]: value } }),
      });
    },
    [slug, recordId]
  );

  const handleDelete = useCallback(async () => {
    if (
      !confirm(
        language === "zh"
          ? "确定要删除这条记录吗？"
          : "Are you sure you want to delete this record?"
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/objects/${slug}/records/${recordId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push(`/objects/${slug}`);
      }
    } finally {
      setDeleting(false);
    }
  }, [language, slug, recordId, router]);

  const localizedAttributes = useMemo(
    () =>
      object
        ? localizeAttributes(object.slug, object.attributes as any[], language)
        : [],
    [object, language]
  );
  const localizedPluralName =
    object
      ? localizeObjectName(object.slug, object.pluralName, language, "plural")
      : "";
  const localizedSingularName =
    object
      ? localizeObjectName(object.slug, object.singularName, language, "singular")
      : "";

  if (loading && !record) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {language === "zh" ? "加载中..." : "Loading..."}
      </div>
    );
  }

  if (!object || !record) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {language === "zh" ? "记录不存在" : "Record not found"}
      </div>
    );
  }

  const nameAttr = localizedAttributes.find((a: any) => a.slug === "name");
  let displayName = language === "zh" ? "未命名" : "Unnamed";
  if (nameAttr) {
    const val = record.values.name;
    if (nameAttr.type === "personal_name" && val) {
      displayName = extractPersonalName(val) || (language === "zh" ? "未命名" : "Unnamed");
    } else if (typeof val === "string") {
      displayName = val;
    }
  }

  const ObjIcon = iconMap[object.icon] || Box;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href={`/objects/${slug}`}>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ObjIcon className="h-4 w-4" />
              <Link href={`/objects/${slug}`} className="hover:text-foreground">
                {localizedPluralName}
              </Link>
              <span>/</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{displayName}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleting
                ? language === "zh"
                  ? "删除中..."
                  : "Deleting..."
                : language === "zh"
                  ? "删除"
                  : "Delete"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4">
          <Tabs defaultValue="attributes">
            <TabsList>
              <TabsTrigger value="attributes">
                {language === "zh" ? "属性" : "Attributes"}
              </TabsTrigger>
              <TabsTrigger value="notes">{language === "zh" ? "笔记" : "Notes"}</TabsTrigger>
              <TabsTrigger value="tasks">{language === "zh" ? "任务" : "Tasks"}</TabsTrigger>
              <TabsTrigger value="activity">
                {language === "zh" ? "动态" : "Activity"}
                {activities.length > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {activities.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="related">
                {language === "zh" ? "关联" : "Related"}
                {(related.related.length + related.forward.length) > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {related.related.length + related.forward.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attributes">
              <RecordDetail
                attributes={localizedAttributes}
                values={record.values}
                onUpdate={handleUpdate}
              />
            </TabsContent>

            <TabsContent value="notes">
              <RecordNotes objectSlug={slug} recordId={recordId} />
            </TabsContent>

            <TabsContent value="tasks">
              <RecordTasks objectSlug={slug} recordId={recordId} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTimeline activities={activities} />
            </TabsContent>

            <TabsContent value="related">
              <RelatedRecords
                related={related.related}
                forward={related.forward}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right sidebar - metadata */}
      <div className="hidden w-64 shrink-0 border-l border-border lg:block">
        <div className="p-4 space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {language === "zh" ? "记录信息" : "Record Info"}
          </h3>
          <div className="space-y-3">
            <MetaItem
              label={language === "zh" ? "记录 ID" : "Record ID"}
              value={record.id.slice(0, 8) + "..."}
            />
            <MetaItem
              label={language === "zh" ? "对象" : "Object"}
              value={localizedSingularName}
            />
            <MetaItem
              label={language === "zh" ? "创建时间" : "Created"}
              value={new Date(record.createdAt).toLocaleDateString(
                language === "zh" ? "zh-CN" : "en-US",
                {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
              )}
            />
            <MetaItem
              label={language === "zh" ? "更新时间" : "Updated"}
              value={new Date(record.updatedAt).toLocaleDateString(
                language === "zh" ? "zh-CN" : "en-US",
                {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}
