import { Card } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import {
  useBilling,
  setInvoiceType,
  getInvoice,
  computeBill,
} from "../store/useBilling";
import { inr } from "../data/billing";
import { generateInvoicePdf } from "../utils/invoicePdf";
import { BRAND_GRADIENT } from "../lib/brand";

const tabs = [
  { key: "order", label: "Order" },
  { key: "payout", label: "Payout" },
  { key: "subscription", label: "Subscription" },
];

const titles = {
  order: "Tax Invoice",
  payout: "Payout Statement",
  subscription: "Subscription Invoice",
};

function Line({ label, amt, muted }) {
  return (
    <div className="flex justify-between items-center text-body-md py-1">
      <span className={muted ? "text-on-surface-variant" : "text-on-surface"}>
        {label}
      </span>
      <span className={amt < 0 ? "text-on-surface-variant" : "text-on-surface"}>
        {amt < 0 ? `– ${inr(-amt)}` : inr(amt)}
      </span>
    </div>
  );
}

export default function Billing() {
  const { active } = useBilling();
  const inv = getInvoice(active);
  const bill = computeBill(inv);
  const party = inv.customer || inv.cook;

  return (
    <main className="px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
      <section className="mb-stack-md print:hidden">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
          Billing
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Invoices & GST statements
        </p>
      </section>

      <nav className="flex gap-2 mb-stack-md print:hidden overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setInvoiceType(t.key)}
            className={`px-5 py-2 rounded-full font-label-lg text-label-lg transition-all active:scale-95 ${
              active === t.key
                ? "text-white shadow-card"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
            style={
              active === t.key ? { background: BRAND_GRADIENT } : undefined
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      <Card className="p-5" id="invoice">
        <div className="flex justify-between items-start mb-stack-md">
          <div>
            <img
              src="/logo.png"
              alt="Zingro"
              className="h-7 w-auto object-contain"
            />
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">
              Kiran Kumar K · Bengaluru
            </p>
          </div>
          <div className="text-right">
            <p className="text-label-lg font-label-lg text-on-surface">
              {titles[active]}
            </p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              {inv.number}
            </p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              {inv.date}
            </p>
          </div>
        </div>

        <div className="pb-stack-md mb-stack-md border-b border-outline-variant text-label-sm font-label-sm text-on-surface-variant">
          <p className="text-on-surface font-label-lg text-label-lg">{party}</p>
          {inv.gstin && <p>GSTIN: {inv.gstin}</p>}
          {inv.state && <p>Place of supply: {inv.state}</p>}
        </div>

        <div className="space-y-0.5">
          {bill.lines.map((l, i) => (
            <Line key={i} {...l} />
          ))}
        </div>

        <div className="pt-3 mt-3 border-t border-outline-variant space-y-0.5">
          <Line label="Subtotal" amt={bill.subtotal} muted />
          {bill.taxes.map((t, i) => (
            <Line key={i} {...t} muted />
          ))}
        </div>

        <div className="pt-3 mt-3 border-t border-outline-variant flex justify-between items-center">
          <span className="text-label-lg font-label-lg text-on-surface">
            {active === "payout" ? "Net Payout" : "Total"}
          </span>
          <span className="text-headline-md font-headline-md text-primary">
            {inr(bill.total)}
          </span>
        </div>

        {bill.payoutNote && (
          <p className="mt-stack-md text-label-sm font-label-sm text-on-surface-variant flex items-center gap-2">
            <Icon name="account_balance" className="text-primary text-[18px]" />{" "}
            {bill.payoutNote}
          </p>
        )}

        <p className="mt-stack-md text-label-sm font-label-sm text-outline text-center">
          This is a computer-generated invoice.
        </p>
      </Card>

      <div className="mt-stack-md print:hidden">
        <Button
          full
          icon="download"
          iconRight={false}
          onClick={() => generateInvoicePdf(inv, bill)}
        >
          Download PDF
        </Button>
      </div>
    </main>
  );
}
