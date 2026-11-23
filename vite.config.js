import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              debugName: "dependencias",
              name(id) {
                if (
                  /node_modules\/(react|react-dom|react-router|scheduler)\//.test(
                    id,
                  )
                )
                  return "react-vendor";
                if (/node_modules\/(@apollo|rxjs|graphql)\//.test(id))
                  return "graphql-vendor";
              },
            },
          ],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    include: ["tests/**/*.test.{js,jsx}"],
    clearMocks: true,
  },
});
