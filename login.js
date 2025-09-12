function selectRole(role) {
  // remove active class from all buttons
  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.classList.remove("active-role");
  });

  // add active class to the clicked one
  event.target.classList.add("active-role");

  console.log("Role Selected:", role);
}
 
/*-------------------------- register section -----------------------------------------*/
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
});