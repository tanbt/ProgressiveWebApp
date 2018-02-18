var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);
      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation.');
      } else {
        console.log('User added to Home Screen.');
      }
    });
    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()){
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(cardItem) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("' + cardItem.image + '")';
  cardTitle.style.backgroundSize = 'cover';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = "white";
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = cardItem.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = cardItem.location;
  cardSupportingText.style.textAlign = 'center';
/*
  var cardSaveButton = document.createElement('button');
  cardSaveButton.textContent = "Save";
  cardSaveButton.addEventListener('click', onSaveButtonClicked);
  cardSupportingText.appendChild(cardSaveButton);
*/
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data){
  data.forEach(function(item) {
    createCard(item);
  });
}
function convertDataObjectToArray(jsonObject) {
  var dataArray=[];
  for (var key in jsonObject) { //loop through properties of an object
    dataArray.push(jsonObject[key])
  }
  return dataArray;
}

var url = 'https://pwagram-45678.firebaseio.com/posts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    clearCards();
    updateUI(convertDataObjectToArray(data));
    var networkDataReceived = true;
    console.log('From web: ', data);
  })
  .catch(function(err) {
    console.log('[APP] Cannot reach out the Internet.');
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From indexedDB', data);
        updateUI(data);
      }
    })
}

/*
  function onSaveButtonClicked(event) {
    if ('caches' in window) {
      caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
    } else {
      console.log('Your browser doesn\'t support caching');
    }
  }
*/

// Test this function by calling in Console
function unregisterServiceWorker() {
  navigator.serviceWorker.getRegistrations()
    .then(function(registrations){
      registrations.forEach(function(sw) {
        sw.unregister();
      });
    })
}