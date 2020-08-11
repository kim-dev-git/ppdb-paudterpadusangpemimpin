<template>
  <div id="group">
    
    <top-navigation />

    <v-main>
      <v-container>
        <v-layout>
          <v-spacer />
          <v-btn
            outlined
            class="text-none"
            @click="dialogFilter = true" >
            <v-icon left class="text--secondary">mdi-filter</v-icon>
            <span v-text="selectedGroup ? selectedGroup : 'Filter berdasarkan kelas'" />
          </v-btn>
        </v-layout>
        <v-text-field 
          solo
          flat
          label="Cari siswa"
          placeholder="Gunakan NIS atau Nama untuk mencari Siswa"
          background-color="grey lighten-3"
          prepend-inner-icon="mdi-magnify"
          class="mt-4"
          v-model="search"
        />
        <v-data-table
          no-data-text="Belum ada siswa"
          :mobile-breakpoint="Number(0)"
          :headers="headers"
          :items="studentsByClass"
          :search="search" >

        </v-data-table>
      </v-container>
    </v-main>

    <v-dialog
      max-width="400"
      v-model="dialogFilter">
      <v-card class="pa-4">
        <v-list>
          <v-list-item-group>
            <v-list-item @click="selectedGroup = null, dialogFilter = false">
              <v-list-item-content>
                <span v-text="'Tampilkan Semua'" />
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="group in groups" :key="group" @click="selectedGroup = group, dialogFilter = false">
              <v-list-item-content>
                <span v-text="group" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>  
    </v-dialog>

  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import TopNavigation from '@/components/Navigation/TopNavigation'
export default {
  components: {
    TopNavigation,
  },
  data: () => ({
    headers: [
      { text: 'NIS', value: 'id' },
      { text: 'Nama', value: 'name' },
      { text: 'Kelas', value: 'group' },
    ],
    groups: [
      'KB A',
      'KB 1',
      'KB 2',
      'TK. A1/2',
      'TK. A3/4',
      'TK. B1/2',
      'TK. B3/4',
      'TK. B5/6',
    ],
    dialogFilter: null,
    selectedGroup: null,
    search: null,
  }),
  computed: {
    ...mapState([
      'userProfile',
      'students',
    ]),
    studentsByClass() {
      const students = this.students
      const group = this.selectedGroup
      if(group) {
        return students.filter(s => s.group === group)
      } else {
        return students
      }
    }
  },
  methods: {
    getStudents() {
      this.$store.dispatch('getStudents', { user: this.userProfile })
    },
  },
  watch: {
    userProfile() {
      this.getStudents()
    }
  },
  mounted() {
    this.getStudents()
  }

}
</script>

<style>

</style>