<template>
  <div>
    <b-sidebar
      lazy
      id="agregarProducto"
      backdrop
      shadow
      width="600px"
      title="Crear nuevo producto"
    >
      <div class="px-3 py-3">
        <b-form @submit.prevent="crear_producto">
          <b-form-group
            label="Titulo del producto"
          >
            <b-form-input
              v-model="$v.datosForm.producto.titulo.$model"
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
              v-model="$v.datosForm.producto.codigo.$model"
              type="text"
              placeholder="Ingresa un codigo para el producto"
              :class="{
                'is-valid' : $v.datosForm.producto.codigo.required,
                'is-invalid' : $v.datosForm.producto.codigo.$error
              }"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Tipo de producto">
            <b-form-select
              v-model="$v.datosForm.producto.tipo.$model"
              :class="{
                'is-valid' : $v.datosForm.producto.tipo.required,
                'is-invalid' : $v.datosForm.producto.tipo.$error
              }"
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
              v-model="$v.datosForm.producto.linea.$model"
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
              v-model="$v.datosForm.producto.detalle.$model"
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
              :state="$v.datosForm.producto.imagen.required"
            ></b-form-file>
          </b-form-group>

          <div class="text-center">
            <b-img 
              width="250px"
              class="mb-3"
              fluid
              v-if="imagenSrc"
              thumbnail
              :src="imagenSrc" 
              alt="Image 1"
            ></b-img>
          </div>

          <b-button 
            :disabled="deshabilitado || $v.$invalid"
            type="submit" variant="primary" block>Guardar cambios</b-button>
        </b-form>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NuevoProducto',
  validations: {
    datosForm: {
      producto: {
        titulo: { required },
        codigo: { required },
        tipo: { required },
        linea: { required },
        detalle: { required },
        imagen: { required }
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
  ...mapGetters(['carga', 'categoriasPerfiles', 'deshabilitado'])
  },
  methods: {
    ...mapActions(['GET_CATEGORIAS', 'POST_PRODUCTO']),
    imagenSeleccionada(event) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.addEventListener('load', _ => {
        this.imagenSrc = fileReader.result;
      })
      fileReader.readAsDataURL(file);
      this.datosForm.producto.imagen = file;
    },
    crear_producto() {
      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.POST_PRODUCTO(this.datosForm);
      }
    }
  }
}
</script>