/**
 * StudentHub - Practical 5: Registration Form and Frontend Validation
 * Subject: Web Development Frameworks (ITUE203)
 * CHARUSAT University - Semester 3
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // DOM Element References
    // --------------------------------------------------------------------------
    const form = document.getElementById('studentRegistrationForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const mobileInput = document.getElementById('mobile');
    const courseSelect = document.getElementById('course');
    const academicYearSelect = document.getElementById('academicYear');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const genderInputs = Array.from(document.querySelectorAll('input[name="gender"]'));

    // Password strength UI
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const ruleLength = document.getElementById('ruleLength');
    const ruleUpper = document.getElementById('ruleUpper');
    const ruleLower = document.getElementById('ruleLower');
    const ruleNumber = document.getElementById('ruleNumber');
    const ruleSpecial = document.getElementById('ruleSpecial');

    // Visibility toggles
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');

    // Success card & summary
    const successCard = document.getElementById('successCard');
    const submittedSummary = document.getElementById('submittedSummary');
    const btnRegisterAnother = document.getElementById('btnRegisterAnother');

    // Terms modal
    const termsModal = document.getElementById('termsModal');
    const viewTermsLink = document.getElementById('viewTermsLink');
    const closeTermsBtn = document.getElementById('closeTermsBtn');
    const acceptTermsModalBtn = document.getElementById('acceptTermsModalBtn');

    // --------------------------------------------------------------------------
    // Regular Expression Definitions
    // --------------------------------------------------------------------------
    const REGEX = {
        fullName: /^[a-zA-Z\s]{3,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        mobile: /^[6-9]\d{9}$/,
        hasUpper: /[A-Z]/,
        hasLower: /[a-z]/,
        hasNumber: /[0-9]/,
        hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=]/
    };

    // --------------------------------------------------------------------------
    // Helper Functions for Error Handling & UI Feedback
    // --------------------------------------------------------------------------
    /**
     * Display an error message and set error styles on a form group
     */
    function showError(inputElement, errorElementId, message) {
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.setAttribute('aria-invalid', 'true');
            const group = inputElement.closest('.form-group');
            if (group) {
                group.classList.add('has-error');
                group.classList.remove('is-valid');
            }
        }
    }

    /**
     * Clear error message and apply valid state
     */
    function clearError(inputElement, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = '';
        }
        if (inputElement) {
            inputElement.setAttribute('aria-invalid', 'false');
            const group = inputElement.closest('.form-group');
            if (group) {
                group.classList.remove('has-error');
                group.classList.add('is-valid');
            }
        }
    }

    // --------------------------------------------------------------------------
    // Field Validation Functions
    // --------------------------------------------------------------------------
    function validateFullName() {
        const val = fullNameInput.value.trim();
        if (val === '') {
            showError(fullNameInput, 'fullNameError', 'Full name is required.');
            return false;
        }
        if (val.length < 3) {
            showError(fullNameInput, 'fullNameError', 'Full name must be at least 3 characters.');
            return false;
        }
        if (!REGEX.fullName.test(val)) {
            showError(fullNameInput, 'fullNameError', 'Full name must contain letters and spaces only.');
            return false;
        }
        clearError(fullNameInput, 'fullNameError');
        return true;
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        if (val === '') {
            showError(emailInput, 'emailError', 'Email address is required.');
            return false;
        }
        if (!REGEX.email.test(val)) {
            showError(emailInput, 'emailError', 'Please enter a valid email address (e.g. name@domain.com).');
            return false;
        }
        clearError(emailInput, 'emailError');
        return true;
    }

    function validateMobile() {
        const val = mobileInput.value.trim();
        if (val === '') {
            showError(mobileInput, 'mobileError', 'Mobile number is required.');
            return false;
        }
        if (!/^\d+$/.test(val)) {
            showError(mobileInput, 'mobileError', 'Mobile number must contain digits only.');
            return false;
        }
        if (!REGEX.mobile.test(val)) {
            showError(mobileInput, 'mobileError', 'Must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
            return false;
        }
        clearError(mobileInput, 'mobileError');
        return true;
    }

    function validateGender() {
        const selected = document.querySelector('input[name="gender"]:checked');
        const genderError = document.getElementById('genderError');
        const groupGender = document.getElementById('groupGender');
        if (!selected) {
            if (genderError) genderError.textContent = 'Please select your gender.';
            if (groupGender) groupGender.classList.add('has-error');
            return false;
        }
        if (genderError) genderError.textContent = '';
        if (groupGender) {
            groupGender.classList.remove('has-error');
            groupGender.classList.add('is-valid');
        }
        return true;
    }

    function validateCourse() {
        if (!courseSelect.value) {
            showError(courseSelect, 'courseError', 'Please select an engineering branch.');
            return false;
        }
        clearError(courseSelect, 'courseError');
        return true;
    }

    function validateAcademicYear() {
        if (!academicYearSelect.value) {
            showError(academicYearSelect, 'academicYearError', 'Please select your current academic year.');
            return false;
        }
        clearError(academicYearSelect, 'academicYearError');
        return true;
    }

    // --------------------------------------------------------------------------
    // Password Strength Meter & Real-time Rule Validation
    // --------------------------------------------------------------------------
    function evaluatePasswordStrength(val) {
        const rules = {
            length: val.length >= 8,
            upper: REGEX.hasUpper.test(val),
            lower: REGEX.hasLower.test(val),
            number: REGEX.hasNumber.test(val),
            special: REGEX.hasSpecial.test(val)
        };

        // Update rule checklist icons & styles
        updateRuleUI(ruleLength, rules.length, 'At least 8 characters');
        updateRuleUI(ruleUpper, rules.upper, 'At least one uppercase letter (A-Z)');
        updateRuleUI(ruleLower, rules.lower, 'At least one lowercase letter (a-z)');
        updateRuleUI(ruleNumber, rules.number, 'At least one number (0-9)');
        updateRuleUI(ruleSpecial, rules.special, 'At least one special symbol (!@#$%^&*)');

        let score = 0;
        if (rules.length) score++;
        if (rules.upper) score++;
        if (rules.lower) score++;
        if (rules.number) score++;
        if (rules.special) score++;

        // Update strength bar fill and text
        if (val.length === 0) {
            strengthBar.style.width = '0%';
            strengthBar.style.backgroundColor = 'transparent';
            strengthText.textContent = 'Password Strength: None';
            strengthText.style.color = 'var(--text-muted)';
        } else if (score <= 2) {
            strengthBar.style.width = '30%';
            strengthBar.style.backgroundColor = '#dc2626'; // Red
            strengthText.textContent = 'Password Strength: Weak';
            strengthText.style.color = '#dc2626';
        } else if (score === 3) {
            strengthBar.style.width = '60%';
            strengthBar.style.backgroundColor = '#ea580c'; // Orange
            strengthText.textContent = 'Password Strength: Fair';
            strengthText.style.color = '#ea580c';
        } else if (score === 4) {
            strengthBar.style.width = '80%';
            strengthBar.style.backgroundColor = '#0284c7'; // Blue
            strengthText.textContent = 'Password Strength: Good';
            strengthText.style.color = '#0284c7';
        } else {
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = '#16a34a'; // Green
            strengthText.textContent = 'Password Strength: Strong \u2714';
            strengthText.style.color = '#16a34a';
        }

        return rules;
    }

    function updateRuleUI(element, isValid, text) {
        if (!element) return;
        if (isValid) {
            element.classList.add('valid');
            element.innerHTML = `&#10004; ${text}`;
        } else {
            element.classList.remove('valid');
            element.innerHTML = `&#9675; ${text}`;
        }
    }

    function validatePassword() {
        const val = passwordInput.value;
        if (val === '') {
            showError(passwordInput, 'passwordError', 'Password is required.');
            return false;
        }

        const rules = evaluatePasswordStrength(val);
        const allRulesMet = rules.length && rules.upper && rules.lower && rules.number && rules.special;

        if (!allRulesMet) {
            showError(passwordInput, 'passwordError', 'Password must satisfy all 5 requirements listed above.');
            return false;
        }

        clearError(passwordInput, 'passwordError');
        return true;
    }

    function validateConfirmPassword() {
        const pwd = passwordInput.value;
        const confirmVal = confirmPasswordInput.value;

        if (confirmVal === '') {
            showError(confirmPasswordInput, 'confirmPasswordError', 'Please confirm your password.');
            return false;
        }
        if (pwd !== confirmVal) {
            showError(confirmPasswordInput, 'confirmPasswordError', 'Passwords do not match.');
            return false;
        }

        clearError(confirmPasswordInput, 'confirmPasswordError');
        return true;
    }

    function validateTerms() {
        const termsError = document.getElementById('termsError');
        if (!termsCheckbox.checked) {
            if (termsError) termsError.textContent = 'You must accept the terms and conditions to register.';
            return false;
        }
        if (termsError) termsError.textContent = '';
        return true;
    }

    // --------------------------------------------------------------------------
    // Real-time Event Listeners (on input, blur, and change)
    // --------------------------------------------------------------------------
    fullNameInput.addEventListener('input', () => {
        if (fullNameInput.closest('.form-group').classList.contains('has-error')) {
            validateFullName();
        }
    });
    fullNameInput.addEventListener('blur', validateFullName);

    emailInput.addEventListener('input', () => {
        if (emailInput.closest('.form-group').classList.contains('has-error')) {
            validateEmail();
        }
    });
    emailInput.addEventListener('blur', validateEmail);

    mobileInput.addEventListener('input', () => {
        // Strip any non-digit input immediately
        mobileInput.value = mobileInput.value.replace(/\D/g, '');
        if (mobileInput.closest('.form-group').classList.contains('has-error')) {
            validateMobile();
        }
    });
    mobileInput.addEventListener('blur', validateMobile);

    courseSelect.addEventListener('change', validateCourse);
    academicYearSelect.addEventListener('change', validateAcademicYear);

    genderInputs.forEach(radio => {
        radio.addEventListener('change', validateGender);
    });

    passwordInput.addEventListener('input', () => {
        evaluatePasswordStrength(passwordInput.value);
        if (passwordInput.closest('.form-group').classList.contains('has-error')) {
            validatePassword();
        }
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });
    passwordInput.addEventListener('blur', validatePassword);

    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.closest('.form-group').classList.contains('has-error')) {
            validateConfirmPassword();
        }
    });
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

    termsCheckbox.addEventListener('change', validateTerms);

    // --------------------------------------------------------------------------
    // Password Visibility Toggles
    // --------------------------------------------------------------------------
    function setupVisibilityToggle(button, input) {
        if (!button || !input) return;
        button.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.innerHTML = isPassword ? '&#128064;' : '&#128065;'; // switch eye icon
            button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    setupVisibilityToggle(togglePasswordBtn, passwordInput);
    setupVisibilityToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

    // --------------------------------------------------------------------------
    // Form Submission Handling
    // --------------------------------------------------------------------------
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent standard HTTP post for client-side demo

        // Run all validators
        const isNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isMobileValid = validateMobile();
        const isGenderValid = validateGender();
        const isCourseValid = validateCourse();
        const isYearValid = validateAcademicYear();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsValid = validateTerms();

        const isFormValid = isNameValid && isEmailValid && isMobileValid &&
                            isGenderValid && isCourseValid && isYearValid &&
                            isPasswordValid && isConfirmPasswordValid && isTermsValid;

        if (!isFormValid) {
            // Scroll to the first error
            const firstErrorGroup = form.querySelector('.form-group.has-error');
            if (firstErrorGroup) {
                firstErrorGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = firstErrorGroup.querySelector('input, select');
                if (input) input.focus();
            }
            return;
        }

        // Valid Submission - Render demonstration summary card
        const selectedGender = document.querySelector('input[name="gender"]:checked').value;
        const maskedEmail = maskEmail(emailInput.value.trim());

        submittedSummary.innerHTML = `
            <strong>Student Name:</strong> ${escapeHtml(fullNameInput.value.trim())}<br>
            <strong>Email:</strong> ${escapeHtml(maskedEmail)}<br>
            <strong>Mobile:</strong> +91 ${escapeHtml(mobileInput.value.trim())}<br>
            <strong>Gender:</strong> ${escapeHtml(selectedGender)}<br>
            <strong>Program:</strong> ${escapeHtml(courseSelect.value)}<br>
            <strong>Academic Year:</strong> ${escapeHtml(academicYearSelect.value)}<br>
            <strong>Password Security:</strong> Verified (Strong BCrypt-Ready Hash Complexity)
        `;

        successCard.hidden = false;
        successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Hide form to emphasize submission success
        form.style.display = 'none';
    });

    // Register another student button
    if (btnRegisterAnother) {
        btnRegisterAnother.addEventListener('click', () => {
            form.reset();
            form.style.display = 'flex';
            successCard.hidden = true;
            resetValidationState();
            fullNameInput.focus();
        });
    }

    // Reset button listener
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            setTimeout(resetValidationState, 50);
        });
    }

    function resetValidationState() {
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('has-error', 'is-valid');
        });
        form.querySelectorAll('.error-message').forEach(err => {
            err.textContent = '';
        });
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Password Strength: None';
        [ruleLength, ruleUpper, ruleLower, ruleNumber, ruleSpecial].forEach(r => {
            if (r) r.classList.remove('valid');
        });
    }

    // --------------------------------------------------------------------------
    // Terms Modal Logic
    // --------------------------------------------------------------------------
    if (viewTermsLink && termsModal) {
        viewTermsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.hidden = false;
        });
    }

    if (closeTermsBtn && termsModal) {
        closeTermsBtn.addEventListener('click', () => {
            termsModal.hidden = true;
        });
    }

    if (acceptTermsModalBtn && termsModal) {
        acceptTermsModalBtn.addEventListener('click', () => {
            termsCheckbox.checked = true;
            validateTerms();
            termsModal.hidden = true;
        });
    }

    // --------------------------------------------------------------------------
    // Sanitization & Masking Utilities
    // --------------------------------------------------------------------------
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function maskEmail(email) {
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        const name = parts[0];
        const visible = name.slice(0, 2);
        return `${visible}***@${parts[1]}`;
    }
});
