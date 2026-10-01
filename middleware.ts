import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/config";

export default createMiddleware(routing);

export const config = {
  // Every page path except API routes, Next internals, Vercel internals and files with an extension
  // (needed for unprefixed pt routes like /contratar and /projetos/orbita under localePrefix "as-needed").
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
