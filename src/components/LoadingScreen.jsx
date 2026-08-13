export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full opacity-25 blur-[100px] animate-pulse-slow"
          style={{
            background:
              "conic-gradient(from 180deg, #FA8C0A, #F05A64, #E63C78, #7832F0, #FA8C0A)",
          }}
        />
      </div>

      <img
        src="/logo.png"
        alt="Zingro"
        className="relative w-64 sm:w-72 object-contain animate-logo-in"
      />

      <div className="relative mt-8 w-40 h-1 rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-full w-1/2 rounded-full animate-loading-sweep"
          style={{
            background:
              "linear-gradient(90deg, #FA8C0A, #F05A64, #E63C78, #7832F0)",
          }}
        />
      </div>

      <p className="absolute bottom-8 text-xs sm:text-sm font-semibold text-black/70">
        © {new Date().getFullYear()} Zingro™. All rights reserved.
      </p>
    </div>
  );
}
