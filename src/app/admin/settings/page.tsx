import { getMonetizationSettings } from "@/services/revenue.service";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getMonetizationSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Configuracion de Monetizacion</h1>
        <p className="text-sm text-gray-400">Ajusta el reparto de ingresos publicitarios entre autores y plataforma.</p>
      </div>

      <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-200">
        <p className="font-bold text-emerald-300">API real de Adsterra</p>
        <p className="mt-1 text-xs leading-relaxed">
          Crea tu token en Adsterra y colocalo en <code className="rounded bg-emerald-950 px-1">ADSTERRA_API_KEY</code>.
          Opcionalmente puedes limitar reportes con <code className="rounded bg-emerald-950 px-1">ADSTERRA_DOMAIN_ID</code>,
          <code className="rounded bg-emerald-950 px-1"> ADSTERRA_PLACEMENT_ID</code> y
          <code className="rounded bg-emerald-950 px-1"> ADSTERRA_COUNTRY</code>. Si el token no existe o falla, se usa el RPM estimado.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
