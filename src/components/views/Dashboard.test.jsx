import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Dashboard from "./Dashboard";

const hoje = new Date();
const dataFutura = (dias) => {
  const d = new Date(hoje);
  d.setDate(d.getDate() + dias);
  return d.toISOString().split("T")[0];
};
const dataPassada = (dias) => {
  const d = new Date(hoje);
  d.setDate(d.getDate() - dias);
  return d.toISOString().split("T")[0];
};

const categorias = [{ id: 1, nome: "Skincare" }];

const produtoBase = {
  id: 1,
  nome: "Hidratante",
  quantidade: 2,
  estoque_minimo: 1,
  categoria_id: 1,
  categoria_nome: "Skincare",
  data_validade: dataFutura(90),
  avaliacao: 0,
  tem_cor: 0,
  cor: "",
  loja_compra: "sephora",
  foto: "",
};

function getCard(label) {
  return screen.getByText(label).closest("div").parentElement;
}

function renderDashboard(produtos = [], cats = categorias) {
  return render(
    <Dashboard
      produtos={produtos}
      categorias={cats}
      setView={vi.fn()}
      carregando={false}
    />
  );
}

describe("Dashboard — contadores", () => {
  it("mostra 0 em todos os cards quando a lista está vazia", () => {
    renderDashboard([]);
    expect(within(getCard("Produtos")).getByText("0")).toBeInTheDocument();
    expect(within(getCard("Vencidos")).getByText("0")).toBeInTheDocument();
    expect(within(getCard("Est. baixo")).getByText("0")).toBeInTheDocument();
  });

  it("conta o total de produtos corretamente", () => {
    renderDashboard([produtoBase, { ...produtoBase, id: 2, nome: "Base" }]);
    expect(within(getCard("Produtos")).getByText("2")).toBeInTheDocument();
  });

  it("identifica produto vencido", () => {
    const vencido = { ...produtoBase, data_validade: dataPassada(5) };
    renderDashboard([vencido]);
    expect(within(getCard("Vencidos")).getByText("1")).toBeInTheDocument();
  });

  it("não conta produto válido como vencido", () => {
    const valido = { ...produtoBase, data_validade: dataFutura(90) };
    renderDashboard([valido]);
    expect(within(getCard("Vencidos")).getByText("0")).toBeInTheDocument();
  });

  it("identifica estoque baixo quando quantidade <= estoque_minimo", () => {
    const baixo = { ...produtoBase, quantidade: 0 };
    renderDashboard([baixo]);
    expect(within(getCard("Est. baixo")).getByText("1")).toBeInTheDocument();
  });

  it("não conta como estoque baixo quando quantidade está ok", () => {
    const ok = { ...produtoBase, quantidade: 5, estoque_minimo: 1 };
    renderDashboard([ok]);
    expect(within(getCard("Est. baixo")).getByText("0")).toBeInTheDocument();
  });

  it("mostra produto na lista de compras quando quantidade é 0", () => {
    const zerado = { ...produtoBase, quantidade: 0, nome: "Shampoo Zerado" };
    renderDashboard([zerado]);
    screen.getByText(/Ver lista/i).click();
    expect(screen.getByText("Shampoo Zerado")).toBeInTheDocument();
  });
});

describe("Dashboard — estado de carregamento", () => {
  it("mostra 'Carregando...' enquanto carrega", () => {
    render(
      <Dashboard
        produtos={[]}
        categorias={[]}
        setView={vi.fn()}
        carregando={true}
      />
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
