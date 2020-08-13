<template>
  <div id="tuition">
    
    <top-navigation />

    <v-main v-if="userProfile.role !== 'Admin'">
      <v-sheet color="info" class="mb-0 px-3 py-2 subtitle-2 white--text">
        <v-layout class="align-center">
          <p class="mb-0">Hanya untuk admin</p>
        </v-layout>
      </v-sheet>
    </v-main>

    <v-main v-else>
      <v-container>
        <v-data-table
          :mobile-breakpoint="Number(0)"
          :headers="headers"
          :items="studentsPaidOff"
          no-data-text="Belum ada pembayaran SPP"
          >
            <template #item.payment="{ value }">
              <v-chip
                v-text="value"
                :class="value === 'Sudah dibayar' ? 'info' : ''"
              />
            </template>
            <template #item.paymentAt="{ value }">
              <span v-if="value && value.seconds" v-text="toDate(value.seconds)" />
            </template>
        </v-data-table>
      </v-container>

      <v-btn
        fab
        fixed
        bottom
        right
        color="primary"
        @click="dialogAdd = true" >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-main>

    <v-dialog
      v-model="dialogAdd"
      max-width="600" >
      <v-card class="pa-4">
        <v-layout>
          <v-text-field
            solo
            flat
            dense
            class="mb-n1"
            background-color="grey lighten-3"
            label="NIS"
            placeholder="Masukkan NIS"
            v-model="search"
          />
          <v-btn
            text
            class="mr-n2"
            color="primary"
            @click="searchStudent()" >
            <span v-text="'Cari'" />
            <v-icon right>
              mdi-magnify
            </v-icon>
          </v-btn>
        </v-layout>

        <v-divider class="mt-n2 mb-2" />

        <v-layout v-if="selectedStudent"
          column >

          <v-layout id="dialog-header"
            class="text--disabled" >
            <div id="title-content">
              Nama
            </div>
            <v-spacer />
            <div id="title-action">
              Pembayaran
            </div>
          </v-layout>

          <v-layout id="dialog-body"
            class="font-weight-bold" >
            <div id="list-content">
              {{ selectedStudent.name }}
            </div>
            <v-spacer />
            <div id="list-action">
              {{ selectedStudent.payment }}
            </div>
          </v-layout>

          <v-divider class="my-2" />

          <v-layout id="dialog-footer">
            <v-spacer />
            <v-btn
              rounded
              :disabled="selectedStudent.payment === 'Sudah dibayar'"
              color="primary"
              class="mt-1 text-none"
              @click="postTuitions()" >
              <span class="ml-2" v-text="'Bayar'" />
              <v-icon class="mx-2">mdi-chevron-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
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
      { text: 'Pembayaran', value: 'payment', align: 'right' },
      { text: 'Tanggal Pembayaran', value: 'paymentAt', align: 'right' },
    ],
    dialogAdd: false,
    search: null,
    selectedStudent: null,
    loading: false
  }),
  computed: {
    ...mapState([
      'userProfile',
      'students',
      'tuitions',
      'tuition',
    ]),
    studentsPaidOff() {
      const students = this.students
      const tuitions = this.tuitions
      
      const arr = []
      students.forEach(s => {
        tuitions.forEach(a => {
          if(a.id === s.id) {
            s.payment = 'Sudah dibayar'
            s.paymentAt = a.createdAt
          } else if (s.payment) {
            
          } else {
            s.payment = 'Belum dibayar'
          }
        })
        arr.push(s)
      })
      return arr
    }
  },
  methods: {
    toDate(value) {
      moment.lang("id")
      return moment.unix(value).format("DD MMMM YYYY")
    },
    getStudents() {
      this.$store.dispatch('getStudents', { user: this.userProfile })
    },
    getTuitions() {
      this.$store.dispatch('getTuitions')
    },
    async getTuition() {
      console.log(this.tuition)
      console.log('search:',  { id: this.search })
      this.$store.dispatch('getTuition', { id: this.search })
    },
    async searchStudent() {
      this.loading = true
      var data = null
      const search = this.search
      const students = this.students
      
      students.forEach(s => {
        if(s.id === search) {
          data = s
        }
      })
      console.log(data)
      this.selectedStudent = data
      this.loading = false
    },
    async postTuitions() {
      let data = {}
      const student = this.selectedStudent
      data.nis = student.id
      data.name = student.name
      await this.$store.dispatch('postTuitions', data)
      this.dialogAdd = false
    }
  },
  watch: {
    userProfile() {
      this.getStudents()
      this.getTuitions()
    },
    dialogAdd() {
      this.$store.commit('setTuition', null)
      this.selectedStudent = null
      this.getTuitions()
    }
  },
  mounted() {
    this.getStudents()
    this.getTuitions()
  }
}
</script>

<style>

</style>