<template>
  <div id="app">
    <router-view/>
    <whatsapp-icon />
  </div>
</template>

<script>
import WhatsappIcon from '@/components/WhatsappIcon'

export default {
  name: 'App',
  components: {
    WhatsappIcon
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  font-weight: bold;
}

/* Colores */

.bg-primario {
  background-color: #b32727 !important;
  border-color: #b32727 !important;
}

.bg-primario:hover {
  background-color: #981818 !important;
  border-color: #981818 !important;
}

button.bg-primario:disabled:hover {
  background-color: #b32727 !important;
  border-color: #b32727 !important;
}

.primario {
  color: #b32727 !important;
}

.primario:hover {
  color: #981818 !important;
}

.navbar-nav .dropdown-menu a:active {
  background-color: #b32727 !important;
}

</style>
