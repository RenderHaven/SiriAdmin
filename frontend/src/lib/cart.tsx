import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Service } from "./api";

export type CartItem = {
  serviceId: number;
  title: string;
  price: number;
  imageUrl?: string | null;
};

type CartCtx = {
  items: CartItem[];
  add: (s: Service) => void;
  remove: (id: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "siri.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      add: (s) =>
        setItems((prev) =>
          prev.find((i) => i.serviceId === s.id)
            ? prev
            : [
                ...prev,
                {
                  serviceId: s.id,
                  title: s.title,
                  price: Number(s.price),
                  imageUrl: s.image_url ?? null,
                },
              ],
        ),
      remove: (id) =>
        setItems((prev) => prev.filter((i) => i.serviceId !== id)),
      clear: () => setItems([]),
      total: items.reduce((sum, i) => sum + Number(i.price || 0), 0),
      count: items.length,
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}