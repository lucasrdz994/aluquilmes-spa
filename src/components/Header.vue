<template>
  <b-navbar toggleable="lg" type="light" variant="light" id="nav">
    <b-navbar-brand href="#">
      <img width="250px" src="../assets/logo.png" alt="Kitten">
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item-dropdown text="Perfilería" right>
          <div class="text-center" v-if="carga">
            <b-spinner small label="Cargando..."></b-spinner>
          </div>
          <b-dropdown-item
            v-else
            v-for="categoria in categoriasPerfiles" :key="categoria.id"
            :to="{name: 'Perfiles', params: {linea: categoria.nombre}}">
            
            {{ categoria.nombre }}

          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item :to="{name: 'Accesorios', params: { linea: 'todos' }}">Accesorios</b-nav-item>
        <b-nav-item to="/contacto">Contacto</b-nav-item>
        <b-nav-item to="/presupuesto">
          <b-icon icon="file-text"></b-icon> Mi presupuesto
        </b-nav-item>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Header',
  computed: {
    ...mapGetters(['categoriasPerfiles', 'carga'])
  },
  methods: {
    ...mapActions(['GET_CATEGORIAS'])
  },
  mounted() {
    this.GET_CATEGORIAS();
  }
}
</script>