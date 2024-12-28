const modal = document.getElementById("dataModal");
const btn = document.getElementById("add-data");
const span = document.querySelector(".close");

btn.onclick = function () {
    modal.style.display = "block";
};

span.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


const form = document.getElementById('addDataForm');


form.addEventListener('submit', async function (event) {

    event.preventDefault(); // Prevent default form submission

    // Create FormData object
    const formData = new FormData(form);

    // Convert form data to an object
    const data = Object.fromEntries(formData.entries());


    try {
        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response)

        if (response.ok) {
            document.getElementById("responseMessage").textContent = "Form submitted successfully!";
            form.reset();
        } else if (response.status === 400) {
            document.getElementById("responseMessage").textContent = "Bad Request. Please check your input.";
        } else if (response.status === 500) {
            document.getElementById("responseMessage").textContent = "Server error. Please try again later.";
        } else {
            document.getElementById("responseMessage").textContent = "Failed to submit form.";
        }
    } catch (error) {
        console.error("Error :", error);
        document.getElementById("responseMessage").textContent = "An error occurred.";
    }

    // Access specific fields

});


// async function submitForm(e) {
//     e.preventDefault()
//     const form = document.getElementById("addDataForm");
//     const formData = new FormData(form);
//     console.log(form)

//     const data = {
//         id: formData.get("id"),
//         date_time: formData.get("date_time") + ":00",
//         vehicle_id: formData.get("vehicle_id"),
//         vehicle_class_id: formData.get("vehicle_class_id"),
//         vehicle_name: formData.get("vehicle_name"),
//         ai_class : formData.get("ai_class") || null,
//         audited_class : formData.get("audited_class") || null,
//         direction: formData.get("direction"),
//         cross_line : formData.get("cross_line") || null,
//         x1_coords : formData.get("x1_coords") || null,
//         y1_coords : formData.get("y1_coords") || null,
//         x2_coords : formData.get("x2_coords") || null,
//         y2_coords : formData.get("y2_coords") || null,
//         frame_number: formData.get("frame_number"),
//         image_path: formData.get("image_path"),
//         play_stream_id : formData.get("play_stream_id") || null,
//         is_audit : formData.get("is_audit") || null,
//         kit_id : formData.get("kit_id") || null,
//         last_modified : formData.get("last_modified") || null
//     };

//     console.log(data)

//     try {
//         const response = await fetch("/submit",{
//             method: "POST",
//             headers : {
//                 "Content-type": "application/json"
//             },
//             body: JSON.stringify(data)
//         });

//         console.log(response)

//         if (response.ok) {
//             document.getElementById("responseMessage").textContent = "Form submitted successfully!";
//             form.reset();
//         } else if (response.status === 400) {
//             document.getElementById("responseMessage").textContent = "Bad Request. Please check your input.";
//         } else if (response.status === 500) {
//             document.getElementById("responseMessage").textContent = "Server error. Please try again later.";
//         } else {
//             document.getElementById("responseMessage").textContent = "Failed to submit form.";
//         }
//     } catch (error) {
//         console.error("Error :" , error);
//         document.getElementById("responseMessage").textContent = "An error occurred." ;
//     }
// }