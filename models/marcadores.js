class Marcadores {
  constructor() {
    this.activeDrivers = {};
  }

  agregarMarcador(marcador) {
    this.activeDrivers[marcador.id] = marcador;
    console.log('MARCADORES activos', this.activeDrivers);
    return marcador;
  }

  removerMarcador(id) {
    delete this.activeDrivers[id];
    console.log('MARCADORES activos', this.activeDrivers);
    return this.activeDrivers;
  }

  actualizarMarcador(marcador) {
    this.activeDrivers[marcador.id] = marcador;
  }
}

module.exports = Marcadores;