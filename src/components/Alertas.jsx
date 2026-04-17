import { differenceInDays, parseISO } from "date-fns";

export default function Alertas({ produtos }) {
  const hoje = new Date();

  const vencidos = produtos.filter(
    (p) =>
      p.data_validade && differenceInDays(parseISO(p.data_validade), hoje) < 0,
  );
  const vencendo = produtos.filter((p) => {
    const dias = differenceInDays(
      parseISO(p.data_validade || "9999-12-31"),
      hoje,
    );
    return dias >= 0 && dias <= 60;
  });

  if (vencidos.length === 0 && vencendo.length === 0) return null;

  return (
    <div className="flex gap-4 mb-6">
      {vencidos.length > 0 && (
        <div className="flex-1 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          🔴 <strong>{vencidos.length} produto(s) vencido(s)</strong> —
          verifique seu estoque
        </div>
      )}
      {vencendo.length > 0 && (
        <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-700">
          ⚠️ <strong>{vencendo.length} produto(s)</strong> vencem nos próximos
          60 dias
        </div>
      )}
    </div>
  );
}
