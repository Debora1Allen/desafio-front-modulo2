const movies = document.querySelector(".movies");
const themeButton = document.querySelector(".btn-theme");
const body = document.querySelector("body");
const movie = document.querySelectorAll(".movie");
const moviesContainer = document.querySelector(".movies-container");
const buttonPrevious = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");
const modalDiv = document.querySelector(".modal");
const modalImage = document.querySelector("modal_img");
const input = document.querySelector("input");



localStorage.setItem("tema", "claro");

const tema = localStorage.getItem("tema");

body.style.setProperty(
    "--background-color",
    tema === "claro" ? "#FFF" : "#000"
);
body.style.setProperty("--color", tema === "claro" ? "#000" : "#FFF");
if (tema === "claro") {
    body.style.setProperty("--background-color", "#FFF");
    body.style.setProperty("--color", "#000");
    themeButton.src = "./assets/light-mode.svg";
} else {
    body.style.setProperty("--background-color", "#000");
    body.style.setProperty("--color", "#FFF");
    themeButton.src = "./assets/dark-mode.svg";
}



themeButton.addEventListener("click", function() {
    const colorText = body.style.getPropertyValue("--color");
    const tema = localStorage.getItem("tema");
    if (tema === "claro") {
        localStorage.setItem("tema", "escuro");
        themeButton.src = "./assets/dark-mode.svg";
        body.style.setProperty("--color", "#FFF");
    } else {
        localStorage.setItem("tema", "claro");
        themeButton.src = "./assets/light-mode.svg";
        body.style.setProperty("--color", "#000");
    }
    const backgroundColor =
        body.style.getPropertyValue("--background-color") === "#000" ?
        "#FFF" :
        "#000";
    body.style.setProperty("--background-color", backgroundColor);


});



Promise.all([
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"),
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR")
]).then(([
    movieDoDia, trailer
]) => {
    const promiseMovieDoDia = movieDoDia.json();
    const promiseTrailer = trailer.json();
    promiseMovieDoDia.results;


    const higligVideo = document.querySelector(".highlight__video");
    const hightligthTitle = document.querySelector(".highlight__title");
    const highlightRating = document.querySelector(".highlight__rating");
    const highlightGenres = document.querySelector(".highlight__genres");
    const highlightLaunch = document.querySelector(".highlight__launch");
    const highlightDescription = document.querySelector(".highlight__description");
    const highlightVideoLink = document.querySelector(".highlight__video-link");


    promiseMovieDoDia.then(function(body) {
        let generosFilmes = [];
        body.genres.forEach(item => {
                generosFilmes.push(item.name);
            })
            // higligVideo.style.backgroundImage = `url(${body.backdrop_path})`;
        hightligthTitle.textContent = body.title;
        highlightRating.textContent = body.vote_average;
        highlightGenres.textContent = generosFilmes.join(", ");
        highlightLaunch.textContent = moment(body.release_date).locale("pt-br").format('LL');
        highlightDescription.textContent = body.overview;


    });

    promiseTrailer.then(function(body) {
        highlightVideoLink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;

    })

})





function postersFilmes(moviesPosters) {
    movies.textContent = "";
    moviesPosters.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie");
        div.setAttribute("id", movie.id);
        const poster = document.createElement("img");
        const divTitle = document.createElement("div");
        divTitle.classList.add("movie__info");
        const titulo = document.createElement("span");
        titulo.classList.add("movie__title");
        const nota = document.createElement("span");
        const estrela = document.createElement("img");
        nota.classList.add("movie__rating");

        estrela.src = "./assets/estrela.svg";

        poster.src = movie.poster_path;
        titulo.textContent = movie.title;
        nota.textContent = movie.vote_average;
        nota.append(estrela);
        divTitle.append(titulo, nota);
        div.append(poster, divTitle);
        div.addEventListener("click", function(event) {

            modalDiv.classList.remove("hidden");


            abrirModal(movie.id);
        });
        const botaoClose = document.querySelector(".modal__close ");
        botaoClose.addEventListener("click", function() {
            modalDiv.classList.add("hidden");
        })
        movies.append(div);

    });
}


let paginasFilmes = [];
fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
).then(function(resposta) {
    const promise = resposta.json();
    promise.then(function(body) {


        for (let i = 0; i < 4; i++) {
            paginasFilmes.push(body.results.splice(0, 5));

        }

        postersFilmes(paginasFilmes[0]);
    });
});


function modalFilmes(modal) {
    const titulo = document.querySelector(".modal__title");
    const modalImage = document.querySelector(".modal__img");
    const descripition = document.querySelector(".modal__description");
    const averageModal = document.querySelector(
        ".modal__genre-averege",
        ".modal__average"
    );
    titulo.textContent = modal.title;
    modalImage.src = modal.backdrop_path;
    descripition.textContent = modal.overview;
    averageModal.textContent = modal.vote_average;
}

function abrirModal(id) {
    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`).then(function(resposta) {
        const promise = resposta.json();
        promise.then(function(body) {
            modalFilmes(body);
        })
    })

    modalImage.src = src;
    modalDiv.style.display = "flex";
}






input.addEventListener("keydown", function(event) {
    if (input.value !== "" && event.key === "Enter") {
        const promiseResposta = fetch(
            `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`
        );



        promiseResposta.then(function(resposta) {
            const promise = resposta.json();
            promise.then(function(elemento) {
                console.log("elemento >", elemento);
                const excluidos = document.querySelectorAll(".movie");
                excluidos.forEach(item => {
                    item.remove();
                });

                let filmesInput = [];
                for (let i = 0; i < 4; i++) {
                    filmesInput.push(elemento.results.splice(0, 5));

                }
                console.log("input >", filmesInput);
                filmesInput.forEach((item, index) => {
                    return postersFilmes(filmesInput[index]);

                });


            });
        });
        input.value = "";
        return;
    }
    if (input.value === "" && event.key === "Enter") {
        let paginasFilmes = [];
        fetch(
            "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
        ).then(function(resposta) {
            const promise = resposta.json();
            promise.then(function(body) {


                for (let i = 0; i < 4; i++) {
                    paginasFilmes.push(body.results.splice(0, 5));

                }

                postersFilmes(paginasFilmes[0]);
            });
        });
        return;
    }

});




let currentIndex = 0;
buttonNext.addEventListener("click", function() {
    if (currentIndex === paginasFilmes.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    postersFilmes(paginasFilmes[currentIndex])
});

buttonPrevious.addEventListener("click", function() {
    if (currentIndex === 0) {
        currentIndex = paginasFilmes.length - 1;



    } else {
        currentIndex--;

        postersFilmes(paginasFilmes[currentIndex]);
    }
});