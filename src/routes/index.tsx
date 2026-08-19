import { createFileRoute, redirect } from "@tanstack/react-router";

// The whole BookSwap project is plain HTML/CSS/JavaScript inside public/bookswap.
// Opening "/" simply sends the visitor to that static homepage.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/bookswap/index.html" });
  },
  head: () => ({
    meta: [
      { title: "BookSwap — Online Book Exchange Platform" },
      {
        name: "description",
        content: "Buy, sell and exchange college textbooks with other students on BookSwap.",
      },
      { property: "og:title", content: "BookSwap — Online Book Exchange Platform" },
      {
        property: "og:description",
        content: "Buy, sell and exchange college textbooks with other students on BookSwap.",
      },
    ],
  }),
  component: () => null,
});
