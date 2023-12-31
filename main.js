const navLinks = document.querySelectorAll('nav ul li a');
const commentBtn = document.querySelector('.comment-btn');
const usernameInput = document.querySelector('#username');
const commentInput = document.querySelector('#input_comment');
const commentSection = document.querySelector('.comment-card');
const sortSelect = document.querySelector('#sort_option');
const api = 'https://harrel-comments-default-rtdb.asia-southeast1.firebasedatabase.app/comment.json';
const initialComments = [];

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    if (data) {
      Object.keys(data).forEach((key) => {
        initialComments.push(data[key]);
      });
    }
  })
  .then(() => updateComments());

const scrollToTarget = (targetId) => {
  const targetElement = document.querySelector(`#${targetId}`);
  targetElement?.scrollIntoView({
    behavior: 'smooth'
  });
};

const markActiveLink = (activeLink) => {
  navLinks.forEach((navLink) => navLink.classList.remove('active'));
  activeLink?.classList.add('active');
};

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    scrollToTarget(targetId);
    markActiveLink(link);
  });
});

const togglePopup = (popupId) => {
  const popupContainer = document.querySelector(`#${popupId}`);
  popupContainer.classList.toggle('active');
};

const closePopups = () => {
  const activePopups = document.querySelectorAll('.popup-container.active');
  activePopups.forEach((popup) => popup.classList.remove('active'));
};

document.addEventListener('click', (event) => {
  const popupTrigger = event.target.closest('.show-popup');
  const closeBtn = event.target.closest('.close-btn');

  if (!popupTrigger) {
    if (closeBtn || event.target.classList.contains('popup-container')) {
      closePopups();
    }
    return;
  }

  const popupId = popupTrigger.getAttribute('data-popup-id');
  if (popupId) togglePopup(popupId);
});

commentBtn.addEventListener('click', addComment);
commentInput.addEventListener('input', toggleButtonState);
usernameInput.addEventListener('input', toggleButtonState);
sortSelect.addEventListener('change', updateComments);

function toggleButtonState() {
  const isInputValid = usernameInput.value.trim() && commentInput.value.trim();
  commentBtn.classList.toggle('active', isInputValid);
  commentBtn.disabled = !isInputValid;
}

function addComment() {
  const username = usernameInput.value.trim();
  const commentText = commentInput.value.trim();

  if (!(username && commentText)) return;

  const currentDate = new Date();
  const commentDate = currentDate.toISOString();

  const newComment = {
    name: username,
    comment: commentText,
    date: commentDate
  };

  fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newComment)
  })
    .then((response) => response.json())
    .then((data) => {
      getRecentComment();
    });

  usernameInput.value = '';
  commentInput.value = '';
  toggleButtonState();

  window.scrollTo(0, document.body.scrollHeight);
}

function toggleComment(username, commentText) {
  if (!(username && commentText)) return;

  const timestamp = new Date();
  const dateString = timestamp.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const timeString = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  });

  const newComment = document.createElement('div');
  newComment.classList.add('comment-info');
  newComment.innerHTML = `
    <p class="name">${username} - ${dateString}, ${timeString}</p>
    <p class="comment">${commentText}</p>
  `;

  commentSection.appendChild(newComment);

  usernameInput.value = '';
  commentInput.value = '';
}

function getRecentComment() {
  fetch(api)
    .then((data) => data.json())
    .then((response) => {
      if (typeof response === 'object' && response !== null) {
        const keys = Object.keys(response);
        const lastKey = keys[keys.length - 1];
        const lastObject = response[lastKey];

        const comment = lastObject.comment;
        const name = lastObject.name;
        initialComments.push(lastObject);
        updateComments();
      } else {
        console.log('Response is not a JSON object or is null');
      }
    })
    .catch((error) => console.error('Error fetching data:', error));
}

function updateComments() {
  commentSection.innerHTML = '';
  const allComments = [...initialComments];
  const sortedComments = sortComments(initialComments, sortSelect.value);
  sortedComments.forEach((comment) => {
    const newComment = document.createElement('div');
    newComment.classList.add('comment-info');
    newComment.innerHTML = `
        <p class="name">
          ${comment.name} - ${formatDate(comment.date)}
        </p>
        <p class="comment">${comment.comment}</p>
    `;
    commentSection.appendChild(newComment);
  });
}

function sortComments(comments, order) {
  return comments.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
}

function parseCommentTimestamp(commentElement) {
  const timestampText = commentElement
    .querySelector('.name')
    .textContent.split(' - ')[1];
  return new Date(timestampText);
}

function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
