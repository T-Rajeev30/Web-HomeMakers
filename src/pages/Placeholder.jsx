import Icon from "../components/Icon";

export default function Placeholder({ title, icon = "construction" }) {
  return (
    <main className="px-margin-mobile pt-20 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-stack-lg">
        <Icon name={icon} className="text-[40px]" />
      </div>
      <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-2">{title}</h2>
      <p className="text-body-md text-on-surface-variant max-w-xs">
        This section is coming soon. We're cooking it up for you.
      </p>
    </main>
  );
}
