document.addEventListener('DOMContentLoaded', () => {
    // Reset scroll position on load to prevent browser from hiding the hero section
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Inicialização do Lenis (Smooth Scroll para PC)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Suporte a links âncora com Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                lenis.scrollTo(target, { offset: -100 });
            }
        });
    });

    // 0. Scroll Reveal Animations (A Mágica acontece aqui!)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const revealOptions = {
        threshold: 0.15, // Aciona quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px" // Dispara um pouco antes de chegar na borda inferior
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Anima apenas 1 vez (não fica repetindo no sobe e desce)
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 1. Inicializa os Ícones Lucide
    lucide.createIcons();

    // 2. Lógica do Menu Mobile
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-navigation-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    let menuTimeout;
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        clearTimeout(menuTimeout);
        
        if (isMenuOpen) {
            menuBtn.classList.add('open');
            mobileMenu.style.display = 'block'; 
            // Força o navegador a recalcular o layout antes de remover o hidden
            mobileMenu.offsetHeight; 
            mobileMenu.classList.remove('hidden');
        } else {
            menuBtn.classList.remove('open');
            mobileMenu.classList.add('hidden');
            menuTimeout = setTimeout(() => {
                if(!isMenuOpen) mobileMenu.style.display = 'none';
            }, 300); 
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }
    
    mobileLinks.forEach(link => link.addEventListener('click', () => {
        if(isMenuOpen) toggleMenu();
    }));

    // 3. Carrossel 3D do Instagram (Performance Otimizada)
    const galleryData = [
        { url: "/img/Foto1.png", tag: "Lash Lifting" },
        { url: "/img/Foto4.png", tag: "Volume Europeu" },
        { url: "/img/Foto6.png", tag: "Efeito Delineado/Fox Eyes" },
        { url: "/img/Foto3.png", tag: "Volume Europeu" },
        { url: "/img/Foto2.png", tag: "Lash Lifting" },
        { url: "/img/Foto5.png", tag: "Volume Europeu" }
    ];

    let wheelIndex = 0;
    const totalItems = galleryData.length;
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track && dotsContainer) {
        function initCarousel() {
            track.innerHTML = ''; 
            dotsContainer.innerHTML = ''; 

            galleryData.forEach((item, idx) => {
                // Cria o Slide
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                slide.innerHTML = `
                    <span class="slide-tag">${item.tag}</span>
                    <img src="${item.url}" alt="${item.tag}" />
                    <div class="slide-footer">@studiojuliaradael</div>
                `;
                track.appendChild(slide);

                // Cria a Bolinha (Dot)
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.onclick = () => { 
                    wheelIndex = idx; 
                    updateCarousel(); 
                };
                dotsContainer.appendChild(dot);
            });

            updateCarousel();
        }

        function updateCarousel() {
            const slides = track.querySelectorAll('.carousel-slide');
            const dots = dotsContainer.querySelectorAll('.carousel-dot');

            slides.forEach((slide, idx) => {
                let offset = idx - wheelIndex;
                if (offset < -totalItems / 2) offset += totalItems;
                if (offset > totalItems / 2) offset -= totalItems;

                if (Math.abs(offset) > 2) {
                    slide.style.transform = "scale(0.5) translateX(0)";
                    slide.style.opacity = "0";
                    slide.style.zIndex = "0";
                    return;
                }

                let transformStyle = "scale(0.5) translateX(0)";
                let zIndex = "0";
                let opacity = "0";

                if (offset === 0) {
                    transformStyle = "scale(1) translateX(0)";
                    zIndex = "20";
                    opacity = "1";
                } else if (offset === 1) {
                    transformStyle = "scale(0.8) translateX(110%)";
                    zIndex = "10";
                    opacity = "0.8";
                } else if (offset === -1) {
                    transformStyle = "scale(0.8) translateX(-110%)";
                    zIndex = "10";
                    opacity = "0.8";
                } else if (offset === 2) {
                    transformStyle = "scale(0.5) translateX(200%)";
                    zIndex = "0";
                    opacity = "0";
                } else if (offset === -2) {
                    transformStyle = "scale(0.5) translateX(-200%)";
                    zIndex = "0";
                    opacity = "0";
                }

                slide.style.transform = transformStyle;
                slide.style.zIndex = zIndex;
                slide.style.opacity = opacity;
            });

            dots.forEach((dot, idx) => {
                if (idx === wheelIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            wheelIndex = (wheelIndex + 1) % totalItems;
            updateCarousel();
        }
        
        function prevSlide() {
            wheelIndex = (wheelIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        const btnNext = document.getElementById('btn-next');
        const btnPrev = document.getElementById('btn-prev');
        
        if (btnNext) btnNext.addEventListener('click', nextSlide);
        if (btnPrev) btnPrev.addEventListener('click', prevSlide);

        // Touch events for drag
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, {passive: true});

        function handleGesture() {
            if (touchEndX < touchStartX - 40) {
                nextSlide();
            }
            if (touchEndX > touchStartX + 40) {
                prevSlide();
            }
        }

        initCarousel();
        setInterval(nextSlide, 5000); // Roda automático a cada 5s
    }

    // 4. Espião de Rolagem (Scroll Spy) Robusto
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-link-premium, .mobile-link');

    function updateActiveSection() {
        let currentSection = null;

        // Itera sobre as seções para descobrir qual está ativa
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Considera a seção ativa se o topo dela estiver a 150px do topo da tela ou menos
            // Isso compensa o menu fixo e o offset que colocamos no clique
            if (rect.top <= 150) {
                currentSection = section;
            }
        });

        // Garante que o último item seja marcado se chegarmos no final absoluto da página
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            currentSection = document.getElementById('location');
        }

        if (currentSection) {
            const currentId = currentSection.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Ouve o evento de scroll da janela para atualizar
    window.addEventListener('scroll', updateActiveSection);
    // Chamada inicial para marcar o item correto assim que a página carregar
    updateActiveSection();
});