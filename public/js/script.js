verticalScroll();
document.addEventListener("DOMContentLoaded", function() {
    const isHomePage = window.location.pathname === "/";

    if (isHomePage) {
        connexionForm();
        // Activer la fonction connexionForm() uniquement sur la page d'accueil
    } else {
        toogleNavItems(); // Activer la fonction toggleNavItems() sur toutes les autres pages
    }
});


function closePanel(genre) {
    const bookDetails = document.getElementById(`bookDetails-${genre}`);
    console.log(bookDetails);
    // Écouteur d'événement pour détecter la fin de l'animation
    bookDetails.classList.remove("expand");
    bookDetails.classList.add("retract");

    bookDetails.innerHTML = '';
    currentBookId = null;

}

let currentBookId = null; // Variable pour stocker l'ID du livre actuellement affiché

async function showSelectedBookGenre(genre, button) {
    const bookId = button.getAttribute('data-id');
    // Vérifier si un livre est déjà affiché
    if (currentBookId === bookId) {
        return; // Sortir de la fonction si le même livre est déjà affiché
    }

    const response = await fetch(`/discover/${bookId}`);
    const livre = await response.json();

    const bookDetails = document.getElementById(`bookDetails-${genre.toLowerCase().replace(/\s/g, '')}`);
    bookDetails.classList.remove("retract");
    bookDetails.classList.add("expand")

    // Vider le contenu de bookDetails
    bookDetails.innerHTML = '';

    const bookDescription = `
        <div class="d-flex mt-2 contentDesc">
        <div class="imgCoverDetails col-md-3">
            <img src="${livre.cover}" alt="book cover" width="100%">
        </div>
        <div class="d-flex infos col-md-9">
            <div class="w-100">
            <h3>${livre.auteur}</h3>
            <h2>${livre.titre}</h2>
            <p>${livre.description}</p>
            <a href=""><button>Start reading this book</button></a>
            </div>
            <div>
            <i class="fa fa-times btn-close closeBook" onclick="closePanel('${livre.genre}')"></i>
            </div>
        </div>
        </div>
    `;

    bookDetails.innerHTML = bookDescription;

    // Mettre à jour l'ID du livre actuellement affiché
    currentBookId = bookId;
}
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-book');
    buttons.forEach(button => {
        button.addEventListener('click', async(event) => {
            console.log("click");
            event.preventDefault();
            const genre = button.dataset.genre;
            await showSelectedBookGenre(genre, button);
        });
    });
});

function verticalScroll() {
    document.addEventListener('DOMContentLoaded', () => {
        const scrollContent = document.querySelector('.scroll-bar');
        const scrollLeftBtn = document.querySelector('.scroll-left-btn');
        const scrollRightBtn = document.querySelector('.scroll-right-btn');

        let isScrolling = false;
        let scrollAmount = 200; // Nombre de pixels à défiler à chaque étape

        scrollLeftBtn.addEventListener('mousedown', () => {
            isScrolling = true;
            scroll('left');
        });

        scrollRightBtn.addEventListener('mousedown', () => {
            isScrolling = true;
            scroll('right');
        });

        document.addEventListener('mouseup', () => {
            isScrolling = false;
        });

        document.addEventListener('mouseleave', () => {
            isScrolling = false;
        });

        function scroll(direction) {
            if (isScrolling) {
                if (direction === 'left') {
                    scrollContent.scrollBy({
                        left: -scrollAmount,
                        behavior: 'smooth'
                    });
                } else if (direction === 'right') {
                    scrollContent.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }

                // On vérifie si on a atteint la fin d'un bloc, sinon on continue le défilement
                if (scrollContent.scrollLeft % scrollAmount !== 0) {
                    requestAnimationFrame(() => scroll(direction));
                }
            }
        }
    });

}

console.log(document.querySelectorAll("li.dropdown"));

// Open close dropdown on click


function toogleNavItems() {
    document.querySelectorAll("li.dropdown").forEach(function(item) {
        item.addEventListener("mouseenter", function() {
            console.log("test");
            var dropdownMenu = this.querySelector(".dropdown-menu");
            if (this.classList.contains("open")) {
                dropdownMenu.style.display = "none";
                this.classList.remove("open");
            } else {
                dropdownMenu.style.display = "block";
                this.classList.add("open");
            }
        });
    });

    // Close dropdown on mouseleave
    document.querySelectorAll("li.dropdown").forEach(function(item) {
        item.addEventListener("mouseleave", function() {
            var dropdownMenu = this.querySelector(".dropdown-menu");
            dropdownMenu.style.display = "none";
            this.classList.remove("open");
        });
    });

    // Navbar toggle
    document.querySelector(".navbar-toggle").addEventListener("click", function() {
        var navbarCollapse = document.querySelector(".navbar-collapse");
        navbarCollapse.classList.toggle("collapse");
        navbarCollapse.style.display = (navbarCollapse.style.display === "block") ? "none" : "block";
    });
}

function showModal(e) {
    //on defnit le modal par le nom recupéré
    //dans le paramettre, ici c'est un attribut
    console.log('modale:', e);
    let modal = document.querySelector('[' + e + ']');
    modal.showModal()

    // Empêcher la fermeture de la modal lorsque l'utilisateur clique en dehors d'elle
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            event.preventDefault();
        }
    });

    // Fermer la modal lorsque l'utilisateur quitte la fenêtre de la modal
    window.addEventListener('blur', function() {
        modal.close();
    });
}


function closeModal(e) {
    let modal = document.querySelector('[' + e + ']');
    modal.close()
}


function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = "none";
    }
}

function fadeInElement(selector, delay = 0) {
    const element = document.querySelector(selector);
    if (element) {
        setTimeout(() => {
            element.style.display = "block";
        }, delay);
    }
}

function fadeOutElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = "none";
    }
}

function setActive(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add("active");
    }
}

function removeActive(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.remove("active");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    hideElement(".email-signup");

    const signupBoxLink = document.querySelector("#signup-box-link");
    if (signupBoxLink) {
        signupBoxLink.addEventListener("click", function() {
            fadeOutElement(".email-login");
            fadeInElement(".email-signup", 100);
            removeActive("#login-box-link");
            setActive("#signup-box-link");
        });
    }

    const loginBoxLink = document.querySelector("#login-box-link");
    if (loginBoxLink) {
        loginBoxLink.addEventListener("click", function() {
            fadeInElement(".email-login", 100);
            fadeOutElement(".email-signup");
            setActive("#login-box-link");
            removeActive("#signup-box-link");
        });
    }
});

function writeBook() {
    //get form named writeABook
    const form = document.querySelector("#writeABook");
    //get all input from form
    const inputs = form.querySelectorAll("input");
    //get all textarea from form
    const textareas = form.querySelectorAll("textarea");
    //get all select from form
    const selects = form.querySelectorAll("select");
    let csrfToken = form.querySelector("input[name='_csrf']").value;

    //if inputs/textareas/select are empty then log empty and return
    if (inputs.value == "" || textareas.value == "" || selects.value == "") {
        console.log("empty");
        return;
    }
    //create an object with all inputs/textareas/selects value
    let data = {
        titre: inputs[0].value,
        description: textareas[0].value,
        genre: selects[0].value,
        auteur: inputs[1].value,
        cover: inputs[2].value,
        bacolor: inputs[3].value,
        resume: textareas[1].value,
        histoire: textareas[2].value,
    };
    console.log(data);
    //post to /ajouterLivre
    fetch("/ajouterLivre", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken,
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            response.json()
        })
        .catch((err) => {
            console.error(err);
        });
}
//create a function to get .email-signup form and post value fo imputs
function signup(form) {
    let pn = form.querySelector("input[type='text']")
    let email = form.querySelector("input[type='email']");
    let password = form.querySelector("input[type='password']");
    let passwordConfirm = form.querySelector("input[name='confirmPass']");
    let csrfToken = form.querySelector("input[name='_csrf']").value; // Récupérer le token CSRF

    if (password.value != passwordConfirm.value) {
        console.log("passwords don't match");
        return; // Return from the function, so that it doesn't continue with other code in this function
    }
    let data = {
        pn: pn.value,
        email: email.value,
        idCo: password.value,
    };
    fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken,
            },
            body: JSON.stringify(data),

        })
        .then((response) => {
            response.json()
            window.location.href = "/discover";
        })
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.error(err);
        });
}

function connect(form) {
    let email = form.querySelector("input[type='email']").value;
    let password = form.querySelector("input[type='password']").value;
    let csrfToken = form.querySelector("input[name='_csrf']").value; // Récupérer le token CSRF

    if (!email || !password) {
        console.log("Veuillez remplir tous les champs.");
        return;
    }

    let data = {
        email: email,
        idCo: password,
    };
    console.log(data);

    fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken, // Utilisez "CSRF-Token" en majuscules
            },
            body: JSON.stringify(data),
        })
        .then(async(response) => {
            if (response.status === 200) {
                const responseData = await response.json();
                console.log(responseData);
                window.location.href = "/discover";
            } else {
                console.log("La connexion a échoué.");
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

// Écouteur d'événement pour la mise à jour du contenu après connexion réussie
document.addEventListener('updateContent', function(event) {
    // Mettez à jour le contenu de la page avec les informations de l'utilisateur connecté
    let userSpan = document.querySelector(".fa-user");
    let userLink = userSpan.parentNode;
    userSpan.textContent = event.detail.userPn;
    userLink.href = "#"; // Mettez à jour le lien si nécessaire

    // ... Autres mises à jour nécessaires
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#file_upload')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}



function connexionForm() {
    const loginBtn = document.getElementById('loginMain');
    const signupBtn = document.getElementById('signupMain');
    loginBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode.parentNode;
        Array.from(e.target.parentNode.parentNode.classList).find((element) => {
            if (element !== "slide-up") {
                parent.classList.add('slide-up');
            } else {
                signupBtn.parentNode.classList.add('slide-up');
                parent.classList.remove('slide-up');
            }
        });
    });

    signupBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode;
        Array.from(e.target.parentNode.classList).find((element) => {
            if (element !== "slide-up") {
                parent.classList.add('slide-up');
            } else {
                loginBtn.parentNode.parentNode.classList.add('slide-up');
                parent.classList.remove('slide-up');
            }
        });
    });
}