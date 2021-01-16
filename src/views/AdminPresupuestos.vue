<template>
  <div>
    <div class="text-center d-block my-5" v-if="carga">
      <b-spinner label="Cargando..."></b-spinner>
    </div>
    <b-container v-else class="my-3">
      <div class="d-flex justify-content-between">

        <h3>Listado de presupuestos</h3>
        <div>
          <b-button 
            v-if="alternar_archivados === 'activos'"
            @click="alternar_presupuestos('archivados')" 
            variant="link"
          >
            Ver archivados
          </b-button>
          <b-button 
            v-if="alternar_archivados === 'archivados'"
            @click="alternar_presupuestos('activos')" 
            variant="link"
          >
            Ver activos
          </b-button>
        </div>
      </div>
      <b-row>
        <b-col>
          <b-form-group>
            <b-form-input
              v-model="textoBuscado"
              type="text"
              placeholder="Busca por nombre de cliente"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group>
            <b-form-select
              v-model="estadoBuscado"
            >
              <b-form-select-option value="todos">
                Todos
              </b-form-select-option>
              <b-form-select-option v-for="estado in estados" :key="estado.id" :value="estado.value">
                {{ estado.text }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-list-group v-if="presupuestos.length > 0">
        <b-list-group-item 
          class="py-0 px-0"
          @click="presupuestoActual = p" button v-for="p in presupuestos" :key="p.id">
          <div 
            class="py-3 px-3 d-flex justify-content-between align-items-center"
            v-b-toggle.detallePresupuesto>
            <div>
              <h5 class="mb-0">Presupuesto de {{ p.cliente.nombre }}</h5>
              <small>Solicitado el {{ p.fecha_solicitado }}</small>
            </div>
            <b-badge v-if="!p.archivado" class="my-3 mx-3" variant="primary" pill>{{ p.estado }}</b-badge>
            <b-badge v-if="p.archivado" class="my-3 mx-3" variant="dark" pill>archivado</b-badge>
          </div>
        </b-list-group-item>
      </b-list-group>
      <div v-else>
        No se encontraron presupuestos con los filtros actuales
      </div>
    </b-container>
    <b-sidebar
      lazy
      id="detallePresupuesto"
      backdrop
      shadow
      width="600px"
      :title="`Presupuesto de ${presupuestoActual.cliente.nombre}`"
    >
      <small class="px-3">Solicitado el {{ presupuestoActual.fecha_solicitado }}</small>
      <div class="px-3 py-3">
        <h5 class="mb-3">Productos solicitados</h5>
        <b-list-group>
          <b-list-group-item
            v-for="p in presupuestoActual.productos" :key="p.idPresupuesto"
            class="d-flex justify-content-between align-items-center">
            <div>
              <p class="mb-0">
              {{ p.titulo }}
              </p>
              <small>
                Código: {{ p.codigo }} - Línea: {{ p.linea }}
              </small>
            </div>
            <b-badge variant="primary" pill>{{ p.cantidad }}</b-badge>
          </b-list-group-item>
        </b-list-group>

        <h5 class="my-3">Datos del cliente</h5>
        <b-list-group>
          <b-list-group-item>Nombre: {{ presupuestoActual.cliente.nombre }}</b-list-group-item>
          <b-list-group-item>Email: {{ presupuestoActual.cliente.email }}</b-list-group-item>
          <b-list-group-item>Teléfono: {{ presupuestoActual.cliente.telefono }}</b-list-group-item>
        </b-list-group>

        <h5 class="my-3">Entrega</h5>
        <b-list-group v-if="presupuestoActual.cliente.entrega === 'envio'">
          <b-list-group-item>Localidad: {{ presupuestoActual.cliente.envio.localidad }}</b-list-group-item>
          <b-list-group-item>Código postal: {{ presupuestoActual.cliente.envio.cp }}</b-list-group-item>
          <b-list-group-item>Provincia: {{ presupuestoActual.cliente.envio.provincia }}</b-list-group-item>
        </b-list-group>
        <p v-else>Retiro en persona.</p>

        <div v-if="!presupuestoActual.archivado">
          <h5 class="mt-2">Administrar presupuesto</h5>

          <b-form-select 
            :value="presupuestoActual.estado" 
            :options="estados" 
            @change="actualizar_estado"
            :disabled="deshabilitado"
          >
          </b-form-select>
          
          <b-button
            :disabled="deshabilitado"
            @click="archivar_presupuesto" class="mt-3" block variant="secondary">Archivar presupuesto</b-button>
        </div>
        <div v-if="presupuestoActual.archivado">
          <p class="text-info my-3">Estado del presupuesto: {{ presupuestoActual.estado }}</p>
          <b-button 
            :disabled="deshabilitado"
            @click="activar_presupuesto" class="mt-3" block variant="secondary">Activar nuevamente</b-button>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'AdminPresupuestos',
  data() {
    return {
      estados: [
        { value: 'pendiente', text: 'Pendiente' },
        { value: 'cotizado', text: 'Cotizado' },
        { value: 'aceptado', text: 'Aceptado' },
        { value: 'concretado', text: 'Concretado' },
        { value: 'cancelado', text: 'Cancelado' }
      ],
      alternar_archivados: 'activos'
    }
  },
  computed: {
    ...mapGetters(['presupuestos', 'carga', 'mensaje', 'deshabilitado']),
    estadoBuscado: {
      get() {
        return this.$store.state.estadoBuscado
      },
      set(val) {
        this.$store.commit('buscador_estado_presupuesto', val);
      }
    },
    textoBuscado: {
      get() {
        return this.$store.state.textoBuscado
      },
      set(val) {
        this.$store.commit('buscador_presupuesto', val);
      }
    },
    presupuestoActual: {
      get() {
        return this.$store.state.presupuestoActual
      },
      set(val) {
        this.$store.commit('presupuesto_seleccionado', val);
      }
    }
  },
  methods: {
    ...mapActions([
      'GET_PRESUPUESTOS', 
      'UPDATE_ESTADO', 
      'GET_PRESUPUESTOS_ARCHIVADOS',
      'UPDATE_ARCHIVAR_PRESUPUESTO',
      'UPDATE_ACTIVAR_PRESUPUESTO'
    ]),
    archivar_presupuesto() {
      this.UPDATE_ARCHIVAR_PRESUPUESTO({vm: this})
    },
    activar_presupuesto() {
      this.UPDATE_ACTIVAR_PRESUPUESTO({vm: this})
    },
    actualizar_estado(estado) {
      this.UPDATE_ESTADO({
        estado,
        vm: this
      })
    },
    alternar_presupuestos(alt) {
      if (alt === 'archivados') {
        this.alternar_archivados = alt;
        this.GET_PRESUPUESTOS_ARCHIVADOS();
      } else if (alt === 'activos') {
        this.alternar_archivados = alt;
        this.GET_PRESUPUESTOS();
      }

    }
  },
  mounted() {
    this.GET_PRESUPUESTOS();
  }
}
</script>