import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sobre() {
  const [easterEgg, setEasterEgg] = useState(false);
  const [clicks, setClicks] = useState(0);
  const versao = "1.0.0";

  const handleSecretClick = () => {
    const novosClicks = clicks + 1;
    setClicks(novosClicks);
    if (novosClicks >= 5) {
      setEasterEgg(true);
      setClicks(0);
    }
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
