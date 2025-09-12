document.addEventListener("DOMContentLoaded", function () {
  const roleSelect = document.getElementById("roleSelect");
  const jobGroup = document.getElementById("jobGroup");
  const employeeIdGroup = document.getElementById("employeeIdGroup");

  // Hide by default
  jobGroup.style.display = "none";
  employeeIdGroup.style.display = "none";

  roleSelect.addEventListener("change", function () {
    if (roleSelect.value === "EMPLOYEE") {
      jobGroup.style.display = "block";
      employeeIdGroup.style.display = "block";
    } else {
      jobGroup.style.display = "none";
      employeeIdGroup.style.display = "none";
    }
  });

  // Fetch Address on button click
  const fetchBtn = document.getElementById("fetchDetails");
  const addressField = document.getElementById("address");

  fetchBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      fetchBtn.textContent = "⏳"; // loading indicator
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data && data.display_name) {
              addressField.value = data.display_name; // ✅ only fill main address
            } else {
              alert("Unable to fetch address.");
            }
          } catch (error) {
            console.error(error);
            alert("Error fetching address.");
          }
          fetchBtn.textContent = "🔍"; // reset button
        },
        () => {
          alert("Location access denied!");
          fetchBtn.textContent = "🔍";
        }
      );
    } else {
      alert("Geolocation not supported in your browser.");
    }
  });
});
