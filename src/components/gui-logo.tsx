import Image from "next/image";
import type { GuiLogo as GuiLogoData } from "@/lib/gui-types";

type GuiLogoProps = {
  logo: GuiLogoData;
  name: string;
  size?: "small" | "large";
  priority?: boolean;
};

const dimensions = {
  small: 42,
  large: 72,
} as const;

export function GuiLogo({ logo, name, size = "small", priority = false }: GuiLogoProps) {
  const dimension = dimensions[size];

  return (
    <span className={`gui-logo gui-logo--${size}`} title={`${name} logo`}>
      <Image
        src={logo.src}
        alt=""
        aria-hidden="true"
        width={dimension}
        height={dimension}
        priority={priority}
        loading={size === "small" ? "eager" : undefined}
      />
    </span>
  );
}
