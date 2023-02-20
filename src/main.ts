import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import { token } from './token'


const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: token,
  },
})

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.provide(DefaultApolloClient, client)
app.use(router)
app.mount('#app')
