"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DollarSign,
  Calendar,
  Eye,
  User,
  TrendingUp,
  Download,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  Clock,
  Sparkles
} from "lucide-react";
import { MonthlyRevenueReport, RevenueFilterType } from "@/services/revenue.service";

interface AdminRevenueReportClientProps {
  report: MonthlyRevenueReport;
  periods: Array<{ year: number; month: number; label: string }>;
}

export default function AdminRevenueReportClient({ report, periods }: AdminRevenueReportClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPeriod, setSelectedPeriod] = useState(
    `${report.year}-${report.month}`
  );
  const [rpmInput, setRpmInput] = useState(report.rpmEstimate.toString());
  const [isSavingRpm, setIsSavingRpm] = useState(false);
  const [rpmMessage, setRpmMessage] = useState("");

  const currentFilter = (searchParams.get("filter") || report.filterType || "month") as RevenueFilterType;
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
    router.push(`/admin/revenue?${params.toString()}`);
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

  const handleRpmUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRpm(true);
    setRpmMessage("");

    try {
      const val = parseFloat(rpmInput);
      if (isNaN(val) || val <= 0) throw new Error("RPM inválido");

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformSharePercentage: 30, // standard default fallback if not sent
          authorSharePercentage: 70,
          rpmEstimate: val,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar RPM en base de datos");

      setRpmMessage("RPM actualizado y guardado en la base de datos");
      updateUrlParams({ rpm: val.toString() });
    } catch (err: any) {
      setRpmMessage(err.message || "Error al actualizar RPM");
    } finally {
      setIsSavingRpm(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Autor",
      "Username",
      "Rol",
      "Artículos Período",
      "Vistas Período",
      "% Autor",
      "% Admin",
      "Ganancia Bruta",
      "Pago Autor ($)",
      "Ganancia Admin ($)",
    ];
    const rows = report.authors.map((a) => [
      `"${a.name}"`,
      `"${a.username}"`,
      a.role,
      a.articlesCount,
      a.monthlyViews,
      `${a.authorSharePct}%`,
      `${a.platformSharePct}%`,
      `$${a.grossRevenue.toFixed(2)}`,
      `$${a.authorShareAmount.toFixed(2)}`,
      `$${a.platformShareAmount.toFixed(2)}`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Ingresos_${report.filterLabel.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-white">
              Reporte de Ingresos & Cortes de Monetización
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800 rounded-full">
              RPM: ${report.rpmEstimate.toFixed(2)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Visualización y desglose de ganancias publicitarias para: <strong className="text-emerald-400">{report.filterLabel}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition shadow-xs self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV Período</span>
        </button>
      </div>

      {/* Filter Navigation Bar */}
      <div className="p-4 bg-gray-900 border border-gray-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2 text-xs text-gray-400 font-bold">
            <Filter className="w-4 h-4 text-blue-400" />
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
                      ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-750"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-controls depending on active filter */}
        {currentFilter === "month" && (
          <div className="flex items-center space-x-3 pt-2 border-t border-gray-800/80">
            <span className="text-xs text-gray-400 font-medium">Seleccionar mes específico:</span>
            <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-xl">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none pr-2 cursor-pointer"
              >
                {periods.map((p) => (
                  <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`} className="bg-gray-900 text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentFilter === "custom" && (
          <form onSubmit={handleCustomDateSubmit} className="flex items-center space-x-3 flex-wrap gap-y-2 pt-2 border-t border-gray-800/80">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 font-medium">Desde:</span>
              <input
                type="date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                className="p-1.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 font-medium">Hasta:</span>
              <input
                type="date"
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                className="p-1.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white"
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

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Today */}
        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Ingresos de Hoy</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">${report.todayGrossRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-gray-400">{report.todayViews.toLocaleString()} lecturas registradas hoy</p>
        </div>

        {/* Card 2: Current Month */}
        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Mes en Curso</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400">${report.currentMonthGrossRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-gray-400">Reinicia a $0.00 al inicio de mes ({report.currentMonthViews.toLocaleString()} vistas)</p>
        </div>

        {/* Card 3: Filtered Period Gross */}
        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Bruto Período ({report.filterLabel})</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white">${report.grossEstimatedRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-gray-400">Total bruto para el período filtrado</p>
        </div>

        {/* Card 4: Filtered Period Admin / Author Cut */}
        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Reparto del Período</span>
            <User className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xl font-bold text-emerald-400">${report.totalAuthorShareAmount.toFixed(2)} <span className="text-xs text-gray-400 font-normal">(Autores)</span></p>
            <p className="text-xl font-bold text-blue-400">${report.totalPlatformShareAmount.toFixed(2)} <span className="text-xs text-gray-400 font-normal">(Plataforma)</span></p>
          </div>
        </div>
      </div>

      {/* Adjustable RPM Bar with Database Persistence */}
      <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-gray-300">
            <Sliders className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <span>
              <strong>Ajuste de Cierre Adsterra (RPM):</strong> Cambia y guarda en la base de datos el RPM global de calculo ($ por 1,000 lecturas).
            </span>
          </div>

          <form onSubmit={handleRpmUpdate} className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-gray-400 font-bold">$</span>
            <input
              type="number"
              step="0.05"
              min="0.01"
              value={rpmInput}
              onChange={(e) => setRpmInput(e.target.value)}
              className="w-24 p-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-center font-bold text-xs"
            />
            <button
              type="submit"
              disabled={isSavingRpm}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {isSavingRpm ? "Guardando..." : "Guardar RPM"}
            </button>
          </form>
        </div>
        {rpmMessage && (
          <p className="text-xs font-semibold text-emerald-400 text-right">{rpmMessage}</p>
        )}
      </div>

      {/* Detailed Per-User Breakdown Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif text-xl font-bold text-white">
              Desglose de Autores ({report.filterLabel})
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-semibold">{report.authors.length} Autores en Reporte</span>
        </div>

        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-800/60 text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="p-4">Autor / Usuario</th>
                  <th className="p-4 text-center">Historias Período</th>
                  <th className="p-4 text-center">Vistas Período</th>
                  <th className="p-4 text-center">% Reparto</th>
                  <th className="p-4 text-right">Bruto Generado</th>
                  <th className="p-4 text-right">Pago al Autor</th>
                  <th className="p-4 text-right">Ganancia Admin</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {report.authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif overflow-hidden flex-shrink-0">
                          {author.avatarUrl ? (
                            <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                          ) : (
                            author.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{author.name}</span>
                            {author.role === "ADMIN" && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 rounded font-bold">Admin</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">@{author.username}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center font-semibold text-gray-200">
                      {author.articlesCount}
                    </td>

                    <td className="p-4 text-center font-bold text-amber-300">
                      {author.monthlyViews.toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-white">{author.authorSharePct}% Autor</span>
                        <span className="text-[10px] text-gray-400">{author.platformSharePct}% Admin</span>
                        {author.isCustomShare && (
                          <span className="text-[9px] bg-brand-950 text-brand-300 px-1 rounded border border-brand-800 mt-0.5">Personalizado</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right font-bold text-gray-300">
                      ${author.grossRevenue.toFixed(2)}
                    </td>

                    <td className="p-4 text-right font-black text-emerald-400 text-sm">
                      ${author.authorShareAmount.toFixed(2)}
                    </td>

                    <td className="p-4 text-right font-bold text-blue-400">
                      ${author.platformShareAmount.toFixed(2)}
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        <span>{author.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
