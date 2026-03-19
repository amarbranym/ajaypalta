"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Sankey,
} from "recharts";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "./ui/SectionWrapper";
import { GlowButton } from "./ui/GlowButton";

type UiRole = "input" | "readonly" | "derived" | "hidden" | "hidden_value" | string;
type DType = "number" | "percent" | "text" | string;

type ItemSchema = {
  metric_key: string;
  panel_key: string;
  panel_order: number;
  item_order: number;
  label: string;
  ui_role: UiRole;
  dtype?: DType;
  min?: any;
  max?: any;
  default?: any;
  format?: string;
  notes?: string;
  ui_visible?: string | boolean;
  ui_priority?: string | number;
};

type MasterSchema = {
  items: ItemSchema[];
};

type ComputeResponse = {
  ok?: boolean;
  values: Record<string, any>;
  value_display?: Record<string, string>;
};

type ModelState = {
  id: string;
  name: string;
  inputs: Record<string, any>;
  values: Record<string, any>;
  valueDisplay: Record<string, string>;
};

type PanelGroup = {
  panel_key: string;
  panel_order: number;
  items: ItemSchema[];
};

const MAX_MODELS = 5;

const KEY_METRICS = new Set([
  "CR",
  "lambda",
  "rpm",
  "bore_stroke_ratio",
  "P1_bar_derived",
  "P2_bar",
  "T2_C",
  "P3_real_bar",
  "T3_real_C",
  "W_comp_J",
  "W_exp_real_J",
  "W_net_real_J",
  "eta_brake_pct",
  "BMEP_bar",
  "Power_brake_kW",
  "bsfc_g_kWh",
  "Q_exh_real_bal_J",
  "water_phase_result",
]);

const GRAPH_METRIC_OPTIONS = [
  { key: "T2_C", label: "T2 Compression Temperature (°C)" },
  { key: "T3_real_C", label: "T3 Real Combustion Temperature (°C)" },
  { key: "P2_bar", label: "P2 Compression Pressure (bar)" },
  { key: "P3_real_bar", label: "P3 Real Peak Pressure (bar)" },
  { key: "eta_brake_pct", label: "Brake Efficiency (%)" },
  { key: "bsfc_g_kWh", label: "BSFC (g/kWh)" },
];

const EDITABLE_INPUT_KEYS = new Set([
  "CR",
  "lambda",
  "rpm",
  "bore_stroke_ratio",
]);

function shouldShow(it: ItemSchema) {
  const v = (it.ui_visible ?? "TRUE") as any;
  const isVisible = typeof v === "boolean" ? v : String(v).toLowerCase() !== "false";
  const role = (it.ui_role ?? "").toLowerCase();
  if (!isVisible) return false;
  if (role === "hidden_row" || role === "hidden") return false;
  return true;
}

function isEditable(it: ItemSchema) {
  return (it.ui_role ?? "").toLowerCase() === "input";
}

function normalizeDType(dtype?: string): DType {
  const dt = (dtype ?? "").toLowerCase().trim();
  if (dt === "percent " || dt === "percent") return "percent";
  if (dt === "number") return "number";
  if (dt === "text") return "text";
  return dt || "text";
}

function coerceDefault(it: ItemSchema) {
  if (it.default !== undefined && it.default !== null && it.default !== "") return it.default;
  const dt = normalizeDType(it.dtype);
  return dt === "number" || dt === "percent" ? 0 : "";
}

function shouldInit(uiRole?: string) {
  const r = (uiRole ?? "").toLowerCase().trim();
  return r === "input" || r === "readonly";
}

function buildInitialInputs(schema: MasterSchema) {
  const init: Record<string, any> = {};
  for (const it of schema.items ?? []) {
    if (!it?.metric_key) continue;
    if (shouldInit(it.ui_role)) {
      init[it.metric_key] = coerceDefault(it);
    }
  }
  return init;
}

function safeNumber(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function clampIfNeeded(it: ItemSchema, raw: any) {
  const dt = normalizeDType(it.dtype);
  if (dt !== "number" && dt !== "percent") return raw;

  const n = safeNumber(raw);
  if (n === null) return raw;

  const mn = safeNumber(it.min);
  const mx = safeNumber(it.max);

  let out = n;
  if (mn !== null) out = Math.max(out, mn);
  if (mx !== null) out = Math.min(out, mx);
  return out;
}

function nextModelName(count: number) {
  return `Model ${String.fromCharCode(65 + count)}`;
}

function formatModelNameFromInputs(inputs: Record<string, any>, fallback: string) {
  const cr = Number(inputs?.CR);
  if (!Number.isFinite(cr) || cr <= 0) return fallback;
  return `HOPE-${Math.round(cr)}`;
}

function uniqueModelName(
  proposed: string,
  currentId: string,
  models: { id: string; name: string }[]
) {
  const used = models.filter((m) => m.id !== currentId).map((m) => m.name);
  if (!used.includes(proposed)) return proposed;

  let i = 2;
  while (used.includes(`${proposed} (${i})`)) i++;
  return `${proposed} (${i})`;
}

function formatValueForDisplay(it: ItemSchema, raw: any) {
  if (it.metric_key === "m_water_display") return "Internally optimized";
  if (raw === null || raw === undefined || raw === "") return "";

  const fmt = String(it.format ?? "").toLowerCase();
  const dt = String(it.dtype ?? "").toLowerCase();

  if (dt === "percent" || fmt.startsWith("percent")) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return String(raw);
    if (fmt === "percent_1") return `${(n * 100).toFixed(1)}%`;
    if (fmt === "percent_2") return `${(n * 100).toFixed(2)}%`;
    return `${(n * 100).toFixed(2)}%`;
  }

  if (fmt === "int") {
    const n = Number(raw);
    return Number.isFinite(n) ? String(Math.round(n)) : String(raw);
  }

  if (fmt === "1dp") {
    const n = Number(raw);
    return Number.isFinite(n) ? n.toFixed(1) : String(raw);
  }

  if (fmt === "2dp") {
    const n = Number(raw);
    return Number.isFinite(n) ? n.toFixed(2) : String(raw);
  }

  return String(raw);
}

function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildDisplayExportCsv(panels: PanelGroup[], models: ModelState[]) {
  const header = ["Panel", "Metric", "Label", ...models.map((m) => m.name)];
  const rows: string[][] = [header];

  for (const panel of panels) {
    for (const it of panel.items) {
      const row = [
        panel.panel_key,
        it.metric_key,
        it.label,
        ...models.map((model) => {
          if (model.valueDisplay[it.metric_key] !== undefined) {
            return String(model.valueDisplay[it.metric_key]);
          }
          if (model.values[it.metric_key] !== undefined) {
            return formatValueForDisplay(it, model.values[it.metric_key]);
          }
          if (model.inputs[it.metric_key] !== undefined) {
            return formatValueForDisplay(it, model.inputs[it.metric_key]);
          }
          return "";
        }),
      ];
      rows.push(row);
    }
  }

  return rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

function splitPanels(source: PanelGroup[]): PanelGroup[] {
  const out: PanelGroup[] = [];

  for (const panel of source) {
    if (panel.panel_key !== "Input") {
      out.push(panel);
      continue;
    }

    const editable = panel.items.filter((it) => EDITABLE_INPUT_KEYS.has(it.metric_key));
    const reference = panel.items.filter((it) => !EDITABLE_INPUT_KEYS.has(it.metric_key));

    out.push({
      panel_key: "Editable Inputs",
      panel_order: panel.panel_order,
      items: editable,
    });

    out.push({
      panel_key: "Reference Inputs",
      panel_order: panel.panel_order + 0.1,
      items: reference,
    });
  }

  return out;
}

function getRangeText(it: ItemSchema) {
  const min = it.min;
  const max = it.max;

  if (min === undefined || min === null || max === undefined || max === null) {
    return "";
  }

  const dt = normalizeDType(it.dtype);

  if (dt === "percent") {
    const minNum = Number(min);
    const maxNum = Number(max);
    if (Number.isFinite(minNum) && Number.isFinite(maxNum)) {
      return `Range: ${(minNum * 100).toFixed(1)}%–${(maxNum * 100).toFixed(1)}%`;
    }
  }

  return `Range: ${min}–${max}`;
}

function getPanelHeaderColor(panelKey: string) {
  switch (panelKey) {
    case "Editable Inputs":
      return "rgba(59, 130, 246, 0.1)";
    case "Reference Inputs":
      return "rgba(100, 116, 139, 0.1)";
    case "Compression":
      return "rgba(14, 165, 233, 0.1)";
    case "Pressure & Force":
      return "rgba(244, 63, 94, 0.1)";
    case "Temperature":
      return "rgba(249, 115, 22, 0.1)";
    case "Heat":
      return "rgba(245, 158, 11, 0.1)";
    case "Work":
      return "rgba(16, 185, 129, 0.1)";
    case "Efficiency":
      return "rgba(139, 92, 246, 0.1)";
    case "Performance":
      return "rgba(59, 130, 246, 0.15)";
    case "Operating Envelope":
      return "rgba(71, 85, 105, 0.1)";
    default:
      return "rgba(255, 255, 255, 0.05)";
  }
}

function isPercentMetric(metricKey: string) {
  return metricKey === "eta_brake_pct";
}

function getGraphMetricDecimals(metricKey: string) {
  switch (metricKey) {
    case "T2_C":
    case "T3_real_C":
    case "P2_bar":
    case "P3_real_bar":
    case "bsfc_g_kWh":
      return 1;
    case "eta_brake_pct":
      return 1;
    default:
      return 2;
  }
}

function formatGraphValue(metricKey: string, raw: number) {
  if (!Number.isFinite(raw)) return "";
  const decimals = getGraphMetricDecimals(metricKey);
  if (isPercentMetric(metricKey)) {
    return `${(raw * 100).toFixed(decimals)}%`;
  }
  return raw.toFixed(decimals);
}

function pctOfInput(value: number, total: number) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total === 0) return 0;
  return (value / total) * 100;
}

function pctOfGrossCooling(value: number, gross: number) {
  if (!Number.isFinite(value) || !Number.isFinite(gross) || gross === 0) return 0;
  return (value / gross) * 100;
}

function safeMetric(values: Record<string, any>, key: string) {
  const n = Number(values?.[key]);
  return Number.isFinite(n) ? n : 0;
}

function linspace(start: number, end: number, count: number) {
  if (count <= 1) return [start];
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, i) => start + i * step);
}



export default function HybridExplorer() {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const ihrlRef = useRef<HTMLDivElement | null>(null);
  const netEnergyRef = useRef<HTMLDivElement | null>(null);
  const [schema, setSchema] = useState<MasterSchema | null>(null);
  const [models, setModels] = useState<ModelState[]>([]);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [loadingCompute, setLoadingCompute] = useState(false);
  const [err, setErr] = useState("");
  const [keyMetricsOnly, setKeyMetricsOnly] = useState(false);
  const [selectedGraphMetric, setSelectedGraphMetric] = useState("T2_C");
  const [selectedSankeyModelId, setSelectedSankeyModelId] = useState<string>("");
  

  const [panelOpen, setPanelOpen] = useState<Record<string, boolean>>({
    "Performance Graph": true,
   
    "Editable Inputs": true,
    "Reference Inputs": false,
    Compression: true,
    "Pressure & Force": false,
    Temperature: false,
    Heat: false,
    Work: false,
    Efficiency: true,
    Performance: true,
    "Operating Envelope": false,
    "IHRL Cooling Recovery Flow": true,
    "Sankey Energy Flow": true,
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingSchema(true);
        setErr("");

        const res = await fetch("/api/schema", { method: "GET" });
        if (!res.ok) throw new Error(`Schema fetch failed: ${res.status}`);

        const data = (await res.json()) as MasterSchema;
        if (!alive) return;

        const items = Array.isArray(data.items) ? data.items : [];
        const cleaned: MasterSchema = {
          items: items
            .filter((x) => x && x.metric_key && x.panel_key)
            .map((x) => ({
              ...x,
              panel_order: Number((x as any).panel_order ?? 999),
              item_order: Number((x as any).item_order ?? 999),
              dtype: normalizeDType((x as any).dtype),
            })),
        };

        setSchema(cleaned);

        const init = buildInitialInputs(cleaned);
        const firstId = crypto.randomUUID();
        const firstName = formatModelNameFromInputs(init, "Model A");

        setModels([
          {
            id: firstId,
            name: firstName,
            inputs: init,
            values: {},
            valueDisplay: {},
          },
        ]);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load schema");
      } finally {
        setLoadingSchema(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!schema || models.length === 0) return;

    let cancelled = false;

    const snapshot = models.map((m) => ({
      id: m.id,
      inputs: { ...m.inputs },
    }));

    const handle = setTimeout(() => {
      (async () => {
        try {
          setLoadingCompute(true);
          setErr("");

          const computed = await Promise.all(
            snapshot.map(async (model) => {
              const res = await fetch("/api/compute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputs: model.inputs }),
              });

              if (!res.ok) throw new Error(`Compute failed: ${res.status}`);
              const data = (await res.json()) as ComputeResponse;

              return {
                id: model.id,
                values: data.values ?? {},
                valueDisplay: data.value_display ?? {},
              };
            })
          );

          if (cancelled) return;

          setModels((prev) =>
            prev.map((model) => {
              const hit = computed.find((x) => x.id === model.id);
              if (!hit) return model;
              return {
                ...model,
                values: hit.values,
                valueDisplay: hit.valueDisplay,
              };
            })
          );
        } catch (e: any) {
          if (!cancelled) setErr(e?.message ?? "Compute failed");
        } finally {
          if (!cancelled) setLoadingCompute(false);
        }
      })();
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [schema, models.map((m) => JSON.stringify(m.inputs)).join("|"), models.length]);

  useEffect(() => {
    if (!models.length) return;
    const exists = models.some((m) => m.id === selectedSankeyModelId);
    if (!selectedSankeyModelId || !exists) {
      setSelectedSankeyModelId(models[0].id);
    }
  }, [models, selectedSankeyModelId]);

  

  const panels = useMemo(() => {
    if (!schema) return [];

    const items = schema.items.filter((it) => {
      if (!shouldShow(it)) return false;
      if (!keyMetricsOnly) return true;
      return KEY_METRICS.has(it.metric_key);
    });

    const byPanel = new Map<string, ItemSchema[]>();

    for (const it of items) {
      if (!byPanel.has(it.panel_key)) byPanel.set(it.panel_key, []);
      byPanel.get(it.panel_key)!.push(it);
    }

    const panelList: PanelGroup[] = Array.from(byPanel.entries()).map(([panel_key, list]) => ({
      panel_key,
      panel_order: Math.min(...list.map((x) => x.panel_order ?? 999)),
      items: [...list].sort((a, b) => (a.item_order ?? 999) - (b.item_order ?? 999)),
    }));

    panelList.sort((a, b) => a.panel_order - b.panel_order);
    return splitPanels(panelList);
  }, [schema, keyMetricsOnly]);

  const graphData = useMemo(() => {
    return models
      .map((model, idx) => {
        const cr = Number(model.inputs.CR);
        const raw = model.values[selectedGraphMetric];

        let value: number | null = null;
        if (raw !== undefined && raw !== null && raw !== "") {
          const num = Number(raw);
          value = Number.isFinite(num) ? num : null;
        }

        return {
          name: model.name || `Model ${idx + 1}`,
          CR: Number.isFinite(cr) ? cr : idx + 1,
          value,
          valueLabel: value !== null ? formatGraphValue(selectedGraphMetric, value) : "",
        };
      })
      .filter((row) => row.value !== null)
      .sort((a, b) => a.CR - b.CR);
  }, [models, selectedGraphMetric]);

  const sankeyModel = useMemo(() => {
    return models.find((m) => m.id === selectedSankeyModelId) ?? models[0] ?? null;
  }, [models, selectedSankeyModelId]);

  const ihrlSankeyData = useMemo(() => {
    if (!sankeyModel) return null;

    const values = sankeyModel.values ?? {};
    const coolGross = safeMetric(values, "Q_cool_gross_J");
    const coolNet = safeMetric(values, "Q_cool_net_J");
    const ihrl = safeMetric(values, "Q_rec_IHRL_J");

    return {
      nodes: [
        { name: "Cooling Gross" },
        { name: "IHRL Recovery" },
        { name: "Cooling Net Loss" },
      ],
      links: [
        { source: 0, target: 1, value: Math.max(ihrl, 0) },
        { source: 0, target: 2, value: Math.max(coolNet, 0) },
      ],
      summary: {
        coolGross,
        ihrl,
        coolNet,
        ihrlPct: pctOfGrossCooling(ihrl, coolGross),
        coolNetPct: pctOfGrossCooling(coolNet, coolGross),
      },
    };
  }, [sankeyModel]);

  const sankeyData = useMemo(() => {
    if (!sankeyModel) return null;

    const values = sankeyModel.values ?? {};
    const qIn = safeMetric(values, "Q_in_J");
    const brake = safeMetric(values, "W_brake_J");
    const exhaust = safeMetric(values, "Q_exh_real_bal_J");
    const coolNet = safeMetric(values, "Q_cool_net_J");
    const friction = safeMetric(values, "Q_fric_J");
    const unburned = safeMetric(values, "Q_ub_J");

    return {
      nodes: [
        { name: "Fuel Input" },
        { name: "Cycle Energy" },
        { name: "Brake Work" },
        { name: "Exhaust" },
        { name: "Cooling Net Loss" },
        { name: "Friction" },
        { name: "Unburned" },
      ],
      links: [
        { source: 0, target: 1, value: qIn },
        { source: 1, target: 2, value: Math.max(brake, 0) },
        { source: 1, target: 3, value: Math.max(exhaust, 0) },
        { source: 1, target: 4, value: Math.max(coolNet, 0) },
        { source: 1, target: 5, value: Math.max(friction, 0) },
        { source: 1, target: 6, value: Math.max(unburned, 0) },
      ],
      summary: {
        qIn,
        brakePct: pctOfInput(brake, qIn),
        exhaustPct: pctOfInput(exhaust, qIn),
        coolNetPct: pctOfInput(coolNet, qIn),
        frictionPct: pctOfInput(friction, qIn),
        unburnedPct: pctOfInput(unburned, qIn),
      },
    };
  }, [sankeyModel]);

  function addModel() {
    if (!schema) return;

    setModels((prev) => {
      if (prev.length >= MAX_MODELS) return prev;

      const baseInputs =
        prev.length > 0 ? prev[prev.length - 1].inputs : buildInitialInputs(schema);

      const fallback = nextModelName(prev.length);
      const proposed = formatModelNameFromInputs(baseInputs, fallback);
      const finalName = uniqueModelName(proposed, "__new__", prev);

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: finalName,
          inputs: { ...baseInputs },
          values: {},
          valueDisplay: {},
        },
      ];
    });
  }

  function resetAllModels() {
    if (!schema) return;
    const base = buildInitialInputs(schema);

    setModels([
      {
        id: crypto.randomUUID(),
        name: formatModelNameFromInputs(base, "Model A"),
        inputs: base,
        values: {},
        valueDisplay: {},
      },
    ]);
  }

  function onChange(modelId: string, it: ItemSchema, nextRaw: string) {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id !== modelId) return model;
        return {
          ...model,
          inputs: { ...model.inputs, [it.metric_key]: nextRaw },
        };
      })
    );
  }

  function onBlurValue(modelId: string, it: ItemSchema) {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id !== modelId) return model;

        const dt = normalizeDType(it.dtype);
        const raw = model.inputs[it.metric_key];
        const nextInputs = { ...model.inputs };

        if (dt === "number" || dt === "percent") {
          if (raw !== "" && raw !== null && raw !== undefined) {
            const n = Number(raw);
            if (Number.isFinite(n)) {
              nextInputs[it.metric_key] = clampIfNeeded(it, n);
            } else {
              nextInputs[it.metric_key] = coerceDefault(it);
            }
          }
        }

        let nextName = model.name;
        if (it.metric_key === "CR") {
          const fallback = model.name.startsWith("HOPE-") ? "Model" : model.name;
          const proposed = formatModelNameFromInputs(nextInputs, fallback);
          nextName = uniqueModelName(proposed, model.id, prev);
        }

        return {
          ...model,
          name: nextName,
          inputs: nextInputs,
        };
      })
    );
  }

  function getDisplayValue(model: ModelState, it: ItemSchema) {
    if (model.valueDisplay[it.metric_key] !== undefined) return model.valueDisplay[it.metric_key];
    if (model.values[it.metric_key] !== undefined) return formatValueForDisplay(it, model.values[it.metric_key]);
    if (model.inputs[it.metric_key] !== undefined) return formatValueForDisplay(it, model.inputs[it.metric_key]);
    return "";
  }

  function exportDisplayCsv() {
    const csv = buildDisplayExportCsv(panels, models);
    downloadTextFile("hope_display_compare.csv", csv, "text/csv;charset=utf-8");
  }

  async function downloadPanelPng(
    ref: React.RefObject<HTMLDivElement | null>,
    fileName: string
  ) {
    if (!ref.current) return;

    const dataUrl = await toPng(ref.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }

  async function downloadExplorerPdf() {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const sections = [
      { ref: graphRef, title: "Performance Graph" },
      { ref: ihrlRef, title: "IHRL Cooling Recovery Flow" },
      { ref: netEnergyRef, title: "Net Energy Partition" },
    ];

    let first = true;

    for (const section of sections) {
      if (!section.ref.current) continue;

      const dataUrl = await toPng(section.ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#050505",
      });

      const img = new Image();
      img.src = dataUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      const imgWidth = img.width;
      const imgHeight = img.height;

      const usableWidth = pageWidth - 20;
      const usableHeight = pageHeight - 20;

      const scale = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
      const renderWidth = imgWidth * scale;
      const renderHeight = imgHeight * scale;

      if (!first) pdf.addPage();

      pdf.setFontSize(12);
      pdf.text(section.title, 10, 10);
      pdf.addImage(dataUrl, "PNG", 10, 15, renderWidth, renderHeight);

      first = false;
    }

    pdf.save("hope_explorer_report.pdf");
  }



  function togglePanel(panelKey: string) {
    setPanelOpen((prev) => ({
      ...prev,
      [panelKey]: !(prev[panelKey] ?? true),
    }));
  }

  if (loadingSchema && !schema) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Initializing Engine...</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Tool Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            Engineering <span className="text-blue-500">Suite</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Thermodynamic Reference Model v1.2
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <GlowButton
            onClick={() => setKeyMetricsOnly((v) => !v)}
            variant={keyMetricsOnly ? "primary" : "outline"}
            className="text-[10px] uppercase font-black tracking-widest px-4 py-2"
          >
            {keyMetricsOnly ? "All Metrics" : "Key Metrics"}
          </GlowButton>

          <GlowButton
            onClick={addModel}
            disabled={!schema || models.length >= MAX_MODELS}
            variant="outline"
            className="text-[10px] uppercase font-black tracking-widest px-4 py-2 bg-white/5 border-white/10"
          >
            + Add Model
          </GlowButton>

          <GlowButton
            onClick={resetAllModels}
            disabled={!schema}
            variant="outline"
            className="text-[10px] uppercase font-black tracking-widest px-4 py-2 bg-white/5 border-white/10"
          >
            Reset
          </GlowButton>

          <GlowButton
            onClick={exportDisplayCsv}
            variant="outline"
            className="text-[10px] uppercase font-black tracking-widest px-4 py-2 bg-white/5 border-white/10"
          >
            Export CSV
          </GlowButton>
          
          <GlowButton
            onClick={downloadExplorerPdf}
            className="text-[10px] uppercase font-black tracking-widest px-4 py-2 bg-blue-600/10 border-blue-500/20 text-blue-400 shadow-blue-500/10 shadow-lg"
          >
            PDF Report
          </GlowButton>

          <div className="text-[10px] font-black font-mono text-slate-500 flex items-center gap-2 ml-2">
            <div className={cn("w-2 h-2 rounded-full", loadingCompute ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
            {loadingCompute ? "COMPUTING" : "READY"}
          </div>
        </div>
      </div>

      {err && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold uppercase tracking-wider">
          <span className="opacity-60 mr-2">Engine Error:</span> {err}
        </div>
      )}

      {models.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] shadow-2xl">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `300px repeat(${models.length}, minmax(180px, 1fr))`,
              alignItems: "stretch",
            }}
          >
            <div className="px-8 py-6 bg-white/5 border-b border-white/5 font-black text-slate-400 uppercase tracking-[0.2em] text-[10px] flex items-center">
              Active Configurations
            </div>

            {models.map((model) => (
              <div
                key={model.id}
                className="px-8 py-6 border-b border-l border-white/5 bg-white/[0.04] text-center font-black text-white text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                {model.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {!schema ? (
        <div className="p-20 text-center text-slate-600 font-black uppercase tracking-widest text-[10px]">
          No engine schema loaded.
        </div>
      ) : (
        <div className="space-y-6">
          {panels.map((panel) => {
            const isOpen = panelOpen[panel.panel_key] ?? true;

            return (
              <div
                key={panel.panel_key}
                className="glass rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]"
              >
                <button
                  type="button"
                  onClick={() => togglePanel(panel.panel_key)}
                  className="w-full flex justify-between items-center px-6 py-4 transition-colors hover:bg-white/5 border-none"
                  style={{ background: getPanelHeaderColor(panel.panel_key) }}
                >
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    {isOpen ? "▼ " : "▶ "} {panel.panel_key}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter opacity-50">Panel v1.0</span>
                </button>

                {isOpen && (
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full border-collapse min-w-[900px]">
                      <tbody>
                        {panel.items.map((it, rowIndex) => {
                          const role = (it.ui_role ?? "").toLowerCase();
                          if (role === "hidden") return null;

                          return (
                            <tr
                              key={`${panel.panel_key}-${it.metric_key}`}
                              className={cn(
                                "transition-all group border-b border-white/5",
                                rowIndex % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent",
                                "hover:bg-blue-500/[0.03]"
                              )}
                            >
                              <td className="px-8 py-5 min-w-[300px]">
                                <div className="text-[12px] font-black text-slate-200 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                                  {it.label}
                                </div>
                                {panel.panel_key === "Editable Inputs" && getRangeText(it) && (
                                  <div className="text-[9px] font-bold text-slate-600 uppercase mt-1.5 tracking-widest opacity-80">
                                    {getRangeText(it)}
                                  </div>
                                )}
                              </td>

                              {models.map((model) => {
                                const display = getDisplayValue(model, it);
                                const masked = role === "hidden_value";

                                return (
                                  <td
                                    key={`${model.id}-${it.metric_key}`}
                                    className="px-8 py-5 border-l border-white/5 text-right w-[180px]"
                                  >
                                    {isEditable(it) ? (
                                      <input
                                        value={model.inputs[it.metric_key] ?? ""}
                                        onChange={(e) => onChange(model.id, it, e.target.value)}
                                        onBlur={() => onBlurValue(model.id, it)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            onBlurValue(model.id, it);
                                            (e.target as HTMLInputElement).blur();
                                          }
                                        }}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-right focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-[11px] font-bold tracking-tight shadow-inner"
                                        inputMode={
                                          normalizeDType(it.dtype) === "number" ||
                                          normalizeDType(it.dtype) === "percent"
                                            ? "decimal"
                                            : "text"
                                        }
                                      />
                                    ) : (
                                      <div className="inline-block min-w-[120px] px-4 py-2.5 rounded-xl bg-blue-500/[0.03] border border-blue-500/10 text-right font-mono text-[12px] font-black text-blue-400 group-hover:bg-blue-500/[0.06] transition-all tracking-tighter shadow-sm">
                                        {masked ? "••••" : display}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}

          {/* Graphical Analysis Section */}
          <div className="grid grid-cols-1 gap-6">
            <div className="glass rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
              <button
                type="button"
                onClick={() => togglePanel("Performance Graph")}
                className="w-full flex justify-between items-center px-6 py-4 bg-blue-600/10 hover:bg-blue-600/20 transition-colors border-none"
              >
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  {(panelOpen["Performance Graph"] ?? true) ? "▼ " : "▶ "} Graphical Performance Analysis
                </span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Multi-Model Trend</span>
              </button>

              {(panelOpen["Performance Graph"] ?? true) && (
                <div ref={graphRef} className="p-8 space-y-8">
                  <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Dimension:</label>
                    <select
                      value={selectedGraphMetric}
                      onChange={(e) => setSelectedGraphMetric(e.target.value)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                    >
                      {GRAPH_METRIC_OPTIONS.map((opt) => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="h-[340px] w-full">
                    {graphData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={graphData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis 
                            dataKey="CR" 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={10} 
                            tick={{ fill: "rgba(255,255,255,0.4)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={10} 
                            tick={{ fill: "rgba(255,255,255,0.4)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "#0f0f12", 
                              borderColor: "rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              fontSize: "10px",
                              fontWeight: "900",
                              color: "#fff"
                            }}
                            itemStyle={{ color: "#3b82f6" }}
                            formatter={(value: any) => [formatGraphValue(selectedGraphMetric, Number(value)), "Value"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-700 uppercase tracking-widest">
                        Insufficient data for trajectory analysis
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IHRL Flow */}
              <div className="glass rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
                <button
                  type="button"
                  onClick={() => togglePanel("IHRL Cooling Recovery Flow")}
                  className="w-full flex justify-between items-center px-6 py-4 bg-emerald-600/10 hover:bg-emerald-600/20 transition-colors border-none"
                >
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    {(panelOpen["IHRL Cooling Recovery Flow"] ?? true) ? "▼ " : "▶ "} Energy Recovery Flow
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">IHRL Optimization</span>
                </button>

                {(panelOpen["IHRL Cooling Recovery Flow"] ?? true) && (
                  <div ref={ihrlRef} className="p-6 space-y-6">
                    <select
                      value={selectedSankeyModelId}
                      onChange={(e) => setSelectedSankeyModelId(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase outline-none focus:border-blue-500/50"
                    >
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>

                    <div className="h-[250px] w-full">
                      {ihrlSankeyData && ihrlSankeyData.summary.coolGross > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <Sankey
                            data={ihrlSankeyData}
                            nodePadding={50}
                            nodeWidth={10}
                            linkCurvature={0.4}
                            node={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                            link={{ stroke: "rgba(16, 185, 129, 0.1)", strokeWidth: 1 }}
                          />
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-700 uppercase tracking-widest text-center">
                          Optimizing Energy flows...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Net Energy Partition */}
              <div className="glass rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
                <button
                  type="button"
                  onClick={() => togglePanel("Sankey Energy Flow")}
                  className="w-full flex justify-between items-center px-6 py-4 bg-violet-600/10 hover:bg-violet-600/20 transition-colors border-none"
                >
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    {(panelOpen["Sankey Energy Flow"] ?? true) ? "▼ " : "▶ "} Net Energy Partition
                  </span>
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Sankey Distribution</span>
                </button>

                {(panelOpen["Sankey Energy Flow"] ?? true) && (
                  <div ref={netEnergyRef} className="p-6 space-y-6">
                    <div className="h-[250px] w-full">
                      {sankeyData && sankeyData.summary.qIn > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <Sankey
                            data={sankeyData}
                            nodePadding={40}
                            nodeWidth={10}
                            linkCurvature={0.4}
                            node={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                            link={{ stroke: "rgba(139, 92, 246, 0.1)", strokeWidth: 1 }}
                          />
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-700 uppercase tracking-widest text-center">
                          Awaiting trajectory data
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
