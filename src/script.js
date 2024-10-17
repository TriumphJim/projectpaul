// script.js

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_MEgF_MWeUBqZ_4hUVh5ODr5pKy0GzNM",
  authDomain: "projectpaul-bbc85.firebaseapp.com",
  databaseURL: "https://projectpaul-bbc85-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projectpaul-bbc85",
  storageBucket: "projectpaul-bbc85.appspot.com",
  messagingSenderId: "1046360046156",
  appId: "1:1046360046156:web:0c671f519baebfcc4a12e9",
  measurementId: "G-EQ2PL6NRRD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();
const firestore = firebase.firestore();
const fbStorage = getStorage();

// Authentication state change handler
// firebase.auth().onAuthStateChanged(user => {
//   if (user) {
//     console.log('User signed in:', user);
//     document.getElementById('app-section').style.display = 'block';
//   } else {
//     console.log('No user signed in.');
//     document.getElementById('app-section').style.display = 'block';
//     //checkEmailAndStartUI;
//   }
// });

// Auth state change handler
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("User is signed in:", user);
    document.getElementById('app-section').style.display = 'block';  // Show app section
  } else {
    console.log("User is not signed in");
    initializeFirebaseUI();  // Initialize FirebaseUI for sign-in
  }
});





// Flag to control FirebaseUI initialization
let firebaseUIInitialized = false;

// Function to initialize FirebaseUI
function initializeFirebaseUI() {
  console.log("initializeFirebaseUI");

  if (firebaseUIInitialized) return; // Prevent re-initialization

  console.log('Initializing FirebaseUI...');
  const uiConfig = {
    signInSuccessUrl: 'https://yourapp.com/home',  // Adjust URL as needed
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,      
    ],
    tosUrl: 'https://yourapp.com/home',  // Ensure this is a valid URL
    privacyPolicyUrl: 'https://yourapp.com/home',  // Ensure this is a valid URL
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        console.log('signInSuccessWithAuthResult');
        if (authResult.additionalUserInfo.isNewUser) {
          console.log('New user detected, signing out.');
          alert('This email is not registered. Please use a registered email. Singing');
       //   auth.signOut();  // Sign out if email is not registered
          return false;  // Prevent redirection for new users
        }
        console.log('Returning true for existing user');
        return true;  // Allow redirection for existing users
      },
      uiShown: function() {
        console.log('uiShown callback triggered');
        const loader = document.getElementById('loader');
        if (loader) {
          console.log('Hide the loader');
          loader.style.display = 'none';  // Hide loader when UI is shown
        }
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(auth);
  ui.start('#firebaseui-auth-container', uiConfig);  // Start FirebaseUI
  firebaseUIInitialized = true; // Set flag to prevent re-initialization
}

// Check if email exists and initialize FirebaseUI accordingly
function checkEmailAndStartUI() {
  const emailInput = document.querySelector('input[type="email"]');
  if (emailInput) {
    const email = emailInput.value;
    console.log('checkEmailAndStartUI', email);
    if (email) {
      fetchSignInMethodsForEmail(auth, email)
        .then((signInMethods) => {
          console.log('Sign-in methods:', signInMethods);
          if (signInMethods.length === 0) {
            alert('This email is not registered. Please sign up first.');
            auth.signOut();  // Sign out if email is not registered
          } else {
            console.log('initializeFirebaseUI');
            initializeFirebaseUI();  // Start FirebaseUI if email is registered
          }
        })
        .catch((error) => {
          console.error('Error checking sign-in methods:', error);
        });
    } else {
      console.log('Email input is empty');
    }
  } else {
    console.error('Email input element not found');
  }
}

function uploadImageTry() {

  const user = firebase.auth().currentUser; // Check if user is logged in

  if (!user) {
    alert("Please sign in to upload images.");
    return;
  }
  const fileInput = document.getElementById('imageUpload');
  const file = fileInput.files[0];
  const description = document.getElementById('imageText').value;

  if (!file || !description) {
    alert("Please select an image and enter a description.");
    return;
  }

  let uniqueID = uuid.v4();
  let image = file;
  let imageUrl = `/images/${uniqueID}/${image.name}`; // image.name = name of image uploaded

  //const imageURL = firebase.storage().ref(`images/${file.name}`);

  const USER = "User";
  const DESCRIPTION = "description";
  const FORMDATA = {

    user: USER,

    description: DESCRIPTION, 
  
    imageUrl: imageUrl}
    console.log("Data to Firesotre projectpaulstorage: `n", FORMDATA)

    firebase
      .firestore() // reference cloud firestore
      .collection('projectpaulstorage') // reference collection
      .add({FORMDATA})

    console.log("Uplloading Data to Firesotre projectpaulstorage: `n", FORMDATA)

}



// Function to upload image and description
function uploadImage() {
  const user = firebase.auth().currentUser; // Check if user is logged in
  
  if (!user) {
    alert("Please sign in to upload images.");
    return;
  }

  const fileInput = document.getElementById('imageUpload');
  const file = fileInput.files[0];
  const description = document.getElementById('imageText').value;
  
  if (!file || !description) {
    alert("Please select an image and enter a description.");
    return;
  }

  const storageRef = firebase.storage().ref(`images/${file.name}`);

  // Upload the image
  storageRef.put(file).then(snapshot => {
    console.log('Image uploaded successfully!');


    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        img.style.maxWidth = '200px';
        document.getElementById('image-list').appendChild(img);
      };
      reader.readAsDataURL(file);

      
      const fbStoreageRef = ref(fbStorage, 'images/' + files.name);




      uploadBytes(fbStorageRef, file)
        .then(() => getDownloadURL(fbStorageRef))
        .then((url) => {
          console.log('File available at', url);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.error('No file selected');
    }





    // Get image download URL
    snapshot.ref.getDownloadURL().then(url => {
      console.log('Image available at', url);

      // Store image metadata (description and URL) in Firestore
      db.collection('projectpaulstorage/').add({
        url: url,
        description: description,
        uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: user.uid
      }).then(() => {
        alert('Image and description uploaded successfully!');
        displayImage(url, description);
      }).catch(error => {
        console.error('Error saving image metadata:', error);
      });
    });
  }).catch(error => {
    console.error('Error uploading image:', error);
    alert('Image upload failed.');
  });
}

// Function to display uploaded image and description in the DOM
function displayImage(url, description) {
  const img = document.createElement('img');
  img.src = url;
  img.alt = description;
  img.style.maxWidth = '200px';

  const desc = document.createElement('p');
  desc.textContent = description;

  const container = document.getElementById('image-list');
  container.appendChild(img);
  container.appendChild(desc);
}

// Explicitly attach to the window object
window.uploadImage = uploadImage;
// window.signIn = signIn;
// window.signUp = signUp;

