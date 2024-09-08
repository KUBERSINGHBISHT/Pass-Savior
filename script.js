// Function to generate a random password
function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

// Save passwords in localStorage
function savePassword(service, password) {
    let storedPasswords = JSON.parse(localStorage.getItem('passwords')) || [];
    storedPasswords.push({ service, password });
    localStorage.setItem('passwords', JSON.stringify(storedPasswords));
    document.getElementById("status").textContent = "Password saved successfully!";
    document.getElementById("status").style.color = "green";
    document.getElementById('generated-password').value = "";
    document.getElementById('manual-password').value = "";
    document.getElementById('service-name').value = "";
}

// Display passwords from localStorage
function displayStoredPasswords(name) {
    let storedPasswords = JSON.parse(localStorage.getItem('passwords')) || [];
    const passwordList = document.getElementById("password-list");
    document.getElementById("status1").textContent = "Save Password";
    passwordList.innerHTML = '';

    // Filter passwords by the provided service name
    const filteredPasswords = storedPasswords.filter(item => item.service === name);

    if (filteredPasswords.length === 0) {
        const noPasswordMessage = document.createElement('li');
        noPasswordMessage.textContent = 'No passwords found for this service';
        passwordList.appendChild(noPasswordMessage);
        return; // Exit the function as there are no passwords to display
    }

    // Loop through each filtered password
    filteredPasswords.forEach(item => {
        const li = document.createElement('li');
        li.className = 'password-item'; // Add a class for styling
        const textSpan = document.createElement('span');
        textSpan.textContent = `${item.service}: ${item.password}`;

        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container'; // Add a class for styling

        // Create Copy Button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-btn'; // Class for CSS styling
        copyBtn.addEventListener('click', () => {
            copyToClipboard(item.password);
        });

        // Create Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn'; // Class for CSS styling
        deleteBtn.addEventListener('click', () => {
            const itemIndex = storedPasswords.findIndex(storedItem => 
                storedItem.service === item.service && storedItem.password === item.password
            );
            if (itemIndex !== -1) {
                deletePassword(itemIndex);
                removeitSavepass();
                document.getElementById("status1").textContent = "";
                document.getElementById("status").textContent = "Data Deleted Successfully!";
                document.getElementById("status").style.color = "green";
            }
        });

        // Append buttons to the button container
        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(deleteBtn);

        // Append text and button container to the list item
        li.appendChild(textSpan);
        li.appendChild(buttonContainer);

        // Append the list item to the password list
        passwordList.appendChild(li);

        document.getElementById('generated-password').value = "";
        document.getElementById('manual-password').value = "";
        document.getElementById('service-name').value = "";
        document.getElementById("status").textContent = "";
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        //alert('Password copied to clipboard');
        document.getElementById("status").textContent = "Password Copy Successfully!";
        document.getElementById("status").style.color = "green";
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

function deletePassword(index) {
    let storedPasswords = JSON.parse(localStorage.getItem('passwords')) || [];

    storedPasswords.splice(index, 1);

    localStorage.setItem('passwords', JSON.stringify(storedPasswords));

    displayStoredPasswords(name);
}

// Handle the Generate Password button click
document.getElementById('generate-btn').addEventListener('click', function() {
    removeitSavepass();
    document.getElementById("status").textContent = "";
    document.getElementById("status1").textContent = "";
    document.getElementById('manual-password').value = "";
    document.getElementById('service-name').value = "";
    const length = document.getElementById('length').value;
    if (length < 8 || length > 12) {
        document.getElementById("status").textContent = "Password should be not less than 8 and greater than 12 character!";
        document.getElementById("status").style.color = "red";
    } else {
        const password = generatePassword(length);
        document.getElementById('generated-password').value = password;
    }
    
});

// Handle the Save Password button click
document.getElementById('save-btn').addEventListener('click', function() {
    removeitSavepass(); // Assuming this is a function that clears something before saving
    document.getElementById("status1").textContent = ""; // Clear any existing status message

    const serviceName = document.getElementById('service-name').value.toUpperCase();
    const autopassword = document.getElementById('generated-password').value;
    const manualpassword = document.getElementById('manual-password').value;

    // Check if both password fields are empty
    if (!autopassword && !manualpassword) {
        document.getElementById("status").textContent = "Please generate a password and enter the service name!";
        document.getElementById("status").style.color = "red";
        return;
    }

    // Check if the service name is empty
    if (!serviceName) {
        document.getElementById("status").textContent = "Please enter the service name!";
        document.getElementById("status").style.color = "red";
        return;
    }

    if (autopassword != "" && manualpassword != "") {
        document.getElementById("status").textContent = "Please Clear One Password!";
        document.getElementById("status").style.color = "red";
        return;
    }

    // Determine which password to save (either the auto-generated or the manually entered one)
    const password = autopassword || manualpassword;

    // Save the password
    savePassword(serviceName, password);

    // Clear the status message and update with success status
    document.getElementById("status").textContent = "Password saved successfully!";
    document.getElementById("status").style.color = "green";
});


// Show Save Password Button Click
document.getElementById('show-btn').addEventListener('click', function() {
    const serviceName = document.getElementById('service-name').value.toUpperCase();
    
    if (!serviceName) {
        removeitSavepass();
        document.getElementById("status1").textContent = "";
        document.getElementById("status").textContent = "Please Enter Service Name!";
        document.getElementById("status").style.color = "red";
    } else {
        displayStoredPasswords(serviceName);
    }
    
});

function clearInput1() {
    var inputElement = document.getElementById('generated-password');
    inputElement.value = '';
    document.getElementById("status").textContent = "";
  }

function clearInput2() {
    document.getElementById('manual-password').value = '';
    document.getElementById("status").textContent = "";
  }

// Display stored passwords on page load
//window.onload = displayStoredPasswords;
function removeitSavepass(){
    const passwordList = document.getElementById("password-list");
    passwordList.innerHTML = '';
    //passwordList.removeChild();
}