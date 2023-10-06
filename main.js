class Producto{
    constructor(id, nombre, precio, categoria, imagen){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

/* Simulo una base de datos de mis productos
*/ 
class BaseDeDatos {
    constructor(){
        this.productos = [];
        this.agregarRegistro(1, "Remera", 5000, "Indumentaria", "remera.jpg");
        this.agregarRegistro(2, "Buzo", 10000, "Indumentaria", "buzo.jpg");
        this.agregarRegistro(3, "Vestido", 8500, "Indumentaria", "vestido.jpg");
        this.agregarRegistro(4, "Mochila", 20000, "Indumentaria", "mochila.jpg");
        this.agregarRegistro(5, "Medias", 800, "Indumentaria", "medias.jpg");
    }

    /* Metodo que crea el objeto producto y lo almacena en el array (o sea el catálogo)
    */
    agregarRegistro(id, nombre, precio, categoria, imagen){
        const producto = new Producto (id, nombre, precio, categoria, imagen);
        this.productos.push(producto)
    }


    /*Devuelve el catálogo de productos
    */
    traerRegistros(){
        return this.productos;
    }

    /*Esta función tiene que devolver un producto por Id
    */
    registroPorId(id){
        return this.productos.find ((producto)=> producto.id === id);
    }

    /*Esta función filtrar un producto por el nombre/palabra clave
    */
    registroPorNombre(palabra){
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra.toLowerCase()));
    }
}


/*CARRITO
 */
class Carrito{
    constructor(){
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        /* Array de los productos del carrito
         */
        this.carrito =  []

        /*Muestra el total del carrito
        */
        this.total = 0;

        /*Mustra cantidad de productos del carrito
        */
        this.cantidadProductos = 0;
    }

    estaEnCarrito({ id }){
        return this.carrito.find((producto) => producto.id === id); 
    }
    

    agregar(producto){
        const productoEnCarrito = this.estaEnCarrito(producto);

        if (!productoEnCarrito){
            this.carrito.push({ ...producto, cantidad: 1 });       
        } else{
            productoEnCarrito.cantidad++;
        }
        
        localStorage.setItem("carrito", JSON.stringify(this.carrito));

        this.listar();
    }

    quitar(id){
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1){
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(this.carrito));

        this.listar();
    }

    listar(){
        this.total = 0;
        this.cantidadProductos= 0;
        divCarrito.innerHTML= "";

        for (const producto of this.carrito){
            divCarrito.innerHTML += `
            <div class="productoCarrito">
                <h2>${producto.nombre}</h2>
                <p>$${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
            </div>
            `;
            /*Actualizar totales del carrito */
            this.total += producto.precio * producto.cantidad;
            this.cantidadProductos += producto.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.addEventListener("click", (event) => {
                event.preventDefault();
                const idProducto = Number(boton.dataset.id);
                this.quitar(idProducto);
            })
        }

        spanCantidadProductos.innerText = this.cantidadProductos;
        spanTotalCarrito.innerText = this.total;
    }
}

const bd = new BaseDeDatos();

const carrito = new Carrito();

/* Elementos
 */
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");

cargarProductos(bd.traerRegistros());

function cargarProductos(productos){

    divProductos.innerHTML= "";

    for (const producto of productos){
        divProductos.innerHTML += `
        <div class="producto">  
        <h2> ${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
            <img src="imagenes/${producto.imagen}" width="350" />
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
        </div>
        `;
    } 

    const botonesAgregar = document.querySelectorAll(".btnAgregar");

    for (const boton of botonesAgregar){
        boton.addEventListener("click", (event)=>{
            event.preventDefault();
            const idProducto = Number(boton.dataset.id);
            const producto = bd.registroPorId(idProducto);

            carrito.agregar(producto);
        })
    }
}