import { CabinetHeader } from "@/components/cabinet/cabinet-header";
import { CabinetShell } from "@/components/cabinet/cabinet-shell";
import { DemoProvider } from "@/components/cabinet/demo-provider";
import "./cabinet.css";
import "./sections.css";

export default function CabinetLayout({ children }) {
  return (
    <DemoProvider>
      <CabinetShell header={<CabinetHeader />}>{children}</CabinetShell>
    </DemoProvider>
  );
}
