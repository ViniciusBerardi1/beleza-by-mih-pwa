import { useState } from "react";
import { motion } from "framer-motion";
import { hasPinSetup, setupPin, unlockWithPin } from "../crypto";

export default function PinGate({ onUnlock }) {
  const pinExiste = hasPinSetup();
  const [etapa, setEtapa] = useState(pinExiste ? "entrar" : "criar");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCriar = () => {
    if (pin.length < 4) return setErro("O PIN deve ter pelo menos 4 dígitos.");
    setEtapa("confirmar");
    setErro("");
  };

  const handleConfirmar = async () => {
    if (confirmPin !== pin) {
      setErro("Os PINs não coincidem. Tente novamente.");
      setConfirmPin("");
      return;
    }
    setCarregando(true);
    await setupPin(pin);
    onUnlock(true);
  };

  const handleEntrar = async () => {
    if (!pin) return;
    setCarregando(true);
    const key = await unlockWithPin(pin);
    if (!key) {
      setErro("PIN incorreto. Tente novamente.");
      setPin("");
      setCarregando(false);
      return;
    }
    onUnlock(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center"
      >
        <div className="text-4xl mb-3">🔐</div>
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Beleza by Mih</h1>

        {etapa === "criar" && (
          <>
            <p className="text-sm text-gray-500 mb-1 mt-2">Crie um PIN para proteger seus dados</p>
            <p className="text-xs text-gray-400 mb-6">Mínimo 4 dígitos. Guarde bem — não há como recuperar.</p>
            <input
              type="password"
              inputMode="numeric"
              placeholder="Novo PIN"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setErro(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleCriar()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-200 mb-3"
              autoFocus
            />
            {erro && <p className="text-xs text-red-500 mb-3">{erro}</p>}
            <button
              onClick={handleCriar}
              disabled={!pin}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continuar
            </button>
          </>
        )}

        {etapa === "confirmar" && (
          <>
            <p className="text-sm text-gray-500 mb-6 mt-2">Confirme seu PIN</p>
            <input
              type="password"
              inputMode="numeric"
              placeholder="Confirme o PIN"
              value={confirmPin}
              onChange={(e) => { setConfirmPin(e.target.value); setErro(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-200 mb-3"
              autoFocus
            />
            {erro && <p className="text-xs text-red-500 mb-3">{erro}</p>}
            <button
              onClick={handleConfirmar}
              disabled={!confirmPin || carregando}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
            >
              {carregando ? "Configurando…" : "Confirmar PIN"}
            </button>
            <button
              onClick={() => { setEtapa("criar"); setConfirmPin(""); setErro(""); }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Voltar
            </button>
          </>
        )}

        {etapa === "entrar" && (
          <>
            <p className="text-sm text-gray-500 mb-6 mt-2">Digite seu PIN para entrar</p>
            <input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setErro(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleEntrar()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-200 mb-3"
              autoFocus
            />
            {erro && <p className="text-xs text-red-500 mb-3">{erro}</p>}
            <button
              onClick={handleEntrar}
              disabled={!pin || carregando}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {carregando ? "Verificando…" : "Entrar"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
