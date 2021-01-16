<template>
  <div>
    <Header />
    <b-jumbotron fluid header="Accesorios" class="text-center">
    </b-jumbotron>
    <b-container class="mt-5">
      <b-row class="mb-5">
        <b-col>
          <h5>Accesorios por línea</h5>
          <b-button
            size="sm"
            class="mr-2"
            variant="outline-secondary"
            to="/accesorios/todos"
            :active="$router.currentRoute.params.linea === 'todos'"
          >
            Todos los accesorios
          </b-button>
          <b-button
            :active="$router.currentRoute.params.linea === categoria.nombre"
            :to="{name: 'Accesorios', params: { linea: categoria.nombre }}"
            v-for="categoria in categoriasPerfiles" :key="categoria.id"
            size="sm" class="mr-2" variant="outline-secondary">{{ categoria.nombre }}</b-button>
        </b-col>
      </b-row>
      <div class="text-center d-block" v-if="carga">
        <b-spinner label="Cargando..."></b-spinner>
      </div>
      <b-row v-if="!carga && productosAccesorios.length > 0">
        <b-col xs="12" lg="4" v-for="producto in productosAccesorios" :key="producto.id">
          <b-card
            :title=producto.titulo
            :img-src="producto.imagenUrl"
            img-alt="Image"
            img-top
            tag="article"
            class="mb-2"
          >
          <b-card-text>
            <p class="mb-0">{{ producto.detalle }}</p>
            <small>
              Línea: {{ producto.linea }} - Código: {{ producto.codigo }}
            </small>
          </b-card-text>
          <b-button
            @click="agregar_al_presupuesto(producto); toastPresAgregado();"
            block
            class="bg-primario"
          >
            <b-icon icon="plus-circle"></b-icon> Agregar al presupuesto
          </b-button>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-if="!productosAccesorios.length && !carga">
        <p>No hay accesorios actualmente.</p>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  
  name: 'Accesorios',
  components: {
    Header,
    Footer
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'productosAccesorios', 
      'categoriasPerfiles', 
      'presupuesto',
      'carga',
      'cargando'
    ])
  },
  methods: {
    ...mapActions([
      'GET_PRODUCTOS',
      'agregar_al_presupuesto'
    ]),
    ...mapMutations([
      'productos_por_linea', 
      'todos_los_perfiles'
    ]),
    toastPresAgregado() {
      this.$bvToast.toast('Podés solicitar la cotización desde la seccion Mi presupuesto', {
        title: 'Producto agregado al presupuesto',
        autoHideDelay: 2000,
        variant: 'success',
        solid: true
      })
    }
  },
  mounted() {
    this.productos_por_linea(this.$router.currentRoute.params.linea);
    this.GET_PRODUCTOS();
  },
  watch: {
    $route(to, from) {
      this.productos_por_linea(this.$router.currentRoute.params.linea);
    }
  }
}
</script>