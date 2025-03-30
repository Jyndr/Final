// Insurance Module
function initializeInsurance() {
    // Sample data
    const policies = [
        {
            id: 1,
            name: 'Home Insurance',
            type: 'Property',
            coverage: '$300,000',
            premium: '$100/month',
            nextPayment: '2024-04-15'
        },
        {
            id: 2,
            name: 'Auto Insurance',
            type: 'Vehicle',
            coverage: '$50,000',
            premium: '$80/month',
            nextPayment: '2024-04-20'
        },
        {
            id: 3,
            name: 'Health Insurance',
            type: 'Medical',
            coverage: '$150,000',
            premium: '$200/month',
            nextPayment: '2024-05-01'
        }
    ];

    const claims = [
        {
            id: 1,
            type: 'Home Damage',
            date: '2024-03-15',
            status: 'approved',
            amount: '$5,000'
        },
        {
            id: 2,
            type: 'Car Accident',
            date: '2024-03-20',
            status: 'pending',
            amount: '$2,500'
        },
        {
            id: 3,
            type: 'Medical Treatment',
            date: '2024-03-25',
            status: 'rejected',
            amount: '$1,000'
        }
    ];

    // Initialize UI
    renderPolicies(policies);
    renderClaims(claims);
    setupEventListeners();
}

function renderPolicies(policies) {
    const policyList = document.querySelector('.policy-list');
    if (!policyList) return;

    policyList.innerHTML = policies.map(policy => `
        <div class="policy-item" data-id="${policy.id}">
            <div class="policy-info">
                <div class="policy-name">${policy.name}</div>
                <div class="policy-details">
                    Type: ${policy.type} | Coverage: ${policy.coverage} | Premium: ${policy.premium}
                </div>
            </div>
            <div class="policy-actions">
                <button class="edit-policy" title="Edit Policy">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-policy" title="Delete Policy">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderClaims(claims) {
    const claimsList = document.querySelector('.claims-list');
    if (!claimsList) return;

    claimsList.innerHTML = claims.map(claim => `
        <div class="claim-item" data-id="${claim.id}">
            <div class="claim-info">
                <div class="claim-type">${claim.type}</div>
                <div class="claim-date">${formatDate(claim.date)}</div>
            </div>
            <div class="claim-status status-${claim.status}">
                ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Add Policy Button
    const addPolicyBtn = document.querySelector('.add-policy-btn');
    if (addPolicyBtn) {
        addPolicyBtn.addEventListener('click', showAddPolicyModal);
    }

    // Policy Actions
    document.querySelectorAll('.edit-policy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const policyId = e.target.closest('.policy-item').dataset.id;
            showEditPolicyModal(policyId);
        });
    });

    document.querySelectorAll('.delete-policy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const policyId = e.target.closest('.policy-item').dataset.id;
            deletePolicy(policyId);
        });
    });

    // Modal Close Buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
}

function showAddPolicyModal() {
    const modal = createModal(`
        <div class="modal-header">
            <h3>Add New Policy</h3>
            <button class="close-modal">&times;</button>
        </div>
        <form id="addPolicyForm">
            <div class="form-group">
                <label for="policyName">Policy Name</label>
                <input type="text" id="policyName" required>
            </div>
            <div class="form-group">
                <label for="policyType">Policy Type</label>
                <select id="policyType" required>
                    <option value="Property">Property</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Medical">Medical</option>
                    <option value="Life">Life</option>
                </select>
            </div>
            <div class="form-group">
                <label for="coverage">Coverage Amount</label>
                <input type="text" id="coverage" required>
            </div>
            <div class="form-group">
                <label for="premium">Monthly Premium</label>
                <input type="text" id="premium" required>
            </div>
            <div class="form-group">
                <label for="nextPayment">Next Payment Date</label>
                <input type="date" id="nextPayment" required>
            </div>
            <button type="submit" class="submit-btn">Add Policy</button>
        </form>
    `);

    document.body.appendChild(modal);
    modal.classList.add('active');

    // Handle form submission
    const form = modal.querySelector('#addPolicyForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newPolicy = {
            id: Date.now(),
            name: formData.get('policyName'),
            type: formData.get('policyType'),
            coverage: formData.get('coverage'),
            premium: formData.get('premium'),
            nextPayment: formData.get('nextPayment')
        };
        addPolicy(newPolicy);
        closeModal();
    });
}

function showEditPolicyModal(policyId) {
    // Implementation for editing policy
    console.log('Edit policy:', policyId);
}

function deletePolicy(policyId) {
    if (confirm('Are you sure you want to delete this policy?')) {
        // Implementation for deleting policy
        console.log('Delete policy:', policyId);
    }
}

function addPolicy(policy) {
    // Implementation for adding new policy
    console.log('Add policy:', policy);
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = content;
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Export the initialization function
export { initializeInsurance };

export function renderInsurancePage() {
    const content = `
        <div class="insurance-container">
            <h1>Disaster Insurance Guidance</h1>
            <p class="subtitle">Your comprehensive guide to disaster-related insurance coverage</p>

            <section class="insurance-types">
                <h2>Types of Disaster Insurance</h2>
                <div class="insurance-cards">
                    <div class="insurance-card">
                        <i class="fas fa-home"></i>
                        <h3>Home Insurance</h3>
                        <p>Protection for your property and belongings against natural disasters</p>
                    </div>
                    <div class="insurance-card">
                        <i class="fas fa-car"></i>
                        <h3>Auto Insurance</h3>
                        <p>Coverage for vehicle damage during natural disasters</p>
                    </div>
                    <div class="insurance-card">
                        <i class="fas fa-heartbeat"></i>
                        <h3>Health Insurance</h3>
                        <p>Medical coverage for disaster-related injuries and emergencies</p>
                    </div>
                </div>
            </section>

            <section class="claim-steps">
                <h2>How to File a Claim</h2>
                <div class="steps-container">
                    <div class="step-card">
                        <div class="step-number">1</div>
                        <h3>Document the Damage</h3>
                        <p>Take photos and videos of all damage</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">2</div>
                        <h3>Contact Your Insurer</h3>
                        <p>Report the damage as soon as possible</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">3</div>
                        <h3>File the Claim</h3>
                        <p>Submit all required documentation</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">4</div>
                        <h3>Follow Up</h3>
                        <p>Stay in contact with your adjuster</p>
                    </div>
                </div>
            </section>

            <section class="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div class="faq-container">
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>What is covered under home insurance for natural disasters?</h3>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer">
                            <p>Coverage typically includes damage from storms, fires, and other natural disasters. However, flood and earthquake damage usually requires separate policies.</p>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>How do I file an auto insurance claim after a disaster?</h3>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer">
                            <p>Document the damage, contact your insurance provider immediately, and follow their specific claim filing procedures.</p>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">
                            <h3>Are there any specific health insurance policies for disaster recovery?</h3>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer">
                            <p>Many health insurance plans include disaster-related coverage. Check with your provider for specific disaster-related benefits.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="special-coverage">
                <h2>Special Disaster Coverage</h2>
                <div class="coverage-cards">
                    <div class="coverage-card">
                        <h3>Flood Insurance</h3>
                        <p>Separate policy required for flood damage coverage</p>
                    </div>
                    <div class="coverage-card">
                        <h3>Earthquake Insurance</h3>
                        <p>Additional coverage for earthquake-related damage</p>
                    </div>
                    <div class="coverage-card">
                        <h3>Business Interruption</h3>
                        <p>Coverage for lost income during disaster recovery</p>
                    </div>
                </div>
            </section>
        </div>
    `;

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = content;

    // Add event listeners for FAQ toggles
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.nextElementSibling;
            const icon = item.querySelector('i');
            answer.classList.toggle('active');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        });
    });
} 