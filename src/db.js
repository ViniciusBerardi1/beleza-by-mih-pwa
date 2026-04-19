import { getActiveKey, encryptText, decryptText } from "./crypto";

const DB_NAME = "beleza-by-mih";
const DB_VERSION = 1;

const SENSITIVE = ["nome", "foto", "cor"];

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

async function encryptProduct(p) {
  const key = getActiveKey();
  if (!key) return p;
  const result = { ...p, _encrypted: true };
  for (const field of SENSITIVE) {
    if (result[field]) {
      result[field] = await encryptText(key, result[field]);
    }
  }
  return result;
}

async function decryptProduct(p) {
  if (!p._encrypted) return p;
  const key = getActiveKey();
  if (!key) return p;
  const result = { ...p };
  for (const field of SENSITIVE) {
    if (result[field]) {
      try {
        result[field] = await decryptText(key, result[field]);
      } catch {
        result[field] = "";
      }
    }
  }
  return result;
}

export const db = {
  getCategorias: () => getAll("categorias"),

  getProdutos: async () => {
    const [produtos, categorias] = await Promise.all([
      getAll("produtos"),
      getAll("categorias"),
    ]);
    const decriptados = await Promise.all(produtos.map(decryptProduct));
    return decriptados
      .map((p) => ({
        ...p,
        categoria_nome:
          categorias.find((c) => c.id === Number(p.categoria_id))?.nome || "",
      }))
      .sort((a, b) => {
        if (!a.data_validade) return 1;
        if (!b.data_validade) return -1;
        return new Date(a.data_validade) - new Date(b.data_validade);
      });
  },

  addProduto: async (p) => {
    const { id, ...produtoSemId } = p;
    const comData = { ...produtoSemId, data_cadastro: new Date().toISOString() };
    const encrypted = await encryptProduct(comData);
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const tx = database.transaction("produtos", "readwrite");
      const req = tx.objectStore("produtos").add(encrypted);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  updateProduto: async (p) => {
    const encrypted = await encryptProduct(p);
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const tx = database.transaction("produtos", "readwrite");
      const req = tx.objectStore("produtos").put(encrypted);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

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

  migrateToEncrypted: async () => {
    const produtos = await getAll("produtos");
    const database = await openDB();
    for (const p of produtos) {
      if (!p._encrypted) {
        const encrypted = await encryptProduct(p);
        await new Promise((resolve, reject) => {
          const tx = database.transaction("produtos", "readwrite");
          const req = tx.objectStore("produtos").put(encrypted);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    }
  },
};
