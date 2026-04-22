export function getLojaUrl(nomeProduto, lojaId) {
  const busca = encodeURIComponent(nomeProduto);
  const urls = {
    sephora: `https://www.sephora.com.br/search?q=${busca}`,
    belezanaweb: `https://www.belezanaweb.com.br/busca?q=${busca}`,
    epoca: `https://www.epocacosmeticos.com.br/busca?q=${busca}`,
    boticario: `https://www.boticario.com.br/busca?q=${busca}`,
  };
  return urls[lojaId] || urls.sephora;
}
