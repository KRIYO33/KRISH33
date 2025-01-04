        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('formModal');
            const loading = document.getElementById('loading');
            const startBtn = document.querySelector('.start-btn');
            const closeBtn = document.querySelector('.close-btn');
            const quotes = [
            "The way you treat your car reflects the way you treat yourself.",
            "Your car is an extension of your personality.",
            "A car isn’t just transportation; it’s a statement.",
            "Show me your car, and I’ll tell you who you are.",
            "Cars don’t just take us places; they tell our story.",
            "You don’t just drive a car; you drive your identity.",
            "Every car has a story; every driver, a purpose.",
            "The car you choose says more about you than words ever could.",
            "Driving style reveals character.",
            "Your car is a reflection of your taste, passion, and vision.",
        ];
            startBtn.addEventListener('click', () => {
                loading.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    loading.style.display = 'none';
                    modal.classList.add('active');
                }, 3333 );
            });
        
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            startBtn.addEventListener('click', () => {
                // Display one random quote immediately
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                loading.textContent = randomQuote;
                loading.style.display = 'flex';
                document.body.style.overflow = 'hidden';
        
                // After 3 seconds, hide loading and show modal
                setTimeout(() => {
                    loading.style.display = 'none';
                    modal.classList.add('active');
                    document.body.style.overflow = 'auto';
                }, 3333);
            });
        });
        document.getElementById('valuationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading screen
            const loading = document.getElementById('loading');
            loading.style.display = 'flex';
            
            // Get form data
            const form = e.target;
            const formData = {
                company: form.company.value,
                km_driven: form.km_driven.value,
                fuel_type: form.fuel_type.value,
                transmission: form.transmission.value,
                owner_type: form.owner_type.value,
                mileage: form.mileage.value,
                engine: form.engine.value,
                power: form.power.value,
                year: form.year.value
            };
            
            try {
                // Send data to server
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show result in modal
                    const modalContent = document.querySelector('.modal-content');
                    modalContent.innerHTML = `
                        <div class="modal-header">
                            <h4>ESTIMATED VALUE</h4>
                            <button class="close-btn" onclick="closeModal()">✕</button>
                        </div>
                        <div style="text-align: center; padding: 2rem;">
                            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">
                                ₹${result.predicted_price} Lakhs
                            </h2>
                            <p style="opacity: 0.7;">
                                This is an estimated market value based on our analysis
                            </p>
                        </div>
                    `;
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Server error: ' + error.message);
            } finally {
                loading.style.display = 'none';
            }
        });
        
        function closeModal() {
            document.getElementById('formModal').classList.remove('active');
        }
