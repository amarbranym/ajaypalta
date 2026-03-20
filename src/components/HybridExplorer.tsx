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
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  RotateCcw,
  Download,
  FileText,
  ChevronDown,
  ChevronRight,
  Calculator,
  Zap,
  Activity,
  Trophy,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "./ui/SectionWrapper";
import { GlowButton } from "./ui/GlowButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const togglePanel = (key: string) => {
    setPanelOpen((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? true),
    }));
  };

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



  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f0f12] border border-white/10 p-3 rounded-lg shadow-xl shadow-black/50 backdrop-blur-md">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-xs font-bold text-white uppercase tracking-tighter">
                {entry.name}: <span className="text-blue-400 font-mono ml-1">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loadingSchema && !schema) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
        />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 animate-pulse">Initializing Engine Diagnostics...</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className={cn("w-2 h-2 rounded-full", loadingCompute ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
              {loadingCompute ? "Computing Trajectories" : "Diagnostic Ready"}
            </span>
          </div>

          <GlowButton onClick={addModel} disabled={models.length >= MAX_MODELS} variant="outline" className="px-5 py-2.5 h-auto text-[10px] uppercase font-black tracking-widest gap-2">
            <Plus className="w-3 h-3" /> Add Model
          </GlowButton>

          <GlowButton onClick={resetAllModels} variant="outline" className="px-5 py-2.5 h-auto text-[10px] uppercase font-black tracking-widest gap-2 opacity-50 hover:opacity-100">
            <RotateCcw className="w-3 h-3" /> Reset
          </GlowButton>

          <GlowButton onClick={downloadExplorerPdf} className="px-6 py-2.5 h-auto text-[10px] uppercase font-black tracking-widest gap-2 bg-blue-600 shadow-blue-600/20 shadow-lg">
            <FileText className="w-3 h-3" /> Generate Report
          </GlowButton>
        </div>
      </div>

      {err && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="opacity-60">Engine Exception:</span> {err}
        </motion.div>
      )}

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* Left Column: Panel List and Inputs */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="bg-slate-900/40 border-white/5 backdrop-blur-sm overflow-hidden border-none shadow-2xl">
            <CardHeader className="bg-white/5 border-b border-white/5 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Configuration Panels</CardTitle>
                <button
                  onClick={() => setKeyMetricsOnly(!keyMetricsOnly)}
                  className="text-[10px] font-black text-blue-400 uppercase tracking-[0.1em] hover:text-blue-300 transition-colors"
                >
                  {keyMetricsOnly ? "Show All Specs" : "Key Specs Only"}
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {panels.map((panel) => {
                  const isOpen = panelOpen[panel.panel_key] ?? true;
                  return (
                    <div key={panel.panel_key} className="flex flex-col">
                      <button
                        onClick={() => togglePanel(panel.panel_key)}
                        className="flex items-center justify-between w-full px-6 py-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1 rounded bg-blue-500/10">
                            {isOpen ? <ChevronDown className="w-3 h-3 text-blue-400" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                          </div>
                          <span className={cn("text-[11px] font-black uppercase tracking-widest", isOpen ? "text-white" : "text-slate-500")}>
                            {panel.panel_key}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600">{panel.items.length} Metrics</span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/[0.01]"
                          >
                            <div className="p-6 space-y-6">
                              {panel.items.map((it) => {
                                if (!isEditable(it)) return null;
                                return (
                                  <div key={it.metric_key} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {it.label}
                                      </Label>
                                      {getRangeText(it) && (
                                        <span className="text-[9px] font-mono text-slate-600">{getRangeText(it)}</span>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                      {models.map((model) => (
                                        <div key={model.id} className="relative group">
                                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black font-mono text-slate-600 group-focus-within:text-blue-500/50 transition-colors uppercase">
                                            {model.name}
                                          </div>
                                          <Input
                                            value={model.inputs[it.metric_key] ?? ""}
                                            onChange={(e) => onChange(model.id, it, e.target.value)}
                                            onBlur={() => onBlurValue(model.id, it)}
                                            className="bg-white/5 border-white/10 pl-20 text-right font-mono text-xs font-bold text-white focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 transition-all h-9"
                                            placeholder="--"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Metrics and Visuals */}
        <div className="xl:col-span-8 space-y-8">

          {/* Active Model Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, idx) => {
              const efficiency = Number(model.values.eta_brake_pct);
              return (
                <Card key={model.id} className="bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -translate-y-1/2 translate-x-1/2" />
                  <CardHeader className="py-4 px-6 border-b border-white/5 flex flex-row items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-[10px] font-black">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <CardTitle className="text-[11px] font-black uppercase tracking-[0.1em] text-white">
                        {model.name}
                      </CardTitle>
                    </div>
                    <Trophy className={cn("w-3 h-3", efficiency > 0.6 ? "text-amber-500" : "text-slate-700")} />
                  </CardHeader>
                  <CardContent className="p-6 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efficiency</Label>
                        <div className="text-xl font-black text-blue-400 font-mono tracking-tighter">
                          {formatGraphValue("eta_brake_pct", efficiency)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Peak Pres.</Label>
                        <div className="text-xl font-black text-white font-mono tracking-tighter">
                          {Math.round(Number(model.values.P3_real_bar))} <span className="text-[10px] text-slate-500">bar</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Peak Temp.</Label>
                        <div className="text-xl font-black text-white font-mono tracking-tighter">
                          {Math.round(Number(model.values.T3_real_C))} <span className="text-[10px] text-slate-500">°C</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">BSFC</Label>
                        <div className="text-xl font-black text-emerald-400 font-mono tracking-tighter">
                          {Math.round(Number(model.values.bsfc_g_kWh))} <span className="text-[10px] text-slate-500">g/kWh</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="trends" className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-1">
              <TabsList className="bg-white/5 border border-white/5 p-1 h-auto rounded-xl">
                <TabsTrigger value="trends" className="px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white">Trend Analysis</TabsTrigger>
                <TabsTrigger value="energy" className="px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white">Energy Flow</TabsTrigger>
                <TabsTrigger value="detailed" className="px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white">Detailed Specs</TabsTrigger>
              </TabsList>

              {/* Only show dimension selector for trends */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Dimension:</span>
                <Select value={selectedGraphMetric} onValueChange={(val: string | null) => { if (val) setSelectedGraphMetric(val); }}>
                  <SelectTrigger className="w-[180px] h-9 bg-white/5 border-white/10 text-[10px] uppercase font-black tracking-widest text-white rounded-lg transition-colors hover:bg-white/[0.08]">
                    <SelectValue placeholder="Metric" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-white/10 text-white min-w-[280px]">
                    {GRAPH_METRIC_OPTIONS.map(opt => (
                      <SelectItem key={opt.key} value={opt.key} className="text-[10px] font-black uppercase tracking-widest py-2.5 focus:bg-blue-600 focus:text-white transition-colors">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="trends" className="mt-0">
              <Card className="bg-white/[0.01] border-white/5 overflow-hidden">
                <CardHeader className="py-6 px-8 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Comparative Performance Mapping</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pb-4">
                  <div className="h-[400px] w-full min-h-[400px] relative" ref={graphRef}>
                    {graphData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis
                            dataKey="CR"
                            stroke="rgba(255,255,255,0.2)"
                            fontSize={10}
                            tick={{ fill: "rgba(255,255,255,0.4)" }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'Compression Ratio (CR)', position: 'insideBottom', offset: -10, fontSize: 10, fill: 'rgba(255,255,255,0.2)', fontWeight: 900 }}
                          />
                          <YAxis
                            stroke="rgba(255,255,255,0.2)"
                            fontSize={10}
                            tick={{ fill: "rgba(255,255,255,0.4)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                          <Area
                            type="monotone"
                            dataKey="value"
                            name={GRAPH_METRIC_OPTIONS.find(o => o.key === selectedGraphMetric)?.label}
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-700 uppercase tracking-widest">
                        Insufficient trajectory data
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="energy" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/[0.01] border-white/5 overflow-hidden">
                  <CardHeader className="py-6 px-8 border-b border-white/5 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Recovery Chain</CardTitle>
                    </div>
                    <Select value={selectedSankeyModelId} onValueChange={(val: string | null) => { if (val) setSelectedSankeyModelId(val); }}>
                      <SelectTrigger className="w-[120px] h-8 bg-white/5 border-white/10 text-[9px] uppercase font-black tracking-widest">
                        <SelectValue placeholder="Model" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        {models.map(m => <SelectItem key={m.id} value={m.id} className="text-[9px] uppercase font-black">{m.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent className="p-8" ref={ihrlRef}>
                    <div className="h-[280px] w-full">
                      {ihrlSankeyData && ihrlSankeyData.summary.coolGross > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <Sankey
                            data={ihrlSankeyData}
                            nodePadding={50}
                            nodeWidth={10}
                            linkCurvature={0.4}
                            node={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                            link={{ stroke: "rgba(16, 185, 129, 0.2)", strokeWidth: 1 }}
                          />
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                          <Activity className="w-8 h-8 text-slate-800 animate-pulse" />
                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Optimizing Recovery flows...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/[0.01] border-white/5 overflow-hidden">
                  <CardHeader className="py-6 px-8 border-b border-white/5 overflow-hidden">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-violet-400" />
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Energy Partition</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8" ref={netEnergyRef}>
                    <div className="h-[280px] w-full">
                      {sankeyData && sankeyData.summary.qIn > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <Sankey
                            data={sankeyData}
                            nodePadding={40}
                            nodeWidth={10}
                            linkCurvature={0.4}
                            node={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                            link={{ stroke: "rgba(139, 92, 246, 0.2)", strokeWidth: 1 }}
                          />
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                          <Activity className="w-8 h-8 text-slate-800 animate-pulse" />
                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Awaiting Partition Data...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="mt-0">
              <Card className="bg-white/[0.01] border-white/5 overflow-hidden">
                <CardHeader className="py-6 px-8 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-4 h-4 text-slate-400" />
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Full Thermodynamic Specification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white/[0.03] border-b border-white/5">
                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Metric Definition</th>
                        {models.map(m => (
                          <th key={m.id} className="px-8 py-5 text-right text-[10px] font-black text-blue-400 uppercase tracking-widest border-l border-white/5">
                            {m.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {panels.map(p => (
                        <React.Fragment key={p.panel_key}>
                          <tr className="bg-white/[0.01]">
                            <td colSpan={models.length + 1} className="px-8 py-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] border-b border-white/5">
                              {p.panel_key}
                            </td>
                          </tr>
                          {p.items.map((it, i) => {
                            if (it.ui_role === "input" && p.panel_key === "Editable Inputs") return null;
                            if (it.ui_role === "hidden") return null;
                            return (
                              <tr key={it.metric_key} className={cn("border-b border-white/5 hover:bg-white/[0.02] transition-colors", i % 2 === 0 ? "bg-transparent" : "bg-white/[0.005]")}>
                                <td className="px-8 py-4">
                                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{it.label}</div>
                                </td>
                                {models.map(m => (
                                  <td key={m.id} className="px-8 py-4 text-right border-l border-white/5">
                                    <div className="text-[12px] font-black text-white font-mono tracking-tighter">
                                      {getDisplayValue(m, it)}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
