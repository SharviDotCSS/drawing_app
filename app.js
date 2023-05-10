
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id:'779111387364-03s1ba8si7hdj8fhvlrj876t2kn01am1.apps.googleusercontent.com'
    });
  });


function onSignIn(googleUser) {
    // Get user information
    var profile = googleUser.getBasicProfile();
    var name = profile.getName();
    var email = profile.getEmail();
    var imageUrl = profile.getImageUrl();
  
    // Do something with user information
    console.log('Name: ' + name);
    console.log('Email: ' + email);
    console.log('Image URL: ' + imageUrl);
  }

