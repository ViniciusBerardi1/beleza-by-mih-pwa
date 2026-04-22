import { useState, memo } from "react";
import { Home } from "lucide-react";

const CATEGORIA_ICONS = {
  skincare: "✨",
  cabelo: "💇",
  maquiagem: "💄",
  corpo: "🧴",
  perfumaria: "🌸",
  outros: "📦",
};

function Logo({ altura }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="Beleza by Mih" className={`${altura} w-auto`} />
      <h1
        className="font-semibold text-gray-800"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        Beleza by Mih
      </h1>
    </div>
  );
}

function BotaoSobre({ view, navegar }) {
  return (
    <div className="pt-4 border-t border-gray-100">
      <button
        onClick={() => navegar("sobre")}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left
          ${view === "sobre" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
      >
        <span className="text-lg">ℹ️</span> Sobre
      </button>
    </div>
  );
}

function MenuConteudo({
  view,
  navegar,
  categorias,
  categoriasAberto,
  setCategoriasAberto,
  alertasAberto,
  setAlertasAberto,
  totalVencendo,
  totalVencidos,
  totalEstoqueBaixo,
}) {
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => navegar("produtos")}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left
          ${view === "produtos" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
      >
        <span className="text-lg">🧴</span> Todos os produtos
      </button>

      <button
        onClick={() => navegar("dashboard")}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left
          ${view === "dashboard" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
      >
        <span className="text-lg">📊</span> Dashboard
      </button>

      <button
        onClick={() => navegar("historico")}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left
          ${view === "historico" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
      >
        <span className="text-lg">📋</span> Histórico
      </button>

      <button
        onClick={() => navegar("desejos")}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left
          ${view === "desejos" ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
      >
        <span className="text-lg">💝</span> Lista de desejos
      </button>

      <div className="mt-3">
        <button
          onClick={() => setCategoriasAberto(!categoriasAberto)}
          className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
        >
          <span>Categorias</span>
          <span>{categoriasAberto ? "▾" : "▸"}</span>
        </button>
        {categoriasAberto && (
          <div className="flex flex-col gap-0.5 mt-1">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navegar(`cat_${cat.id}`)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors w-full text-left
                  ${view === `cat_${cat.id}` ? "bg-rose-50 text-rose-600" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <span className="text-base">
                  {CATEGORIA_ICONS[cat.nome.toLowerCase()] || "🏷️"}
                </span>
                {cat.nome}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3">
        <button
          onClick={() => setAlertasAberto(!alertasAberto)}
          className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
        >
          <span>Alertas</span>
          <span>{alertasAberto ? "▾" : "▸"}</span>
        </button>
        {alertasAberto && (
          <div className="flex flex-col gap-0.5 mt-1">
            <button
              onClick={() => navegar("vencendo")}
              className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-colors w-full text-left ${view === "vencendo" ? "bg-yellow-50 text-yellow-600" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-base">⚠️</span> Vencendo
              </span>
              {totalVencendo > 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  {totalVencendo}
                </span>
              )}
            </button>
            <button
              onClick={() => navegar("vencidos")}
              className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-colors w-full text-left ${view === "vencidos" ? "bg-red-50 text-red-600" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-base">🔴</span> Vencidos
              </span>
              {totalVencidos > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  {totalVencidos}
                </span>
              )}
            </button>
            <button
              onClick={() => navegar("estoque_baixo")}
              className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-colors w-full text-left ${view === "estoque_baixo" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-base">📦</span> Estoque baixo
              </span>
              {totalEstoqueBaixo > 0 && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                  {totalEstoqueBaixo}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ view, setView, alertas, categorias = [] }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [categoriasAberto, setCategoriasAberto] = useState(true);
  const [alertasAberto, setAlertasAberto] = useState(true);

  const totalVencendo = alertas?.vencendo ?? 0;
  const totalVencidos = alertas?.vencidos ?? 0;
  const totalEstoqueBaixo = alertas?.estoqueBaixo ?? 0;

  const navegar = (v) => {
    setView(v);
    setMenuAberto(false);
  };

  const menuProps = {
    view,
    navegar,
    categorias,
    categoriasAberto,
    setCategoriasAberto,
    alertasAberto,
    setAlertasAberto,
    totalVencendo,
    totalVencidos,
    totalEstoqueBaixo,
  };

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex-col py-6 px-4 gap-1 z-40">
        <div className="mb-6 px-2">
          <Logo altura="h-10" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MenuConteudo {...menuProps} />
        </div>
        <BotaoSobre view={view} navegar={navegar} />
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="flex items-center gap-2"
        >
          <img src="/logo.png" alt="Beleza by Mih" className="h-8 w-auto" />
          <h1 className="text-base font-semibold text-gray-700">
            Beleza by Mih
          </h1>
        </button>
        <button
          onClick={() => navegar("dashboard")}
          className="text-gray-500 hover:text-rose-500 transition-colors p-2 h-10 w-10 flex items-center justify-center"
        >
          <Home size={22} />
        </button>
      </header>

      {menuAberto && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMenuAberto(false)}
          />
          <div className="md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col py-6 px-4 shadow-xl">
            <div className="flex items-center justify-between mb-6 px-2">
              <Logo altura="h-10" />
              <button
                onClick={() => setMenuAberto(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MenuConteudo {...menuProps} />
            </div>
            <BotaoSobre view={view} navegar={navegar} />
          </div>
        </>
      )}
    </>
  );
}

export default memo(Sidebar);
