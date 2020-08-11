<template>
  <header v-if="showNav">
    <section>
      <v-app-bar app flat dark dense class="primary">
        <v-layout class="align-center">
          <v-app-bar-nav-icon @click="drawer = !drawer" class="ml-n4" />
          <v-card-title class="font-weight-regular">PPDB-PAUD Sang Pemimpin</v-card-title>
          <!-- <v-spacer /> -->
          <!-- <v-avatar color="primary darken-1" size="32" v-if="userProfile && userProfile.name">
            <span class="title white--text">{{ userProfile.name.substr(0,1) }}</span>
          </v-avatar> -->
        </v-layout>
      </v-app-bar>
    </section>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item class="primary">
        <v-list-item-content>
          <v-list-item-title class="title white--text">
            <v-avatar color="primary darken-1" size="48" v-if="userProfile && userProfile.name">
              <span class="title white--text">{{ userProfile.name.substr(0,1) }}</span>
            </v-avatar>
          </v-list-item-title>
          <v-layout
            column
            class="mt-2 white--text" >
            <span class="mb-n1 subtitle-1 font-weight-bold">{{ userProfile.name }}</span>
            <span class="caption font-weight-light" v-if="userProfile.phoneNumber">{{ userProfile.phoneNumber }}</span>
            <span class="caption font-weight-light" v-if="userProfile.email">{{ userProfile.email }}</span>
          </v-layout>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.link"
          active-class="primary--text"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block outlined color="red" @click="logout()">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    drawer: null,
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', link: '/' },
      { title: 'Profil', icon: 'mdi-account-outline', link: '/profil' },
      { title: 'Calon Siswa', icon: 'mdi-account-supervisor-outline', link: '/calonsiswa' },
      { title: 'Nilai Tes', icon: 'mdi-counter', link: '/nilaites' },
      { title: 'Lulus Tes', icon: 'mdi-check', link: '/lulustes' },
      { title: 'Pembayaran SPP', icon: 'mdi-cash', link: '/spp' },
      { title: 'Kelas', icon: 'mdi-account-group', link: '/kelas' },
      // { title: 'About', icon: 'mdi-help-box', link: '/about' },
    ],
  }),
  computed: {
    ...mapState(['userProfile']),
    showNav() {
      return this.userProfile && Object.keys(this.userProfile).length > 1
    }
  },
  methods: {
    drawers() {
      this.$store.state.drawer = true
    },
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style>

</style>