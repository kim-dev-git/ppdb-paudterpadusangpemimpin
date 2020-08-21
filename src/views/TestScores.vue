<template>
  <div id="test-scores">
    <TopNavigation />
    <v-main v-if="userProfile && userProfile.name">
      <v-layout column>
        <v-sheet color="grey lighten-3" class="mb-0 px-3 py-2 subtitle-2 ">
          <v-layout class="align-center">
            <p class="mb-0 text--secondary">Nilai tes calon siswa</p>
            <v-spacer />            

            <v-tooltip left v-if="userProfile.role !== 'Pendaftar'">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >mdi-help-circle</v-icon>
              </template>
              <span>Klik nama calon siswa untuk mengedit nilai</span>
            </v-tooltip>
          </v-layout>
        </v-sheet>
        
        <loading v-if="loading" />

        <div v-else>

          <v-container
            :class="!$vuetify.breakpoint.smAndUp ? 'px-0' : ''">

            <v-data-table id="sudah-dinilai"
              :mobile-breakpoint="Number('0')"
              :items="testScores"  
              :headers="headers"
              >
              <template #body="props">
                <tbody>
                  <tr v-for="(item) in props.items" :key="item.id" class="pulse-bg pulse-text">
                    <td v-for="(header, index) in headers" :key="header.value"
                      class="border-column"
                      :class="index === 0 ? 'first-column align-center' : ''"
                      @click="selectApplicantFromTestScore(item)">
                      <span>{{ item[header.value] }}</span>
                    </td>
                  </tr>
                </tbody>
                <tbody class="fixed-column white">
                  <tr v-for="(item, index) in props.items" :key="item.id" class="pulse-bg pulse-text">
                    <td v-for="(header, index) in headers" :key="header.value" v-if="index === 0"
                      class="border-column"
                      :class="index === 0 ? 'first-column align-center' : ''"
                      @click="selectApplicantFromTestScore(item)">
                      <span>{{ item[header.value] }}</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>

          </v-container>

          <v-sheet color="grey lighten-3" class="mb-0 px-3 py-2 subtitle-2 ">
            <v-layout class="align-center">
              <p class="mb-0 text--secondary">Calon siswa yang belum diinput nilai test</p>
              <v-spacer />
              <v-tooltip left v-if="userProfile.role !== 'Pendaftar'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >mdi-help-circle</v-icon>
                </template>
                <span>Klik nama calon siswa untuk menginput nilai</span>
              </v-tooltip>
            </v-layout>
          </v-sheet>

          <v-container v-if="!loading"
            :class="!$vuetify.breakpoint.smAndUp ? 'px-0' : ''">
            
            <v-data-table id="belum-dinilai"
              v-if="applicantsNonTestScore"
              :mobile-breakpoint="Number('0')"
              :items="applicantsNonTestScore"  
              :headers="headers2"
              >
              <template #body="props">
                <tbody>
                  <tr v-for="(item) in props.items" :key="item.id" class="pulse-bg pulse-text">
                    <td v-for="(header, index) in headers2" :key="header.value"
                      class="border-column"
                      :class="index === 0 ? 'align-center first-column' : ''"
                      @click="selectApplicant(item)">
                      <span>{{ item[header.value] }}</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>

          </v-container>

        </div>

      </v-layout>
    </v-main>

    <v-bottom-sheet v-model="dialog" persistent>
      <v-sheet>
        <v-layout class="pa-2 mb-4 align-center">
          <v-icon @click="dialog = false, selectedApplicant = null">mdi-close</v-icon>
          <v-spacer />
          <p class="mb-0 title" v-if="selectedApplicant">{{ selectedApplicant.name }}</p>
          <v-spacer />
          <v-btn
            small depressed color="primary" class="text-none" @click="print()">
            <v-icon v-text="'mdi-printer'" left />
            Print
          </v-btn>
          <v-btn v-if="userProfile.role !== 'Pendaftar'"
            small depressed color="primary" class="text-none" @click="postTestScore()">Simpan
          </v-btn>
        </v-layout>
        <v-sheet color="grey lighten-3">
          <p class="mb-0 px-3 py-1 subtitle-2 text--disabled" v-if="userProfile.role !== 'Pendaftar'">Klik pada subjek untuk mengedit nilai</p>
        </v-sheet>
        <v-layout column>
          <v-list>
            <v-list-item
              v-for="subject in subjects"
              :key="subject.abbreviation"
              @click="selectSubject(subject)">
              <v-layout column>
                <v-layout>
                  <p class="mb-0 text--secondary">{{ subject.name }}</p>
                  <v-spacer />
                  <p class="mb-0" v-if="selectedApplicant && selectedApplicant[subject.abbreviation]">{{ selectedApplicant[subject.abbreviation] }}</p>
                  <p class="mb-0" v-else>-</p>
                </v-layout>
                <v-divider class="mt-3" />
              </v-layout>
            </v-list-item>
          </v-list>
        </v-layout>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog
      v-model="dialogScore"
      width="400">
      <v-card class="pa-4" v-if="selectedApplicant && selectedSubject">
        <p class="title" v-if="selectedSubject">{{ selectedSubject.name }}</p>
        <v-radio-group v-model="selectedApplicant[selectedSubject.abbreviation]">
          <v-radio v-for="score in scores" :key="score.abbreviation" :label="score.name" :value="score.abbreviation"></v-radio>
        </v-radio-group>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

import logo from '@/assets/logo.js'
import footer from '@/assets/footer.js'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { mapState } from 'vuex'
import TopNavigation from '@/components/Navigation/TopNavigation'
import Loading from '@/components/Loading'

export default {
  components: {
    TopNavigation,
    Loading,
  },
  data: () => ({
    headers: [
      { text: 'Nama', value: 'name' },
      { text: 'KDPAI', value: 'KDPAI' },
      { text: 'KMA', value: 'KMA' },
      { text: 'KK', value: 'KK' },
      { text: 'KFM', value: 'KFM' },
      { text: 'KS', value: 'KS' },
    ],
    headers2: [
      { text: 'Nama', value: 'name' },
    ],
    dialog: false,
    selectedApplicant: null,
    subjects: [
      { name: 'Kemampuan Dasar Pendidikan Agama Islam', abbreviation: 'KDPAI' },
      { name: 'Kemampuan Moral Agama', abbreviation: 'KMA' },
      { name: 'Kemampuan Berbahasa', abbreviation: 'KB' },
      { name: 'Kemampuan Kognitif', abbreviation: 'KK' },
      { name: 'Kemampuan Fisik Motorik', abbreviation: 'KFM' },
      { name: 'Kemampuan Seni', abbreviation: 'KS' },
    ],
    scores: [
      { name: 'Belum Berkembang', abbreviation: 'BB' },
      { name: 'Mulai Berkembang', abbreviation: 'MB' },
      { name: 'Berkembang Sesuai Harapan', abbreviation: 'BSH' },
      { name: 'Berkembang Sangat Baik', abbreviation: 'BSB' },
    ],
    dialogScore: false,
    selectedSubject: null,
    selectedScore: null
  }),

  computed: {
    ...mapState(['userProfile', 'applicants', 'testScores', 'loading']),
    applicantsNonTestScore() {
      const applicants = this.applicants
      const testScores = this.testScores
      let array = applicants
      applicants.forEach(applicant => {
        testScores.forEach(test => {
          array = array.filter(val => val.id !== test.id)
        })
      })

      return array
    }
  },

  methods: {
    getApplicants() {
      if (this.userProfile && this.userProfile.name) {
        this.$store.dispatch('getApplicants', { user: this.userProfile })
      }
    },
    getTestScores() {
      if (this.userProfile && this.userProfile.name) {
        this.$store.dispatch('getTestScores', { user: this.userProfile })
      }
    },
    selectApplicant(applicant) {
      this.selectedApplicant = {}
      this.selectedApplicant.id = applicant.id
      this.selectedApplicant.name = applicant.name
      this.selectedApplicant.registrarName = applicant.registrarName
      this.selectedApplicant.registrarUID = applicant.registrarUID
      this.selectedApplicant.birthdate = applicant.birthdate
      this.dialog = true
    },
    selectApplicantFromTestScore(applicant) {
      this.selectedApplicant = applicant
      this.dialog = true
    },
    selectSubject(subject) {
      if (this.userProfile.role !== 'Pendaftar') {
        this.selectedSubject = subject
        if(this.selectedApplicant[subject.abbreviation]) {
          this.selectedScore = this.selectedApplicant[subject.abbreviation]
        }
        this.dialogScore = true
      }
    },
    async postTestScore() {
      let data = this.selectedApplicant
      let user = this.userProfile
      await this.$store.dispatch('postTestScore', { user, data })
      this.dialog = false
      this.getTestScores()
    },
    print() {

      
      var item = this.selectedApplicant
      console.log(this.selectedApplicant)

      var header = this.formList
      var applicant = this.applicant
      var doc = new jsPDF()
      const imgData = logo
      const imgFooter = footer
      
      doc.addImage(imgData, "JPEG", 10, 22, null, null)
      doc.setFontSize("20")
      // doc.setFontStyle("bold")
      doc.text(`Hasil Nilai Tes ${ item.name }`, 105, 20, null, null, "center")
      doc.setFontSize("14")
      // doc.setFontStyle("normal")
      doc.text("Jl. Keramat Raya No.01, RT.18", 105, 27, null, null, "center")
      doc.text("Sungai Bilu, Banjarmasin", 105, 33, null, null, "center")
      doc.setFontSize("12")
      doc.text("Kontak: 081256361363", 105, 39, null, null, "center")
      doc.line(10, 46, 200, 46)
      var xStart = 14
      var yStart = 56
      var xSpace = 64
      var ySpace = 6

      const subjects = this.subjects

      var body = []

      subjects.forEach(subject => {
        body.push({
          subject: subject.name,
          score: item[subject.abbreviation]
        })
      })

      doc.autoTable({
        startY: yStart,
        columns: [
          { header: 'Subjek', dataKey: 'subject' },
          { header: 'Nilai', dataKey: 'score' },
        ],
        body: body
      })

      yStart = doc.autoTable.previous.finalY + 10

      doc.text('Keterangan Nilai:', xStart, yStart, null, null)

      yStart = yStart + ySpace

      const scores = this.scores

      scores.forEach(score => {
        doc.text(score.abbreviation, xStart, yStart, null, null)
        doc.text(`: ${ score.name }`, xStart + 32, yStart, null, null)
        yStart = yStart + ySpace
      })

      doc.setFontSize("10")

      doc.text('Nilai tes hanya untuk mengukur kemampuan calon siswa.', xStart, yStart + 6, null, null)

      yStart = yStart + ySpace

      // doc.text('Lulus tidaknya calon siswa tergantung.', xStart, yStart + 6, null, null)

      yStart = yStart + ySpace

      let height = doc.internal.pageSize.getHeight()
      console.log(Math.round(height))
      doc.addImage(imgFooter, "PNG", 0, height - 60, 210, 60)
      doc.save(`Hasil Nilai Tes - ${ item.name }.pdf`)
      doc.autoPrint()
    }
  },
  watch: {
    userProfile() {
      this.getApplicants()
      this.getTestScores()
    },
    selectedApplicant() {
      this.dialogScore = false
    }
  },
  mounted() {
    this.getApplicants()
    this.getTestScores()
  },
}
</script>

<style lang="scss">
  $pulse-bg: #f5f6f8;
  $pulse-text: #666;
  $primary: #1976D2;

  .first-column {
    display: grid;
    grid-template-columns: minmax(50vw, 50vw) 1fr;
    border-left: 8px solid $primary !important;
  }

  .fixed-column {
    pointer-events: none;
    width: 50vw;
    z-index: 2;
    opacity: .9;
    position: absolute;
    top: 100px;
  }

  .border-column {
    border-right: 1px solid white !important;
    // border-bottom: 1px solid rgba($color: #000000, $alpha: .1) !important;
  }

  .pulse-bg {
    background-color: $pulse-bg;
  }

  .pulse-text {
    color: $pulse-text;
  }

</style>