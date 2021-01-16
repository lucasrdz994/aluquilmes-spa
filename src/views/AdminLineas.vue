<template>
  <div>
    <div class="text-center d-block my-5" v-if="carga">
      <b-spinner label="Cargando..."></b-spinner>
    </div>
    <b-container class="my-3" v-else>
      <b-list-group v-if="categoriasPerfiles.length > 0">
        <b-list-group-item 
          class="py-0 px-0"
          @click="categoriaActual = cat" button v-for="cat in categoriasPerfiles" :key="cat.id">
          <div 
            class="py-3 px-3 d-flex justify-content-between align-items-center"
            v-b-toggle.editarLinea>
            <div>
              <h5 class="mb-0">{{ cat.nombre }}</h5>
              <small>link</small>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>

      <EditarLinea />
    </b-container>
  </div>
</template>

<script>
import EditarLinea from '@/components/EditarLinea'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdminLineas',
  components: {
    EditarLinea
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'categoriasPerfiles',
      'categoriaActual',
      'carga'
    ]),
    categoriaActual: {
      get() {
        return this.$store.state.categoriaActual
      },
      set(val) {
        this.$store.commit('categoria_seleccionada', val);
      }
    }
  },
  methods: {
    ...mapActions([
      'GET_CATEGORIAS'
    ])
  },
  mounted() {
    this.GET_CATEGORIAS();
  }
}
</script>