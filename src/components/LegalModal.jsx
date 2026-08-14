import Icon from "./Icon";
import LegalDocument from "./LegalDocument";
import termsOfUseHtml from "../data/legal/terms-of-use.html?raw";
import privacyPolicyHtml from "../data/legal/privacy-policy.html?raw";
import chefPartnerTermsHtml from "../data/legal/chef-partner-terms.html?raw";

/** Scrollable modal for Terms / Privacy / Chef Partner content. */
export default function LegalModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-surface w-full sm:max-w-2xl max-h-[88vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-card">
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
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
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

export function TermsContent() {
  return <LegalDocument html={termsOfUseHtml} />;
}

export function PrivacyContent() {
  return <LegalDocument html={privacyPolicyHtml} />;
}

export function ChefPartnerTermsContent() {
  return <LegalDocument html={chefPartnerTermsHtml} />;
}
