import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

export default function TopAppBar({
  title,
  showBack = false,
  showMenu = false,
  onMenu,
  logo = false,
  right = "translate",
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 w-full bg-surface shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-mobile h-touch-target-min">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              aria-label="Back"
              onClick={() => navigate(-1)}
              className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary active:scale-95 transition-transform"
            >
              <Icon name="arrow_back" />
            </button>
          )}
          {showMenu && (
            <button
              aria-label="Menu"
              onClick={onMenu}
              className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary active:scale-95 transition-transform"
            >
              <Icon name="menu" />
            </button>
          )}
          {logo && (
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
              ZINGRO
            </span>
          )}
          {title && (
            <h1 className="text-headline-md font-headline-md text-on-surface">{title}</h1>
          )}
        </div>
        {right && (
          <button
            aria-label="Language"
            className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary active:scale-95 transition-transform"
          >
            <Icon name={right} />
          </button>
        )}
      </div>
    </header>
  );
}
