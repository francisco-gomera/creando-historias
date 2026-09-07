"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  MousePointerClick,
  Percent,
  RadioTower,
  Sliders,
  Sparkles,
  User,
} from "lucide-react";
import { MonthlyRevenueReport, RevenueFilterType } from "@/services/revenue.service";

interface AdminRevenueReportClientProps {
  report: MonthlyRevenueReport;
  periods: Array<{ year: number; month: number; label: string }>;
}

export default function AdminRevenueReportClient({ report, periods }: AdminRevenueReportClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState(`${report.year}-${report.month}`);
  const [rpmInput, setRpmInput] = useState(report.rpmEstimate.toString());
  const [isSavingRpm, setIsSavingRpm] = useState(false);
  const [rpmMessage, setRpmMessage] = useState("");
  const currentFilter = (searchParams.get("filter") || report.filterType || "month") as RevenueFilterType;
  const [startDateInput, setStartDateInput] = useState(searchParams.get("startDate") || "");
  const [endDateInput, setEndDateInput] = useState(searchParams.get("endDate") || "");
  const isRealRevenue = report.revenueSource === "ADSTERRA_API";

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val) params.delete(key);
      else params.set(key, val);
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

  const handleRpmUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRpm(true);
    setRpmMessage("");

    try {
      const val = parseFloat(rpmInput);
      if (isNaN(val) || val <= 0) throw new Error("RPM invalido");
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformSharePercentage: 30,
          authorSharePercentage: 70,
          rpmEstimate: val,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar RPM en base de datos");
      setRpmMessage("RPM de respaldo actualizado");
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
      "Historias Periodo",
      "Vistas Periodo",
      "% Autor",
      "% Admin",
      "Ganancia Bruta",
      "Pago Autor ($)",
      "Ganancia Admin ($)",
      "Fuente",
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
      report.revenueSource,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Reporte_Ingresos_${report.filterLabel.replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-2xl font-black text-white sm:text-3xl">
              Ingresos Adsterra
            </h1>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${isRealRevenue ? "border-emerald-800 bg-emerald-950 text-emerald-300" : "border-amber-800 bg-amber-950 text-amber-300"}`}>
              {isRealRevenue ? "API real" : "RPM estimado"}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            Reporte para <strong className="text-emerald-400">{report.filterLabel}</strong>.
          </p>
          {!report.adsterra.isConfigured && (
            <p className="mt-2 text-xs font-semibold text-amber-300">
              Agrega ADSTERRA_API_KEY en .env para activar ingresos reales. Mientras tanto se usa el RPM de respaldo.
            </p>
          )}
          {report.adsterra.isConfigured && !report.adsterra.isLive && (
            <p className="mt-2 text-xs font-semibold text-amber-300">
              Adsterra no respondio correctamente ({report.adsterra.error || "sin datos validos"}). Se usa el RPM de respaldo.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center space-x-1.5 self-start rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 md:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </button>
      </div>

      <div className="space-y-4 rounded-3xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
            <Filter className="h-4 w-4 text-blue-400" />
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
                    : "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {currentFilter === "month" && (
          <div className="flex items-center space-x-3 border-t border-gray-800/80 pt-2">
            <span className="text-xs font-medium text-gray-400">Mes:</span>
            <div className="flex items-center space-x-2 rounded-xl border border-gray-700 bg-gray-800 px-3 py-1.5">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="cursor-pointer bg-transparent pr-2 text-xs font-bold text-white focus:outline-none"
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (startDateInput) updateUrlParams({ filter: "custom", startDate: startDateInput, endDate: endDateInput });
            }}
            className="flex flex-wrap items-center gap-2 border-t border-gray-800/80 pt-2"
          >
            <input type="date" value={startDateInput} onChange={(e) => setStartDateInput(e.target.value)} className="rounded-xl border border-gray-700 bg-gray-800 p-1.5 text-xs text-white" required />
            <input type="date" value={endDateInput} onChange={(e) => setEndDateInput(e.target.value)} className="rounded-xl border border-gray-700 bg-gray-800 p-1.5 text-xs text-white" />
            <button type="submit" className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700">
              Aplicar
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard title="Ingresos hoy" value={`$${report.todayGrossRevenue.toFixed(2)}`} detail={`${report.todayImpressions.toLocaleString()} impresiones`} icon={<Clock className="h-4 w-4 text-emerald-400" />} color="text-emerald-400" />
        <MetricCard title="Mes en curso" value={`$${report.currentMonthGrossRevenue.toFixed(2)}`} detail={`${report.currentMonthClicks.toLocaleString()} clicks`} icon={<Sparkles className="h-4 w-4 text-blue-400" />} color="text-blue-400" />
        <MetricCard title={`Bruto ${report.filterLabel}`} value={`$${report.grossEstimatedRevenue.toFixed(2)}`} detail={isRealRevenue ? "Revenue real" : "Estimado por RPM"} icon={<DollarSign className="h-4 w-4 text-purple-400" />} color="text-white" />
        <MetricCard title="Reparto autores" value={`$${report.totalAuthorShareAmount.toFixed(2)}`} detail={`Admin: $${report.totalPlatformShareAmount.toFixed(2)}`} icon={<User className="h-4 w-4 text-amber-400" />} color="text-emerald-400" />
        <MetricCard title="Clicks / CTR" value={report.totalClicks.toLocaleString()} detail={`CTR: ${report.ctr.toFixed(2)}%`} icon={<MousePointerClick className="h-4 w-4 text-pink-400" />} color="text-pink-400" />
        <MetricCard title="CPM / Impresiones" value={`$${report.cpm.toFixed(2)}`} detail={`${report.totalImpressions.toLocaleString()} impresiones`} icon={<Percent className="h-4 w-4 text-cyan-400" />} color="text-cyan-400" />
      </div>

      <div className="space-y-2 rounded-2xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-col items-start justify-between gap-4 text-xs sm:flex-row sm:items-center">
          <div className="flex items-center space-x-2 text-gray-300">
            {isRealRevenue ? <RadioTower className="h-4 w-4 flex-shrink-0 text-emerald-400" /> : <Sliders className="h-4 w-4 flex-shrink-0 text-brand-400" />}
            <span>
              <strong>{isRealRevenue ? "Datos reales de Adsterra:" : "Fallback por RPM:"}</strong>{" "}
              {isRealRevenue
                ? "El reporte usa revenue, impresiones, clicks, CTR y CPM desde la API. El RPM queda como respaldo si la API falla."
                : "Configura ADSTERRA_API_KEY para usar ingresos reales. Este RPM mantiene los reportes funcionando mientras tanto."}
            </span>
          </div>
          <form onSubmit={handleRpmUpdate} className="flex w-full items-center space-x-2 sm:w-auto">
            <span className="font-bold text-gray-400">$</span>
            <input type="number" step="0.05" min="0.01" value={rpmInput} onChange={(e) => setRpmInput(e.target.value)} className="w-24 rounded-xl border border-gray-700 bg-gray-800 p-2 text-center text-xs font-bold text-white" />
            <button type="submit" disabled={isSavingRpm} className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50">
              {isSavingRpm ? "Guardando..." : "Guardar RPM"}
            </button>
          </form>
        </div>
        {rpmMessage && <p className="text-right text-xs font-semibold text-emerald-400">{rpmMessage}</p>}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            <h2 className="font-serif text-xl font-bold text-white">Desglose de autores</h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">{report.authors.length} autores</span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="border-b border-gray-800 bg-gray-800/60 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="p-4">Autor</th>
                  <th className="p-4 text-center">Historias</th>
                  <th className="p-4 text-center">Vistas</th>
                  <th className="p-4 text-center">% Reparto</th>
                  <th className="p-4 text-right">Bruto</th>
                  <th className="p-4 text-right">Pago autor</th>
                  <th className="p-4 text-right">Ganancia admin</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {report.authors.map((author) => (
                  <tr key={author.id} className="transition hover:bg-gray-800/40">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 font-serif font-bold text-white">
                          {author.avatarUrl ? <img src={author.avatarUrl} alt={author.name} className="h-full w-full object-cover" /> : author.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{author.name}</div>
                          <div className="text-[11px] text-gray-400">@{author.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-200">{author.articlesCount}</td>
                    <td className="p-4 text-center font-bold text-amber-300">{author.monthlyViews.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-white">{author.authorSharePct}% Autor</span>
                      <div className="text-[10px] text-gray-400">{author.platformSharePct}% Admin</div>
                    </td>
                    <td className="p-4 text-right font-bold text-gray-300">${author.grossRevenue.toFixed(2)}</td>
                    <td className="p-4 text-right text-sm font-black text-emerald-400">${author.authorShareAmount.toFixed(2)}</td>
                    <td className="p-4 text-right font-bold text-blue-400">${author.platformShareAmount.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center space-x-1 rounded-full border border-blue-800 bg-blue-950 px-2.5 py-1 text-[10px] font-bold text-blue-300">
                        <CheckCircle2 className="h-3 w-3 text-blue-400" />
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

function MetricCard({ title, value, detail, icon, color }: { title: string; value: string; detail: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
        <span>{title}</span>
        {icon}
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-[11px] text-gray-400">{detail}</p>
    </div>
  );
}
