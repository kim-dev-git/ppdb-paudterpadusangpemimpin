<template>
  <div id="login">
    <v-app-bar
      app flat dark dense class="primary" >
      <v-layout class="ml-n3 align-center">
        <v-card-title class="font-weight-regular">PPDB-PAUD Sang Pemimpin</v-card-title>
      </v-layout>
    </v-app-bar>

    <section
      class="pt-4 mt-12">
      <v-container>
        <!-- <p class="mb-2 text-center headline">PPDB-PAUD Terpadu Sang Pemimpin</p> -->
        <v-layout class="justify-center">
          <img alt="Logo" src="../assets/logo.png">
        </v-layout>
        <p class="my-0 text-center title">Masuk</p>
        <p class="my-0 text-center body-2">menggunakan Email</p>
        <v-layout
          column class="mt-6 px-2">
          <v-text-field type="email" label="Email" v-model.trim="loginForm.email" placeholder="Masukkan email anda" class="mb-n2" />
          <v-text-field type="password" label="Password" v-model.trim="loginForm.password" placeholder="Masukkan password anda" class="mb-n4" />
        </v-layout>
        
        <div id="recaptcha-container" />

        <v-footer
          absolute
          padless
          class="pb-4 font-weight-medium white"
        >
          <v-layout
            class="px-4 body-2 text--secondary align-center">
            Belum punya akun?
            <v-btn text @click="dialog = true" class="text-none ml-n2" color="primary">Daftar</v-btn>
          </v-layout>
          <v-layout
            class="pl-2 pr-6 bottom align-center">
            <v-btn
              text
              color="primary"
              class="ml-n2 text-none"
              to="/login" >
              Login sebagai pendaftar
            </v-btn>
            <v-spacer />
            <v-btn @click="login()"
              icon large color="white" class="primary">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-layout>
        </v-footer>
      </v-container>
    </section>
    
    

    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-model="dialog">
      <v-card>
        <v-toolbar
          dark tile color="primary">
          <v-layout
            class="align-center">
            <v-btn
              @click="dialog = false"
              icon class="ml-n2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <p class="ml-4 mb-0 title">Daftar akun admin</p>
          </v-layout>
        </v-toolbar>
        <v-layout column class="pa-4 justify-center">
          <v-text-field type="text" label="Nama" v-model.trim="signupForm.name" placeholder="Masukkan nama anda" class="mb-n2" />
          <v-text-field type="email" label="Email" v-model.trim="signupForm.email" placeholder="Masukkan email anda" class="mb-n2" />
          <v-text-field type="password" label="Password" v-model.trim="signupForm.password" placeholder="Masukkan password anda" class="mb-n4" />
        </v-layout>

        <v-footer
          absolute
          padless
          class="pb-4 font-weight-medium white"
        >
          <v-layout
            class="pl-2 pr-6 bottom align-center">
            <v-spacer />
            <v-btn @click="signup()"
              icon large color="white" class="primary">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-layout>
        </v-footer>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { auth, db } from '@/firebase'
export default {
  data: () => ({
    dialog: false,
    name: '',
    loginForm: {},
    signupForm: {},
  }),
  computed: {
    userProfile() { return this.$store.state.userProfile }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    signup() {
      this.$store.dispatch('signup', {
        name: this.signupForm.name,
        email: this.signupForm.email,
        password: this.signupForm.password,
      })
    }
  },
  mounted() {
    if (this.userProfile) {
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped>
  .centered-input >>> input {
    text-align: center !important;
  }
</style>