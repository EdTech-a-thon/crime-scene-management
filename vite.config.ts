import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [".exe.xyz", ".edtechathon.com"],
    proxy: {
      "/api": "http://127.0.0.1:8090",
      "/_/": "http://127.0.0.1:8090",
    },
  },
});
