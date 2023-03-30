function loadSkeleton() {
    $('#navbar').load('../text/navbar_guest.html');
    $('#body-cards').load('../text/body_cards.html');
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            $('#navbar').load('../text/navbar.html');
            document.getElementById('start-trip').onclick = () => {
                window.location.href = './map.html';
            }
            document.getElementById('about-us').onclick = () => {
                window.location.href = './about_us.html';
            }
            console.log("SIGNED IN")
        } else {
            console.log("NO USER")
        }
    });
}
loadSkeleton();