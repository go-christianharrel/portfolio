const navLinks = document.querySelectorAll('nav ul li a');

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

const usernameInput = document.querySelector('#username');
const commentInput = document.querySelector('#input_comment');
const commentButton = document.querySelector('.comment-btn');
const commentSection = document.querySelector('.comment-card');

usernameInput.addEventListener('input', toggleButtonState);
commentInput.addEventListener('input', toggleButtonState);
commentButton.addEventListener('click', addComment);

function toggleButtonState() {
  const isInputValid = usernameInput.value.trim() && commentInput.value.trim();
  commentButton.classList.toggle('active', isInputValid);
  commentButton.disabled = !isInputValid;
}

function addComment() {
  const username = usernameInput.value.trim();
  const commentText = commentInput.value.trim();

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
  sortComments();
  toggleButtonState();
}

function sortComments() {
  const sortOption = document.querySelector('#sort_option').value;
  const comments = Array.from(
    commentSection.querySelectorAll('.comment-info')
  );

  comments.sort((a, b) => {
    const dateA = parseCommentTimestamp(a);
    const dateB = parseCommentTimestamp(b);
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });

  commentSection.innerHTML = '';
  comments.forEach((comment) => commentSection.appendChild(comment));
}

function parseCommentTimestamp(commentElement) {
  const timestampText = commentElement
    .querySelector('.name')
    .textContent.split(' - ')[1];
  return new Date(timestampText);
}
