import { useMemo, memo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { motion } from "framer-motion";

function urlLoja(nome, loja) {
  const busca = encodeURIComponent(nome);
  const urls = {
    sephora: `https://www.sephora.com.br/search?q=${busca}`,
    belezanaweb: `https://www.belezanaweb.com.br/busca?q=${busca}`,
    epoca: `https://www.epocacosmeticos.com.br/busca?q=${busca}`,
    boticario: `https://www.boticario.com.br/busca?q=${busca}`,
  };
  return urls[loja] || urls.sephora;
}

function Dashboard({ produtos, categorias, setView, carregando }) {
  const hoje = new Date();

  const totalProdutos = produtos.length;
  const totalItens = produtos.reduce((acc, p) => acc + (p.quantidade || 0), 0);
  const vencidos = produtos.filter(
    (p) =>
      p.data_validade && differenceInDays(parseISO(p.data_validade), hoje) < 0,
  );
  const estoqueBaixo = produtos.filter((p) => p.quantidade <= (p.estoque_minimo ?? 1));

  const porCategoria = useMemo(() => {
    const contagem = produtos.reduce((acc, p) => {
      const id = Number(p.categoria_id);
      if (!acc[id]) acc[id] = { total: 0, itens: 0 };
      acc[id].total += 1;
      acc[id].itens += p.quantidade || 0;
      return acc;
    }, {});
    return categorias
      .map((cat) => ({
        ...cat,
        total: contagem[cat.id]?.total || 0,
        itens: contagem[cat.id]?.itens || 0,
      }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [produtos, categorias]);


  const todosVencendo = [...produtos]
    .filter((p) => {
      if (!p.data_validade) return false;
      const dias = differenceInDays(parseISO(p.data_validade), hoje);
      return dias >= 0 && dias <= 60;
    })
    .sort((a, b) => new Date(a.data_validade) - new Date(b.data_validade));

  const proximosVencer = todosVencendo.slice(0, 4);
  const totalVencendo = todosVencendo.length;

  const cards = [
    {
      label: "Produtos",
      valor: totalProdutos,
      cor: "bg-white border-gray-200",
      texto: "text-gray-800",
      sub: "text-gray-400",
      onClick: null,
    },
    {
      label: "Em estoque",
      valor: totalItens,
      cor: "bg-white border-gray-200",
      texto: "text-gray-800",
      sub: "text-gray-400",
      onClick: null,
    },
    {
      label: "Vencidos",
      valor: vencidos.length,
      cor: "bg-red-50 border-red-100",
      texto: "text-red-600",
      sub: "text-red-400",
      onClick: () => setView("vencidos"),
    },
    {
      label: "Est. baixo",
      valor: estoqueBaixo.length,
      cor: "bg-orange-50 border-orange-100",
      texto: "text-orange-600",
      sub: "text-orange-400",
      onClick: () => setView("estoque_baixo"),
    },
  ];

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl font-semibold text-gray-800 mb-4"
      >
        Dashboard
      </motion.h2>

      {/* Cards de resumo */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.07 }}
            onClick={card.onClick}
            className={`border rounded-xl p-3 md:p-4 ${card.cor} ${card.onClick ? "cursor-pointer hover:brightness-95 transition-all" : ""}`}
          >
            <div className={`text-xl md:text-2xl font-semibold ${card.texto}`}>
              {card.valor}
            </div>
            <div className={`text-xs mt-0.5 ${card.sub} leading-tight`}>
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Por categoria */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Produtos por categoria
          </h3>
          {carregando ? (
            <p className="text-xs text-gray-400 animate-pulse">Carregando...</p>
          ) : porCategoria.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhum produto cadastrado.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {porCategoria.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.35 + i * 0.05 }}
                >
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{cat.nome}</span>
                    <span>
                      {cat.total} de {totalProdutos}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <motion.div
                      className="bg-rose-400 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(cat.total / totalProdutos) * 100}%`,
                      }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Próximos a vencer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.35 }}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Próximos a vencer
            </h3>
            {totalVencendo > 4 && (
              <button
                onClick={() => setView("vencendo")}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
              >
                Ver todos ({totalVencendo}) →
              </button>
            )}
          </div>
          {proximosVencer.length === 0 ? (
            <p className="text-xs text-gray-400">
              Nenhum produto com validade cadastrada.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {proximosVencer.map((p, i) => {
                const dias = differenceInDays(parseISO(p.data_validade), hoje);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {p.foto ? (
                        <img
                          src={p.foto}
                          alt={p.nome}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm shrink-0">
                          🧴
                        </div>
                      )}
                      <span className="text-sm text-gray-700 truncate">
                        {p.tem_cor && p.cor ? `${p.nome} - ${p.cor}` : p.nome}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                        dias <= 30
                          ? "bg-red-100 text-red-600"
                          : dias <= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {dias === 0 ? "Hoje" : `${dias}d`}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Produtos para repor */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.4 }}
        className="bg-white border border-gray-200 rounded-xl p-4"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Produtos para repor
        </h3>
        {estoqueBaixo.length === 0 ? (
          <p className="text-xs text-gray-400">
            Nenhum produto com estoque baixo. 🎉
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {estoqueBaixo.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.45 + i * 0.05 }}
                className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {p.foto ? (
                    <img
                      src={p.foto}
                      alt={p.nome}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm shrink-0">
                      🧴
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm text-gray-700 font-medium truncate">
                      {p.tem_cor && p.cor ? `${p.nome} - ${p.cor}` : p.nome}
                    </div>
                    <div className="text-xs text-gray-400">
                      {p.categoria_nome} · {p.quantidade} em estoque
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    window.open(urlLoja(p.nome, p.loja_compra), "_blank")
                  }
                  className="text-xs text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-2"
                >
                  🛍️ Comprar
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default memo(Dashboard);
