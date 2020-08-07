import Vue from 'vue'
import Vuex from 'vuex'
import { auth, db, Timestamp } from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

let usersRef = db.collection('users')
let applicantsRef = db.collection('applicants')
let testScoresRef = db.collection('testScores')

export default new Vuex.Store({
  state: {
    drawer: true,
    loading: false,
    userProfile: {},
    applicants: [],
    applicant: {},
    testScores: [],
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
    setTestScores(state, val) {
      state.testScores = val
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
        role: 'Admin',
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

    async authUser({ dispatch, commit }, { user, phoneNumber, email }) {
      commit('setLoading', true)
      let document = usersRef.doc(user.uid)
      await document.get().then(doc => {
        if (doc.exists) {
          // Set user
          dispatch('fetchUserProfile', user)
          commit('setLoading', false)
        } else {
          // Create new user
          // console.log(document)
          if (phoneNumber !== '') {
            document.set({ 'phoneNumber': `+62${phoneNumber}`, 'role': 'Pendaftar' }, { merge: true }).then(doc => {
              // console.log('Doc:', doc)
            })
            commit('setLoading', false)
          }
          if (email !== '') {
            document.set({ 'email': email, 'role': 'Admin' }, { merge: true }).then(doc => {
              // console.log('Doc:', doc)
            })
            commit('setLoading', false)
          }

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
      data.status = 'Verifikasi berkas'
      await applicantsRef.add(data).then(doc => {
        console.log('Berhasil ditambah:', doc)
      })
      commit('setLoading', false)
    },

    async postApplicantRelation({ commit }, { id, data }) {
      commit('setLoading', true)
      data.birthdate = Timestamp.fromDate(new Date(data.birthdate))
      data.createdAt = Timestamp.fromDate(new Date())
      await applicantsRef.doc(id).collection('data').doc(data.relation).set(data, { merge: true }).then(doc => {
        console.log('Berhasil ditambah:', doc)
      })
      commit('setLoading', false)
    },

    async getApplicants({ commit }, { user }) {
      commit('setLoading', true)
      let applicants = ''
      if (user.role === 'Pendaftar') {
        applicants = applicantsRef.where('registrarUID', '==', user.uid)
      } else if (user.role === 'Admin') {
        applicants = applicantsRef
      }
      var array = []
      await applicants.get().then(snapshot => {
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
      let result 
      await applicantsRef.doc(id).get().then(doc => {
        var obj = doc.data()
        obj.id = id
        result = obj
        commit('setLoading', false)
      }).catch(error => {
        console.log('Error getting documents at getApplicant:', error)
        commit('setLoading', false)
      })

      let relation = {}
      await applicantsRef.doc(id).collection('data').get().then(snapshot => {
        snapshot.forEach(res => {
          var data = res.data()
          relation[data.relation] = data
        })
        result.data = relation
        commit('setApplicant', result)
        commit('setLoading', false)
      })
    },

    async putApplicant({ commit }, { id, data }) {
      // console.log('Data:', data)
      commit('setLoading', true)
      if (data.birthdate) { data.birthdate = Timestamp.fromDate(new Date(data.birthdate)) }
      data.editedAt = Timestamp.fromDate(new Date())
      await applicantsRef.doc(id).set(data, { merge: true }).then(() => {
        console.log('Data ' + data.name + ' berhasil diedit')
      })
      commit('setLoading', false)
    },

    async removeApplicant({ commit }, id) {
      // console.log('ID:', id)
      commit('setLoading', true)
      await applicantsRef.doc(id).delete().then(() => {
        console.log('ID ' + id + ' berhasil dihapus')
      })
      commit('setLoading', false)
    },


    /// Test Scores
    async getTestScores({ commit }, { user }) {
      commit('setLoading', true)
      let testScores = ''
      if (user.role === 'Pendaftar') {
        testScores = testScoresRef.where('registrarUID', '==', user.uid)
      } else if (user.role === 'Admin') {
        testScores = testScoresRef
      }
      var array = []
      await testScores.get().then(snapshot => {
        snapshot.forEach(doc => {
          var obj = doc.data()
          obj.id = doc.id
          array.push(obj)
        })
        commit('setTestScores', array)
        commit('setLoading', false)
      }).catch(error => {
        console.log('Error getting documents at getTestScores:', error)
        commit('setLoading', false)
      })
    },

    async postTestScore({ commit }, { user, data }) {
      commit('setLoading', true)
      let id = data.id
      delete data.id
      data.createdAt = Timestamp.fromDate(new Date())
      await testScoresRef.doc(id).set(data, { merge: true })
      await applicantsRef.doc(id).set({ status: 'Input Nilai Tes'}, { merge: true })
      commit('setLoading', false)
    },

  },
  modules: {
  }
})
