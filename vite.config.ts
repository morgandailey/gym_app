import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// Served from GitHub Pages at https://morgandailey.github.io/gym_app/
const base = "/gym_app/";

export default defineConfig({
  base,
  plugins: [
    svelte(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.svg"],
      manifest: {
        id: "/gym_app/",
        name: "Gym App",
        short_name: "Gym App",
        description: "個人訓練記錄與分析",
        start_url: "/gym_app/",
        scope: "/gym_app/",
        display: "standalone",
        background_color: "#0b0b0d",
        theme_color: "#0b0b0d",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
      },
    }),
  ],
  test: {
    // Domain logic is pure functions (see REBUILD_DESIGN §2.4), so no DOM
    // needed for now. Switch to "jsdom" once component tests are added.
    environment: "node",
  },
});
