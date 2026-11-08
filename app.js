/**
 * Main Application Logic for PawPath Adoption Hub
 * Handles interactive tabs, adoption quiz, checklist with localStorage,
 * pet directory filter, sample inquiry modal, and music player UI.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMusicUI();
  initProcessStepper();
  initChecklist();
  initQuiz();
  initPetFilter();
  initFaqAccordion();
  initSmoothScroll();
});

/* ============================================================
   1. MUSIC PLAYER UI INTEGRATION
============================================================ */
function initMusicUI() {
  const music = window.cheerfulMusic;
  const playBtn = document.getElementById("playMusicBtn");
  const floatingToggle = document.getElementById("floatingMusicToggle");
  const trackTitle = document.getElementById("trackTitle");
  const trackMood = document.getElementById("trackMood");
  const nextBtn = document.getElementById("nextTrackBtn");
  const prevBtn = document.getElementById("prevTrackBtn");
  const volumeSlider = document.getElementById("volumeSlider");
  const muteBtn = document.getElementById("muteBtn");
  const visualizerBars = document.querySelectorAll(".eq-bar");
  const heroAudioPrompt = document.getElementById("heroAudioPrompt");

  function updateTrackDisplay(track) {
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackMood) trackMood.textContent = track.mood;
  }

  function updatePlayButtons(isPlaying) {
    const playIcons = document.querySelectorAll(".play-icon");
    const pauseIcons = document.querySelectorAll(".pause-icon");
    const playTexts = document.querySelectorAll(".play-status-text");

    playIcons.forEach(icon => (icon.style.display = isPlaying ? "none" : "inline-block"));
    pauseIcons.forEach(icon => (icon.style.display = isPlaying ? "inline-block" : "none"));
    playTexts.forEach(txt => (txt.textContent = isPlaying ? "Music Playing" : "Play Cheerful Tunes"));

    // Visualizer bounce state
    visualizerBars.forEach(bar => {
      if (isPlaying) {
        bar.classList.add("animating");
      } else {
        bar.classList.remove("animating");
      }
    });

    if (floatingToggle) {
      if (isPlaying) {
        floatingToggle.classList.add("is-playing");
      } else {
        floatingToggle.classList.remove("is-playing");
      }
    }
  }

  // Initial display
  updateTrackDisplay(music.getCurrentTrack());

  // Listeners
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      music.toggle();
    });
  }

  if (floatingToggle) {
    floatingToggle.addEventListener("click", () => {
      music.toggle();
    });
  }

  if (heroAudioPrompt) {
    heroAudioPrompt.addEventListener("click", () => {
      music.play();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => music.nextTrack());
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => music.prevTrack());
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      music.setVolume(parseFloat(e.target.value));
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      const isMuted = music.toggleMute();
      muteBtn.textContent = isMuted ? "🔇" : "🔊";
      muteBtn.setAttribute("aria-label", isMuted ? "Unmute cheerful music" : "Mute cheerful music");
    });
  }

  // Engine callbacks
  music.onStateChange = (isPlaying) => {
    updatePlayButtons(isPlaying);
  };

  music.onTrackChange = (track) => {
    updateTrackDisplay(track);
  };

  music.onBeat = (beatNumber) => {
    // Dynamic height pulse on visualizer bars for live visual audio effect
    visualizerBars.forEach((bar, index) => {
      const heights = [28, 44, 20, 36, 48, 24];
      const randomOffset = Math.sin(beatNumber + index) * 12;
      bar.style.height = `${Math.max(10, heights[index % heights.length] + randomOffset)}px`;
    });
  };
}

/* ============================================================
   2. INTERACTIVE PROCESS STEPPER
============================================================ */
const PROCESS_STEPS_DATA = [
  {
    step: 1,
    title: "Self-Reflection & Lifestyle Match",
    tagline: "Before browsing photos, discover who fits your daily rhythm.",
    color: "#FFB703",
    icon: "🧭",
    timeframe: "1-2 Weeks Before Shelter Visit",
    summary: "Adoption is a 10 to 18-year partnership. Evaluating your home environment, schedule, and financial readiness prevents adoption mismatch.",
    keyActions: [
      "Review your daily schedule: How many hours will your pet be alone each day?",
      "Calculate realistic monthly costs (food, vaccines, preventative meds, pet insurance, emergency fund).",
      "Check housing restrictions (weight limits, pet deposit, breed restrictions, or HOA rules).",
      "Discuss responsibilities with all household members or roommates so everyone is committed."
    ],
    proTip: "💡 Shelter Tip: High-energy dogs need 1-2 hours of vigorous exercise daily. If you prefer quiet evenings, consider a senior pet or adult cat!",
    checklistDoc: "Prepare: Proof of residence, landlord contact info, government photo ID."
  },
  {
    step: 2,
    title: "Browse & The Shelter Meet-and-Greet",
    tagline: "Look beyond looks: let personalities and comfort levels guide you.",
    color: "#FF6B6B",
    icon: "🐾",
    timeframe: "Weekend Shelter or Rescue Visit",
    summary: "Shelters can be loud and stressful for animals. Look for behaviors in a quiet visitation room rather than judging a pet solely behind kennel bars.",
    keyActions: [
      "Bring everyone in the home to the meet-and-greet to observe interactions.",
      "If you have a resident dog, ask the rescue for a supervised dog-to-dog introduction on neutral ground.",
      "Sit quietly on the floor at the pet's eye level and let them approach you on their own terms.",
      "Ask staff about the pet's backstory, feeding routine, medical history, and temperament."
    ],
    proTip: "💡 Shelter Tip: Ask: 'How does this animal react when staff clean the kennel or walk by other animals?' Staff know their true personalities best!",
    checklistDoc: "Prepare: Any current pet vaccine records for safe dog-to-dog greetings."
  },
  {
    step: 3,
    title: "Application & Verification Review",
    tagline: "Rescues want you to succeed — the paperwork protects the animal.",
    color: "#06D6A0",
    icon: "📝",
    timeframe: "24 to 72 Hours Processing",
    summary: "The adoption questionnaire helps rescues match animals with homes where they will thrive for life, not to judge or interrogate you.",
    keyActions: [
      "Fill out the questionnaire honestly — there are no 'trick' questions.",
      "Alert your landlord and personal references in advance so they answer the shelter's call quickly.",
      "If you currently have a veterinarian, call them to authorize releasing vaccine records for your current pets.",
      "Ask about the adoption fee breakdown (most fees cover spay/neuter, rabies vaccine, microchip, and deworming!)."
    ],
    proTip: "💡 Shelter Tip: Having your vet pre-authorized to speak with the rescue can cut review time from days to just a few hours!",
    checklistDoc: "Prepare: 2 personal references, landlord written consent, veterinarian phone number."
  },
  {
    step: 4,
    title: "Preparing the Safe Sanctuary",
    tagline: "Set up the environment before your new friend steps through the door.",
    color: "#118AB2",
    icon: "🏡",
    timeframe: "2 Days Before Pickup",
    summary: "A calm, predictable space helps an anxious newcomer decompress without feeling overwhelmed by an entire new house.",
    keyActions: [
      "Create a designated 'quiet haven' (a calm spare bedroom or partitioned corner with bed, water, and toys).",
      "Pet-proof: Secure electrical cords, poisonous houseplants (lilies, pothos), medications, and trash bins.",
      "Stock food identical to what the shelter fed them to avoid sudden stomach upset during transition.",
      "Purchase a secure, well-fitted harness, collar with temporary ID tag, and sturdy carrier."
    ],
    proTip: "💡 Shelter Tip: Place an unwashed t-shirt with your scent in their bed so they gently familiarize with you while sleeping.",
    checklistDoc: "Prepare: Safe carrier/crate, food/water bowls, transition food, enzymatic cleaner."
  },
  {
    step: 5,
    title: "Welcome Home & The 3-3-3 Rule",
    tagline: "The golden standard for decompression and building lifelong trust.",
    color: "#8338EC",
    icon: "💖",
    timeframe: "First 3 Days, 3 Weeks, 3 Months",
    summary: "Animals experience culture shock when entering a new home. Giving them space and sticking to a calm routine works wonders.",
    keyActions: [
      "First 3 Days: Expect them to be overwhelmed, sleep a lot, or hide. Don't throw parties or invite neighbors over.",
      "First 3 Weeks: They learn your routine, start showing their personality, and may test house boundaries. Maintain gentle consistency.",
      "First 3 Months: Complete security! They understand they are truly home, bonded to your family, and confident.",
      "Schedule a non-emergency wellness exam with your vet within the first 14 days."
    ],
    proTip: "💡 Shelter Tip: Patience is love in action. Let them make the first move for affection. When trust blooms, it lasts forever!",
    checklistDoc: "Prepare: Calm schedule, quiet environment, positive reinforcement treats."
  }
];

function initProcessStepper() {
  const stepButtons = document.querySelectorAll(".process-nav-btn");
  const stepContainer = document.getElementById("stepDetailDisplay");

  function renderStep(stepIndex) {
    const data = PROCESS_STEPS_DATA[stepIndex];
    if (!data || !stepContainer) return;

    stepButtons.forEach((btn, idx) => {
      if (idx === stepIndex) {
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      }
    });

    stepContainer.innerHTML = `
      <div class="step-card" style="border-top-color: ${data.color}">
        <div class="step-header">
          <div class="step-badge" style="background-color: ${data.color}">
            Step ${data.step}
          </div>
          <span class="step-timeframe">${data.timeframe}</span>
        </div>
        
        <h3 class="step-title">${data.icon} ${data.title}</h3>
        <p class="step-tagline">${data.tagline}</p>
        <p class="step-summary">${data.summary}</p>
        
        <div class="step-actions-block">
          <h4 class="step-subheading">Essential Checklist for this Step:</h4>
          <ul class="step-action-list">
            ${data.keyActions.map(act => `<li><span class="action-check">✔</span> ${act}</li>`).join("")}
          </ul>
        </div>

        <div class="step-tips-grid">
          <div class="step-pro-tip">
            ${data.proTip}
          </div>
          <div class="step-docs-tip">
            📄 <strong>Ready Check:</strong> ${data.checklistDoc}
          </div>
        </div>

        <div class="step-navigation-footer">
          ${stepIndex > 0 ? `<button type="button" class="btn btn-outline" id="prevStepBtn">← Step ${stepIndex}: ${PROCESS_STEPS_DATA[stepIndex - 1].title.split("&")[0]}</button>` : `<div></div>`}
          ${stepIndex < PROCESS_STEPS_DATA.length - 1 ? `<button type="button" class="btn btn-primary" id="nextStepBtn">Next: Step ${stepIndex + 2} →</button>` : `<a href="#readinessQuiz" class="btn btn-accent">Take Adoption Readiness Quiz ✨</a>`}
        </div>
      </div>
    `;

    // Hook internal buttons
    const prevBtn = document.getElementById("prevStepBtn");
    const nextBtn = document.getElementById("nextStepBtn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => renderStep(stepIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => renderStep(stepIndex + 1));
    }
  }

  // Hook nav pills
  stepButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => renderStep(index));
  });

  // Initial render
  renderStep(0);
}

/* ============================================================
   3. INTERACTIVE CHECKLIST (WITH LOCALSTORAGE & SOUND)
============================================================ */
function initChecklist() {
  const checkboxes = document.querySelectorAll(".checklist-checkbox");
  const countDisplay = document.getElementById("checkedCount");
  const totalDisplay = document.getElementById("totalCheckCount");
  const progressBar = document.getElementById("checklistProgressBar");
  const statusMsg = document.getElementById("checklistStatusMsg");
  const resetBtn = document.getElementById("resetChecklistBtn");
  const printBtn = document.getElementById("printChecklistBtn");

  const STORAGE_KEY = "pawpath_adoption_checklist_v1";

  // Load saved state
  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    savedState = {};
  }

  const total = checkboxes.length;
  if (totalDisplay) totalDisplay.textContent = total;

  function updateChecklistProgress(triggerSound = false) {
    let checkedCount = 0;
    checkboxes.forEach((cb) => {
      const id = cb.id;
      if (savedState[id]) {
        cb.checked = true;
      }
      if (cb.checked) {
        checkedCount++;
        cb.closest(".checklist-item").classList.add("item-completed");
      } else {
        cb.closest(".checklist-item").classList.remove("item-completed");
      }
    });

    if (countDisplay) countDisplay.textContent = checkedCount;

    const percentage = Math.round((checkedCount / total) * 100);
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      progressBar.setAttribute("aria-valuenow", percentage);
    }

    if (statusMsg) {
      if (checkedCount === 0) {
        statusMsg.textContent = "Start checking off supplies as you prepare!";
      } else if (checkedCount < total) {
        statusMsg.textContent = `${checkedCount} of ${total} supplies secured! You're making wonderful progress! 🌟`;
      } else {
        statusMsg.innerHTML = "🎉 <strong>100% Prepared!</strong> Your home is officially ready for your new best friend!";
        if (triggerSound && window.cheerfulMusic) {
          window.cheerfulMusic.playJoyfulChime();
          fireConfettiBurst();
        }
      }
    }
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", (e) => {
      savedState[e.target.id] = e.target.checked;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      } catch (err) {}

      if (e.target.checked && window.cheerfulMusic) {
        window.cheerfulMusic.playCheckPop();
      }

      updateChecklistProgress(true);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset checklist to empty?")) {
        savedState = {};
        localStorage.removeItem(STORAGE_KEY);
        checkboxes.forEach(cb => (cb.checked = false));
        updateChecklistProgress(false);
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Initial calculation
  updateChecklistProgress(false);
}

/* ============================================================
   4. ADOPTION READINESS QUIZ
============================================================ */
const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "1. How many hours will your pet typically spend alone on an average weekday?",
    options: [
      { text: "Under 4 hours (Someone is usually home or works remotely)", points: 3 },
      { text: "5 to 8 hours (Standard work shift with routine lunch breaks)", points: 2 },
      { text: "9+ hours frequently (Frequent travel or long overtime)", points: 1 }
    ]
  },
  {
    id: "q2",
    question: "2. Have you budgeted for routine care and unexpected emergencies?",
    options: [
      { text: "Yes! Set aside vet fund / pet insurance ($100-$180/month planned)", points: 3 },
      { text: "I have general savings and can comfortably cover routine supplies", points: 2 },
      { text: "Still budgeting and researching real veterinary and food costs", points: 1 }
    ]
  },
  {
    id: "q3",
    question: "3. What is your expectation for the first few weeks of behavior?",
    options: [
      { text: "I expect accidents, nervousness, and will patiently follow the 3-3-3 rule", points: 3 },
      { text: "I hope they adapt quickly, but I have patience and treats ready", points: 2 },
      { text: "I need a fully house-trained pet who behaves immediately from Day 1", points: 1 }
    ]
  },
  {
    id: "q4",
    question: "4. What type of living space and activity level fits your home best?",
    options: [
      { text: "Fenced yard or daily walking routine ready for high/moderate exercise", points: 3 },
      { text: "Cozy apartment or quiet space ideal for an adult cat or calm small pet", points: 3 },
      { text: "Busy shared home, but everyone has agreed on assigned pet duties", points: 2 }
    ]
  }
];

function initQuiz() {
  const quizForm = document.getElementById("adoptionQuizForm");
  const quizResult = document.getElementById("quizResultContainer");
  const questionsList = document.getElementById("quizQuestionsList");

  if (!questionsList) return;

  // Render questions
  questionsList.innerHTML = QUIZ_QUESTIONS.map((q, idx) => `
    <div class="quiz-question-box">
      <h4 class="quiz-q-title">${q.question}</h4>
      <div class="quiz-options">
        ${q.options.map((opt, optIdx) => `
          <label class="quiz-option-label">
            <input type="radio" name="${q.id}" value="${opt.points}" required>
            <span class="quiz-custom-radio"></span>
            <span class="quiz-option-text">${opt.text}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `).join("");

  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(quizForm);
      let totalScore = 0;
      let count = 0;

      for (let entry of formData.entries()) {
        totalScore += parseInt(entry[1], 10);
        count++;
      }

      if (count < QUIZ_QUESTIONS.length) {
        alert("Please answer all questions to see your adoption readiness profile!");
        return;
      }

      displayQuizResult(totalScore);
    });
  }
}

function displayQuizResult(score) {
  const resultContainer = document.getElementById("quizResultContainer");
  if (!resultContainer) return;

  let badge = "";
  let title = "";
  let description = "";
  let color = "";

  if (score >= 10) {
    badge = "🏆 Prepared Pet Champion";
    title = "You are in an exceptional place to welcome a rescue pet!";
    description = "You demonstrate a realistic understanding of time, budget, and decompression. Shelters love adopters with your patience and preparation. Your future companion will be in loving, capable hands!";
    color = "#06D6A0";
  } else if (score >= 7) {
    badge = "🐾 Compassionate Learner";
    title = "You have a loving foundation and are very close to ready!";
    description = "You have warm empathy and great potential. Review our Step 1 lifestyle guide and Step 4 sanctuary tips to iron out your daily routine or budget before your first shelter visit.";
    color = "#FFB703";
  } else {
    badge = "🌱 Thoughtful Explorer";
    title = "Great start! Take a few weeks to prepare your space & routine.";
    description = "Adoption is a big commitment! Consider volunteering at a local shelter, fostering for a weekend, or pet-sitting to get hands-on experience with daily routines before making a 15-year leap.";
    color = "#FF6B6B";
  }

  resultContainer.innerHTML = `
    <div class="quiz-result-card" style="border-left: 8px solid ${color}">
      <div class="quiz-badge" style="background-color: ${color}">${badge}</div>
      <h3 class="quiz-result-title">${title}</h3>
      <p class="quiz-result-desc">${description}</p>
      <div class="quiz-result-actions">
        <a href="#processSection" class="btn btn-primary">Review The 5 Steps</a>
        <a href="#browsePets" class="btn btn-outline">Meet Future Buddies 🐾</a>
      </div>
    </div>
  `;

  resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (window.cheerfulMusic) {
    window.cheerfulMusic.playJoyfulChime();
  }
  fireConfettiBurst();
}

/* ============================================================
   5. SAMPLE PET GALLERY & INQUIRY MODAL
============================================================ */
const PETS_DATA = [
  {
    id: 1,
    name: "Oliver",
    type: "dog",
    breed: "Golden Retriever & Lab Mix",
    age: "2 Years Old",
    gender: "Neutered Male",
    image: "oliver.jpg",
    photoBadge: "🎀 Chubby & Bowtie Ready!",
    colorBadge: "#FFB703",
    tagline: "A lovable, chubby sweetheart rocking his signature red bowtie.",
    description: "Oliver is a plump, happy-go-lucky Golden Retriever mix who proudly wears his favorite red bowtie. He loves belly rubs, sunny garden naps, sniffing every blossom, and greeting everyone with a warm open-mouth smile.",
    traits: ["Bowtie Gentleman 🎀", "Kid Friendly", "Dog Friendly", "Housebroken", "Medium Energy"],
    shelterQuestions: [
      "How is Oliver when meeting unfamiliar dogs on leash?",
      "Does Oliver have experience with cats?",
      "What brand of dry kibble does he thrive on?",
      "Does Oliver like wearing bandanas and bowties on walks?"
    ]
  },
  {
    id: 2,
    name: "Mochi",
    type: "cat",
    breed: "Calico Domestic Shorthair",
    age: "1.5 Years Old",
    gender: "Spayed Female",
    colorBadge: "#FF6B6B",
    tagline: "Professional sunbeam napper and purr machine.",
    description: "Mochi is a calm, affectionate girl who loves head scratches and climbing cat trees. She would love a sunny window perch to watch outdoor birds.",
    traits: ["Lap Cat", "Litterbox Trained", "Quiet Household", "Calm Demeanor"],
    shelterQuestions: [
      "Does Mochi prefer wet or dry food routines?",
      "Has Mochi lived with other peaceful cats?",
      "What type of litter does she prefer?"
    ]
  },
  {
    id: 3,
    name: "Barnaby",
    type: "small",
    breed: "Holland Lop Bunny",
    age: "1 Year Old",
    gender: "Neutered Male",
    colorBadge: "#06D6A0",
    tagline: "Loves crisp romaine lettuce and gentle nose rubs.",
    description: "Barnaby is an indoor free-roam candidate who does delightful 'binkies' when happy. He uses his hay-lined litter box reliably and loves willow balls.",
    traits: ["Indoor Only", "Litter Trained", "Gentle Disposition", "Quiet Friend"],
    shelterQuestions: [
      "What brand of timothy hay is Barnaby used to?",
      "Can Barnaby be paired with a spayed female bunny?",
      "What is his favorite fresh leafy green?"
    ]
  },
  {
    id: 4,
    name: "Bella",
    type: "dog",
    breed: "Beagle & Hound Mix",
    age: "4 Years Old",
    gender: "Spayed Female",
    colorBadge: "#118AB2",
    tagline: "Sniffing champion with soulful eyes and soft ears.",
    description: "Bella is a gentle hound who loves leisurely neighborhood scent walks and curling up in plush dog beds. She would make an amazing companion for quiet weekend hikes.",
    traits: ["Gentle Soul", "Crate Trained", "Good on Leash", "Moderate Energy"],
    shelterQuestions: [
      "Does Bella have any hound recall alerts or prey drive around squirrels?",
      "How does Bella handle car rides?",
      "Is she vocal when left alone for a few hours?"
    ]
  },
  {
    id: 5,
    name: "Jasper & Pip",
    type: "cat",
    breed: "Bonded Pair: Tabby & Tuxedo",
    age: "3 Years Old",
    gender: "Neutered Males",
    colorBadge: "#8338EC",
    tagline: "Double the cuddles! Inseparable brotherly duo.",
    description: "Jasper is confident and adventurous, while Pip is shy and sweet. They groom each other, sleep in an adorable tangled pretzel, and must be adopted together.",
    traits: ["Bonded Pair", "Double Cuddles", "Litter Trained", "Playful"],
    shelterQuestions: [
      "What is their favorite joint interactive toy?",
      "Does Pip gain confidence when Jasper is in the room?",
      "Is there a joint adoption fee discount?"
    ]
  },
  {
    id: 6,
    name: "Penny",
    type: "small",
    breed: "Abyssinian Guinea Pig",
    age: "9 Months Old",
    gender: "Female",
    colorBadge: "#FF9F1C",
    tagline: "Chatty 'wheeker' whenever the fridge door opens!",
    description: "Penny is vibrant, healthy, and loves bell peppers and clean orchard grass. Guinea pigs are social herd animals, so Penny would love to join another friendly female piggie.",
    traits: ["Social Herd Animal", "Vocal Wheeker", "Gentle Handling", "Vegetable Fan"],
    shelterQuestions: [
      "Is Penny ready to be paired with a resident guinea pig?",
      "What vitamin C supplement does she take?",
      "What cage size is recommended for her health?"
    ]
  }
];

function initPetFilter() {
  const filterBtns = document.querySelectorAll(".filter-pill");
  const petGrid = document.getElementById("petsGrid");
  const modal = document.getElementById("petInquiryModal");
  const closeModal = document.getElementById("closeModalBtn");
  const modalBody = document.getElementById("modalBodyContent");

  function renderPets(filter = "all") {
    if (!petGrid) return;
    const filtered = filter === "all" ? PETS_DATA : PETS_DATA.filter(p => p.type === filter);

    petGrid.innerHTML = filtered.map(pet => `
      <div class="pet-card" data-id="${pet.id}">
        <div class="pet-card-header" style="background-color: ${pet.colorBadge}20; border-top: 5px solid ${pet.colorBadge}">
          <span class="pet-type-tag" style="background-color: ${pet.colorBadge}">${pet.type.toUpperCase()}</span>
          <span class="pet-age">${pet.age}</span>
        </div>
        ${pet.image ? `
          <div class="pet-card-photo-wrap">
            <img src="${pet.image}" alt="${pet.name} - chubby dog wearing a bowtie" class="pet-card-photo" loading="lazy">
            ${pet.photoBadge ? `<span class="pet-photo-overlay-tag">${pet.photoBadge}</span>` : ''}
          </div>
        ` : ''}
        <div class="pet-card-body">
          <h3 class="pet-name">${pet.name}</h3>
          <p class="pet-breed">${pet.breed} • ${pet.gender}</p>
          <p class="pet-tagline">“${pet.tagline}”</p>
          <p class="pet-description">${pet.description}</p>
          <div class="pet-trait-pills">
            ${pet.traits.map(t => `<span class="trait-pill">✓ ${t}</span>`).join("")}
          </div>
          <button type="button" class="btn btn-outline btn-sm view-inquiry-btn" data-pet-id="${pet.id}">
            View Adoption Questions 📋
          </button>
        </div>
      </div>
    `).join("");

    // Attach click listeners
    const viewBtns = petGrid.querySelectorAll(".view-inquiry-btn");
    viewBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const petId = parseInt(e.currentTarget.getAttribute("data-pet-id"), 10);
        openPetModal(petId);
      });
    });
  }

  function openPetModal(petId) {
    const pet = PETS_DATA.find(p => p.id === petId);
    if (!pet || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-pet-profile">
        ${pet.image ? `
          <div class="modal-pet-banner">
            <img src="${pet.image}" alt="${pet.name}" class="modal-pet-banner-img">
            <div class="modal-pet-tag-float">🎀 Oliver looking handsome in his bowtie!</div>
          </div>
        ` : ''}
        <div class="modal-pet-header" style="border-left: 6px solid ${pet.colorBadge}">
          <h2>Ask About ${pet.name} 🐾</h2>
          <p><strong>${pet.breed}</strong> • ${pet.age} • ${pet.gender}</p>
        </div>
        <p class="modal-intro">When speaking with shelter counselors or rescue foster parents, asking specific questions helps guarantee a smooth, lifelong match!</p>
        
        <h4 class="modal-subheading">Recommended Questions to Ask for ${pet.name}:</h4>
        <ul class="modal-questions-list">
          ${pet.shelterQuestions.map(q => `<li><span class="q-icon">💬</span> ${q}</li>`).join("")}
        </ul>

        <div class="modal-tip-box">
          ❤️ <strong>Adoption Counselor Tip:</strong> Take notes during your visit! Animals often behave differently in shelter rooms than in foster homes.
        </div>

        <div class="modal-footer-action">
          <button type="button" class="btn btn-primary" id="copyQuestionsBtn">📋 Copy Questions to Clipboard</button>
        </div>
      </div>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    const copyBtn = document.getElementById("copyQuestionsBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const text = pet.shelterQuestions.join("\n- ");
        navigator.clipboard.writeText(`Questions for ${pet.name}:\n- ${text}`).then(() => {
          copyBtn.textContent = "✅ Copied to Clipboard!";
          if (window.cheerfulMusic) window.cheerfulMusic.playCheckPop();
          setTimeout(() => (copyBtn.textContent = "📋 Copy Questions to Clipboard"), 2500);
        });
      });
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const filter = e.currentTarget.getAttribute("data-filter");
      renderPets(filter);
    });
  });

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  // Initial render
  renderPets("all");
}

/* ============================================================
   6. FAQ ACCORDION
============================================================ */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-question");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove("open");
        const btn = other.querySelector(".faq-question");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ============================================================
   7. SMOOTH SCROLL & CONFETTI CELEBRATION
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

function fireConfettiBurst() {
  const colors = ["#FFB703", "#FF6B6B", "#06D6A0", "#118AB2", "#8338EC", "#FFD166"];
  const count = 35;
  const container = document.body;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${Math.random() * 95}vw`;
    el.style.top = `${window.scrollY + 80 + Math.random() * 40}px`;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 2000);
  }
}
