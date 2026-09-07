"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, DollarSign, Eye, Filter, Info, MousePointerClick, Percent, RadioTower, Sparkles } from "lucide-react";
import { RevenueFilterType } from "@/services/revenue.service";

interface AuthorRevenueClientProps {
  revenue: any;
  periods: Array<{ year: number; month: number; label: string }>;
}

export default function AuthorRevenueClient({ revenue, periods }: AuthorRevenueClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = (searchParams.get("filter") || revenue.filterType || "month") as RevenueFilterType;
  const [selectedPeriod, setSelectedPeriod] = useState(`${revenue.year || new Date().getFullYear()}-${revenue.month || new Date().getMonth() + 1}`);
  const [startDateInput, setStartDateInput] = useState(searchParams.get("startDate") || "");
  const [endDateInput, setEndDateInput] = useState(searchParams.get("endDate") || "");
  const isRealRevenue = revenue.revenueSource === "ADSTERRA_API";

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val) params.delete(key);
      else params.set(key, val);
    });
    router.push(`/dashboard/revenue?${params.toString()}`);
  };

  const handleFilterChange = (filter: RevenueFilterType) => {
    if (filter === "month") {
      const [y, m] = selectedPeriod.split("-");
      updateUrlParams({ filter: "month", year: y, month: m, startDate: null, endDate: null });
    } else if (filter === "custom") {
      updateUrlParams({ filter: "custom", startDate: startDateInput || null, endDate: endDateInput || null });
    } else {
      updateUrlParams({ filter, startDate: null, endDate: null });
    }
  };

  const handlePeriodChange = (val: string) => {
    setSelectedPeriod(val);
    const [y, m] = val.split("-");
    updateUrlParams({ filter: "month", year: y, month: m, startDate: null, endDate: null });
  };

  const filterButtons: Array<{ id: RevenueFilterType; label: string }> = [
    { id: "today", label: "Hoy" },
    { id: "month", label: "Mes" },
    { id: "week", label: "7 dias" },
    { id: "year", label: "Ano" },
    { id: "all", label: "Todo" },
    { id: "custom", label: "Rango" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Ingresos atribuidos</h1>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${isRealRevenue ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"}`}>
            {isRealRevenue ? "Adsterra real" : "RPM estimado"}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Reparto para <strong className="text-emerald-600 dark:text-emerald-400">{revenue.filterLabel}</strong>.
        </p>
      </div>

      <div className="flex items-start space-x-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <span>
          <strong>Nota de monetizacion:</strong>{" "}
          {isRealRevenue
            ? "Los montos usan el revenue real de Adsterra y se atribuyen a autores segun las lecturas registradas dentro de la plataforma."
            : `Los montos son estimados con RPM de $${revenue.rpmEstimate.toFixed(2)} porque la API de Adsterra aun no esta configurada o no respondio.`}{" "}
          Reparto: {revenue.authorSharePercentage}% autor / {revenue.platformSharePercentage}% plataforma.
        </span>
      </div>

      <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 dark:text-gray-400">
            <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Filtrar periodo</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleFilterChange(btn.id)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  currentFilter === btn.id
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {currentFilter === "month" && (
          <div className="flex items-center space-x-3 border-t border-gray-100 pt-2 dark:border-gray-800">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Mes:</span>
            <div className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <select value={selectedPeriod} onChange={(e) => handlePeriodChange(e.target.value)} className="cursor-pointer bg-transparent pr-2 text-xs font-bold text-gray-900 focus:outline-none dark:text-white">
                {periods.map((p) => (
                  <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`} className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentFilter === "custom" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (startDateInput) updateUrlParams({ filter: "custom", startDate: startDateInput, endDate: endDateInput });
            }}
            className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2 dark:border-gray-800"
          >
            <input type="date" value={startDateInput} onChange={(e) => setStartDateInput(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 p-1.5 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
            <input type="date" value={endDateInput} onChange={(e) => setEndDateInput(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 p-1.5 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            <button type="submit" className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700">
              Aplicar
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard title="Tus ingresos hoy" value={`$${revenue.todayAuthorShareAmount.toFixed(2)}`} detail={`${revenue.todayViews.toLocaleString()} lecturas hoy`} icon={<Clock className="h-4 w-4 text-emerald-600" />} color="text-emerald-600 dark:text-emerald-400" />
        <MetricCard title="Mes en curso" value={`$${revenue.currentMonthAuthorShareAmount.toFixed(2)}`} detail={`${revenue.currentMonthViews.toLocaleString()} vistas`} icon={<Sparkles className="h-4 w-4 text-blue-600" />} color="text-blue-600 dark:text-blue-400" />
        <MetricCard title={revenue.filterLabel} value={`$${revenue.authorShareAmount.toFixed(2)}`} detail={`${revenue.filteredViews.toLocaleString()} vistas atribuidas`} icon={<DollarSign className="h-4 w-4 text-purple-600" />} color="text-purple-600 dark:text-purple-400" />
        <MetricCard title="Total historico" value={`$${revenue.totalAuthorShareAmount.toFixed(2)}`} detail={`${revenue.totalViews.toLocaleString()} lecturas`} icon={<Eye className="h-4 w-4 text-amber-500" />} color="text-gray-900 dark:text-white" />
        <MetricCard title="Clicks / CTR sitio" value={revenue.totalClicks.toLocaleString()} detail={`CTR global: ${revenue.ctr.toFixed(2)}%`} icon={<MousePointerClick className="h-4 w-4 text-pink-600" />} color="text-pink-600 dark:text-pink-400" />
        <MetricCard title="CPM / Impresiones" value={`$${revenue.cpm.toFixed(2)}`} detail={`${revenue.totalImpressions.toLocaleString()} impresiones`} icon={<Percent className="h-4 w-4 text-cyan-600" />} color="text-cyan-600 dark:text-cyan-400" />
      </div>

      {isRealRevenue && (
        <div className="flex items-start space-x-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <RadioTower className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <span>
            Adsterra reporto ${revenue.grossEstimatedRevenue.toFixed(2)} para este periodo. Tu monto se calcula por participacion de lecturas dentro del sitio.
          </span>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, detail, icon, color }: { title: string; value: string; detail: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>{title}</span>
        {icon}
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{detail}</p>
    </div>
  );
}
