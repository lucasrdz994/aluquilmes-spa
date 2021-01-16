<template>
  <div>
    <b-sidebar
      lazy
      id="editarLinea"
      backdrop
      shadow
      width="600px"
      title="Editar línea"
      @shown="cargar_datos_existentes"
      @hidden="onHidden"
    >
      <div class="px-3 py-5">
        <b-form @submit.prevent="actualizar_linea">
          <b-form-group
            label="Nombre de la línea"
          >
            <b-form-input
              :value="categoriaActual.nombre"
              @input="$v.datosForm.nuevoNombre.$model = $event"
              type="text"
              placeholder="Ingresa un nombre para la línea"
              :class="{
                'is-valid' : $v.datosForm.nuevoNombre.required,
                'is-invalid' : $v.datosForm.nuevoNombre.$error
              }"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Nuevo PDF de la línea">
            <b-form-file
              @change="lineaSeleccionada"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
            ></b-form-file>
          </b-form-group>

          <b-button 
            :href="categoriaActual.pdfUrl"
            target="_blank"
            size="sm" class="mb-3 bg-primario">
            <b-icon-file-earmark-check></b-icon-file-earmark-check>
            Archivo PDF cargado
          </b-button>

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
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'EditarLinea',
  data() {
    return {
      pdfSrc: '',
      datosForm: {
        vm: this,
        nuevoNombre: '',
        pdf: null
      }
    }
  },
  validations: {
    datosForm: {
      nuevoNombre: { required }
    }
  },
  computed: {
    ...mapGetters([
      'categoriaActual',
      'deshabilitado'
    ])
  },
  methods: {
    ...mapMutations([
      'resetCategoriaActual'
    ]),
    ...mapActions([
      'UPDATE_CATEGORIA'
    ]),
    actualizar_linea() {
      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.UPDATE_CATEGORIA(this.datosForm);
      }
    },
    lineaSeleccionada(event) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      // fileReader.addEventListener('load', _ => {
      //   this.pdfSrc = fileReader.result;
      // })
      fileReader.readAsDataURL(file);
      this.datosForm.pdf = file;
    },
    cargar_datos_existentes() {
      this.$v.datosForm.nuevoNombre.$model = this.categoriaActual.nombre;
    },
    onHidden() {
      this.pdfSrc = ''; 
      this.resetCategoriaActual();
    }
  }
}
</script>