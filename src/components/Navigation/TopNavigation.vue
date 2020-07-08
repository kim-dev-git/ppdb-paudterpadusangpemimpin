<template>
  <header v-if="showNav">
    <section>
      <v-app-bar app color="white">
        <v-layout class="align-center">
          <v-app-bar-nav-icon @click="drawer = !drawer" class="ml-n2" />
          <v-spacer />
          <v-avatar color="red" size="32">
            <span class="title white--text">{{ userProfile.name.substr(0,1) }}</span>
          </v-avatar>
        </v-layout>
      </v-app-bar>
    </section>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            APEL-Bulog
          </v-list-item-title>
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
      { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/' },
      { title: 'Photos', icon: 'mdi-image', link: '/photo' },
      { title: 'About', icon: 'mdi-help-box', link: '/about' },
    ],
  }),
  computed: {
    ...mapState(['userProfile']),
    showNav() {
      return Object.keys(this.userProfile).length > 1
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