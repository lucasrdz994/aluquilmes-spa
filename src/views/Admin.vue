<template>
  <div>
    <b-container>
      <b-card class="my-5">
        <b-card-title class="d-flex justify-content-between align-items-center">
          Panel de administracion
          <b-button @click="LOGOUT" variant="outline-danger">Cerrar sesión</b-button>
        </b-card-title>

      <b-button to="/admin/presupuestos" variant="link">Presupuestos</b-button>
      <b-button to="/admin/productos" variant="link">Productos</b-button>
      <b-button to="/admin/lineas" variant="link">Lineas</b-button>

      <router-view />

      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'Admin',
  methods: {
    ...mapActions(['LOGOUT'])
  }
}
</script>

<style scoped>
  .router-link-exact-active {
    text-decoration: underline;
  }
</style>