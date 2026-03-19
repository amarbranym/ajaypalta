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
import { GlassCard } from "./ui/GlassCard";
import { GlowButton } from "./ui/GlowButton";
import { Input } from "./ui/input";
import { ChevronDown, ChevronRight, FileJson, FileType, Image as ImageIcon, Plus, RotateCcw } from "lucide-react";

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

const MAX_MODELS = 4;

const KEY_METRICS = new Set([
  "vmax_cc",
  "cr",
  "tcap",
  "P2_bar",
  "T2_C",
  "P3_real_bar",
  "T3_real_C",
  "W_brake_J",
  "eta_brake_pct",
  "IMEP_bar",
  "bsfc_g_kWh",
]);

const GRAPH_METRIC_OPTIONS = [
  { key: "T2_C", label: "T2 Compression Temp (°C)" },
  { key: "T3_real_C", label: "T3 Combustion Temp (°C)" },
  { key: "P2_bar", label: "P2 Compression Pressure (bar)" },
  { key: "P3_real_bar", label: "P3 Peak Pressure (bar)" },
  { key: "eta_brake_pct", label: "Brake Efficiency (%)" },
  { key: "bsfc_g_kWh", label: "BSFC (g/kWh)" },
];

const EDITABLE_INPUT_KEYS = new Set([
  "vmax_cc",
  "cr",
  "tcap",
  "gamma_eff",
  "lambda",
  "rpm",
]);

function shouldShow(it: ItemSchema) {
  const v = (it.ui_visible ?? "TRUE") as any;
  const isVisible = typeof v === "boolean" ? v : String(v).toLowerCase() !== "false";
  return isVisible && it.ui_role !== "hidden";
}

function isEditable(it: ItemSchema) {
  return it.ui_role === "input" || EDITABLE_INPUT_KEYS.has(it.metric_key);
}

function normalizeDType(dtype?: string): DType {
  const dt = (dtype ?? "").toLowerCase().trim();
  if (dt === "percent") return "percent";
  return dt === "number" ? "number" : "text";
}

function formatValueForDisplay(it: ItemSchema, raw: any) {
  if (raw === null || raw === undefined || raw === "") return "—";
  const fmt = it.format ?? "";
  const dt = it.dtype ?? "";

  if (dt === "percent" || fmt.startsWith("percent")) {
    const n = Number(raw);
    return Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : String(raw);
  }

  const n = Number(raw);
  if (!Number.isFinite(n)) return String(raw);
  
  if (fmt === "int") return Math.round(n).toString();
  if (fmt === "1dp") return n.toFixed(1);
  if (fmt === "2dp") return n.toFixed(2);
  
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function safeMetric(values: Record<string, any>, key: string) {
  const n = Number(values?.[key]);
  return Number.isFinite(n) ? n : 0;
}

export default function ModelComparison() {
  const [schema, setSchema] = useState<MasterSchema | null>(null);
  const [models, setModels] = useState<ModelState[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGraphMetric, setSelectedGraphMetric] = useState("eta_brake_pct");
  const [selectedSankeyId, setSelectedSankeyId] = useState<string>("");
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({
    "Input": true,
    "Efficiency": true,
  });

  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/schema")
      .then(res => res.json())
      .then(data => {
        setSchema(data);
        const initInputs = (data.items || []).reduce((acc: any, it: any) => {
          if (it.ui_role === "input") acc[it.metric_key] = it.default ?? 0;
          return acc;
        }, {});
        
        // Add default HOPE model
        const firstId = crypto.randomUUID();
        setModels([{
          id: firstId,
          name: "HOPE-Standard",
          inputs: { vmax_cc: 1000, cr: 40, tcap: 2500, gamma_eff: 1.33, ...initInputs },
          values: {},
          valueDisplay: {}
        }]);
        setSelectedSankeyId(firstId);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (models.length === 0) return;
    const timer = setTimeout(() => {
      Promise.all(models.map(m => 
        fetch("/api/compute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: m.inputs })
        }).then(r => r.json())
      )).then(results => {
        setModels(prev => prev.map((m, i) => ({
          ...m,
          values: results[i].values,
          valueDisplay: results[i].value_display
        })));
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [JSON.stringify(models.map(m => m.inputs))]);

  const panels = useMemo(() => {
    if (!schema) return [];
    const groups: Map<string, ItemSchema[]> = new Map();
    schema.items.forEach(it => {
      if (!shouldShow(it)) return;
      if (!groups.has(it.panel_key)) groups.set(it.panel_key, []);
      groups.get(it.panel_key)!.push(it);
    });
    return Array.from(groups.entries()).map(([key, items]) => ({
      panel_key: key,
      panel_order: items[0].panel_order,
      items: items.sort((a,b) => a.item_order - b.item_order)
    })).sort((a,b) => a.panel_order - b.panel_order);
  }, [schema]);

  const sankeyData = useMemo(() => {
    const m = models.find(x => x.id === selectedSankeyId) || models[0];
    if (!m || !m.values) return null;
    const v = m.values;
    const qIn = safeMetric(v, "Q_in_J");
    if (qIn <= 0) return null;
    
    return {
      nodes: [
        { name: "Fuel Input" }, { name: "Cycle Energy" }, { name: "Brake Work" },
        { name: "Exhaust" }, { name: "Cooling Net" }, { name: "Friction" }
      ],
      links: [
        { source: 0, target: 1, value: qIn },
        { source: 1, target: 2, value: safeMetric(v, "W_brake_J") },
        { source: 1, target: 3, value: safeMetric(v, "Q_exh_real_bal_J") },
        { source: 1, target: 4, value: safeMetric(v, "Q_cool_net_J") },
        { source: 1, target: 5, value: safeMetric(v, "Q_fric_J") }
      ]
    };
  }, [models, selectedSankeyId]);

  if (loading) return <div className="p-20 text-center text-slate-500">Initializing Explorer...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-2">
          {models.map(m => (
            <GlowButton 
              key={m.id}
              variant={selectedSankeyId === m.id ? "primary" : "outline"}
              onClick={() => setSelectedSankeyId(m.id)}
              className="text-xs py-1 px-4"
            >
              {m.name}
            </GlowButton>
          ))}
          {models.length < MAX_MODELS && (
            <button 
              onClick={() => setModels([...models, { ...models[0], id: crypto.randomUUID(), name: `Model ${models.length + 1}` }])}
              className="p-2 rounded-full border border-dashed border-white/20 hover:bg-white/5 transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <GlowButton variant="outline" className="text-xs h-9 px-4">
            <FileJson className="w-3.5 h-3.5 mr-2" /> Export JSON
          </GlowButton>
          <GlowButton variant="outline" className="text-xs h-9 px-4">
            <FileType className="w-3.5 h-3.5 mr-2" /> Export CSV
          </GlowButton>
        </div>
      </div>

      <GlassCard className="overflow-hidden border-white/5 bg-transparent!">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="p-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 sticky left-0 bg-[#0a0a0c] z-20 min-w-[240px]">
                  Thermodynamic Metric
                </th>
                {models.map(m => (
                  <th key={m.id} className="p-4 text-center text-sm font-bold text-white border-b border-white/5 min-w-[160px]">
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {panels.map(panel => (
                <React.Fragment key={panel.panel_key}>
                  <tr 
                    className="bg-blue-500/[0.03] cursor-pointer hover:bg-blue-500/[0.05] transition-colors"
                    onClick={() => setExpandedPanels(p => ({ ...p, [panel.panel_key]: !p[panel.panel_key] }))}
                  >
                    <td 
                      colSpan={models.length + 1} 
                      className="p-3 px-6 text-xs font-black text-blue-400 uppercase tracking-widest border-b border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        {expandedPanels[panel.panel_key] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        {panel.panel_key}
                      </div>
                    </td>
                  </tr>
                  {expandedPanels[panel.panel_key] && panel.items.map((it, idx) => (
                    <tr key={it.metric_key} className={idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"}>
                      <td className="p-4 text-sm font-medium text-slate-300 border-b border-white/5 sticky left-0 bg-[#0a0a0c] z-10 border-r border-white/5">
                        {it.label}
                      </td>
                      {models.map(m => (
                        <td key={m.id} className="p-4 text-center border-b border-white/5">
                          {isEditable(it) ? (
                            <Input 
                              type="number"
                              value={m.inputs[it.metric_key] ?? ""}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setModels(prev => prev.map(mm => mm.id === m.id ? { ...mm, inputs: { ...mm.inputs, [it.metric_key]: val } } : mm));
                              }}
                              className="w-24 mx-auto h-8 bg-white/5 border-white/10 text-center text-sm font-mono"
                            />
                          ) : (
                            <span className="text-sm font-mono font-bold text-white">
                              {getDisplayValue(m, it)}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Efficiency Trends</h3>
            <select 
              value={selectedGraphMetric}
              onChange={(e) => setSelectedGraphMetric(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-hidden"
            >
              {GRAPH_METRIC_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={models.map(m => ({ 
                name: m.name, 
                val: safeMetric(m.values, selectedGraphMetric) 
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
          <h3 className="text-xl font-bold text-white mb-8">Energy Partition Flow</h3>
          {sankeyData ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <Sankey
                  data={sankeyData}
                  nodePadding={50}
                  nodeWidth={15}
                  linkCurvature={0.4}
                  node={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
                  link={{ stroke: "rgba(59,130,246,0.15)" }}
                >
                  <Tooltip 
                     contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  />
                </Sankey>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">Awaiting detailed simulation data...</div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function getDisplayValue(model: ModelState, it: ItemSchema) {
  if (model.valueDisplay[it.metric_key] !== undefined) return model.valueDisplay[it.metric_key];
  if (model.values[it.metric_key] !== undefined) return formatValueForDisplay(it, model.values[it.metric_key]);
  if (model.inputs[it.metric_key] !== undefined) return formatValueForDisplay(it, model.inputs[it.metric_key]);
  return "—";
}
