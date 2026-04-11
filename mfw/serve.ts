import index from "./static/index.html";

const server = Bun.serve({
  routes: {
    "/": index,
    "/favicon.ico": Bun.file("./static/favicon.ico"),
    // "/api/status": new Response("OK"),
  },
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);
