var K = Object.defineProperty;
var U = (l, t, e) => t in l ? K(l, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : l[t] = e;
var F = (l, t, e) => U(l, typeof t != "symbol" ? t + "" : t, e);
const G = "production";
console.log("Storage ENV: ", G);
const P = class P {
  static getInstance(t) {
    return P.instances[t] === void 0 && (t === "mem" ? P.instances[t] = new L() : P.instances[t] = new j()), P.instances[t];
  }
};
P.instances = {};
let y = P;
const p = class p {
  async set(t, e) {
    const s = {
      [t]: e
    };
    return p.browser.storage.local.set(s);
  }
  async batchSet(t) {
    return p.browser.storage.local.set(t);
  }
  async get(t) {
    const e = await p.browser.storage.local.get(t);
    return e[t] === void 0 ? null : e[t];
  }
  async remove(t) {
    const e = await p.browser.storage.local.get(t);
    return await p.browser.storage.local.remove(t), e[t] === void 0 ? null : e[t];
  }
  batchRemove(t) {
    return p.browser.storage.local.remove(t);
  }
};
p.browser = globalThis.chrome;
let j = p;
const g = class g {
  set(t, e) {
    return g.state[t] = e, Promise.resolve();
  }
  batchSet(t) {
    for (let e in t)
      g.state[e] = t[e];
    return Promise.resolve();
  }
  get(t) {
    const e = g.state[t] === void 0 ? null : g.state[t];
    return Promise.resolve(e);
  }
  remove(t) {
    const e = g.state[t] === void 0 ? null : g.state[t];
    return delete g.state[t], Promise.resolve(e);
  }
  batchRemove(t) {
    for (let e of t)
      delete g.state[e];
    return Promise.resolve();
  }
};
g.state = {};
let L = g;
const v = class v {
  /**
   * Listen a message type
   */
  static listen(t, e) {
    v.processors[t] = e;
  }
  /**
   * Listener entry
   */
  static runtimeEntry(t, e, s) {
    const n = v.processors[t.type];
    return n !== void 0 ? (n(t, s), !0) : (s(null), !1);
  }
};
v.browser = globalThis.chrome, v.processors = {}, v.browser.runtime.onMessage.addListener(v.runtimeEntry);
let f = v;
/**
 * @author afu
 * @license MIT
 */
class W {
  constructor() {
    this.resource = null, this.position = 0, this.filters = [];
  }
  /**
   * @inheritdoc
   */
  async doFilter(t) {
    if (this.position >= this.filters.length) {
      const s = this.resource;
      return this.clearFilters(), s === null ? null : await s.run(t);
    }
    return await this.filters[this.position++].doFilter(t, this);
  }
  /**
   * Add a filter to the filter chain
   */
  addFilter(t) {
    this.filters.push(t);
  }
  /**
   * Clear all filters
   */
  clearFilters() {
    this.position = 0, this.filters = [], this.resource = null;
  }
  /**
   * Set the resource
   */
  setResource(t) {
    this.resource = t;
  }
}
const k = "mem_pwd", O = "local_current_account", V = "local_current_chain", H = "luban_wallet", X = 1;
class J {
  constructor(t) {
    this.db = t;
  }
  /**
   * Count the number of records in the store
   */
  count(t) {
    return new Promise((e, s) => {
      const a = this.db.transaction(t, "readonly").objectStore(t).count();
      a.onsuccess = (o) => {
        e(o.target.result);
      }, a.onerror = (o) => {
        s(o);
      };
    });
  }
  /**
   * Count the number of records in the store by index
   */
  countByIndex(t, e, s) {
    return new Promise((n, r) => {
      const h = this.db.transaction(t, "readonly").objectStore(t).index(e).count(IDBKeyRange.only(s));
      h.onsuccess = (i) => {
        n(i.target.result);
      }, h.onerror = (i) => {
        r(i);
      };
    });
  }
  /**
   * Clear all records in the store
   */
  clear(t) {
    return new Promise((e, s) => {
      const n = this.db.transaction(t, "readwrite");
      n.objectStore(t).clear(), n.onerror = (a) => {
        s(a);
      }, n.oncomplete = () => {
        e(!0);
      };
    });
  }
  /**
   * Add a record to the store
   */
  add(t, e) {
    return new Promise((s, n) => {
      const r = this.db.transaction(t, "readwrite");
      r.objectStore(t).add(e), r.onerror = (o) => {
        n(o);
      }, r.oncomplete = () => {
        s(!0);
      };
    });
  }
  /**
   * Add multiple records to the store
   */
  batchAdd(t, e) {
    return new Promise((s, n) => {
      const r = this.db.transaction(t, "readwrite"), a = r.objectStore(t);
      for (let o = 0; o < e.length; o++)
        a.add(e[o]);
      r.onerror = (o) => {
        n(o);
      }, r.oncomplete = () => {
        s(!0);
      };
    });
  }
  /**
   * Query all records in the store
   */
  queryAll(t) {
    return new Promise((e, s) => {
      const n = [], r = this.db.transaction(t, "readonly"), o = r.objectStore(t).openCursor();
      r.oncomplete = () => {
        e(n);
      }, r.onerror = (h) => {
        s(h);
      }, o.onsuccess = (h) => {
        const i = h.target.result;
        i != null && (n.push(i.value), i.continue());
      };
    });
  }
  /**
   * Query a single record by primary key
   */
  queryOne(t, e) {
    return new Promise((s, n) => {
      let r = null;
      const a = this.db.transaction(t, "readonly"), h = a.objectStore(t).get(IDBKeyRange.only(e));
      a.onerror = (i) => {
        n(i);
      }, a.oncomplete = () => {
        s(r);
      }, h.onsuccess = (i) => {
        r = i.target.result === void 0 ? null : i.target.result;
      };
    });
  }
  /**
   * Query a single record by index
   */
  queryOneByIndex(t, e, s) {
    return new Promise((n, r) => {
      let a = null;
      const o = this.db.transaction(t, "readonly"), i = o.objectStore(t).index(e).get(IDBKeyRange.only(s));
      o.onerror = (m) => {
        r(m);
      }, o.oncomplete = () => {
        n(a);
      }, i.onsuccess = (m) => {
        a = m.target.result === void 0 ? null : m.target.result;
      };
    });
  }
  /**
   * Query all records by index
   */
  queryAllByIndex(t, e, s) {
    return new Promise((n, r) => {
      const a = [], o = this.db.transaction(t, "readonly"), i = o.objectStore(t).index(e).openCursor(IDBKeyRange.only(s));
      o.onerror = (m) => {
        r(m);
      }, o.oncomplete = () => {
        n(a);
      }, i.onsuccess = (m) => {
        const B = m.target.result;
        B != null && (a.push(B.value), B.continue());
      };
    });
  }
  /**
   * Update a record in the store
   */
  update(t, e) {
    return new Promise((s, n) => {
      const r = this.db.transaction(t, "readwrite");
      r.objectStore(t).put(e), r.onerror = (o) => {
        n(o);
      }, r.oncomplete = () => {
        s(!0);
      };
    });
  }
  /**
   * Delete a record from the store by primary key
   */
  delete(t, e) {
    return new Promise((s, n) => {
      const r = this.db.transaction(t, "readwrite");
      r.objectStore(t).delete(IDBKeyRange.only(e)), r.onerror = (o) => {
        n(o);
      }, r.oncomplete = () => {
        s(!0);
      };
    });
  }
  /**
   * Query records by page
   */
  queryListByPage(t, e, s, n = "prev") {
    return new Promise((r, a) => {
      const o = [], h = this.db.transaction(t, "readonly"), m = h.objectStore(t).openCursor(null, n), B = (e - 1) * s;
      let R = 0, A = 0;
      h.onerror = (q) => {
        a(q);
      }, h.oncomplete = () => {
        r(o);
      }, m.onsuccess = (q) => {
        const b = q.target.result;
        if (b != null) {
          if (R < B) {
            R++, b.continue();
            return;
          }
          A < s && (o.push(b.value), A++, b.continue());
        }
      };
    });
  }
  /**
   * Query records by page and index
   */
  queryListByPageAndIndex(t, e, s, n, r, a = "prev") {
    return new Promise((o, h) => {
      const i = [], m = this.db.transaction(t, "readonly"), R = m.objectStore(t).index(n).openCursor(IDBKeyRange.only(r), a), A = (e - 1) * s;
      let q = 0, b = 0;
      m.onerror = (E) => {
        h(E);
      }, m.oncomplete = () => {
        o(i);
      }, R.onsuccess = (E) => {
        const C = E.target.result;
        if (C != null) {
          if (q < A) {
            q++, C.continue();
            return;
          }
          b < s && (i.push(C.value), b++, C.continue());
        }
      };
    });
  }
}
const w = class w {
  constructor(t) {
    this.options = t;
  }
  close() {
    w.db !== null && (w.db.close(), w.db = null);
  }
  getCommand() {
    return new Promise((t, e) => {
      const s = w.internalDB.open(this.options.dbName, this.options.version);
      s.onerror = (n) => {
        e(n);
      }, s.onsuccess = (n) => {
        w.db = n.target.result, t(new J(w.db));
      }, s.onupgradeneeded = (n) => {
        w.onupgradeneeded !== null && w.onupgradeneeded(n.target.result);
      };
    });
  }
};
w.internalDB = globalThis.indexedDB, w.db = null, w.onupgradeneeded = null;
let T = w;
const d = class d {
  constructor() {
    F(this, "store", "");
  }
  initDB() {
    d.dbInstance === null && (d.dbInstance = new T({ dbName: H, version: X }));
  }
  close() {
    d.dbInstance !== null && d.dbInstance.close();
  }
  async insert(t) {
    this.initDB();
    let e = !1;
    try {
      e = await (await d.dbInstance.getCommand()).add(this.store, t);
    } catch (s) {
      console.error(s);
    }
    return this.close(), e;
  }
  async delete(t) {
    this.initDB();
    let e = !1;
    try {
      e = await (await d.dbInstance.getCommand()).delete(this.store, t);
    } catch (s) {
      console.error(s);
    }
    return this.close(), e;
  }
  async clear() {
    this.initDB();
    let t = !1;
    try {
      t = await (await d.dbInstance.getCommand()).clear(this.store);
    } catch (e) {
      console.error(e);
    }
    return this.close(), t;
  }
  async update(t) {
    this.initDB();
    let e = !1;
    try {
      e = await (await d.dbInstance.getCommand()).update(this.store, t);
    } catch (s) {
      console.error(s);
    }
    return this.close(), e;
  }
  async getOne(t) {
    this.initDB();
    let e = null;
    try {
      e = await (await d.dbInstance.getCommand()).queryOne(this.store, t);
    } catch (s) {
      console.error(s);
    }
    return this.close(), e;
  }
  async getAll() {
    this.initDB();
    let t = null;
    try {
      t = await (await d.dbInstance.getCommand()).queryAll(this.store);
    } catch (e) {
      console.error(e);
    }
    return this.close(), t;
  }
  async getAllByIndex(t, e) {
    this.initDB();
    let s = null;
    try {
      s = await (await d.dbInstance.getCommand()).queryAllByIndex(this.store, t, e);
    } catch (n) {
      console.error(n);
    }
    return this.close(), s;
  }
  async getOneByIndex(t, e) {
    this.initDB();
    let s = null;
    try {
      s = await (await d.dbInstance.getCommand()).queryOneByIndex(this.store, t, e);
    } catch (n) {
      console.error(n);
    }
    return this.close(), s;
  }
  async getListByPage(t, e) {
    this.initDB();
    let s = 0, n = [];
    try {
      const r = await d.dbInstance.getCommand();
      s = await r.count(this.store), n = await r.queryListByPage(this.store, t, e);
    } catch (r) {
      console.error(r);
    }
    return this.close(), {
      total: s,
      data: n
    };
  }
  async getListByPageAndIndex(t, e, s, n) {
    this.initDB();
    let r = 0, a = [];
    try {
      const o = await d.dbInstance.getCommand();
      r = await o.countByIndex(this.store, s, n), a = await o.queryListByPageAndIndex(this.store, t, e, s, n);
    } catch (o) {
      console.error(o);
    }
    return this.close(), {
      total: r,
      data: a
    };
  }
};
F(d, "dbInstance", null);
let x = d;
class D extends x {
  constructor() {
    super(), this.store = "connections";
  }
  async isConnected(t) {
    const e = await this.getAll();
    return e === null ? !1 : e.some((n) => n.url === t);
  }
}
class Q extends x {
  constructor() {
    super(), this.store = "networks";
  }
}
const S = 375, u = class u {
  static async openPopup(t) {
    let e = 0;
    try {
      const n = await u.browser.windows.getLastFocused();
      e = Math.max(
        n.left + (n.width - S),
        0
      );
    } catch (n) {
      console.error(n);
      const { screenX: r, outerWidth: a } = globalThis;
      e = Math.max(r + (a - S), 0);
    }
    const s = await u.browser.windows.create({
      url: u.browser.runtime.getURL("index.html") + "#" + t,
      type: "popup",
      width: 375,
      height: 600,
      top: 0,
      left: e
    });
    u.id = s.id;
  }
  static response(t) {
    const e = u.callback;
    u.data = null, u.callback = null, e !== null && e(t), u.id !== 0 && (u.browser.windows.remove(u.id), u.id = 0);
  }
};
F(u, "id", 0), // @ts-expect-error todo
F(u, "browser", globalThis.chrome), F(u, "data", null), F(u, "callback", null);
let c = u;
class Y {
  async doFilter(t, e) {
    if (t !== "inpage_updateBaseInfo")
      return e.doFilter(t);
    const s = await y.getInstance("local").get(O), n = await y.getInstance("local").get(V);
    return c.response({
      code: 0,
      message: "OK",
      data: {
        account: s,
        network: n
      }
    }), !0;
  }
}
class Z {
  async doFilter(t, e) {
    if (t !== "eth_accounts")
      return e.doFilter(t);
    const s = await y.getInstance("local").get(O), n = await new D().isConnected(c.data.metadata.url);
    return c.response({
      code: 0,
      message: "OK",
      data: n ? [s == null ? void 0 : s.address] : []
    }), !0;
  }
}
class $ {
  async doFilter(t, e) {
    var a;
    if (t !== "wallet_switchEthereumChain")
      return e.doFilter(t);
    const s = ((a = c.data) == null ? void 0 : a.payload) ?? [], n = s.length > 0 ? s[0].chainId : "";
    return await new Q().getOneByIndex("chainId", BigInt(n).toString()) === null ? c.response({
      code: 4902,
      message: "Unrecognized chain ID",
      data: null
    }) : c.openPopup("/provider-request/switch-chain"), !0;
  }
}
class z {
  async doFilter(t, e) {
    if (t !== "eth_requestAccounts")
      return e.doFilter(t);
    if (await new D().isConnected(c.data.metadata.url)) {
      const n = await y.getInstance("local").get(O);
      c.response({
        code: 0,
        message: "OK",
        data: n === null ? [] : [n.address]
      });
    } else
      c.openPopup("/provider-request/account");
    return !0;
  }
}
class M {
  async doFilter(t, e) {
    return t !== "eth_sendTransaction" ? e.doFilter(t) : (await new D().isConnected(c.data.metadata.url) ? c.openPopup("/provider-request/send-transaction") : c.response({
      code: 4002,
      message: "Account not connected",
      data: null
    }), !0);
  }
}
class N {
  async doFilter(t, e) {
    return t !== "personal_sign" ? e.doFilter(t) : (await new D().isConnected(c.data.metadata.url) ? c.openPopup("/provider-request/sign-message") : c.response({
      code: 4002,
      message: "Account not connected",
      data: null
    }), !0);
  }
}
class _ {
  async doFilter(t, e) {
    return t !== "eth_signTypedData_v4" ? e.doFilter(t) : (await new D().isConnected(c.data.metadata.url) ? c.openPopup("/provider-request/sign-typed-data") : c.response({
      code: 4002,
      message: "Account not connected",
      data: null
    }), !0);
  }
}
class tt {
  static createFilter() {
    const t = new W();
    return t.setResource({
      run: () => (c.response({
        code: 4e3,
        message: "Unsupported request",
        data: null
      }), Promise.resolve(!1))
    }), t.addFilter(new Y()), t.addFilter(new Z()), t.addFilter(new $()), t.addFilter(new z()), t.addFilter(new M()), t.addFilter(new N()), t.addFilter(new _()), t;
  }
}
class I {
  static init() {
    f.listen("memSet", I.memSet), f.listen("memGet", I.memGet), f.listen("ping", I.ping), f.listen("@providerRequest", I.providerRequest), f.listen("@providerRequestGrabData", I.providerRequestGrabData), f.listen("@providerResponse", I.providerResponse);
  }
  static providerRequestGrabData(t, e) {
    e(c.data);
  }
  static providerResponse(t, e) {
    e(!0), c.response(t.data);
  }
  static async providerRequest(t, e) {
    if (c.data !== null) {
      e({
        code: 4006,
        message: "Another request is being processed, please try again later",
        data: null
      });
      return;
    }
    const s = t.data.action;
    c.data = t.data, c.callback = e;
    try {
      await tt.createFilter().doFilter(s);
    } catch (n) {
      c.response({
        code: 5e3,
        message: n.message,
        data: null
      });
    }
  }
  static ping(t, e) {
    y.getInstance("mem").get(k).then((s) => {
      if (s === null || s === "") {
        e(0);
        return;
      }
      e(1);
    }).catch(() => {
      e(0);
    });
  }
  static memSet(t, e) {
    const s = t.data;
    y.getInstance("mem").set(s.key, s.value), e(!0);
  }
  static async memGet(t, e) {
    const s = t.data, n = await y.getInstance("mem").get(s);
    e(n === null ? "" : n);
  }
}
I.init();
