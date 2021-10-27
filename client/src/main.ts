import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { initializeApp } from "firebase/app";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

initializeApp({
  apiKey: "AIzaSyC7CJS0wXhMQ3wHqrbACwq30u4pzYsrdko",
  authDomain: "contact-demo-de35f.firebaseapp.com",
  projectId: "contact-demo-de35f",
  storageBucket: "contact-demo-de35f.appspot.com",
  messagingSenderId: "792957368506",
  appId: "1:792957368506:web:4c607dfed23071f86daa83",
  measurementId: "G-NG3DGMWWMR",
});

const app = createApp(App).use(IonicVue).use(router);

router.isReady().then(() => app.mount("#app"));
