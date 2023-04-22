

let urlParams = new URLSearchParams(window.location.search)
let id = urlParams.get("postId")

let username = document.getElementById('username')
let post = document.getElementById('post')




// show Posts for one user 
function getPostsForOneUser() {
    axios.get(`${baseUrl}posts/${id}`).then((res) => {
        const posts = res.data.data
        const comments = posts.comments
        const author = posts.author
        username.innerHTML = author.username

        let postTitle = ""
        if (posts.title !== null) {
            postTitle = posts.title
        }


        // show comment 
        let commentContent = ``

        for (let comment of comments) {
            commentContent += `
            <div>
                 <img src="${comment.author.profile_image}" class="rounded-circle" style="width:30px;height:30px; alt="">
                 <b>${comment.author.username}</b>
            </div>
            <div  class="ms-4 mt-2">
                ${comment.body}        
            </div>

            `
        }
        let postContent = `
                 <div class="card shadow-sm my-3">
                    <div class="card-header">
                        <img src="${author.profile_image}" class="img-thumbnail rounded-5"
                            style="width: 40px; height: 40px">
                        <b>@${author.username}</b>
                    </div>


                    <div class="card-body" >
                        <img src="${posts.image}" class="card-img-top">
                        <h6 style="color: rgb(171, 171, 171)">
                        ${posts.created_at}
                        </h6>

                        <h5>${postTitle}</h5>
                        <P>${posts.body}</P>

                        

                        <hr>

                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-pen" viewBox="0 0 16 16">
                                <path
                                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                            </svg>
                            <span>
                                (${posts.comments_count}) Comments
                            </span>

                        </div>

                        <hr>


                    </div>


                    <!-- COMMENTS -->
                    <div id="comments">

                        <!-- COMMENT -->
                        <div class="p-3 rounded-3" style="background: rgb(241, 246, 255)">
                        ${commentContent}
                        </div>
                        <!--// COMMENT //-->

                    </div>
                    
                 
                    <div class="input-group my-2 mx-1 " id="add-comment">
                    <input type="text" id="enterComment"  class="form-control me-1 " placeholder="enter your comment">
                    <button type="button"  class="btn btn-primary fw-bold me-2"  onclick="createOwnComment()">Enter </button>
                </div>
                </div>
        `
        post.innerHTML = postContent

    })


}
getPostsForOneUser()

function createOwnComment() {
    let body = document.getElementById('enterComment').value
    let params = {
        "body": body
    }


    let url = `${baseUrl}posts/${id}/comments`
    let token = localStorage.getItem('token')
    axios.post(url, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    }).then((response) => {
        console.log(response.data);
        getPostsForOneUser()
        tempAlert("your comment has been created", 2000, 'primary')


    }).catch((error) => {
        const msg = error.response.data.message
        tempAlert(msg, 2000, 'danger')

    })
}

