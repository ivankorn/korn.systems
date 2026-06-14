document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Terminal Simulation ---
  const terminalLines = [
    { text: "curl -s https://korn.systems/status.json", delay: 1000 },
    {
      text: '{\n  "status": "Available",\n  "role": "DevSecOps / Cloud Architect Consultant",\n  "expertise": ["GCP", "AWS", "K8s", "MLOps", "GitOps", "Security"]\n}',
      isOutput: true,
      delay: 1500,
    },
    { text: "ssh ivan@korn.systems", delay: 1000 },
    {
      text: "Last login: Fri Jun 5 23:25:34 2026 from 10.0.8.4\nWelcome, Ivan. Ready to deploy stability.",
      isOutput: true,
      delay: 1200,
    },
    { text: "terraform apply -auto-approve", delay: 1500 },
    {
      text: "google_container_cluster.primary: Refreshing state...\nApply complete! Resources: 18 added, 0 changed, 0 destroyed.",
      isOutput: true,
      delay: 2000,
    },
  ];

  const terminalBody = document.getElementById("terminal-body");
  if (terminalBody) {
    let lineIndex = 0;

    function typeLine() {
      if (lineIndex >= terminalLines.length) return;

      const lineData = terminalLines[lineIndex];
      const lineDiv = document.createElement("div");
      lineDiv.className = "t-line";

      if (lineData.isOutput) {
        lineDiv.className += " t-output";
        // Preserve newlines for output JSON/text
        lineDiv.innerHTML = lineData.text.replace(/\n/g, "<br>");
        terminalBody.appendChild(lineDiv);
        lineIndex++;
        // Scroll terminal to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
        setTimeout(typeLine, lineData.delay);
      } else {
        // Typing effect for command line
        const promptSpan = document.createElement("span");
        promptSpan.className = "t-prompt";
        promptSpan.textContent = "$ ";
        lineDiv.appendChild(promptSpan);

        const textSpan = document.createElement("span");
        lineDiv.appendChild(textSpan);

        const cursor = document.createElement("span");
        cursor.className = "t-cursor";
        lineDiv.appendChild(cursor);

        terminalBody.appendChild(lineDiv);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        let charIndex = 0;
        const text = lineData.text;

        function typeChar() {
          if (charIndex < text.length) {
            textSpan.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 40);
          } else {
            // Finished typing, remove cursor
            cursor.remove();
            lineIndex++;
            setTimeout(typeLine, lineData.delay);
          }
        }

        typeChar();
      }
    }

    // Start terminal typing simulation
    setTimeout(typeLine, 800);
  }

  // --- 2. Interactive DevOps ROI Calculator ---
  const cloudSpendInput = document.getElementById("cloud-spend");
  const teamSizeInput = document.getElementById("team-size");
  const deployFreqInput = document.getElementById("deploy-freq");

  const cloudSpendVal = document.getElementById("cloud-spend-val");
  const teamSizeVal = document.getElementById("team-size-val");

  const annualSavingsEl = document.getElementById("annual-savings");
  const timeSavedEl = document.getElementById("time-saved");
  const speedupFactorEl = document.getElementById("speedup-factor");

  function calculateROI() {
    if (!cloudSpendInput || !teamSizeInput || !deployFreqInput) return;

    const monthlySpend = parseInt(cloudSpendInput.value, 10);
    const teamSize = parseInt(teamSizeInput.value, 10);
    const deployFreq = deployFreqInput.value;

    // Update labels
    cloudSpendVal.textContent = `$${monthlySpend.toLocaleString()}`;
    teamSizeVal.textContent = teamSize;

    // 1. Calculate Cloud Savings (Avg 20% to 35% savings via proper architecture/Karpenter/Snyk)
    let savingsPercentage = 0.25; // baseline 25%
    if (monthlySpend > 50000) savingsPercentage = 0.32; // higher spend, higher optimization opportunities (auto-scaling)
    const annualSavings = Math.round(monthlySpend * 12 * savingsPercentage);

    // 2. Calculate Deploy Time Saved (engineer-hours per month)
    // Deploy overhead per deploy (hrs) based on current manual setup vs automated pipelines
    let hoursPerDeployManual = 2.0;
    let hoursPerDeployAutomated = 0.15; // ~10 minutes

    let deploysPerMonth = 2; // Once a month
    let deploySpeedupFactor = "10x";

    if (deployFreq === "week") {
      deploysPerMonth = 4;
      hoursPerDeployManual = 1.5;
      deploySpeedupFactor = "12x";
    } else if (deployFreq === "day") {
      deploysPerMonth = 20;
      hoursPerDeployManual = 1.0;
      deploySpeedupFactor = "15x";
    } else if (deployFreq === "multiple") {
      deploysPerMonth = 60;
      hoursPerDeployManual = 0.8;
      deploySpeedupFactor = "20x";
    }

    // Manual deploy time: deploys * team size * manual time (usually shared overhead)
    // Let's assume a simplified team impact: deploys * hours * average engineers involved/blocked
    const blockedEngineers = Math.max(1, Math.round(teamSize * 0.3)); // 30% of team blocked or waiting
    const manualHours =
      deploysPerMonth * hoursPerDeployManual * blockedEngineers;
    const automatedHours =
      deploysPerMonth * hoursPerDeployAutomated * blockedEngineers;

    const monthlyHoursSaved = Math.max(
      0,
      Math.round(manualHours - automatedHours),
    );
    const annualHoursSaved = monthlyHoursSaved * 12;

    // Update DOM
    annualSavingsEl.textContent = `$${annualSavings.toLocaleString()}`;
    timeSavedEl.textContent = `${annualHoursSaved.toLocaleString()} hrs`;
    speedupFactorEl.textContent = deploySpeedupFactor;
  }

  // Bind calculator event listeners
  if (cloudSpendInput) {
    cloudSpendInput.addEventListener("input", calculateROI);
    teamSizeInput.addEventListener("input", calculateROI);
    deployFreqInput.addEventListener("change", calculateROI);

    // Initialize calculation
    calculateROI();
  }

  // --- 3. Collapsible Work Experience Timeline ---
  const timelineContents = document.querySelectorAll(".timeline-content");

  timelineContents.forEach((content) => {
    content.addEventListener("click", (e) => {
      // Don't toggle if the user is clicking a link inside the content
      if (e.target.tagName === "A") return;

      const isActive = content.classList.contains("active");

      // Close other active jobs for a cleaner accordion effect (optional, let's do it!)
      timelineContents.forEach((c) => c.classList.remove("active"));

      if (!isActive) {
        content.classList.add("active");
      }
    });
  });

  // Open the first timeline item by default
  if (timelineContents.length > 0) {
    timelineContents[0].classList.add("active");
  }

  // --- 4. Scheduling Calendly Modal ---
  const openModalBtns = document.querySelectorAll(".open-booking");
  const modal = document.getElementById("booking-modal");
  const modalClose = document.getElementById("modal-close");
  const iframeContainer = document.getElementById("booking-iframe-container");

  // Replace this placeholder link with your actual Calendly / Cal.com link
  // e.g. "https://calendly.com/your-username/30min?hide_event_type_details=1&background_color=0f111a&text_color=f8fafc&primary_color=06b6d4"
  const CALENDLY_URL =
    "https://calendly.com/ivan-kornienko/30min?hide_event_type_details=1&background_color=0f111a&text_color=f8fafc&primary_color=06b6d4";

  function openModal(e) {
    e.preventDefault();
    if (!modal) return;

    // Dynamically insert iframe on demand to keep initial load super fast
    if (iframeContainer && !iframeContainer.querySelector("iframe")) {
      const iframe = document.createElement("iframe");
      iframe.src = CALENDLY_URL;
      iframe.setAttribute("width", "100%");
      iframe.setAttribute("height", "100%");
      iframe.setAttribute("frameborder", "0");
      iframeContainer.appendChild(iframe);
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Lock background scrolling
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  openModalBtns.forEach((btn) => btn.addEventListener("click", openModal));
  if (modalClose) modalClose.addEventListener("click", closeModal);

  // Close modal clicking outside the container
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // ESC key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
});
