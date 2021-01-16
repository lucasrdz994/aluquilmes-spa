<template>
  <div>
    <Header />
    <b-jumbotron fluid header="Comunicate con nosotros" class="text-center">
    </b-jumbotron>
    <b-container class="mt-5">
      <b-row>
        <b-col xs="12" lg="6">
          <b-card
            img-src="https://picsum.photos/600/400/?image=25"
            img-alt="Image"
            img-top
            class="mb-2"
          >
          <p>
            <b-icon icon="geo-alt"></b-icon>
            Quilmes pepe 1223
          </p>
          <p>
            <b-icon icon="clock-fill"></b-icon>
            Lun a Vie 9:00 a 18:00 hs
          </p>
          <b-button class="primario" variant="link">Ver en Google Maps</b-button>
          </b-card>
        </b-col>
        <b-col xs="12" lg="6">
          <b-card title="¿Donde nos encontramos?">
            <b-card-text>Estamos para ayudarte, siempre!</b-card-text>
            <b-button class="mt-5" block>Encontranos en Google Maps</b-button>
            <b-button block>Encontranos en Facebook</b-button>
            <b-button block>Encontranos en Whatsapp</b-button>
            <b-button block v-b-modal.modalEmail>Encontranos en email</b-button>

            <b-modal id="modalEmail" title="Escribínos a nuestro e-mail" hide-footer>
              <p class="my-3">Podés encontrarnos mediante muchas vías de comunicación. Si preferís enviarnos un e-mail, por favor hacelo a la siguiente casilla de correo:</p>
              <b-button class="primario mb-3" variant="link">email@email.com</b-button>
            </b-modal>
          </b-card>
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
  name: 'Contacto',
  components: {
    Header,
    Footer
  }
}
</script>