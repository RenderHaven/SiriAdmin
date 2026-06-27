import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { api, type BookingPayload } from "@/lib/api";
import { formatPrice, useCart } from "@/lib/cart";

type FormState = {
  name: string;
  email: string;
  phone: string;
  event_name: string;
  event_date: string;
  message: string;
};

export function ContactPage() {
  const { items, clear, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    event_name: "",
    event_date: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const services =
        items.length > 0
          ? items.map((i) => ({ id: i.serviceId, title: i.title }))
          : [{ id: 0, title: "General enquiry" }];

      const results = await Promise.allSettled(
        services.map((s) => {
          const payload: BookingPayload = {
            service_id: s.id,
            name: form.name,
            email: form.email,
            phone: form.phone,
            event_name: form.event_name,
            event_date: form.event_date,
            message: form.message,
          };
          return api.createBooking(payload);
        }),
      );
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length === results.length) {
        throw new Error("Could not submit your enquiry. Please try again.");
      }
      return { sent: results.length - failed.length, failed: failed.length };
    },
    onSuccess: (res) => {
      toast.success(
        res.failed > 0
          ? `Enquiry sent for ${res.sent} package${res.sent === 1 ? "" : "s"}.`
          : "Thank you — we'll be in touch within two working days.",
      );
      clear();
      navigate("/");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto grid max-w-[1400px] gap-16 px-6 pb-24 pt-32 md:grid-cols-[1.4fr_1fr] md:pt-40">
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary">
          ✱ Begin the conversation
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
          Let&apos;s create something
          <br />
          <span className="italic text-stroke">extraordinary.</span>
        </h1>
        <p className="mt-5 max-w-md text-muted-foreground">
          A few details help us reply with the right information. Every
          enquiry reaches us directly.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="mt-10 grid gap-5"
        >
          <Field label="Full name" required value={form.name} onChange={update("name")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" type="email" required value={form.email} onChange={update("email")} />
            <Field label="Phone" required value={form.phone} onChange={update("phone")} />
          </div>
          <Field label="Event name" required value={form.event_name} onChange={update("event_name")} />
          <Field label="Event date" type="date" required value={form.event_date} onChange={update("event_date")} />
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Notes
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={update("message")}
              className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Venue, hours, anything you'd like us to know…"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-4 self-start rounded-sm bg-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] text-background hover:bg-primary disabled:opacity-60"
          >
            {mutation.isPending ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      </div>

      <aside className="h-fit border border-border bg-card p-6 md:sticky md:top-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Your selection
        </p>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No packages selected — we'll send general information.
          </p>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li
                  key={i.serviceId}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <span className="font-display text-base">{i.title}</span>
                  <span className="text-muted-foreground">
                    {formatPrice(Number(i.price))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Estimated
              </span>
              <span className="font-display text-xl">{formatPrice(total)}</span>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Field({
  label,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}