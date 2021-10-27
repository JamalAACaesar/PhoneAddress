<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Contacts</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="goToCreate">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-searchbar
        v-model="searchTerm"
        @ionChange="loadData"
        animated
      ></ion-searchbar>

      <ion-list>
        <ion-item
          @click="goToEdit(contact._id)"
          v-for="(contact, i) of contacts"
          :key="i"
        >
          <ion-avatar slot="start">
            <img :src="contact.image" />
          </ion-avatar>

          <ion-label>
            {{ contact.firstName }} {{ contact.lastName }}
          </ion-label>

          <ion-button slot="end" @click="goToEdit(contact._id)">
            <ion-icon :icon="pencilSharp" />
            Edit
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, defineComponent } from "vue";
import { add, pencilSharp } from "ionicons/icons";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonButton,
  // IonButtons,

  // IonMenuButton,
  IonItem,
  IonList,
  IonLabel,
  IonAvatar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonSearchbar,
} from "@ionic/vue";

import { Contact } from "../types/contact";

export default defineComponent({
  name: "Contact",

  components: {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonItem,
    IonTitle,
    IonButton,
    // IonButtons,
    IonContent,
    // IonMenuButton,

    IonAvatar,

    IonList,
    IonLabel,

    IonPage,
    IonFab,
    IonFabButton,
    IonSearchbar,
  },

  setup() {
    const searchTerm = ref("");
    const contacts = ref<Contact[]>([]);
    const router = useRouter();

    async function loadData() {
      // let search = "";

      // if (searchTerm.value !== "") {
      //   search = searchTerm.value;
      // }

      const response = await fetch("http://localhost:1337/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: searchTerm.value }),
      });
      const data: Contact[] = await response.json();

      if (data) {
        contacts.value = data;
      }
    }

    onMounted(async () => await loadData());
    // the goToEdit function is used to grab the contact's information.
    function goToEdit(contactId: string) {
      router.push("/contact/" + contactId);
    }
    //the goToCreate function is where it pushes us to the create page to start adding the new user
    function goToCreate() {
      router.push("/create");
    }

    return {
      contacts,
      add,
      pencilSharp,
      goToEdit,
      goToCreate,
      searchTerm,
      loadData,
    };
  },
});
</script>
