import { useState } from "react";
import Icon from "./Icon";
import LegalModal, {
  TermsContent,
  PrivacyContent,
  ChefPartnerTermsContent,
} from "./LegalModal";
import { contactInfo } from "../data/mock";

/**
 * Mandatory e-commerce disclosures (legal entity, address, grievance
 * officer, customer care, legal document links). See compliance review
 * notes — several fields below are placeholders that MUST be filled with
 * real values before this ships; they're deliberately visible/obvious
 * rather than silently blank so nobody mistakes them for real data.
 */
export default function ComplianceFooter({ className = "" }) {
  const [legal, setLegal] = useState(null); // "terms" | "privacy" | "chef" | "returns" | null

  return (
    <div className={`text-sm ${className}`}>
      <div className="grid sm:grid-cols-2 gap-6 mb-8 text-left">
        <div>
          <p className="font-semibold text-on-surface mb-1">Zingro</p>
          <p className="text-on-surface-variant leading-relaxed">
            Operated by Kiran Kumar K (sole proprietorship)
            <br />
            {/* TODO: replace with the actual registered/principal office
                address, and list branch addresses if any exist. */}
            [Registered office address — add before launch], Bengaluru,
            Karnataka, India
          </p>
        </div>

        <div>
          <p className="font-semibold text-on-surface mb-1">Customer Care</p>
          <div className="flex flex-col gap-1 text-on-surface-variant">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 hover:text-on-surface transition-colors"
            >
              <Icon name="mail" className="text-[16px]" /> {contactInfo.email}
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-2 hover:text-on-surface transition-colors"
            >
              <Icon name="call" className="text-[16px]" /> {contactInfo.phone}
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-on-surface mb-1">
            Grievance Officer
          </p>
          {/* TODO: real name, designation, email, and phone are required
              here — DPDP Act / Consumer Protection Rules mandate this be
              a named individual, not just "Support". */}
          <p className="text-on-surface-variant leading-relaxed">
            [Grievance Officer name & designation — add before launch]
            <br />
            [Grievance Officer email/phone — add before launch]
          </p>
        </div>

        <div>
          <p className="font-semibold text-on-surface mb-1">Company Details</p>
          <p className="text-on-surface-variant leading-relaxed">
            Sole proprietorship — CIN not applicable
          </p>
        </div>
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
