document.addEventListener("DOMContentLoaded", function () {
    const socialsLink = document.getElementById("socialsLink");
    const dropdownContent = document.getElementById("dropdownContent");

    socialsLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor click behavior
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block"; // Toggle visibility
    });

    // Optional: Close the dropdown if clicking outside of it
    window.addEventListener("click", function (event) {
        if (!event.target.matches('#socialsLink') && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = "none"; // Hide the dropdown
        }
    });
});