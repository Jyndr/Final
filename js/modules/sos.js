export function initializeSOS() {
    const form = document.getElementById('emergency-contact-form');
    const contactsList = document.getElementById('contacts-list');
    const sosButton = document.getElementById('sos-button');
    let contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];

    // Load existing contacts
    function loadContacts() {
        contactsList.innerHTML = contacts.map((contact, index) => `
            <div class="contact-card">
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                    <p><i class="fas fa-envelope"></i> ${contact.email}</p>
                </div>
                <button class="delete-contact" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('') || '<p class="no-contacts">No emergency contacts added yet</p>';

        // Add delete event listeners
        document.querySelectorAll('.delete-contact').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                contacts.splice(index, 1);
                localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
                loadContacts();
            });
        });
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const contact = {
            name: document.getElementById('contact-name').value,
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('contact-email').value
        };

        contacts.push(contact);
        localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
        
        // Reset form and reload contacts
        form.reset();
        loadContacts();
        
        // Show success message
        showNotification('Contact added successfully!', 'success');
    });

    // Handle SOS button click
    sosButton.addEventListener('click', async () => {
        if (contacts.length === 0) {
            showNotification('Please add emergency contacts first!', 'error');
            return;
        }

        try {
            // Show loading state
            sosButton.disabled = true;
            sosButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending SOS...';
            showNotification('Sending SOS alerts...', 'info');

            // Get user's location
            const position = await getCurrentPosition().catch(error => {
                throw new Error(`Location access failed: ${error.message}`);
            });
            
            const { latitude, longitude } = position.coords;
            showNotification('Location acquired, sending alerts...', 'info');

            // Send emails to all contacts
            const emailPromises = contacts.map(contact => 
                sendSOSEmail(contact, latitude, longitude)
                    .catch(error => {
                        console.error(`Failed to send email to ${contact.name}:`, error);
                        return { error, contact };
                    })
            );

            const results = await Promise.all(emailPromises);
            
            // Check results and show appropriate message
            const failures = results.filter(result => result && result.error);
            
            if (failures.length === 0) {
                showNotification('SOS alerts sent successfully to all contacts!', 'success');
            } else if (failures.length === contacts.length) {
                throw new Error('Failed to send SOS alerts to any contacts');
            } else {
                const successCount = contacts.length - failures.length;
                showNotification(`SOS alerts sent to ${successCount} out of ${contacts.length} contacts`, 'warning');
                
                // Show detailed error for failed contacts
                failures.forEach(({ error, contact }) => {
                    showNotification(`Failed to send to ${contact.name}: ${error.message}`, 'error');
                });
            }
        } catch (error) {
            console.error('Error in SOS process:', error);
            showNotification(error.message || 'Failed to send SOS. Please try again.', 'error');
        } finally {
            // Reset button state
            sosButton.disabled = false;
            sosButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>SOS</span>';
        }
    });

    // Helper function to get current position
    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }

    // Helper function to send SOS email
    async function sendSOSEmail(contact, latitude, longitude) {
        // Verify EmailJS initialization
        if (!window.emailjs) {
            throw new Error('EmailJS is not properly initialized');
        }

        const templateParams = {
            service_id: 'service_i70uycw',
            template_id: 'template_kfqtan2',
            user_id: 'jZf4ctVqYnFjd-Kfm',
            template_params: {
                to_name: contact.name,       
                to_email: contact.email,
                location_link: `https://www.google.com/maps?q=${latitude},${longitude}`,
                current_time: new Date().toLocaleString(),
                emergency_message: `Emergency SOS Alert! Location coordinates: ${latitude}, ${longitude}`
            }
        };

        try {
            // Validate required parameters
            if (!templateParams.service_id || !templateParams.template_id || !templateParams.user_id) {
                throw new Error('Missing required EmailJS configuration');
            }

            if (!contact.email || !contact.name) {
                throw new Error('Invalid contact information');
            }

            console.log('Sending email with params:', {
                ...templateParams,
                template_params: {
                    ...templateParams.template_params,
                    to_email: '***@***.com' // Mask email for privacy in logs
                }
            });

            const response = await emailjs.send(
                templateParams.service_id,
                templateParams.template_id,
                templateParams.template_params,
                templateParams.user_id
            );

            if (response.status !== 200) {
                throw new Error(`Email service responded with status: ${response.status}`);
            }

            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Detailed email error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to send SOS email: ';
            if (error.message.includes('initialization')) {
                errorMessage += 'Email service not properly initialized';
            } else if (error.message.includes('configuration')) {
                errorMessage += 'Invalid email service configuration';
            } else if (error.message.includes('contact information')) {
                errorMessage += 'Invalid contact details';
            } else if (error.status === 401 || error.status === 403) {
                errorMessage += 'Authentication failed with email service';
            } else if (error.status === 429) {
                errorMessage += 'Too many requests, please try again later';
            } else {
                errorMessage += error.message || 'Unknown error occurred';
            }
            
            throw new Error(errorMessage);
        }
    }

    // Helper function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Load contacts on initialization
    loadContacts();
} 