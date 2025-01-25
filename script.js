let retirementAge = localStorage.getItem('retirementAge') || 67;
let countdownInterval;

const backgrounds = [
    'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    'https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1499363536502-87642509e31b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
];

function updateRetirementAge(age) {
    retirementAge = parseInt(age);
    localStorage.setItem('retirementAge', retirementAge);
    const birthday = localStorage.getItem('birthday');
    if (birthday) startCountdown(birthday);
}

function setBirthday() {
    const birthday = document.getElementById('birthday').value;
    if (birthday) {
        localStorage.setItem('birthday', birthday);
        document.getElementById('birthdayForm').classList.add('hidden');
        startCountdown(birthday);
    }
}

function showDatePicker() {
    document.getElementById('birthdayForm').classList.remove('hidden');
    toggleSettings();
}

function startCountdown(birthday) {
    if (countdownInterval) clearInterval(countdownInterval);
    
    document.getElementById('countdown').style.display = 'flex';
    
    const birthDate = new Date(birthday);
    const retirementDate = new Date(birthDate);
    retirementDate.setFullYear(birthDate.getFullYear() + parseInt(retirementAge));
    
    document.getElementById('retirementDate').textContent = 
        `Retirement date: ${retirementDate.toLocaleDateString()}`;

    function updateCountdown() {
        const now = new Date();
        const difference = retirementDate - now;

        if (difference > 0) {
            const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
            const months = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
            const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('years').textContent = years;
            document.getElementById('months').textContent = months;
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        } else {
            document.getElementById('countdown').innerHTML = '<h2>You are already retired! 🎉</h2>';
        }
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function toggleSettings() {
    document.getElementById('settingsPanel').classList.toggle('active');
}

function setBackground(index) {
    const bg = backgrounds[index];
    document.body.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.45), rgba(22, 33, 62, 0.45)), url('${bg}')`;
    localStorage.setItem('background', index);
    updateBackgroundSelections(index);
}

function updateBackgroundSelections(activeIndex) {
    document.querySelectorAll('.background-option').forEach((option, index) => {
        option.classList.toggle('active', index === activeIndex);
    });
}

function sharePage() {
    const birthday = localStorage.getItem('birthday');
    const retirementAge = localStorage.getItem('retirementAge');
    const background = localStorage.getItem('background');
    
    if (birthday) {
        const shareUrl = `${window.location.origin}${window.location.pathname}?birth=${birthday}&age=${retirementAge}&bg=${background}`;
        if (navigator.share) {
            navigator.share({
                title: 'My Retirement Countdown',
                text: 'Check out my retirement countdown!',
                url: shareUrl
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Link copied to clipboard!');
            }).catch(console.error);
        }
    }
}

window.onload = function() {
    document.getElementById('retirementAge').value = retirementAge;
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlDate = urlParams.get('birth');
    const urlAge = urlParams.get('age');
    const urlBg = urlParams.get('bg');
    
    if (urlAge) {
        retirementAge = parseInt(urlAge);
        document.getElementById('retirementAge').value = retirementAge;
        localStorage.setItem('retirementAge', retirementAge);
    }
    
    if (urlBg) {
        setBackground(parseInt(urlBg));
    } else {
        const savedBg = localStorage.getItem('background');
        if (savedBg !== null) {
            setBackground(parseInt(savedBg));
        }
    }
    
    if (urlDate) {
        document.getElementById('birthday').value = urlDate;
        localStorage.setItem('birthday', urlDate);
        startCountdown(urlDate);
    } else {
        const storedBirthday = localStorage.getItem('birthday');
        if (storedBirthday) {
            document.getElementById('birthday').value = storedBirthday;
            startCountdown(storedBirthday);
        } else {
            document.getElementById('birthdayForm').classList.remove('hidden');
        }
    }
};
