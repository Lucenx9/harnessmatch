import Image from "next/image";
import type { HarnessLogo as HarnessLogoData } from "@/lib/types";

type HarnessLogoProps = {
  logo: HarnessLogoData;
  name: string;
  size?: "small" | "medium" | "large";
  priority?: boolean;
};

const dimensions = {
  small: 32,
  medium: 44,
  large: 72,
} as const;

export function HarnessLogo({ logo, name, size = "medium", priority = false }: HarnessLogoProps) {
  const dimension = dimensions[size];

  return (
    <span className={`harness-logo harness-logo-${size}`} title={`${name} logo`}>
      <Image
        src={logo.src}
        alt=""
        aria-hidden="true"
        width={dimension}
        height={dimension}
        priority={priority}
      />
    </span>
  );
}
