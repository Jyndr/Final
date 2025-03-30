// Toggle between login and register forms
function toggleAuth(type) {
    const loginBtn = document.querySelector('.auth-buttons button:first-child');
    const registerBtn = document.querySelector('.auth-buttons button:last-child');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (type === 'login') {
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Handle form submission
function handleAuth(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simple validation
    if (!data.email || !data.password) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Additional validation for register form
    if (form.id === 'registerForm') {
        if (!data.name) {
            alert('Please enter your full name');
            return;
        }
        if (data.password !== formData.get('confirmPassword')) {
            alert('Passwords do not match');
            return;
        }
    }
    
    // Mock authentication - in real app, this would call an API
    console.log('Authenticating...', data);
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
} 