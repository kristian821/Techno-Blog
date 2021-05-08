const addPost = async (event) => {
    event.preventDefault();

    document.location.replace('/dashboard/addPost');
};

document.querySelector('#add-post-btn').addEventListener('click', addPost);