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
          :items="tuitions"
          sort-by="createdAt"
          no-data-text="Belum ada pembayaran SPP"
          >
            <template #item.spp="{ value }">
              <span v-text="'Rp. ' + value" />
            </template>
            <template #item.createdAt="{ value }">
              <span v-if="value && value.seconds" v-text="toDate(value.seconds)" />
            </template>
            <template #item.action="{ item }">
              <v-btn icon @click="print(item)">
                <v-icon>mdi-printer</v-icon>
              </v-btn>
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

    <v-dialog id="dialog-add"
      persistent
      v-model="dialogAdd"
      max-width="600" >
      <v-card class="pa-4">
        <v-btn text class="ml-n4 mt-n2 mb-2 text-none" @click="dialogAdd = false">
          <v-icon color="grey">mdi-close</v-icon>
          <span class="ml-2 text--secondary" v-text="'Tutup'" />
        </v-btn>

        <v-layout id="dialog-add-search">
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
              Kelas
            </div>
          </v-layout>

          <v-layout id="dialog-body"
            class="font-weight-bold" >
            <div id="list-content">
              {{ selectedStudent.name }}
            </div>
            <v-spacer />
            <div id="list-action">
              {{ selectedStudent.group }}
            </div>
          </v-layout>

          <v-divider class="my-2" />

          <v-layout id="dialog-list-header"
            v-if="tuition"
            class="text--disabled" >
            <div id="title-content">
              Bulan
            </div>
            <v-spacer />
            <div id="title-action">
              Pembayaran
            </div>
          </v-layout>

          <v-layout id="dialog-list-data"
            column v-if="tuition">
            <v-list v-if="tuitionCount > 0"
              class="mx-n4" >
              <v-list-item-group>
                <v-list-item v-for="item in tuition" :key="item.id">
                  <v-list-item-content>
                    <v-layout>
                    <div>
                      <p class="mb-0 subtitle-2" v-text="item.month" />
                      <p class="mb-0 subtitle-2 text--secondary" v-text="item.year" />
                    </div>
                    <v-spacer />
                    <div>
                      <p class="text-right mb-0 subtitle-2" v-text="'Rp. ' + item.spp" />
                      <p class="text-right mb-0 subtitle-2 text--secondary" v-text="toDate(item.createdAt.seconds)" />
                    </div>
                    <div>
                      <v-btn icon @click="print(item)">
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                    </div>
                    </v-layout>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-else>
              Belum ada pembayaran
            </div>
          </v-layout>

          <v-divider class="my-2" />

          <v-layout id="dialog-footer">
            <v-spacer />
            <v-btn
              rounded
              color="primary"
              class="mt-1 text-none"
              @click="dialogPay = true" >
              <span class="ml-2" v-text="'Bayar'" />
              <v-icon class="mx-2">mdi-chevron-right</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog id="dialog-pay"
      v-model="dialogPay"
      max-width="400" >
      <v-card class="pa-4">
        <v-btn id="btn-dialog-pay-close"
          text class="ml-n4 mt-n2 mb-2 text-none" @click="dialogPay = false">
          <v-icon color="grey">mdi-close</v-icon>
          <span class="ml-2 text--secondary" v-text="'Tutup'" />
        </v-btn>
        <v-combobox id="input-year"
          solo
          flat
          background-color="grey lighten-3"
          label="Pilih tahun"
          :items="years"
          v-model="year"
          class="mb-n2"
        />
        <v-combobox id="input-month"
          solo
          flat
          background-color="grey lighten-3"
          label="Pilih bulan"
          :items="months"
          v-model="month"
          class="mb-n2"
        />
        <v-text-field id="input-spp"
          solo
          flat
          type="number"
          prefix="Rp. "
          hint="Jangan gunakan titik (.) atau koma (,)"
          background-color="grey lighten-3"
          label="Biaya SPP"
          v-model="spp"
          class="mb-n2"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn id="btn-dialog-pay-action"
            :disabled="month === null || year === null || spp === null"
            rounded
            color="primary"
            class="mt-1 text-none"
            @click="payTuition()" >
            <span class="ml-2" v-text="'Bayar SPP'" />
            <v-icon class="mx-2">mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>

import logo from '@/assets/logo.js'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import TopNavigation from '@/components/Navigation/TopNavigation'
export default {
  components: {
    TopNavigation,
  },
  data: () => ({
    headers: [
      { text: 'NIS', value: 'nis' },
      { text: 'Nama', value: 'name' },
      { text: 'Kelas', value: 'group' },
      { text: 'Tahun', value: 'year', align: 'right' },
      { text: 'Bulan', value: 'month', align: 'right' },
      { text: 'SPP', value: 'spp', align: 'right' },
      { text: 'Tanggal Pembayaran', value: 'createdAt', align: 'right' },
      { text: '', value: 'action' },
    ],
    headersPrint: [
      { header: 'Bulan', dataKey: 'month' },
      { header: 'Tahun', dataKey: 'year' },
      { header: 'SPP', dataKey: 'spp', align: 'right' },
    ],
    bodyPrint: [
      { month: 'Agustus', year: '2020', spp: '450000' }
    ],
    dialogAdd: false,
    dialogPay: false,
    search: null,
    selectedStudent: null,
    loading: false,
    month: null,
    year: null,
    spp: null,
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
    },
    tuitionCount() {
      const tuition = this.tuition
      let count
      if(tuition) {
        var res = tuition.filter(val => {
            return val.id
        })
        count = res.length
      } else {
        count = 0
      }
      return count
    },
    months() {
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
      ]
      return months
    },
    years() {
      var years = []
      var currentYear = Number(new Date().getFullYear())
      for (var i = 0; i < 3; i++) {
        years.push(currentYear)
        currentYear--
      }
      return years
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
      // console.log(data)
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
    },
    async payTuition() {
      let data = {}
      data.nis = this.selectedStudent.id
      data.name = this.selectedStudent.name
      data.group = this.selectedStudent.group
      data.month = this.month
      data.year = this.year
      data.spp = this.spp
      await this.$store.dispatch('postTuitions', data)
      await this.getTuition()
      this.dialogPay = false
    },
    async getTuition() {
      const nis = this.search
      this.loading = true
      await this.$store.dispatch('getTuition', { nis })
      this.loading = false
    },
    print(item) {
      var doc = new jsPDF()
      const imgData = logo
      
      doc.addImage(imgData, "JPEG", 10, 22, null, null)
      doc.setFontSize("20")
      // doc.setFontStyle("bold")
      doc.text("Nota Pembayaran SPP", 105, 20, null, null, "center")
      doc.setFontSize("14")
      // doc.setFontStyle("normal")
      doc.text("Jl. Keramat Raya No.01, RT.18", 105, 27, null, null, "center")
      doc.text("Sungai Bilu, Banjarmasin", 105, 33, null, null, "center")
      doc.setFontSize("12")
      doc.text("Kontak: 081256361363", 105, 39, null, null, "center")
      doc.line(10, 46, 200, 46)
      doc.text("NIS", 14, 56, null, null)
      doc.text(`: ${ item.nis }`, 32, 56, null, null)
      doc.text("Nama", 14, 62, null, null)
      doc.text(`: ${ item.name }`, 32, 62, null, null)
      doc.text("Kelas", 14, 68, null, null)
      doc.text(`: ${ item.group }`, 32, 68, null, null)
      var body = [ item ]
      var tempSPP = item.spp
      body[0].spp = 'Rp. ' + body[0].spp
      doc.autoTable({
        startY: 73,
        columns: this.headersPrint,
        body: body
      })
      let finalY = doc.autoTable.previous.finalY
      moment.lang("id")
      let currentDate = moment.unix(new Date().getTime() / 1000).format("DD MMMM YYYY")
      doc.text(`Banjarmasin, ${currentDate}`, 196, finalY + 12, null, null, "right")
      doc.text("Tata Usaha", 168, finalY + 40, null, null, "center")
      doc.save(`${item.nis}-${item.name}-${item.year}-${item.month}.pdf`)
      doc.autoPrint()
      body[0].spp = tempSPP
    }
  },
  watch: {
    userProfile: {
      immediate: true,
      handler() {
        this.getStudents()
        this.getTuitions()
      }
    },
    dialogAdd() {
      this.$store.commit('setTuition', null)
      this.selectedStudent = null
      this.getTuitions()
    },
    dialogPay() {
      this.month = null
      this.year = null
      this.spp = null
    },
    selectedStudent() {
      if (this.selectedStudent !== null) {
        this.getTuition()
      }
    }
  },
}
</script>

<style>

</style>