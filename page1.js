// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    
    // Check if there are saved credentials in localStorage
    function checkSavedCredentials() {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedPassword = localStorage.getItem('rememberedPassword');
        
        if (savedUsername && savedPassword) {
            usernameInput.value = savedUsername;
            passwordInput.value = savedPassword;
            rememberCheckbox.checked = true;
            
            // Add filled class to inputs with saved values
            if (savedUsername) {
                usernameInput.classList.add('filled');
            }
            if (savedPassword) {
                passwordInput.classList.add('filled');
            }
        }
    }
    
    // Save credentials if remember me is checked
    function saveCredentials() {
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedUsername', usernameInput.value);
            localStorage.setItem('rememberedPassword', passwordInput.value);
        } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
        }
    }
    
    // Form submission handling
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
        
        // Basic validation
        if (!usernameInput.value.trim()) {
            showError(usernameInput, 'Username is required');
            return;
        }
        
        if (!passwordInput.value.trim()) {
            showError(passwordInput, 'Password is required');
            return;
        }
        
        // Save credentials if remember me is checked
        saveCredentials();
        
        // Simulating login - replace with actual authentication logic
        simulateLogin(usernameInput.value, passwordInput.value);
    });
    
    // Show error message
    function showError(input, message) {
        const container = input.parentElement;
        let errorElement = container.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '12px';
            errorElement.style.marginTop = '5px';
            errorElement.style.textAlign = 'left';
            container.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = 'red';
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            errorElement.textContent = '';
            input.style.borderColor = '#ccc';
        }, 3000);
    }
    
    // Simulate login process
    function simulateLogin(username, password) {
        // Add loading state
        const button = loginForm.querySelector('button');
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Logging in...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            // For demo purposes, we'll just redirect to a hypothetical dashboard
            // In a real app, you would validate credentials with a server
            alert(`Login successful! Welcome, ${username}`);
            
            // In a real application, you would redirect to dashboard or home page
            // window.location.href = 'dashboard.html';
            
            // Reset button state (for demo purposes)
            button.disabled = false;
            button.textContent = originalText;
        }, 1500);
    }
    
    // Add visual feedback when inputs are filled
    function handleInputState() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
        
        inputs.forEach(input => {
            // Initial check for filled state
            if (input.value.trim() !== '') {
                input.classList.add('filled');
            }
            
            // Add event listeners for input changes
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.add('filled');
                } else {
                    this.classList.remove('filled');
                }
            });
        });
    }
    
    // Handle "Forgot Password" link
    const forgotPasswordLink = document.querySelector('a[href="#"]');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('alalahanin mo nalang password mo.');
            // In a real app, you might show a modal or navigate to a reset page
        });
    }
    
    // Handle "Register here" link
    const registerLink = document.querySelector('p a[href="#"]');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('wala pa kame registration hehe  .');
            // In a real app, you would redirect to registration page
            // window.location.href = 'register.html';
        });
    }
    
    // Add some visual effects to the form
    function addVisualEffects() {
        // Subtle shadow effect on focus
        const formInputs = document.querySelectorAll('input');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 5px rgba(0, 159, 227, 0.5)';
            });
            
            input.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
            });
        });
        
        // Add floating animation to the login container
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.transition = 'transform 0.3s ease-in-out';
            
            // Small floating animation
            let floatingUp = true;
            setInterval(() => {
                if (floatingUp) {
                    loginContainer.style.transform = 'translate(-50%, -52%)';
                } else {
                    loginContainer.style.transform = 'translate(-50%, -50%)';
                }
                floatingUp = !floatingUp;
            }, 2000);
        }
    }
    
    // Initialize all features
    checkSavedCredentials();
    handleInputState();
    addVisualEffects();
});