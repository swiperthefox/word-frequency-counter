import MainPage from 'pages/Main.vue'
import AddDocument from 'pages/AddDocument'

const routes = [
  {
    path: '/',
    component: MainPage
  },
  {
    path: '/adddoc',
    component: AddDocument
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
