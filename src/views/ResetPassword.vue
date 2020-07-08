<template>
  <div id="login">
    <section v-if="!showSuccess"
      class="pt-4">
      <p class="mb-2 text-center headline">APEL-Bulog</p>
      <p class="my-0 text-center title">Lupa password</p>
      <p class="my-0 text-center body-2">Masukkan email anda untuk reset password</p>
      <p v-if="errorMsg !== ''" class="error">{{ errorMsg }}</p>
      <v-layout
        column class="mt-6 px-6">
        <v-text-field outlined type="email" label="Email" v-model.trim="email" class="mb-n4" />
      </v-layout>
      <v-footer
        absolute
        padless
        class="pb-4 font-weight-medium white"
      >
        <v-layout
          class="pl-2 pr-6 bottom">
          <v-btn text color="primary" class="text-none" to="/login">
            Kembali
          </v-btn>
          <v-spacer />
          <v-btn @click="resetPassword()"
            depressed color="primary" class="text-none px-6">
            Login
          </v-btn>
        </v-layout>
      </v-footer>
    </section>
    <section v-if="showSuccess">
      <p class="mb-2 text-center headline">APEL-Bulog</p>
      <p class="my-0 text-center title">Password berhasil direset</p>
      <p class="my-0 text-center body-2">Silahkan cek email anda</p>
      <v-footer
        absolute
        padless
        class="pb-4 font-weight-medium white"
      >
        <v-layout
          class="pl-2 pr-6 bottom">
          <v-btn text color="primary" class="text-none" to="/login">
            Kembali
          </v-btn>
        </v-layout>
      </v-footer>
    </section>
  </div>
</template>

<script>
import { auth } from '@/firebase'
export default {
  data: () => ({
    email: '',
    showSuccess: false,
    errorMsg: ''
  }),
  methods: {
    async resetPassword() {
      this.errorMsg = ''

      try {
        await auth.sendPasswordResetEmail(this.email)
        this.showSuccess = true
      } catch (err) {
        this.errorMsg = err.message
      }
    }
  }
}
</script>

<style>

</style>