import { useState } from "react";
import { Card } from "./Card";
import TextField from "./TextField";
import Button from "./Button";
import Icon from "./Icon";
import { addMessage } from "../store/useMessages";
import { contactInfo, faqs } from "../data/mock";
import { BRAND_GRADIENT } from "../lib/brand";

function FaqItem({ q, a, open, onToggle }) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 text-left active:scale-[0.99] transition-transform"
      >
        <span className="text-label-lg font-label-lg text-on-surface">{q}</span>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          className="text-on-surface-variant shrink-0"
        />
      </button>
      {open && (
        <p className="px-4 pb-4 -mt-1 text-body-md text-on-surface-variant">
          {a}
        </p>
      )}
    </Card>
  );
}

export default function ContactView() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    addMessage({
      ...form,
      name: form.name.trim(),
      message: form.message.trim(),
    });
    setForm({ name: "", email: "", message: "" });
    setSent(true);
  };

  return (
    <div className="space-y-stack-lg">
      <div className="flex items-center gap-4">
        <div
          className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: BRAND_GRADIENT }}
        >
          <Icon name="support_agent" className="text-white text-[26px]" />
        </div>
        <div>
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            Get in Touch
          </h2>
          <p className="text-body-md text-on-surface-variant">
            We're here to help with anything you need.
          </p>
        </div>
      </div>

      <Card className="p-4 flex flex-col gap-stack-sm">
        <a
          href={`mailto:${contactInfo.email}`}
          className="flex items-center gap-3 text-body-md text-on-surface"
        >
          <Icon name="mail" className="text-primary" /> {contactInfo.email}
        </a>
        <a
          href={`tel:${contactInfo.phone}`}
          className="flex items-center gap-3 text-body-md text-on-surface"
        >
          <Icon name="call" className="text-primary" /> {contactInfo.phone}
        </a>
        <div className="flex items-start gap-3 text-body-md text-on-surface">
          <Icon name="location_on" className="text-primary shrink-0" />{" "}
          {contactInfo.address}
        </div>
      </Card>

      <Card className="p-5">
        {sent ? (
          <div className="flex flex-col items-center text-center py-stack-md">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#0fb59b1a" }}
            >
              <Icon
                name="check_circle"
                fill
                className="text-[36px]"
                style={{ color: "#0fb59b" }}
              />
            </div>
            <p className="text-label-lg font-label-lg text-on-surface mb-1">
              Message sent!
            </p>
            <p className="text-body-md text-on-surface-variant mb-stack-md">
              We'll get back to you within 24 hours.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>
              Send another
            </Button>
          </div>
        ) : (
          <form className="space-y-stack-lg" onSubmit={submit}>
            <TextField
              label="Name"
              id="c-name"
              value={form.name}
              onChange={set("name")}
              placeholder="Your name"
              required
            />
            <TextField
              label="Email"
              id="c-email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              required
            />
            <div>
              <label
                htmlFor="c-message"
                className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
              >
                Message
              </label>
              <textarea
                id="c-message"
                value={form.message}
                onChange={set("message")}
                rows={4}
                required
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>
            <Button full icon="send" type="submit">
              Send Message
            </Button>
          </form>
        )}
      </Card>

      <section>
        <h3 className="text-label-lg font-label-lg text-on-surface-variant mb-3 uppercase tracking-wider">
          Frequently Asked
        </h3>
        <div className="flex flex-col gap-stack-sm">
          {faqs.map((f, i) => (
            <FaqItem
              key={i}
              {...f}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
