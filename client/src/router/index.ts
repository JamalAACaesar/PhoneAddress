import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";


//These are the parts of the code that helps to contact a new page
//The / is everything, the /create goes to the create.vue page
//And the /contact/:id is grabbing the ID of the contact we clicked into thus it grabs all their information
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/Contacts.vue"),
  },
  {
    path: "/create",
    component: () => import("@/views/Create.vue"),    
  },
  {
    path: "/contact/:id",
    component: () => import("@/views/ViewContact.vue"),    
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
