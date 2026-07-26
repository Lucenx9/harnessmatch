import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const exportedSite = resolve(root, "out");
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(server, { recursive: true });
await cp(exportedSite, client, { recursive: true });

const worker = `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);

    if (response.status !== 404 || /\\.[^/]+$/.test(url.pathname)) {
      return response;
    }

    const htmlUrl = new URL(request.url);
    htmlUrl.pathname = \`${"${url.pathname.replace(/\\/$/, \"\") || \"/index\"}"}.html\`;
    return env.ASSETS.fetch(new Request(htmlUrl, request));
  },
};

export default worker;
`;

await writeFile(resolve(server, "index.js"), worker);
