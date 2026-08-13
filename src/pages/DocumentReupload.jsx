import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { reuploadDocs } from "../data/mock";
import { setVerification } from "../store/useSession";
import { BRAND_GRADIENT } from "../lib/brand";

export default function DocumentReupload() {
  const [uploaded, setUploaded] = useState({});
  const navigate = useNavigate();
  const toggle = (id) => setUploaded((u) => ({ ...u, [id]: !u[id] }));

  const total = reuploadDocs.length;
  const doneCount = Object.values(uploaded).filter(Boolean).length;
  const allDone = total > 0 && doneCount === total;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopAppBar showBack title="Re-upload Documents" />
      <main className="flex-1 px-margin-mobile pt-stack-md pb-32 animate-fade-in">
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="upload_file" className="text-white text-[26px]" />
          </div>
          <div>
            <p className="text-body-md text-on-surface-variant">
              Please upload the correct documents.
            </p>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">
              {doneCount}/{total} uploaded
            </p>
          </div>
        </div>

        <section className="flex flex-col gap-stack-md">
          {reuploadDocs.map((doc) => {
            const done = uploaded[doc.id];
            return (
              <button
                key={doc.id}
                onClick={() => toggle(doc.id)}
                className={`relative flex items-center justify-between gap-3 p-4 bg-surface-container-lowest rounded-lg shadow-card transition-all text-left ${
                  done
                    ? ""
                    : doc.flagged
                      ? "border border-error/40"
                      : "border border-outline-variant"
                }`}
                style={
                  done
                    ? {
                        border: "2px solid transparent",
                        backgroundImage: `linear-gradient(var(--surface-container-lowest, #fff), var(--surface-container-lowest, #fff)), ${BRAND_GRADIENT}`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                    <Icon name={doc.icon} />
                  </div>
                  <p className="font-semibold text-body-md text-on-surface">
                    {doc.title}
                  </p>
                </div>
                {done ? (
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    <Icon name="check" className="text-white text-[16px]" />
                  </span>
                ) : (
                  <Icon name="upload" className="text-[28px] text-outline" />
                )}
              </button>
            );
          })}
        </section>

        <div className="fixed bottom-6 left-0 right-0 px-margin-mobile">
          <Button
            full
            disabled={!allDone}
            onClick={() => {
              setVerification("submitted");
              navigate("/verification-submitted");
            }}
          >
            {allDone
              ? "Resubmit for Verification"
              : `Upload ${total - doneCount} more to continue`}
          </Button>
        </div>
      </main>
    </div>
  );
}
