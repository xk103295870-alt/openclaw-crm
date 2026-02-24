"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useObjectRecords } from "@/hooks/use-object-records";
import { RecordTable } from "@/components/records/record-table";
import { RecordKanban } from "@/components/records/record-kanban";
import { RecordCreateModal } from "@/components/records/record-create-modal";
import { FilterBuilder } from "@/components/filters/filter-builder";
import { FilterBar } from "@/components/filters/filter-bar";
import { SortBuilder } from "@/components/filters/sort-builder";
import { Popover } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CSVImportModal } from "@/components/records/csv-import-modal";
import { generateCSV, downloadCSV } from "@/lib/csv-utils";
import { useLanguage } from "@/components/language-provider";
import {
  localizeAttributes,
  localizeObjectName,
} from "@/lib/object-i18n";
import {
  Plus,
  RefreshCw,
  Table2,
  Kanban,
  Filter,
  ArrowUpDown,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ObjectPage() {
  const { language } = useLanguage();
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const {
    object,
    records,
    total,
    loading,
    fetchData,
    updateRecord,
    createRecord,
    setRecords,
    filter,
    setFilter,
    sorts,
    setSorts,
    hasFilter,
    hasSort,
    removeFilterCondition,
    clearFilters,
    clearSorts,
  } = useObjectRecords(slug);

  const [view, setView] = useState<"table" | "board">("table");
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const localizedAttributes = useMemo(
    () =>
      object
        ? localizeAttributes(object.slug, object.attributes as any[], language)
        : [],
    [object, language]
  );

  const localizedSingularName = useMemo(
    () =>
      object
        ? localizeObjectName(object.slug, object.singularName, language, "singular")
        : "",
    [object, language]
  );

  const localizedPluralName = useMemo(
    () =>
      object
        ? localizeObjectName(object.slug, object.pluralName, language, "plural")
        : "",
    [object, language]
  );

  // Auto-detect if board view is available (has a status attribute)
  const statusAttr = localizedAttributes.find((a) => a.type === "status");
  const hasBoardView = !!statusAttr;

  if (loading && !object) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {language === "zh" ? "加载中..." : "Loading..."}
      </div>
    );
  }

  if (!object) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {language === "zh" ? "对象不存在" : "Object not found"}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">{localizedPluralName}</h1>
          <span className="text-sm text-muted-foreground">
            {total}{" "}
            {language === "zh" ? "条记录" : total === 1 ? "record" : "records"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <Popover
            open={filterOpen}
            onOpenChange={setFilterOpen}
            align="end"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs gap-1",
                  hasFilter && "text-primary"
                )}
              >
                <Filter className="h-3.5 w-3.5" />
                {language === "zh" ? "筛选" : "Filter"}
                {hasFilter && (
                  <span className="ml-0.5 rounded-full bg-primary/20 px-1.5 text-[10px] text-primary">
                    {filter.conditions.length}
                  </span>
                )}
              </Button>
            }
          >
            <FilterBuilder
              attributes={localizedAttributes as any}
              filter={filter}
              onChange={setFilter}
              onClose={() => setFilterOpen(false)}
            />
          </Popover>

          {/* Sort button */}
          <Popover
            open={sortOpen}
            onOpenChange={setSortOpen}
            align="end"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs gap-1",
                  hasSort && "text-primary"
                )}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {language === "zh" ? "排序" : "Sort"}
                {hasSort && (
                  <span className="ml-0.5 rounded-full bg-primary/20 px-1.5 text-[10px] text-primary">
                    {sorts.length}
                  </span>
                )}
              </Button>
            }
          >
            <SortBuilder
              attributes={localizedAttributes as any}
              sorts={sorts}
              onChange={setSorts}
              onClose={() => setSortOpen(false)}
            />
          </Popover>

          {/* View toggle */}
          {hasBoardView && (
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setView("table")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 text-xs transition-colors rounded-l-md",
                  view === "table"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Table2 className="h-3.5 w-3.5" />
                {language === "zh" ? "表格" : "Table"}
              </button>
              <button
                onClick={() => setView("board")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 text-xs transition-colors rounded-r-md",
                  view === "board"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Kanban className="h-3.5 w-3.5" />
                {language === "zh" ? "看板" : "Board"}
              </button>
            </div>
          )}

          {/* Import / Export */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={() => {
              const csv = generateCSV(records, localizedAttributes as any);
              downloadCSV(csv, `${localizedPluralName.toLowerCase()}.csv`);
            }}
          >
            <Download className="h-3.5 w-3.5" />
            {language === "zh" ? "导出" : "Export"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={() => setImportOpen(true)}
          >
            <Upload className="h-3.5 w-3.5" />
            {language === "zh" ? "导入" : "Import"}
          </Button>

          <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            {language === "zh"
              ? `新建${localizedSingularName}`
              : `New ${localizedSingularName}`}
          </Button>
        </div>
      </div>

      {/* Active filter bar */}
      {hasFilter && (
        <div className="border-b border-border/50 px-4 py-1.5">
          <FilterBar
            filter={filter}
            attributes={localizedAttributes as any}
            onRemoveCondition={removeFilterCondition}
            onClearAll={clearFilters}
          />
        </div>
      )}

      {/* Active sort indicator */}
      {hasSort && (
        <div className="border-b border-border/50 px-4 py-1.5 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {language === "zh" ? "排序依据：" : "Sorted by:"}
          </span>
          {sorts.map((sort, i) => {
            const attr = localizedAttributes.find((a) => a.slug === sort.attribute);
            return (
              <span key={i} className="text-xs">
                {i > 0 && <span className="text-muted-foreground mr-1">,</span>}
                <span className="font-medium">{attr?.title ?? sort.attribute}</span>
                <span className="text-muted-foreground ml-1">
                  {sort.direction === "asc" ? "\u2191" : "\u2193"}
                </span>
              </span>
            );
          })}
          <button
            onClick={clearSorts}
            className="text-xs text-muted-foreground hover:text-foreground ml-2"
          >
            {language === "zh" ? "清除" : "Clear"}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "table" ? (
          <RecordTable
            attributes={localizedAttributes as any}
            records={records}
            onUpdateRecord={updateRecord}
            onCreateRecord={() => setCreateOpen(true)}
            objectSlug={slug}
          />
        ) : (
          <RecordKanban
            attributes={localizedAttributes as any}
            records={records}
            statusAttributeSlug={statusAttr!.slug}
            onMoveRecord={(recordId, newStatusId) =>
              updateRecord(recordId, statusAttr!.slug, newStatusId)
            }
            onReorder={(orderedIds) => {
              // Optimistic local reorder: sort records in orderedIds
              // into the specified order while keeping all others stable
              const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
              setRecords((prev) =>
                [...prev].sort((a, b) => {
                  const aIdx = orderMap.get(a.id);
                  const bIdx = orderMap.get(b.id);
                  if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
                  return 0;
                })
              );
              // Persist to server
              fetch(`/api/v1/objects/${slug}/records/reorder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recordIds: orderedIds }),
              });
            }}
            onClickRecord={(recordId) =>
              router.push(`/objects/${slug}/${recordId}`)
            }
            objectSlug={slug}
          />
        )}
      </div>

      {/* Create modal */}
      <RecordCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createRecord}
        attributes={localizedAttributes as any}
        objectName={localizedSingularName}
      />

      {/* Import modal */}
      <CSVImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        objectSlug={slug}
        objectName={localizedSingularName}
        attributes={object.attributes as any}
        onImportComplete={fetchData}
      />
    </div>
  );
}
