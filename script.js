
let notes = JSON.parse(
  localStorage.getItem("myIphoneNotes") || "[]"
);

let currentNoteId = null;

// เปิดแอป

function openApp(appName) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  if (appName === "notes") {
    document.getElementById("notes").classList.add("active");
    showNotesList();

  } else if (appName === "instagram") {
    document.getElementById("instagram")
      .classList.add("active");
    closePost();

} else if (appName === "phone") {
  document.getElementById("phone-app")
    .classList.add("active");
  resetCallScreen();

  } else {
    document.getElementById("other-app")
      .classList.add("active");

    document.getElementById("other-title")
      .textContent =
      appName.charAt(0).toUpperCase() + appName.slice(1);

    document.getElementById("other-description")
      .textContent = "This app is coming soon ♡";
  }
}


// กลับหน้า Home

function goHome() {

  // หยุดเสียงโทรศัพท์และรีเซ็ตหน้าจอโทร
  resetCallScreen();

  // ซ่อนหน้าจอแอปทั้งหมด
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  // กลับไปหน้า Home
  document.getElementById("home").classList.add("active");

}

// บันทึกข้อมูลลงเบราว์เซอร์
function storeNotes() {
  localStorage.setItem(
    "myIphoneNotes",
    JSON.stringify(notes)
  );
}

// แสดงรายการโน้ต
function showNotesList() {
  document.getElementById("notes-list")
    .classList.remove("hidden");

  document.getElementById("note-editor")
    .classList.add("hidden");

  const container = document.getElementById("note-items");
  container.innerHTML = "";

  notes.forEach(note => {
    const button = document.createElement("button");
    button.className = "note-item";

    const title = document.createElement("strong");
    title.textContent = note.title || "New Note";

    const preview = document.createElement("p");
    preview.textContent = note.body || "No additional text";

    button.appendChild(title);
    button.appendChild(preview);

    button.onclick = () => editNote(note.id);

    container.appendChild(button);
  });
}

// สร้างโน้ตใหม่
function createNote() {
  const newNote = {
    id: Date.now(),
    title: "",
    body: ""
  };

  notes.unshift(newNote);
  storeNotes();
  editNote(newNote.id);
}

// เปิดหน้าแก้ไขโน้ต
function editNote(id) {
  currentNoteId = id;

  const note = notes.find(n => n.id === id);
  if (!note) return;

  document.getElementById("notes-list")
    .classList.add("hidden");

  document.getElementById("note-editor")
    .classList.remove("hidden");

  document.getElementById("note-title").value = note.title;
  document.getElementById("note-body").value = note.body;
}

// บันทึกทุกครั้งที่พิมพ์
function saveNote() {
  const note = notes.find(n => n.id === currentNoteId);
  if (!note) return;

  note.title = document.getElementById("note-title").value;
  note.body = document.getElementById("note-body").value;

  storeNotes();
}

// ลบโน้ต
function deleteNote() {
  if (currentNoteId === null) return;

  if (!confirm("Delete this note?")) return;

  notes = notes.filter(n => n.id !== currentNoteId);
  currentNoteId = null;

  storeNotes();
  showNotesList();
}

// แสดงเวลาปัจจุบัน
function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false
    });

  document.getElementById("widget-day").textContent =
    now.toLocaleDateString("en-US", {
      weekday: "long"
    });

  document.getElementById("widget-date").textContent =
    now.getDate();
}

updateClock();
setInterval(updateClock, 30000);

const instagramPosts = [
  {
    image: "./images/post1.jpg",
    caption: "A lovely day ♡"
  },
  {
    image: "./images/post2.jpg",
    caption: "My favorite memories 🌷"
  },
  {
    image: "./images/post3.jpg",
    caption: "See you again soon!"
  }
];

let currentPost = 0;
let likedPosts = JSON.parse(
  localStorage.getItem("igLikes") || "{}"
);

let igComments = JSON.parse(
  localStorage.getItem("igComments") || "{}"
);

function openPost(index) {
  currentPost = index;

  const post = instagramPosts[index];

  document.getElementById("ig-large-photo").src =
    post.image;

  document.getElementById("ig-caption").textContent =
    post.caption;

  document.getElementById("ig-post-view")
    .classList.remove("hidden");

  document.getElementById("ig-comment-area")
    .classList.add("hidden");

  updateLikeButton();
  renderComments();
}

function closePost() {
  document.getElementById("ig-post-view")
    .classList.add("hidden");
}

function toggleLike() {
  likedPosts[currentPost] = !likedPosts[currentPost];

  localStorage.setItem(
    "igLikes",
    JSON.stringify(likedPosts)
  );

  updateLikeButton();
}

function updateLikeButton() {
  const button =
    document.getElementById("ig-like-button");

  const liked = !!likedPosts[currentPost];

  button.textContent = liked ? "♥" : "♡";
  button.style.color = liked ? "#ff3040" : "#111";
}

function toggleFollow(button) {
  const following = button.textContent.trim() === "Following";

  button.textContent = following ? "Follow" : "Following";
  button.style.background = following ? "#2788ed" : "#ddd";
  button.style.color = following ? "white" : "#111";
}

function togglePostComment() {
  document.getElementById("ig-comment-area")
    .classList.toggle("hidden");
}

function addComment() {
  const input = document.getElementById("ig-comment-input");
  const message = input.value.trim();

  if (!message) return;

  if (!igComments[currentPost]) {
    igComments[currentPost] = [];
  }

  igComments[currentPost].push(message);

  localStorage.setItem(
    "igComments",
    JSON.stringify(igComments)
  );

  input.value = "";
  renderComments();
}

function renderComments() {
  const container = document.getElementById("ig-comments");
  container.innerHTML = "";

  const comments = igComments[currentPost] || [];

  comments.forEach(message => {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    container.appendChild(paragraph);
  });
}

// =====================================
// PHONE APP — CALL SYSTEM
// =====================================

let autoAnswerTimer = null;
let callDurationTimer = null;
let callSeconds = 0;
let phoneCallState = "idle";

const ringtone = document.getElementById("ringtone");
const voiceAudio = document.getElementById("voice-audio");

function setPhoneStatus(text) {
  document.getElementById("call-status").textContent = text;
}

function setPhoneButton(id, visible) {
  document.getElementById(id)
    .classList.toggle("hidden", !visible);
}

// เริ่มโทรออก
function startCall() {
  resetCallScreen();

  phoneCallState = "calling";
  setPhoneStatus("Calling...");

  setPhoneButton("call-start", false);
  setPhoneButton("call-answer", false);
  setPhoneButton("call-end", true);

  ringtone.currentTime = 0;
  ringtone.play().catch(error => {
    console.error("Ringtone error:", error);
  });

  // รอ 10 วินาทีแล้วรับสายอัตโนมัติ
  autoAnswerTimer = setTimeout(() => {
    autoAnswerTimer = null;

    if (phoneCallState === "calling") {
      answerCall();
    }
  }, 10000);
}

// รับสายอัตโนมัติ
function answerCall() {
  if (phoneCallState !== "calling") return;

  phoneCallState = "connected";

  ringtone.pause();
  ringtone.currentTime = 0;

  setPhoneStatus("Connected");

  document.getElementById("phone-options")
    .classList.remove("hidden");

  setPhoneButton("call-answer", false);

  callSeconds = 0;
  updateCallTimer();

  callDurationTimer = setInterval(() => {
    callSeconds++;
    updateCallTimer();
  }, 1000);

  // ตรวจสอบและเล่นเสียงหลังรับสาย
  const callVoice = document.getElementById("voice-audio");

  if (callVoice) {
    console.log("Voice file:", callVoice.currentSrc || callVoice.src);

    callVoice.muted = false;
    callVoice.volume = 1;
    callVoice.currentTime = 0;

    callVoice.play()
      .then(() => {
        console.log("Voice audio started");
      })
      .catch(error => {
        console.error("Voice audio error:", error);
      });
  } else {
    console.error("Cannot find voice-audio element");
  }

}

// อัปเดตเวลาโทร
function updateCallTimer() {
  const minutes = Math.floor(callSeconds / 60);
  const seconds = callSeconds % 60;

  document.getElementById("call-timer").textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

// วางสาย
function endCall() {
  resetCallScreen();
}

// รีเซ็ตหน้าจอโทร
function resetCallScreen() {
  clearTimeout(autoAnswerTimer);
  clearInterval(callDurationTimer);

  autoAnswerTimer = null;
  callDurationTimer = null;

  phoneCallState = "idle";
  callSeconds = 0;

  ringtone.pause();
  ringtone.currentTime = 0;

  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio.currentTime = 0;
    voiceAudio.muted = false;
  }

  setPhoneStatus("Ready to call");

  document.getElementById("call-timer")
    .textContent = "mobile";

  setPhoneButton("call-start", true);
  setPhoneButton("call-answer", false);
  setPhoneButton("call-end", false);

  document.getElementById("phone-options")
    .classList.add("hidden");

  document.getElementById("phone-keypad")
    .classList.add("hidden");

  document.getElementById("dialed-number")
    .textContent = "";

  document.querySelectorAll(".phone-options button")
    .forEach(button => {
      button.classList.remove("selected");
    });
}

// Mute
function toggleMute(button) {
  button.classList.toggle("selected");

  if (voiceAudio) {
    voiceAudio.muted =
      button.classList.contains("selected");
  }
}

// Speaker — จำลองสถานะปุ่ม
function toggleSpeaker(button) {
  button.classList.toggle("selected");
}

// เปิด Keypad
function showKeypad() {
  document.getElementById("phone-keypad")
    .classList.remove("hidden");
}

// ปิด Keypad
function hideKeypad() {
  document.getElementById("phone-keypad")
    .classList.add("hidden");
}

// กดตัวเลข
function dialNumber(number) {
  document.getElementById("dialed-number")
    .textContent += number;
}

/* ===== INSTAGRAM APP ===== */

const IG_STORAGE_KEY = "my-iphone-instagram-v1";

const igDefaultAvatar =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
    '<rect width="200" height="200" fill="#f6dce9"/>' +
    '<circle cx="100" cy="75" r="34" fill="#d39bb8"/>' +
    '<ellipse cx="100" cy="170" rx="65" ry="55" fill="#d39bb8"/>' +
    '</svg>'
  );

function loadIgData() {
  try {
    const saved = JSON.parse(localStorage.getItem(IG_STORAGE_KEY));
    if (saved && typeof saved === "object") {
      return {
        username: saved.username || "my.lovely.diary",
        name: saved.name || "My little diary ♡",
        bio: saved.bio ?? "♡ little moments, big memories",
        avatar: saved.avatar || igDefaultAvatar,
        posts: Array.isArray(saved.posts) ? saved.posts : [],
        stories: Array.isArray(saved.stories) ? saved.stories : []
      };
    }
  } catch (error) {
    console.warn("Instagram data could not be loaded:", error);
  }

  return {
    username: "my.lovely.diary",
    name: "My little diary ♡",
    bio: "♡ little moments, big memories",
    avatar: igDefaultAvatar,
    posts: [],
    stories: []
  };
}

let igData = loadIgData();
let igNewAvatar = null;
let igNewPostImage = null;
let igNewStoryImage = null;

function persistIgData(nextData) {
  try {
    localStorage.setItem(IG_STORAGE_KEY, JSON.stringify(nextData));
    igData = nextData;
    return true;
  } catch (error) {
    alert("พื้นที่บันทึกข้อมูลเต็ม ลองใช้รูปขนาดเล็กลงนะ");
    return false;
  }
}

function readIgImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Please choose an image."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Cannot read image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Cannot open image."));

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 900;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));

        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };

      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderIg() {
  document.getElementById("ig-header-username").textContent = igData.username;
  document.getElementById("ig-display-name").textContent = igData.name;
  document.getElementById("ig-bio-text").textContent = igData.bio;
  document.getElementById("ig-avatar").src = igData.avatar;
  document.getElementById("ig-post-count").textContent = igData.posts.length;

  const grid = document.getElementById("ig-post-grid");
  grid.replaceChildren();

  if (igData.posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "ig-empty";
    empty.textContent = "No posts yet ♡ Tap + to share a photo";
    grid.appendChild(empty);
  }

igData.posts.forEach((post, index) => {
  const img = document.createElement("img");

  img.src = post.image;
  img.alt = post.caption || "Instagram post";
  img.title = post.caption || "";

  // เมื่อกดรูป ให้เปิดโพสต์ขนาดใหญ่
  img.addEventListener("click", () => {
    openIgPost(index);
  });

  grid.appendChild(img);
});


  const stories = document.getElementById("ig-stories");
  stories.replaceChildren();

  igData.stories.forEach((story, index) => {
    const button = document.createElement("button");
    button.className = "ig-story-item";

    const img = document.createElement("img");
    img.src = story.image;
    img.alt = "Story";

    const label = document.createElement("span");
    label.textContent = index === 0 ? "Your story" : "Story";

    button.append(img, label);
    button.onclick = () => openIgStory(index);
    stories.appendChild(button);
  });
}

function closeIgModal() {
  document.querySelectorAll(".instagram-screen .ig-modal")
    .forEach((modal) => modal.classList.add("hidden"));
}

function openIgProfileEditor() {
  igNewAvatar = null;
  document.getElementById("ig-edit-username").value = igData.username;
  document.getElementById("ig-edit-name").value = igData.name;
  document.getElementById("ig-edit-bio").value = igData.bio;
  document.getElementById("ig-edit-avatar-preview").src = igData.avatar;
  document.getElementById("ig-profile-file").value = "";
  document.getElementById("ig-profile-modal").classList.remove("hidden");
}

async function previewIgAvatar(event) {
  try {
    igNewAvatar = await readIgImage(event.target.files[0]);
    document.getElementById("ig-edit-avatar-preview").src = igNewAvatar;
  } catch (error) {
    alert("ไม่สามารถเปิดรูปนี้ได้");
  }
}

function saveIgProfile() {
  const username = document.getElementById("ig-edit-username").value.trim();
  const name = document.getElementById("ig-edit-name").value.trim();
  const bio = document.getElementById("ig-edit-bio").value;

  if (!username || !name) {
    alert("กรุณาใส่ Username และ Name");
    return;
  }

  const nextData = {
    ...igData,
    username,
    name,
    bio,
    avatar: igNewAvatar || igData.avatar
  };

  if (!persistIgData(nextData)) return;
  closeIgModal();
  renderIg();
}

function openIgPostEditor() {
  igNewPostImage = null;
  document.getElementById("ig-post-file").value = "";
  document.getElementById("ig-post-caption").value = "";
  document.getElementById("ig-post-preview").classList.add("hidden");
  document.getElementById("ig-post-modal").classList.remove("hidden");
}

async function previewIgPost(event) {
  try {
    igNewPostImage = await readIgImage(event.target.files[0]);
    const preview = document.getElementById("ig-post-preview");
    preview.src = igNewPostImage;
    preview.classList.remove("hidden");
  } catch (error) {
    alert("ไม่สามารถเปิดรูปนี้ได้");
  }
}

function saveIgPost() {
  if (!igNewPostImage) {
    alert("เลือกรูปก่อนโพสต์นะ");
    return;
  }

  const caption = document.getElementById("ig-post-caption").value;

  const nextData = {
    ...igData,
    posts: [
      { image: igNewPostImage, caption, createdAt: Date.now() },
      ...igData.posts
    ]
  };

  if (!persistIgData(nextData)) return;
  closeIgModal();
  renderIg();
}

function openIgStoryEditor() {
  igNewStoryImage = null;
  document.getElementById("ig-story-file").value = "";
  document.getElementById("ig-story-preview").classList.add("hidden");
  document.getElementById("ig-story-modal").classList.remove("hidden");
}

async function previewIgStory(event) {
  try {
    igNewStoryImage = await readIgImage(event.target.files[0]);
    const preview = document.getElementById("ig-story-preview");
    preview.src = igNewStoryImage;
    preview.classList.remove("hidden");
  } catch (error) {
    alert("ไม่สามารถเปิดรูปนี้ได้");
  }
}

function saveIgStory() {
  if (!igNewStoryImage) {
    alert("เลือกรูปสตอรี่ก่อนนะ");
    return;
  }

  const nextData = {
    ...igData,
    stories: [
      { image: igNewStoryImage, createdAt: Date.now() },
      ...igData.stories
    ]
  };

  if (!persistIgData(nextData)) return;
  closeIgModal();
  renderIg();
}

function openIgStory(index) {
  const story = igData.stories[index];
  if (!story) return;

  document.getElementById("ig-story-view-image").src = story.image;
  document.getElementById("ig-story-viewer").classList.remove("hidden");
}

function closeIgStory() {
  document.getElementById("ig-story-viewer").classList.add("hidden");
}

renderIg();

/* เปิดแอป Instagram */
function openInstagram() {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("instagram-app").classList.add("active");

  renderIg();
}

/* ===== OPEN INSTAGRAM POST ===== */

function openIgPost(index) {
  const post = igData.posts[index];

  if (!post) return;

  // รูปโพสต์
  document.getElementById("ig-view-image").src = post.image;

  // รูปโปรไฟล์
  document.getElementById("ig-view-avatar").src = igData.avatar;

  // ชื่อบัญชี
  document.getElementById("ig-view-username").textContent = igData.username;
  document.getElementById("ig-caption-username").textContent = igData.username;

  // แคปชัน
  document.getElementById("ig-view-caption").textContent = post.caption || "";

  // แสดงหน้าโพสต์
  document.getElementById("ig-post-viewer").classList.remove("hidden");
}

function closeIgPost() {
  document.getElementById("ig-post-viewer").classList.add("hidden");
}


/* ===== SPOTIFY MUSIC APP V2 ===== */


const spotifySongs = [
  {
    title: "MOYA",
    artist: "Jay Park, LNGSHOT",
    cover: "./images/song1.png",
    file: "./audio/song1.mp3"
  },
  {
    title: "Thingking",
    artist: "RYUL of LNGSHOT, LOUIS of LNGSHOT",
    cover: "./images/song2.JPG",
    file: "./audio/song2.mp3"
  },
  {
    title: "Summer Eyes",
    artist: "OHYUL of LNGSHOT",
    cover: "./images/song3.JPG",
    file: "./audio/song3.mp3"
  }
];


const spotifyAudio = document.getElementById("spotify-audio");
let spotifyIndex = -1;

spotifyAudio.volume = 0.7;

function openMusic() {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("music-app").classList.add("active");
  spotifyRenderSongs();
}

function spotifyRenderSongs() {
  const list = document.getElementById("spotify-song-list");
  list.replaceChildren();

  document.getElementById("spotify-count").textContent =
    spotifySongs.length + " songs";

  spotifySongs.forEach((song, index) => {
    const row = document.createElement("div");
    row.className = "spotify-song";

    const img = document.createElement("img");
    img.src = song.cover;
    img.alt = song.title;

    const info = document.createElement("div");
    info.className = "spotify-song-info";

    const title = document.createElement("strong");
    title.textContent = song.title;

    const artist = document.createElement("span");
    artist.textContent = song.artist;

    info.append(title, artist);
    row.append(img, info);
    row.onclick = () => spotifyPlaySong(index);

    list.appendChild(row);
  });
}

function spotifyPlaySong(index) {
  const song = spotifySongs[index];
  if (!song) return;

  spotifyIndex = index;
  spotifyAudio.src = song.file;

  document.getElementById("spotify-mini-cover").src = song.cover;
  document.getElementById("spotify-mini-title").textContent = song.title;
  document.getElementById("spotify-mini-artist").textContent = song.artist;

  document.getElementById("spotify-cover").src = song.cover;
  document.getElementById("spotify-title").textContent = song.title;
  document.getElementById("spotify-artist").textContent = song.artist;

  document.getElementById("spotify-mini").hidden = false;

  spotifyAudio.play().catch(console.error);
}

function spotifyToggle() {
  if (spotifyIndex < 0) {
    spotifyPlaySong(0);
    return;
  }

  if (spotifyAudio.paused) {
    spotifyAudio.play().catch(console.error);
  } else {
    spotifyAudio.pause();
  }
}

function spotifyNext() {
  spotifyPlaySong((spotifyIndex + 1) % spotifySongs.length);
}

function spotifyPrevious() {
  spotifyPlaySong(
    (spotifyIndex - 1 + spotifySongs.length) % spotifySongs.length
  );
}

function spotifyOpenPlayer() {
  if (spotifyIndex < 0) return;
  document.getElementById("spotify-player").hidden = false;
}

function spotifyClosePlayer() {
  document.getElementById("spotify-player").hidden = true;
}

function spotifySeek(value) {
  if (!Number.isFinite(spotifyAudio.duration)) return;
  spotifyAudio.currentTime =
    Number(value) / 100 * spotifyAudio.duration;
}

function spotifySetVolume(value) {
  spotifyAudio.volume = Number(value);
}

function spotifyFormatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ":" + String(s).padStart(2, "0");
}

spotifyAudio.addEventListener("timeupdate", () => {
  const duration = spotifyAudio.duration;
  const progress =
    Number.isFinite(duration) && duration > 0
      ? spotifyAudio.currentTime / duration * 100
      : 0;

  document.getElementById("spotify-progress").value = progress;
  document.getElementById("spotify-current").textContent =
    spotifyFormatTime(spotifyAudio.currentTime);
});

spotifyAudio.addEventListener("loadedmetadata", () => {
  document.getElementById("spotify-duration").textContent =
    spotifyFormatTime(spotifyAudio.duration);
});

spotifyAudio.addEventListener("play", () => {
  document.getElementById("spotify-main-toggle").textContent = "Ⅱ";
  document.getElementById("spotify-mini-toggle").textContent = "Ⅱ";
});

spotifyAudio.addEventListener("pause", () => {
  document.getElementById("spotify-main-toggle").textContent = "▶";
  document.getElementById("spotify-mini-toggle").textContent = "▶";
});

spotifyAudio.addEventListener("ended", spotifyNext);

spotifyRenderSongs();

function spotifyGoHome() {
  spotifyAudio.pause();
  spotifyClosePlayer();
  goHome();
}

/* ===== PHOTOS APP ===== */

const photos = [
  "./images/photos/photo1.JPG",
  "./images/photos/photo2.JPG",
  "./images/photos/photo3.JPG",
  "./images/photos/photo4.JPG",
  "./images/photos/photo5.JPG",
  "./images/photos/photo6.JPG",
  "./images/photos/photo7.JPG",
  "./images/photos/photo8.JPG"
];

let currentPhotoIndex = 0;
let photoSwipeStartX = 0;


function openPhotos() {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("photos-app").classList.add("active");
  closePhoto();

  const grid = document.getElementById("photos-grid");
  grid.replaceChildren();

  photos.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo;
    img.alt = "Photo";
    img.onclick = () => openPhoto(photo);
    grid.appendChild(img);
  });
}

function openPhoto(photo) {
  currentPhotoIndex = photos.indexOf(photo);

  if (currentPhotoIndex === -1) return;

  showCurrentPhoto();

  document.getElementById("photos-viewer").hidden = false;
}

function showCurrentPhoto() {
  const image = document.getElementById("photos-full-image");

  image.src = photos[currentPhotoIndex];
}

function closePhoto() {
  document.getElementById("photos-viewer").hidden = true;
}

/* ===== PHOTOS SWIPE ===== */

function nextPhoto() {
  if (currentPhotoIndex < photos.length - 1) {
    currentPhotoIndex++;
    showCurrentPhoto();
  }
}

function previousPhoto() {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--;
    showCurrentPhoto();
  }
}

const photosViewer = document.getElementById("photos-viewer");

photosViewer.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;

  photoSwipeStartX = event.clientX;
});

photosViewer.addEventListener("pointerup", (event) => {
  if (event.target.closest("button")) return;

  const swipeDistance = event.clientX - photoSwipeStartX;

  if (swipeDistance < -50) {
    nextPhoto();
  } else if (swipeDistance > 50) {
    previousPhoto();
  }
});

/* ===== LOCK SCREEN SYSTEM ===== */

const iphonePasscode = "180906";
let enteredPasscode = "";

function updateLockClock() {
  const now = new Date();

  document.getElementById("lock-time").textContent =
    now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

  document.getElementById("lock-date").textContent =
    now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
}

function showPasscode() {
  enteredPasscode = "";
  updatePasscodeDots();

  document.getElementById("passcode-error").textContent = "";
  document.getElementById("passcode-screen").hidden = false;
  document.getElementById("unlock-trigger").hidden = true;
}

function pressPasscode(number) {
  if (enteredPasscode.length >= 6) return;

  enteredPasscode += number;
  updatePasscodeDots();

  if (enteredPasscode.length === 6) {
    if (enteredPasscode === iphonePasscode) {
      unlockIphone();
    } else {
      document.getElementById("passcode-error").textContent =
        "Incorrect Passcode";

      enteredPasscode = "";
      updatePasscodeDots();
    }
  }
}

function updatePasscodeDots() {
  document.querySelectorAll("#passcode-dots span")
    .forEach((dot, index) => {
      dot.classList.toggle(
        "filled",
        index < enteredPasscode.length
      );
    });
}

function deletePasscode() {
  enteredPasscode = enteredPasscode.slice(0, -1);
  updatePasscodeDots();
}

function cancelPasscode() {
  enteredPasscode = "";
  updatePasscodeDots();

  document.getElementById("passcode-screen").hidden = true;
  document.getElementById("unlock-trigger").hidden = false;
}

function unlockIphone() {
  document.getElementById("lock-screen").hidden = true;
  enteredPasscode = "";
  goHome();
}

updateLockClock();
setInterval(updateLockClock, 30000);


/* ===== IMESSAGE V2 SYSTEM ===== */

// รายชื่อผู้ติดต่อและบทสนทนา
const messageContacts = [
  {
    id: "favorite",
    name: "권오율♡",
    photo: "./images/contact1.jpg",
    messages: [
      { from: "them", text: "ซื้อชานมมาให้เค้ายัง" },
      { from: "me", text: "อ้วนเอาไร ชานมเผือกมั้ยคับ" },
       { from: "them", text: "เอาาาา" },
      { from: "me", text: "ซื้อมาให้แล้วคับ อยู่ในตู้เย็นนะ" },
      { from: "them", text: "เย้ เค้าได้กินสักที" },
      { from: "me", text: "ไปซ้อมกับลูอีหรอ เค้าคิดถึงอะ" },
       { from: "them", text: "ช่าย ออกมาซ้อม เดี๋ยวกลับและ" },
      { from: "them", text: "คิดถึงบู่บู๋เหมือนกันคับ" }
    ]
  },
  {
    id: "bestie",
    name: "루이",
    photo: "./images/contact2.jpg",
    messages: [
      { from: "them", text: "bro can i borrow your bape shirt?" },
      { from: "me", text: "เออเอาไป" },
      { from: "them", text: "เย้" }
    ]
  },
  {
    id: "mom",
    name: "우진",
    photo: "./images/contact3.jpg",
    messages: [
      { from: "them", text: "พี่ริวขอเล่นเกมหน่อย" }
    ]
  }
];

let activeMessageContact = null;

const messagesChat = document.getElementById("messages-chat");
const messagesForm = document.getElementById("messages-form");
const messagesInput = document.getElementById("messages-input");

// เปิดแอป Messages
function openMessages() {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("messages-app").classList.add("active");
  showMessagesList();
}

// แสดงรายชื่อแชท
function showMessagesList() {
  activeMessageContact = null;

  document.getElementById("messages-list-page").hidden = false;
  document.getElementById("messages-chat-page").hidden = true;

  renderMessageContacts();
}

function renderMessageContacts() {
  const list = document.getElementById("messages-conversations");
  const search = document.getElementById("messages-search-input")
    .value.toLowerCase();

  list.replaceChildren();

  messageContacts
    .filter(contact => contact.name.toLowerCase().includes(search))
    .forEach(contact => {
      const row = document.createElement("button");
      row.className = "conversation-row";

      const img = document.createElement("img");
      img.className = "conversation-avatar";
      img.src = contact.photo;
      img.alt = contact.name;

      const info = document.createElement("div");
      info.className = "conversation-info";

      const name = document.createElement("strong");
      name.textContent = contact.name;

      const preview = document.createElement("span");
      preview.textContent =
        contact.messages.at(-1)?.text || "No messages";

      info.append(name, preview);
      row.append(img, info);

      row.onclick = () => openMessageChat(contact.id);
      list.appendChild(row);
    });
}

// เปิดห้องแชท
function openMessageChat(id) {
  activeMessageContact =
    messageContacts.find(contact => contact.id === id);

  if (!activeMessageContact) return;

  document.getElementById("messages-list-page").hidden = true;
  document.getElementById("messages-chat-page").hidden = false;

  document.getElementById("messages-contact-name").textContent =
    activeMessageContact.name;

  document.getElementById("messages-contact-photo").src =
    activeMessageContact.photo;

  renderMessages();
}

// แสดงข้อความ
function renderMessages() {
  messagesChat.replaceChildren();

  activeMessageContact.messages.forEach(message => {
    const bubble = document.createElement("div");
    bubble.className = "message-bubble " + message.from;
    bubble.textContent = message.text;
    messagesChat.appendChild(bubble);
  });

  messagesChat.scrollTop = messagesChat.scrollHeight;
}

// ตอบกลับอัตโนมัติ
function getContactReply(text, contactId) {
  const message = text.toLowerCase();

  if (contactId === "mom") {
    return "ดูแลตัวเองด้วยนะลูก ❤️";
  }

  if (message.includes("คิดถึง") || message.includes("miss")) {
    return "miss you moreee 🥹💗";
  }

  if (message.includes("รัก") || message.includes("love")) {
    return "love you too ♡";
  }

  if (contactId === "bestie") {
    return "HAHAHA tell me more 😭";
  }

  return "hehe ♡";
}

// ส่งข้อความ
messagesForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!activeMessageContact) return;

  const text = messagesInput.value.trim();
  if (!text) return;

  const contact = activeMessageContact;
  contact.messages.push({ from: "me", text });

  messagesInput.value = "";
  renderMessages();

  // จำห้องแชทที่ต้องตอบ เพื่อไม่ให้ตอบผิดห้อง
  setTimeout(() => {
    contact.messages.push({
      from: "them",
      text: getContactReply(text, contact.id)
    });

    if (activeMessageContact === contact) {
      renderMessages();
    }
  }, 1000);
});

// ค้นหารายชื่อ
document.getElementById("messages-search-input")
  .addEventListener("input", renderMessageContacts);
