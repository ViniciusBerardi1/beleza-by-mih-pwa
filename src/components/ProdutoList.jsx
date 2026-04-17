import { useState } from "react";
import { differenceInDays, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

const ESTOQUE_BAIXO = 1;

function StatusBadge({ dataValidade }) {
  if (!dataValidade || dataValidade === "") return null;
  try {
    const dias = differenceInDays(parseISO(dataValidade), new Date());
    if (dias < 0)
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
          Vencido
        </span>
      );
    if (dias <= 60)
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
          Vence em {dias}d
        </span>
      );
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
        OK
      </span>
    );
  } catch {
    return null;
  }
}

function EstoqueBadge({ quantidade }) {
  if (quantidade <= ESTOQUE_BAIXO)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-medium">
        Estoque baixo
      </span>
    );
  return null;
}

function BotaoComprar({ nome, loja }) {
  const busca = encodeURIComponent(nome);
  const urls = {
    sephora: `https://www.sephora.com.br/search?q=${busca}`,
    belezanaweb: `https://www.belezanaweb.com.br/busca?q=${busca}`,
    epoca: `https://www.epocacosmeticos.com.br/busca?q=${busca}`,
    boticario: `https://www.boticario.com.br/busca?q=${busca}`,
  };
  const url = urls[loja] || urls.sephora;
  return (
    <button
      onClick={() => window.open(url, "_blank")}
      className="text-xs text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
    >
      🛍️ Comprar
    </button>
  );
}

export default function ProdutoList({
  titulo,
  produtos,
  categorias,
  onEditar,
  onDeletar,
  onNovo,
  mostrarBotaoNovo,
}) {
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("recentes");
  const [ordem, setOrdem] = useState("desc");

  const filtrados = produtos
    .filter((p) => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCat = filtroCategoria
        ? p.categoria_id == filtroCategoria
        : true;
      return matchBusca && matchCat;
    })
    .sort((a, b) => {
      let comparacao = 0;
      if (ordenacao === "alfabetica") {
        comparacao = a.nome.localeCompare(b.nome);
      } else if (ordenacao === "recentes") {
        comparacao =
          new Date(a.data_cadastro || 0) - new Date(b.data_cadastro || 0);
      } else if (ordenacao === "avaliacao") {
        comparacao = (a.avaliacao || 0) - (b.avaliacao || 0);
      }
      return ordem === "desc" ? -comparacao : comparacao;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
        {mostrarBotaoNovo && (
          <button
            onClick={onNovo}
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Novo produto
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {[
            { id: "recentes", label: "🕐 Recentes" },
            { id: "alfabetica", label: "🔤 A-Z" },
            { id: "avaliacao", label: "⭐ Avaliação" },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => {
                if (ordenacao === op.id) {
                  setOrdem((o) => (o === "asc" ? "desc" : "asc"));
                } else {
                  setOrdenacao(op.id);
                  setOrdem("desc");
                }
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                ${ordenacao === op.id ? "bg-rose-50 border-rose-300 text-rose-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              {op.label}
              {ordenacao === op.id && (
                <span>{ordem === "desc" ? "↓" : "↑"}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-sm">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtrados.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4"
            >
              {p.foto ? (
                <img
                  src={p.foto}
                  alt={p.nome}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                  🧴
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800">
                    {p.tem_cor && p.cor ? `${p.nome} - ${p.cor}` : p.nome}
                  </span>
                  <StatusBadge dataValidade={p.data_validade} />
                  <EstoqueBadge quantidade={p.quantidade} />
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {p.categoria_nome} · Estoque: {p.quantidade}
                  {p.data_validade &&
                    ` · Validade: ${format(parseISO(p.data_validade), "dd/MM/yyyy", { locale: ptBR })}`}
                  {p.avaliacao > 0 && (
                    <span className="ml-1">
                      · {"⭐".repeat(p.avaliacao)}
                      {"☆".repeat(5 - p.avaliacao)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {(p.quantidade <= ESTOQUE_BAIXO ||
                  (p.data_validade &&
                    differenceInDays(parseISO(p.data_validade), new Date()) <
                      0)) && (
                  <BotaoComprar nome={p.nome} loja={p.loja_compra} />
                )}
                <button
                  onClick={() => onEditar(p)}
                  className="text-xs text-gray-500 hover:text-rose-500 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeletar(p.id)}
                  className="text-xs text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
