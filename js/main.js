const topButton = document.querySelector('#top-button');

/** Scroll To Top Button */

//remonter en haut de page qaund on clique sur le bouton
topButton.addEventListener('click', scrollToTop);

//rendre le scroll smooth
function scrollToTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    })
}

//faire pop la bouton quand on scroll trop bas
window.addEventListener('scroll', () => {
    if (window.scrollY * 4 > window.innerHeight) {
        topButton.style.scale = 1;
    } else {
        topButton.style.scale = 0;
    }
});

//contient les icones de motif de la création d'un projet
const purposes = {
    personnal: "fa-solid fa-user",
    educational: "fa-solid fa-graduation-cap",
};

var cards;
var allSkills;
var allSkillsContainers;
const skillsContainer = document.getElementById('skills-container');

//var cardsElements = [];
/*récupère le informations sur les projets contenues dans le fichier json*/
fetch('res/data/projects.json')
    .then(response => response.json())
    .then(data => {
        cards = data.projects;
        allSkills = data.skills;
        let lastCard;
        let container;

        cards.forEach(card => {
            container = document.querySelector(`#${card.containerId} .cards-container`);
            container.insertAdjacentHTML('beforeend', generateCardCode(card));
            lastCard = container.lastElementChild;
            //cardsElements.push(lastCard);
            /*lastCard.addEventListener('click', function (event) {
                console.log(event.target)
            });*/

        });

        allSkills.forEach(skill => {
            skillsContainer.insertAdjacentHTML('beforeend', generateSkillCode(skill));
        });
        //addToDom();
        //console.log(cardsElements)
        allSkillsContainers = document.querySelectorAll('.one-skill');
        allSkillsContainers.forEach(skillContainer => {
            skillContainer.addEventListener("mouseover", function () {
                skillContainerOvered(skillContainer);
            });
            skillContainer.addEventListener("mouseleave", function () {
                skillContainerLeaved(skillContainer);
            });
        });
    })
    .catch(error => console.error("MyError : Unable to load projects' card content :", error));

//Génère le code pour la carte passée en paramètre
function generateCardCode(card) {
    let cardCode = `
    <div class="card" onClick="handleClick(this)">
    <div class="head">
        <img class="language-logo" src="res/img/languages/${card.language}.png" alt="logo du ${card.language}">
        <i class="${purposes[card.purpose]}"></i>
        <p>${card.date}</p>
    </div>
    <img class="thumb" src="${card.thumb}" alt="aperçu du projet">
    <h4>${card.title}</h4>
    </div>
    `
    return cardCode;
};

function generateSkillCode(skill) {
    let skillCode = `
    <div class="one-skill" data-tooltip-content="${skill.description}">
        <img src="res/img/languages/${skill.language}.png" alt="logo de le compétence" draggable="false"
                            title="${skill.overTitle}">
        <div class="progress-bar-empty">
            <div class="progress-bar-full" style="width: ${skill.progress}%;"></div>
        </div>
        <p class="pourcent">${skill.progress}%</p>
    </div>
    `
    return skillCode;
}

skillsContainer.addEventListener('mouseenter', () => {
    if (parseInt(window.getComputedStyle(skillsContainer).getPropertyValue('top')) === 0) {
        skillsContainer.style.animationPlayState = "paused";
        skillsContainer.style.scale = "1";
    }

});

skillsContainer.addEventListener('mouseleave', () => {
    skillsContainer.style.animationPlayState = "running";
});

function skillContainerOvered(skillContainerOvered) {
    allSkillsContainers.forEach(skillContainer => {
        if (skillContainer != skillContainerOvered) {
            skillContainer.style.opacity = ".2";
            skillContainer.style.scale = ".9";
        }

    });
    skillContainerOvered.style.scale = "1.1";
    skillsTooltip.innerText = skillContainerOvered.getAttribute("data-tooltip-content");
    skillsTooltip.style.display = "block";
}

function skillContainerLeaved(skillContainerLeaved) {
    allSkillsContainers.forEach(skillContainer => {
        if (skillContainer != skillContainerOvered) {
            skillContainer.style.opacity = "1";
            skillContainer.style.scale = "1";
        }
    });
    skillContainerLeaved.style.scale = "1";
    skillsTooltip.style.display = "none";
}

const skillsTooltip = document.getElementById('skills-tooltip');

document.body.addEventListener("mousemove", function (event) {
    moveTooltip(event);
});

function moveTooltip(e) {
    skillsTooltip.style.top = `${e.clientY + 15}px`;
    skillsTooltip.style.left = `${e.clientX + 15}px`;
    /*gsap.to(skillsTooltip, 0.2, {
        x: e.clientX,
        y: e.clientY,
        ease: "power4.out",
        delay: 0.05,
    });*/
}

/*function addToDom() {
    cardsElements.forEach(card => {

        card.addEventListener('click', openCardPopup);
    })
}*/

//const cardsContainer = document.getElementById('video-games');
//var cardsElements = cardsContainer.querySelectorAll('.card');
const projectsPopup = document.getElementById("projects-popup");
const popupCard = document.getElementById('popup-card');

const popupDescription = popupCard.querySelector(".description");
const pupThumb = popupCard.querySelector(".thumb");
const pupCatch = popupCard.querySelector(".catch");
const pupTitle = popupCard.querySelector(".pj-title");

var projectsPopupOpened = false;
var currentProjectIndex;
const prevousProjectBtn = popupCard.querySelector("#previous-project-btn");
const nextProjectBtn = popupCard.querySelector("#next-project-btn");

function handleClick(cardClicked) {
    currentProjectIndex = getIndexOfTitleId(cardClicked.lastElementChild.textContent);
    loadPopupContent();
    openCardPopup();
}

prevousProjectBtn.addEventListener('click', () => {
    if (currentProjectIndex > 0) {
        currentProjectIndex--;
    }
    loadPopupContent();
})

nextProjectBtn.addEventListener('click', () => {
    if (currentProjectIndex < cards.length - 1) {
        currentProjectIndex++;
    }
    loadPopupContent();
})

const projectInfosLst = document.getElementById('projects-infos-lst');
const projectContribs = popupCard.querySelector('.project-contribs');
const projectImproves = popupCard.querySelector('.project-improves');
const toolsLst = popupCard.querySelector('.tools-lst');

function loadPopupContent() {
    const currentProject = cards[currentProjectIndex];

    popupDescription.innerText = currentProject.description;
    pupThumb.src = currentProject.descriptionImages[0];
    pupTitle.innerText = currentProject.title;
    pupCatch.innerText = currentProject.catchPhrase;
    projectInfosLst.innerHTML = getProjectInfosLstCode(currentProject);
    projectContribs.innerHTML = getProjectContribsimprovesCode(currentProject, "contribs");
    projectImproves.innerHTML = getProjectContribsimprovesCode(currentProject, "improves");
    toolsLst.innerHTML = getToolsCode(currentProject);
}

function getProjectInfosLstCode(project) {
    let code = `
    <li><span class="bold">Objectif:</span> ${project.infos.goal}</li>
    <li><span class="bold">Date:</span> ${project.infos.date}</li>
    <li><span class="bold">Délais:</span> ${project.infos.timeLimit}</li>
    <li><span class="bold">Equipe:</span> ${project.infos.team}</li>
    <li><span class="bold">Contexte:</span> ${project.infos.context}</li>
    <li><span class="bold">Language(s):</span> ${project.infos.languages}</li>
    `;
    return code;
}

function getToolsCode(project) {
    let code = ``;
    project.tools.forEach(item => {
        code += `<li><a>${item}</a></li>`;
    })
    return code;
}

function getProjectContribsimprovesCode(project, category) {
    let code = ``;
    project[category].forEach(item => {
        code += `<li><i class="fa-solid fa-arrow-right"></i> ${item}</li>`;
    })
    return code;
}

function getIndexOfTitleId(titleId) {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].title == titleId) {
            return i;
        }
    }
    return -1;
}

/*ouvrir popup si une carte est cliquée */
/*cardsElements.forEach(card => {

    card.addEventListener('click', openCardPopup);
})*/

document.addEventListener('mouseup', function (event) {
    if (projectsPopupOpened && !popupCard.contains(event.target)) {
        closeCardPopup();
    }
});

function openCardPopup() {
    projectsPopupOpened = true;
    setScroll(false);
    projectsPopup.style.display = "flex";
    if (popupCard.clientHeight < 1) {
        popupCard.style.height = '70%';
    }
}

function closeCardPopup() {
    projectsPopupOpened = false;
    setScroll(true);
    if (popupCard.clientHeight > 1) {
        popupCard.style.height = '0px';
    }
}

projectsPopup.addEventListener('transitionend', () => {
    if (popupCard.clientHeight < 1) {
        projectsPopup.style.display = "none";
    }
})

function setScroll(state) {
    state ? document.removeEventListener("mousewheel", preventDefault, { passive: false }) : document.addEventListener("mousewheel", preventDefault, { passive: false });
}

function preventDefault(event) {
    event.preventDefault();
}

/*curseur de la souris personnalisé*/
let innerCursor = document.querySelector('.inner-cursor');
let outerCursor = document.querySelector('.outer-cursor');


document.addEventListener('mousemove', moveCursor);

function moveCursor(e) {
    let x = e.clientX;
    let y = e.clientY;

    innerCursor.style.left = `${x}px`;
    innerCursor.style.top = `${y}px`;

    outerCursor.style.left = `${x}px`;
    outerCursor.style.top = `${y}px`;
}


let links = document.querySelectorAll("a, li, input, button, .top-btn, .card, .unfold-button, .clickable");


links.forEach((link) => {
    link.addEventListener('mouseover', () => {
        innerCursor.classList.add("grow");
    });

    link.addEventListener('mouseleave', () => {
        innerCursor.classList.remove('grow');
    });
})

document.addEventListener('mousedown', popCursor);

function popCursor(e) {
    innerCursor.style.width = "5px";
    innerCursor.style.height = "5px";
    innerCursor.style.backgroundColor = "orange";
}

document.addEventListener('mouseup', popupCursor);

function popupCursor(e) {
    innerCursor.style.width = "10px";
    innerCursor.style.height = "10px";
    innerCursor.style.backgroundColor = "";
}

/*boutons pour plier ou déplier les sections de projets*/
const allFoldButtons = document.querySelectorAll('.unfold-button');

allFoldButtons.forEach(element => {

    element.addEventListener('click', function () {

        const currentChoice = this.parentNode.parentNode.parentNode.childNodes[3];

        const height = currentChoice.scrollHeight;

        if (this.src.includes('plus')) {
            this.src = 'res/img/minus.svg';

            gsap.to(currentChoice, { duration: 0.2, height: height + 40, opacity: 1, padding: '20px 15px' })
        } else if (this.src.includes('minus')) {
            this.src = 'res/img/plus.svg';
            gsap.to(currentChoice, { duration: 0.2, height: 0, opacity: 0, padding: '0px 15px' })
        }

    })

})

window.addEventListener("resize", adaptFolded);

function adaptFolded() {
    allFoldButtons.forEach(element => {
        if (element.src.includes('minus')) {
            const currentChoice = element.parentNode.parentNode.parentNode.childNodes[3];
            currentChoice.style.height = "0px";
            const height = currentChoice.scrollHeight;
            gsap.to(currentChoice, { duration: 0.2, height: height + 40, opacity: 1, padding: '20px 15px' })
        }
    })
}

/*effet d'apparition au scroll*/
const slidingElements = document.querySelectorAll('.slide-in');

window.addEventListener('scroll', () => {

    const { scrollTop, clientHeight } = document.documentElement;

    slidingElements.forEach(element => {
        const topElementToTopViewport = element.getBoundingClientRect().top;

        if (scrollTop > (scrollTop + topElementToTopViewport).toFixed() - clientHeight * 0.8) {
            element.classList.add('active')
        }
    })
})

/*validation du formulaire*/
const sendButton = document.querySelector("#send");
const formInputs = document.querySelectorAll("#contact input")
sendButton.addEventListener('click', validate);

function validate() {

    formInputs.forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('not-verified');
        }
    })
}

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        if (input.className.includes("not-verified")) {
            input.classList.remove('not-verified');
        }
    })
})

/*effet de blur sur le header*/
const header = document.querySelector("header");

window.addEventListener('scroll', () => {
    if (window.scrollY < 20) {
        opacHeader();
    } else if (document.querySelector("header:hover") == null) {
        transparentHeader();
    }
})

function opacHeader() {
    header.style.background = "linear-gradient(135deg, rgba(13, 108, 224, 1), rgba(13, 108, 224, 1))";
}

function transparentHeader() {
    header.style.background = "linear-gradient(135deg, rgba(13, 108, 224, .8), rgba(13, 108, 224, .8))";
}

header.addEventListener('mouseover', opacHeader);

header.addEventListener('mouseout', () => {
    if (window.scrollY > 20) {
        transparentHeader();
    }
});

/*menu hamburger*/
let toggle = document.querySelector('.toggle-icons');
let body = document.querySelector('body');

toggle.addEventListener('click', function () {
    body.classList.toggle('opened');
})

let mainNavLis = document.querySelectorAll('#main-nav li');

mainNavLis.forEach(li => {
    li.addEventListener('click', () => {
        if (mobileMenuOpened()) {

            body.classList.toggle('opened');
        }
    })
})

function mobileMenuOpened() {
    return body.classList.contains('opened');
}

/*grossir mon portrait au survol*/
const portraitImg = document.querySelector("#aboutme img")
const portraitBackground = document.querySelector("#aboutme .color-rectangle")

portraitImg.addEventListener('mouseenter', () => {
    portraitBackground.style.opacity = "0";
});
portraitImg.addEventListener('mouseleave', () => {
    portraitBackground.style.opacity = "0.8";
});

/*-finir de rajouter tous les projets
-refaire première page (enlever dessin pas beau)
-mettre mon nom partout
-schéma dessin avant après pour les RETEX
-ne pas mettre les noms des projets mais des trucs originaux
-faire le responsive
*/