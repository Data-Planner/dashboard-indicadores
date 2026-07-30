import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Group = { id: string; name: string; color: string };
export type Indicator = {
  id: string;
  groupId: string;
  name: string;
  aliases: string[];
  unit: string;
  target?: number;
  priority: boolean;
};
export type ImportedRow = {
  id: string;
  sourceName: string;
  value: number;
  indicatorId?: string;
  ignored?: boolean;
};
export type ImportRecord = {
  id: string;
  fileName: string;
  reference: string;
  importedAt: string;
  rows: ImportedRow[];
};

type Store = {
  groups: Group[];
  indicators: Indicator[];
  imports: ImportRecord[];
  selectedImportId: string;
  setSelectedImportId: (id: string) => void;
  addGroup: (name: string, color: string) => string | null;
  updateGroup: (id: string, name: string, color: string) => string | null;
  deleteGroup: (id: string) => boolean;
  reorderGroups: (activeId: string, overId: string) => void;
  saveIndicator: (indicator: Omit<Indicator, "id"> & { id?: string }) => string | null;
  deleteIndicator: (id: string) => void;
  togglePriority: (id: string) => void;
  moveIndicator: (activeId: string, overId: string) => void;
  addImport: (record: ImportRecord) => void;
  linkRow: (importId: string, rowId: string, indicatorId: string) => void;
  ignoreRow: (importId: string, rowId: string) => void;
};

const STORAGE_KEY = "redeflex-indicators-v1";

export function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
}

const seedGroups: Group[] = [
  { id: "g-chip", name: "Chip", color: "emerald" },
  { id: "g-aquisicao", name: "Aquisição", color: "cyan" },
  { id: "g-ativacao", name: "Ativação", color: "amber" },
];
const seedIndicators: Indicator[] = [
  { id: "i-base", groupId: "g-chip", name: "Base ativa", aliases: ["chips ativos"], unit: "un", target: 12500, priority: true },
  { id: "i-recarga", groupId: "g-chip", name: "Recarga média", aliases: [], unit: "R$", target: 32, priority: false },
  { id: "i-novos", groupId: "g-aquisicao", name: "Novos clientes", aliases: ["novos cadastros"], unit: "un", target: 850, priority: true },
  { id: "i-conversao", groupId: "g-aquisicao", name: "Taxa de conversão", aliases: ["conversao"], unit: "%", target: 18, priority: false },
  { id: "i-ativacoes", groupId: "g-ativacao", name: "Ativações realizadas", aliases: ["ativacoes"], unit: "un", target: 2400, priority: true },
];
const seedImports: ImportRecord[] = [{
  id: "imp-demo",
  fileName: "indicadores_junho.xlsx",
  reference: "2026-06",
  importedAt: "2026-07-28T14:30:00.000Z",
  rows: [
    { id: "r1", sourceName: "Chips ativos", value: 11840, indicatorId: "i-base" },
    { id: "r2", sourceName: "Recarga média", value: 34.2, indicatorId: "i-recarga" },
    { id: "r3", sourceName: "Novos cadastros", value: 792, indicatorId: "i-novos" },
    { id: "r4", sourceName: "Ativacoes", value: 2210, indicatorId: "i-ativacoes" },
    { id: "r5", sourceName: "Cancelamentos", value: 74 },
  ],
}];

const IndicatorContext = createContext<Store | null>(null);

export function IndicatorProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState(seedGroups);
  const [indicators, setIndicators] = useState(seedIndicators);
  const [imports, setImports] = useState(seedImports);
  const [selectedImportId, setSelectedImportId] = useState("imp-demo");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { groups: Group[]; indicators: Indicator[]; imports: ImportRecord[]; selectedImportId?: string };
        setGroups(data.groups);
        setIndicators(data.indicators);
        setImports(data.imports);
        if (data.selectedImportId) setSelectedImportId(data.selectedImportId);
      }
    } catch { /* keep demo data if local state is invalid */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ groups, indicators, imports, selectedImportId }));
  }, [groups, indicators, imports, selectedImportId, hydrated]);

  const value = useMemo<Store>(() => ({
    groups, indicators, imports, selectedImportId, setSelectedImportId,
    addGroup(name, color) {
      if (groups.some((group) => normalize(group.name) === normalize(name))) return "Já existe um grupo com esse nome.";
      setGroups((items) => [...items, { id: crypto.randomUUID(), name: name.trim(), color }]);
      return null;
    },
    updateGroup(id, name, color) {
      if (groups.some((group) => group.id !== id && normalize(group.name) === normalize(name))) return "Já existe um grupo com esse nome.";
      setGroups((items) => items.map((group) => group.id === id ? { ...group, name: name.trim(), color } : group));
      return null;
    },
    deleteGroup(id) {
      if (indicators.some((indicator) => indicator.groupId === id)) return false;
      setGroups((items) => items.filter((group) => group.id !== id));
      return true;
    },
    reorderGroups(activeId, overId) {
      setGroups((items) => {
        const from = items.findIndex((item) => item.id === activeId);
        const to = items.findIndex((item) => item.id === overId);
        if (from < 0 || to < 0 || from === to) return items;
        const next = [...items];
        next.splice(to, 0, next.splice(from, 1)[0]);
        return next;
      });
    },
    saveIndicator(item) {
      const duplicate = indicators.some((indicator) => indicator.id !== item.id && normalize(indicator.name) === normalize(item.name));
      if (duplicate) return "Já existe um indicador com esse nome.";
      if (item.id) setIndicators((items) => items.map((indicator) => indicator.id === item.id ? { ...item, id: item.id as string } : indicator));
      else setIndicators((items) => [...items, { ...item, id: crypto.randomUUID() }]);
      return null;
    },
    deleteIndicator(id) { setIndicators((items) => items.filter((item) => item.id !== id)); },
    togglePriority(id) { setIndicators((items) => items.map((item) => item.id === id ? { ...item, priority: !item.priority } : item)); },
    moveIndicator(activeId, overId) {
      setIndicators((items) => {
        const from = items.findIndex((item) => item.id === activeId);
        if (from < 0) return items;
        const overIndicator = items.find((item) => item.id === overId);
        const targetGroupId = overIndicator?.groupId ?? (groups.some((g) => g.id === overId) ? overId : items[from].groupId);
        const next = [...items];
        const [moved] = next.splice(from, 1);
        moved.groupId = targetGroupId;
        const overIndex = next.findIndex((item) => item.id === overId);
        next.splice(overIndex >= 0 ? overIndex : next.length, 0, moved);
        return next;
      });
    },
    addImport(record) { setImports((items) => [record, ...items]); setSelectedImportId(record.id); },
    linkRow(importId, rowId, indicatorId) {
      const source = imports.find((item) => item.id === importId)?.rows.find((row) => row.id === rowId)?.sourceName;
      setImports((items) => items.map((item) => item.id === importId ? { ...item, rows: item.rows.map((row) => row.id === rowId ? { ...row, indicatorId, ignored: false } : row) } : item));
      if (source) setIndicators((items) => items.map((indicator) => indicator.id === indicatorId && !indicator.aliases.some((alias) => normalize(alias) === normalize(source)) ? { ...indicator, aliases: [...indicator.aliases, source] } : indicator));
    },
    ignoreRow(importId, rowId) { setImports((items) => items.map((item) => item.id === importId ? { ...item, rows: item.rows.map((row) => row.id === rowId ? { ...row, ignored: true } : row) } : item)); },
  }), [groups, indicators, imports, selectedImportId]);

  return <IndicatorContext.Provider value={value}>{children}</IndicatorContext.Provider>;
}

export function useIndicators() {
  const store = useContext(IndicatorContext);
  if (!store) throw new Error("useIndicators must be used inside IndicatorProvider");
  return store;
}

export function matchIndicator(name: string, indicators: Indicator[]) {
  const key = normalize(name);
  return indicators.find((item) => normalize(item.name) === key || item.aliases.some((alias) => normalize(alias) === key));
}