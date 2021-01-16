<template>
  <div>
    <div class="text-center d-block my-5" v-if="carga">
      <b-spinner label="Cargando..."></b-spinner>
    </div>
    <b-container v-else class="my-3">
      <div class="d-flex justify-content-between">

        <h3>Listado de productos</h3>
        <div>
          <b-button
            v-b-toggle.agregarProducto
            variant="link"
          >
            Agregar nuevo producto
          </b-button>
        </div>
      </div>
      <b-row>
        <b-col>
          <b-form-group>
            <b-form-input
              v-model="textoBuscado"
              type="text"
              placeholder="Busca por nombre de producto"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group>
            <b-form-select
              v-model="tipoBuscado"
            >
              <b-form-select-option value="todos">
                Todos
              </b-form-select-option>
              <b-form-select-option v-for="tipo in tipos" :key="tipo.id" :value="tipo.value">
                {{ tipo.text }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-list-group v-if="productosFiltrados.length > 0">
        <b-list-group-item 
          class="py-0 px-0"
          @click="productoActual = p" button v-for="p in productosFiltrados" :key="p.id">
          <div 
            class="py-3 px-3 d-flex justify-content-between align-items-center"
            v-b-toggle.editarProducto>
            <div>
              <h5 class="mb-0">{{ p.titulo }}</h5>
              <small>Código: {{ p.codigo }} - Línea: {{ p.linea }}</small>
            </div>
            <b-badge v-if="p.activo" class="my-3 mx-3" variant="primary" pill>activo</b-badge>
            <b-badge v-if="!p.activo" class="my-3 mx-3" variant="dark" pill>pausado</b-badge>
          </div>
        </b-list-group-item>
      </b-list-group>
      <div v-else>
        No se encontraron productos con los filtros actuales.
      </div>

      <EditarProducto />

      <NuevoProducto />

    </b-container>

  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

import EditarProducto from '@/components/EditarProducto'
import NuevoProducto from '@/components/NuevoProducto'

export default {
  name: 'AdminProductos',
  components: {
    EditarProducto,
    NuevoProducto
  },
  data() {
    return {
      alternar_pausados: 'activos',
      tipoBuscado: 'todos',
      tipos: [
        {value: 'perfil', text: 'Perfíles'},
        {value: 'accesorio', text: 'Accesorios'},
      ],
      textoBuscado: ''
    }
  },
  computed: {
  ...mapGetters(['carga', 'productosTodos']),
  productosFiltrados() {
    if (this.tipoBuscado === 'todos') {
      return this.productosTodos.filter(p => p.titulo.toLowerCase().indexOf(this.textoBuscado.toLowerCase()) >= 0)
    } else {
      return this.productosTodos.filter(p => p.titulo.toLowerCase().indexOf(this.textoBuscado.toLowerCase()) >= 0 && p.tipo === this.tipoBuscado)
    }
  },
  productoActual: {
      get() {
        return this.$store.state.productoActual
      },
      set(val) {
        this.$store.commit('producto_seleccionado', val);
      }
    }
  },
  methods: {
    ...mapActions(['GET_PRODUCTOS', 'GET_CATEGORIAS']),
    ...mapMutations(['productos_por_linea'])
  },
  mounted() {
    this.productos_por_linea('todos');
    this.GET_CATEGORIAS();
    this.GET_PRODUCTOS();
  }
}
</script>