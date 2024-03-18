import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import VueMoment from 'vue-moment'
import 'vue-toastification/dist/index.css'
import router from './router'
import store from './store'
import App from './App.vue'
import { permissionAbility } from '@/helpers/helpers'

// To show toaster
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { mapGetters } from 'vuex'

// Pusher
import { pusherChannel, pusherAppKey } from '../pusher-config.js'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'

// helpers
import axios from '@/helpers/axios'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// global filter
// time formatter
Vue.use(VueMoment)

// global axios
Vue.prototype.$api = axios
// permissionAbility
Vue.prototype.$permissionAbility = permissionAbility

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

// pusher notification
const Pusher = require('pusher-js')

const pusher = new Pusher(pusherAppKey, {
  cluster: 'ap2',
})

const channel = pusher.subscribe(pusherChannel)

const user = store.getters['userModule/getUser']

channel.bind('notification-' + user?.id, function (data) {
  let incomingNotificationCount =
    store.getters['userModule/getIncomingNotificationCount']

  incomingNotificationCount++

  store.dispatch('userModule/setIncomingNotificationCount', {
    incomingNotificationCount,
  })

  const notificationSound = new Audio(require('@/assets/notification.mp3'))

  Vue.prototype.$toast(
    {
      component: ToastificationContent,
      props: {
        title: 'Notification',
        icon: 'BellIcon',
        variant: 'warning',
        text: `${data?.data?.message}`,
      },
    },
    {
      timeout: 8000,
    }
  )

  notificationSound.play()
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
