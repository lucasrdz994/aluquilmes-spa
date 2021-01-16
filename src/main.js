import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import { auth } from './firebase'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuelidate)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

auth.onAuthStateChanged(usuario => {
  if (usuario) {
    const detectoUsuario = {
      email: usuario.email,
      uid: usuario.uid
    }
    store.dispatch('DETECTAR_USUARIO', detectoUsuario);
  } else {
    store.dispatch('DETECTAR_USUARIO', usuario);
  }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  
})
