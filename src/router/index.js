import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
import Home from '../views/Home.vue'
import Perfiles from '../views/Perfiles.vue'
import Accesorios from '../views/Accesorios.vue'
import Contacto from '../views/Contacto.vue'
import Presupuesto from '../views/Presupuesto.vue'
import Acceso from '../views/Acceso.vue'
import Admin from '../views/Admin.vue'
import AdminPresupuestos from '../views/AdminPresupuestos.vue'
import AdminProductos from '../views/AdminProductos.vue'
import AdminLineas from '../views/AdminLineas.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '*',
    name: 'Default',
    component: Home
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Inicio' }
  },
  {
    path: '/perfiles/:linea',
    name: 'Perfiles',
    component: Perfiles,
    meta: { title: 'Perfiles' }
  },
  {
    path: '/accesorios/:linea',
    name: 'Accesorios',
    component: Accesorios,
    meta: { title: 'Accesorios' }
  },
  {
    path: '/contacto',
    name: 'Contacto',
    component: Contacto,
    meta: { title: 'Contacto' }
  },
  {
    path: '/presupuesto',
    name: 'Presupuesto',
    component: Presupuesto,
    meta: { title: 'Mi presupuesto' }
  },
  {
    path: '/acceso',
    name: 'Acceso',
    component: Acceso,
    meta: { title: 'Acceso' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'presupuestos',
        name: 'AdminPresupuestos',
        component: AdminPresupuestos,
        meta: { requiresAuth: true, title: 'Administración' }
      },
      {
        path: 'productos',
        name: 'AdminProductos',
        component: AdminProductos,
        meta: { requiresAuth: true, title: 'Administración' }
      },
      {
        path: 'lineas',
        name: 'AdminLineas',
        component: AdminLineas,
        meta: { requiresAuth: true, title: 'Administración' }
      }
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // Informa si existe una sesion iniciada
    const usuario = auth.currentUser;
    if (!usuario) {
      next({path: '/acceso'})
    } else {
      next();
    }
  } else {
    next();
  }
})

router.afterEach((to, from) => {
  Vue.nextTick(() => {
      document.title = to.meta.title || 'AluQuilmes';
  });
});

export default router
