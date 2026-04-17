import { useState } from "react";

const categorias = [
  { id: "skincare", label: "Skincare", icon: "✨" },
  { id: "cabelo", label: "Cabelo", icon: "💇" },
  { id: "maquiagem", label: "Maquiagem", icon: "💄" },
  { id: "corpo", label: "Corpo", icon: "🧴" },
  { id: "perfumaria", label: "Perfumaria", icon: "🌸" },
  { id: "outros", label: "Outros", icon: "📦" },
];

export default function Sidebar({ view, setView, produtos }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [categoriasAberto, setCategoriasAberto] = useState(false);
  const [alertasAberto, setAlertasAberto] = useState(false);

  const totalVencendo = produtos.filter((p) => {
    if (!p.data_validade) return false;
    const dias = Math.ceil(
      (new Date(p.data_validade) - new Date()) / (1000 * 60 * 60 * 24),
    );
    return dias >= 0 && dias <= 60;
  }).length;

  const totalVencidos = produtos.filter((p) => {
    if (!p.data_validade) return false;
    return new Date(p.data_validade) < new Date();
  }).length;

  const totalEstoqueBaixo = produtos.filter((p) => p.quantidade <= 1).length;

  const navegar = (v) => {
    setView(v);
    setMenuAberto(false);
    setCategoriasAberto(false);
    setAlertasAberto(false);
  };

  return (
    <>
      {/* Header mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-700">
          💄 Beleza by Mih
        </h1>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="text-gray-500 hover:text-gray-800 transition-colors p-1"
        >
          {menuAberto ? "✕" : "☰"}
        </button>
      </header>

      {/* Menu dropdown */}
      {menuAberto && (
        <div className="fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg px-4 py-3 flex flex-col gap-1">
          <button
            onClick={() => navegar("produtos")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${view === "produtos" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
          >
            🧴 Todos os produtos
          </button>
          <button
            onClick={() => navegar("dashboard")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${view === "dashboard" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
          >
            📊 Dashboard
          </button>

          {/* Categorias */}
          <button
            onClick={() => setCategoriasAberto(!categoriasAberto)}
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide w-full"
          >
            <span>Categorias</span>
            <span>{categoriasAberto ? "▾" : "▸"}</span>
          </button>
          {categoriasAberto && (
            <div className="flex flex-col gap-0.5 pl-2">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navegar(`cat_${cat.id}`)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors w-full text-left ${view === `cat_${cat.id}` ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Alertas */}
          <button
            onClick={() => setAlertasAberto(!alertasAberto)}
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide w-full"
          >
            <span>Alertas</span>
            <span>{alertasAberto ? "▾" : "▸"}</span>
          </button>
          {alertasAberto && (
            <div className="flex flex-col gap-0.5 pl-2">
              <button
                onClick={() => navegar("vencendo")}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors w-full text-left ${view === "vencendo" ? "bg-yellow-50 text-yellow-600" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <span>⚠️ Vencendo</span>
                {totalVencendo > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                    {totalVencendo}
                  </span>
                )}
              </button>
              <button
                onClick={() => navegar("vencidos")}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors w-full text-left ${view === "vencidos" ? "bg-red-50 text-red-600" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <span>🔴 Vencidos</span>
                {totalVencidos > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                    {totalVencidos}
                  </span>
                )}
              </button>
              <button
                onClick={() => navegar("estoque_baixo")}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors w-full text-left ${view === "estoque_baixo" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <span>📦 Estoque baixo</span>
                {totalEstoqueBaixo > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                    {totalEstoqueBaixo}
                  </span>
                )}
              </button>
            </div>
          )}

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => navegar("sobre")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${view === "sobre" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
            >
              ℹ️ Sobre
            </button>
          </div>
        </div>
      )}
    </>
  );
}
