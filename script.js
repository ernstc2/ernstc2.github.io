window.onscroll = function() {
    const nav = document.getElementById('nav');
    if (window.pageYOffset > 100) {
        nav.style.position = 'fixed';
        nav.style.top = 0;
        nav.style.width = '100%';
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
    } else {
        nav.style.position = 'relative';
        nav.style.background = 'transparent';
    }
};


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


const text = "I am Christopher Ernst-Fortin, the greatest coder to be. Fear my potential.";
let index = 0;

function typeText() {
    if (index < text.length) {
        document.getElementById('typed-text').innerHTML += text.charAt(index);
        index++;
        setTimeout(typeText, 50);
    }
}

window.onload = function() {
    typeText();

};
