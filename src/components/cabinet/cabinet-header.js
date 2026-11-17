"use client";
import Link from "@/components/ui/app-link";
import { useDemo } from "./demo-provider";
import { BrandLogo } from "@/components/ui/brand-logo";

export function CabinetHeader() {
  const { profile } = useDemo();
  const name = `${profile.name} ${profile.surname}`;
  return (
    <header className="cabinet-header">
      <Link
        className="cabinet-header__logo"
        href="/cabinet"
        aria-label="ADPASS.EVENT — главная кабинета"
      >
        <BrandLogo adaptive />
      </Link>
      <Link href="/cabinet/profile" className="cabinet-header__profile" aria-label={name}>
        <span className="cabinet-header__name">{name}</span>
        <span className="cabinet-header__avatar" aria-hidden="true">
          {profile.name[0]}
          {profile.surname[0]}
        </span>
      </Link>
    </header>
  );
}
