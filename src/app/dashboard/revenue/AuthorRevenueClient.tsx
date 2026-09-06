"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DollarSign, Eye, Info, Clock, Sparkles, Filter, Calendar } from "lucide-react";
import { RevenueFilterType } from "@/services/revenue.service";

interface AuthorRevenueClientProps {
  revenue: any;
  periods: Array<{ year: number; month: number; label: string }>;
}

export default function AuthorRevenueClient({ revenue, periods }: AuthorRevenueClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = (searchParams.get("filter") || revenue.filterType || "month") as RevenueFilterType;
  const [selectedPeriod, setSelectedPeriod] = useState(
    `${revenue.year || new Date().getFullYear()}-${revenue.month || (new Date().getMonth() + 1)}`
  );
  const [startDateInput, setStartDateInput] = useState(searchParams.get("startDate") || "");
  const [endDateInput, setEndDateInput] = useState(searchParams.get("endDate") || "");

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
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

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDateInput) {
      updateUrlParams({ filter: "custom", startDate: startDateInput, endDate: endDateInput });
    }
  };

  const filterButtons: Array<{ id: RevenueFilterType; label: string }> = [
    { id: "today", label: "Hoy" },
    { id: "month", label: "Mes en Curso / Mensual" },
    { id: "week", label: "Esta Semana" },
    { id: "year", label: "Este Año" },
    { id: "all", label: "Desde el Inicio" },
    { id: "custom", label: "Rango Personalizado" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Ingresos Atribuidos</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estimación transparente de ingresos publicitarios correspondientes a tu contenido para:{" "}
          <strong className="text-emerald-600 dark:text-emerald-400">{revenue.filterLabel}</strong>
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3 text-amber-800 dark:text-amber-300 text-xs">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Nota de Monetización:</strong> Los montos mostrados son <em>Ingresos Estimados</em> calculados en función de las reproducciones y el porcentaje de reparto configurado por la plataforma ({revenue.authorSharePercentage}% para ti / {revenue.platformSharePercentage}% para la plataforma). Basado en RPM de ${revenue.rpmEstimate.toFixed(2)}.
        </span>
      </div>

      {/* Period Filter Bar */}
      <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-bold">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Filtrar período:</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
            {filterButtons.map((btn) => {
              const active = currentFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => handleFilterChange(btn.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    active
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-750"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {currentFilter === "month" && (
          <div className="flex items-center space-x-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Seleccionar mes:</span>
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-xl">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none pr-2 cursor-pointer"
              >
                {periods.map((p) => (
                  <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentFilter === "custom" && (
          <form onSubmit={handleCustomDateSubmit} className="flex items-center space-x-3 flex-wrap gap-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Desde:</span>
              <input
                type="date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                className="p-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Hasta:</span>
              <input
                type="date"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                className="p-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
            >
              Aplicar Rango
            </button>
          </form>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Tus Ingresos de Hoy</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${revenue.todayAuthorShareAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-400">{revenue.todayViews.toLocaleString()} lecturas hoy</p>
        </div>

        {/* Current Month */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Mes en Curso</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">${revenue.currentMonthAuthorShareAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Reinicio al 1 de cada mes ({revenue.currentMonthViews.toLocaleString()} vistas)</p>
        </div>

        {/* Selected Period */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Tus Ingresos ({revenue.filterLabel})</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400">${revenue.authorShareAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-400">{revenue.filteredViews.toLocaleString()} vistas en período</p>
        </div>

        {/* Total All Time */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Histórico</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">${revenue.totalAuthorShareAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-400">{revenue.totalViews.toLocaleString()} lecturas históricas</p>
        </div>
      </div>
    </div>
  );
}
