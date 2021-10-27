<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon slot="icon-only" :icon="arrowBackSharp"></ion-icon>
          </ion-button>
        </ion-buttons>
        <!-- The plus sign in the bottom right corner of the app is where we click for the additional users to be added to the database
        Once added they will show up on the home page as contacts -->
        <ion-title>Create Contact</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Add New Contact</ion-card-title>
        </ion-card-header>

        <ion-card-content>
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
            <ion-input v-model="contact.firstName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Last Name</ion-label>
            <ion-input v-model="contact.lastName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="contact.email"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Phone</ion-label>
            <ion-input v-model="contact.phone"></ion-input>
          </ion-item>

          <ion-button
            @click="createContact"
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
import { useRouter, useRoute } from "vue-router";
import { ref, defineComponent } from "vue";
import { Contact } from "../types/contact";

import {
  IonIcon,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonAvatar,
  IonThumbnail,
  IonImg,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  toastController,
} from "@ionic/vue";

import { arrowBackSharp } from "ionicons/icons";

import {
  ref as storageRef,
  getStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default defineComponent({
  components: {
    IonIcon,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonAvatar,
    IonThumbnail,
    IonImg,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const contact = ref({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      image: null as string | null,
    });

    const imageFile = ref<any>();
    const imagePreview = ref<string>(
      "https://ionicframework.com/docs/demos/api/avatar/avatar.svg"
    );

    async function handleUpload() {
      if (!imageFile.value) return;

      const storage = getStorage();

      const imageRef = storageRef(storage, "images/" + imageFile.value.name);

      const snapshot = await uploadBytes(imageRef, imageFile.value);

      return await getDownloadURL(snapshot.ref);
    }

    async function createContact() {
      if (imageFile.value) {
        const imageUrl = await handleUpload();

        if (imageUrl) {
          contact.value.image = imageUrl;
        }
      }

      const res = await fetch("http://localhost:1337/contacts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact.value),
      });
      const data = await res.json();

      if (data) {
        const message = data.status ? data.error : data.message;

        const toast = await toastController.create({
          message,
          duration: 2000,
        });
        toast.present();
      }
    }

    const goToHome = () => router.push("/");

    function goBack() {
      if (route.redirectedFrom != null) {
        router.back();
      } else {
        router.push("/");
      }
    }

    const requireFields = () => {
      return (
        !contact.value.firstName ||
        !contact.value.lastName ||
        !contact.value.email ||
        !contact.value.phone
      );
    };

    // handles file change event, and "imageFile" from the event target files
    // also sets the imagePreview to the data url of the selected image
    function onFileChange(event: any) {
      const file: File = event.target.files[0];

      imageFile.value = file;

      const reader = new FileReader();

      // attempt to read the file as a data url that we  can then use to display a preview in the UI
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        //  sets image preview to the result of the file reader above
        imagePreview.value = reader.result as any;
      });
    }

    return {
      arrowBackSharp,

      goToHome,

      contact,
      imagePreview,
      createContact,

      requireFields,

      goBack,

      onFileChange,
    };
  },
});
</script>
