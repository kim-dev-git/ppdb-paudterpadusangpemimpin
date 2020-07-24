<template>
  <div id="login">
    <section
      class="pt-4">
      <p class="mb-2 text-center headline">APEL-Bulog</p>
      <p class="my-0 text-center title">Basic information</p>
      <p class="my-0 text-center body-2">Enter your name, title, email & password</p>
      <v-layout
        column class="mt-6 px-6">
        <v-text-field outlined type="text" label="Nama" v-model.trim="signupForm.name" class="mb-n4" />
        <v-combobox outlined label="Jabatan" v-model.trim="signupForm.role" :items="roles" class="mb-n4" />
        <v-combobox outlined label="Posisi" v-model.trim="signupForm.position" :items="filteredPostions" class="mb-n4" />
        <v-text-field outlined type="email" label="Email" v-model.trim="signupForm.email" class="mb-n4" />
        <v-text-field outlined type="password" label="Password" v-model.trim="signupForm.password" />
      </v-layout>
      <v-footer
        absolute
        padless
        class="pb-4 font-weight-medium white"
      >
        <v-layout
          class="pl-2 pr-6 bottom">
          <v-btn text color="primary" class="text-none" to="/login">
            Sudah punya akun ?
          </v-btn>
          <v-spacer />
          <v-btn @click="signup()"
            depressed color="primary" class="text-none px-6">
            Daftar
          </v-btn>
        </v-layout>
      </v-footer>
    </section>
  </div>
</template>

<script>
export default {
  data: () => ({
    signupForm: {
      nama: '',
      role: '',
      position: '',
      email: '',
      password: '',
    },
    roles: [
      'TU',
      'PIMWIL',
      'KABID',
    ],
    positions: [
      { role: 'TU', position: 'TU' },
      { role: 'PIMWIL', position: 'PIMWIL' },
      { role: 'KABID', position: 'KABID MINKU' },
      { role: 'KABID', position: 'KABID ADA' },
      { role: 'KABID', position: 'KABID OPP' },
      { role: 'KABID', position: 'KABID KOM' },
      { role: 'KABID', position: 'KABID PBI' },
    ]
  }),
  computed: {
    filteredPostions() {
      const positions = []
      if(this.signupForm.role) {
        this.positions.forEach(position => {
          if(position.role === this.signupForm.role) {
            positions.push(position.position)
          }
        })
      }
      return positions
    },
    userProfile() { return this.$store.state.userProfile }
  },
  methods: {
    signup() {
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name,
        role: this.signupForm.role,
        position: this.signupForm.position
      })
    }
  },
  mounted() {
    if (this.userProfile) {
      this.$router.replace('/')
    }
  }
}
</script>

<style>

</style>