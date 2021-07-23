// MockAPI Url
let APIUrl = "https://60f2db906d44f300177887c6.mockapi.io/Zenmedia/";

/**
 * Function that displays the form to raise query
 */
function displayForm(){
    document.getElementById("name").value = '';
    document.getElementById("password").value = '';
    document.getElementById("title").value = '';
    document.getElementById("query").value = '';
    document.getElementById("form-div").classList.remove("d-none");
}

/**
 * Function that adds the details filled the query form to the API data
 */
async function createQuery(){
    // Getting query details
    let name = document.getElementById("name").value;
    let passwordtodelete = document.getElementById("password").value;
    let title = document.getElementById("title").value;
    let query = document.getElementById("query").value;

    // Adding the query details to API data by POST 
    try {
        await fetch(APIUrl,{
            method: "POST",
            headers: {"Content-Type":"Application/json"},
            body: JSON.stringify({name,passwordtodelete,title,query})
        });
    } catch (error) {
        console.log(error);
    }

    // Updating the Queries raised section
    loadLatestPost();
    // Hiding the query form
    document.getElementById("form-div").classList.add("d-none");
    return false;
}

/**
 * Function to load the Queries raised in the main section
 */
async function loadLatestPost(){
    // Getting the queries from the API
    try {
        let response = await fetch(APIUrl);
        let data = await response.json();

        document.getElementById("row").innerHTML = "";

        data.forEach(element => {
            let elementAsString = JSON.stringify(element);
            // Creating cards to display the queries in the Queries raised section
            document.getElementById("row").innerHTML += `
            <div class="col-sm-12 col-md-6 col-lg-3 pb-3">
                    <div class="card h-100 border border-success border-3 bg-dark text-success" onclick = 'getQueryDetails(${elementAsString})'>
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold">${element.title}</h5>
                            <p class="card-text">Create by ${element.name}</p>
                        </div>
                    </div>
                </div>
            `;
    });

    } catch (error) {
        console.log(error);
    }
}

/**
 * Function to display the full query details when a particular query is selected
 */
function getQueryDetails(data){
    try {
        // Displaying the query title, name, and query issue
        document.getElementById("query-title").innerHTML = " " + data.title;
        document.getElementById("query-name").innerHTML = data.name;
        document.getElementById("query-details").innerHTML = data.query;
        let jsonString = JSON.stringify(data);

        // Adding comment and delete buttons
        document.getElementById("query-button").innerHTML = `
            <button class="btn btn-success" onclick='openCommentForm(${jsonString})'>Add Comment</button>
            <button class="btn btn-success" onclick='deleteQuery(${jsonString})'>Delete Query</button>
        `;

        document.getElementById("query-comment").value = JSON.stringify(data.comment);
        // Hide main section and unhide query section
        document.getElementById("main-section").classList.add("d-none");
        document.getElementById("query-section").classList.remove("d-none");

        document.getElementById("comment-row").innerHTML = "";

        // Creating cards to display the comment details of the query selected
        data.comment.forEach(element => {
            document.getElementById("comment-row").innerHTML += `
                <div class="col-lg-12 pt-3">
                    <div class="card h-100 border border-success border-3 bg-dark text-success">
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold">${element.commentData}</h5>
                            <p class="card-text">Create by ${element.name}</p>
                        </div>
                    </div>
                </div>
            `;
        });


    } catch (error) {
        console.log(error);
    }
}

/**
 * Function to delete the query when Delete Query button is clicked
 */
async function deleteQuery(data){
    // Prompting for password to delete
    let password = prompt("Enter password to delete");
    let confirmation = false;

    // Validating the password entered
    confirmation = data.passwordtodelete === password ? true : false;
    if(confirmation){
        try {
            //Deleting the query from API data
            await fetch(APIUrl+data.id,{
                method: "DELETE",
                headers: {  
                    "Content-Type":"Application/json" 
                }
            })
            // Reloading the Queries raised section
            loadLatestPost();
            // Hide query section and unhide main section
            document.getElementById("query-section").classList.add("d-none");
            document.getElementById("main-section").classList.remove("d-none");

        } catch (error) {
            console.log(error)
        }

    }
    else{
        alert("wrong password")
    }
}

/**
 * Function to close the form when "X" icon is clicked
 */
function closeForm(id){
    document.getElementById(id).classList.add("d-none");
}

/**
 * Function to display the Form to add comment to the query
 */
function openCommentForm(data){
    document.getElementById("commenter-name").value = '';
    document.getElementById("comment").value = '';
    document.getElementById("query-id").value = data.id;
    document.getElementById("comment-form-div").classList.remove("d-none");
}

/**
 * Function to load the main section
 */
function loadMainSection(){
    loadLatestPost();
    document.getElementById("query-section").classList.add("d-none");
    document.getElementById("main-section").classList.remove("d-none");
}

/**
 * Function to add the comment to the query details
 */
async function addCommentToQuery(){
    try {
        // Getting comment details to be added
        let name = document.getElementById("commenter-name").value;
        let commentData = document.getElementById("comment").value;
        let id = document.getElementById("query-id").value;
        let comment = document.getElementById("query-comment").value;
        
        // Pushing the comment to be added to comment array which has all the comments of the query selected
        comment = JSON.parse(comment)
        comment.push({"name": name, "commentData": commentData});

        // updating the comments to the query details
        await fetch(APIUrl+id,{
            method: "PUT",
            headers: {  
                "Content-Type":"Application/json" 
            },
            body: JSON.stringify({comment})
        })

        document.getElementById("query-comment").value = JSON.stringify(comment);
        document.getElementById("comment-row").innerHTML = "";

        // creating cards to display the comment details
        comment.forEach(element => {
            document.getElementById("comment-row").innerHTML += `
                <div class="col-lg-12 pt-3">
                    <div class="card h-100 border border-success border-3 bg-dark text-success">
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold">${element.commentData}</h5>
                            <p class="card-text">Create by ${element.name}</p>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.log(error)
    }
    
    // Hiding the comment form
    document.getElementById("comment-form-div").classList.add("d-none");
}

loadLatestPost();