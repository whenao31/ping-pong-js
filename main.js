// --------------------------------------------------------------
// --------------------------------------------------------------
// EN ESTA PRIMERA SECCION ESTA MODELO: Contiene enclosures
// donde estan definidas las 'clases' de las entidades
// que se necesitan en el juego: Board, Ball y Bar.

(function(){
    // Definicion de clase board con atributos por defecto
    self.Board = function(width, height){
      this.width = width;
      this.height = height;
      this.playing = false;
      this.gameOver = false;
      this.bars = [];
      this.ball = null;
    }
  
    // Definicion de metodo get de elementos en Board usando prototype.
    self.Board.prototype = {
      get elements(){
        var elements = this.bars.map((bar)=>{ return bar; });
        elements.push(this.ball);
        return elements;
      }
    }
  })();

// --------------------------------------------------------------
// --------------------------------------------------------------
// EN ESTA SEGUNDA SECCION ESTA LA VISTA: despliega los elementos
// del tablero de juego dibujandolos en un objeto canvas en el html.
// Se hace uso de un closure para guardar esta "clase" BoardView.

(function(){
// Clase BoardView para pintar los elementos del tablero en el canvas
self.BoardView = function(canvas, board){
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.context = canvas.getContext("2d")
}
})();




// --------------------------------------------------------------
// --------------------------------------------------------------
// EN ESTA TERCERA SECCION ESTA EL CONTROLADOR: ofrece el orden
// de ejecucion o punto de entrada de la aplicacion.

window.addEventListener("load", controller);

function controller(){
    // instancia de la entidad Board que recibe el ancho y el alto
    let board = new Board(800, 400);
    // se obtiene del DOM el id del canvas sobre el que se dibujar el tablero
    let canvas = document.getElementById("canvas");
    // instancia del BordView que recibe el canvas y el tablero
    let board_view = new BoardView(canvas, board);  
  }