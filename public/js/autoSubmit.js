document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form[action^="/commerce-customer-list"]');

    if (form) {
        const urlParams = new URLSearchParams(window.location.search);

        if (!urlParams.has('name')) {
            form.submit();
        }
    }
});