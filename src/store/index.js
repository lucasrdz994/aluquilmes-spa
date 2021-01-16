import Vue from 'vue'
import Vuex from 'vuex'
import { db, auth, storage } from '../firebase'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    carga: false,
    deshabilitado: false,
    mensaje: null,
    productos: [],
    productoActual: {},
    lineaActual: '',
    categoriaActual: '',
    categorias: [],
    presupuesto: {
      cliente: {
        nombre: '',
        email: '',
        telefono: ''
      },
      productos: []
    },
    presupuestos: [],
    presupuestoActual: {
      idPresupuesto: '', 
      cliente: {
        nombre: ''
      }
    },
    textoBuscado: '',
    estadoBuscado: 'todos',
    usuario: ''
  },
  getters: {
    carga: state => state.carga,
    deshabilitado: state => state.deshabilitado,
    mensaje: state => state.mensaje,
    productos: state => {
      if (state.lineaActual !== 'todos') {
        return state.productos.filter(producto => producto.linea === state.lineaActual && producto.activo === true);
      }
      return state.productos.filter(producto => producto.activo === true);
    },
    productosAccesorios: state => {
      if (state.lineaActual !== 'todos') {
        return state.productos.filter(p => p.linea === state.lineaActual && p.activo === true && p.tipo === 'accesorio');
      }
      return state.productos.filter(p => p.activo === true && p.tipo === 'accesorio');
    },
    productosPerfiles: state => {
      if (state.lineaActual !== 'todos') {
        return state.productos.filter(p => p.linea === state.lineaActual && p.activo === true && p.tipo === 'perfil');
      }
      return state.productos.filter(p => p.activo === true && p.tipo === 'perfil');
    },
    productosTodos: state => state.productos,
    productoActual: state => state.productoActual,
    categoriasPerfiles: state => state.categorias,
    categoriaActual: state => state.categoriaActual,
    presupuesto: state => state.presupuesto,
    presupuestos: state => {
      const presupuestosFiltrados = [];
      state.presupuestos.forEach(p => {
        if (p.cliente.nombre.toLowerCase().indexOf(state.textoBuscado.toLowerCase()) >= 0) {
          if (p.estado === state.estadoBuscado || state.estadoBuscado === 'todos') {
            presupuestosFiltrados.push(p)
          }
        }  
      })
      return presupuestosFiltrados;
    }
  },
  mutations: {
    cargando(state, payload) {
      state.carga = payload;
    },
    deshabilitar(state, payload) {
      state.deshabilitado = payload;
    },
    generar_mensaje(state, payload) {
      state.mensaje = payload;
    },
    // PRODUCTOS
    obtener_productos(state, payload) {
      state.productos = payload;
    },
    productos_por_linea(state, payload) {
      state.lineaActual = payload;
    },
    todos_los_perfiles(state) {
      state.lineaActual = '';
    },
    producto_seleccionado(state, payload) {
      state.productoActual = payload;
    },
    agregar_producto(state, payload) {
      state.productos.unshift(payload);
    },
    editar_producto(state, payload) {
      state.productos.forEach(p => {
        if (p.id === state.productoActual.id) {
          p.titulo = payload.titulo,
          p.codigo = payload.codigo,
          p.tipo = payload.tipo,
          p.linea = payload.linea,
          p.detalle = payload.detalle
          if (payload.imagenUrl) {
            p.imagenUrl = payload.imagenUrl;
          }
        }
      })
    },
    pausar_activar_producto(state, payload) {
      state.productoActual.activo = payload;
    },
    resetProductoActual(state) {
      state.productoActual = {};
    },
    // CATEGORIAS
    obtener_categorias(state, payload) {
      state.categorias = payload;
    },
    categoria_seleccionada(state, payload) {
      state.categoriaActual = payload
    },
    resetCategoriaActual(state) {
      state.categoriaActual = {};
    },
    editar_categoria(state, payload) {
      state.categorias.forEach(cat => {
        if (cat.id === state.categoriaActual.id) {
          cat.nombre = payload.nombre
          if (payload.pdfUrl) {
            cat.pdfUrl = payload.pdfUrl;
          }
        }
      })
    },
    // PRESUPUESTO
    sumar_al_presupuesto(state, payload) {
      const index = state.presupuesto.productos.map(p => p.id).indexOf(payload);
      state.presupuesto.productos[index].cantidad ++;
    },
    restar_al_presupuesto(state, payload) {
      const index = state.presupuesto.productos.map(p => p.id).indexOf(payload);
      state.presupuesto.productos[index].cantidad --;
    },
    eliminar_del_presupesto(state, payload) {
      state.presupuesto.productos = state.presupuesto.productos.filter(p => p.id !== payload);
    },
    obtener_presupuestos(state, payload) {
      state.presupuestos = payload;
    },
    presupuesto_seleccionado(state, payload) {
      state.presupuestoActual = payload;
    },
    buscador_presupuesto(state, payload) {
      state.textoBuscado = payload;
    },
    buscador_estado_presupuesto(state, payload) {
      state.estadoBuscado = payload;
    },
    actualizar_estado(state, payload) {
      state.presupuestos.forEach(p => {
        if (p.id === state.presupuestoActual.idPresupuesto) {
          p.estado = payload;
        }
      })
      state.presupuestoActual.estado = payload;
    },
    archivar_activar_presupuesto(state, payload) {
      state.presupuestoActual.archivado = payload;
    },
    // USUARIOS
    obtener_usuario(state, payload) {
      state.usuario = payload;
    }
  },
  actions: {
    // PRODUCTOS
    async GET_PRODUCTOS({commit}) {
      commit('cargando', true);
      const res = await db.collection('productos').get();
      const arregloProductos = [];
      res.forEach(producto => {
        arregloProductos.unshift({
          id: producto.id,
          ...producto.data()
        })
      })
      commit('obtener_productos', arregloProductos);
      commit('cargando', false);
    },async UPDATE_PRODUCTO({commit, state}, datosForm) {
      commit('deshabilitar', true);
      const productoActualizado = {
        titulo: datosForm.producto.titulo,
        codigo: datosForm.producto.codigo,
        tipo: datosForm.producto.tipo,
        linea: datosForm.producto.linea,
        detalle: datosForm.producto.detalle
      }
      // modifico el producto en Firebase
      try {
        const ref = await db.collection('productos').doc(state.productoActual.id);
        await ref.update({ ...productoActualizado })

        // si hay una nueva imagen
        if (datosForm.producto.imagen !== null) {
          const datos = await ref.get()
          const fileData = await storage.refFromURL(datos.data().imagenUrl).put(datosForm.producto.imagen);
          const imagenUrl = await fileData.ref.getDownloadURL();
          await ref.update({ imagenUrl })
          productoActualizado.imagenUrl = imagenUrl;
        }
        
        // modifico el producto localmente
        commit('editar_producto', productoActualizado)

        datosForm.vm.$bvToast.toast(`El producto ${datosForm.producto.titulo} se actualizará en la web inmediatamente.`, {
          title: 'Producto editado correctamente',
          autoHideDelay: 5000,
          variant: 'success'
        })
      } catch (error) {
        datosForm.vm.$bvToast.toast(`El producto ${datosForm.producto.titulo} no pudo ser actualizado debido a un error. Intenta nuevamente en unos segundos.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'danger'
        })
        console.log(error);
      } finally {
        commit('deshabilitar', false);
      }
    },
    async UPDATE_PAUSAR_PRODUCTO({commit, state}, { vm }) {
      commit('deshabilitar', true);
      try {
        await db.collection('productos').doc(state.productoActual.id).update({activo: false});
        commit('pausar_activar_producto', false);
        vm.$bvToast.toast(`El producto ya no estará disponible en la web.`, {
          title: 'Producto pausado correctamente',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } catch (error) {
        console.log(error)
        vm.$bvToast.toast(`El producto no pudo ser modificado, intenta nuevamente en unos segundos.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } finally {
        commit('deshabilitar', false);
      }
    },async UPDATE_ACTIVAR_PRODUCTO({commit, state}, { vm }) {
      commit('deshabilitar', true);
      try {
        await db.collection('productos').doc(state.productoActual.id).update({activo: true});
        commit('pausar_activar_producto', true);
        vm.$bvToast.toast(`El producto está disponible en la web nuevamente.`, {
          title: 'Producto activado correctamente',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } catch (error) {
        console.log(error)
        vm.$bvToast.toast(`El producto no pudo ser modificado, intenta nuevamente en unos segundos.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } finally {
        commit('deshabilitar', false);
      }
    },
    async POST_PRODUCTO({commit}, datosForm) {
      commit('deshabilitar', true);
      try {
        const productoCreado = {
          titulo: datosForm.producto.titulo,
          codigo: datosForm.producto.codigo,
          linea: datosForm.producto.linea,
          tipo: datosForm.producto.tipo,
          detalle: datosForm.producto.detalle,
          activo: true
        }
        const res = await db.collection('productos').add(productoCreado);

        const filename = datosForm.producto.imagen.name;
        const ext = filename.slice(filename.lastIndexOf('.'));

        const fileData = await storage.ref('productos/' + res.id + ext).put(datosForm.producto.imagen);

        const imagenUrl = await fileData.ref.getDownloadURL();

        await db.collection('productos').doc(res.id).update({imagenUrl});
        
        commit('agregar_producto', {
          ...productoCreado,
          imagenUrl
        });

        datosForm.vm.$bvToast.toast(`El producto ${datosForm.producto.titulo} estará disponible en la web inmediatamente.`, {
          title: 'Producto creado correctamente',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } catch (error) {
        datosForm.vm.$bvToast.toast(`El producto ${datosForm.producto.titulo} no pudo ser creado debido a un error. Intenta nuevamente en unos segundos.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'danger',
          solid: true
        })
        console.log(error)
      } finally {
        commit('deshabilitar', false);
      }
    },
    // CATEGORIAS
    async GET_CATEGORIAS({commit}) {
      commit('cargando', true);
      const res = await db.collection('categorias').get();
      const arregloCategorias = [];
      res.forEach(categoria => {
        arregloCategorias.push({
          id: categoria.id,
          ...categoria.data()
        })
      })
      commit('obtener_categorias', arregloCategorias);
      commit('cargando', false);
    },
    async UPDATE_CATEGORIA({commit, state}, datosForm) {
      commit('deshabilitar', true);
      const categoriaActualizada = {
        nombre: datosForm.nuevoNombre,
      }
      // modifico la categoria en Firebase
      try {
        const ref = await db.collection('categorias').doc(state.categoriaActual.id);
        await ref.update({ ...categoriaActualizada })

        // si hay un nuevo pdf
        if (datosForm.pdf !== null) {
          const datos = await ref.get()
          const fileData = await storage.refFromURL(datos.data().pdfUrl).put(datosForm.pdf);
          const pdfUrl = await fileData.ref.getDownloadURL();
          await ref.update({ pdfUrl })
          categoriaActualizada.pdfUrl = pdfUrl;
        }
        
        // modifico la categoria localmente
        commit('editar_categoria', categoriaActualizada)

        datosForm.vm.$bvToast.toast(`La categoría ${categoriaActualizada.nombre} se actualizará en la web inmediatamente.`, {
          title: 'Categoría editada correctamente',
          autoHideDelay: 5000,
          variant: 'success'
        })
      } catch (error) {
        datosForm.vm.$bvToast.toast(`La categoría ${categoriaActualizada.nombre} no pudo ser actualizada debido a un error. Intenta nuevamente en unos segundos.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'danger'
        })
        console.log(error);
      } finally {
        commit('deshabilitar', false);
      }
    },
    // PRESUPUESTO
    async POST_PRESUPUESTO({commit, state}, cliente) {
      commit('cargando', true);
      const nuevoCliente = {
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        entrega: cliente.entrega
      }

      if (cliente.entrega === 'envio') {
        nuevoCliente.envio = {};
        nuevoCliente.envio.cp = cliente.envio.cp;
        nuevoCliente.envio.localidad = cliente.envio.localidad;
        nuevoCliente.envio.provincia = cliente.envio.provincia;
      }

      try {
        await db.collection('presupuestos').add({
          cliente: {
            ...nuevoCliente
          },
          productos: state.presupuesto.productos,
          fecha_solicitado: new Date().toISOString().substr(0, 10).split('-').reverse().join('/'),
          estado: 'pendiente',
          archivado: false
        });
        cliente.vm.$bvToast.toast('El presupuesto se envio correctamente, pronto nos estaremos contactando para más información.', {
          title: 'Presupuesto enviado correctamente',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } catch (error) {
        console.log(error)
        cliente.vm.$bvToast.toast('El presupuesto no pudo ser enviado, intenta nuevamente más tarde.', {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'danger',
          solid: true
        })
      } finally {
        commit('cargando', false);
      }
    },
    async GET_PRESUPUESTOS({commit}) {
      commit('cargando', true);
      try {
        const presupuestos = [];
        const res = await db.collection('presupuestos')
        .where('archivado', '==', false)
        .orderBy('fecha_solicitado', 'desc')
        .get();
        res.forEach(p => {
          presupuestos.push({
            idPresupuesto: p.id,
            ...p.data()
          })
        })
        commit('obtener_presupuestos', presupuestos);
      } catch (error) {
        console.log(error)
      } finally {
        commit('cargando', false);
      }
    },
    async GET_PRESUPUESTOS_ARCHIVADOS({commit}) {
      commit('cargando', true);
      try {
        const presupuestos = [];
        const res = await db.collection('presupuestos')
        .where('archivado', '==', true)
        .orderBy('fecha_solicitado', 'desc')
        .get();
        res.forEach(p => {
          presupuestos.push({
            idPresupuesto: p.id,
            ...p.data()
          })
        })
        commit('obtener_presupuestos', presupuestos);
      } catch (error) {
        console.log(error)
      } finally {
        commit('cargando', false);
      }
    },
    async UPDATE_ESTADO({commit, state}, datos) {
      commit('deshabilitar', true);
      try {
        await db.collection('presupuestos')
        .doc(state.presupuestoActual.idPresupuesto)
        .update({estado: datos.estado})

        commit('actualizar_estado', datos.estado);
        datos.vm.$bvToast.toast(`El presupuesto de ${state.presupuestoActual.cliente.nombre} cambio de estado a ${datos.estado}.`, {
          title: 'Presupuesto actualizado correctamente',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } catch (error) {
        datos.vm.$bvToast.toast(`El presupuesto de ${state.presupuestoActual.cliente.nombre} no puedo actualizarse. Intenta en unos segundos.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'danger',
          solid: true
        })
        console.log(error);
      } finally {
        commit('deshabilitar', false);
      }
    },
    async UPDATE_ARCHIVAR_PRESUPUESTO({commit, state}, { vm }) {
      commit('deshabilitar', true);
      try {
        await db.collection('presupuestos')
        .doc(state.presupuestoActual.idPresupuesto).update({
          archivado: true
        })
        commit('archivar_activar_presupuesto', true);
        vm.$bvToast.toast(`El presupuesto de ${state.presupuestoActual.cliente.nombre} se archivó correctamente.`, {
          title: 'Presupuesto archivado correctamente',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } catch (error) {
        vm.$bvToast.toast(`El presupuesto de ${state.presupuestoActual.cliente.nombre} no pudo ser archivado.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'danger',
          solid: true
        })
      } finally {
        commit('deshabilitar', false);
      }
    },
    async UPDATE_ACTIVAR_PRESUPUESTO({commit, state}, { vm }) {
      commit('deshabilitar', true);
      try {
        await db.collection('presupuestos')
        .doc(state.presupuestoActual.idPresupuesto).update({
          archivado: false
        })
        commit('archivar_activar_presupuesto', false);
        vm.$bvToast.toast(`El presupuesto de ${state.presupuestoActual.cliente.nombre} se activó correctamente.`, {
          title: 'Presupuesto archivado correctamente',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true
        })
      } catch (error) {
        vm.$bvToast.toast(`El presupuesto de ${state.presupuestoActual.cliente.nombre} no pudo ser activado.`, {
          title: 'Ocurrio un error',
          autoHideDelay: 5000,
          variant: 'danger',
          solid: true
        })
      } finally {
        commit('deshabilitar', false);
      }
    },
    agregar_al_presupuesto({state}, producto) {
      const index = state.presupuesto.productos.map(p => p.id).indexOf(producto.id);
      if (index === -1) {
        state.presupuesto.productos.push({ cantidad: 1, ...producto });
      } else {
        state.presupuesto.productos[index].cantidad ++;
      }
    },
    // USUARIOS
    async DETECTAR_USUARIO({commit}, usuario) {
      commit('obtener_usuario', usuario);
    },
    async LOGIN({commit}, usuario) {
      try {
        const res = await auth.signInWithEmailAndPassword(usuario.email, usuario.password);
        const usuarioLogueado = {
          email: res.user.email,
          uid: res.user.uid
        }
        commit('obtener_usuario', usuarioLogueado);
        router.push('/admin/presupuestos');
      } catch (error) {
        // console.log(error);
        commit('generar_mensaje', 'Usuario o contraseña incorrecta.')
      }
    },
    async LOGOUT() {
      router.push('/acceso');
      await auth.signOut();
    }
  }
})
