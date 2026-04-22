// Arquivo temporário de seed para testes — NÃO commitar
import { db } from "./db";

const PRODUTOS_SEED = [
  {
    nome: "Hidratante Facial Neutrogena",
    categoria_id: 1,
    quantidade: 2,
    estoque_minimo: 1,
    data_validade: "2026-12-10",
    avaliacao: 5,
    loja_compra: "sephora",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "200", tamanho_unidade: "ml",
    foto: "",
  },
  {
    nome: "Shampoo Elseve Reparação Total",
    categoria_id: 2,
    quantidade: 0,
    estoque_minimo: 1,
    data_validade: "2026-10-01",
    avaliacao: 4,
    loja_compra: "belezanaweb",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "400", tamanho_unidade: "ml",
    foto: "",
  },
  {
    nome: "Base Infallible L'Oréal",
    categoria_id: 3,
    quantidade: 1,
    estoque_minimo: 1,
    data_validade: "2026-05-15",
    avaliacao: 4,
    loja_compra: "sephora",
    tem_cor: 1, cor: "Bege Natural",
    tem_tamanho: 1, tamanho_quantidade: "30", tamanho_unidade: "ml",
    foto: "",
  },
  {
    nome: "Protetor Solar Episol FPS 60",
    categoria_id: 1,
    quantidade: 3,
    estoque_minimo: 1,
    data_validade: "2027-03-20",
    avaliacao: 5,
    loja_compra: "belezanaweb",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "120", tamanho_unidade: "g",
    foto: "",
  },
  {
    nome: "Condicionador TRESemmé Liso",
    categoria_id: 2,
    quantidade: 0,
    estoque_minimo: 1,
    data_validade: "2026-11-05",
    avaliacao: 3,
    loja_compra: "boticario",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "400", tamanho_unidade: "ml",
    foto: "",
  },
  {
    nome: "Sérum Vitamina C Skinceuticals",
    categoria_id: 1,
    quantidade: 1,
    estoque_minimo: 1,
    data_validade: "2026-06-30",
    avaliacao: 5,
    loja_compra: "sephora",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "30", tamanho_unidade: "ml",
    foto: "",
  },
  {
    nome: "Deo Parfum Humor Natura",
    categoria_id: 5,
    quantidade: 2,
    estoque_minimo: 1,
    data_validade: "2028-01-01",
    avaliacao: 4,
    loja_compra: "boticario",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "75", tamanho_unidade: "ml",
    foto: "",
  },
  {
    nome: "Batom MAC Matte",
    categoria_id: 3,
    quantidade: 4,
    estoque_minimo: 2,
    data_validade: "2027-06-01",
    avaliacao: 5,
    loja_compra: "sephora",
    tem_cor: 1, cor: "Ruby Woo",
    tem_tamanho: 0, tamanho_quantidade: "", tamanho_unidade: "ml",
    foto: "",
  },
  {
    nome: "Esfoliante Corporal Granado",
    categoria_id: 4,
    quantidade: 1,
    estoque_minimo: 1,
    data_validade: "2026-09-18",
    avaliacao: 3,
    loja_compra: "belezanaweb",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "250", tamanho_unidade: "g",
    foto: "",
  },
  {
    nome: "Óleo Capilar Pantene",
    categoria_id: 2,
    quantidade: 2,
    estoque_minimo: 1,
    data_validade: "2027-02-14",
    avaliacao: 4,
    loja_compra: "belezanaweb",
    tem_cor: 0, cor: "",
    tem_tamanho: 1, tamanho_quantidade: "100", tamanho_unidade: "ml",
    foto: "",
  },
];

export async function seedIfEmpty() {
  const existentes = await db.getProdutos();
  if (existentes.length > 0) return;

  const hoje = new Date().toISOString();
  for (const p of PRODUTOS_SEED) {
    await db.addProduto({ ...p, id: null, data_cadastro: hoje });
  }

  // Adiciona alguns registros no histórico (produtos que já acabaram antes)
  await db.addHistorico({
    produto_nome: "Creme Facial Nivea",
    produto_cor: "",
    categoria_nome: "Skincare",
    foto: "",
    data_zerado: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  });
  await db.addHistorico({
    produto_nome: "Máscara Capilar Elseve",
    produto_cor: "",
    categoria_nome: "Cabelo",
    foto: "",
    data_zerado: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  await db.addHistorico({
    produto_nome: "Shampoo Elseve Reparação Total",
    produto_cor: "",
    categoria_nome: "Cabelo",
    foto: "",
    data_zerado: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });

  console.log("✅ Seed aplicado com sucesso.");
}
