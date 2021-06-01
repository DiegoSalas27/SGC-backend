const Marcadores = require("./marcadores");

class Sockets {

    constructor( io ) {

        this.io = io;

        this.marcadores = new Marcadores();

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {
            console.log('cliente conectado');

            socket.emit('marcadores-activos', this.marcadores.activeDrivers);

            socket.on('marcador-nuevo', (marcador) => {
                this.marcadores.agregarMarcador(marcador);

                socket.broadcast.emit('marcador-nuevo', marcador);
            })

            socket.on('marcador-actualizado', (marcador) => {
                this.marcadores.actualizarMarcador(marcador);

                socket.broadcast.emit('marcador-actualizado', marcador);
            })

            socket.on('marcador-eliminar', (id) => {
                this.marcadores.removerMarcador(id);

                socket.broadcast.emit('marcador-eliminar', id);
            })

            socket.on('marcadores-activos', () => {
                socket.emit('marcadores-activos', this.marcadores.activeDrivers); 
            })
        });
    }
}

module.exports = Sockets;