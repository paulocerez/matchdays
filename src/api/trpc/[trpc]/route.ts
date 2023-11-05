import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
<<<<<<< HEAD
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
=======
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
>>>>>>> 3507d6f8bcc20898db1270550cd3d4c28bdc9080
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
