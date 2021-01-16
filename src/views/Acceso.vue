<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3" class="mt-5">
          <b-card
            title="Administracion de la web"
          >
            <b-form @submit.prevent="login">
              <b-form-group
                label="Ingresá tu email"
              >
                <b-form-input
                  type="text"
                  placeholder="tu@email.com"
                  v-model="$v.usuario.email.$model"
                  :class="{
                    'is-invalid' : $v.usuario.email.$error,
                    'is-valid' : !$v.usuario.email.$error && $v.usuario.email.$dirty
                  }"
                ></b-form-input>
                <small
                  class="text-danger"
                  v-if="!$v.usuario.email.email"
                >Escribí un email válido</small>
                <small
                  class="text-danger"
                  v-if="!$v.usuario.email.required && $v.usuario.email.$dirty"
                >El email es obligatorio</small>
              </b-form-group>

              <b-form-group
                label="Ingresá tu contraseña"
              >
                <b-form-input
                  type="password"
                  placeholder="Contraseña"
                  v-model="$v.usuario.password.$model"
                  :class="{
                    'is-invalid' : $v.usuario.password.$error,
                    'is-valid' : !$v.usuario.password.$error && $v.usuario.password.$dirty
                  }"
                ></b-form-input>
                <small
                  class="text-danger"
                  v-if="!$v.usuario.password.required && $v.usuario.password.$dirty"
                >La contraseña es obligatoria</small>
                <small
                  class="text-danger"
                  v-if="!$v.usuario.password.minLength"
                >La contraseña tiene al menos 6 caracteres</small>
              </b-form-group>

              <b-button variant="primary" type="submit" block >Ingresar al panel</b-button>
              <b-alert
                v-if="mensaje"
                dismissible
                variant="danger"
                show="5"
                class="mt-3"
              >
                {{ mensaje }}
              </b-alert>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Acceso',
  data() {
    return {
      usuario: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    usuario: {
      email: { required, email },
      password: { required, minLength: minLength(6) }
    }
  },
  computed: {
    ...mapGetters(['mensaje'])
  },
  methods: {
    ...mapActions(['LOGIN']),
    login() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$bvToast.toast('Los datos ingresados no son válidos.', {
          title: 'Error al ingresar.',
          autoHideDelay: 5000,
          soid: true,
          variant: 'danger'
        })
      } else {
        this.LOGIN(this.usuario);
      }
    }
  }
}
</script>