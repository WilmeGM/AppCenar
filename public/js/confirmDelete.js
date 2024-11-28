function confirmDelete(e) {
    e.preventDefault();

    Swal.fire({
        title: "Are you sure?",
        text: "This is permanent",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
    }).then((result) => {
        if (result.isConfirmed) {
            e.target.closest("form").submit();
        }
    });
}
