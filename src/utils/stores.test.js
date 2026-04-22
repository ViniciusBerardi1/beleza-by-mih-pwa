import { describe, it, expect } from "vitest";
import { getLojaUrl } from "./stores";

describe("getLojaUrl", () => {
  it("retorna URL correta da Sephora", () => {
    expect(getLojaUrl("Hidratante Neutrogena", "sephora")).toBe(
      "https://www.sephora.com.br/search?q=Hidratante%20Neutrogena"
    );
  });

  it("retorna URL correta da Beleza na Web", () => {
    expect(getLojaUrl("Shampoo", "belezanaweb")).toBe(
      "https://www.belezanaweb.com.br/busca?q=Shampoo"
    );
  });

  it("retorna URL correta da Época Cosméticos", () => {
    expect(getLojaUrl("Base", "epoca")).toBe(
      "https://www.epocacosmeticos.com.br/busca?q=Base"
    );
  });

  it("retorna URL correta do Boticário", () => {
    expect(getLojaUrl("Perfume", "boticario")).toBe(
      "https://www.boticario.com.br/busca?q=Perfume"
    );
  });

  it("usa Sephora como fallback para loja desconhecida", () => {
    const url = getLojaUrl("Creme", "lojaXYZ");
    expect(url).toContain("sephora.com.br");
    expect(url).toContain("Creme");
  });

  it("encoda caracteres especiais no nome do produto", () => {
    const url = getLojaUrl("Creme & Hidratante", "sephora");
    expect(url).toContain("Creme%20%26%20Hidratante");
  });
});
