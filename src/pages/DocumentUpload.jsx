import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { documents } from "../data/mock";

export default function DocumentUpload() {
  const [uploaded, setUploaded] = useState({});
  const navigate = useNavigate();
  const toggle = (id) => setUploaded((u) => ({ ...u, [id]: !u[id] }));

  return (
    <OnboardingLayout step={7} stepLabel="Document Upload">
      <p className="text-on-surface-variant text-body-md mb-stack-lg">
        We need a few documents to verify your kitchen and start your business journey.
      </p>

      <section className="flex flex-col gap-stack-md">
        {documents.map((doc) => {
          const done = uploaded[doc.id];
          return (
            <button
              key={doc.id}
              onClick={() => toggle(doc.id)}
              className={`flex items-center justify-between gap-3 p-4 bg-surface-container-lowest rounded-lg border shadow-card transition-all text-left ${
                done ? "border-primary" : "border-outline-variant hover:border-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                  <Icon name={doc.icon} />
                </div>
                <div>
                  <p className="font-semibold text-body-md text-on-surface">{doc.title}</p>
                  <p className="text-label-sm text-on-surface-variant">{doc.sub}</p>
                </div>
              </div>
              <Icon
                name={done ? "check_circle" : "add_circle"}
                fill={done}
                className={`text-[32px] ${done ? "text-primary" : "text-outline"}`}
              />
            </button>
          );
        })}
      </section>

      <div className="mt-stack-lg">
        <Button full icon="arrow_forward" onClick={() => navigate("/dashboard")}>
          Submit for Verification
        </Button>
      </div>
    </OnboardingLayout>
  );
}
