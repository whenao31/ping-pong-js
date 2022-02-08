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
        let elements = this.bars.map((bar)=>{ return bar; });
        // elements.push(this.ball);
        return elements;
      }
    }
  })();

  (function(){
    self.Bar = function(x, y, width, height, board){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.board = board;
      this.board.bars.push(this);
      this.kind = "rectangle";
      this.speed = 10;
    }
  
    self.Bar.prototype = {
      down: function(){
        this.y += this.speed;
      },
      up: function(){
        this.y -= this.speed;
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

    self.BoardView.prototype = {
        draw: function(){
            let elements = this.board.elements;
            elements.map(el => draw(this.context, el));
        }
    }

    function draw(context, element){
            
        switch(element.kind){
          case "rectangle":
            context.fillRect(element.x, element.y, element.width, element.height);
            break;
        }
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
    // instancia de las barras
    let bar_left = new Bar(0, 100, 40, 100, board);
    let bar_right = new Bar(760, 100, 40, 100, board);
    // se obtiene del DOM el id del canvas sobre el que se dibujar el tablero
    let canvas = document.getElementById("canvas");
    // instancia del BordView que recibe el canvas y el tablero
    let board_view = new BoardView(canvas, board);
    // dibuja el tablero con el metodo draw() propio de la vista
    board_view.draw();
  }