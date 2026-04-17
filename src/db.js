const DB_NAME = "beleza-by-mih";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains("categorias")) {
        const cats = db.createObjectStore("categorias", {
          keyPath: "id",
          autoIncrement: true,
        });
        cats.transaction.oncomplete = () => {
          const tx = db.transaction("categorias", "readwrite");
          const store = tx.objectStore("categorias");
          [
            "Skincare",
            "Cabelo",
            "Maquiagem",
            "Corpo",
            "Perfumaria",
            "Outros",
          ].forEach((nome, i) => {
            store.add({ id: i + 1, nome });
          });
        };
      }

      if (!db.objectStoreNames.contains("produtos")) {
        const prod = db.createObjectStore("produtos", {
          keyPath: "id",
          autoIncrement: true,
        });
        prod.createIndex("categoria_id", "categoria_id", { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getAll(store) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(store, "readonly");
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export const db = {
  getCategorias: () => getAll("categorias"),

  getProdutos: async () => {
    const [produtos, categorias] = await Promise.all([
      getAll("produtos"),
      getAll("categorias"),
    ]);
    return produtos
      .map((p) => ({
        ...p,
        categoria_nome:
          categorias.find((c) => c.id == p.categoria_id)?.nome || "",
      }))
      .sort((a, b) => {
        if (!a.data_validade) return 1;
        if (!b.data_validade) return -1;
        return new Date(a.data_validade) - new Date(b.data_validade);
      });
  },

  addProduto: (p) =>
    openDB().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction("produtos", "readwrite");
          const { id, ...produtoSemId } = p;
          const req = tx
            .objectStore("produtos")
            .add({ ...produtoSemId, data_cadastro: new Date().toISOString() });
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        }),
    ),

  updateProduto: (p) =>
    openDB().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction("produtos", "readwrite");
          const req = tx.objectStore("produtos").put(p);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        }),
    ),

  deleteProduto: (id) =>
    openDB().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction("produtos", "readwrite");
          const req = tx.objectStore("produtos").delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        }),
    ),
};
