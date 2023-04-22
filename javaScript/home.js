let dataOfPage = document.getElementById('posts')









let content
let currentPage = 1
let lastPage = 1

// infinite scroll
window.addEventListener('scroll', function () {
    const endOfPage = window.innerHeight + window.pageYOffset >= this.document.body.scrollHeight
    if (endOfPage && currentPage < lastPage) {
        currentPage += 1
        getPosts(false, currentPage + 1)
    }
})


// show Posts 
function getPosts(reload = true, page = 1) {
    toggleLoader(true)
    axios.get(`${baseUrl}posts?limit=2&page=${page}`).then((res) => {
        toggleLoader(false)
        const posts = res.data.data
        lastPage = res.data.meta.last_page
        // console.log(posts);
        if (reload) {
            dataOfPage.innerHTML = " "
        }

        for (let post of posts) {

            let postTitle = ""
            if (post.title !== null) {
                postTitle = post.title
            }
            let user = getCurrentUser()
            let isMypost = user != null && post.author.id == user.id
            let buttonEditContent = ``
            if (isMypost) {
                buttonEditContent =
                    `
                 <button class="btn btn-danger float-end ms-2 " onclick="DeletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                 <button class="btn btn-secondary float-end" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                 `
            }

            content = `
            
            <div class="card shadow-sm my-5">
                <div class="card-header" >
                   <SPAN onclick="userInfo(${post.id})">
                      <img role="button"src="${post.author.profile_image}" class="border border-3 rounded-circle"  width="40px"
                         height="40px" alt="">
                         <b  role="button">${post.author.username}</b>
                   </SPAN>

                    ${buttonEditContent}
               
                </div>
                <div class="card-body" role="button" onclick="postClicked(${post.id})">
                   
                   <img src="${post.image}" class="w-100" alt="">
                   <h6 style="color: rgb(193 , 193 ,193);" class="mt-1">
                       ${post.created_at}
                   </h6>
                   <h5>${postTitle}</h5>
                   <P>${post.body}</P>
               
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                        </svg>
                        <span>(${post.comments_count}) comments
                        
                            <span id="tags-${post.id}">
                              
                            </span>
                        
                        </span>
                    </div>
                </div>
            </div>
            
            `
            dataOfPage.innerHTML += content
            document.getElementById(`tags-${post.id}`).innerHTML = ' '

            for (let tag of post.tags) {
                let tagContent =
                    `
                <button class="btn btn-sm rounded-5 bg-secondary text-white me-1">
                ${tag.name}
                </button>
                `

                document.getElementById(`tags-${post.id}`).innerHTML += tagContent
            }

        }

    })
}
getPosts()




// Create Post for user
postUser.onclick = function createPost() {
    let postId = document.getElementById("post-id-input").value
    let isCreated = postId == null || postId == ""

    let title = document.getElementById('title-post').value
    let Description = document.getElementById('Description-post').value
    let imgPost = document.getElementById('img-post').files[0]


    let formData = new FormData()
    formData.append("title", title)
    formData.append("body", Description)
    formData.append("image", imgPost)

    let token = localStorage.getItem('token')
    let url = ``
    if (isCreated) {
        url = `${baseUrl}posts`

    } else {
        formData.append("_method", "put")
        url = `${baseUrl}posts/${postId}`

    }


    axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "authorization": `Bearer ${token}`
        }
    }).then((res) => {
        console.log(res);
        tempAlert("Your post is done", 1500, 'primary')
        const model = document.getElementById('createPostModal')
        const modelInstance = bootstrap.Modal.getInstance(model)
        modelInstance.hide()
        setUI()
        getPosts()

    }).catch(error => {
        const msg = error.response.data.message
        tempAlert(msg, 2000, 'danger')
    })
}






function postClicked(postId) {
    location = `postDetails.html?postId=${postId}`
}


function editPost(myPost) {
    let post = JSON.parse(decodeURIComponent(myPost))
    postUser.innerHTML = "Update"
    document.getElementById("titlePostModel").innerHTML = "Edit Post"
    document.getElementById("post-id-input").value = post.id

    document.getElementById("title-post").value = post.title
    document.getElementById("Description-post").value = post.body
    document.getElementById("img-post").files[0] = post.image
    let postModel = new bootstrap.Modal(document.getElementById("createPostModal"))
    postModel.toggle()
}

function DeletePost(myPost) {
    let post = JSON.parse(decodeURIComponent(myPost))
    document.getElementById('deletePostId').value = post.id
    let postModel = new bootstrap.Modal(document.getElementById("deletePostModal"))
    postModel.toggle()
}


deletePostUser.onclick = function deletePostModal() {
    let postID = document.getElementById('deletePostId').value
    let token = localStorage.getItem('token')

    axios.delete(`${baseUrl}posts/${postID}`, {
        headers: {
            "Content-Type": "multipart/form-data",
            "authorization": `Bearer ${token}`
        }
    }).then((res) => {

        console.log(res);

        const model = document.getElementById('deletePostModal')
        const modelInstance = bootstrap.Modal.getInstance(model)
        modelInstance.hide()
        tempAlert("delete done", 1500, 'primary')
        getPosts()

        setUI()

    }).catch(error => {

        const msg = error.response.data.message
        tempAlert(msg, 2000, 'danger')
    })

}


addPost.onclick = function addBtn() {

    postUser.innerHTML = "Create"
    document.getElementById("titlePostModel").innerHTML = "Create Post"
    document.getElementById("post-id-input").value = ""

    document.getElementById("title-post").value = " "
    document.getElementById("Description-post").value = " "
    document.getElementById("img-post").files[0] = " "

    let postModel = new bootstrap.Modal(document.getElementById("createPostModal"))
    postModel.toggle()

}

function userInfo(id) {
    
    window.location = `profile.html?userId=${id}`
}

