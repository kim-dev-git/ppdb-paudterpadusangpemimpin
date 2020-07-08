<template>
  <div id="login">
    <section
      class="pt-4">
      <p class="mb-2 text-center headline">APEL-Bulog</p>
      <p class="my-0 text-center title">Sign in</p>
      <p class="my-0 text-center body-2">with your Google Account</p>
      <v-layout
        column class="mt-6 px-6">
        <v-text-field outlined type="email" label="Email" v-model.trim="loginForm.email" class="mb-n4" />
        <v-text-field outlined type="password" label="Password" v-model.trim="loginForm.password" />
      </v-layout>
      <v-btn text color="primary" class="mt-n10 ml-2 text-none subtitle-2" to="/lupapassword">Lupa password?</v-btn>
      <v-footer
        absolute
        padless
        class="pb-4 font-weight-medium white"
      >
        <v-layout
          class="pl-2 pr-6 bottom">
          <v-btn text color="primary" class="text-none" to="/daftar">
            Buat akun
          </v-btn>
          <v-spacer />
          <v-btn @click="login()"
            depressed color="primary" class="text-none px-6">
            Login
          </v-btn>
        </v-layout>
      </v-footer>
    </section>
  </div>
</template>

<script>
export default {
  data: () => ({
    loginForm: {
      email: '',
      password: '',
    }
  }),
  methods: {
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    }
  }
}
</script>

<style>

</style>