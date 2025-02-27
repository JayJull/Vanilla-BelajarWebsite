document.addEventListener('DOMContentLoaded', function() {
    const themeButton = document.querySelector('nav button');
    
    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeButton.textContent = 'Mode Terang';
        } else {
            themeButton.textContent = 'Mode Gelap';
        }
    });
});

