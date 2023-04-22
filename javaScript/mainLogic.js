
const addPostBtn = document.getElementById('add-post')
let login = document.getElementById('login')
let logOut = document.getElementById('logOut')
let registerUser = document.getElementById('register-user')
const alert = document.getElementById('alert')
const postUser = document.getElementById('add-post-user')
const deletePostUser = document.getElementById('delete-post-user')
const addPost = document.getElementById('add-post')
const baseUrl = "https://tarmeezacademy.com/api/v1/"

function setUI() {
    const token = localStorage.getItem('token')
    const loginBtn = document.getElementById('loginBtn')
    const registerBtn = document.getElementById('registerBtn')
    const logOutBtn = document.getElementById('logOut')

    if (token == null) {

        if (addPostBtn !== null) {
            addPostBtn.style.setProperty("display", "none")

        }

        logOutBtn.parentElement.style.setProperty("display", "none", "important")
        loginBtn.parentElement.style.setProperty("display", "flex", "important")
        registerBtn.parentElement.style.setProperty("display", "flex", "important")

    }
    else {
        if (addPostBtn !== null) {
            addPostBtn.style.setProperty("display", "block")

        }
        loginBtn.parentElement.style.setProperty("display", "none", "important")
        registerBtn.parentElement.style.setProperty("display", "none", "important")
        logOutBtn.parentElement.style.display = 'flex'

        let curUser = getCurrentUser()
        document.getElementById('user-name').innerHTML = curUser.username
        document.getElementById('profile-pic').setAttribute('src', curUser.profile_image)
    }
}
setUI()


// login for user
login.onclick = async function loginClick() {
    let username = document.getElementById('username-input').value
    let password = document.getElementById('password').value

    const params = {
        "username": username,
        "password": password
    }


    axios.post(`${baseUrl}login`, params).then((res) => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        console.log(res);

        const model = document.getElementById('loginModal')
        const modelInstance = bootstrap.Modal.getInstance(model)
        modelInstance.hide()
        tempAlert("login is done", 1500, 'primary')
        setUI()

    }).catch(error => {

        const msg = error.response.data.message
        tempAlert(msg, 2000, 'danger')
    })

}



// register For New User 
registerUser.onclick = function registerClick() {
    let name = document.getElementById('register-name-input').value
    let username = document.getElementById('register-username-input').value
    let password = document.getElementById('register-password-input').value
    let profileImg = document.getElementById('img-profile').files[0]

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", profileImg)

    axios.post(`${baseUrl}register`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",

        }
    }).then((res) => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        const model = document.getElementById('registerModal')
        const modelInstance = bootstrap.Modal.getInstance(model)
        modelInstance.hide()
        tempAlert("Register User is done", 1500, 'primary')
        setUI()

    }).catch((error) => {
        console.log(error);
        const msg = error.response.data.message
        tempAlert(msg, 2000, 'danger')
    })

}


function tempAlert(msg, duration, AlertColor) {
    let ele = document.createElement("p");
    ele.classList = `alert w-100   alert-${AlertColor} text-center `

    ele.innerHTML = msg;
    setTimeout(function () {
        ele.parentNode.removeChild(ele);
    }, duration);
    alert.appendChild(ele);
}

function getCurrentUser() {
    let user = null
    let storage = localStorage.getItem("user")
    if (storage != null) {
        user = JSON.parse(storage)
    }
    return user
}

logOut.onclick = function logOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUI()

    tempAlert("logout is done", 1000, 'danger')
}



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


function profilePage() {
   let  user = getCurrentUser()
    window.location = `profile.html?userId=${user.id}`
}



function toggleLoader(show = true){
    if(show){
        document.getElementById('loader').style.visibility = 'visible'
    }else{
        document.getElementById('loader').style.visibility = 'hidden'

    }
}