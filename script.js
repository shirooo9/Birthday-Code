document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');
    const backgroundMusic = document.getElementById('background-music');

    // Safe guards
    if (!startScreen || !mainContent) {
        console.warn('Start screen or main content not found in DOM.');
    }

    // --- Music toggle button ---
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle && backgroundMusic) {
        musicToggle.addEventListener('click', () => {
            if (backgroundMusic.muted) {
                backgroundMusic.muted = false;
                musicToggle.textContent = "🔊";
            } else {
                backgroundMusic.muted = true;
                musicToggle.textContent = "🔇";
            }
        });
    }

    // --- Start Screen Handler ---
    function revealMain() {
        if (startButton) startButton.disabled = true;
        if (startScreen) startScreen.classList.add('fade-out');

        function onTransitionEnd(e) {
            if (e.propertyName && e.propertyName !== 'opacity') return;
            if (startScreen) startScreen.classList.add('hidden');
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.style.opacity = '1';
            }
            if (startScreen) startScreen.removeEventListener('transitionend', onTransitionEnd);
        }

        if (startScreen) {
            startScreen.addEventListener('transitionend', onTransitionEnd, { once: true });
        }

        setTimeout(() => {
            if (startScreen && !startScreen.classList.contains('hidden')) {
                startScreen.classList.add('hidden');
                if (mainContent) {
                    mainContent.classList.remove('hidden');
                    mainContent.style.opacity = '1';
                }
            }
        }, 1000);

        if (backgroundMusic) {
            backgroundMusic.play().catch(err => {
                console.log('Background music autoplay prevented or failed:', err);
            });
        }
    }

    if (startButton) {
        startButton.addEventListener('click', (e) => {
            if (startButton.disabled) return;
            revealMain();
        });
        startButton.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !startButton.disabled) {
                e.preventDefault();
                revealMain();
            }
        });
    }

    // --- Swiper init (if present) ---
    try {
        if (typeof Swiper !== 'undefined') {
            var swiper = new Swiper('.swiper', {
                loop: true,
                effect: 'fade',
                fadeEffect: { crossFade: true },
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
            if (swiper && swiper.autoplay) swiper.autoplay.start();
        }
    } catch (err) {
        console.warn('Swiper init failed:', err);
    }

    // --- Scroll reveal ---
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));

    // =====================================================
    //                🎂 Whack-a-Cake Game (loop until win)
    // =====================================================
    const holes = document.querySelectorAll('.hole');
    const cakes = document.querySelectorAll('.cake');
    const scoreBoard = document.getElementById('score');
    const popup = document.getElementById('popup');
    const gameContainer = document.getElementById('game-container');

    let score = 0;
    let lastHole;
    let gameOver = false;

    // --- Sound effect ---
    const hitSound = new Audio('sounds/hit.mp3'); // sediakan file sounds/hit.mp3

    // inisialisasi dataset untuk tiap kue
    cakes.forEach(cake => {
        cake.dataset.originalSrc = cake.getAttribute('src') || 'game/cake.png';
        cake.dataset.brokenSrc = cake.dataset.brokenSrc || 'game/cake_broken.png';
        cake.dataset.hit = 'false';
    });

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole && holes.length > 1) {
            return randomHole(holes);
        }
        lastHole = hole;
        return hole;
    }

    function showCake() {
        if (gameOver) return;

        const time = randomTime(600, 1200);
        const hole = randomHole(holes);
        const cake = hole.querySelector('.cake');

        cake.dataset.hit = 'false';
        cake.src = cake.dataset.originalSrc;
        cake.classList.add('show');
        cake.classList.remove('hidden', 'broken');

        setTimeout(() => {
            cake.classList.remove('show');
            if (!gameOver) {
                showCake(); // langsung lanjut lagi tanpa berhenti
            }
        }, time);
    }

    // klik kue
    cakes.forEach(cake => {
        cake.addEventListener('click', () => {
            if (!cake.classList.contains('show')) return;
            if (cake.dataset.hit === 'true') return;

            cake.dataset.hit = 'true';
            score++;
            scoreBoard.textContent = `Score: ${score}`;

            // efek pecah
            cake.src = cake.dataset.brokenSrc;
            cake.classList.add('broken');

            // mainkan suara
            hitSound.currentTime = 0;
            hitSound.play();

            setTimeout(() => {
                cake.classList.remove('show');
            }, 250);

            if (score >= 5) {
                endGame();
            }
        });
    });

    function startGame() {
        score = 0;
        scoreBoard.textContent = 'Score: 0';
        gameContainer.classList.remove('hidden');
        scoreBoard.classList.remove('hidden');
        popup.classList.remove('show');

        gameOver = false;
        showCake();
    }

    function endGame() {
        gameOver = true;
        gameContainer.classList.add('hidden');
        scoreBoard.classList.add('hidden');
        popup.classList.add('show');

        // confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 200,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    }

    // mulai game saat section game muncul
    const gameSection = document.getElementById('game');
    const gameObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startGame();
                gameObserver.unobserve(gameSection);
            }
        });
    }, { threshold: 0.5 });
    gameObserver.observe(gameSection);


    // Optional popup close button (if provided in DOM)
    const popupClose = document.querySelector('#popup .close-btn');
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            if (popup) popup.classList.remove('show');
            startGame();
        });
    }
});
