<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon slot="icon-only" :icon="arrowBackSharp"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
          <ion-button @click="presentDeleteSheet">
            <ion-icon slot="icon-only" :icon="removeCircleSharp"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>
          {{ fullname }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- This is where the user's information will be layed out in terms of the first name and their last name as well
 -->
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>
            {{ fullname }}
          </ion-card-subtitle>
          <ion-card-title>Make Changes</ion-card-title>
        </ion-card-header>

        <ion-card-content v-if="input">
          <ion-item>
            <ion-avatar slot="start">
              <ion-thumbnail>
                <ion-img :src="imagePreview"></ion-img>
              </ion-thumbnail>
            </ion-avatar>

            <ion-input
              type="file"
              name="image"
              ref="image"
              @change="onFileChange"
              accept="image/*"
              capture
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">First Name</ion-label>
            <ion-input v-model="input.firstName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Last Name</ion-label>
            <ion-input v-model="input.lastName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="input.email"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Phone</ion-label>
            <ion-input v-model="input.phone"></ion-input>
          </ion-item>

          <ion-button
            :disabled="disallowSave()"
            @click="makeChanges"
            style="margin: 1rem auto"
            expand="block"
            color="danger"
            shape="round"
            slot="end"
          >
            Save
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch, computed, onMounted, defineComponent } from "vue";

import {
  IonIcon,
  IonLabel,
  IonInput,
  IonItem,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonPage,
  IonHeader,
  IonButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonAvatar,
  IonThumbnail,
  IonImg,
  actionSheetController,
  toastController,
} from "@ionic/vue";

import {
  arrowBackSharp,
  removeCircleSharp,
  trash,
  close,
} from "ionicons/icons";

import {
  ref as storageRef,
  getStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Contact } from "../types/contact";

export default defineComponent({
  components: {
    IonIcon,

    IonLabel,
    IonInput,

    IonItem,
    IonContent,

    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,

    IonPage,

    IonButton,
    IonButtons,

    IonHeader,
    IonToolbar,

    IonTitle,

    IonAvatar,
    IonThumbnail,
    IonImg,
  },

  setup() {
    const input = ref<Contact>();
    const contact = ref<Contact>();
    const router = useRouter();
    const route = useRoute();

    const contactId = route.params.id;

    const imageFile = ref<any>();
    const imagePreview = ref<string>(
      "https://ionicframework.com/docs/demos/api/avatar/avatar.svg"
    );

    const fullname = computed(() => {
      if (!contact.value) return "";

      return `${contact.value.firstName} ${contact.value.lastName}`;
    });

    async function loadData() {
      // fetch contact data from API
      const response = await fetch(
        `http://localhost:1337/contacts/${contactId}`
      );
      const data: Contact = await response.json();

      if (data && data.firstName) {
        contact.value = data;

        if (contact.value.image) {
          imagePreview.value = contact.value.image;
        }

        input.value = Object.assign({}, data);
      }
    }

    watch(
      () => contactId,
      () => loadData()
    );

    // onMounted() runs when the pages first loads
    /**
     * onMounted(() => {
     * do whatever now the page is loaded
     * })
     */
    onMounted(() => loadData());

    async function handleUpload() {
      if (!imageFile.value) return;

      const storage = getStorage();

      const imageRef = storageRef(storage, "images/" + imageFile.value.name);

      const snapshot = await uploadBytes(imageRef, imageFile.value);

      return await getDownloadURL(snapshot.ref);
    }

    async function makeChanges() {
      if (imageFile.value) {
        const imageUrl = await handleUpload();

        if (imageUrl) {
          input.value!.image = imageUrl;
        }
      }
      // updating the contact
      const response = await fetch(
        `http://localhost:1337/contacts/${contactId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input.value),
        }
      );

      const data = await response.json();

      if (data) {
        if (data.status) loadData();

        const message = data.status ? data.error : data.message;

        const toast = await toastController.create({
          message,
          duration: 2000,
        });
        toast.present();
      }
    }

    // handles navigation to the previous page
    function goBack() {
      if (route.redirectedFrom != null) {
        router.back();
      } else {
        router.push("/");
      }
    }

    // prevent pressing the save button if there are no changes
    // checks if the input differs from the contact loaded for this pages
    const disallowSave = () => input.value === contact.value;

    const handleDelete = async () => {
      const response = await fetch(
        `http://localhost:1337/contacts/${contactId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data) {
        const message = data.status ? data.error : data.message;

        const toast = await toastController.create({
          message,
          duration: 2000,
        });

        toast.present();

        if (data.status) router.replace({ path: "/" });
      }
    };
    // birings up a prompt to either confirm or cancel deletion of a contact
    async function presentDeleteSheet() {
      const actionSheet = await actionSheetController.create({
        header: "Manage Contact",
        buttons: [
          {
            text: "Delete Contact",
            role: "destructive",
            icon: trash,
            handler: handleDelete,
          },
          {
            text: "Cancel",
            icon: close,
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
        ],
      });
      await actionSheet.present();

      const { role } = await actionSheet.onDidDismiss();
    }

    function onFileChange(e: any) {
      const file: File = e.target.files[0];

      imageFile.value = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        imagePreview.value = reader.result as any;
      });
    }

    return {
      goBack,

      input,
      contact,
      fullname,

      disallowSave,
      makeChanges,

      presentDeleteSheet,

      arrowBackSharp,
      removeCircleSharp,

      imagePreview,
      onFileChange,
    };
  },
});
</script>
