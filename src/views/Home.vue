<template>
  <div class="home">
    <Header />
    <b-jumbotron fluid header="Perfíles en aluminio" lead="Mantenemos la más alta calidad al menor precio.">
      <p>Accede a todos nuestros productos</p>
      <b-button class="bg-primario" to="/perfiles/todos">Ir al catálogo</b-button>
    </b-jumbotron>
    <b-container class="my-5">
      <b-row>
        <b-col class="text-center">
          <h1>Lo hacemos en aluminio</h1>
          <p>AluQuilmes se enfoca en productos de alta calidad para garantizarte plena satisfacción en tu compra. Tenemos el mejor asesoramiento y las entregas más rápidas del mercado. Podés contar siempre con nosotros, estamos para ayudarte.</p>
        </b-col>
      </b-row>
    </b-container>
    <hr>
    <b-container class="my-5">
      <b-row>
        <b-col xs="12" lg="4">
          <b-card 
            title="Calidad garantizada" 
            class="text-center"
            img-src="https://firebasestorage.googleapis.com/v0/b/aluquilmes-60700.appspot.com/o/imgs%2F003.jpg?alt=media&token=2b9ded2f-eb6d-4572-b91a-da8552aa61b4"
            img-alt="Image"
            img-top
          >
            <b-card-text>Tenemos la mejor calidad de materiales y cuidamos todos los detalles para que recibas el producto en óptimas condiciones.</b-card-text>
          </b-card>
        </b-col>
        <b-col xs="12" lg="4">
          <b-card 
            title="Asesoramiento continuo" 
            class="text-center"
            img-src="https://firebasestorage.googleapis.com/v0/b/aluquilmes-60700.appspot.com/o/imgs%2F002.jpg?alt=media&token=5d30cb17-a51f-4ac6-9ef0-5b040f9cf4ba"
            img-alt="Image"
            img-top
          >
            <b-card-text>Estamos para ayudarte en todo lo que necesites, tenemos una amplia variedad de vías de comunicación. Estamos en línea!</b-card-text>
          </b-card>
        </b-col>
        <b-col xs="12" lg="4">
          <b-card 
            title="Entregas personalizadas" 
            class="text-center"
            img-src="https://firebasestorage.googleapis.com/v0/b/aluquilmes-60700.appspot.com/o/imgs%2F001.jpg?alt=media&token=9296b0a5-756d-45ef-a351-032564c9058c"
            img-alt="Image"
            img-top
          >
            <b-card-text>Llegamos a todas partes del país, por eso nos aseguramos de brindarte un seguimiento continuo sobre tu envío en todo momento.</b-card-text>
          </b-card>
        </b-col>
      </b-row>
      <p class="my-5 text-center">
        Además ofrecemos promociones y descuentos en compras por mayor y de alto volumen. Consultá nuestras ofertas y médios de pago <router-link to="/contacto" class="primario">contactandote con nosotros.</router-link>
      </p>
    </b-container>
    <b-jumbotron fluid header="Solicitá un presupuesto" class="text-center">
    </b-jumbotron>
    <b-container class="mt-5">
      <p class="text-center mb-5">
        Podés solicitar una cotización de multiples formas, pero te recomendamos armar un presupuesto vos mismo desde nuestra web. Es muy fácil y solo toma unos minútos. Agregá todos los productos que desees, tanto perfíles como accesorios. Luego desde la sección <router-link class="primario" to="/presupuesto">Mi presupuesto</router-link> podrás verificar que todo este correcto, realizar los últimos ajustes y enviar la solicitud. Respondemos súper rápido y tus datos estan 100% protegidos.
      </p>
      <b-row>
        <b-col xs="12" lg="4" class="mb-3">
          <b-button class="py-3" block variant="outline-primary">Facebook</b-button>
        </b-col>
        <b-col xs="12" lg="4" class="mb-3">
          <b-button class="py-3" block variant="outline-success">Whatsapp</b-button>
        </b-col>
        <b-col xs="12" lg="4" class="mb-3">
          <b-button v-b-modal.modalEmail class="py-3" block variant="outline-secondary">Correo electrónico</b-button>
        </b-col>

        <b-modal id="modalEmail" title="Escribínos a nuestro e-mail" hide-footer>
          <p class="my-3">Podés encontrarnos mediante muchas vías de comunicación. Si preferís enviarnos un e-mail, por favor hacelo a la siguiente casilla de correo:</p>
          <b-button class="primario mb-3" variant="link">email@email.com</b-button>
        </b-modal>
      </b-row>
      <b-row>
        <b-col>
          <b-button to="/perfiles/todos" class="py-3 bg-primario" block>Armá un pedido desde nuestra web!</b-button>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'Home',
  components: {
    Header,
    Footer
  }
}
</script>
