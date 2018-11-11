const popupUri = 'popup.html';
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

$('#login button').click(() => solid.auth.popupLogin({popupUri}));
$('#logout button').click(() => solid.auth.logout());

solid.auth.trackSession(session => {
    const loggedIn = !!session;
    $('#login').toggle(!loggedIn);
    $('#logout').toggle(loggedIn);
    $('#user').text(session && session.webId);
    if(loggedIn){
        $('#user').text(session.webId);
        if(!$('#profile').val()){
            $('#profile').val(session.webId);
        }
    }
});

$('#view').click(async function loadProfile() {

    // set up local data store and associated data fetcher
    const store = $rdf.graph();
    const fetcher = new $rdf.Fetcher(store);

    // load person's data into store
    const person = $('#profile').val();
    await fetcher.load(person);

    const fullName = store.any($rdf.sym(person), FOAF('name'));
    $('#fullName').text(fullName && fullName.value);

    const friends = store.each($rdf.sym(person), FOAF('knows'));
    $('#friends').empty();
    friends.forEach(async (friend) => {
        await fetcher.load(friend);
        const fullName = store.any(friend, FOAF('name'));

        $('#friends').append(
            $('<li>').append(
               $('<a>').text(fullName && fullName.value || friends.value)
                .click(() => $('#profile').val(friend.value))
                .click(loadProfile)
            ) 
        );
            
    })
    


})
