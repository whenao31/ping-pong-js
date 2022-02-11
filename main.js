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
        this.boundaries = [];
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
    // Definicion de clase para controlar los borde del tablero de juego
    self.BoardBoundary = function(side, board){
        this.side = side;
        this.board = board;
        this.coordinates = getCoordinates(side, board);
        this.x = this.coordinates.x;
        this.y = this.coordinates.y;
        this.width = this.coordinates.width;
        this.height = this.coordinates.height;
        this.board.boundaries.push(this);
    }
  
    function getCoordinates(side, board){
        // funcion para inicializar los atributos de posicionamiento
        // de los bordes que limitan el tablero de juego
        let coordinates;
        if (side === "left"){
            coordinates = {
            x: 0,
            y: 0,
            width: 1,
            height: board.height
            }       
        }else if(side === "right"){
            coordinates = {
            x: board.width,
            y: 0,
            width: 1,
            height: board.height
            }            
        }else if(side === "top"){
            coordinates = {
            x: 0,
            y: 0,
            width: board.width,
            height: 1
            }            
        }
        else if(side === "bottom"){
            coordinates = {
            x: 0,
            y: board.height - 1,
            width: board.width,
            height: 1
            }            
        }
        return coordinates;
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
        this.x_direction = 1;
        this.y_direction = 0;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 5;

        board.ball = this;
        this.kind = "circle";
    };

    self.Ball.prototype = {
        move: function(){
        // Metodo encargado del posicionamiento de Ball en el tablero de juego.
        this.x += (this.speed_x * this.x_direction);
        this.y += (this.speed_y * this.y_direction);
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

        let sin_bounce_angle = Math.sin(this.bounce_angle);
        this.y_direction = 1;
  
        this.speed_y = this.speed * -sin_bounce_angle;
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        // Cambia direccion de desplazamiento en el eje x
        if(this.x > (this.board.width / 2)){ this.x_direction = -1; }
        else{ this.x_direction = 1; }
        },
        border_collision: function(boundary){
            // funcion para cambiar la rebote de la bola
            // el los bordes superior e inferior del tablero
            this.y_direction = -1; 
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
                this.checkCollisions();
                this.board.ball.move();
            }
        },
        checkCollisions: function(){
            // Metodo para verificar colisiones de la bola
            // con otros objetos del tablero
            for(var i = this.board.bars.length - 1; i >= 0 ; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                this.board.ball.collision(bar);
                }
            }

            this.board.boundaries.map((boundary) => {
                if(hit(boundary, this.board.ball)){
                  if(boundary.side === "top" || boundary.side === "bottom"){
                    this.board.ball.border_collision(boundary);
                  } else{
                    this.board.playing = 0;
                    alert("GAME OVER!!. Reload to play again.");
                  }
                }
            });
        }
    }

    // Funcion retorna booleano para confirmar si dos objetos se 
    // superponen o colisionan. Cada objeto debe tener atributos:
    // coord_x, coord_y, width, height.
    function hit(a, b){
        // Checks whether a collisions b
        let hit = false;
        // Horizontal collision
        if((b.x + b.width >= a.x) && (b.x < a.x + a.width)){
            // Vertical collisions
            if((b.y + b.height >= a.y) && (b.y < a.y + a.height)){ hit = true; }
        }
        // Collision a to b
        if((b.x <= a.x) && (b.x + b.width >= a.x + a.width)){
            if((b.y <= a.y) && (b.y + b.height >= a.y + a.height)){ hit = true; }
        }
        // Collision b to a
        if((a.x <= b.x) && (a.x + a.width >= b.x + b.width)){
            if((a.y <= b.y) && (a.y + a.height >= b.y + b.height)){ hit = true; }
        }
        return hit;
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
// instancias de los limites del tablero
let top_boundary = new BoardBoundary("top", board);
let bottom_boundary = new BoardBoundary("bottom", board);
let left_boundary = new BoardBoundary("left", board);
let right_boundary = new BoardBoundary("right", board);
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