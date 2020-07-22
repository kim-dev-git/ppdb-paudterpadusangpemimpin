import Vue from 'vue'
import Vuex from 'vuex'
import { auth, db, Timestamp } from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

let usersRef = db.collection('users')
let applicantsRef = db.collection('applicants')

export default new Vuex.Store({
  state: {
    drawer: true,
    loading: false,
    userProfile: {},
    applicants: [],
    applicant: {}
  },
  mutations: {
    setLoading(state, val) {
      state.loading = val
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setApplicants(state, val) {
      state.applicants = val
    },
    setApplicant(state, val) {
      state.applicant = val
    },
  },
  actions: {
    async login({ dispatch, commit }, form) {
      commit('setLoading', true)
      // sign user in
      const { user } = await auth.signInWithEmailAndPassword(form.email, form.password)
      commit('setLoading', false)
  
      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      commit('setLoading', true)

      // fetch user profile
      const userProfile = await db.collection('users').doc(user.uid).get()
  
      // set user profile in state
      var data = userProfile.data()
      data.uid = user.uid
      commit('setUserProfile', data)
      commit('setLoading', false)

      if(userProfile.data().name) {
        // change route to dashboard
        if (router.currentRoute.path === '/login' || router.currentRoute.path === '/daftar' || router.currentRoute.path === '/lupapassword') {
          router.push('/')
        }
      } else {
        if (router.currentRoute.path !== '/profil') {
          router.push('/profil')
        }
      }
    },
    async signup({ dispatch, commit }, form) {
      commit('setLoading', true)
      // sign user up
      const { user } = await auth.createUserWithEmailAndPassword(form.email, form.password)
    
      // create user profile object in userCollections
      await db.collection('users').doc(user.uid).set({
        name: form.name,
        email: form.email,
        role: form.role,
        position: form.position,
      })

      commit('setLoading', false)
    
      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async logout({ commit }) {
      await auth.signOut()
    
      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login')
    },

    async authUser({ dispatch, commit }, { user, phoneNumber }) {
      commit('setLoading', true)
      let document = usersRef.doc(user.uid)
      await document.get().then(doc => {
        if (doc.exists) {
          // Set user
          dispatch('fetchUserProfile', user)
          commit('setLoading', false)
        } else {
          // Create new user
          console.log(document)
          document.set({ 'phoneNumber': `+62${phoneNumber}`, 'role': 'Pendaftar' }, { merge: true }).then(doc => {
            console.log('Doc:', doc)
          })
          commit('setLoading', false)
          

          // Api.set('users', uid, { 'phoneNumber': `+62${phoneNumber}`, 'role': 'Pengunjung' })
          // //console.log('Create new user with:', uid, phoneNumber)
          // dispatch('getUser', uid).then(() => {
          //   if(router.currentRoute.path !== '/profil') { router.push('/profil') }
          // })
        }
      }).catch(function(error) {
        console.log("Error at authUser:", error);
      })
    },

    async changeName({ dispatch, commit }, { user, name }) {
      commit('setLoading', true)
      let document = usersRef.doc(user.uid)
      await document.set({ name: name }, { merge: true }).then(() => {
        dispatch('fetchUserProfile', user)
        commit('setLoading', false)
        // router.push('/')
      })
    },

    /// Applicants
    async postApplicants({ commit }, { user, data }) {
      commit('setLoading', true)
      data.registrarUID = user.uid
      data.registrarName = user.name
      data.birthdate = Timestamp.fromDate(new Date(data.birthdate))
      data.createdAt = Timestamp.fromDate(new Date())
      await applicantsRef.add(data).then(doc => {
        console.log('Berhasil ditambah:', doc)
      })
      commit('setLoading', false)
    },

    async getApplicants({ commit }, { user }) {
      commit('setLoading', true)
      let applicants = ''
      // if (user.role === 'Pendaftar')
      // applicants = applicantsRef.where('registrar', '==', user.uid)
      var array = []
      await applicantsRef.where('registrarUID', '==', user.uid).get().then(snapshot => {
        snapshot.forEach(doc => {
          var obj = doc.data()
          obj.id = doc.id
          array.push(obj)
        })
        commit('setApplicants', array)
        commit('setLoading', false)
      }).catch(error => {
        console.log('Error getting documents at getApplicants:', error)
        commit('setLoading', false)
      })
    },

    async getApplicant({ commit }, { id }) {
      commit('setLoading', true)
      await applicantsRef.doc(id).get().then(doc => {
        var obj = doc.data()
        obj.id = id
        commit('setApplicant', obj)
        commit('setLoading', false)
      }).catch(error => {
        console.log('Error getting documents at getApplicant:', error)
        commit('setLoading', false)
      })
    },

    async putApplicant({ commit }, { id, data }) {
      // console.log('Data:', data)
      commit('setLoading', true)
      data.birthdate = Timestamp.fromDate(new Date(data.birthdate))
      data.editedAt = Timestamp.fromDate(new Date())
      await applicantsRef.doc(id).set(data, { merge: true }).then(() => {
        console.log('Data ' + data.name + ' berhasil diedit')
      })
      commit('setLoading', false)
    },

  },
  modules: {
  }
})
