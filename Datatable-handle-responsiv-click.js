
$(document).ready(function() {

    $(document).on('click', '.updateClient', function() {
        // Get the closest row in a way that works with DataTables responsive
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        // If the row is a child row (responsive), get the previous row which is the actual row
        if (tr.hasClass('child')) {
            tr = tr.prev();
            row = table.row(tr);
        }

        const rowdata = row.data();
        if (!rowdata) {
            console.error('No data available for the selected row.');
            return;
        }

        const exampleModal = document.getElementById('clientModal');
        const cid = exampleModal.querySelector('.modal-body #cid');
        const name = exampleModal.querySelector('.modal-body #name');
        const email = exampleModal.querySelector('.modal-body #email');
        const mobile = exampleModal.querySelector('.modal-body #mobile');
        const gender = exampleModal.querySelector('.modal-body #gender');
        const dob = exampleModal.querySelector('.modal-body #dob');
        const address = exampleModal.querySelector('.modal-body #address');

        // Check and parse the date correctly
        const dateString = rowdata[6]; // Ensure this is the correct index for the date
        const dateParts = dateString.split('-'); // Modify the split based on your actual date format
        // Ensure correct reformatting to YYYY-MM-DD for HTML date inputs
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        // Assign values to modal inputs
        cid.value = rowdata[1];  // Ensure indices are matched with your data structure
        name.value = rowdata[2];
        email.value = rowdata[3];
        mobile.value = rowdata[4];
        gender.value = rowdata[5];
        dob.value = formattedDate;  // Make sure the date is formatted to YYYY-MM-DD
        address.value = rowdata[7];
    });
});

