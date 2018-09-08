var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form');  // the only form
var titleInput = document.querySelector('#title');
var locationInput = document.querySelector('#location');
var videoPlayer = document.querySelector('#player');
var canvasElement = document.querySelector('#canvas');
var captureButton = document.querySelector('#capture-btn');
var imagePicker = document.querySelector('#image-picker');
var imagePickerArea = document.querySelector('#pick-image');
var picture;

function initializeMedia() {
  if (!('mediaDevices' in navigator)) {
    navigator.mediaDevices = {};
  }
  if (!('getUserMedia' in navigator.mediaDevices)) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implememented'));
      }

      return new Promise(function(res, rej) {
        getUserMedia.call(navigator, constraints, res, rej);
      });
    }
  }

  navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream) {
      videoPlayer.srcObject = stream;
      videoPlayer.style.display = 'block';
      imagePickerArea.style.display = 'none';
    })
    .catch(function(err){
      imagePickerArea.style.display = 'block';
      videoPlayer.style.display = "none";
    });
}

captureButton.addEventListener('click', function(event) {
  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureButton.style.display = 'none';
  var context = canvasElement.getContext('2d');
  context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
  videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
  picture = dataURItoBlob(canvasElement.toDataURL());
});

imagePicker.addEventListener('change', (e) => {
  picture = event.target.files[0];
});

function openCreatePostModal() {
  //setTimeout(function() {
    createPostArea.style.transform = 'translateY(0)';
    createPostArea.style.transittion = 'transform 0.3s';
    initializeMedia();
  //}, 1);
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
  createPostArea.style.transform = 'translateY(100vh)';
  createPostArea.style.transittion = 'transform 0.2s';
  if (videoPlayer && videoPlayer.srcObject) {
    videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
      track.stop();
    });
  }
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

form.addEventListener('submit', function(event) {
  event.preventDefault(); // don't send data to server
  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
    alert('Please enter valid data.')
    return;
  }

  closeCreatePostModal();
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready
      .then(function(sw) {
        var post = {
          id: new Date().toISOString(),
          title: titleInput.value,
          location: locationInput.value,
          picture: picture
        };
        writeData('sync-posts', post)
          .then(function(){
            return sw.sync.register('sync-new-post');  // id of Sync event
          })
          .then(function() {
            var snackBarContainer = document.querySelector('#confirmation-toast');
            var data = {message: 'Your Post was saved for syncing.'};
            snackBarContainer.MaterialSnackbar.showSnackbar(data);
          })
          .catch(function(err) {
            console.log(err)
          });
      })
  } else {
    sendData(); // directly send data to backend
  }
});

function sendData() {
  var postData = new FormData();
  var id = new Date().toISOString();
  postData.append('id', id);
  postData.append('title', titleInput.value);
  postData.append('location', locationInput.value);
  postData.append('file', picture, id + '.png');
  fetch('https://us-central1-pwagram-45678.cloudfunctions.net/storePostData', {
    method: 'POST',
    body: postData
  })
  .then(function(res) {
    console.log('Sent data: ', res);
    updateUI();
  })
}