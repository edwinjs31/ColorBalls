const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
//alto y ancho del navegador (viewport)
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);


//funcion,recibe dos numeros como argumentos de entrada(min,max) y devuelve un numero aleatorio entre ellos.
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}


//Constructor para el objeto pelota(Ball) y sus propiedades.Tendremos muchas pelotas con el mismo comportamiento.
function Ball(x, y, velX, velY, color, size) {
  this.x = x; //posición horizontal
  this.y = y; //posición vertical
  this.velX = velX; //velocidad/desplazamiento horizontal
  this.velY = velY; //velocidad/desplazamiento vertical
  this.color = color; //color
  this.size = size; //tamaño,su radio en pixeles
}


/*DIBUJANDO LAS PELOTAS: Añadimos el método 'draw()' al prototipo del objeto 'Ball()':
Con ésta funcion cada objeto pelota puede dibujarse utilizando el contexto 2D(ctx) definido al principio*/
Ball.prototype.draw = function () {
  ctx.beginPath(); //declaramos que empzamos a dibujar
  ctx.fillStyle = this.color; //difinimos el color asignando la propiedad color del objeto 'Ball()'
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); //trazamos un arco,'x' e 'y' son el punto central de la pelota,size sera la radio del arco,'0' es el comienzo del arco y '2*PI' en radianes equivalente a 360 grados que es el final del arco.(medio circulo PI(180 grados))
  ctx.fill(); //se finaliza el dibujo
   //ctx.closePath();
};


//ACTUALIZANDO LOS DATOS DE LA PELOTA: añadimos un método 'update()' en el prototipo de la clase 'Ball()' para la actualizacion de datos de la pelota,para empezar a moverla.
Ball.prototype.update = function () {
  //Si la coordenada x es mayor que el ancho del canvas (la pelota está saliendo por el borde derecho).
  if (this.x + this.size >= width) {
    //toma en cuenta el radio de la pelota ya que(x,y) es el centro
    this.velX = -this.velX; //entonces invertimos la direccion de la pelota
  }
  //Si la coordenada x es menor que la coordenada 0 (la pelota está saliendo por el borde izquierdo)
  if (this.x - this.size <= 0) {
    this.velX = -this.velX; //entonces invertimos la direccion de la pelota
  }
  //Si la coordenada y es mayor que la altura del canvas (la pelota está saliendo por el borde inferior).
  if (this.y + this.size >= height) {
    this.velY = -this.velY; //entonces invertimos la direccion de la pelota
  }
  //Si la coordenada y es menor que la coordenada 0 ( la pelota está saliendo por el borde superior).
  if (this.y - this.size <= 0) {
    this.velY = -this.velY; //entonces invertimos la direccion de la pelota
  }
  //sumamos la velocidad en 'x', al valor de la coordenada 'x'.
  this.x += this.velX;
  //sumamos la velocidad en 'y', al valor de la coordenada 'y'.
  this.y += this.velY;
  //con esto se consigue el efecto de que la pelota se mueve cada vez este metodo es llamado.
};


//DETECCION DE COLISIONES:
Ball.prototype.collisionDetect = function () {
//Para cada pelota comprobamos si chocará con cada una de las otras pelotas.
  for (var j = 0; j < balls.length; j++) {
    //si la pelota actual (es decir la pelota que está invocando al método que resuelve la detección de colisiones) es la misma que la indicada por el bucle.
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color =
          "rgb(" + random(0, 255) +
          "," + random(0, 255) +
          "," + random(0, 255) + ")";
      }
    }
  }
};

//ANIMANDO LAS PELOTAS: Vamos a añadir pelotas al camvas y las guardamos en un Array:
let balls = [];

while (balls.length < 25) {
  var size = random(10, 20);
  var ball = new Ball(
    // la posición de las pelotas, se dibujará al menos siempre
    // como mínimo a un ancho de la pelota de distancia al borde del
    // canvas, para evitar errores en el dibujo
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    "rgb(" +
      random(0, 255) +
      "," +
      random(0, 255) +
      "," +
      random(0, 255) +
      ")",
    size
  );
  balls.push(ball);
}


//BOCLE DE ANIMACION(funcion bucle): Actualiza los datos del programa para generar la imagen correspondiente.
function loop() {
  //color de rrelleno semitransparente,para intuir el efecto de estelas detras de las pelotas.
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  //Relleno de todo el alto y ancho del vanvas:Esto es para cubrir el dibujo del instante anterior antes de actualizar el nuevo dibujo.
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    //llamamos a este metodo en cada instante de la animacion 'balls[i].update()'
    balls[i].collisionDetect();
  }
  requestAnimationFrame(loop);
}


//llamamos a la funcion bucle para que empiece la animacion
loop();



