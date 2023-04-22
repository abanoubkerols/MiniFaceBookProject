let email = document.getElementById('main-info-email')
let name = document.getElementById('main-info-name')
let userName = document.getElementById('main-info-userName')
let postCount = document.getElementById('postCount')
let commentCount = document.getElementById('commentCount')
let userPost = document.getElementById('user-post')
let imgUser = document.getElementById('img-user')
let myPost = document.getElementById('myPost')



    let urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get("userId")




function getUser() {
 
    axios.get(`${baseUrl}users/${id}`).then((res) => {
        const user = res.data.data
        email.innerHTML = user.email
        name.innerHTML = user.name
        userName.innerHTML = user.username
        postCount.innerHTML = user.posts_count
        commentCount.innerHTML = user.comments_count
        imgUser.setAttribute('src', user.profile_image)
        myPost.innerHTML = user.username
    })
}
getUser()

getPosts()
function getPosts() {
   
    axios.get(`${baseUrl}users/${id}/posts`).then((res) => {
        const posts = res.data.data
        userPost.innerHTML = ''

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
            
            <div class="card shadow-sm p-0 my-5">
                <div class="card-header">
                    <img src="${post.author.profile_image}" class="border border-3 rounded-circle" width="40px"
                        height="40px" alt="">
                    <b>${post.author.username}</b>
                    ${buttonEditContent}
               
                </div>
                <div class="card-body" role="button">
                   
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
            userPost.innerHTML += content
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