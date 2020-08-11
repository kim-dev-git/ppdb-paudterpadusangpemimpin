<template>
  <div id="graduates">
    
    <top-navigation />

    <v-main v-if="userProfile.role === 'Admin'">
      <v-sheet color="info" class="mb-0 px-3 py-2 subtitle-2 white--text">
        <v-layout class="align-center">
          <p class="mb-0">Pilih siswa untuk dimasukkan ke kelas TK / KB</p>
          <v-spacer />
          <v-tooltip left v-if="userProfile.role !== 'Pendaftar'">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="white"
                dark
                v-bind="attrs"
                v-on="on"
              >mdi-help-circle</v-icon>
            </template>
            <span class="font-weight-bold">Subjek:</span>
            <p v-for="subject in subjects" :key="subject.abbreviation">{{ subject.abbreviation}} = {{ subject.name }}</p>
            <v-divider />
            <span class="font-weight-bold">Nilai:</span>
            <p v-for="score in scores" :key="score.abbreviation">{{ score.abbreviation}} = {{ score.name }}</p>
          </v-tooltip>
        </v-layout>
      </v-sheet>
      <v-container
        :class="!$vuetify.breakpoint.smAndUp ? 'px-0' : ''" >
        <div id="table"
          style="overflow: auto; display: inline-block; width: 100%;"  >
          <v-data-table id="sudah-dinilai"
            show-select
            sort-by="birthdate"
            :custom-sort="customSort"
            :mobile-breakpoint="Number('0')"
            :items="applicantsWithScores"  
            :headers="headers"
            v-model="selected"
            >
            <template #item.age="{ item }">
              <span width="100%">{{ getAge(item.birthdate.seconds) }}</span>
            </template>
            <template #item.birthdate="{ value }">
              <span width="100%">{{ toDate(value.seconds) }}</span>
            </template>
          </v-data-table>
        </div>
      </v-container>

      <v-btn id="select-modal"
        v-if="selected.length > 0"
        rounded
        fixed
        bottom
        right
        color="primary"
        @click="dialogSelected = true" >
        <span>{{ selected.length }} siswa telah dipilih</span>
        <v-spacer />
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <!-- <div v-for="select in selected" :key="select.id">
        <span v-if="select.score">{{ select.score }}</span>
      </div> -->

    </v-main>

    <v-main v-else>
      <v-sheet color="info" class="mb-0 px-3 py-2 subtitle-2 white--text">
        <v-layout class="align-center">
          <p class="mb-0">Hanya untuk admin</p>
        </v-layout>
      </v-sheet>
    </v-main>

    <v-dialog id="dialogSelected"
      scrollable
      v-model="dialogSelected"
      max-width="600" >
      <v-card>
        <v-layout class="pa-4 pb-2">
          <v-icon @click="dialogSelected = false">mdi-close</v-icon>
          <v-spacer />
        </v-layout>
        <v-layout class="px-6 pr-12 pr-sm-0 mr-sm-10 pt-4">
          <span class="subtitle-2">Nama</span>
          <v-spacer />
          <span class="subtitle-2">Umur</span>
        </v-layout>
        <v-divider class="mt-4" />
        <v-card-text style="height: 300px;">
          <v-list>
            <v-list-item
              v-for="applicant in selected"
              :key="applicant.id"
              class="mx-n4" >
              <v-list-item-content>
                <span v-text="applicant.name" />
              </v-list-item-content>
              <v-list-item-action class="justify-end align-center">
                <span>{{ getAge(applicant.birthdate.seconds) }}
                  <v-btn
                    icon
                    small
                    class="mt-n1"
                    @click="removeSelected(applicant)" >
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </span>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-combobox dense flat solo background-color="grey lighten-3" class="mr-2 mb-n7" v-model="selectedClass" label="Kelas" :items="['KB', 'TK']" />
          <v-combobox dense flat solo background-color="grey lighten-3" class="mb-n7" v-model="selectedGroup" label="Kelompok" :items="selectedClass === 'KB' ? classKB : classTK" />
        </v-card-actions>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            :disabled="!selectedGroup"
            rounded
            color="primary"
            class="text-none"
            @click="postStudent()" >
            <span class="ml-1">Tambahkan {{ selected.length }} siswa ke kelas {{ selectedGroup }}</span>
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
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
    dialogSelected: false,
    selectedClass: null,
    selectedGroup: null,
    selected: [],
    headers: [
      { text: 'Nama', value: 'name' },
      { text: 'Umur (tahun)', value: 'age', align: 'right' },
      { text: 'Tanggal Lahir', value: 'birthdate', align: 'right'  },
      { text: 'Jenis Kelamin', value: 'gender', align: 'right'  },
      { text: 'Nilai KB', value: 'score.KB', align: 'right'  },
      { text: 'Nilai KDPAI', value: 'score.KDPAI', align: 'right'  },
      { text: 'Nilai KFM', value: 'score.KFM', align: 'right'  },
      { text: 'Nilai KK', value: 'score.KK', align: 'right'  },
      { text: 'Nilai KMA', value: 'score.KMA', align: 'right'  },
      { text: 'Nilai KS', value: 'score.KS', align: 'right'  }
    ],
    classKB: [
      'KB A',
      'KB 1',
      'KB 2',
    ],
    classTK: [
      'TK. A1/2',
      'TK. A3/4',
      'TK. B1/2',
      'TK. B3/4',
      'TK. B5/6',
    ],
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
  }),
  computed: {
    ...mapState([
      'userProfile',
      'testScores',
      'lastNIS'
    ]),
    ...mapGetters([
      'applicantsPassed'
    ]),
    applicantsWithScores() {
      const applicants = this.applicantsPassed
      const testScores = this.testScores
      const array = []
      applicants.forEach(applicant => {
        testScores.forEach(testScore => {
          if(testScore.id === applicant.id) {
            applicant.score = {
              KB: testScore.KB,
              KDPAI: testScore.KDPAI,
              KFM: testScore.KFM,
              KK: testScore.KK,
              KMA: testScore.KMA,
              KS: testScore.KS,
            }
          }
        })
        array.push(applicant)
      })
      return array
    }
  },
  methods: {
    getLastNIS() {
      if (this.userProfile && this.userProfile.name) {
        this.$store.dispatch('getLastNIS')
      }
    },
    getTestScores() {
      if (this.userProfile && this.userProfile.name) {
        this.$store.dispatch('getTestScores', { user: this.userProfile })
      }
    },
    getApplicants() {
      if (this.userProfile && this.userProfile.name) {
        this.$store.dispatch('getApplicants', { user: this.userProfile })
      }
    },
    selectApplicant(applicant) {
      console.log(applicant.name)
    },
    removeSelected(applicant) {
      const selected = this.selected
      for(var i = selected.length -1 ; i > -1; i--) {
          if(selected[i].id == applicant.id) {
              selected.splice(i, 1);
          }
      }
    },
    toDate(value) {
      moment.lang("id")
      return moment.unix(value).format("DD MMMM YYYY")
    },
    getAge(value) {
      moment.lang("id")
      const birthdate = Number(moment.unix(value).format("DD MMMM YYYY").slice(-4))
      const currentDate = Number(moment.unix(new Date().getTime() / 1000).format("DD MMMM YYYY").slice(-4))
      return currentDate - birthdate
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] == "birthdate") {
            if (!isDesc[0]) {
                return a.birthdate.seconds - b.birthdate.seconds;
            } else {
                return b.birthdate.seconds - a.birthdate.seconds;
            }
        } else if (!(isNaN(a[index[0]]))) {
            if (!isDesc[0]) {
                return (a[index[0]] - b[index[0]]);
            } else {
                return (b[index[0]] - a[index[0]]);
            }

        } else {
            if (!isDesc[0]) {
                return (a[index[0]] < b[index[0]]) ? -1 : 1;
            } else {
                return (b[index[0]] < a[index[0]]) ? -1 : 1;
            }
        }
      })
      return items;
    },
    async postStudent() {
      const selected = this.selected
      const group = this.selectedGroup
      var delay = 1
      var lastNIS = this.lastNIS

      // selected.forEach((async a => {
      //   await setTimeout(() => {
      //     console.log(delay)
      //     delay++
      //   }, delay * 2000)
      // }))

      for await (const student of selected) {
        // this.getLastNIS()
        setTimeout(() => {
          console.log(delay)
          this.$store.dispatch('postStudent', { student, group }).then(() => this.$store.dispatch('incLastNIS'))
          this.$store.state.lastNIS++
          delay++
        }, delay * 1000)
        
      }

      // selected.forEach(async (student) => {
      //   this.getLastNIS()
      //   this.$store.dispatch('postStudent', { student, group }).then(() => this.$store.dispatch('incLastNIS'))
      //   (async () => {
      //     await this.getLastNIS()
      //     await this.$store.dispatch('postStudent', { student, group }).then(() => this.$store.dispatch('incLastNIS'))
      //   })()
      // })
      this.dialogSelected = false
    }
  },
  mounted() {
    this.getLastNIS()
    this.getApplicants()
    this.getTestScores()
  },
  watch: {
    userProfile() {
      this.getLastNIS()
      this.getApplicants()
      this.getTestScores()
    },
    selectedClass() {
      this.selectedGroup = null
    }
  }
}
</script>
