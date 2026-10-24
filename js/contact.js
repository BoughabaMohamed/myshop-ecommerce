const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        showToast("Message sent successfully!", "success");
        contactForm.reset();

    });

}