<template>
  <div id="applicants">
    <TopNavigation />
    <v-main v-if="userProfile && userProfile.name">
      <v-layout column>
        <v-sheet color="grey lighten-3">
          <p class="mb-0 px-3 py-1 subtitle-2 text--secondary" v-if="userProfile.role === 'Pendaftar'">Calon siswa yang anda daftarkan</p>
          <p class="mb-0 px-3 py-1 subtitle-2 text--secondary" v-else>Calon siswa yang mendaftar</p>
        </v-sheet>
        <loading v-if="loading" />
        <v-list two-line v-else>
          <v-list-item
            v-for="applicant in applicants" :key="applicant.id"
            class="mt-n2"
            @click="$router.push(`/calonsiswa/${applicant.id}`)" >
            <v-list-item-avatar class="ml-n2">
              <v-avatar color="primary darken-1" v-if="applicant && applicant.name">
                <span class="title white--text">{{ applicant.name.substr(0,1) }}</span>
              </v-avatar>
            </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{ applicant.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ applicant.status }}</v-list-item-subtitle>
              </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>

      <v-btn
        v-if="userProfile.role === 'Pendaftar'"
        @click="dialog = true"
        fixed
        fab
        app
        bottom
        right
        color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-main>

    <v-dialog id="add-dialog"
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
            <v-card-title class="font-weight-regular">Tambah Calon Siswa</v-card-title>
            <v-spacer />
            <v-btn  
              @click="addApplicant()"
              icon class="text-none mr-n2">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-layout>
        </v-toolbar>
        <v-layout
          column
          class="px-4 mt-2" >
          <div v-for="form in formList" :key="form.value">
          <v-textarea
            v-if="form.type === 'textarea'"
            :label="form.label"
            v-model.trim="formAdd[form.value]"
            auto-grow />
          <v-combobox
            v-else-if="form.type === 'combobox'"
            :items="form.items"
            :label="form.label"
            v-model.trim="formAdd[form.value]" />
          <v-file-input
            v-else-if="form.type === 'file'"
            accept="image/*"
            @change="uploadImage"
            :label="form.label"
            v-model="formAdd[form.value]" />
          <v-text-field
            v-else
            :type="form.type"
            :label="form.label"
            v-model.trim="formAdd[form.value]" />
          </div>
        </v-layout>

        <!-- <v-layout class="px-8">
          <div class="d-flex" v-for="image in formAdd.image" :key="image">
            <img :src="image" class="pa-1" width="128px" />
          </div>
        </v-layout> -->
      </v-card>
    </v-dialog>

    
  </div>
</template>

<script>

import { mapState } from 'vuex'
import TopNavigation from '@/components/Navigation/TopNavigation'
import Loading from '@/components/Loading'
import { storage } from '@/firebase.js'
export default {
  components: {
    TopNavigation,
    Loading,
  },
  data: () => ({
    dialog: false,
    formAdd: {},
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
      { label: 'Berat (kg)', value: 'weight', type: 'number' },
      { label: 'Tinggi (cm)', value: 'height', type: 'number' },
      { label: 'Kartu Keluarga', value: 'kk', type: 'file' },
      { label: 'Akta Kelahiran', value: 'akta', type: 'file' },
      { label: 'Pas Foto', value: 'foto', type: 'file' },
    ],
  }),
  computed: {
    ...mapState(['userProfile', 'applicants', 'loading']),
  },
  methods: {
    addApplicant() {
      this.formList.forEach(i => {
        if (i.type === 'file' && this.formAdd[i.value]) {
          // console.log(i.value, ':', this.formAdd[i.value])
          this.formAdd[i.value] = this.formAdd[i.value].name
        }
      })
      this.$store.dispatch('postApplicants', { user: this.userProfile, data: this.formAdd })
      this.getApplicants()
      this.formAdd = {}
      this.formAdd.image = []
      this.dialog = false
    },
    getApplicants() {
      if (this.userProfile && this.userProfile.name) {
        this.$store.dispatch('getApplicants', { user: this.userProfile })
      }
    },
    uploadImage(file) {
      let uid = this.userProfile.uid
      const storageRef = storage.ref('applicants/' + uid + '/' + file.name)
      let uploadTask  = storageRef.put(file)
      uploadTask.on('state_changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      }, (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.formAdd.image.push(downloadURL)
          // console.log('URL:', downloadURL)
          // console.log('Form Add:', this.formAdd)
        })
      })
    }
  },
  watch: {
    userProfile() {
      this.getApplicants()
    }
  },
  mounted() {
    this.getApplicants()
    this.formAdd.image = []
  },
}
</script>

<style>

</style>