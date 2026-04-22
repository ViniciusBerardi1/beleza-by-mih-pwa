import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NOTAS = [
  {
    versao: "1.6.0",
    data: "Abril 2026",
    novidades: [
      {
        emoji: "🌟",
        titulo: "Lista de Desejos",
        descricao: "Nova seção para você guardar os produtos que quer comprar futuramente — sem misturar com o estoque atual.",
      },
      {
        emoji: "🧪",
        titulo: "Testes automatizados",
        descricao: "O app agora tem uma suíte de testes para garantir que as funcionalidades principais continuem funcionando a cada atualização.",
      },
      {
        emoji: "🗂️",
        titulo: "Código reorganizado",
        descricao: "A estrutura interna do app foi reestruturada para facilitar futuras melhorias — sem mudança visível para você, mas muito mais organizado por baixo dos panos.",
      },
    ],
  },
  {
    versao: "1.5.0",
    data: "Abril 2026",
    novidades: [
      {
        emoji: "✨",
        titulo: "Animações ao reorganizar produtos",
        descricao: "Quando você muda a ordem dos produtos (por nome, data ou avaliação), eles se movem suavemente para o lugar certo — como cartas sendo organizadas na mesa.",
      },
      {
        emoji: "📦",
        titulo: "Produtos sem estoque vão para o final",
        descricao: "Itens com quantidade zero são automaticamente empurrados para o fim da lista, deixando os produtos disponíveis sempre em destaque.",
      },
      {
        emoji: "📋",
        titulo: "Card de detalhes do produto",
        descricao: "Toque em qualquer produto para ver todas as informações dele em uma tela organizada: foto, validade, estoque, loja preferida e mais.",
      },
      {
        emoji: "➕",
        titulo: "Botões de + e − direto na lista",
        descricao: "Agora você pode adicionar ou remover unidades do estoque sem precisar abrir o produto para editar. Se chegar em zero e clicar em −, o app pergunta se você quer remover o produto.",
      },
      {
        emoji: "🔢",
        titulo: "Você decide quando o estoque está baixo",
        descricao: "Cada produto tem um número mínimo configurável. Quando o estoque cai abaixo desse número, o app avisa que está na hora de repor.",
      },
      {
        emoji: "🔔",
        titulo: "Confirmação antes de remover",
        descricao: "O app agora pede confirmação antes de excluir um produto, evitando remoções acidentais.",
      },
      {
        emoji: "📍",
        titulo: "O app lembra onde você estava",
        descricao: "Ao atualizar a página, você volta para a mesma tela em que estava — sem ser jogado de volta para o início toda hora.",
      },
    ],
  },
];

export default function Sobre() {
  const [easterEgg, setEasterEgg] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [notasAberto, setNotasAberto] = useState(false);
  const versao = "1.6.0";

  const handleSecretClick = () => {
    setClicks((prev) => {
      if (prev + 1 >= 5) { setEasterEgg(true); return 0; }
      return prev + 1;
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-200 rounded-2xl p-8 text-center"
      >
        <div onClick={handleSecretClick} className="cursor-default select-none">
          <div className="text-5xl mb-4">💄</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Beleza by Mih
          </h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            versão {versao}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-6 leading-relaxed">
          Um sistema de gestão de estoque de produtos de beleza, desenvolvido
          com carinho para organizar, controlar e facilitar o dia a dia de quem
          ama beleza.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
            <p className="text-xs text-rose-400 uppercase font-semibold tracking-wide mb-1">
              Agradecimento especial
            </p>
            <p className="text-sm text-gray-700">
              À <span className="font-semibold text-rose-500">Milena Tada</span>
              , que deu vida a esse projeto com sua visão, suas ideias e sua
              paixão por beleza. Esse app existe por você. 🌸
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">
              Desenvolvimento
            </p>
            <p className="text-sm text-gray-700">
              Desenvolvido por{" "}
              <span className="font-semibold text-gray-800">
                Vinícius Berardi
              </span>
              , que transformou cada ideia em código e cada detalhe em
              realidade. 💻
            </p>
          </div>
        </div>

        <button
          onClick={() => setNotasAberto(!notasAberto)}
          className="mt-8 w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors text-sm font-medium text-gray-600"
        >
          <span className="flex items-center gap-2">
            <span>🆕</span> O que há de novo?
          </span>
          <span className="text-gray-400 text-xs">{notasAberto ? "▲ Fechar" : "▼ Ver"}</span>
        </button>

        <AnimatePresence>
          {notasAberto && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              {NOTAS.map((nota) => (
                <div key={nota.versao} className="mt-3 text-left">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                      v{nota.versao}
                    </span>
                    <span className="text-xs text-gray-400">{nota.data}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {nota.novidades.map((item, i) => (
                      <div key={i} className="flex gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                        <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{item.titulo}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-300 mt-8">
          Feito com React, Vite & IndexedDB
        </p>
      </motion.div>

      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-gradient-to-br from-purple-50 to-rose-50 border border-purple-200 rounded-2xl p-6 text-center"
          >
            <div className="text-3xl mb-3">🤖✨</div>
            <p className="text-xs text-purple-400 uppercase font-semibold tracking-wide mb-2">
              Easter Egg desbloqueado
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Todo o código deste app foi desenvolvido com a ajuda do{" "}
              <span className="font-semibold text-purple-500">Claude</span>, a
              IA da Anthropic. Cada componente, cada linha, cada bug corrigido —
              uma parceria entre humano e inteligência artificial. 🧠💜
            </p>
            <p className="text-xs text-gray-400 mt-3">
              (clique 5x no ícone 💄 para ver isso de novo)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
