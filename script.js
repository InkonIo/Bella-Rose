

document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('header');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
    

    const testimonials = [
        {
            text: '"Невероятный сервис и потрясающий результат! Мастера действительно знают свое дело. Теперь это мой любимый салон красоты. Рекомендую всем!"',
            name: 'Алия Нурмухамедова',
            role: 'Постоянный клиент',
            img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        {
            text: '"Прекрасная атмосфера и профессиональный подход. Мария сделала мне потрясающий маникюр, который продержался 3 недели! Обязательно вернусь снова."',
            name: 'Диана Касымова',
            role: 'Клиент VIP-пакета',
            img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
        },
        {
            text: '"Записалась на свадебный образ и осталась в полном восторге! Прическа и макияж были идеальными весь день. Спасибо команде Bella Rose!"',
            name: 'Камила Ахметова',
            role: 'Невеста',
            img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
        }
    ];
    
    let currentTestimonial = 0;
    const testimonialText = document.getElementById('testimonialText');
    const testimonialName = document.getElementById('testimonialName');
    const testimonialRole = document.getElementById('testimonialRole');
    const testimonialImg = document.getElementById('testimonialImg');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    
    function updateTestimonial(index) {
        if (!testimonialText) return;
        
        const t = testimonials[index];
        
        testimonialText.style.opacity = '0';
        testimonialName.style.opacity = '0';
        testimonialRole.style.opacity = '0';
        testimonialImg.style.opacity = '0';
        
        setTimeout(() => {
            testimonialText.textContent = t.text;
            testimonialName.textContent = t.name;
            testimonialRole.textContent = t.role;
            testimonialImg.src = t.img;
            
            testimonialText.style.opacity = '1';
            testimonialName.style.opacity = '1';
            testimonialRole.style.opacity = '1';
            testimonialImg.style.opacity = '1';
        }, 300);
        
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    if (testimonialText) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial(currentTestimonial);
        }, 5000);
        
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                updateTestimonial(currentTestimonial);
            });
        });
    }

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
            
       
            contactForm.reset();
        });
    }

    const bookingForm = document.getElementById('bookingForm');
    const serviceOptions = document.querySelectorAll('.service-option');
    const timeSlots = document.querySelectorAll('.time-slot:not(.disabled)');
    const dateInput = document.getElementById('date');
    const masterSelect = document.getElementById('master');
    

    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }
    

    let selectedServices = [];
    let totalPrice = 0;
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('selected', checkbox.checked);
            
            updateBookingSummary();
        });
    });
    

    let selectedTime = null;
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.dataset.time;
            
            updateBookingSummary();
        });
    });
    

    if (dateInput) {
        dateInput.addEventListener('change', updateBookingSummary);
    }
    

    if (masterSelect) {
        masterSelect.addEventListener('change', updateBookingSummary);
    }
    
    function updateBookingSummary() {
        const summaryServices = document.getElementById('summaryServices');
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryMaster = document.getElementById('summaryMaster');
        const summaryTotal = document.getElementById('summaryTotal');
        const summaryTotalValue = document.getElementById('summaryTotalValue');
        const summaryDateValue = document.getElementById('summaryDateValue');
        const summaryTimeValue = document.getElementById('summaryTimeValue');
        const summaryMasterValue = document.getElementById('summaryMasterValue');
        
        if (!summaryServices) return;
        

        selectedServices = [];
        totalPrice = 0;
        
        serviceOptions.forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                selectedServices.push({
                    name: option.dataset.name,
                    price: parseInt(option.dataset.price)
                });
                totalPrice += parseInt(option.dataset.price);
            }
        });
        

        if (selectedServices.length > 0) {
            summaryServices.innerHTML = selectedServices.map(s => 
                `<div class="summary-item">
                    <span>${s.name}</span>
                    <span>${s.price.toLocaleString()} ₸</span>
                </div>`
            ).join('');
            summaryTotal.style.display = 'flex';
            summaryTotalValue.textContent = totalPrice.toLocaleString() + ' ₸';
        } else {
            summaryServices.innerHTML = '<p style="color: var(--brown); opacity: 0.7; font-style: italic;">Выберите услуги слева</p>';
            summaryTotal.style.display = 'none';
        }
        
        if (dateInput && dateInput.value) {
            const date = new Date(dateInput.value);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            summaryDateValue.textContent = date.toLocaleDateString('ru-RU', options);
            summaryDate.style.display = 'flex';
        }
        
        if (selectedTime) {
            summaryTimeValue.textContent = selectedTime;
            summaryTime.style.display = 'flex';
        } else {
            summaryTime.style.display = 'none';
        }
        
        if (masterSelect && masterSelect.value) {
            const masterNames = {
                'anna': 'Анна Ким',
                'maria': 'Мария Иванова',
                'elena': 'Елена Петрова',
                'sofia': 'София Ли'
            };
            summaryMasterValue.textContent = masterNames[masterSelect.value] || 'Любой мастер';
            summaryMaster.style.display = 'flex';
        } else {
            summaryMasterValue.textContent = 'Любой мастер';
            summaryMaster.style.display = 'flex';
        }
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (selectedServices.length === 0) {
                showNotification('Пожалуйста, выберите хотя бы одну услугу', 'error');
                return;
            }
            
            if (!selectedTime) {
                showNotification('Пожалуйста, выберите время', 'error');
                return;
            }
            
            const clientName = document.getElementById('clientName').value;
            const clientPhone = document.getElementById('clientPhone').value;
            
            if (!clientName || !clientPhone) {
                showNotification('Пожалуйста, заполните имя и телефон', 'error');
                return;
            }
            
            showNotification('Отлично! Ваша запись подтверждена. Мы отправим SMS с деталями.', 'success');
            
            bookingForm.reset();
            serviceOptions.forEach(o => o.classList.remove('selected'));
            timeSlots.forEach(s => s.classList.remove('selected'));
            selectedServices = [];
            selectedTime = null;
            totalPrice = 0;
            updateBookingSummary();
        });
    }

    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        

        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '20px 25px',
            borderRadius: '15px',
            background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
            color: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '400px',
            fontSize: '0.95rem'
        });
        
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    opacity: 0.8;
                    transition: opacity 0.3s;
                }
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                if (value[0] !== '7') {
                    value = '7' + value;
                }
            }
            
            let formatted = '';
            if (value.length > 0) formatted += '+7';
            if (value.length > 1) formatted += ' (' + value.slice(1, 4);
            if (value.length > 4) formatted += ') ' + value.slice(4, 7);
            if (value.length > 7) formatted += '-' + value.slice(7, 9);
            if (value.length > 9) formatted += '-' + value.slice(9, 11);
            
            e.target.value = formatted;
        });
    });
    

    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            const title = overlay ? overlay.querySelector('h4').textContent : '';
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${title}">
                    <p>${title}</p>
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            Object.assign(lightbox.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10000',
                cursor: 'pointer'
            });
            
            const content = lightbox.querySelector('.lightbox-content');
            Object.assign(content.style, {
                position: 'relative',
                maxWidth: '90%',
                maxHeight: '90%',
                textAlign: 'center'
            });
            
            const lightboxImg = content.querySelector('img');
            Object.assign(lightboxImg.style, {
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '10px'
            });
            
            const lightboxText = content.querySelector('p');
            Object.assign(lightboxText.style, {
                color: 'white',
                marginTop: '15px',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem'
            });
            
            const closeBtn = content.querySelector('.lightbox-close');
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '40px',
                cursor: 'pointer'
            });
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target === closeBtn) {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }
            });
            
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    lightbox.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
    

    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + (target > 100 ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }
    
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    entry.target.textContent = '0';
                    animateCounter(entry.target, number);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));

    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-img-wrapper');
    
    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    }
    

    console.log('✨ Bella Rose website initialized');
    
});