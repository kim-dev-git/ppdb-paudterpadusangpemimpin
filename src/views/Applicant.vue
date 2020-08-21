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
        <v-spacer />
        <v-btn id="print-button"
          icon
          class="mr-n4"
          @click="print()" >
          <v-icon>mdi-printer</v-icon>
        </v-btn>
        <v-btn id="delete-button"
          icon
          class="mr-n4"
          @click="removeDialog = true" >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn id="edit-button"
          icon
          class="mr-n4"
          @click="editApplicant()"
          v-if="userProfile.uid === applicant.registrarUID" >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn id="add-button"
          icon
          class="mr-n4"
          @click="dialogAdd = true"
          v-if="userProfile.uid === applicant.registrarUID" >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-layout>
    </v-app-bar>
    
    <v-main>
      <v-layout id="skeleton" v-if="loading"
        column >
        <v-list two-line>
          <v-list-item v-for="data in formList" :key="data.value" v-if="data.type !== 'file'">
            <v-list-item-content>
              <v-list-item-title v-if="data.type !== 'date' && data.type !== 'file'">
                <v-sheet height="18" width="128" color="black" style="opacity: .2"></v-sheet>
              </v-list-item-title>
              <v-list-item-title v-else-if="data.type === 'date' && applicant[data.value] && applicant[data.value].seconds">
                <v-sheet height="18" width="164" color="black" style="opacity: .2"></v-sheet>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-sheet height="18" width="96" color="black" style="opacity: .1"></v-sheet>
              </v-list-item-subtitle>
              <v-divider class="mt-2 mb-n2" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>
      <v-layout id="content" v-else
        column>

        <v-card
          tile
          class="px-4 py-2">
          <v-layout class="align-center">
            <p class="mb-0 subtitle-2 text--secondary">Status <v-chip class="ml-2">{{ applicant.status }}</v-chip></p>
            <v-spacer />
            <v-btn
              icon
              color="primary"
              v-if="applicant.status === 'Verifikasi berkas' && userProfile.role === 'Admin'"
              @click="dialogConfirm = true">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              dark
              rounded
              small
              color="error"
              v-if="applicant.status === 'Verifikasi berkas' && userProfile.role === 'Admin' || applicant.status === 'Input Nilai Tes' && userProfile.role === 'Admin' || applicant.status === 'Lolos verifikasi berkas' && userProfile.role === 'Admin'"
              @click="applicantNotPass()">
              <v-icon left>mdi-close-circle-outline</v-icon>
              <span v-text="'Tidak Lulus'" />
            </v-btn>
          </v-layout>
        </v-card>

        <v-chip-group
          mandatory
          active-class="primary--text"
          class="mx-2"
          v-model="activeTag"
        >
          <v-chip v-for="tag in tags" :key="tag" :value="tag"
           outlined >
            {{ tag }}
          </v-chip>
        </v-chip-group>

        <v-divider />

        <v-lazy id="data-calon-siswa"
          v-if="activeTag === 'Calon Siswa'"
          :options="{
            threshold: .5
          }"
          min-height="200"
          transition="fade-transition"
        >
          <v-list
            two-line>
            <v-list-item v-for="data in formList" :key="data.value" v-if="data.type !== 'file'">
              <v-list-item-content>
                <v-list-item-title v-if="data.type !== 'date'">{{ applicant[data.value] }}</v-list-item-title>
                <v-list-item-title v-else-if="data.type === 'date' && applicant[data.value] && applicant[data.value].seconds">{{ toDate(applicant[data.value].seconds) }}</v-list-item-title>
                <v-list-item-subtitle>{{ data.label }}</v-list-item-subtitle>
                <v-divider class="mt-2 mb-n2" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-lazy>

        <v-lazy id="data-orang-tua-wali"
          v-else
          :options="{
            threshold: .5
          }"
          min-height="200"
          transition="fade-transition"
        >
          <v-list
            two-line>
            <v-list-item v-for="data in formListGuardian" :key="data.value" v-if="applicant.data[activeTag]">
              <v-list-item-content>
                <v-list-item-title v-if="data.type !== 'date'"><span v-if="data.prefix">{{ data.prefix + ' ' }}</span>{{ applicant.data[activeTag][data.value] }}</v-list-item-title>
                <v-list-item-title v-else-if="data.type === 'date' && applicant.data[activeTag][data.value] && applicant.data[activeTag][data.value].seconds">{{ toDate(applicant.data[activeTag][data.value].seconds) }}</v-list-item-title>
                <v-list-item-subtitle>{{ data.label }}</v-list-item-subtitle>
                <v-divider class="mt-2 mb-n2" />
              </v-list-item-content>
            </v-list-item>

            <v-sheet v-if="!applicant.data[activeTag]"
              color="grey lighten-3"
              class="mt-n2">
              <p class="mb-0 px-3 py-1 subtitle-2 text--secondary">Data {{ activeTag }} belum ditambahkan</p>
            </v-sheet>
          </v-list>
          

        </v-lazy>


      </v-layout>

      <div v-if="activeTag === 'Calon Siswa'">
        <p class="ml-4 mb-0 subtitle-2">Berkas</p>
        <div v-if="applicant.image">
          <v-layout class="py-2 px-3">
            <div v-for="image in applicant.image" :key="image" class="d-flex">
              <img :src="image" width="80" class="ma-1" @click="openImage(image)" />
            </div>
          </v-layout>
          <p class="mb-4 px-4 text--disabled body-2">Klik gambar untuk memperbesar</p>
        </div>
        <v-layout v-else class="px-4 mb-4 body-2 text--disabled">Berkas tidak ada</v-layout>
      </div>

      <v-dialog id="dialogAddRelation"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        v-model="dialogAdd" >
        <v-card>
          <v-toolbar
            dark dense flat tile color="primary">
            <v-layout
              class="align-center">
              <v-btn
                @click="dialogAdd = false"
                icon class="ml-n2">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-card-title class="font-weight-regular">Tambah Data Orang tua/wali</v-card-title>
              <v-spacer />
              <v-btn  
                @click="addApplicantRelation()"
                icon class="text-none mr-n2">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-layout>
          </v-toolbar>
          <v-layout
            column
            class="px-4 mt-2" >
            <div v-for="form in formListGuardian" :key="form.value">
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
            <v-text-field
              v-else
              :prefix="form.prefix"
              :type="form.type"
              :label="form.label"
              v-model.trim="formAdd[form.value]" />
            </div>
          </v-layout>
        </v-card>
      </v-dialog>

      <v-dialog id="dialogEditRelation"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        v-model="dialogEditRelation" >
        <v-card>
          <v-toolbar
            dark dense flat tile color="primary">
            <v-layout
              class="align-center">
              <v-btn
                @click="dialogEditRelation = false"
                icon class="ml-n2">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-card-title class="font-weight-regular">Edit Data Orang tua/wali</v-card-title>
              <v-spacer />
              <v-btn  
                @click="updateApplicantRelation()"
                icon class="text-none mr-n2">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-layout>
          </v-toolbar>
          <v-layout
            column
            class="px-4 mt-2" >
            <div v-for="form in formListGuardian" :key="form.value">
            <v-textarea
              v-if="form.type === 'textarea'"
              :label="form.label"
              v-model.trim="formEdit[form.value]"
              auto-grow />
            <v-combobox
              v-else-if="form.type === 'combobox'"
              :items="form.items"
              :label="form.label"
              v-model.trim="formEdit[form.value]" />
            <v-text-field
              v-else
              :prefix="form.prefix"
              :type="form.type"
              :label="form.label"
              v-model.trim="formEdit[form.value]" />
            </div>
          </v-layout>
        </v-card>
      </v-dialog>

      <v-dialog id="dialogConfirm"
        v-model="dialogConfirm">
        <v-card class="pa-4">
          <v-card-text class="ml-n4 mt-2">Berkas sudah diverifikasi?</v-card-text>
          <v-layout>
            <v-spacer />
            <v-btn text class="text--disabled" @click="dialogConfirm = false" >Belum</v-btn>
            <v-btn text color="primary" @click="verifApplicant()">Sudah</v-btn>
          </v-layout>
        </v-card>
      </v-dialog>

      <v-dialog id="remove-dialog"
        v-model="removeDialog"
        width="400"
      >
        <v-card class="pa-4 pt-6">
          <v-card-text v-if="applicant">
            Yakin ingin menghapus data calon siswa <b>{{ applicant.name }}</b>?
          </v-card-text>
          <v-card-actions>
            <v-layout class="justify-end">
              <v-btn
                text
                color="grey"
                class="text-none"
                @click="removeDialog = false"
              >
                Batal
              </v-btn>
              <v-btn
                text
                color="error"
                class="text-none"
                @click="removeApplicant()"
              >
                Hapus
              </v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>

    <v-dialog id="dialogEdit"
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
              @click="dialog = false, getApplicant()"
              icon class="ml-n2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-card-title class="font-weight-regular">Edit Calon Siswa</v-card-title>
            <v-spacer />
            <v-btn  
              @click="updateApplicant()"
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
            v-model.trim="formEdit[form.value]"
            auto-grow />
          <v-combobox
            v-else-if="form.type === 'combobox'"
            :items="form.items"
            :label="form.label"
            v-model.trim="formEdit[form.value]" />
          <v-file-input
            v-else-if="form.type === 'file'"
            accept="image/*"
            @change="uploadImage"
            :label="form.label"
            v-model="formEdit[form.value]" />
          <v-text-field
            v-else
            :type="form.type"
            :label="form.label"
            v-model.trim="formEdit[form.value]" />
          </div>
        </v-layout>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

import logo from '@/assets/logo.js'
import footer from '@/assets/footer.js'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'
import { storage } from '@/firebase.js'
import { mapState } from 'vuex'
export default {
  props: [ 'id' ],
  components: {
  },
  data: () => ({
    tags: [
      'Calon Siswa',
      'Ayah',
      'Ibu',
      'Wali',
    ],
    activeTag: 'Calon Siswa',
    dialog: false,
    formEdit: {},
    currentImage: [],
    dialogAdd: null,
    dialogEditRelation: null,
    dialogConfirm: null,
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
      { label: 'Berat (kg)', value: 'wight', type: 'number' },
      { label: 'Tinggi (cm)', value: 'height', type: 'number' },
      { label: 'Kartu Keluarga', value: 'kk', type: 'file' },
      { label: 'Akta Kelahiran', value: 'akta', type: 'file' },
      { label: 'Pas Foto', value: 'foto', type: 'file' },
    ],
    formListGuardian: [
      { label: 'Hubungan dengan calon siswa', value: 'relation', type: 'combobox', items: ['Ayah', 'Ibu', 'Wali'] },
      { label: 'Nama', value: 'name', type: 'text' },
      { label: 'Tempat Lahir', value: 'birthplace', type: 'text' },
      { label: 'Tanggal Lahir', value: 'birthdate', type: 'date' },
      { label: 'Alamat', value: 'address', type: 'textarea' },
      { label: 'Pendidikan Terakhir', value: 'lastEducation', type: 'combobox', items: ['SD', 'SMP', 'SMA', 'D3', 'D4', 'S1', 'S2', 'S3'] },
      { label: 'Warga Negara', value: 'citizen', type: 'text' },
      { label: 'Agama', value: 'religion', type: 'combobox', items: ['Islam', 'Protestan', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu'] },
      { label: 'Pekerjaan', value: 'job', type: 'text' },
      { label: 'Penghasilan perbulan', value: 'salary', type: 'number', prefix: 'Rp.' },
    ],
    removeDialog: false,
  }),
  computed: {
    ...mapState(['applicant', 'loading', 'userProfile']),
  },
  methods: {
    getApplicant() {
      this.$store.dispatch('getApplicant', { id: this.id })
    },
    toDate(value) {
      moment.lang("id")
      return moment.unix(value).format("DD MMMM YYYY")
    },
    openImage(image) {
      window.location.href = image
    },
    editApplicant() {
      if(this.activeTag === 'Calon Siswa') {
        this.formEdit = this.applicant
        this.formEdit.image = []
        this.formEdit.birthdate = new Date(this.applicant.birthdate.seconds * 1000).toISOString().substr(0, 10),
        this.currentImage.push(this.applicant.kk)
        this.currentImage.push(this.applicant.akta)
        this.currentImage.push(this.applicant.foto)
        this.formEdit.kk = null
        this.formEdit.akta = null
        this.formEdit.foto = null
        this.dialog = true
      } else {
        if (this.applicant.data[this.activeTag]) {
          this.formEdit = this.applicant.data[this.activeTag]
          this.formEdit.birthdate = new Date(this.applicant.data[this.activeTag].birthdate.seconds * 1000).toISOString().substr(0, 10),
          this.dialogEditRelation = true
        }
      }
    },
    async addApplicantRelation() {
      await this.$store.dispatch('postApplicantRelation', { id: this.id, data: this.formAdd })
      await this.getApplicant()
      this.dialogAdd = false
    },
    async updateApplicantRelation() {
      await this.$store.dispatch('postApplicantRelation', { id: this.id, data: this.formEdit })
      await this.getApplicant()
      this.dialogEditRelation = false
    },
    async updateApplicant() {
      await this.formList.forEach(i => {
        if (i.type === 'file' && this.formEdit[i.value]) {
          this.formEdit[i.value] = this.formEdit[i.value].name
        }
      })
      
      let uid = this.applicant.registrarUID

      
      await this.$store.dispatch('putApplicant', { id: this.id, data: this.formEdit })

      await this.currentImage.forEach(image => {
        console.log(image)
        let imageRef = storage.ref('applicants/' + uid + '/' + image)
        imageRef.delete()
      })

      // const kkRef = storage.ref('applicants/' + uid + '/' + this.applicant.kk)
      // const aktaRef = storage.ref('applicants/' + uid + '/' + this.applicant.akta)
      // const fotoRef = storage.ref('applicants/' + uid + '/' + this.applicant.foto)

      // await kkRef.delete()
      // await aktaRef.delete()
      // await fotoRef.delete()


      await this.getApplicant()
      this.formEdit = {}
      this.formEdit.image = []
      this.dialog = false
    },
    async verifApplicant() {
      let data = { status: 'Lolos verifikasi berkas' }
      await this.$store.dispatch('putApplicant', { id: this.id, data: data })
      await this.getApplicant()
      this.dialogConfirm = false
    },
    async removeApplicant() {
      await this.$store.dispatch('removeApplicant', this.id)
      this.removeDialog = false
      this.$router.push('/calonsiswa')
    },
    async applicantNotPass() {
      let data = { status: 'Tidak Lulus' }
      await this.$store.dispatch('putApplicant', { id: this.id, data: data })
      await this.getApplicant()
      this.dialogConfirm = false
    },
    uploadImage(file) {
      let uid = this.applicant.registrarUID
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
          this.formEdit.image.push(downloadURL)
        })
      })
    },
    print() {
      var item = this.applicant
      var header = this.formList
      var applicant = this.applicant
      var doc = new jsPDF()
      const imgData = logo
      const imgFooter = footer
      
      doc.addImage(imgData, "JPEG", 10, 22, null, null)
      doc.setFontSize("20")
      // doc.setFontStyle("bold")
      doc.text("Data Calon Siswa", 105, 20, null, null, "center")
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
      header.forEach(data => {
        if (data.value !== 'kk' && data.value !== 'akta' && data.value !== 'foto') {
          doc.text(data.label, xStart, yStart, null, null)
          if (data.type === 'date') {
            doc.text(`: ${ this.toDate(applicant[data.value].seconds) }`, xStart + xSpace, yStart, null, null)
          } else {
            doc.text(`: ${ applicant[data.value] }`, xStart + xSpace, yStart, null, null)
          }
          yStart = yStart + 6
        }
      })
      if (item.status === 'Lulus' || item.status === 'Tidak Lulus') {
        doc.text(`Calon siswa bernama ${item.name} dinyatakan :`, 105, yStart + 10, null, null, "center")
        doc.setFontSize("24")
        doc.text(item.status.toUpperCase(), 105, yStart + 24, null, null, "center")
      }
      let height = doc.internal.pageSize.getHeight()
      console.log(Math.round(height))
      doc.addImage(imgFooter, "PNG", 0, height - 60, 210, 60)
      doc.save(`${item.nik}-${item.name}.pdf`)
      doc.autoPrint()
    }
  },
  created() {
    this.getApplicant()
  }

}
</script>

<style>

</style>