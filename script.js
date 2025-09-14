document.addEventListener('DOMContentLoaded', () => {

    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');
    const backgroundMusic = document.getElementById('background-music');

    // Mulai Interaksi
    startButton.addEventListener('click', () => {
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            mainContent.style.opacity = '1';
        }, 1000);

        // Putar musik (memerlukan interaksi pengguna)
        backgroundMusic.play().catch(error => {
            console.log("Autoplay was prevented. User needs to interact with the page first.");
        });
    });

    // Inisialisasi Swiper untuk Galeri
    var swiper = new Swiper('.swiper', {
        loop: true,
        effect: 'fade', // ✅ transisi fade
        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    swiper.autoplay.start();


    // Animasi saat Scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Data Kuis
    const quizData = [
        {
            question: "Di mana kita pertama kali dinner romantis?",
            options: ["Restoran A", "Kafe B", "Warung C", "Di Rumah"],
            answer: "Kafe B"
        },
        {
            question: "Apa judul film pertama yang kita tonton bareng di bioskop?",
            options: ["Film Horor", "Film Komedi", "Film Aksi", "Film Romantis"],
            answer: "Film Aksi"
        },
        {
            question: "Apa panggilan sayang favoritku untukmu?",
            options: ["Beb", "Sayang", "Mochi", "Cinta"],
            answer: "Mochi"
        }
    ];

    const quizContainer = document.getElementById('quiz-container');
    const quizResult = document.getElementById('quiz-result');
    let currentQuestionIndex = 0;
    let score = 0;

    function loadQuiz() {
        if (currentQuestionIndex < quizData.length) {
            const currentQuestion = quizData[currentQuestionIndex];
            quizContainer.innerHTML = `
                <div class="quiz-question">${currentQuestion.question}</div>
                <div class="quiz-options">
                    ${currentQuestion.options.map(option => `<button class="option">${option}</button>`).join('')}
                </div>
            `;

            document.querySelectorAll('.option').forEach(button => {
                button.addEventListener('click', (e) => {
                    checkAnswer(e.target.innerText);
                });
            });
        } else {
            showResult();
        }
    }

    function checkAnswer(selectedAnswer) {
        if (selectedAnswer === quizData[currentQuestionIndex].answer) {
            score++;
        }
        currentQuestionIndex++;
        loadQuiz();
    }



    function showResult() {
        quizContainer.innerHTML = '';
        let resultText = '';
        if (score === quizData.length) {
            resultText = `Hebat! Kamu benar semua (${score}/${quizData.length}). Kamu memang paling a-ingat semuanya! ❤️`;
        } else if (score > 0) {
            resultText = `Kamu benar ${score} dari ${quizData.length} pertanyaan. Not bad, kamu masih ingat kenangan kita! 😉`;
        } else {
            resultText = `Yah, kok salah semua? Nggak apa-apa, yang penting kita buat kenangan baru lagi! 😂`;
        }
        quizResult.innerText = resultText;
    }

    loadQuiz();
});