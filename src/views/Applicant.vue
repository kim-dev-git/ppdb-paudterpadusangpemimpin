<template>
  <div id="applicant">
    <v-app-bar
      app flat dark dense class="primary" >
      <v-layout class="align-center">
        <v-btn
          @click="$router.push('/calonsiswa')"
          active-class=""
          icon
          class="ml-n4" >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title class="font-weight-regular">{{ 'Data ' + applicant.name }}</v-card-title>
      </v-layout>
    </v-app-bar>
    <v-main>
      <v-layout
        column >
        <v-list two-line>
          <v-list-item v-for="data in formList" :key="data.value">
            <v-list-item-content>
              <v-list-item-title v-if="data.type !== 'date'">{{ applicant[data.value] }}</v-list-item-title>
              <v-list-item-title v-else-if="data.type === 'date' && applicant[data.value] && applicant[data.value].seconds">{{ toDate(applicant[data.value].seconds) }}</v-list-item-title>
              <v-list-item-subtitle>{{ data.label }}</v-list-item-subtitle>
              <v-divider class="mt-2 mb-n2" />
            </v-list-item-content>
          </v-list-item>
        </v-list>  
      </v-layout>
    </v-main>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  props: [ 'id' ],
  components: {
  },
  data: () => ({
    formList: [
      { label: 'Nama Calon Siswa', value: 'name', type: 'text' },
      { label: 'Tempat Lahir', value: 'birthplace', type: 'text' },
      { label: 'Tanggal Lahir', value: 'birthdate', type: 'date' },
      { label: 'Alamat', value: 'address', type: 'textarea' },
      { label: 'Anak Ke', value: 'child', type: 'number' },
      { label: 'Jumlah Saudara', value: 'siblings', type: 'number' },
      { label: 'Agama', value: 'religion', type: 'combobox', items: ['Islam', 'Protestan', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu'] },
      { label: 'Jenis Kelamin', value: 'gender', type: 'combobox', items: ['Laki-laki', 'Perempuan'] },
      { label: 'NIK Anak', value: 'nik', type: 'number' },
      { label: 'Berat (kg)', value: 'wight', type: 'number' },
      { label: 'Tinggi (cm)', value: 'height', type: 'number' },
      // { label: 'Kartu Keluarga', value: 'kk', type: 'file' },
      // { label: 'Akta Kelahiran', value: 'akta', type: 'file' },
      // { label: 'Pas Foto', value: 'foto', type: 'file' },
    ]
  }),
  computed: {
    ...mapState(['applicant']),
  },
  methods: {
    toDate(value) {
      moment.lang("id")
      return moment.unix(value).format("DD MMMM YYYY")
    }
  },
  created() {
    this.$store.dispatch('getApplicant', { id: this.id })
  }

}
</script>

<style>

</style>