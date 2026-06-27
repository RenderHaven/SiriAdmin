import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { formatPrice, useCart } from "@/lib/cart";

export function CartPage() {
  const { items, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="text-[11px] uppercase tracking-[0.4em] text-primary">
        Your selection
      </p>
      <h1 className="mt-3 font-display text-5xl">Enquiry cart</h1>

      {items.length === 0 ? (
        <div className="mt-16 border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground">
            Nothing here yet. Browse our packages to begin.
          </p>
          <Link
            to="/services"
            className="mt-6 inline-block rounded-sm bg-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] text-background hover:bg-primary"
          >
            View services
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {items.map((i) => (
              <li key={i.serviceId} className="flex items-center gap-4 py-5">
                {i.imageUrl ? (
                  <img
                    src={i.imageUrl}
                    alt={i.title}
                    className="h-20 w-20 flex-none object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 flex-none bg-muted" />
                )}
                <div className="flex-1">
                  <p className="font-display text-xl">{i.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(Number(i.price))}
                  </p>
                </div>
                <button
                  onClick={() => remove(i.serviceId)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove"
                >
                  <X className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Estimated total
              </p>
              <p className="font-display text-3xl">{formatPrice(total)}</p>
            </div>
            <button
              onClick={() => navigate("/contact")}
              className="rounded-sm bg-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] text-background hover:bg-primary"
            >
              Continue to enquiry →
            </button>
          </div>
        </>
      )}
    </div>
  );
}