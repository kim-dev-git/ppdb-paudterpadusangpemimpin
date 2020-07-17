<template>
  <div id="profile">
    <v-app-bar
      app
      flat
      dense
      color="primary"
      dark >
      <v-btn
        to="/"
        icon>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>
        Profil
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-layout column>
        <v-list two-line subheader>
          <v-subheader class="primary--text subtitle-2">Akun</v-subheader>
          <v-list-item @click="dialog = true">
            <v-list-item-content>
              <v-list-item-title>
                {{ userProfile.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 caption">
                Tap untuk mengganti nama
              </v-list-item-subtitle>
              <v-divider class="mt-2 mb-n3" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>
    </v-main>

    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-model="dialog" >
      <v-card>
        <v-toolbar
          dark dense flat tile color="primary">
          <v-layout
            class="align-center">
            <v-btn
              @click="dialog = false"
              icon class="ml-n2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-card-title class="font-weight-regular">Nama</v-card-title>
            <v-spacer />
            <v-btn  
              @click="changeName()"
              icon class="text-none mr-n2">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-layout>
        </v-toolbar>
        <v-layout
          column
          class="px-4">
          <v-text-field placeholder="Nama Anda" v-model="name" />
          <p class="mt-n2 text--secondary body-2">Nama untuk pemilik No HP, bukan untuk <b>nama calon siswa</b></p>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { mapState } from 'vuex'
export default {
  data: () => ({
    dialog: false,
    name: null
  }),
  computed: {
    ...mapState(['userProfile']),
  },
  methods: {
    changeName() {
      this.$store.dispatch('changeName', { user: this.userProfile, name: this.name })
      this.dialog = false
    }
  },
  watch: {
    userProfile() {
      if(!this.userProfile.name) {
        this.dialog = true
      }
    }
  },
  mounted() {
    if(!this.userProfile.name) {
      this.dialog = true
    } else {
      this.name = this.userProfile.name
    }
  }
}
</script>

<style>

</style>