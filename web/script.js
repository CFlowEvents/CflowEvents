// Menu functionality
function toggleMenu() {
    var menu = document.getElementById("menu-list");
    menu.classList.toggle("show");
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    var menu = document.getElementById("menu-list");
    var menuIcon = document.querySelector('.menu-icon');
    
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.classList.remove('show');
    }
});

// Contact options toggle
function toggleContactOptions() {
    var options = document.getElementById("contact-options");
    
    if (options.style.display === "block") {
        options.style.display = "none";
    } else {
        options.style.display = "block";
    }
}

// Close contact options when clicking outside
document.addEventListener("click", function(event) {
    var contactOptions = document.getElementById("contact-options");
    var contactButton = document.querySelector(".contact-container a");

    if (!contactButton.contains(event.target) && !contactOptions.contains(event.target)) {
        contactOptions.style.display = "none";
    }
});

// Video mute toggle
function toggleMute() {
    const video = document.getElementById('about-video');
    const muteButton = document.getElementById('mute-button');
    
    if (video.muted) {
        video.muted = false;
        muteButton.textContent = 'Mute';
    } else {
        video.muted = true;
        muteButton.textContent = 'Unmute';
    }
}

// Page transition effect
function fadeOut(event) {
    event.preventDefault();
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = event.target.href;
    }, 500);
}

// Form functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize phone input
   // In your script.js file, update the phone input initialization:
if (document.querySelector("#phone")) {
    var phoneInput = document.querySelector("#phone");
    var iti = window.intlTelInput(phoneInput, {
        initialCountry: "LB",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
        customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
            return "e.g. " + selectedCountryPlaceholder;
        },
        // Add these responsive settings:
        preferredCountries: ['lb', 'us', 'gb', 'fr', 'ae'],
        autoPlaceholder: "aggressive",
        formatOnDisplay: true,
        hiddenInput: "full_phone",
        nationalMode: false
    });
    
    // This ensures proper sizing
    phoneInput.style.width = "100%";
    phoneInput.style.height = "auto";
}

    // Budget toggle
    function toggleBudgetInputs() {
        const budgetRange = document.querySelector('.budget-range');
        const budgetNoSpecific = document.getElementById('budgetNoSpecific');
        if (budgetRange && budgetNoSpecific) {
            budgetRange.style.display = budgetNoSpecific.checked ? 'none' : 'flex';
        }
    }

    if (document.getElementById('budgetNoSpecific')) {
        document.getElementById('budgetNoSpecific').addEventListener('change', toggleBudgetInputs);
        toggleBudgetInputs();
    }

    // Area input toggle
    function toggleArea() {
        const checkbox = document.getElementById('needLocation');
        const areaInput = document.getElementById('areaInput');
        if (checkbox && areaInput) {
            areaInput.style.display = checkbox.checked ? 'block' : 'none';
        }
    }

    if (document.getElementById('needLocation')) {
        document.getElementById('needLocation').addEventListener('change', toggleArea);
    }

    // Popup functions
    function showPopup() {
        document.getElementById('popupOverlay').style.display = 'flex';
    }

    function closePopup() {
        document.getElementById('popupOverlay').style.display = 'none';
    }

    if (document.querySelector('.popup button')) {
        document.querySelector('.popup button').addEventListener('click', closePopup);
    }

    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('popupOverlay')) {
            closePopup();
        }
    });

    // Form submission
    if (document.getElementById("meetingForm")) {
        emailjs.init('byCf4TPG5UL7yT0JT');
        
        document.getElementById("meetingForm").addEventListener("submit", function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitButton = document.getElementById('submitButton');
            const originalButtonText = submitButton.textContent;
            const phoneNumber = iti.getNumber();
            
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
            
            const formData = new FormData(form);
            const budgetNoSpecific = document.getElementById('budgetNoSpecific').checked;
            
            const data = {
                to_email: "cflow.event@gmail.com",
                name: formData.get("name"),
                phone: phoneNumber,
                eventType: formData.get("eventType"),
                eventDate: formData.get("eventDate"),
                guests: formData.get("guests"),
                budgetNoSpecific: budgetNoSpecific ? "Yes" : "No",
                budgetMin: budgetNoSpecific ? 'N/A' : formData.get("budgetMin"),
                budgetMax: budgetNoSpecific ? 'N/A' : formData.get("budgetMax"),
                needLocation: formData.get("needLocation") ? "Yes" : "No",
                area: formData.get("area") || "N/A"
            };

            // Validate required fields
            if (!data.name || !data.phone || !data.eventType || !data.eventDate || !data.guests) {
                alert("Please fill out all required fields marked with *");
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            if (!budgetNoSpecific && (!data.budgetMin || !data.budgetMax)) {
                alert("Please enter both minimum and maximum budget values");
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            emailjs.send("service_l10gqs8", "template_f0z1wbt", data)
                .then(function(response) {
                    console.log("Email sent successfully:", response);
                    form.reset();
                    document.getElementById('areaInput').style.display = 'none';
                    document.getElementById('needLocation').checked = false;
                    document.getElementById('budgetNoSpecific').checked = false;
                    toggleBudgetInputs();
                    iti.setNumber("");
                    showPopup();
                }, function(error) {
                    console.log("Error sending email:", error);
                    alert("There was an error sending your request. Please try again later.");
                })
                .finally(function() {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
        });
    }
});