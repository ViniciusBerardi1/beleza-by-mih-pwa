import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import ProdutoList from "./components/ProdutoList";
import ProdutoForm from "./components/ProdutoForm";
import Dashboard from "./components/Dashboard";
import Sobre from "./components/Sobre";
import { differenceInDays, parseISO } from "date-fns";
import { db } from "./db";

const CATEGORIAS_MAP = {
  cat_skincare: "Skincare",
  cat_cabelo: "Cabelo",
  cat_maquiagem: "Maquiagem",
  cat_corpo: "Corpo",
  cat_perfumaria: "Perfumaria",
  cat_outros: "Outros",
};

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const pageTransition = { duration: 0.2, ease: "easeInOut" };

export default function App() {
  const [view, setView] = useState("dashboard");
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const carregar = async () => {
    const p = await db.getProdutos();
    const c = await db.getCategorias();
    setProdutos(p);
    setCategorias(c);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSalvar = async (produto) => {
    try {
      if (produto.id) {
        await db.updateProduto(produto);
      } else {
        await db.addProduto(produto);
      }
      await carregar();
      setShowForm(false);
      setEditando(null);
    } catch (err) {
      console.error("erro ao salvar:", err);
    }
  };

  const handleEditar = (produto) => {
    setEditando(produto);
    setShowForm(true);
  };

  const handleDeletar = async (id) => {
    if (confirm("Remover este produto?")) {
      await db.deleteProduto(id);
      await carregar();
    }
  };

  const handleNovo = () => {
    setEditando(null);
    setShowForm(true);
  };

  const produtosFiltrados = () => {
    const hoje = new Date();
    if (view === "vencendo") {
      return produtos.filter((p) => {
        if (!p.data_validade) return false;
        const dias = differenceInDays(parseISO(p.data_validade), hoje);
        return dias >= 0 && dias <= 60;
      });
    }
    if (view === "vencidos") {
      return produtos.filter((p) => {
        if (!p.data_validade) return false;
        return differenceInDays(parseISO(p.data_validade), hoje) < 0;
      });
    }
    if (view === "estoque_baixo") {
      return produtos.filter((p) => p.quantidade <= 1);
    }
    if (view.startsWith("cat_")) {
      const nomeCategoria = CATEGORIAS_MAP[view];
      return produtos.filter(
        (p) => p.categoria_nome?.toLowerCase() === nomeCategoria?.toLowerCase(),
      );
    }
    return produtos;
  };

  const tituloView = {
    produtos: "Todos os Produtos",
    vencendo: "⚠️ Vencendo em breve",
    vencidos: "🔴 Produtos Vencidos",
    estoque_baixo: "📦 Estoque Baixo",
    ...Object.fromEntries(
      Object.entries(CATEGORIAS_MAP).map(([k, v]) => [k, v]),
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Sidebar view={view} setView={setView} produtos={produtos} />

      {/* Botão fixo no canto superior direito */}
      <motion.button
        onClick={handleNovo}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-2 right-4 z-50 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-2xl transition-colors shadow-lg text-base"
      >
        ✨ + Novo produto
      </motion.button>

      <main className="md:ml-64 pt-16 md:pt-8 px-4 md:px-8 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {view === "sobre" ? (
              <Sobre />
            ) : view === "dashboard" ? (
              <Dashboard
                produtos={produtos}
                categorias={categorias}
                setView={setView}
              />
            ) : (
              <ProdutoList
                titulo={tituloView[view] || "Produtos"}
                produtos={produtosFiltrados()}
                categorias={categorias}
                onEditar={handleEditar}
                onDeletar={handleDeletar}
                onNovo={handleNovo}
                mostrarBotaoNovo={view === "produtos"}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ProdutoForm
              produto={editando}
              categorias={categorias}
              onSalvar={handleSalvar}
              onFechar={() => {
                setShowForm(false);
                setEditando(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
