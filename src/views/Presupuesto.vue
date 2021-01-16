<template>
  <div>
    <Header />
    <b-jumbotron fluid header="Mi presupuesto" lead="Solicita una cotización de los productos que desees." class="text-center">
    </b-jumbotron>
    <b-container class="mt-5">
      <div v-if="presupuesto.productos.length > 0">
        <b-list-group>
          <b-list-group-item v-for="producto in presupuesto.productos" :key="producto.id" class="d-flex align-items-start">
            <b-container>
              <b-row>
              <b-col lg="9" class="d-flex align-items-center">
                <b-img width="80" :src="producto.imagenUrl"></b-img>
                <div class="px-4">
                  <h5>{{ producto.titulo }} ({{producto.linea}})</h5>
                  <small>
                    Codigo: {{ producto.codigo }} - Cantidad: {{ producto.cantidad }}
                  </small>
                </div>
              </b-col>
              <b-col lg="3" class="d-flex justify-content-end align-items-start">
                <b-button 
                  @click="sumar_al_presupuesto(producto.id)"
                  variant="outline-secondary"><b-icon icon="plus"></b-icon></b-button>
                <b-button 
                  :disabled="producto.cantidad <= 1"
                  @click="restar_al_presupuesto(producto.id)"
                  variant="outline-secondary" class="ml-3"><b-icon icon="dash"></b-icon></b-button>
                <b-button 
                  @click="eliminar_del_presupesto(producto.id)"
                  variant="outline-danger" class="ml-3"><b-icon icon="backspace"></b-icon></b-button>
              </b-col>
            </b-row>
            </b-container>
            
          </b-list-group-item>
        </b-list-group>
        <div class="my-3">
          <h3 class="mb-3 text-center">Datos de contacto</h3>
          <b-form-group label="Nombre completo">
            <b-form-input
              type="text"
              v-model="$v.cliente.nombre.$model"
              :class="{'is-valid' : !$v.cliente.nombre.$invalid, 'is-invalid' : $v.cliente.nombre.$error}"
              placeholder="Ingresá tu nombre completo"
            ></b-form-input>
            <small class="text-danger"
              v-if="$v.cliente.nombre.$error"
            >
              El campo es obligatorio
            </small>
          </b-form-group>
          <b-form-group label="Email de contacto">
            <b-form-input
              v-model="$v.cliente.email.$model"
              :class="{'is-valid' : $v.cliente.email.email && !$v.cliente.email.$invalid, 'is-invalid' : $v.cliente.email.$error}"
              type="email"
              placeholder="Ingresá tu email"
            ></b-form-input>
            <small class="text-danger"
              v-if="$v.cliente.email.$error"
            >
              Ingresa un email valido
            </small>
          </b-form-group>
          <b-form-group label="Teléfono de contacto">
            <b-form-input
              v-model="$v.cliente.telefono.$model"
              :class="{'is-valid' : $v.cliente.telefono.numeric && !$v.cliente.telefono.$invalid, 'is-invalid' : $v.cliente.telefono.$error}"
              type="text"
              placeholder="Ingresá tu teléfono"
            ></b-form-input>
            <small class="text-danger"
              v-if="!$v.cliente.telefono.numeric"
            >
              Ingresa solamente números para el teléfono
            </small>
          </b-form-group>

          <b-form-group label="Forma de entrega">
            <b-form-radio-group 
              @change="cambioEntrega($event)"
              v-model="cliente.entrega" name="radio-sub-component">
              <b-form-radio value="retiro">Retiro personal</b-form-radio>
              <b-form-radio value="envio">Entrega por encomienda</b-form-radio>
            </b-form-radio-group>
          </b-form-group>

          <div v-if="cliente.entrega === 'envio'">
            <b-input-group class="mb-4">
              <b-form-input 
                :class="{'is-valid' : !$v.cliente.envio.localidad.$invalid, 'is-invalid' : $v.cliente.envio.localidad.$error}"
                v-model="$v.cliente.envio.localidad.$model" aria-label="Localidad" placeholder="Localidad"></b-form-input>
              <b-form-input 
                :class="{'is-valid' : !$v.cliente.envio.provincia.$invalid, 'is-invalid' : $v.cliente.envio.provincia.$error}"
                v-model="$v.cliente.envio.provincia.$model" aria-label="Provincia" placeholder="Provincia"></b-form-input>
              <b-form-input 
                :class="{'is-valid' : !$v.cliente.envio.cp.$invalid, 'is-invalid' : $v.cliente.envio.cp.$error}"
                v-model="$v.cliente.envio.cp.$model" aria-label="Código postal" placeholder="Código postal"></b-form-input>
            </b-input-group>
          </div>

          <p>Todos tus datos estan protegidos, te contactaremos a la brevedad con la cotización de tu presupuesto.</p>
        </div>
      </div>
      <div v-else>
        <b-alert show variant="secondary">
          <h4 class="alert-heading">No hay productos en el presupuesto</h4>
          <p>
            Probá agregando los productos de nuestro catalogo al presupuesto. Luego podrás enviarnos tu solicitud para recibir una cotización y mayor asesoramiento.
          </p>
          <hr>
          <p class="mb-0">
            <b-button to="/perfiles/todos" class="primario" variant="link">Consultá nuestro catálogo</b-button>
            <b-button to="/contacto" class="primario" variant="link">Hacenos todas tus consultas</b-button>
          </p>
        </b-alert>
      </div>
      <b-button
        :disabled="presupuesto.productos.length <= 0 || $v.$invalid || carga"
        @click="enviar_presupuesto"
        class="mt-5 py-3 bg-primario" block>Solicitar presupuesto</b-button>
        <b-alert show v-if="mensaje" class="mt-3">
          {{ mensaje }}
        </b-alert>
    </b-container>
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { required, email, numeric } from 'vuelidate/lib/validators'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'Presupuesto',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      cliente: {
        vm: this,
        nombre: '',
        email: '',
        telefono: '',
        entrega: 'retiro',
        envio: {
          localidad: '0',
          provincia: '0',
          cp: '0'
        }
      }
    }
  },
  validations: {
    cliente: {
      nombre: { required },
      email: { email, required },
      telefono: { required, numeric },
      envio: {
        localidad: { required },
        provincia: { required },
        cp: { required },
      }
    }
  },
  computed: {
    ...mapGetters([
      'presupuesto',
      'carga',
      'mensaje'
    ])
  },
  methods: {
    ...mapMutations([
      'sumar_al_presupuesto',
      'restar_al_presupuesto',
      'eliminar_del_presupesto'
    ]),
    ...mapActions([
      'POST_PRESUPUESTO'
    ]),
    enviar_presupuesto() {
    if (!this.$v.$invalid) {
      this.POST_PRESUPUESTO(this.cliente);
    } else {
      this.$v.$touch();
      console.log('error')
    }
  },
  cambioEntrega(checked) {
    if (checked === 'envio') {
      this.$v.cliente.envio.localidad.$model = '';
      this.$v.cliente.envio.provincia.$model = '';
      this.$v.cliente.envio.cp.$model = '';
      this.$v.cliente.envio.$reset();
    }
    if (checked === 'retiro') {
      this.$v.cliente.envio.localidad.$model = '0';
      this.$v.cliente.envio.provincia.$model = '0';
      this.$v.cliente.envio.cp.$model = '0';
    }
  }
  },
}
</script>