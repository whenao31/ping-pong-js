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
            elements.push(this.ball);
            return elements;
        }
    }
  })();

(function(){
    // Definicion de clase Bar
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

    // Definicion de metodos de Bar usando 'prototype'
    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x: " + this.x + " , " + "y: " + this.y;
            }
    }
})();

(function(){
    // Definicion de la clase Ball
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_x = 3;
        this.speed_y = 0;
        this.board = board;
        this.direction = 1;

        board.ball = this;
        this.kind = "circle";
    };

    self.Ball.prototype = {
        move: function(){
        // Metodo encargado del posicionamiento de Ball en el tablero de juego.
        this.x += (this.speed_x * this.direction);
        this.y += (this.speed_y)
        },
        get width(){
        return this.radius * 2;
        },
        get height(){
        return this.radius * 2;
        },
        collision: function(bar){
        // Reaction to bar collision
        // Matematica para darle un cambio de angulo y velocidad a la bola
        // dependiendo en que mitad de la altura de la barra haga
        // coalicion
        var relative_intersect_y = (bar.y + (bar.height/2)) - this.y;

        var normalized_intersect_y = relative_intersect_y / (bar.height/2);

        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        // Cambia direccion de desplazamiento en el eje x
        if(this.x > (this.board.width / 2)){ this.direction = -1; }
        else{ this.direction = 1; }
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
        clean: function(){
            // Funcion del canvas para pintar un rectangulo nuevo
            this.context.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function(){
            // Funcion para dibujar los elementos en el canvas
            let elements = this.board.elements;
            elements.map(el => draw(this.context, el));
        },
        play: function(){
            // Funcion que controla el flujo de pintado del canvas
            if(this.board.playing){
                this.clean();
                this.draw();
                this.board.ball.move();
            }
        }
    }

    function draw(context, element){
        // manipulacion del canvas a traves de sus metodos propios que 
        // se obtienen a traves del 'context'
        switch(element.kind){
            case "rectangle":
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                context.beginPath();
                context.arc(element.x, element.y, element.radius,0,7);
                context.fill();
                context.closePath();
                break;   
        }
    }
})();




// --------------------------------------------------------------
// --------------------------------------------------------------
// EN ESTA TERCERA SECCION ESTA EL CONTROLADOR: ofrece el orden
// de ejecucion o punto de entrada de la aplicacion.

// instancia de la entidad Board que recibe el ancho y el alto
let board = new Board(800, 400);
// instancia de las barras
let bar_left = new Bar(0, 100, 20, 100, board);
let bar_right = new Bar(780, 100, 20, 100, board);
// se obtiene del DOM el id del canvas sobre el que se dibujar el tablero
let canvas = document.getElementById("canvas");
// instancia del BordView que recibe el canvas y el tablero
let board_view = new BoardView(canvas, board);
// instancia del una pelota con la clase Ball
let ball = new Ball(350, 100, 10, board);


// Listener para detectar el uso de las teclas
document.addEventListener("keydown", function(event){
  
    if(event.keyCode == 38){
      event.preventDefault();
      bar_right.up();
    }else if(event.keyCode == 40){
      event.preventDefault();
      bar_right.down();
    }else if(event.keyCode == 87){
      // W
      event.preventDefault();
      bar_left.up();
    }else if(event.keyCode == 83){
      // S
      event.preventDefault();
      bar_left.down();
    }else if(event.keyCode === 32){
        event.preventDefault();
        board.playing = !board.playing;
      }
});

// Dibuja el tablero inicialmente
board_view.draw();
// Funcion de Html5 que hace el cambio entre frames
window.requestAnimationFrame(controller);

function controller(){
    // metodo de la vista que da el orden de ejecucion
    board_view.play();
    window.requestAnimationFrame(controller);
}