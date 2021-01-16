<template>
  <div>
    <b-sidebar
      lazy
      id="editarProducto"
      backdrop
      shadow
      width="600px"
      title="Editar producto"
      @shown="cargar_datos_existentes"
      @hidden="onHidden"
    >
      <div class="px-3 py-5">
        <b-form @submit.prevent="actualizar_producto">
          <b-form-group
            label="Titulo del producto"
          >
            <b-form-input
              :value="productoActual.titulo"
              @input="$v.datosForm.producto.titulo.$model = $event"
              type="text"
              placeholder="Ingresa un titulo para el producto"
              :class="{
                'is-valid' : $v.datosForm.producto.titulo.required,
                'is-invalid' : $v.datosForm.producto.titulo.$error
              }"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Código del producto"
          >
            <b-form-input
              :value="productoActual.codigo"
              @input="$v.datosForm.producto.codigo.$model = $event"
              type="text"
              placeholder="Ingresa un titulo para el producto"
              :class="{
                'is-valid' : $v.datosForm.producto.codigo.required,
                'is-invalid' : $v.datosForm.producto.codigo.$error
              }"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Tipo de producto" disabled>
            <b-form-select
              :value="productoActual.tipo"
            >
              <b-form-select-option value="perfil">
                Perfil
              </b-form-select-option>
              <b-form-select-option value="accesorio">
                Accesorio
              </b-form-select-option>
            </b-form-select>
          </b-form-group>

          <b-form-group label="Linea de producto">
            <b-form-select
              :value="productoActual.linea"
              @change="$v.datosForm.producto.linea.$model = $event"
              :class="{
                'is-valid' : $v.datosForm.producto.linea.required,
                'is-invalid' : $v.datosForm.producto.linea.$error
              }"
            >
              <b-form-select-option 
                v-for="cat in categoriasPerfiles"
                :key="cat.id"
                :value="cat.nombre">
                {{ cat.nombre }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>

          <b-form-group label="Descripcion del producto">
            <b-form-textarea
              placeholder="Ingresa una descripción..."
              rows="3"
              max-rows="3"
              :value="productoActual.detalle"
              @input="$v.datosForm.producto.detalle.$model = $event"
              :class="{
                'is-valid' : $v.datosForm.producto.detalle.required,
                'is-invalid' : $v.datosForm.producto.detalle.$error
              }"
            >
            </b-form-textarea>
          </b-form-group>

          <b-form-group label="Imagen del producto">
            <b-form-file
              accept="image/*"
              @change="imagenSeleccionada"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
            ></b-form-file>
          </b-form-group>

          <div class="text-center">
            <b-img 
              width="250px"
              class="mb-3"
              fluid
              thumbnail
              :src="!imagenSrc ? productoActual.imagenUrl : imagenSrc" 
              alt="Image 1"
            ></b-img>
          </div>

          <b-button 
            :disabled="deshabilitado || $v.$invalid"
            type="submit" variant="primary" block>Guardar cambios</b-button>

          <b-button 
            v-if="productoActual.activo"
            :disabled="deshabilitado"
            @click="pausar_producto"
            variant="secondary" block class="mt-5">
            Pausar producto
          </b-button>
          <b-button 
            v-if="!productoActual.activo"
            :disabled="deshabilitado"
            @click="activar_producto"
            variant="secondary" block class="mt-5">
            Activar producto
          </b-button>
        </b-form>
      </div>
    </b-sidebar>

  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'EditarProducto',
  validations: {
    datosForm: {
      producto: {
        titulo: { required },
        codigo: { required },
        tipo: { required },
        linea: { required },
        detalle: { required }
      }
    }
  },
  data() {
    return {
      imagenSrc: '',
      datosForm: {
        vm: this,
        producto: {
          titulo: '',
          codigo: '',
          tipo: '',
          linea: '',
          detalle: '',
          imagen: null
        }
      }
    }
  },
  computed: {
  ...mapGetters(['categoriasPerfiles', 'deshabilitado', 'productoActual'])
  },
  methods: {
    ...mapMutations(['resetProductoActual']),
    ...mapActions([
      'GET_PRODUCTOS', 
      'GET_CATEGORIAS', 
      'UPDATE_PRODUCTO',
      'UPDATE_PAUSAR_PRODUCTO',
      'UPDATE_ACTIVAR_PRODUCTO'
    ]),
    imagenSeleccionada(event) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.addEventListener('load', _ => {
        this.imagenSrc = fileReader.result;
      })
      fileReader.readAsDataURL(file);
      this.datosForm.producto.imagen = file;
    },
    actualizar_producto() {
      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.UPDATE_PRODUCTO(this.datosForm);
      }
    },
    cargar_datos_existentes() {
      this.$v.datosForm.producto.titulo.$model = this.productoActual.titulo;
      this.$v.datosForm.producto.codigo.$model = this.productoActual.codigo;
      this.$v.datosForm.producto.tipo.$model = this.productoActual.tipo;
      this.$v.datosForm.producto.linea.$model = this.productoActual.linea;
      this.$v.datosForm.producto.detalle.$model = this.productoActual.detalle;
    },
    onHidden() {
      this.imagenSrc = ''; 
      this.resetProductoActual();
    },
    pausar_producto() {
      this.UPDATE_PAUSAR_PRODUCTO({vm: this});
    },
    activar_producto() {
      this.UPDATE_ACTIVAR_PRODUCTO({vm: this});
    }
  }
}
</script>