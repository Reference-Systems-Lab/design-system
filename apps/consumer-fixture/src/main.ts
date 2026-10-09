import "@reference-systems-lab/tokens/tokens.css";
import "./style.css";

import { tokens, type TokenId } from "@reference-systems-lab/tokens";
import { createApp } from "vue";

import App from "./App.vue";

// The JS export is typed: a misspelt id fails vue-tsc.
const accent: TokenId = "color.accent";
document.documentElement.dataset.accent = String(tokens.light[accent]);

createApp(App, { label: "Checkout" }).mount("#app");
