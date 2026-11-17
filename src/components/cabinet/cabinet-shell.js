"use client";

import { useRef, useState } from "react";
import { CabinetSidebar } from "./cabinet-sidebar";

export function CabinetShell({ header, children }) {
  const [mode, setMode] = useState("auto");
  const toggleRef = useRef(null);

  function toggle() {
    const compact = window.matchMedia("(max-width: 1199px)").matches;
    setMode((current) =>
      compact
        ? current === "expanded"
          ? "auto"
          : "expanded"
        : current === "collapsed"
          ? "auto"
          : "collapsed",
    );
  }

  function close() {
    setMode((current) => (current === "expanded" ? "auto" : current));
    toggleRef.current?.focus();
  }

  return (
    <div className={`cabinet${mode === "auto" ? "" : ` cabinet--${mode}`}`}>
      {header}
      <div className="cabinet__body">
        <aside className="cabinet__rail">
          <CabinetSidebar mode={mode} onToggle={toggle} onClose={close} toggleRef={toggleRef} />
        </aside>
        {mode === "expanded" && (
          <button
            type="button"
            className="cabinet__backdrop"
            aria-label="Закрыть меню"
            onClick={close}
          />
        )}
        <main className="cabinet__workspace" id="cabinet-main">
          {children}
        </main>
      </div>
    </div>
  );
}
