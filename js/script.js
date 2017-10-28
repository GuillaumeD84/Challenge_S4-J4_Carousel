/*global img*/

var app = {
  currentImageIndex: 0,
  fadeSpeed: 1000,
  transitionIntervalTime: 5000,
  init: function() {
    app.defaultImage();

    app.slideShowInterval = setInterval(app.slideShow, app.transitionIntervalTime);

    app.createThumbnails();
    app.makeThumbnailsClickable();
    app.setActiveThumbnail();

    $('.arrow').on('click', app.setNextThumbnail);
  },
  // On affiche à l'écran l'image par défaut, ici la première de la liste (trouvable dans images.js), en tant que background
  defaultImage: function() {
    $('#slider-images').css({
      'backgroundImage': 'url(' + img[0].url + ')',
      'backgroundSize': '100%'
    });
  },
  // Les fonctions slideShow() et fadeInNextImage() sont utilisées pour gérer la transition entre 2 images.
  // slideShow() gère l'index de l'image à afficher et la fadeOut(). Elle va appeler à la fin la fonction fadeInNextImage()
  // fadeInNextImage() affiche l'image suivante grâce à l'index modifiée par la fonction précédente et la fait réapparaitre avec un fadeIn().
  slideShow: function() {
    if (app.currentImageIndex === img.length - 1) app.currentImageIndex = 0;
    else app.currentImageIndex++;

    $('#slider-images').fadeToggle(app.fadeSpeed);

    setTimeout(app.fadeInNextImage, app.fadeSpeed);
  },
  fadeInNextImage: function() {
    $('#slider-images').css({
      'backgroundImage': 'url(' + img[app.currentImageIndex].url + ')'
    });

    $('#slider-images').fadeToggle(app.fadeSpeed);

    // On applique une classe 'active' sur la miniature correspondante à l'image à l'écran afin de lui donner un style différent des autres
    app.setActiveThumbnail();
  },
  // Cette fonction créée une 'DIV' par image qui seront placées en haut de notre écran pour en faire des miniatures qui nous serviront de barre de navigation
  createThumbnails: function() {

    for (var i = 0; i < img.length; i++) {
      var thumbnail = $('<div>');
      thumbnail.addClass('thumbnail');
      thumbnail.css({
        'backgroundImage': 'url(' + img[i].url + ')',
        'backgroundSize': '100%'
      });

      // On applique un dataset nommé 'thumbindex' à chaque 'DIV' contenant tout simplement l'index sous forme de nombre : 0, 1, 2, etc..
      thumbnail.data('thumbindex', i);

      $('#slider-thumbs').append(thumbnail);
    }
  },
  // On rend les miniatures cliquables
  makeThumbnailsClickable: function() {
    $('.thumbnail').on('click', app.changeImage);
  },
  // Cette fonction se déclenche lorsque l'on clique sur une des miniatures ou une des flèches
  changeImage: function(evt) {
    // On stop l'éxécution du timer
    clearInterval(app.slideShowInterval);
    // On stop l'animation en cours
    $('#slider-images').stop();

    // Lorsque l'on clique sur une des miniatures on reçoit un event en paramètre et on l'exploite, cependant lorsque l'on clique sur une des flèches on va passer en paramètre l'index de l'image suivante (ou précédente)
    if (isNaN(evt)) app.currentImageIndex = $(evt.target).data('thumbindex');

    $('#slider-images').css({
      'backgroundImage': 'url(' + img[app.currentImageIndex].url + ')',
      'opacity': 1
    });

    app.setActiveThumbnail();
    // On relance un nouveau timer car on l'a stoppé juste avant
    app.slideShowInterval = setInterval(app.slideShow, app.transitionIntervalTime);
  },
  // Gère la classe de la miniature de l'image affichée à l'écran
  setActiveThumbnail: function() {
    // On supprime la classe 'active' de la miniature actuelle.
    $('#slider-thumbs .active').removeClass('active');

    // On applique à la nouvelle miniature la classe 'active'
    $('#slider-thumbs .thumbnail:nth-child(' + (app.currentImageIndex + 1) + ')').addClass('active');
  },
  // Modifie l'index de l'image à afficher en cas de clique sur une des deux flèches
  setNextThumbnail: function(evt) {
    if (evt.target.id === 'slider-right') {
      if (app.currentImageIndex === img.length - 1) app.currentImageIndex = 0;
      else app.currentImageIndex++;
    }
    else {
      if (app.currentImageIndex === 0) app.currentImageIndex = img.length - 1;
      else app.currentImageIndex--;
    }

    // On appelle la fonction changeImage() en lui passant en paramètre l'index de l'image que l'on souhaite afficher
    app.changeImage(app.currentImageIndex);
  }
};

document.addEventListener('DOMContentLoaded', app.init);
