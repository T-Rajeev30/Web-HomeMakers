import { useState } from "react";
import Icon from "./Icon";
import LegalModal, {
  TermsContent,
  PrivacyContent,
  ChefPartnerTermsContent,
} from "./LegalModal";
import { contactInfo } from "../data/mock";

function InfoBlock({ icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon
          name={icon}
          className="text-[16px]"
          style={{ color: "#7832F0" }}
        />
        <p className="font-semibold text-on-surface">{title}</p>
      </div>
      <div className="text-on-surface-variant leading-relaxed pl-6">
        {children}
      </div>
    </div>
  );
}

/**
 * Mandatory e-commerce disclosures (legal entity, address, grievance
 * officer, customer care, legal document links). See compliance review
 * notes — Grievance Officer below is a placeholder that MUST be filled
 * with real values before this ships; deliberately visible/obvious
 * rather than silently blank so nobody mistakes it for real data.
 */
export default function ComplianceFooter({ className = "" }) {
  const [legal, setLegal] = useState(null); // "terms" | "privacy" | "chef" | "returns" | null

  return (
    <div className={`text-sm ${className}`}>
      <div className="grid sm:grid-cols-2 gap-6 mb-8 text-left">
        <InfoBlock icon="storefront" title="Zingro">
          Dedicated to connecting home cooks with food lovers and delivering a
          delightful home food experience.
        </InfoBlock>

        <InfoBlock icon="support_agent" title="Customer Care">
          <a
            href={`mailto:${contactInfo.email}`}
            className="hover:text-on-surface transition-colors"
          >
            {contactInfo.email}
          </a>
        </InfoBlock>

        <InfoBlock icon="handshake" title="Business Inquiries">
          <p className="mb-1">
            For partnerships, collaborations and other business-related queries.
          </p>
          <a
            href="mailto:business@zingro.in"
            className="hover:text-on-surface transition-colors"
          >
            business@zingro.in
          </a>
        </InfoBlock>

        <InfoBlock icon="apartment" title="Company Details">
          Zingro is a registered and based in India.
        </InfoBlock>

        <InfoBlock icon="location_on" title="Registered Address">
          {contactInfo.address}
        </InfoBlock>
      </div>

      <nav className="flex flex-wrap gap-x-5 gap-y-2 justify-center border-t border-outline-variant pt-6">
        <button
          onClick={() => setLegal("privacy")}
          className="text-on-surface-variant hover:text-on-surface underline transition-colors"
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setLegal("terms")}
          className="text-on-surface-variant hover:text-on-surface underline transition-colors"
        >
          Terms of Use
        </button>
        <button
          onClick={() => setLegal("chef")}
          className="text-on-surface-variant hover:text-on-surface underline transition-colors"
        >
          Chef Partner Agreement
        </button>
        <button
          onClick={() => setLegal("returns")}
          className="text-on-surface-variant hover:text-on-surface underline transition-colors"
        >
          Returns, Refunds & Cancellation
        </button>
      </nav>

      {legal === "terms" && (
        <LegalModal title="Terms of Use" onClose={() => setLegal(null)}>
          <TermsContent />
        </LegalModal>
      )}
      {legal === "privacy" && (
        <LegalModal title="Privacy Policy" onClose={() => setLegal(null)}>
          <PrivacyContent />
        </LegalModal>
      )}
      {legal === "chef" && (
        <LegalModal
          title="Chef Partner Agreement"
          onClose={() => setLegal(null)}
        >
          <ChefPartnerTermsContent />
        </LegalModal>
      )}
      {legal === "returns" && (
        <LegalModal
          title="Returns, Refunds & Cancellation Policy"
          onClose={() => setLegal(null)}
          scrollToId="annexure-a"
        >
          <TermsContent />
        </LegalModal>
      )}
    </div>
  );
}
