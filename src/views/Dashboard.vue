<template>
  <div id="dashboard">
    <top-navigation />
    <v-main>
      <v-layout
        column
        v-if="userProfile && Object.keys(userProfile).length > 1">
        <v-card class="pa-4">
          Halaman dashboard
        </v-card>
      </v-layout>
    </v-main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TopNavigation from '@/components/Navigation/TopNavigation'
export default {
  components: {
    TopNavigation,
  },
  computed: {
    ...mapState(['userProfile']),
  }
}
</script>

<style>

</style>