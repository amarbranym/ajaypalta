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
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, FileJson, FileType, Image as ImageIcon, Plus, RotateCcw, Activity, Zap, ArrowRight } from "lucide-react";

function formatGraphValue(metricKey: string, raw: number) {
  if (!Number.isFinite(raw)) return "—";
  if (metricKey === "eta_brake_pct") return `${(raw * 100).toFixed(1)}%`;
  return raw.toFixed(2);
}

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
        { source: 0, target: 1, value: Math.max(0, qIn) },
        { source: 1, target: 2, value: Math.max(0, safeMetric(v, "W_brake_J")) },
        { source: 1, target: 3, value: Math.max(0, safeMetric(v, "Q_exh_real_bal_J")) },
        { source: 1, target: 4, value: Math.max(0, safeMetric(v, "Q_cool_net_J")) },
        { source: 1, target: 5, value: Math.max(0, safeMetric(v, "Q_fric_J")) }
      ]
    };
  }, [models, selectedSankeyId]);

  if (loading) return <div className="p-20 text-center text-slate-500">Initializing Explorer...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-3">
          {models.map((m, idx) => (
            <GlowButton 
              key={m.id}
              variant={selectedSankeyId === m.id ? "primary" : "outline"}
              onClick={() => setSelectedSankeyId(m.id)}
              className="text-[10px] uppercase font-black tracking-widest py-2 px-5 h-auto"
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  selectedSankeyId === m.id ? "bg-white animate-pulse" : "bg-blue-500/50"
                )} />
                {m.name}
              </div>
            </GlowButton>
          ))}
          {models.length < MAX_MODELS && (
            <button 
              onClick={() => {
                const base = models[models.length-1];
                setModels([...models, { ...base, id: crypto.randomUUID(), name: `Model ${String.fromCharCode(65 + models.length)}` }]);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <GlowButton onClick={() => {/* TODO: Implement JSON export */}} variant="outline" className="text-[10px] uppercase font-black tracking-widest h-10 px-6 gap-2 bg-white/[0.02]">
            <FileJson className="w-3.5 h-3.5 text-blue-400" /> Export JSON
          </GlowButton>
          <GlowButton onClick={() => {/* TODO: Implement CSV export */}} variant="outline" className="text-[10px] uppercase font-black tracking-widest h-10 px-6 gap-2 bg-white/[0.02]">
            <FileType className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
          </GlowButton>
        </div>
      </div>

      <GlassCard className="overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="p-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 sticky left-0 bg-[#0a0a0c] z-20 min-w-[280px]">
                  Thermodynamic Metric
                </th>
                {models.map(m => (
                  <th key={m.id} className="p-5 text-right text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-white/5 border-l border-white/5 min-w-[150px]">
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {panels.map((panel, pIdx) => (
                <React.Fragment key={panel.panel_key}>
                  <tr 
                    className="bg-blue-600/[0.05] cursor-pointer hover:bg-blue-600/[0.08] transition-colors group"
                    onClick={() => setExpandedPanels(p => ({ ...p, [panel.panel_key]: !p[panel.panel_key] }))}
                  >
                    <td 
                      colSpan={models.length + 1} 
                      className="p-4 px-8 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] border-b border-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-md bg-blue-600/20 flex items-center justify-center">
                            {expandedPanels[panel.panel_key] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </div>
                          {panel.panel_key}
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 group-hover:text-blue-400/50 transition-colors uppercase">
                          {panel.items.length} Metrics
                        </span>
                      </div>
                    </td>
                  </tr>
                  {expandedPanels[panel.panel_key] && panel.items.map((it, idx) => (
                    <tr key={it.metric_key} className={cn("hover:bg-white/[0.02] transition-colors border-b border-white/5", idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.005]")}>
                      <td className="p-4 px-8 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-[#0a0a0c] z-10 border-r border-white/5">
                        {it.label}
                      </td>
                      {models.map(m => (
                        <td key={m.id} className="p-4 text-right border-l border-white/5">
                          {isEditable(it) ? (
                            <div className="flex justify-end">
                              <Input 
                                type="number"
                                value={m.inputs[it.metric_key] ?? ""}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setModels(prev => prev.map(mm => mm.id === m.id ? { ...mm, inputs: { ...mm.inputs, [it.metric_key]: val } } : mm));
                                }}
                                className="w-24 h-8 bg-white/5 border-white/10 text-right text-xs font-mono font-bold text-white focus-visible:ring-blue-500/20 transition-all"
                              />
                            </div>
                          ) : (
                            <span className="text-xs font-black font-mono tracking-tighter text-white">
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

      <div className="grid grid-cols-1 gap-12">
        <GlassCard className="p-0 border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden border-none shadow-2xl">
          <div className="p-6 px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Efficiency Trends</h3>
            </div>
            <select 
              value={selectedGraphMetric}
              onChange={(e) => setSelectedGraphMetric(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg px-4 py-2 outline-none hover:bg-white/10 transition-all cursor-pointer"
            >
              {GRAPH_METRIC_OPTIONS.map(opt => <option key={opt.key} value={opt.key} className="bg-slate-900">{opt.label}</option>)}
            </select>
          </div>
          <div className="p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={models.map(m => ({ 
                  name: m.name, 
                  val: safeMetric(m.values, selectedGraphMetric) 
                }))} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
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
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#020617] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                            <div className="text-lg font-black text-blue-400 font-mono tracking-tighter">
                              {formatGraphValue(selectedGraphMetric, payload[0].value as number)}
                            </div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
                              {GRAPH_METRIC_OPTIONS.find(o => o.key === selectedGraphMetric)?.label}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ fill: "#3b82f6", r: 6, strokeWidth: 2, stroke: "#020617" }} 
                    activeDot={{ r: 8, fill: "#60a5fa", stroke: "white" }} 
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-0 border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden border-none shadow-2xl">
          <div className="p-6 px-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Energy Partition Flow</h3>
            </div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Active: {models.find(m => m.id === selectedSankeyId)?.name}
            </div>
          </div>
          <div className="p-8">
            {sankeyData ? (
              <div className="h-[550px] w-full min-h-[550px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <Sankey
                    data={sankeyData}
                    nodePadding={60}
                    nodeWidth={32}
                    linkCurvature={0.4}
                    margin={{ left: 120, right: 160, top: 40, bottom: 40 }}
                    node={(props: any) => {
                      const { x, y, width, height, index, payload } = props;
                      const colors = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
                      
                      // Explicit depth check from Recharts Sankey payload
                      const depth = payload.depth;
                      const isFirst = depth === 0;
                      const isLast = depth === 2 || (payload.linksIn?.length > 0 && payload.linksOut?.length === 0);
                      
                      return (
                        <g>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.9}
                            rx={6}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth={1.5}
                          />
                          <text
                            x={isFirst ? x - 16 : x + width + 16}
                            y={y + height / 2}
                            textAnchor={isFirst ? "end" : "start"}
                            dy=".35em"
                            fontSize={11}
                            fontWeight={900}
                            fill="#cbd5e1"
                            className="uppercase tracking-[0.12em]"
                            style={{ 
                              pointerEvents: 'none',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                            }}
                          >
                            {payload.name}
                          </text>
                        </g>
                      );
                    }}
                    link={{ stroke: "rgba(139, 92, 246, 0.4)" }}
                  >
                    <Tooltip 
                       content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                           const data = payload[0].payload;
                           if (data.source && data.target) {
                             return (
                               <div className="bg-[#020617] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Energy Flow</div>
                                 <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                                   <span className="text-blue-400">{data.source.name}</span>
                                   <ArrowRight className="w-3 h-3 text-slate-600" />
                                   <span className="text-emerald-400">{data.target.name}</span>
                                 </div>
                                 <div className="mt-2 text-lg font-black text-white font-mono tracking-tighter">
                                   {data.value.toLocaleString()} <span className="text-[10px] text-slate-500 uppercase">Joules</span>
                                 </div>
                               </div>
                             );
                           }
                           return (
                             <div className="bg-[#020617] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.name}</div>
                               <div className="text-lg font-black text-white font-mono tracking-tighter">{data.value.toLocaleString()} J</div>
                             </div>
                           );
                         }
                         return null;
                       }}
                    />
                  </Sankey>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <Activity className="w-8 h-8 text-slate-800 animate-pulse" />
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Computing flow trajectory...</p>
              </div>
            )}
          </div>
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
