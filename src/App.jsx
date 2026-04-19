import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import ProdutoList from "./components/ProdutoList";
import ProdutoForm from "./components/ProdutoForm";
import Dashboard from "./components/Dashboard";
import Sobre from "./components/Sobre";
import Toast from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
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
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmandoId, setConfirmandoId] = useState(null);

  const carregar = async () => {
    const [p, c] = await Promise.all([db.getProdutos(), db.getCategorias()]);
    setProdutos(p);
    setCategorias(c);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSalvar = async (produto) => {
    try {
      if (produto.id) {
        await db.updateProduto(produto);
        setToast("Produto atualizado!");
      } else {
        await db.addProduto(produto);
        setToast("Produto adicionado!");
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

  const handleDeletar = (id) => {
    setConfirmandoId(id);
  };

  const confirmarDelete = async () => {
    await db.deleteProduto(confirmandoId);
    await carregar();
    setConfirmandoId(null);
    setToast("Produto removido.");
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
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1, 1.08, 1, 1.08, 1] }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
        }}
        className="fixed top-2 right-14 md:right-4 z-50 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 h-10 rounded-2xl transition-colors shadow-lg text-sm md:text-base flex items-center"
      >
        ✨ Novo produto
      </motion.button>

      <main className="md:ml-64 pt-20 md:pt-8 px-4 md:px-8 pb-8">
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
                carregando={carregando}
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

      <AnimatePresence>
        {confirmandoId && (
          <ConfirmModal
            onConfirmar={confirmarDelete}
            onCancelar={() => setConfirmandoId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast mensagem={toast} onFechar={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
