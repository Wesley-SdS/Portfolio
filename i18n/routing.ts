import { createNavigation } from "next-intl/navigation";
import { routing } from "./config";

export { routing };

// Lightweight wrappers around Next.js' navigation APIs that follow the routing config
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
