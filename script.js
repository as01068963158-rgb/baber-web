
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYWE9Kqktw_dZ0fL89dWTvRZJES7dKYvI",
  authDomain: "barbar-pro.firebaseapp.com",
  projectId: "barbar-pro",
  storageBucket: "barbar-pro.firebasestorage.app",
  messagingSenderId: "327949995136",
  appId: "1:327949995136:web:1b14984109d257ea4d6a65"
};

// Connect Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("BARBER PRO Firebase Connected!");

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });

  navbar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
    });
  });
}

// Select service
const serviceButtons = document.querySelectorAll(".choose-service");
const serviceSelect = document.getElementById("service");

serviceButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (serviceSelect) {
      serviceSelect.value = button.dataset.service;
    }

    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Set minimum booking date
const dateInput = document.getElementById("bookingDate");

if (dateInput) {
  const today = new Date();
  const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  dateInput.min = localDate;
}

// Check availability
const timeInput = document.getElementById("bookingTime");
const availabilityStatus = document.getElementById("availabilityStatus");

async function checkAvailability() {
  if (!dateInput || !timeInput || !availabilityStatus) return;

  const date = dateInput.value;
  const time = timeInput.value;

  if (!date || !time) {
    availabilityStatus.textContent =
      "اختر التاريخ والساعة لمعرفة التوافر";
    return;
  }

  availabilityStatus.textContent = "جاري التحقق من الموعد...";

  try {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("date", "==", date),
      where("time", "==", time)
    );

    const result = await getDocs(bookingsQuery);

    const occupied = result.docs.some(doc => {
      return doc.data().status === "confirmed";
    });

    availabilityStatus.textContent = occupied
      ? "هذا الموعد محجوز، اختر موعدًا آخر"
      : "الموعد متاح مبدئيًا";
  } catch (error) {
    console.error(error);
    availabilityStatus.textContent =
      "تعذر التحقق من الموعد حاليًا";
  }
}

dateInput?.addEventListener("change", checkAvailability);
timeInput?.addEventListener("change", checkAvailability);

console.log("BARBER PRO is ready!");
