import './assets/main.css'
import axios from 'axios'
import vueAxios from 'vue-axios'
import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { ElSelect, ElOption, ElButton, ElFormItem, ElUpload, ElIcon } from 'element-plus'

const app = createApp(App)

const elComponents = [ElSelect, ElOption, ElButton, ElFormItem, ElUpload, ElIcon]

elComponents.forEach((comp) => {
  app.component(comp.name, comp)
})

app.use(vueAxios, axios)

app.use(router)

app.mount('#app')
