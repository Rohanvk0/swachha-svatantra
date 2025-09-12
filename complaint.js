/*====================
  Dashboard Interactions
====================*/
// Sidebar toggle for mobile
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

let activeCategory = null; // Track which category is currently open

/**
 * Shows or hides the subcategory panel based on the selected card.
 * If the same card is clicked twice, the panel is hidden.
 * @param {string} id - The ID of the subcategory panel to show.
 * @param {HTMLElement} cardEl - The card element that was clicked.
 */
function showSub(id, cardEl) {
  const subs = document.querySelectorAll(".subcategory");
  const cards = document.querySelectorAll(".card");

  // If the same card is clicked again, toggle off
  if (activeCategory === id) {
    subs.forEach(sub => (sub.style.display = "none"));
    cards.forEach(c => c.classList.remove("active-card"));
    activeCategory = null;
    return;
  }

  // Otherwise, hide all and show the new one
  subs.forEach(sub => (sub.style.display = "none"));
  cards.forEach(c => c.classList.remove("active-card"));

  const active = document.getElementById(id);
  if (active) {
    active.style.display = "block";
  }

  cardEl.classList.add("active-card");
  activeCategory = id;
}

// Active menu item highlight (sidebar)
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".menu-item.active")?.classList.remove("active");
    item.classList.add("active");
  });
});


/*====================
  Subcategory → Form Display
====================*/
document.querySelectorAll(".subcategory button").forEach(btn => {
  btn.addEventListener("click", () => {
    const complaintType = btn.getAttribute("data-complaint-type");

    document.querySelector(".main-content").style.display = "none"; // hide dashboard
    document.getElementById("complaint-form").style.display = "block"; // show form
    document.getElementById("thankyou-message").style.display = "none";

    const complaintSelect = document.getElementById("select-complaint");
    if (complaintSelect) {
      complaintSelect.value = complaintType;
    }
  });
});


/*====================
  Form Functionality
====================*/
/**
 * Adds a predefined tag to the reason textarea.
 * @param {string} text - The tag text to add.
 */
function addTag(text) {
  const input = document.getElementById('reason');
  if (input) {
    if (input.value.trim() !== "") {
      input.value += ", " + text;
    } else {
      input.value = text;
    }
  }
}


/*====================
  Photo Button Modal
====================*/
const cameraBtn = document.getElementById('camera-btn');
const photoOptions = document.getElementById('photo-options');
const photoInput = document.getElementById('photo');
const liveBtn = document.getElementById('live-photo-btn');
const uploadBtn = document.getElementById('upload-photo-btn');
const closeModal = document.getElementById('close-modal');

if (cameraBtn && photoOptions && photoInput && liveBtn && uploadBtn && closeModal) {

  // Open modal
  cameraBtn.addEventListener('click', () => {
    photoOptions.style.display = 'block';
  });

  // Close modal
  closeModal.addEventListener('click', () => {
    photoOptions.style.display = 'none';
  });

  // Upload photo
  uploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    photoInput.click();
    photoOptions.style.display = 'none';
  });

  // Live photo using camera
  liveBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.width = 300;
        video.height = 225;

        // Replace modal content with video
        photoOptions.innerHTML = '';
        photoOptions.appendChild(video);

        // Capture button
        const captureBtn = document.createElement('button');
        captureBtn.type = "button"; // ✅ prevents form reload
        captureBtn.textContent = "Capture Photo";
        captureBtn.style.marginTop = "10px";
        photoOptions.appendChild(captureBtn);

        captureBtn.addEventListener('click', (ev) => {
          ev.preventDefault(); // ✅ block accidental submit
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);

          cameraBtn.style.backgroundImage = `url(${canvas.toDataURL()})`;
          cameraBtn.style.backgroundSize = 'cover';
          cameraBtn.style.backgroundPosition = 'center';
          cameraBtn.innerHTML = ''; // remove icon

          // Stop stream and close modal
          stream.getTracks().forEach(track => track.stop());
          photoOptions.style.display = 'none';
        });

      } catch (err) {
        alert("Camera access denied or unavailable.");
        photoOptions.style.display = 'none';
      }
    } else {
      alert("Camera not supported in this browser.");
      photoOptions.style.display = 'none';
    }
  });

  // Show uploaded photo preview
  photoInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        cameraBtn.style.backgroundImage = `url('${e.target.result}')`;
        cameraBtn.style.backgroundSize = 'cover';
        cameraBtn.style.backgroundPosition = 'center';
        cameraBtn.innerHTML = ''; // remove icon
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
}


/*====================
  Form Submission & Reset
====================*/
document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.getElementById("complaint-form");
  const submitBtn = document.getElementById("sub");
  const thankyouMsg = document.getElementById("thankyou-message");

  if (submitBtn && formContainer && thankyouMsg) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Show thank you message and hide form
      thankyouMsg.style.display = "block";
      formContainer.style.display = "none";

      // Reset form and restore dashboard after 5 seconds
      setTimeout(() => {
        thankyouMsg.style.display = "none";
        document.querySelector(".main-content").style.display = "block"; // back to dashboard
        document.querySelectorAll(".subcategory").forEach(sub => sub.style.display = "none"); // hide subs
        document.querySelectorAll(".card").forEach(c => c.classList.remove("active-card")); // reset cards
        formContainer.querySelector('form')?.reset();

        // Reset camera button preview
        cameraBtn.style.backgroundImage = 'none';
        cameraBtn.innerHTML = "<i class='bx bxs-camera'></i>";
      }, 5000);
    });
  }
});
/*====================
  OpenStreetMap + Geolocation
====================*/
document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('map').setView([20.5937, 78.9629], 5); // Default: India

  // ✅ Add OSM tiles properly
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 💡 Adjust map size
  map.invalidateSize();

  // Marker for current location
  const marker = L.marker([20.5937, 78.9629]).addTo(map);

  // Try to get user’s current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        map.setView([lat, lon], 15);
        marker.setLatLng([lat, lon]);

        // Reverse geocoding with Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          document.getElementById("full-address").value = data.display_name || "";
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      },
      (err) => {
        alert("Could not fetch location. Please allow location access.");
        console.error(err);
      }
    );
  } else {
    alert("Geolocation not supported by this browser.");
  }
});
