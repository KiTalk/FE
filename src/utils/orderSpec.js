export const ORDER_SPEC_KEY = "order_spec";

function getDefaultOrderSpec() {
  return {
    cart: [],
    package: {},
    point: {},
  };
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadOrderSpec() {
  try {
    const raw = window.localStorage.getItem(ORDER_SPEC_KEY);
    if (raw) {
      const parsed = safeParse(raw);
      if (parsed && typeof parsed === "object") {
        const pkg = parsed?.package ?? {};
        const point = parsed?.point ?? {};
        const cartRaw = parsed?.cart;
        if (Array.isArray(cartRaw)) {
          return { cart: cartRaw, package: pkg, point };
        }
        const legacyItemsById = cartRaw?.itemsById ?? {};
        const migratedArray = Object.values(legacyItemsById);
        return { cart: migratedArray, package: pkg, point };
      }
    }
    return getDefaultOrderSpec();
  } catch {
    return getDefaultOrderSpec();
  }
}

export function saveOrderSpec(nextSpec) {
  const spec = nextSpec ?? getDefaultOrderSpec();
  try {
    window.localStorage.setItem(ORDER_SPEC_KEY, JSON.stringify(spec));
  } catch (err) {
    console.error(err);
  }
}

export function saveCartItems(cartOrMap) {
  const current = loadOrderSpec();
  const itemsArrayRaw = Array.isArray(cartOrMap)
    ? cartOrMap
    : Object.values(cartOrMap ?? {});
  const itemsArray = itemsArrayRaw.map(function (it) {
    if (!it || typeof it !== "object") return it;
    const result = { ...it };
    delete result.id;
    delete result.popular;
    return result;
  });
  const next = {
    cart: itemsArray,
    package: current.package ?? {},
    point: current.point ?? {},
  };
  saveOrderSpec(next);
}

export function saveOrderPackage(packagePartial) {
  const current = loadOrderSpec();
  const next = {
    cart: Array.isArray(current.cart) ? current.cart : [],
    package: { ...(current.package ?? {}), ...(packagePartial ?? {}) },
    point: current.point ?? {},
  };
  saveOrderSpec(next);
}

export function saveOrderPoint(pointPartial) {
  const current = loadOrderSpec();
  const next = {
    cart: Array.isArray(current.cart) ? current.cart : [],
    package: current.package ?? {},
    point: { ...(current.point ?? {}), ...(pointPartial ?? {}) },
  };
  saveOrderSpec(next);
}
