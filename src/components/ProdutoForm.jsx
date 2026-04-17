import { useState } from "react";

export default function ProdutoForm({
  produto,
  categorias,
  onSalvar,
  onFechar,
}) {
  const [form, setForm] = useState({
    id: produto?.id || null,
    nome: produto?.nome || "",
    foto: produto?.foto || "",
    data_validade: produto?.data_validade || "",
    quantidade: produto?.quantidade || 0,
    categoria_id: produto?.categoria_id || categorias[0]?.id || "",
    tem_cor: produto?.tem_cor || 0,
    cor: produto?.cor || "",
    loja_compra: produto?.loja_compra || "sephora",
    avaliacao: produto?.avaliacao || 0,
    tem_tamanho: produto?.tem_tamanho || 0,
    tamanho_quantidade: produto?.tamanho_quantidade || "",
    tamanho_unidade: produto?.tamanho_unidade || "ml",
  });

  const handleSubmit = () => {
    if (!form.nome.trim()) return alert("Informe o nome do produto.");
    if (!form.data_validade) return alert("Informe a data de validade.");
    if (isNaN(new Date(form.data_validade).getTime()))
      return alert("Data de validade inválida.");
    onSalvar(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {form.id ? "Editar produto" : "Novo produto"}
          </h2>
          <button
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Nome do produto *
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Categoria
            </label>
            <select
              value={form.categoria_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoria_id: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Data de validade *
              </label>
              <input
                type="date"
                value={form.data_validade}
                min="2000-01-01"
                max="2099-12-31"
                onChange={(e) =>
                  setForm((f) => ({ ...f, data_validade: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div className="w-28">
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Quantidade
              </label>
              <input
                type="number"
                min="0"
                value={form.quantidade}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    quantidade: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Foto do produto
            </label>
            <div className="flex items-center gap-3">
              {form.foto && (
                <img
                  src={form.foto}
                  alt="preview"
                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                />
              )}
              <label className="border border-gray-200 text-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                {form.foto ? "Trocar foto" : "Selecionar foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) =>
                        setForm((f) => ({ ...f, foto: ev.target.result }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {form.foto && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, foto: "" }))}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Remover
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Cor do produto
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    tem_cor: f.tem_cor ? 0 : 1,
                    cor: "",
                  }))
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.tem_cor ? "bg-rose-500" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${form.tem_cor ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
              <span className="text-sm text-gray-500">
                {form.tem_cor ? "Tem cor" : "Sem cor"}
              </span>
            </div>
            {form.tem_cor ? (
              <input
                type="text"
                placeholder="Ex: Rosa, Vermelho, Nude..."
                value={form.cor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cor: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            ) : null}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Tamanho do produto
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    tem_tamanho: f.tem_tamanho ? 0 : 1,
                    tamanho_quantidade: "",
                    tamanho_unidade: "ml",
                  }))
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.tem_tamanho ? "bg-rose-500" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${form.tem_tamanho ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
              <span className="text-sm text-gray-500">
                {form.tem_tamanho ? "Tem tamanho" : "Sem tamanho"}
              </span>
            </div>
            {form.tem_tamanho ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Ex: 200"
                  value={form.tamanho_quantidade}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      tamanho_quantidade: e.target.value,
                    }))
                  }
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
                <select
                  value={form.tamanho_unidade}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tamanho_unidade: e.target.value }))
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="oz">oz</option>
                  <option value="un">un</option>
                </select>
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Loja preferida para compra
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "sephora", label: "🖤 Sephora" },
                { id: "belezanaweb", label: "💜 Beleza na Web" },
                { id: "epoca", label: "🩷 Época Cosméticos" },
                { id: "boticario", label: "🟠 O Boticário" },
              ].map((loja) => (
                <button
                  key={loja.id}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, loja_compra: loja.id }))
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left
                    ${form.loja_compra === loja.id ? "bg-rose-50 border-rose-300 text-rose-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  {loja.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Avaliação do produto
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, avaliacao: star }))}
                  className="text-2xl transition-transform hover:scale-110"
                >
                  {star <= (form.avaliacao || 0) ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            {form.avaliacao > 0 && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, avaliacao: 0 }))}
                className="text-xs text-gray-400 hover:text-red-400 mt-1"
              >
                Limpar avaliação
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onFechar}
            className="flex-1 border border-gray-200 text-gray-500 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
