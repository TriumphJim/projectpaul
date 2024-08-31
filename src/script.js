// script.js

// Import Firebase Modules
import { initializeApp } from 'firebase/app'; // Import initializeApp from 'firebase/app'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
//import firebaseui from 'firebaseui'; 
import * as firebaseui from 'firebaseui';

// ... (Your Firebase configuration) ...

// Declare firebaseConfig
const firebaseConfig = {
  // ... (Your Firebase configuration) ...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  // Initialize Firebase
const auth = getAuth(app); 
const storage = getStorage(app);


// Function to force sign-in
function forceSignIn() {
  const ui = new firebaseui.auth.AuthUI(auth);
  const uiConfig = {
    // ... (your existing uiConfig) ...
  };
  ui.start('#firebaseui-auth-container', uiConfig);
}

// Check if user is already signed in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, sign them out and force sign-in
    console.log("User is signed in:", user); 
    signOut(auth)
      .then(() => {
        console.log('User signed out.');
        forceSignIn(); 
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  } else {
    // Prompt to check if the user is signed in (for debugging)
    const signedIn = prompt("Are you signed in? (true/false)");
    if (signedIn.toLowerCase() === 'true') {
      console.log("Simulating signed-in state.");
      forceSignIn();
    } else {
      console.log("Simulating signed-out state.");
      forceSignIn();
    }
  }
});

// Upload Image Function
export function uploadImage() {
  const fileInput = document.getElementById('imageUpload');
  const file = fileInput.files[0];
  const storageRef = ref(storage, `images/${file.name}`); 

  if (file) {
    // Display the selected image before uploading
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result; 
      img.alt = file.name;
      img.style.maxWidth = '200px'; // Optional: Set a max width for the image
      document.getElementById('image-list').appendChild(img);
    };
    reader.readAsDataURL(file);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        // ... (Your existing code for getting the download URL and displaying the image) ...
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  } else {
    console.error('No file selected');
  }
}