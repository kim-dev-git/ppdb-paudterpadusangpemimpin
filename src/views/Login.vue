<template>
  <div id="login">
    <v-app-bar
      app flat dark dense class="primary" >
      <v-layout class="ml-n3 align-center">
        <v-card-title class="font-weight-regular">PPDB-PAUD Sang Pemimpin</v-card-title>
      </v-layout>
    </v-app-bar>

    <section
      class="pt-4 mt-12">
      <v-container>
        <!-- <p class="mb-2 text-center headline">PPDB-PAUD Terpadu Sang Pemimpin</p> -->
        <v-layout class="justify-center">
          <img alt="Logo" src="../assets/logo.png">
        </v-layout>
        <p class="my-0 text-center title">Masuk</p>
        <p class="my-0 text-center body-2">menggunakan Nomor HP</p>
        <v-layout
          column class="mt-6 px-2">
          <v-text-field type="number" label="Nomor HP" v-model.trim="phoneNumber" prefix="+62" placeholder="8xx xxxx xxxx" class="mb-n4" />
        </v-layout>
        
        <div id="recaptcha-container" />

        <v-footer
          absolute
          padless
          class="pb-4 font-weight-medium white"
        >
          <v-layout
            class="pl-2 pr-6 bottom align-center">
            <v-btn
              text
              color="primary"
              class="ml-n2 text-none"
              to="/loginadmin" >
              Login sebagai admin
            </v-btn>
            <v-spacer />
            <v-btn @click="sendOTP()"
              icon large color="white" class="primary">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-layout>
        </v-footer>
      </v-container>
    </section>
    

    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-model="dialog">
      <v-card>
        <v-toolbar
          dark tile color="primary">
          <v-layout
            class="align-center">
            <v-btn
              @click="dialog = false"
              icon class="ml-n2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <p class="ml-4 mb-0 title">Verifikasi Nomor HP</p>
          </v-layout>
        </v-toolbar>
        <v-layout column class="pt-4 justify-center">
          <p class="subtitle-2 text-center">Masukkan Kode OTP</p>
          <p class="mb-0 body-2 text-center text--secondary">Kami telah mengirim SMS dengan kode OTP ke nomor</p>
          <p class="body-2 text-center font-weight-bold text--secondary">+62 {{ phoneNumber }}</p>
          <v-layout class="mt-4 justify-center">
            <div v-for="i in 6" :key="i" style="width: 32px" class="mx-1 font-weight-bold">
              <v-text-field
                type="number"
                :ref="`kode${i}`"
                v-model="code[i]"
                oninput="if(this.value.length > 1) this.value = this.value[1]"
                @input="changeFocus(i)"
                class="centered-input" />
            </div>
          </v-layout>
          <v-layout
            class="mt-4 justify-center">
            <v-btn
              text
              color="primary"
              class="text-none body-2">
              Tidak mendapat kode OTP?
            </v-btn>
          </v-layout>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { auth, db, RecaptchaVerifier } from '@/firebase'
export default {
  data: () => ({
    code: {},
    dialog: false,
    phoneNumber: '',
    appVerifier: ''
  }),
  computed: {
    otp() {
      var otp = ''
      var myObj = this.code
      for (var key in myObj) {
        if (!myObj.hasOwnProperty(key)) continue;

        var obj = myObj[key]
        for (var prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) continue;

            // your code
            otp = otp + String(obj[prop])
            // alert(prop + " = " + obj[prop])
        }
      }
      return otp
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    changeFocus(i) {
      if(i < 6) {
        const element = this.$refs['kode'+(i+1)][0].$refs.input
        this.$nextTick(() => {
          element.focus()
        })
      } else {
        this.verifyOtp()
      }
    },
    sendOTP() {
      // this.dialog = true
      if(this.phoneNumber.length < 11){
        alert('Nomor HP tidak valid!');
      }else{
        let vm = this
        ///fb.auth().settings.appVerificationDisabledForTesting = true
        //
        let countryCode = '+62' //Indonesia
        let phoneNumber = countryCode + this.phoneNumber
        ///let phoneNumber = countryCode + '895634775900'
        //let verifCode = '111111'
        //
        let appVerifier = this.appVerifier
        //
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(function (confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult
            //return confirmationResult.confirm(verifCode)
            //
            //alert('SMS sent')
            vm.dialog = true
          }).catch(function (error) {
          // Error; SMS not sent
          // ...
          alert('Error ! SMS not sent')
        });
      }
    },
    verifyOtp(){
      if(this.otp.length != 6){
        alert('Invalid Phone Number/OTP Format !');
      }else{
        //
        let vm = this
        let code = this.otp
        //
        //var credential = fb.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code)
        //console.log('credential', credential)
        window.confirmationResult.confirm(code).then(function (result) {
          // User signed in successfully.
          var user = result.user
          console.log(user)
          //vm.$store.dispatch('authUser', { uid: user.uid, phoneNumber: vm.phoneNumber })
          // ...
          //route to set password !
          //vm.$router.push({path:'/setPassword'})
        }).catch(function (error) {
          console.log(error)
          // User couldn't sign in (bad verification code?)
          // ...
        });
      }
    },

    initReCaptcha(){
      setTimeout(()=>{
        let vm = this
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'callback': function(response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
          },
          'expired-callback': function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          }
        });
        //
        this.appVerifier =  window.recaptchaVerifier
      },1000)
    },
  },
  created(){
    this.initReCaptcha()
  },
}
</script>

<style scoped>
  .centered-input >>> input {
    text-align: center !important;
  }
</style>