type LogoProps = {
  isSidebarCollapsed?: boolean;
};

export const Logo = ({ isSidebarCollapsed = false }: LogoProps) => {
  return (
    <>
      <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512" aria-hidden="true">
          <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 24.6 33.9 0L329 305z" />
        </svg>
      </div>

      <span
        className="font-bold text-2xl tracking-tight text-white transition-all duration-200 overflow-hidden whitespace-nowrap"
        style={{
          maxWidth: isSidebarCollapsed ? 0 : 120,
          opacity: isSidebarCollapsed ? 0 : 1,
        }}
      >
        Timefy
      </span>
    </>
  );
};
