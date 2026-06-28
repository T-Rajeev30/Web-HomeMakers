import Icon from "./Icon";

/** Scrollable modal for Terms / Privacy content. */
export default function LegalModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-surface w-full sm:max-w-xl max-h-[88vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-on-surface-variant active:scale-95"
          >
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto text-body-md text-on-surface-variant space-y-stack-md">
          {children}
        </div>
        <div className="px-5 py-3 border-t border-outline-variant">
          <button
            onClick={onClose}
            className="w-full h-touch-target-min rounded-lg bg-primary text-on-primary font-label-lg text-label-lg active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function H({ children }) {
  return (
    <h4 className="font-label-lg text-label-lg text-on-surface mt-2">
      {children}
    </h4>
  );
}
function P({ children }) {
  return <p className="leading-relaxed">{children}</p>;
}

export function TermsContent() {
  return (
    <>
      <P>
        Last updated:{" "}
        {new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        . These terms govern your registration and participation as a home cook
        ("Cook") on the ZINGRO platform operated by Kiran Kumar K (sole
        proprietorship), Bengaluru.
      </P>
      <H>1. Eligibility</H>
      <P>
        You must be at least 18 years old, legally permitted to prepare and sell
        food in India, and hold a valid FSSAI registration or license for your
        kitchen.
      </P>
      <H>2. Onboarding & Verification</H>
      <P>
        You agree to provide accurate PAN, bank, FSSAI and identity details.
        ZINGRO verifies these through a licensed third-party KYC provider.
        Listing approval is at ZINGRO's discretion and may be withheld or
        revoked if verification fails or information is found false.
      </P>
      <H>3. Food Safety & Hygiene</H>
      <P>
        You are solely responsible for the quality, safety, hygiene and accurate
        description of all food you prepare, and for compliance with FSSAI
        Schedule 4 hygiene requirements and all applicable food laws. ZINGRO is
        a technology marketplace and is not the manufacturer of your food.
      </P>
      <H>4. Orders, Pricing & Payments</H>
      <P>
        You set your menu and prices within platform guidelines. ZINGRO collects
        payments from customers and remits your earnings, less the agreed
        commission, to your verified bank account on the applicable payout
        cycle.
      </P>
      <H>5. Subscription</H>
      <P>
        Plan features and fees are as shown at selection and may change with
        prior notice. You may upgrade, downgrade or cancel subject to the plan
        terms.
      </P>
      <H>6. Suspension & Termination</H>
      <P>
        ZINGRO may suspend or terminate your account for breach of these terms,
        food-safety violations, repeated customer complaints, or fraudulent
        activity. You may close your account at any time.
      </P>
      <H>7. Liability</H>
      <P>
        To the extent permitted by law, ZINGRO is not liable for indirect or
        consequential losses. You agree to indemnify ZINGRO against claims
        arising from food you prepare or from your breach of these terms.
      </P>
      <H>8. Governing Law</H>
      <P>
        These terms are governed by the laws of India, with exclusive
        jurisdiction of the courts at Bengaluru, Karnataka.
      </P>
      <H>9. Contact</H>
      <P>
        For questions about these terms, contact ZINGRO support via the in-app
        Support page.
      </P>
    </>
  );
}

export function PrivacyContent() {
  return (
    <>
      <P>
        Last updated:{" "}
        {new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        . This policy explains how ZINGRO (operated by Kiran Kumar K, sole
        proprietorship, Bengaluru) collects and processes your personal data, in
        line with the Digital Personal Data Protection Act, 2023 (DPDP Act).
      </P>
      <H>1. Data We Collect</H>
      <P>
        Identity and contact details (name, email, phone, address); financial
        details (PAN, GST if provided, bank account and IFSC); regulatory
        details (FSSAI license); kitchen and profile photographs with location
        metadata; and food and subscription preferences.
      </P>
      <H>2. Purpose of Processing</H>
      <P>
        We process this data to verify your identity and eligibility (KYC),
        enable payouts, ensure food-safety compliance, operate the marketplace,
        and meet legal obligations. We collect only what is necessary for these
        purposes.
      </P>
      <H>3. Your Consent</H>
      <P>
        By accepting this policy you give informed consent to the above
        processing. You may withdraw consent at any time via the Support page;
        withdrawal may prevent continued use of the platform where the data is
        essential.
      </P>
      <H>4. KYC & Third Parties</H>
      <P>
        Verification is performed by a licensed KYC provider acting as our
        processor. We store only masked identifiers (e.g. last digits of
        PAN/account) and verification results — not full identity documents
        beyond what is legally required.
      </P>
      <H>5. Storage & Security</H>
      <P>
        Data is stored on secured infrastructure in India with access controls.
        Photographs are kept in private storage accessed only through
        time-limited links. We retain data only as long as needed for the stated
        purposes or as required by law.
      </P>
      <H>6. Your Rights (DPDP Act)</H>
      <P>
        You have the right to access, correct, and erase your personal data, to
        nominate a representative, and to grievance redressal. Submit requests
        through the Support page; we respond within the timelines required by
        law.
      </P>
      <H>7. Sharing</H>
      <P>
        We share data only with KYC and payment processors, delivery partners as
        needed to fulfil orders, and authorities where legally required. We do
        not sell your personal data.
      </P>
      <H>8. Grievance Officer</H>
      <P>
        Concerns about your data can be raised with our Grievance Officer via
        the in-app Support page; we will acknowledge and address them as
        required under the DPDP Act.
      </P>
    </>
  );
}
