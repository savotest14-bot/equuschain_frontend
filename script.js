/* ─── EQUUSCHAIN GLOBAL INTERACTIVE SCRIPT ──────────────── */

document.addEventListener("DOMContentLoaded", () => {
  // ─── 1. CUSTOM CURSOR TRACKING ─────────────────────────────────
  const cur = document.getElementById("cur");
  let firstMove = true;

  document.addEventListener("mousemove", (e) => {
    if (firstMove) {
      cur.style.opacity = "1";
      firstMove = false;
    }
    // Use translate3d for hardware-accelerated smooth cursor rendering
    cur.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 7}px, 0)`;
  });

  document.addEventListener("mouseleave", () => {
    cur.style.opacity = "0";
    firstMove = true;
  });

  // Cursor hover effects using event delegation
  document.addEventListener("mouseover", (e) => {
    const interactive = e.target.closest(
      "a, button, select, input, textarea, .lang-option, .cb-container, .modal-close",
    );
    if (interactive) {
      document.body.classList.add("cursor-hovering");
    } else {
      document.body.classList.remove("cursor-hovering");
    }
  });

  // ─── 2. STICKY NAVBAR & BACK-TO-TOP SCROLL ACTIONS ─────────────
  const navContainer = document.querySelector(".nav-container");
  const prog = document.getElementById("prog");
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener(
    "scroll",
    () => {
      if (navContainer) {
        if (window.scrollY > 50) {
          navContainer.classList.add("scrolled");
        } else {
          navContainer.classList.remove("scrolled");
        }
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (prog && maxScroll > 0) {
        const progressPercent = (window.scrollY / maxScroll) * 100;
        prog.style.width = `${progressPercent}%`;
      }

      if (backToTopBtn) {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }

        if (maxScroll > 0) {
          const scrollPercent = window.scrollY / maxScroll;
          const progressBar = backToTopBtn.querySelector(".progress-bar");
          if (progressBar) {
            const circumference = 125.66;
            progressBar.style.strokeDashoffset =
              circumference - scrollPercent * circumference;
          }
        }
      }
    },
    { passive: true },
  );

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ─── 3. SCROLL REVEAL (INTERSECTION OBSERVER) ──────────────────
  const observerOptions = {
    threshold: 0.08,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));

  // ─── 4. LANGUAGE SELECTOR EVENT HANDLERS ──────────────
  const langBtn = document.getElementById("langBtn");
  const langDropdown = document.getElementById("langDropdown");

  if (langBtn && langDropdown) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const expanded = langBtn.getAttribute("aria-expanded") === "true";
      langBtn.setAttribute("aria-expanded", !expanded);
      langDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      langBtn.setAttribute("aria-expanded", "false");
      langDropdown.classList.remove("show");
    });
  }

  document.querySelectorAll(".lang-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const lang = opt.getAttribute("data-lang");
      if (lang) {
        switchLanguage(lang);
      }
    });
  });

  // ─── 5. ASSET FILTERING (UNIVERSE OF ASSETS) ───────────────
  const filterButtons = document.querySelectorAll(
    "#panel-marketplace button[data-filter]",
  );
  const assetCards = document.querySelectorAll(
    "#panel-marketplace .asset-card",
  );
  const noAssetsMsg = document.getElementById("marketplace-no-assets");

  if (filterButtons && assetCards) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => {
          b.classList.remove("active");
          b.style.background = "";
          b.style.color = "";
        });

        btn.classList.add("active");
        btn.style.background = "var(--g3)";
        btn.style.color = "var(--eq-blue-dark)";

        const filterValue = btn.getAttribute("data-filter");
        let visibleCount = 0;

        assetCards.forEach((card) => {
          const categories = card.getAttribute("data-category").split(",");
          if (
            filterValue === "All" ||
            categories.some(
              (cat) => cat.trim().toLowerCase() === filterValue.toLowerCase(),
            )
          ) {
            card.style.display = "block";
            visibleCount++;
          } else {
            card.style.display = "none";
          }
        });

        if (noAssetsMsg) {
          noAssetsMsg.style.display = visibleCount === 0 ? "block" : "none";
        }
      });
    });

    const defaultActive = document.querySelector(
      "#panel-marketplace button[data-filter].active",
    );
    if (defaultActive) {
      defaultActive.style.background = "var(--g3)";
      defaultActive.style.color = "var(--eq-blue-dark)";
    }
  }

  // Load stored language or fallback to English
  const storedLang = localStorage.getItem("equuschain_lang") || "en";
  switchLanguage(storedLang);

  // Restore active dashboard panel on load if it exists in the DOM
  const storedPanelId = localStorage.getItem("activeDashboardPanel");
  if (storedPanelId && document.getElementById("panel-" + storedPanelId)) {
    showPanel(storedPanelId);
  }

  // ─── 6. COOKIE CONSENT SYSTEM ───────────────
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptCookies = document.getElementById("acceptCookies");
  const refuseCookies = document.getElementById("refuseCookies");

  if (cookieBanner && acceptCookies && refuseCookies) {
    const consentState = localStorage.getItem("equuschain_cookies_consent");
    if (!consentState) {
      setTimeout(() => {
        cookieBanner.style.display = "block";
      }, 800);
    } else if (consentState === "accepted") {
      window.equuschain_analytics = true;
    }

    acceptCookies.addEventListener("click", () => {
      localStorage.setItem("equuschain_cookies_consent", "accepted");
      window.equuschain_analytics = true;
      cookieBanner.style.transition = "opacity 0.4s ease";
      cookieBanner.style.opacity = "0";
      setTimeout(() => {
        cookieBanner.style.display = "none";
      }, 400);
    });

    refuseCookies.addEventListener("click", () => {
      localStorage.setItem("equuschain_cookies_consent", "refused");
      window.equuschain_analytics = false;
      cookieBanner.style.transition = "opacity 0.4s ease";
      cookieBanner.style.opacity = "0";
      setTimeout(() => {
        cookieBanner.style.display = "none";
      }, 400);
    });
  }

  // Public terms/privacy modals triggers
  const termsModal = document.getElementById("termsModal");
  const privacyModal = document.getElementById("privacyModal");
  const closeTerms = document.getElementById("closeTerms");
  const closePrivacy = document.getElementById("closePrivacy");

  function showModal(modal) {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (termsModal && privacyModal) {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target.closest("#termsLink")) {
        e.preventDefault();
        showModal(termsModal);
      } else if (
        target.closest("#privacyLink") ||
        target.closest("#cookieLearnMore")
      ) {
        e.preventDefault();
        showModal(privacyModal);
      }
    });

    document
      .querySelectorAll(".ft-lnks a, .modal-trigger")
      .forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          const href = trigger.getAttribute("href");
          if (href === "#termsModal") {
            showModal(termsModal);
          } else if (href === "#privacyModal") {
            showModal(privacyModal);
          }
        });
      });

    if (closeTerms) {
      closeTerms.addEventListener("click", () => hideModal(termsModal));
    }
    if (closePrivacy) {
      closePrivacy.addEventListener("click", () => hideModal(privacyModal));
    }

    [termsModal, privacyModal].forEach((modal) => {
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            hideModal(modal);
          }
        });
      }
    });
  }

  // ─── 7. FORM VALIDATION & SUCCESS HANDLER ──────────────────────
  const accessForm = document.getElementById("accessForm");
  const submitBtn = document.getElementById("sub");

  if (accessForm) {
    accessForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!accessForm.checkValidity()) {
        accessForm.reportValidity();
        return;
      }

      const nameVal = document.getElementById("form-name").value;
      const emailVal = document.getElementById("form-email").value;
      const orgVal = document.getElementById("form-org").value;
      const profileVal = document.getElementById("form-profile").value;
      const interestVal = document.getElementById("form-interest").value;
      const noteVal = document.getElementById("form-note").value;
      const newsletterVal = document.getElementById("form-newsletter").checked;

      const payload = {
        name: nameVal,
        email: emailVal,
        organization: orgVal,
        profile: profileVal,
        primaryInterest: interestVal,
        note: noteVal,
        newsletterOptIn: newsletterVal,
        submittedAt: new Date().toISOString(),
      };

      console.log(
        "Submitting Request Payload to EquusChain Registry:",
        payload,
      );

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      fetch("https://api.equuschain.io/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json().catch(() => ({}));
        })
        .then((data) => {
          const parentCol = accessForm.parentElement;

          accessForm.style.transition = "opacity 0.4s ease";
          accessForm.style.opacity = "0";

          setTimeout(() => {
            accessForm.style.display = "none";

            const successDiv = document.createElement("div");
            successDiv.className = "success-message";
            successDiv.style.opacity = "0";
            successDiv.style.transition = "opacity 0.6s ease";

            const currentLang = localStorage.getItem("equuschain_lang") || "en";
            let titleText = "Access Request Accepted";
            let bodyText =
              "Thank you for your inquiry. Our relations desk will review your credentials and contact you directly.";

            if (currentLang === "fr") {
              titleText = "Demande d'accès reçue";
              bodyText =
                "Nous vous remercions pour votre intérêt. Notre bureau des relations examinera vos justificatifs et vous contactera directement.";
            } else if (currentLang === "ar") {
              titleText = "تم استلام طلب الانضمام";
              bodyText =
                "نشكرك على استفسارك. سيقوم مكتب العلاقات لدينا بمراجعة أوراق اعتمادك والتواصل معك مباشرة.";
            } else if (currentLang === "es") {
              titleText = "Solicitud de acceso recibida";
              bodyText =
                "Gracias por su consulta. Nuestra oficina de relaciones revisará sus credenciales y se pondrá en contacto con usted directamente.";
            } else if (currentLang === "de") {
              titleText = "Zugangsanfrage erhalten";
              bodyText =
                "Vielen Dank für Ihre Anfrage. Unser Büro für Kundenbeziehungen wird Ihre Angaben prüfen und sich direkt mit Ihnen in Verbindung setzen.";
            } else if (currentLang === "it") {
              titleText = "Richiesta di accesso ricevuta";
              bodyText =
                "Grazie per la richiesta. Il nostro ufficio relazioni esaminerà le sue credenziali e la contatterà direttamente.";
            } else if (currentLang === "pt") {
              titleText = "Pedido de acesso recebido";
              bodyText =
                "Agradecemos o seu contacto. A nossa equipa de relações avaliará as suas credenciais e entrará em contacto consigo diretamente.";
            } else if (currentLang === "ru") {
              titleText = "Запрос доступа получен";
              bodyText =
                "Благодарим вас за обращение. Наш отдел по связям с клиентами рассмотрит ваши данные и свяжется с вами напрямую.";
            } else if (currentLang === "zh") {
              titleText = "已收到访问申请";
              bodyText =
                "感谢您的咨询。我们的客户服务部门将审核您的资质，并直接与您联系。";
            } else if (currentLang === "hi") {
              titleText = "अनुरोध प्राप्त हुआ";
              bodyText =
                "पूछताछ के लिए धन्यवाद। हमारा डेस्क आपके क्रेडेंशियल्स की समीक्षा करेगा और आपसे सीधे संपर्क करेगा।";
            } else if (currentLang === "ja") {
              titleText = "アクセス申請完了";
              bodyText =
                "申請を受け付けました。担当部門にて資格要件を確認の上、直接ご連絡いたします。";
            }

            successDiv.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px; border: 1px dashed var(--g3); background: rgba(138, 106, 53, 0.05); border-radius: 6px;">
                            <img src="logo_equuschain_fond_bleu.png" alt="Equus Emblem" style="height: 64px; width: auto; margin-bottom: 24px; animation: pulse 2s infinite;">
                            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--g3); margin-bottom: 16px;">${titleText}</h3>
                            <p style="font-size: 15px; color: var(--d); line-height: 1.8; max-width: 420px; margin: 0 auto;">${bodyText}</p>
                        </div>
                    `;

            parentCol.appendChild(successDiv);

            setTimeout(() => {
              successDiv.style.opacity = "1";
            }, 50);
          }, 400);
        })
        .catch((error) => {
          console.error("Error submitting access request:", error);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Request";
          }
          alert("Failed to submit request. Please try again.");
        });
    });
  }

  // Checkbox Label Clicking Fix
  document.querySelectorAll(".cb-container").forEach((container) => {
    container.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        return;
      }
      if (e.target.tagName && e.target.tagName.toLowerCase() === "input") {
        return;
      }
      const checkbox = container.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
        e.preventDefault();
      }
    });
  });

  // Mobile Hamburger Menu Toggle
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

  if (hamburgerBtn && mobileMenuOverlay) {
    hamburgerBtn.addEventListener("click", () => {
      mobileMenuOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });

    const closeMobileMenu = () => {
      mobileMenuOverlay.classList.remove("open");
      document.body.style.overflow = "";
    };

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMobileMenu);
    }

    mobileMenuOverlay.addEventListener("click", (e) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }
});

// ─── TRANSLATION SYSTEM ──────────────────────────────────────────

const translations = {
  en: {
    "nav-about": "Our Approach",
    "nav-assets": "Universe of Assets",
    "nav-services": "Capabilities",
    "nav-contact": "Request Access",
    "nav-contact-btn": "Request Access",
    "hero-title": "The world's<br>finest assets,<br><em>finally</em> liquid.",
    "hero-lead":
      "EquusChain<sup>™</sup> is the modern infrastructure for the ownership, exchange, and liquidity of exceptional real-world and traditional finance assets.",
    "manifesto-tag": "I. Our Conviction",
    "manifesto-body":
      "The world's most enduring assets have always transcended markets and generations. From private enterprises to exceptional real estate, to distinguished bloodstock and fine art, their value extends beyond financial performance alone. <em>EquusChain</em><sup>™</sup> provides the infrastructure to manage, exchange, and unlock liquidity in these assets with the discretion, transparency, and efficiency they deserve.",
    "mf-stat-1-v": "Global",
    "mf-stat-1-l": "Reach",
    "mf-stat-2-v": "Qualified",
    "mf-stat-2-l": "Investors Only",
    "mf-stat-3-v": "Discretion",
    "mf-stat-3-l": "In Everything",
    "mf-stat-4-v": "Proper",
    "mf-stat-4-l": "Documentation",
    "universe-subtitle": "II. Asset Universe",
    "universe-title": "EquusChain Universe of",
    "universe-title-gold": "Exceptional Assets.",
    "universe-lead":
      "An extensive and growing universe. From institutional private markets to the world's most coveted real-world assets. A selection below the full catalogue lives inside the platform.",
    "asset-1-name": "Real Estate & Infrastructure",
    "asset-1-sub": "Prime commercial, residential, and hospitality assets.",
    "asset-2-name": "Private Equity",
    "asset-2-sub": "Funds, co-investments, and direct positions.",
    "asset-3-name": "Private Credit",
    "asset-3-sub": "Senior secured and bespoke credit structures.",
    "asset-4-name": "Agriculture & Commodities",
    "asset-4-sub": "Productive land and commodity-linked instruments.",
    "asset-5-name": "Equestrian & Bloodstock",
    "asset-5-sub": "Thoroughbreds, stud rights, racing programmes.",
    "asset-6-name": "Private Aviation & Maritime",
    "asset-6-sub": "Aircraft, superyachts investment and use rights.",
    "asset-7-name": "Fine Art & Collectibles",
    "asset-7-sub": "Museum-grade works, rare wine, classic automobiles.",
    "asset-8-name": "And considerably more",
    "asset-8-sub": "Precious metals, structured funds, renewable energy…",
    "services-subtitle": "III. Services",
    "services-title": "What the<br>EquusChain Platform<br><em>Enables.</em>",
    "services-lead":
      "Four things. Each designed for a specific kind of relationship with capital. You may need one. You may need all four.",
    "service-1-n": "I",
    "service-1-title": "Invest & Trade",
    "service-1-body":
      "Subscribe to offerings. Manage positions. Receive distributions. One private environment for a portfolio that extends far beyond listed markets.",
    "service-1-link": "Open an account",
    "service-2-n": "II",
    "service-2-title": "Fractional Ownership",
    "service-2-body":
      "Hold interests in assets that would otherwise demand exclusive capital commitment. Real estate, private enterprises, bloodstock, aircraft, and many more; at the size that suits your mandate.",
    "service-2-link": "Enquire",
    "service-3-n": "III",
    "service-3-title": "Bring Assets to Market",
    "service-3-body":
      "You hold the asset. We structure it, document it, and bring it to qualified investors. From your privately held company to a property portfolio or a yacht; the entire process, handled.",
    "service-3-link": "Speak with our team",
    "service-4-n": "IV",
    "service-4-title": "Access & Use Rights",
    "service-4-body":
      "Certain platform assets are available through preferential access arrangements. Aviation, maritime, equestrian. Reserved for members.",
    "service-4-link": "Explore",
    "contact-subtitle": "IV. Access",
    "contact-title": "Request<br><em>Access.</em>",
    "contact-body":
      "Every inquiry is reviewed directly by our team to ensure the quality, relevance, and integrity of the EquusChain ecosystem.",
    "form-name-label": "Full name",
    "form-email-label": "Email address",
    "form-org-label": "Organisation",
    "form-profile-label": "Profile",
    "opt-select-profile": "Select profile…",
    "opt-profile-1": "Investor",
    "opt-profile-2": "Asset Owner",
    "opt-profile-3": "Intermediary",
    "opt-profile-4": "Institution",
    "opt-profile-5": "Advisor",
    "opt-profile-6": "Service Provider",
    "form-interest-label": "Primary Interest",
    "opt-select-interest": "Select interest…",
    "opt-interest-1": "Accessing Opportunities",
    "opt-interest-2": "Listing an Asset",
    "opt-interest-3": "Capital Raising",
    "opt-interest-4": "Secondary Market Transactions",
    "opt-interest-5": "Asset Tokenization",
    "opt-interest-6": "Strategic Partnership",
    "opt-interest-7": "Institutional Access",
    "opt-interest-8": "General Enquiry",
    "form-note-label": "A brief note (optional)",
    "form-newsletter-text":
      "I would like to subscribe to EquusChain's curated newsletter",
    "form-consent-text":
      'I confirm that I have read and agree with the <a href="#termsModal" class="live-link" id="termsLink">Terms &amp; Conditions</a> and <a href="#privacyModal" class="live-link" id="privacyLink">Privacy Policy</a>',
    "form-submit-btn": "Submit Request",
    "form-note-footer":
      "Your enquiry is handled with complete discretion. We do not share details with third parties.",
    "ft-col1-title": "Platform",
    "ft-col1-item1": "Member login",
    "ft-col1-item2": "Universe of Assets",
    "ft-col1-item3": "Bring an asset",
    "ft-col2-title": "Contact",
    "ft-col2-item1": "Investor relations",
    "ft-col2-item2": "Institutional desk",
    "ft-col2-item3": "Legal & compliance",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. All rights reserved. The information contained on this website is provided for informational purposes only and does not constitute investment, legal, tax, or financial advice, nor an offer or solicitation to buy or sell any security, financial instrument, or asset. Access to certain services and opportunities may be restricted based on jurisdiction, investor classification, and applicable laws. Investments involve risk, including the possible loss of capital. Users are responsible for ensuring compliance with the laws and regulations applicable to them.",
    "ft-privacy": "Privacy",
    "ft-terms": "Terms",
    "cookie-title": "We use cookies",
    "cookie-body":
      "We use cookies to improve your experience, analyze site usage, and, if you wish, to offer you personalized content and offers. Some cookies are essential for the site to function (session, security). Other cookies (analytics, marketing, tracking) require your prior consent.",
    "cookie-refuse": "Refuse non-essential cookies",
    "cookie-accept": "Accept non-essential cookies",
    "cookie-link": "Learn more about our cookies",
    "login-platform": "Member Platform",
    "login-signin": "Sign In",
    "login-reqaccess": "Request Access",
    "login-email": "Email Address",
    "login-email-ph": "your@email.com",
    "login-password": "Password",
    "login-password-ph": "••••••••",
    "login-btn": "Access Platform",
    "login-note": "Protected access · All sessions are monitored and encrypted",
    "login-name": "Full Legal Name",
    "login-name-ph": "As per passport",
    "login-profile": "Investor Profile",
    "login-profile-select": "Select your profile",
    "login-profile-1": "Family Office",
    "login-profile-2": "Professional Investor (UHNW)",
    "login-profile-3": "Qualified Investor",
    "login-profile-4": "Institutional / Fund",
    "login-profile-5": "Asset Sponsor / Tokenisation",
    "login-jurisdiction": "Jurisdiction of Residence",
    "login-jurisdiction-ph": "Country",
    "login-submit-btn": "Submit Application",
    "login-register-note":
      "Access is subject to KYC/AML verification and investor eligibility assessment. Our team will be in contact within 24–48 hours.",
    "login-back": "← Return to EquusChain.io",
  },
  fr: {
    "nav-about": "Notre Approche",
    "nav-assets": "Univers des Actifs",
    "nav-services": "Capacités",
    "nav-contact": "Demander l'Accès",
    "nav-contact-btn": "Demander l'Accès",
    "hero-title":
      "Les plus beaux<br>actifs du monde,<br><em>enfin</em> liquides.",
    "hero-lead":
      "EquusChain<sup>™</sup> est l'infrastructure moderne pour la détention, l'échange et la liquidité d'actifs réels exceptionnels et de finance traditionnelle.",
    "manifesto-tag": "I. Notre Conviction",
    "manifesto-body":
      "Les actifs les plus durables au monde ont toujours transcendé les marchés et les générations. Des entreprises privées à l'immobilier exceptionnel, en passant par le pur-sang distingué et l'art de premier ordre, leur valeur va au-delà de la seule performance financière. EquusChain<sup>™</sup> fournit l'infrastructure pour gérer, échanger et débloquer la liquidité de ces actifs avec la discrétion, la transparence et l'efficacité qu'ils méritent.",
    "mf-stat-1-v": "Portée",
    "mf-stat-1-l": "Mondiale",
    "mf-stat-2-v": "Investisseurs",
    "mf-stat-2-l": "Qualifiés Uniquement",
    "mf-stat-3-v": "Discrétion",
    "mf-stat-3-l": "En Tout",
    "mf-stat-4-v": "Documentation",
    "mf-stat-4-l": "Appropriée",
    "universe-subtitle": "II. Univers des Actifs",
    "universe-title": "Univers d'Actifs",
    "universe-title-gold": "Exceptionnels d'EquusChain.",
    "universe-lead":
      "Un univers vaste et en pleine croissance. Des marchés privés institutionnels aux actifs réels les plus convoités du monde. Une sélection ci-dessous le catalogue complet se trouve dans la plateforme.",
    "asset-1-name": "Immobilier & Infrastructure",
    "asset-1-sub": "Actifs commerciaux, résidentiels et hôteliers de premier ordre.",
    
    "asset-2-name": "Private Equity",
    "asset-2-sub": "Fonds, co-investissements et positions directes.",
    "asset-3-name": "Crédit Privé",
    "asset-3-sub": "Crédit senior sécurisé et structures sur mesure.",
    "asset-4-name": "Agriculture & Matières Premières",
    "asset-4-sub":
      "Terres productives et instruments liés aux matières premières.",
    "asset-5-name": "Équitation & Élevage",
    "asset-5-sub": "Pur-sang, droits de saillie, programmes de course.",
    "asset-6-name": "Aviation Privée & Maritime",
    "asset-6-sub": "Avions, superyachts droits d'investissement et d'usage.",
    "asset-7-name": "Beaux-Arts & Objets de Collection",
    "asset-7-sub":
      "Œuvres de qualité muséale, vins rares, automobiles classiques.",
    "asset-8-name": "Et bien plus encore",
    "asset-8-sub": "Métaux précieux, fonds structurés, énergies renouvelables…",
    "services-subtitle": "III. Services",
    "services-title":
      "Ce que la plateforme<br>EquusChain rend<br><em>Possible.</em>",
    "services-lead":
      "Quatre services. Chacun conçu pour une relation spécifique avec le capital. Vous pouvez en avoir besoin d'un. Vous pouvez avoir besoin des quatre.",
    "service-1-n": "I",
    "service-1-title": "Investir & Échanger",
    "service-1-body":
      "Souscrivez aux offres. Gérez vos positions. Recevez les distributions. Un environnement privé unique pour un portefeuille qui s'étend bien au-delà des marchés cotés.",
    "service-1-link": "Ouvrir un compte",
    "service-2-n": "II",
    "service-2-title": "Propriété Fractionnée",
    "service-2-body":
      "Détenez des participations dans des actifs qui exigeraient autrement un engagement de capital exclusif. Immobilier, entreprises privées, élevage, avions, et bien plus encore ; à la taille qui convient à votre mandat.",
    "service-2-link": "S'informer",
    "service-3-n": "III",
    "service-3-title": "Introduire des Actifs sur le Marché",
    "service-3-body":
      "Vous détenez l'actif. Nous le structurons, le documentons et le présentons aux investisseurs qualifiés. De votre entreprise privée à un portefeuille immobilier ou un yacht ; l'intégralité du processus est gérée.",
    "service-3-link": "Parler avec notre équipe",
    "service-4-n": "IV",
    "service-4-title": "Droits d'Accès & d'Usage",
    "service-4-body":
      "Certains actifs de la plateforme sont disponibles via des accords d'accès préférentiels. Aviation, maritime, équestre. Réservé aux membres.",
    "service-4-link": "Explorer",
    "contact-subtitle": "IV. Accès",
    "contact-title": "Demander<br><em>l'Accès.</em>",
    "contact-body":
      "Chaque demande est examinée directement par notre équipe afin de garantir la qualité, la pertinence et l'intégrité de l'écosystème EquusChain.",
    "form-name-label": "Nom complet",
    "form-email-label": "Adresse email",
    "form-org-label": "Organisation",
    "form-profile-label": "Profil",
    "opt-select-profile": "Sélectionnez un profil…",
    "opt-profile-1": "Investisseur",
    "opt-profile-2": "Propriétaire d'actifs",
    "opt-profile-3": "Intermédiaire",
    "opt-profile-4": "Institution",
    "opt-profile-5": "Conseiller",
    "opt-profile-6": "Prestataire de services",
    "form-interest-label": "Intérêt principal",
    "opt-select-interest": "Sélectionnez un intérêt…",
    "opt-interest-1": "Accéder aux opportunités",
    "opt-interest-2": "Inscrire un actif",
    "opt-interest-3": "Levée de fonds",
    "opt-interest-4": "Transactions sur le marché secondaire",
    "opt-interest-5": "Tokenisation d'actifs",
    "opt-interest-6": "Partenariat stratégique",
    "opt-interest-7": "Accès institutionnel",
    "opt-interest-8": "Demande générale",
    "form-note-label": "Une brève note (facultatif)",
    "form-newsletter-text":
      "Je souhaite m'abonner à la newsletter d'EquusChain",
    "form-consent-text":
      'Je confirme avoir lu et accepté les <a href="#termsModal" class="live-link" id="termsLink">Conditions Générales</a> et la <a href="#privacyModal" class="live-link" id="privacyLink">Politique de Confidentialité</a>',
    "form-submit-btn": "Envoyer la demande",
    "form-note-footer":
      "Votre demande est traitée avec une discrétion absolue. Nous ne partageons aucune coordonnée avec des tiers.",
    "ft-col1-title": "Plateforme",
    "ft-col1-item1": "Connexion membre",
    "ft-col1-item2": "Univers des actifs",
    "ft-col1-item3": "Présenter un actif",
    "ft-col2-title": "Contact",
    "ft-col2-item1": "Relations investisseurs",
    "ft-col2-item2": "Bureau institutionnel",
    "ft-col2-item3": "Juridique & conformité",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. Tous droits réservés. Les informations contenues sur ce site Web sont fournies à titre informatif uniquement et ne constituent pas un conseil en investissement, juridique, fiscal ou financier, ni une offre ou une sollicitation d'achat ou de vente de tout titre, instrument financier ou actif. L'accès à certains services et opportunités peut être limité en fonction de la juridiction, de la classification de l'investisseur et des lois applicables. Les investissements comportent des risques, y compris la perte possible de capital.",
    "ft-privacy": "Confidentialité",
    "ft-terms": "Conditions",
    "cookie-title": "Nous utilisons des cookies",
    "cookie-body":
      "Nous utilisons des cookies pour améliorer votre expérience, analyser l'utilisation du site et vous proposer des offres adaptées. Certains cookies sont essentiels pour le fonctionnement (sécurité, session). D'autres cookies nécessitent votre consentement préalable.",
    "cookie-refuse": "Refuser les cookies non essentiels",
    "cookie-accept": "Accepter les cookies non essentiels",
    "cookie-link": "En savoir plus sur nos cookies",
    "login-platform": "Plateforme Membres",
    "login-signin": "Se Connecter",
    "login-reqaccess": "Demander l'Accès",
    "login-email": "Adresse E-mail",
    "login-email-ph": "votre@email.com",
    "login-password": "Mot de Passe",
    "login-password-ph": "••••••••",
    "login-btn": "Accéder à la Plateforme",
    "login-note":
      "Accès sécurisé · Toutes les sessions sont surveillées et chiffrées",
    "login-name": "Nom Légal Complet",
    "login-name-ph": "Tel qu'indiqué sur le passeport",
    "login-profile": "Profil de l'Investisseur",
    "login-profile-select": "Sélectionnez votre profil",
    "login-profile-1": "Family Office",
    "login-profile-2": "Investisseur Professionnel (UHNW)",
    "login-profile-3": "Investisseur Qualifié",
    "login-profile-4": "Institutionnel / Fonds",
    "login-profile-5": "Promoteur d'Actifs / Tokenisation",
    "login-jurisdiction": "Juridiction de Résidence",
    "login-jurisdiction-ph": "Pays",
    "login-submit-btn": "Soumettre la Demande",
    "login-register-note":
      "L'accès est soumis à la vérification KYC/AML et à l'évaluation de l'éligibilité de l'investisseur. Notre équipe vous contactera sous 24 à 48 heures.",
    "login-back": "← Retourner à EquusChain.io",
  },
  ar: {
    "nav-about": "نهجنا",
    "nav-assets": "عالم الأصول",
    "nav-services": "القدرات",
    "nav-contact": "طلب انضمام",
    "nav-contact-btn": "طلب انضمام",
    "hero-title": "أرقى الأصول في العالم،<br>صارت <em>أخيراً</em> سائلة.",
    "hero-lead":
      "إيكوس تشين<sup>™</sup> هي البنية التحتية الحديثة لملكية وتبادل وسيولة الأصول الاستثنائية الحقيقية والمالية التقليدية.",
    "manifesto-tag": "١. قناعتنا",
    "manifesto-body":
      "الأصول الأكثر ديمومة في العالم تجاوزت الأسواق والأجيال دائمًا. من الشركات الخاصة إلى العقارات الاستثنائية، مرورًا بالخيول الأصيلة المرموقة والفنون الجميلة، تتجاوز قيمتها الأداء المالي وحده. توفر إيكوس تشين<sup>™</sup> البنية التحتية لإدارة هذه الأصول وتبادلها وتحرير سيولتها بالسرية والشفافية والكفاءة التي تستحقها.",
    "mf-stat-1-v": "نطاق",
    "mf-stat-1-l": "عالمي",
    "mf-stat-2-v": "مستثمرون",
    "mf-stat-2-l": "مؤهلون فقط",
    "mf-stat-3-v": "سرية تامة",
    "mf-stat-3-l": "في كل شيء",
    "mf-stat-4-v": "وثائق",
    "mf-stat-4-l": "مستوفاة",
    "universe-subtitle": "٢. عالم الأصول",
    "universe-title": "عالم <من إيكوس تشين.",
    "universe-title-gold": "الأصول الاستثنائية EquusChain<sup>™</sup>.",
    "universe-lead":
      "عالم واسع ومتنامي. من الأسواق الخاصة المؤسسية إلى الأصول الحقيقية الأكثر طلباً في العالم. مجموعة مختارة أدناه الكتالوج الكامل متاح داخل المنصة.",
    "asset-1-name": "العقارات والبنية التحتية",
    "asset-1-sub": "عقارات تجارية وسكنية وفنادق متميزة.",
    "asset-2-name": "الملكية الخاصة",
    "asset-2-sub": "الصناديق، والاستثمارات المشتركة، والمراكز المباشرة.",
    "asset-3-name": "الائتمان الخاص",
    "asset-3-sub": "الائتمان المضمون الممتاز وهياكل الائتمان المخصصة.",
    "asset-4-name": "الزراعة والسلع",
    "asset-4-sub": "الأراضي الإنتاجية والأدوات المرتبطة بالسلع.",
    "asset-5-name": "الفروسية وسلالات الخيول",
    "asset-5-sub": "الخيول الأصيلة، حقوق التلقيح، برامج السباقات.",
    "asset-6-name": "الطيران الخاص والملاحة البحرية",
    "asset-6-sub": "الطائرات، اليخوت الفاخرة حقوق الاستثمار والاستخدام.",
    "asset-7-name": "الفنون الجميلة والمقتنيات",
    "asset-7-sub": "أعمال ذات جودة متحفية، نبيذ نادر، سيارات كلاسيكية.",
    "asset-8-name": "وأكثر من ذلك بكثير",
    "asset-8-sub": "المعادن الثمينة، الصناديق المهيكلة، الطاقة المتجددة…",
    "services-subtitle": "٣. الخدمات",
    "services-title": "ما تمكنه منصة<br>إيكوس تشين.",
    "services-lead":
      "أربعة أشياء. تم تصميم كل منها لنوع محدد من العلاقة مع رأس المال. قد تحتاج إلى واحدة. قد تحتاج إلى الأربعة معاً.",
    "service-1-n": "١",
    "service-1-title": "الاستثمار والتداول",
    "service-1-body":
      "الاكتتاب في الطروحات. إدارة المراكز المفتوحة. استقبال التوزيعات. بيئة خاصة واحدة لمحفظة تمتد إلى ما هو أبعد من الأسواق المدرجة.",
    "service-1-link": "افتح حساباً",
    "service-2-n": "٢",
    "service-2-title": "الملكية الجزئية",
    "service-2-body":
      "امتلاك حصص في أصول تتطلب بخلاف ذلك التزاماً مالياً حصرياً ضخماً. العقارات، الشركات الخاصة، الخيول، الطائرات، وغيرها الكثير؛ بالحجم الذي يناسب تفويضك المالي.",
    "service-2-link": "استفسر الآن",
    "service-3-n": "٣",
    "service-3-title": "طرح الأصول في السوق",
    "service-3-body":
      "أنت تملك الأصل. نحن نهيكله، ونوثقه، ونطرحه للمستثمرين المؤهلين. بدءاً من شركتك الخاصة وحتى المحفظة العقارية أو اليخت؛ نتولى العملية بأكملها.",
    "service-3-link": "تحدث مع فريقنا",
    "service-4-n": "٤",
    "service-4-title": "حقوق الوصول والاستخدام",
    "service-4-body":
      "بعض أصول المنصة متاحة من خلال ترتيبات وصول تفضيلية مخصصة للأعضاء. الطيران، الملاحة، الفروسية.",
    "service-4-link": "استكشف",
    "contact-subtitle": "٤. الانضمام",
    "contact-title": "طلب<br><em>الدخول.</em>",
    "contact-body":
      "تتم مراجعة كل استفسار مباشرة من قبل فريقنا لضمان جودة وموثوقية ونزاهة منظومة إيكوس تشين.",
    "form-name-label": "الاسم الكامل",
    "form-email-label": "البريد الإلكتروني",
    "form-org-label": "المؤسسة",
    "form-profile-label": "الملف الشخصي",
    "opt-select-profile": "اختر طبيعة عملك…",
    "opt-profile-1": "مستثمر",
    "opt-profile-2": "مالك أصول",
    "opt-profile-3": "وسيط",
    "opt-profile-4": "مؤسسة مالية",
    "opt-profile-5": "مستشار",
    "opt-profile-6": "مزود خدمات",
    "form-interest-label": "الاهتمام الرئيسي",
    "opt-select-interest": "اختر طبيعة الاستفسار…",
    "opt-interest-1": "الوصول إلى الفرص",
    "opt-interest-2": "إدراج أصل مالي",
    "opt-interest-3": "زيادة رأس المال",
    "opt-interest-4": "معاملات السوق الثانوية",
    "opt-interest-5": "ترميز الأصول",
    "opt-interest-6": "شراكة استراتيجية",
    "opt-interest-7": "دخول مؤسسي",
    "opt-interest-8": "استفسار عام",
    "form-note-label": "ملاحظة قصيرة (اختياري)",
    "form-newsletter-text":
      "أود الاشتراك في النشرة الإخبارية المخصصة لإيكوس تشين",
    "form-consent-text":
      'أؤكد أنني قرأت وأوافق على <a href="#termsModal" class="live-link" id="termsLink">الشروط والأحكام</a> و<a href="#privacyModal" class="live-link" id="privacyLink">سياسة الخصوصية</a>',
    "form-submit-btn": "إرسال الطلب",
    "form-note-footer":
      "يتم التعامل مع استفسارك بسرية تامة. نحن لا نشارك التفاصيل مع أطراف ثالثة.",
    "ft-col1-title": "المنصة",
    "ft-col1-item1": "تسجيل دخول الأعضاء",
    "ft-col1-item2": "عالم الأصول",
    "ft-col1-item3": "إدراج أصل مالي",
    "ft-col2-title": "اتصل بنا",
    "ft-col2-item1": "علاقات المستثمرين",
    "ft-col2-item2": "المكتب المؤسسي",
    "ft-col2-item3": "الشؤون القانونية والامتثال",
    "ft-disclaimer":
      "© ٢٠٢٦ شركة إيكوس تشين المحدودة. جميع الحقوق محفوظة. المعلومات الواردة في هذا الموقع هي لأغراض إعلامية فقط ولا تشكل نصيحة استثمارية أو قانونية أو ضريبية أو مالية، كما لا تمثل عرضاً أو التماساً لشراء أو بيع أي ورقة مالية أو أداة مالية أو أصل. قد يكون الدخول إلى بعض الخدمات مقيداً بناءً على الولاية القضائية وتصنيف المستثمر والقوانين المعمول بها. ينطوي الاستثمار على مخاطر، بما في ذلك احتمال خسارة رأس المال.",
    "ft-privacy": "الخصوصية",
    "ft-terms": "الشروط",
    "cookie-title": "نحن نستخدم الكوكيز",
    "cookie-body":
      "نحن نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل الاستخدام وتقديم محتوى مخصص. بعض ملفات تعريف الارتباط ضرورية لتشغيل الموقع (الأمان والجلسة) بينما تتطلب الملفات الأخرى موافقتك المسبقة.",
    "cookie-refuse": "رفض الملفات غير الضرورية",
    "cookie-accept": "قبول الملفات غير الضرورية",
    "cookie-link": "اعرف المزيد عن ملفات الكوكيز الخاصة بنا",
    "login-platform": "منصة الأعضاء",
    "login-signin": "تسجيل الدخول",
    "login-reqaccess": "طلب انضمام",
    "login-email": "البريد الإلكتروني",
    "login-email-ph": "your@email.com",
    "login-password": "كلمة المرور",
    "login-password-ph": "••••••••",
    "login-btn": "دخول المنصة",
    "login-note": "دخول محمي · جميع الجلسات مراقبة ومثبتة بالتشفير",
    "login-name": "الاسم القانوني الكامل",
    "login-name-ph": "كما هو في جواز السفر",
    "login-profile": "الملف الاستثماري",
    "login-profile-select": "اختر ملفك الاستثماري",
    "login-profile-1": "مكتب عائلي",
    "login-profile-2": "مستثمر محترف (ذو ملاءة مالية فائقة)",
    "login-profile-3": "مستثمر مؤهل",
    "login-profile-4": "مؤسسي / صندوق",
    "login-profile-5": "راعي أصول / ترميز",
    "login-jurisdiction": "بلد الإقامة",
    "login-jurisdiction-ph": "الدولة",
    "login-submit-btn": "إرسال الطلب",
    "login-register-note":
      "يخضع الدخول لإجراءات التحقق من الهوية (KYC/AML) وتقييم أهلية المستثمر. سيتواصل فريقنا معك خلال 24-48 ساعة.",
    "login-back": "← العودة إلى EquusChain.io",
  },
  it: {
    "nav-about": "Il nostro approccio",
    "nav-assets": "Universo degli attivi",
    "nav-services": "Capacità",
    "nav-contact": "Richiedi l'accesso",
    "nav-contact-btn": "Richiedi l'accesso",
    "hero-title": "I migliori attivi<br>al mondo, <em>finalmente</em> liquidi.",
    "hero-lead":
      "EquusChain<sup>™</sup> è l'infrastruttura moderna per la proprietà, lo scambio e la liquidità di attivi reali eccezionali e finanza tradizionale.",
    "manifesto-tag": "I. La nostra convinzione",
    "manifesto-body":
      "Gli asset più duraturi al mondo hanno sempre trascenduto mercati e generazioni. Dalle imprese private agli immobili eccezionali, passando per il purosangue di prestigio e l'arte di alto livello, il loro valore va oltre la semplice performance finanziaria. EquusChain<sup>™</sup> fornisce l'infrastruttura per gestire, scambiare e sbloccare la liquidità di questi asset con la discrezione, la trasparenza e l'efficienza che meritano.",
    "mf-stat-1-v": "Portata",
    "mf-stat-1-l": "Globale",
    "mf-stat-2-v": "Solo Investitori",
    "mf-stat-2-l": "Qualificati",
    "mf-stat-3-v": "Discrezione",
    "mf-stat-3-l": "In Tutto",
    "mf-stat-4-v": "Documentazione",
    "mf-stat-4-l": "Appropriata",
    "universe-subtitle": "II. Universo degli attivi",
    "universe-title": "Universo degli attivi",
    "universe-title-gold": "eccezionali EquusChain.",
    "universe-lead":
      "Un universo ampio e in crescita. Dai mercati privati istituzionali ai beni reali più ambiti al mondo. Di seguito una selezione, il catalogo completo si trova nella plataforma.",
    "asset-1-name": "Immobiliare e Infrastrutture",
    "asset-1-sub": "Immobili commerciali, residenziali e alberghieri di alta gamma.",
    "asset-2-name": "Private Equity",
    "asset-2-sub": "Fondi, co-investimenti e posizioni dirette.",
    "asset-3-name": "Credito Privato",
    "asset-3-sub": "Credito senior garantito e strutture su misura.",
    "asset-4-name": "Agricoltura e Materie Prime",
    "asset-4-sub": "Terreni produttivi e strumenti legati alle materie prime.",
    "asset-5-name": "Equitazione e Allevamento",
    "asset-5-sub": "Purosangue, diritti di monta, programmi di corsa.",
    "asset-6-name": "Aviazione Privata e Navale",
    "asset-6-sub": "Aerei, superyacht investimenti e diritti d'uso.",
    "asset-7-name": "Belle Arti e Collezionismo",
    "asset-7-sub": "Opere museali, vini rari, automobili d'epoca.",
    "asset-8-name": "E molto altro ancora",
    "asset-8-sub": "Metalli preziosi, fondi strutturati, energia rinnovabile…",
    "services-subtitle": "III. Servizi",
    "services-title": "Cosa consente la piattaforma<br>EquusChain.",
    "services-lead":
      "Quattro servizi. Ciascuno progettato per un tipo specifico di relazione con il capitale. Potresti averne bisogno di uno o di tutti e quattro.",
    "service-1-n": "I",
    "service-1-title": "Investire e Scambiare",
    "service-1-body":
      "Sottoscrivi le offerte. Gestisci le posizioni. Ricevi le distribuzioni. Un ambiente privato per un portafoglio che va ben oltre i mercati quotati.",
    "service-1-link": "Apri un conto",
    "service-2-n": "II",
    "service-2-title": "Proprietà Frazionata",
    "service-2-body":
      "Partecipa a beni che altrimenti richiederebbero impegni di capitale esclusivi. Immobiliare, imprese private, allevamenti, aerei ed altro; alla misura adatta al tuo mandato.",
    "service-2-link": "Chiedi informazioni",
    "service-3-n": "III",
    "service-3-title": "Portare beni sul mercato",
    "service-3-body":
      "Tu possiedi il bene. Noi lo strutturiamo, documentiamo e presentiamo a investitori qualificati. Dalla tua azienda privata a un portafoglio immobiliare o un yacht; gestiamo l'intero processo.",
    "service-3-link": "Parla con il nostro team",
    "service-4-n": "IV",
    "service-4-title": "Diritti di accesso e d'uso",
    "service-4-body":
      "Alcuni attivi della piattaforma sono disponibili tramite accordi di accesso preferenziale. Aviazione, nautica, equitazione. Riservato ai membri.",
    "service-4-link": "Esplora",
    "contact-subtitle": "IV. Accesso",
    "contact-title": "Richiedi<br><em>l'Accesso.</em>",
    "contact-body":
      "Ogni richiesta viene esaminata direttamente dal nostro team per garantire la qualità, pertinenza e integrità dell'ecosistema EquusChain.",
    "form-name-label": "Nome completo",
    "form-email-label": "Indirizzo e-mail",
    "form-org-label": "Organizzazione",
    "form-profile-label": "Profilo",
    "opt-select-profile": "Seleziona profilo…",
    "opt-profile-1": "Investitore",
    "opt-profile-2": "Proprietario di asset",
    "opt-profile-3": "Intermediario",
    "opt-profile-4": "Istituzione",
    "opt-profile-5": "Consulente",
    "opt-profile-6": "Fornitore di servizi",
    "form-interest-label": "Interesse principale",
    "opt-select-interest": "Seleziona interesse…",
    "opt-interest-1": "Accedere alle opportunità",
    "opt-interest-2": "Quotare un bene",
    "opt-interest-3": "Raccolta di capitali",
    "opt-interest-4": "Transazioni sul mercato secondario",
    "opt-interest-5": "Tokenizzazione di attivi",
    "opt-interest-6": "Partnership strategica",
    "opt-interest-7": "Accesso istituzionale",
    "opt-interest-8": "Richiesta generale",
    "form-note-label": "Una breve nota (opzionale)",
    "form-newsletter-text": "Desidero iscrivermi alla newsletter di EquusChain",
    "form-consent-text":
      'Confermo di aver letto e accettato i <a href="#termsModal" class="live-link" id="termsLink">Termini e Condizioni</a> e l\'<a href="#privacyModal" class="live-link" id="privacyLink">Informativa sulla Privacy</a>',
    "form-submit-btn": "Invia richiesta",
    "form-note-footer":
      "La tua richiesta è gestita con assoluta discrezione. Non condividiamo i dettagli con terze parti.",
    "ft-col1-title": "Piattaforma",
    "ft-col1-item1": "Login membri",
    "ft-col1-item2": "Universo degli attivi",
    "ft-col1-item3": "Porta un attivo",
    "ft-col2-title": "Contatti",
    "ft-col2-item1": "Relazioni investitori",
    "ft-col2-item2": "Desk istituzionale",
    "ft-col2-item3": "Legale e conformità",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. Tutti i diritti riservati. Le informazioni contenute in questo sito web sono fornite solo a scopo informativo e non costituiscono consulenza finanziaria, legale o fiscale, né un'offerta o una sollecitazione all'acquisto o alla vendita di strumenti finanziari. L'accesso a determinati servizi può essere limitato a seconda della giurisdizione e delle leggi applicabili.",
    "ft-privacy": "Privacy",
    "ft-terms": "Termini",
    "cookie-title": "Utilizziamo i cookie",
    "cookie-body":
      "Utilizziamo i cookie per migliorare l'esperienza, analizzare l'uso del sito e offrire contenuti personalizzati. Alcuni cookie sono essenziali per il funzionamento (sicurezza, sessione). Altri richiedono il tuo preventivo consenso.",
    "cookie-refuse": "Rifiuta i cookie non essenziali",
    "cookie-accept": "Accetta i cookie non essenziali",
    "cookie-link": "Scopri di più sui nostri cookie",
    "login-platform": "Piattaforma Membri",
    "login-signin": "Accedi",
    "login-reqaccess": "Richiedi l'Accesso",
    "login-email": "Indirizzo E-mail",
    "login-email-ph": "tua@email.com",
    "login-password": "Password",
    "login-password-ph": "••••••••",
    "login-btn": "Accedi alla Piattaforma",
    "login-note":
      "Accesso protetto · Tutte le sessioni sono monitorate e crittografate",
    "login-name": "Nome Legale Completo",
    "login-name-ph": "Come sul passaporto",
    "login-profile": "Profilo dell'Investitore",
    "login-profile-select": "Seleziona il tuo profilo",
    "login-profile-1": "Family Office",
    "login-profile-2": "Investitore Professionale (UHNW)",
    "login-profile-3": "Investitore Qualificato",
    "login-profile-4": "Istituzionale / Fondo",
    "login-profile-5": "Sponsor dell'Asset / Tokenizzazione",
    "login-jurisdiction": "Giurisdizione di Residenza",
    "login-jurisdiction-ph": "Paese",
    "login-submit-btn": "Invia Domanda",
    "login-register-note":
      "L'accesso è soggetto a verifica KYC/AML e alla valutazione dell'idoneità dell'investitore. Il nostro team ti contatterà entro 24-48 ore.",
    "login-back": "← Torna a EquusChain.io",
  },
  es: {
    "nav-about": "Nuestro enfoque",
    "nav-assets": "Universo de activos",
    "nav-services": "Capacidades",
    "nav-contact": "Solicitar acceso",
    "nav-contact-btn": "Solicitar acceso",
    "hero-title": "Los mejores activos<br>del mundo, <em>al fin</em> líquidos.",
    "hero-lead":
      "EquusChain<sup>™</sup> es la infraestructura moderna para la propiedad, el intercambio y la liquidez de activos reales excepcionales y finanzas tradicionales.",
    "manifesto-tag": "I. Nuestra Convicción",
    "manifesto-body":
      "Los activos más duraderos del mundo siempre han trascendido mercados y generaciones. Desde empresas privadas hasta propiedades excepcionales, pasando por caballos de sangre pura distinguidos y arte de primer nivel, su valor va más allá del rendimiento financiero por sí solo. EquusChain<sup>™</sup> proporciona la infraestructura para gestionar, intercambiar y desbloquear la liquidez de estos activos con la discreción, transparencia y eficiencia que merecen.",
    "mf-stat-1-v": "Alcance",
    "mf-stat-1-l": "Global",
    "mf-stat-2-v": "Solo Inversores",
    "mf-stat-2-l": "Cualificados",
    "mf-stat-3-v": "Discreción",
    "mf-stat-3-l": "En Todo",
    "mf-stat-4-v": "Documentación",
    "mf-stat-4-l": "Adecuada",
    "universe-subtitle": "II. Universo de activos",
    "universe-title": "Universo de activos",
    "universe-title-gold": "excepcionales de EquusChain.",
    "universe-lead":
      "Un universo amplio y en crecimiento. Desde mercados privados institucionales hasta los activos reales más codiciados del mundo. A continuación una selección, el catálogo completo está dentro de la plataforma.",
    "asset-1-name": "Bienes Raíces e Infraestructura",
    "asset-1-sub": "Activos comerciales, residenciales y hoteleros de primer nivel.",
    "asset-2-name": "Capital Privado",
    "asset-2-sub": "Fondos, coinversiones y posiciones directas.",
    "asset-3-name": "Crédito Privado",
    "asset-3-sub": "Crédito garantizado preferente y estructuras a medida.",
    "asset-4-name": "Agricultura y Materias Primas",
    "asset-4-sub": "Tierras agrícolas productivas e instrumentos vinculados.",
    "asset-5-name": "Equitación y Pura Sangre",
    "asset-5-sub": "Pura sangre, derechos de semental, programas de carreras.",
    "asset-6-name": "Aviación Privada y Marítimo",
    "asset-6-sub": "Aviones, superyates derechos de inversión y uso.",
    "asset-7-name": "Bellas Artes y Coleccionables",
    "asset-7-sub": "Obras de museo, vinos raros, automóviles clásicos.",
    "asset-8-name": "Y considerablemente más",
    "asset-8-sub":
      "Metales preciosos, fondos estructurados, energía renovable…",
    "services-subtitle": "III. Servicios",
    "services-title": "Lo que la plataforma<br>EquusChain permite.",
    "services-lead":
      "Cuatro servicios. Cada uno diseñado para un tipo de relación específica con el capital. Puede necesitar uno o los cuatro.",
    "service-1-n": "I",
    "service-1-title": "Invertir y Negociar",
    "service-1-body":
      "Suscríbase a ofertas. Gestione posiciones. Reciba distribuciones. Un entorno privado único para una cartera que se extiende más allá de los mercados cotizados.",
    "service-1-link": "Abrir una cuenta",
    "service-2-n": "II",
    "service-2-title": "Propiedad Fraccionada",
    "service-2-body":
      "Tenga participaciones en activos que de otro modo requerirían compromisos de capital exclusivo. Bienes raíces, empresas privadas, caballos, aviones, y más; al tamaño que se adapte a su mandato.",
    "service-2-link": "Preguntar",
    "service-3-n": "III",
    "service-3-title": "Introducir activos al mercado",
    "service-3-body":
      "Usted posee el activo. Nosotros lo estructuramos, documentamos e introducimos a inversores cualificados. Desde su empresa privada hasta una cartera inmobiliaria o un yate; todo el proceso gestionado.",
    "service-3-link": "Hable con nuestro equipo",
    "service-4-n": "IV",
    "service-4-title": "Derechos de acceso y uso",
    "service-4-body":
      "Ciertos activos de la plataforma están disponibles a través de acuerdos de acceso preferencial. Aviación, marítimo, ecuestre. Reservado para miembros.",
    "service-4-link": "Explorar",
    "contact-subtitle": "IV. Access",
    "contact-title": "Solicitar<br><em>Acceso.</em>",
    "contact-body":
      "Cada solicitud es revisada directamente por nuestro equipo para asegurar la calidad, relevancia e integridad del ecosistema de EquusChain.",
    "form-name-label": "Nombre completo",
    "form-email-label": "Correo electrónico",
    "form-org-label": "Organización",
    "form-profile-label": "Perfil",
    "opt-select-profile": "Seleccione un perfil…",
    "opt-profile-1": "Inversor",
    "opt-profile-2": "Propietario de activos",
    "opt-profile-3": "Intermediario",
    "opt-profile-4": "Institución",
    "opt-profile-5": "Asesor",
    "opt-profile-6": "Proveedor de servicios",
    "form-interest-label": "Interés principal",
    "opt-select-interest": "Seleccione interés…",
    "opt-interest-1": "Acceder a oportunidades",
    "opt-interest-2": "Registrar un activo",
    "opt-interest-3": "Recaudación de capital",
    "opt-interest-4": "Transacciones del mercado secundario",
    "opt-interest-5": "Tokenización de activos",
    "opt-interest-6": "Alianza estratégica",
    "opt-interest-7": "Acceso institucional",
    "opt-interest-8": "Consulta general",
    "form-note-label": "Nota breve (opcional)",
    "form-newsletter-text":
      "Deseo suscribirme al boletín de noticias de EquusChain",
    "form-consent-text":
      'Confirmo que he leído y acepto los <a href="#termsModal" class="live-link" id="termsLink">Términos y Condiciones</a> y la <a href="#privacyModal" class="live-link" id="privacyLink">Política de Privacidad</a>',
    "form-submit-btn": "Enviar solicitud",
    "form-note-footer":
      "Su solicitud es tratada con absoluta discreción. No compartimos sus datos con terceros.",
    "ft-col1-title": "Plataforma",
    "ft-col1-item1": "Acceso miembros",
    "ft-col1-item2": "Universo de activos",
    "ft-col1-item3": "Traer un activo",
    "ft-col2-title": "Contacto",
    "ft-col2-item1": "Relaciones con inversores",
    "ft-col2-item2": "Mesa institucional",
    "ft-col2-item3": "Legal y cumplimiento",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. Todos los derechos reservados. La información de este sitio web es puramente informativa y no constituye asesoramiento financiero, legal o fiscal, ni una oferta de compra o venta de ningún instrumento financiero o activo.",
    "ft-privacy": "Privacidad",
    "ft-terms": "Términos",
    "cookie-title": "Usamos cookies",
    "cookie-body":
      "Utilizamos cookies para mejorar la experiencia, analizar el uso del sitio y ofrecer contenido personalizado. Algunas cookies son esenciales para el funcionamiento (seguridad, sesión). Otras requieren su consentimiento previo.",
    "cookie-refuse": "Rechazar cookies no esenciales",
    "cookie-accept": "Aceptar cookies no esenciales",
    "cookie-link": "Saber más sobre nuestras cookies",
    "login-platform": "Plataforma de Miembros",
    "login-signin": "Iniciar Sesión",
    "login-reqaccess": "Solicitar Acceso",
    "login-email": "Correo Electrónico",
    "login-email-ph": "tu@email.com",
    "login-password": "Contraseña",
    "login-password-ph": "••••••••",
    "login-btn": "Acceder a la Plataforma",
    "login-note":
      "Acceso protegido · Todas las sesiones están siendo monitoreadas y cifradas",
    "login-name": "Nombre Legal Completo",
    "login-name-ph": "Como figura en el pasaporte",
    "login-profile": "Perfil del Inversor",
    "login-profile-select": "Seleccione su perfil",
    "login-profile-1": "Family Office",
    "login-profile-2": "Inversor Profesional (UHNW)",
    "login-profile-3": "Inversor Cualificado",
    "login-profile-4": "Institucional / Fondo",
    "login-profile-5": "Patrocinador de Activos / Tokenización",
    "login-jurisdiction": "Jurisdicción de Residencia",
    "login-jurisdiction-ph": "País",
    "login-submit-btn": "Enviar Solicitud",
    "login-register-note":
      "El acceso está sujeto a verificación KYC/AML y a la evaluación de elegibilidad del inversor. Nuestro equipo se pondrá en contacto en un plazo de 24 a 48 horas.",
    "login-back": "← Volver a EquusChain.io",
  },
  de: {
    "nav-about": "Unser Ansatz",
    "nav-assets": "Anlageuniversum",
    "nav-services": "Dienstleistungen",
    "nav-contact": "Zugang anfordern",
    "nav-contact-btn": "Zugang anfordern",
    "hero-title": "Die erlesensten Sachwerte,<br><em>endlich</em> liquide.",
    "hero-lead":
      "EquusChain<sup>™</sup> ist die moderne Infrastruktur für Eigentum, Austausch und Liquidität außergewöhnlicher Real-World- und traditioneller Finanzwerte.",
    "manifesto-tag": "I. Unsere Überzeugung",
    "manifesto-body":
      "Die beständigsten Vermögenswerte der Welt haben Märkte und Generationen immer überdauert. Von Privatunternehmen bis hin zu außergewöhnlichen Immobilien, über distinguierte Vollblutpferde und erstklassige Kunst – ihr Wert geht über reine Finanzperformance hinaus. EquusChain<sup>™</sup> bietet die Infrastruktur, um diese Vermögenswerte mit der Diskretion, Transparenz und Effizienz zu verwalten, zu handeln und ihre Liquidität freizusetzen.",
    "mf-stat-1-v": "Globale",
    "mf-stat-1-l": "Reichweite",
    "mf-stat-2-v": "Nur qualifizierte",
    "mf-stat-2-l": "Anleger",
    "mf-stat-3-v": "Diskretion",
    "mf-stat-3-l": "In Allem",
    "mf-stat-4-v": "Ordnungsgemäße",
    "mf-stat-4-l": "Dokumentation",
    "universe-subtitle": "II. Anlageuniversum",
    "universe-title": "außergewöhnlicher Sachwerte.",
    "universe-title-gold": "Das außergewöhnliche EquusChain-Universum.",
    "universe-lead":
      "Ein weitreichendes und wachsendes Universum. Von institutionellen privaten Märkten bis zu den begehrtesten Sachwerten der Welt. Nachfolgend eine Auswahl, das vollständige Portfolio befindet sich auf der Plattform.",
    "asset-1-name": "Immobilien & Infrastruktur",
    "asset-1-sub": "Erstklassige Gewerbe-, Wohn- und Hotelimmobilien.",
    "asset-2-name": "Private Equity",
    "asset-2-sub": "Fonds, Co-Investments und Direktbeteiligungen.",
    "asset-3-name": "Private Debt",
    "asset-3-sub":
      "Erstrangig besicherte Kredite und maßgeschneiderte Kreditstrukturen.",
    "asset-4-name": "Agrarwirtschaft & Rohstoffe",
    "asset-4-sub": "Produktive Landflächen und rohstoffgebundene Instrumente.",
    "asset-5-name": "Pferdesport & Vollblut",
    "asset-5-sub": "Rennpferde, Deckrechte, Rennstallbeteiligungen.",
    "asset-6-name": "Private Aviation & Yachting",
    "asset-6-sub": "Flugzeuge, Superyachten Investition und Nutzungsrechte.",
    "asset-7-name": "Kunst & Sammlerstücke",
    "asset-7-sub": "Museale Kunstwerke, seltene Weine, klassische Automobile.",
    "asset-8-name": "Und vieles mehr",
    "asset-8-sub": "Edelmetalle, strukturierte Fonds, erneuerbare Energien…",
    "services-subtitle": "III. Dienstleistungen",
    "services-title": "Was die EquusChain-Plattform<br>ermöglicht.",
    "services-lead":
      "Vier Säulen. Jede für eine spezifische Beziehung zu Kapital konzipiert. Sie benötigen eventuell eine oder alle vier.",
    "service-1-n": "I",
    "service-1-title": "Investieren & Handeln",
    "service-1-body":
      "Zeichnen Sie Angebote. Verwalten Sie Positionen. Erhalten Sie Ausschüttungen. Eine geschlossene Umgebung für ein Portfolio abseits der Börsenmärkte.",
    "service-1-link": "Konto eröffnen",
    "service-2-n": "II",
    "service-2-title": "Miteigentum (Fractional)",
    "service-2-body":
      "Halten Sie Anteile an Werten, die sonst exklusives Kapital erfordern würden. Immobilien, Unternehmen, Rennpferde, Flugzeuge — in der für Ihr Mandat passenden Größe.",
    "service-2-link": "Anfragen",
    "service-3-n": "III",
    "service-3-title": "Sachwerte auf den Markt bringen",
    "service-3-body":
      "Sie halten das Asset. Wir strukturieren, dokumentieren und vermitteln es an qualifizierte Anleger. Vom Familienunternehmen bis hin zum Immobilienportfolio oder einer Yacht.",
    "service-3-link": "Sprechen Sie mit unserem Team",
    "service-4-n": "IV",
    "service-4-title": "Nutzungs- & Zugangsrechte",
    "service-4-body":
      "Bestimmte Plattform-Assets sind über bevorzugte Nutzungsvereinbarungen zugänglich. Luftfahrt, Schifffahrt, Pferdesport. Reserviert für Mitglieder.",
    "service-4-link": "Erkunden",
    "contact-subtitle": "IV. Zugang",
    "contact-title": "Zugang<br><em>anfordern.</em>",
    "contact-body":
      "Jede Anfrage wird direkt von unserem Team geprüft, um die Qualität, Relevanz und Integrität des EquusChain-Ökosystems zu gewährleisten.",
    "form-name-label": "Vollständiger Name",
    "form-email-label": "E-Mail-Adresse",
    "form-org-label": "Organisation",
    "form-profile-label": "Profil",
    "opt-select-profile": "Profil auswählen…",
    "opt-profile-1": "Investor",
    "opt-profile-2": "Asset-Eigentümer",
    "opt-profile-3": "Vermittler",
    "opt-profile-4": "Institution",
    "opt-profile-5": "Berater",
    "opt-profile-6": "Dienstleister",
    "form-interest-label": "Primäres Interesse",
    "opt-select-interest": "Interesse auswählen…",
    "opt-interest-1": "Zugang zu Gelegenheiten erhalten",
    "opt-interest-2": "Einen Vermögenswert listen",
    "opt-interest-3": "Kapitalbeschaffung",
    "opt-interest-4": "Zweitmarkt-Transaktionen",
    "opt-interest-5": "Asset-Tokenisierung",
    "opt-interest-6": "Strategische Partnerschaft",
    "opt-interest-7": "Institutioneller Zugang",
    "opt-interest-8": "Allgemeine Anfrage",
    "form-note-label": "Kurze Nachricht (optional)",
    "form-newsletter-text":
      "Ich möchte den kuratierten Newsletter von EquusChain abonnieren",
    "form-consent-text":
      'Ich bestätige, dass ich die <a href="#termsModal" class="live-link" id="termsLink">Allgemeinen Geschäftsbedingungen</a> und die <a href="#privacyModal" class="live-link" id="privacyLink">Datenschutzerklärung</a> gelesen habe und ihnen zustimme',
    "form-submit-btn": "Anfrage senden",
    "form-note-footer":
      "Ihre Anfrage wird mit absoluter Diskretion behandelt. Wir geben keine Daten an Dritte weiter.",
    "ft-col1-title": "Plattform",
    "ft-col1-item1": "Mitglieder-Login",
    "ft-col1-item2": "Anlageuniversum",
    "ft-col1-item3": "Asset listen",
    "ft-col2-title": "Kontakt",
    "ft-col2-item1": "Investor Relations",
    "ft-col2-item2": "Institutioneller Desk",
    "ft-col2-item3": "Recht & Compliance",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. Alle Rechte vorbehalten. Die Informationen auf dieser Website dienen ausschließlich Informationszwecken und stellen keine Anlageberatung dar. Investitionen bergen Risiken bis hin zum vollständigen Kapitalverlust.",
    "ft-privacy": "Datenschutz",
    "ft-terms": "Bedingungen",
    "cookie-title": "Wir verwenden Cookies",
    "cookie-body":
      "Wir verwenden Cookies, um Ihre Nutzererfahrung zu verbessern, die Website-Nutzung zu analysieren und Ihnen personalisierte Angebote zu unterbreiten. Einige Cookies sind essenziell, andere erfordern Ihre Zustimmung.",
    "cookie-refuse": "Nicht-essenzielle Cookies ablehnen",
    "cookie-accept": "Nicht-essenzielle Cookies akzeptieren",
    "cookie-link": "Mehr über unsere Cookies erfahren",
    "login-platform": "Mitglieder-Plattform",
    "login-signin": "Anmelden",
    "login-reqaccess": "Zugang Anfordern",
    "login-email": "E-Mail-Adresse",
    "login-email-ph": "ihre@email.de",
    "login-password": "Passwort",
    "login-password-ph": "••••••••",
    "login-btn": "Plattform Betreten",
    "login-note":
      "Geschätzter Zugang · Alle Sitzungen werden überwacht und verschlüsselt",
    "login-name": "Vollständiger Name",
    "login-name-ph": "Wie im Reisepass angegeben",
    "login-profile": "Investorenprofil",
    "login-profile-select": "Wählen Sie Ihr Profil aus",
    "login-profile-1": "Family Office",
    "login-profile-2": "Professioneller Investor (UHNW)",
    "login-profile-3": "Qualifizierter Investor",
    "login-profile-4": "Institutionell / Fonds",
    "login-profile-5": "Asset-Sponsor / Tokenisierung",
    "login-jurisdiction": "Wohnsitzland",
    "login-jurisdiction-ph": "Land",
    "login-submit-btn": "Antrag Einreichen",
    "login-register-note":
      "Der Zugang unterliegt der KYC/AML-Prüfung und der Beurteilung der Anlegereignung. Unser Team wird sich innerhalb von 24–48 Stunden mit Ihnen in Verbindung setzen.",
    "login-back": "← Zurück zu EquusChain.io",
  },
  pt: {
    "nav-about": "Nossa abordagem",
    "nav-assets": "Universo de ativos",
    "nav-services": "Capacidades",
    "nav-contact": "Solicitar acesso",
    "nav-contact-btn": "Solicitar acesso",
    "hero-title": "Os mais finos ativos,<br><em>finalmente</em> líquidos.",
    "hero-lead":
      "EquusChain<sup>™</sup> é a infraestrutura moderna para a propriedade, negociação e liquidez de ativos reais excepcionais e finanças tradicionais.",
    "manifesto-tag": "I. Nossa Convicção",
    "manifesto-body":
      "Os ativos mais duradouros do mundo sempre transcenderam mercados e gerações. Desde empresas privadas até imóveis excepcionais, passando por cavalos de sangue pura distintos e arte de primeira linha, seu valor vai além do desempenho financeiro por si só. EquusChain<sup>™</sup> fornece a infraestrutura para gerenciar, negociar e desbloquear a liquidez desses ativos com a discrição, transparência e eficiência que merecem.",
    "mf-stat-1-v": "Alcance",
    "mf-stat-1-l": "Global",
    "mf-stat-2-v": "Apenas Investidores",
    "mf-stat-2-l": "Qualificados",
    "mf-stat-3-v": "Discrição",
    "mf-stat-3-l": "Em Tudo",
    "mf-stat-4-v": "Documentação",
    "mf-stat-4-l": "Adequada",
    "universe-subtitle": "II. Universo de ativos",
    "universe-title": "Universo de ativos",
    "universe-title-gold": "excepcionais EquusChain.",
    "universe-lead":
      "Um universo amplo e em crescimento. De mercados privados institucionais aos ativos reais mais cobiçados do mundo. Uma seleção abaixo, o catálogo completo está na plataforma.",
    "asset-1-name": "Imobiliário & Infraestrutura",
    "asset-1-sub": "Imóveis comerciais, residenciais e hoteleiros de primeira linha",
    "asset-2-name": "Private Equity",
    "asset-2-sub": "Fundos, coinvestimentos e posições diretas.",
    "asset-3-name": "Crédito Privado",
    "asset-3-sub": "Crédito garantido sénior e estruturas sob medida.",
    "asset-4-name": "Agricultura & Commodities",
    "asset-4-sub": "Terras produtivas e instrumentos vinculados a commodities.",
    "asset-5-name": "Hipismo & Puro-Sangue",
    "asset-5-sub":
      "Cavalos de corrida, direitos de cobertura, programas hípicos.",
    "asset-6-name": "Aviação Privada & Marítimo",
    "asset-6-sub": "Aeronaves, superiates investimento e direitos de uso.",
    "asset-7-name": "Belas Artes & Colecionáveis",
    "asset-7-sub": "Obras dignas de museus, vinhos raros, carros clássicos.",
    "asset-8-name": "E muito mais",
    "asset-8-sub": "Metais preciosos, fundos estruturados, energia renovável…",
    "services-subtitle": "III. Serviços",
    "services-title": "O que a plataforma<br>EquusChain permite.",
    "services-lead":
      "Quatro soluções. Cada uma desenhada para um tipo de relação com o capital. Você pode precisar de uma ou de todas.",
    "service-1-n": "I",
    "service-1-title": "Investir & Negociar",
    "service-1-body":
      "Subscreva ofertas. Gira posições. Receba distribuições. Um ecossistema privado para uma carteira que vai muito além dos mercados cotados em bolsa.",
    "service-1-link": "Abrir uma conta",
    "service-2-n": "II",
    "service-2-title": "Proprietà Frazionata",
    "service-2-body":
      "Detenha frações de ativos que de outra forma exigiriam aportes exclusivos de capital. Imóveis, empresas privadas, cavalos, aviões; no tamanho certo para o seu mandato.",
    "service-2-link": "Consultar",
    "service-3-n": "III",
    "service-3-title": "Trazer ativos ao mercado",
    "service-3-body":
      "Você tem o ativo. Nós o estruturamos, documentamos e apresentamos a investidores qualificados. Da sua empresa privada a um portfólio de imóveis ou iate; todo o processo gerido.",
    "service-3-link": "Fale com nossa equipe",
    "service-4-n": "IV",
    "service-4-title": "Direitos de Acesso & Uso",
    "service-4-body":
      "Certos ativos da plataforma estão disponíveis por acordos de acesso preferencial. Aviação, marítimo, hípico. Reservado a membros.",
    "service-4-link": "Explorar",
    "contact-subtitle": "IV. Acesso",
    "contact-title": "Solicitar<br><em>Acesso.</em>",
    "contact-body":
      "Cada solicitação é revista diretamente pela nossa equipa para assegurar a qualidade, relevância e integridade do ecossistema EquusChain.",
    "form-name-label": "Nome completo",
    "form-email-label": "Endereço de e-mail",
    "form-org-label": "Organização",
    "form-profile-label": "Perfil",
    "opt-select-profile": "Selecionar perfil…",
    "opt-profile-1": "Investidor",
    "opt-profile-2": "Proprietário de ativo",
    "opt-profile-3": "Intermediário",
    "opt-profile-4": "Instituição",
    "opt-profile-5": "Consultor",
    "opt-profile-6": "Prestador de serviços",
    "form-interest-label": "Interesse principal",
    "opt-select-interest": "Selecionar interesse…",
    "opt-interest-1": "Aceder a oportunidades",
    "opt-interest-2": "Listar um ativo",
    "opt-interest-3": "Captação de recursos",
    "opt-interest-4": "Transações de mercado secundário",
    "opt-interest-5": "Tokenização de ativos",
    "opt-interest-6": "Parceria estratégica",
    "opt-interest-7": "Acesso institucional",
    "opt-interest-8": "Consulta geral",
    "form-note-label": "Nota breve (opcional)",
    "form-newsletter-text": "Desejo assinar a newsletter da EquusChain",
    "form-consent-text":
      'Confirmo que li e aceito os <a href="#termsModal" class="live-link" id="termsLink">Termos e Condições</a> e a <a href="#privacyModal" class="live-link" id="privacyLink">Política de Privacidade</a>',
    "form-submit-btn": "Enviar pedido",
    "form-note-footer":
      "O seu pedido é tratado com discrição absoluta. Não partilhamos os seus dados com terceiros.",
    "ft-col1-title": "Plataforma",
    "ft-col1-item1": "Login membros",
    "ft-col1-item2": "Universo de ativos",
    "ft-col1-item3": "Trazer ativo",
    "ft-col2-title": "Contato",
    "ft-col2-item1": "Relações com investidores",
    "ft-col2-item2": "Mesa institucional",
    "ft-col2-item3": "Legal & conformidade",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. Todos os direitos reservados. As informações contidas neste website são fornecidas apenas para fins informativos e não constituem aconselhamento de investimento, jurídico ou fiscal.",
    "ft-privacy": "Privacidade",
    "ft-terms": "Termos",
    "cookie-title": "Usamos cookies",
    "cookie-body":
      "Usamos cookies para melhorar sua experiência, analisar o uso do site e oferecer conteúdo e ofertas personalizadas. Alguns cookies são essenciais, outros requerem consentimento prévio.",
    "cookie-refuse": "Recusar cookies não essenciais",
    "cookie-accept": "Aceitar cookies não essenciais",
    "cookie-link": "Saiba mais sobre os nossos cookies",
    "login-platform": "Plataforma de Membros",
    "login-signin": "Entrar",
    "login-reqaccess": "Solicitar Acesso",
    "login-email": "Endereço de E-mail",
    "login-email-ph": "seu@email.com",
    "login-password": "Senha",
    "login-password-ph": "••••••••",
    "login-btn": "Aceder à Plataforma",
    "login-note":
      "Acesso protegido · Todas as sessões são monitoradas e criptografadas",
    "login-name": "Nome Legal Completo",
    "login-name-ph": "Como consta no passaporte",
    "login-profile": "Perfil do Investidor",
    "login-profile-select": "Selecione o seu perfil",
    "login-profile-1": "Family Office",
    "login-profile-2": "Investidor Profissional (UHNW)",
    "login-profile-3": "Investidor Qualificado",
    "login-profile-4": "Institucional / Fundos",
    "login-profile-5": "Patrocinador do Ativo / Tokenização",
    "login-jurisdiction": "Jurisdição de Residência",
    "login-jurisdiction-ph": "País",
    "login-submit-btn": "Enviar Candidatura",
    "login-register-note":
      "O acesso está sujeito à verificação de KYC/AML e à avaliação de elegibilidade do investidor. A nossa equipa entrará em contacto num prazo de 24–48 horas.",
    "login-back": "← Voltar para EquusChain.io",
  },
  ru: {
    "nav-about": "Наш подход",
    "nav-assets": "Вселенная активов",
    "nav-services": "Возможности",
    "nav-contact": "Запросить доступ",
    "nav-contact-btn": "Запросить доступ",
    "hero-title": "Лучшие мировые активы,<br><em>наконец-то</em> ликвидные.",
    "hero-lead":
      "EquusChain<sup>™</sup> — современная инфраструктура для владения, обмена и обеспечения ликвидности исключительных реальных активов и традиционных финансов.",
    "manifesto-tag": "I. Наше кредо",
    "manifesto-body":
      "Самые ценные активы в мире всегда имели реальную ценность: земля, чистокровные лошади, частные компании, построенные на протяжении десятилетий, или произведения искусства, пережившие свой век. Однако структуры, созданные для владения ими, часто оказываются непрозрачными, неликвидными и недоступными. <em>Мы меняем это</em>.",
    "mf-stat-1-v": "Глобальный",
    "mf-stat-1-l": "Охват",
    "mf-stat-2-v": "Квалифицированные",
    "mf-stat-2-l": "инвесторы",
    "mf-stat-3-v": "Конфиденциальность",
    "mf-stat-3-l": "Во всем",
    "mf-stat-4-v": "Надлежащая",
    "mf-stat-4-l": "Документация",
    "universe-subtitle": "II. Вселенная активов",
    "universe-title": "Вселенная исключительных",
    "universe-title-gold": "активов EquusChain.",
    "universe-lead":
      "Обширная и растущая вселенная. От институциональных частных рынков до самых желанных реальных активов в мире. Краткий перечень ниже, полный каталог доступен на платформе.",
    "asset-1-name": "Недвижимость и инфраструктура",
    "asset-1-sub": "Элитная коммерческая, жилая и гостиничная недвижимость.",
    "asset-2-name": "Прямые инвестиции",
    "asset-2-sub": "Фонды, ко-инвестиции и прямые позиции.",
    "asset-3-name": "Частное кредитование",
    "asset-3-sub":
      "Старший обеспеченный долг и индивидуальные кредитные структуры.",
    "asset-4-name": "Сельское хозяйство и сырье",
    "asset-4-sub":
      "Продуктивные земли и инструменты, связанные с сырьевыми товарами.",
    "asset-5-name": "Конный спорт и коневодство",
    "asset-5-sub": "Чистокровные лошади, племенные права, гоночные программы.",
    "asset-6-name": "Частная авиация и флот",
    "asset-6-sub": "Самолеты, суперяхты инвестиции и права пользования.",
    "asset-7-name": "Искусство и коллекционирование",
    "asset-7-sub":
      "Произведения музейного уровня, редкие вина, классические автомобили.",
    "asset-8-name": "И многое другое",
    "asset-8-sub":
      "Благородные металлы, структурированные фонды, возобновляемая энергия…",
    "services-subtitle": "III. Услуги",
    "services-title": "Что позволяет делать<br>платформа EquusChain.",
    "services-lead":
      "Четыре направления. Каждое создано для особых отношений с капиталом. Вам может потребоваться одно или все четыре.",
    "service-1-n": "I",
    "service-1-title": "Инвестиции и трейдинг",
    "service-1-body":
      "Подписывайтесь на предложения. Управляйте позициями. Получайте распределения прибыли. Единое закрытое пространство для портфеля вне биржевого рынка.",
    "service-1-link": "Открыть счет",
    "service-2-n": "II",
    "service-2-title": "Долевое владение",
    "service-2-body":
      "Владейте долями в активах, которые иначе потребовали бы единоличных крупных инвестиций. Недвижимость, частные компании, коневодство, самолеты; в объемах под ваш мандат.",
    "service-2-link": "Узнать больше",
    "service-3-n": "III",
    "service-3-title": "Вывод активов на рынок",
    "service-3-body":
      "Вы владеете активом. Мы его структурируем, документируем и выводим к квалифицированным инвесторам. От вашей частной компании до пула недвижимости или яхты.",
    "service-3-link": "Связаться с командой",
    "service-4-n": "IV",
    "service-4-title": "Права доступа и использования",
    "service-4-body":
      "Некоторые активы платформы доступны по соглашениям о преференциальном доступе. Авиация, флот, конный спорт. Только для членов клуба.",
    "service-4-link": "Исследовать",
    "contact-subtitle": "IV. Доступ",
    "contact-title": "Запросить<br><em>Доступ.</em>",
    "contact-body":
      "Каждый запрос рассматривается нашей командой напрямую, чтобы гарантировать качество, релевантность и целостность экосистемы EquusChain.",
    "form-name-label": "Полное имя",
    "form-email-label": "Электронная почта",
    "form-org-label": "Организация",
    "form-profile-label": "Профиль",
    "opt-select-profile": "Выберите профиль…",
    "opt-profile-1": "Инвестор",
    "opt-profile-2": "Владелец активов",
    "opt-profile-3": "Посредник",
    "opt-profile-4": "Институт развития",
    "opt-profile-5": "Консультант",
    "opt-profile-6": "Сервис-провайдер",
    "form-interest-label": "Основной интерес",
    "opt-select-interest": "Выберите интерес…",
    "opt-interest-1": "Доступ к возможностям",
    "opt-interest-2": "Размещение актива",
    "opt-interest-3": "Привлечение капитала",
    "opt-interest-4": "Сделки на вторичном рынке",
    "opt-interest-5": "Токенизация активов",
    "opt-interest-6": "Стратегическое партнерство",
    "opt-interest-7": "Институциональный доступ",
    "opt-interest-8": "Общий запрос",
    "form-note-label": "Краткое сообщение (необязательно)",
    "form-newsletter-text":
      "Я хочу подписаться на рассылку новостей EquusChain",
    "form-consent-text":
      'Я подтверждаю, что прочитал и согласен с <a href="#termsModal" class="live-link" id="termsLink">Условиями использования</a> и <a href="#privacyModal" class="live-link" id="privacyLink">Политикой конфиденциальности</a>',
    "form-submit-btn": "Отправить запрос",
    "form-note-footer":
      "Ваш запрос обрабатывается со строгой конфиденциальностью. Мы не передаем данные третьим лицам.",
    "ft-col1-title": "Платформа",
    "ft-col1-item1": "Вход для членов",
    "ft-col1-item2": "Вселенная активов",
    "ft-col1-item3": "Разместить актив",
    "ft-col2-title": "Контакты",
    "ft-col2-item1": "Связи с инвесторами",
    "ft-col2-item2": "Институциональный отдел",
    "ft-col2-item3": "Юридический отдел",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. Все права защищены. Информация на данном веб-сайте носит исключительно ознакомительный характер и не является инвестиционной, юридической или налоговой консультацией.",
    "ft-privacy": "Конфиденциальность",
    "ft-terms": "Правила",
    "cookie-title": "Мы используем файлы cookie",
    "cookie-body":
      "Мы используем файлы cookie для улучшения работы сайта, анализа трафика и показа персонализированных предложений. Некоторые файлы cookie обязательны для безопасности.",
    "cookie-refuse": "Отклонить необязательные файлы cookie",
    "cookie-accept": "Принять необязательные файлы cookie",
    "cookie-link": "Подробнее о файлах cookie",
    "login-platform": "Платформа для Членов",
    "login-signin": "Войти",
    "login-reqaccess": "Запросить Доступ",
    "login-email": "Адрес электронной почты",
    "login-email-ph": "your@email.com",
    "login-password": "Пароль",
    "login-password-ph": "••••••••",
    "login-btn": "Войти на платформу",
    "login-note": "Защищенный доступ · Все сессии отслеживаются и шифруются",
    "login-name": "Полное юридическое имя",
    "login-name-ph": "Как в заграничном паспорте",
    "login-profile": "Профиль инвестора",
    "login-profile-select": "Выберите ваш профиль",
    "login-profile-1": "Семейный офис",
    "login-profile-2": "Профессиональный инвестор (UHNW)",
    "login-profile-3": "Квалифицированный инвестор",
    "login-profile-4": "Институциональный инвестор / Фонд",
    "login-profile-5": "Спонсор активов / Токенизация",
    "login-jurisdiction": "Страна налогового резидентства",
    "login-jurisdiction-ph": "Страна",
    "login-submit-btn": "Отправить заявку",
    "login-register-note":
      "Доступ предоставляется при условии прохождения верификации KYC/AML и оценки статуса инвестора. Наша команда свяжется с вами в течение 24–48 часов.",
    "login-back": "← Вернуться на EquusChain.io",
  },
  zh: {
    "nav-about": "我们的方法",
    "nav-assets": "资产世界",
    "nav-services": "核心功能",
    "nav-contact": "申请访问",
    "nav-contact-btn": "申请访问",
    "hero-title": "全球顶尖资产，<br><em>终迎</em>流动性。",
    "hero-lead":
      "EquusChain<sup>™</sup> 是面向非凡真实世界与传统金融资产的所有权、交易 and 和流动性的现代基础设施。",
    "manifesto-tag": "I. 我们的信念",
    "manifesto-body":
      "世界上最持久的资产总是超越市场和代际。从私人企业到非凡的房地产，再到著名的纯种赛马和顶级艺术品，它们的价值不仅仅在于财务表现本身。EquusChain<sup>™</sup> 提供了管理、交易和释放这些资产流动性的基础设施，并以它们应有的严谨性、透明度和效率。",
    "mf-stat-1-v": "全球",
    "mf-stat-1-l": "覆盖",
    "mf-stat-2-v": "仅限",
    "mf-stat-2-l": "合格投资者",
    "mf-stat-3-v": "绝对保密",
    "mf-stat-3-l": "贯穿始终",
    "mf-stat-4-v": "完善",
    "mf-stat-4-l": "文件记录",
    "universe-subtitle": "II. 资产星系",
    "universe-title": "的庞大宇宙。",
    "universe-title-gold": "非凡 EquusChain",
    "universe-lead":
      "一个广泛且不断成长的宇宙。从机构私募市场到全球最令人向往的实物资产。精选部分见下方，完整目录在平台内部。",
    "asset-1-name": "房地产与基础设施",
    "asset-1-sub": "高端商业、住宅及酒店资产。",
    "asset-2-name": "私募股权",
    "asset-2-sub": "基金、共同投资及直接持有头寸。",
    "asset-3-name": "私募债权",
    "asset-3-sub": "高级担保债权与定制化债权结构。",
    "asset-4-name": "农业与大宗商品",
    "asset-4-sub": "生产性土地与大宗商品挂钩的金融工具。",
    "asset-5-name": "马术与血统马",
    "asset-5-sub": "纯血马、配种权、赛马计划。",
    "asset-6-name": "私人航空与航海",
    "asset-6-sub": "私人飞机、超级游艇 投资与使用权。",
    "asset-7-name": "美术与收藏品",
    "asset-7-sub": "博物馆级艺术品、珍稀名酒、经典名车。",
    "asset-8-name": "以及更多资产",
    "asset-8-sub": "贵金属、结构化基金、可再生能源等…",
    "services-subtitle": "III. 平台服务",
    "services-title": "EquusChain 平台<br>所赋能的维度。",
    "services-lead":
      "四大维度。每一个都专为特定的资本关系而设计。您可能需要其中一个，也可能需要全部。",
    "service-1-n": "I",
    "service-1-title": "投资与交易",
    "service-1-body":
      "认购份额。管理仓位。获取分配收益。在一个私密环境内管理远超上市公开市场的投资组合。",
    "service-1-link": "开立账户",
    "service-2-n": "II",
    "service-2-title": "碎片化所有权",
    "service-2-body":
      "持有原本需要大额独占资本的资产权益。房地产、私营企业、血统马匹、航空器等；以契合您的投资授权的规模进行配置。",
    "service-2-link": "业务咨询",
    "service-3-n": "III",
    "service-3-title": "资产推向市场",
    "service-3-body":
      "您持有资产，我们来进行结构设计、文件编制并引荐给合格投资者。从私营公司到地产组合或游艇，全流程托付。",
    "service-3-link": "联系我们的团队",
    "service-4-n": "IV",
    "service-4-title": "特权访问与使用权",
    "service-4-body":
      "平台内的特定资产可通过优先协议访问。航空、航海、马术。专为会员保留。",
    "service-4-link": "立即探索",
    "contact-subtitle": "IV. 访问",
    "contact-title": "申请<br><em>访问。</em>",
    "contact-body":
      "我们团队会直接审核每一份申请，以维护 EquusChain 生态系统的品质、关联度与完整性。",
    "form-name-label": "姓名",
    "form-email-label": "邮箱地址",
    "form-org-label": "机构/家族办公室",
    "form-profile-label": "身份画像",
    "opt-select-profile": "请选择您的身份…",
    "opt-profile-1": "投资者",
    "opt-profile-2": "资产持有人",
    "opt-profile-3": "中介机构",
    "opt-profile-4": "金融机构",
    "opt-profile-5": "顾问",
    "opt-profile-6": "服务商",
    "form-interest-label": "首要意向",
    "opt-select-interest": "请选择意向…",
    "opt-interest-1": "获取投资机会",
    "opt-interest-2": "上架资产",
    "opt-interest-3": "资本筹集",
    "opt-interest-4": "二级市场交易",
    "opt-interest-5": "资产代币化",
    "opt-interest-6": "战略合作",
    "opt-interest-7": "机构准入",
    "opt-interest-8": "一般咨询",
    "form-note-label": "简短附言 (选填)",
    "form-newsletter-text": "我想订阅 EquusChain 精选行业通讯",
    "form-consent-text":
      '我确认已阅读并同意<a href="#termsModal" class="live-link" id="termsLink">条款与条件</a>以及<a href="#privacyModal" class="live-link" id="privacyLink">隐私政策</a>',
    "form-submit-btn": "提交申请",
    "form-note-footer":
      "您的所有咨询均受严格保密。我们不会与任何第三方共享信息。",
    "ft-col1-title": "平台入口",
    "ft-col1-item1": "会员登录",
    "ft-col1-item2": "资产世界",
    "ft-col1-item3": "资产上架",
    "ft-col2-title": "联系方式",
    "ft-col2-item1": "投资者关系",
    "ft-col2-item2": "机构业务部",
    "ft-col2-item3": "法务与合规",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. 保留所有权利。本网站所载信息仅供参考，不构成任何投资、法律、税务或财务建议，亦不构成购买或出售任何证券或资产的要约。",
    "ft-privacy": "隐私政策",
    "ft-terms": "使用条款",
    "cookie-title": "我们使用 Cookie",
    "cookie-body":
      "我们使用 Cookie 来优化用户体验、分析网站流量以及提供个性化内容。某些 Cookie 对于网站的运行必不可少，而其他 Cookie 则需获得您的事先同意。",
    "cookie-refuse": "拒绝非必要 Cookie",
    "cookie-accept": "接受非必要 Cookie",
    "cookie-link": "了解有关 Cookie 的更多信息",
    "login-platform": "会员专属平台",
    "login-signin": "会员登录",
    "login-reqaccess": "申请访问权限",
    "login-email": "电子邮箱",
    "login-email-ph": "your@email.com",
    "login-password": "密码",
    "login-password-ph": "••••••••",
    "login-btn": "进入平台",
    "login-note": "受保护的安全访问 · 所有会话均被监控和加密",
    "login-name": "法定真实姓名",
    "login-name-ph": "须与护照一致",
    "login-profile": "投资者身份画像",
    "login-profile-select": "请选择您的身份…",
    "login-profile-1": "家族办公室",
    "login-profile-2": "专业投资者 (UHNW)",
    "login-profile-3": "合格/合规/合格投资者",
    "login-profile-4": "机构投资者 / 基金",
    "login-profile-5": "资产发起人 / 代币化结构设计",
    "login-jurisdiction": "常住国/司法管辖区",
    "login-jurisdiction-ph": "国家",
    "login-submit-btn": "提交访问申请",
    "login-register-note":
      "平台访问权限需经KYC/AML合规性审查及投资者资格评估。我们的团队将在24-48小时内与您联系。",
    "login-back": "← 返回 EquusChain.io",
  },
  hi: {
    "nav-about": "हमारा दृष्टिकोण",
    "nav-assets": "संपत्ति ब्रह्मांड",
    "nav-services": "क्षमताएं",
    "nav-contact": "पहुंच का अनुरोध",
    "nav-contact-btn": "पहुंच का अनुरोध",
    "hero-title": "विश्व की बेहतरीन संपत्तियां,<br><em>आखिरकार</em> तरल।",
    "hero-lead":
      "इक्वसचेन<sup>™</sup> असाधारण वास्तविक और पारंपरिक वित्तीय संपत्तियों के स्वामित्व, विनिमय और तरलता के लिए आधुनिक बुनियादी ढांचा है।",
    "manifesto-tag": "I. हमारा विश्वास",
    "manifesto-body":
      "दुनिया की सबसे टिकाऊ संपत्तियां हमेशा बाजार और पीढ़ियों से परे रही हैं। निजी व्यवसायों से लेकर असाधारण अचल संपत्ति, प्रतिष्ठित शुद्ध-रक्त घोड़ों और उच्च-स्तरीय कला तक, उनका मूल्य केवल वित्तीय प्रदर्शन से कहीं अधिक है। इक्वसचेन<sup>™</sup> इन संपत्तियों को उस कठोरता, पारदर्शिता और दक्षता के साथ प्रबंधित करने, व्यापार करने और उनकी तरलता को अनलॉक करने के लिए बुनियादी ढांचा प्रदान करता है जिसके वे हकदार हैं।",
    "mf-stat-1-v": "वैश्विक",
    "mf-stat-1-l": "पहुंच",
    "mf-stat-2-v": "केवल योग्य",
    "mf-stat-2-l": "निवेशक",
    "mf-stat-3-v": "पूर्ण गोपनीयता",
    "mf-stat-3-l": "हर चीज में",
    "mf-stat-4-v": "उचित",
    "mf-stat-4-l": "दस्तावेज़ीकरण",
    "universe-subtitle": "II. संपत्ति ब्रह्मांड",
    "universe-title": "संपत्ति ब्रह्मांड।",
    "universe-title-gold": "असाधारण EquusChain",
    "universe-lead":
      "एक विस्तृत और बढ़ता हुआ ब्रह्मांड। संस्थागत निजी बाजारों से लेकर दुनिया की सबसे प्रतिष्ठित संपत्तियों तक। नीचे एक चयन है, पूरी सूची मंच के भीतर है।",
    "asset-1-name": "रियल एस्टेट और बुनियादी ढांचा",
    "asset-1-sub": "प्रीमियम वाणिज्यिक, आवासीय और आतिथ्य संपत्तियां।",
    "asset-2-name": "प्राइवेट इक्विटी",
    "asset-2-sub": "फंड, सह-निवेश और प्रत्यक्ष स्थितियां।",
    "asset-3-name": "निजी ऋण",
    "asset-3-sub": "वरिष्ठ सुरक्षित और अनुकूलित ऋण संरचनाएं।",
    "asset-4-name": "कृषि और वस्तुएं",
    "asset-4-sub": "उत्पादक भूमि और कमोडिटी-लिंक्ड उपकरण।",
    "asset-5-name": "घुड़सवारी और नस्ली घोड़े",
    "asset-5-sub": "थोरब्रेड्स, स्टड अधिकार, रेसिंग कार्यक्रम।",
    "asset-6-name": "निजी उड्डयन और समुद्री",
    "asset-6-sub": "विमान, सुपर yachts निवेश और उपयोग के अधिकार।",
    "asset-7-name": "ललित कला और संग्रहणीय",
    "asset-7-sub": "संग्रहालय-ग्रेड कार्य, दुर्लभ वाइन, क्लासिक ऑटोमोबाइल।",
    "asset-8-name": "और काफी कुछ",
    "asset-8-sub": "कीमती धातुएं, संरचित फंड, नवीकरणीय ऊर्जा…",
    "services-subtitle": "III. सेवाएं",
    "services-title": "इक्वसचेन प्लेटफॉर्म क्या<br>सक्षम बनाता है।",
    "services-lead":
      "चार चीजें। प्रत्येक पूंजी के साथ एक विशिष्ट संबंध के लिए डिज़ाइन की गई है। आपको एक या चारों की आवश्यकता हो सकती है।",
    "service-1-n": "I",
    "service-1-title": "निवेश और व्यापार",
    "service-1-body":
      "प्रसादों की सदस्यता लें। पदों का प्रबंधन करें। वितरण प्राप्त करें। एक निजी वातावरण उस पोर्टफोलियो के लिए जो सार्वजनिक बाजारों से बहुत आगे जाता है।",
    "service-1-link": "खाता खोलें",
    "service-2-n": "II",
    "service-2-title": "आंशिक स्वामित्व",
    "service-2-body":
      "उन संपत्तियों में रुचि रखें जो अन्यथा विशेष पूंजी प्रतिबद्धता की मांग करती हैं। रियल एस्टेट, निजी उद्यम, घोड़े, विमान, and और बहुत कुछ; आपके जनादेश के आकार में।",
    "service-2-link": "पूछताछ करें",
    "service-3-n": "III",
    "service-3-title": "संपत्तियों को बाजार में लाना",
    "service-3-body":
      "आप संपत्ति रखते हैं। हम इसे संरचित करते हैं, इसका दस्तावेजीकरण करते हैं, और इसे योग्य निवेशकों के पास लाते हैं। आपकी निजी कंपनी से लेकर संपत्ति पोर्टफोलियो या नाव तक; पूरी प्रक्रिया प्रबंधित की जाती है।",
    "service-3-link": "हमारी टीम से बात करें",
    "service-4-n": "IV",
    "service-4-title": "पहुंच और उपयोग के अधिकार",
    "service-4-body":
      "कुछ प्लेटफॉर्म संपत्तियां अधिमान्य पहुंच व्यवस्थाओं के माध्यम से उपलब्ध हैं। विमानन, समुद्री, घुड़सवारी। सदस्यों के लिए आरक्षित।",
    "service-4-link": "अन्वेषण करें",
    "contact-subtitle": "IV. पहुंच",
    "contact-title": "अनुरोध<br><em>पहुंच।</em>",
    "contact-body":
      "इक्वसचेन पारिस्थितिकी तंत्र की गुणवत्ता, प्रासंगिकता और अखंडता सुनिश्चित करने के लिए हमारी टीम द्वारा सीधे हर पूछताछ की समीक्षा की जाती है।",
    "form-name-label": "पूरा नाम",
    "form-email-label": "ईमेल पता",
    "form-org-label": "संगठन",
    "form-profile-label": "प्रोफ़ाइल",
    "opt-select-profile": "प्रोफ़ाइल चुनें…",
    "opt-profile-1": "निवेशक",
    "opt-profile-2": "संपत्ति स्वामी",
    "opt-profile-3": "मध्यस्थ",
    "opt-profile-4": "संस्थान",
    "opt-profile-5": "सलाहकार",
    "opt-profile-6": "सेवा प्रदाता",
    "form-interest-label": "प्राथमिक रुचि",
    "opt-select-interest": "रुचि चुनें…",
    "opt-interest-1": "अवसरों तक पहुंच",
    "opt-interest-2": "संपत्ति को सूचीबद्ध करना",
    "opt-interest-3": "पूंजी जुटाना",
    "opt-interest-4": "द्वितीयक बाजार लेनदेन",
    "opt-interest-5": "संपत्ति टोकनीकरण",
    "opt-interest-6": "रणनीतिक साझेदारी",
    "opt-interest-7": "संस्थागत पहुंच",
    "opt-interest-8": "सामान्य पूछताछ",
    "form-note-label": "एक संक्षिप्त नोट (वैकल्पिक)",
    "form-newsletter-text":
      "मैं इक्वसचेन के क्यूरेटेड न्यूजलेटर की सदस्यता लेना चाहूंगा",
    "form-consent-text":
      'मैं पुष्टि करता हूं कि मैंने <a href="#termsModal" class="live-link" id="termsLink">नियम और शर्तें</a> और <a href="#privacyModal" class="live-link" id="privacyLink">गोपनीयता नीति</a> पढ़ ली है और उनसे सहमत हूं',
    "form-submit-btn": "अनुरोध जमा करें",
    "form-note-footer":
      "आपकी पूछताछ पूर्ण गोपनीयता के साथ संभाली जाती है। हम तीसरे पक्षों के साथ विवरण साझा नहीं करते हैं।",
    "ft-col1-title": "मंच",
    "ft-col1-item1": "सदस्य लॉगिन",
    "ft-col1-item2": "संपत्ति ब्रह्मांड",
    "ft-col1-item3": "एक संपत्ति लाओ",
    "ft-col2-title": "संपर्क",
    "ft-col2-item1": "इन्वेस्टर रिलेशंस",
    "ft-col2-item2": "संस्थागत डेस्क",
    "ft-col2-item3": "कानूनी और अनुपालन",
    "ft-disclaimer":
      "© 2026 इक्वसचेन लिमिटेड। सर्वाधिकार सुरक्षित। इस वेबसाइट पर दी गई जानकारी केवल सूचनात्मक उद्देश्यों के लिए प्रदान की गई है और यह निवेश, कानूनी, कर या वित्तीय सलाह का गठन नहीं करती है।",
    "ft-privacy": "गोपनीयता",
    "ft-terms": "नियम",
    "cookie-title": "हम कुकीज़ का उपयोग करते हैं",
    "cookie-body":
      "हम आपके अनुभव को बेहतर बनाने, साइट उपयोग का विश्लेषण करने और व्यक्तिगत सामग्री प्रदान करने के लिए कुकीज़ का उपयोग करते हैं। कुछ कुकीज़ आवश्यक हैं, अन्य के लिए आपकी सहमति आवश्यक है।",
    "cookie-refuse": "गैर-आवश्यक कुकीज़ अस्वीकार करें",
    "cookie-accept": "गैर-आवश्यक कुकीज़ स्वीकार करें",
    "cookie-link": "हमारी कुकीज़ के बारे में और जानें",
    "login-platform": "सदस्य मंच",
    "login-signin": "साइन इन करें",
    "login-reqaccess": "पहुंच का अनुरोध करें",
    "login-email": "ईमेल पता",
    "login-email-ph": "your@email.com",
    "login-password": "पासवर्ड",
    "login-password-ph": "••••••••",
    "login-btn": "प्लेटफ़ॉर्म में प्रवेश करें",
    "login-note":
      "सुरक्षित पहुंच · सभी सत्रों की निगरानी और एन्क्रिप्शन किया जाता है",
    "login-name": "पूर्ण कानूनी नाम",
    "login-name-ph": "पासपोर्ट के अनुसार",
    "login-profile": "निवेशक प्रोफ़ाइल",
    "login-profile-select": "अपनी प्रोफ़ाइल चुनें",
    "login-profile-1": "फैमिली ऑफिस",
    "login-profile-2": "पेशेवर निवेशक (UHNW)",
    "login-profile-3": "योग्य निवेशक",
    "login-profile-4": "संस्थागत / फंड",
    "login-profile-5": "संपत्ति प्रायोजक / टोकनीकरण",
    "login-jurisdiction": "निवास का अधिकार क्षेत्र",
    "login-jurisdiction-ph": "देश",
    "login-submit-btn": "आवेदन जमा करें",
    "login-register-note":
      "पहुंच केवाईसी/एएमएल सत्यापन और निवेशक पात्रता मूल्यांकन के अधीन है। हमारी टीम 24-48 घंटों के भीतर संपर्क करेगी।",
    "login-back": "← EquusChain.io पर वापस लौटें",
  },
  ja: {
    "nav-about": "アプローチ",
    "nav-assets": "資産の宇宙",
    "nav-services": "提供機能",
    "nav-contact": "アクセス申請",
    "nav-contact-btn": "アクセス申請",
    "hero-title": "世界最高の資産を、<br><em>ついに</em>流動化。",
    "hero-lead":
      "EquusChain<sup>™</sup>は、卓越した実物資産および伝統的金融資産の所有、取引、流動化のためのモダンなインフラストラクチャです。",
    "manifesto-tag": "I. 私たちの信念",
    "manifesto-body":
      "世界で最も永続的な資産は常に市場と世代を超えて存在してきました。プライベートビジネスから卓越した不動産、象徴的な純血種競走馬、一流のアート作品まで、その価値は単なる財務実績を超えています。EquusChain<sup>™</sup> は、これらの資産にふさわしい厳格さ、透明性、効率性をもって管理、取引、流動性を解放するためのインフラストラクチャを提供します。",
    "mf-stat-1-v": "グローバル",
    "mf-stat-1-l": "リーチ",
    "mf-stat-2-v": "適格",
    "mf-stat-2-l": "投資家限定",
    "mf-stat-3-v": "万事における",
    "mf-stat-3-l": "厳秘",
    "mf-stat-4-v": "適切な",
    "mf-stat-4-l": "書類手続き",
    "universe-subtitle": "II. 資産の宇宙",
    "universe-title": "卓越した資産の宇宙。",
    "universe-title-gold": "卓越した EquusChain.",
    "universe-lead":
      "広大で成長を続ける宇宙。機関投資家向けプライベート市場から世界で最も切望される実物資産まで。以下はその一部です。全カタログはプラットフォーム内にあります。",
    "asset-1-name": "不動産・インフラ",
    "asset-1-sub": "最高級の商業用、居住用、ホスピタリティ資産。s",
    "asset-2-name": "プライベート・エクイティ",
    "asset-2-sub": "ファンド、共同投資、直接投資ポジション。",
    "asset-3-name": "プライベート・クレジット",
    "asset-3-sub": "優先担保付債権および特注のクレジットストラクチャー。",
    "asset-4-name": "農業・コモディティ",
    "asset-4-sub": "生産的土地およびコモディティ連動型金融商品。",
    "asset-5-name": "馬術・競走馬",
    "asset-5-sub": "サラブレッド、種付権、レースプログラム。",
    "asset-6-name": "プライベート航空機・船舶",
    "asset-6-sub": "航空機、スーパーヨット 投資および使用権。",
    "asset-7-name": "美術品・コレクターズアイテム",
    "asset-7-sub": "美術館級の芸術品、希少ワイン、クラシックカー。",
    "asset-8-name": "その他多数の資産",
    "asset-8-sub": "貴金属、構造化ファンド、再生可能エネルギーなど…",
    "services-subtitle": "III. サービス",
    "services-title": "EquusChainプラットフォームが<br>実現するもの。",
    "services-lead":
      "4つの主要サービス。それぞれ特定の資本関係に合わせて設計されています。1つだけ必要な場合も、4つすべてが必要な場合もあります。",
    "service-1-n": "I",
    "service-1-title": "投資と取引",
    "service-1-body":
      "案件への応募、ポジション管理、分配金の受領。上場市場をはるかに超えるポートフォリオのためのプライベート環境。",
    "service-1-link": "アカウントを開設する",
    "service-2-n": "II",
    "service-2-title": "小口所有権",
    "service-2-body":
      "本来であれば独占的な資本コミットメントが必要な資産の持分を保有。不動産、私企業、競走馬、航空機など、お客様の投資方針に応じた規模で。",
    "service-2-link": "お問い合わせ",
    "service-3-n": "III",
    "service-3-title": "資産の市場投入",
    "service-3-body":
      "お客様は資産を保有するだけ。当方がストラクチャリング、ドキュメンテーションを行い、適格投資家に紹介します。非公開企業から不動産ポートフォリオ、ヨットまで、すべてのプロセスをサポート。",
    "service-3-link": "チームに相談する",
    "service-4-n": "IV",
    "service-4-title": "アクセスおよび使用権",
    "service-4-body":
      "プラットフォームの特定の資産は、優先アクセス契約を通じてご利用いただけます。航空、海洋、馬術。会員専用。",
    "service-4-link": "探索する",
    "contact-subtitle": "IV. アクセス",
    "contact-title": "アクセスを<br><em>申請する。</em>",
    "contact-body":
      "すべての問い合わせは、EquusChainエコシステムの品質、関連性、完全性を担保するため、当社のチームが直接審査いたします。",
    "form-name-label": "氏名",
    "form-email-label": "メールアドレス",
    "form-org-label": "組織・機関名",
    "form-profile-label": "プロファイル",
    "opt-select-profile": "プロファイルを選択…",
    "opt-profile-1": "投資家",
    "opt-profile-2": "資産所有者",
    "opt-profile-3": "仲介者",
    "opt-profile-4": "金融機関",
    "opt-profile-5": "アドバイザー",
    "opt-profile-6": "サービスプロバイダー",
    "form-interest-label": "主な関心事項",
    "opt-select-interest": "関心事項を選択…",
    "opt-interest-1": "投資機会へのアクセス",
    "opt-interest-2": "資産のリスティング",
    "opt-interest-3": "資金調達",
    "opt-interest-4": "二次市場取引",
    "opt-interest-5": "資産のトークン化",
    "opt-interest-6": "戦略的提携",
    "opt-interest-7": "機関投資家向けアクセス",
    "opt-interest-8": "一般的な問い合わせ",
    "form-note-label": "簡単なメモ（任意）",
    "form-newsletter-text": "EquusChainの厳選ニュースレターの購読を希望する",
    "form-consent-text": "利用規約およびプライバシーポリシーを読み、同意します",
    "form-submit-btn": "申請を送信する",
    "form-note-footer":
      "お問い合わせ内容は完全に極秘として扱われます。第三者と詳細を共有することはありません。",
    "ft-col1-title": "プラットフォーム",
    "ft-col1-item1": "会員ログイン",
    "ft-col1-item2": "資産の宇宙",
    "ft-col1-item3": "資産を上場する",
    "ft-col2-title": "連絡先",
    "ft-col2-item1": "投資家関係",
    "ft-col2-item2": "機関投資家デスク",
    "ft-col2-item3": "法務・コンプライアンス",
    "ft-disclaimer":
      "© 2026 EquusChain Ltd. 無断複写・転載を禁じます。本ウェブサイトに掲載されている情報は情報提供のみを目的としており、投資、法律、税務、財務に関するアドバイスを構成するものではありません。",
    "ft-privacy": "プライバシー",
    "ft-terms": "利用規約",
    "cookie-title": "クッキーを使用しています",
    "cookie-body":
      "当サイトでは、ユーザー体験の向上、サイト利用状況の分析、パーソナライズされたコンテンツや提案の提供のためにクッキーを使用しています。一部のクッキーは必須ですが、その他は事前の同意が必要です。",
    "cookie-refuse": "必須ではないクッキーを拒否する",
    "cookie-accept": "必須ではないクッキーを受け入れる",
    "cookie-link": "クッキーの詳細を見る",
    "login-platform": "会員限定プラットフォーム",
    "login-signin": "サインイン",
    "login-reqaccess": "アクセス申請",
    "login-email": "メールアドレス",
    "login-email-ph": "your@email.com",
    "login-password": "パスワード",
    "login-password-ph": "••••••••",
    "login-btn": "プラットフォームにアクセスする",
    "login-note":
      "保護されたアクセス · すべてのセッションは監視および暗号化されます",
    "login-name": "法的氏名（フルネーム）",
    "login-name-ph": "パスポート記載通り",
    "login-profile": "投資家プロファイル",
    "login-profile-select": "プロファイルを選択…",
    "login-profile-1": "ファミリーオフィス",
    "login-profile-2": "プロフェッショナル投資家（UHNW）",
    "login-profile-3": "適格投資家",
    "login-profile-4": "機関投資家・ファンド",
    "login-profile-5": "アセットスポンサー・トークン化",
    "login-jurisdiction": "居住国・管轄区域",
    "login-jurisdiction-ph": "国名",
    "login-submit-btn": "申請を送信する",
    "login-register-note":
      "アクセスにはKYC/AMLの確認および投資家要件の審査が必要となります。当社のチームより24〜48時間以内にご連絡いたします。",
    "login-back": "← EquusChain.io に戻る",
  },
};

// Switch Language function
function switchLanguage(lang) {
  const langCurr = document.getElementById("langBtn")
    ? document.getElementById("langBtn").querySelector(".lang-curr")
    : null;
  if (langCurr) {
    langCurr.textContent = lang.toUpperCase();
  }

  // Merge private translations if available
  let privateDict = {};
  if (window.privateTranslations1 && window.privateTranslations1[lang]) {
    privateDict = { ...privateDict, ...window.privateTranslations1[lang] };
  }
  if (window.privateTranslations2 && window.privateTranslations2[lang]) {
    privateDict = { ...privateDict, ...window.privateTranslations2[lang] };
  }

  const publicDict = translations[lang] || translations.en || {};
  const dict = { ...publicDict, ...privateDict };
  window.currentLangDict = dict;

  // Translate static elements with data-tr
  document.querySelectorAll("[data-tr]").forEach((el) => {
    const key = el.getAttribute("data-tr");
    if (dict[key]) {
      if (
        el.tagName.toLowerCase() === "input" ||
        el.tagName.toLowerCase() === "textarea"
      ) {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // Update topbar date if present
  const dateEl = document.getElementById("topbar-date");
  if (dateEl) {
    const locales = {
      en: "en-GB",
      fr: "fr-FR",
      ar: "ar-AE",
      it: "it-IT",
      es: "es-ES",
      de: "de-DE",
      pt: "pt-PT",
      ru: "ru-RU",
      zh: "zh-CN",
      hi: "hi-IN",
      ja: "ja-JP",
    };
    const locale = locales[lang] || "en-GB";
    const d = new Date();
    dateEl.textContent = d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Re-align layouts dynamically for RTL support
  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", lang);
  }

  // Store language selection
  localStorage.setItem("equuschain_lang", lang);

  // Update active class in dropdown options list
  document.querySelectorAll(".lang-option").forEach((opt) => {
    if (opt.getAttribute("data-lang") === lang) {
      opt.classList.add("active");
    } else {
      opt.classList.remove("active");
    }
  });

  // Also update dynamic elements currently visible, like the topbar title or modal if open
  const titleEl = document.getElementById("topbar-title");
  if (titleEl) {
    const trKey = titleEl.getAttribute("data-tr");
    if (trKey && dict[trKey]) {
      titleEl.innerHTML = dict[trKey];
    }
  }
  const modalTitle = document.getElementById("modal-title");
  if (modalTitle) {
    const trKey = modalTitle.getAttribute("data-tr");
    if (trKey && dict[trKey]) {
      modalTitle.innerHTML = dict[trKey];
    }
  }
  const modalBody = document.getElementById("modal-body");
  if (modalBody) {
    const trKey = modalBody.getAttribute("data-tr");
    if (trKey && dict[trKey]) {
      modalBody.innerHTML = dict[trKey];
    }
  }

  // Re-translate open modal values if open
  const activeModalOverlay = document.getElementById("modal-overlay");
  if (activeModalOverlay && activeModalOverlay.classList.contains("open")) {
    const titleElement = document.getElementById("modal-title");
    if (titleElement) {
      const assetId = titleElement.getAttribute("data-active-asset-id");
      if (assetId) {
        openModal(assetId);
      }
    }
  }
}

// ─── PRIVATE & GLOBAL LOGIC ───────────────────────────────────────

// Date Setup
const topbarDateGlobal = document.getElementById("topbar-date");
if (topbarDateGlobal) {
  const d = new Date();
  topbarDateGlobal.textContent = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Authentication switch tab
function switchTab(t) {
  document
    .querySelectorAll(".auth-tab")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".auth-panel")
    .forEach((p) => p.classList.remove("active"));
  if (window.event && window.event.target) {
    window.event.target.classList.add("active");
  }
  const targetTab = document.getElementById("tab-" + t);
  if (targetTab) targetTab.classList.add("active");
}

// Access triggers
function enterPlatform() {
  window.location.href = "../private/dashboard.html";
}

function logout() {
  localStorage.removeItem("activeDashboardPanel");
  window.location.href = "login.html";
}

// Private navigation panels
const titles = {
  dashboard: "Dashboard",
  portfolio: "My Portfolio",
  marketplace: "Universe of Assets",
  tokenise: "Tokenise an Asset",
  "my-tokens": "My Issuances",
  distributions: "Distributions",
  documents: "Documents",
  kyc: "KYC & Compliance",
};

function showPanel(id) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".sb-link")
    .forEach((l) => l.classList.remove("active"));

  const panelEl = document.getElementById("panel-" + id);
  if (panelEl) panelEl.classList.add("active");

  const link = document.querySelector(`[onclick="showPanel('${id}')"]`);
  if (link) link.classList.add("active");

  const titleEl = document.getElementById("topbar-title");
  if (titleEl) {
    const titleKey = "panel-" + id;
    titleEl.setAttribute("data-tr", titleKey);
    if (window.currentLangDict && window.currentLangDict[titleKey]) {
      titleEl.innerHTML = window.currentLangDict[titleKey];
    } else {
      titleEl.textContent = titles[id] || id;
    }
  }

  if (id === "tokenise") wizStep(1);

  // Persist active tab across refreshes
  localStorage.setItem("activeDashboardPanel", id);
}

// Wizard flow
let wizCurrent = 1;
function wizStep(n) {
  wizCurrent = n;
  for (let i = 1; i <= 4; i++) {
    const p = document.getElementById("wiz-panel-" + i);
    if (p) p.style.display = i === n ? "block" : "none";
    const ws = document.getElementById("ws" + i);
    if (ws) {
      ws.classList.remove("active", "done");
      if (i < n) ws.classList.add("done");
      if (i === n) ws.classList.add("active");
    }
  }
}

function wizNext() {
  wizStep(wizCurrent + 1);
}

// Tokenise Asset Submission
function submitTokenisation() {
  let msg =
    "Your tokenisation application has been submitted.\n\nOur structuring team will review your submission and contact you within 48 hours with an initial assessment.\n\nThank you.";
  if (
    window.currentLangDict &&
    window.currentLangDict["alert-tokenisation-submitted"]
  ) {
    msg = window.currentLangDict["alert-tokenisation-submitted"];
  }
  alert(msg);
  showPanel("my-tokens");
}

// Modal management
const assetData = {
  "real-estate-1": {
    title: "Maison Blanche — Paris 8th Arrondissement",
    body: `<div class="detail-row"><span class="dr-label">Location</span><span class="dr-val">Paris, 8th Arrondissement</span></div>
<div class="detail-row"><span class="dr-label">Asset Type</span><span class="dr-val">Prime Residential — Haussmann</span></div>
<div class="detail-row"><span class="dr-label">Target Yield</span><span class="dr-val">5.8% per annum</span></div>
<div class="detail-row"><span class="dr-label">Minimum Investment</span><span class="dr-val">€200,000</span></div>
<div class="detail-row"><span class="dr-label">Total Offering</span><span class="dr-val">€4,800,000</span></div>
<div class="detail-row"><span class="dr-label">Closing Date</span><span class="dr-val">31 March 2025</span></div>
<div class="detail-row"><span class="dr-label">Status</span><span class="dr-val"><span class="badge badge-g">Open</span></span></div>
<p style="margin-top:20px;font-size:12.5px;color:var(--cream-d);line-height:2">Prime Haussmann residential building in the heart of Paris 8th. 6 floors, 12 residential units. Full renovation completed 2022. 100% let to quality tenants. Legal structure: French SCI. Full Information Memorandum available post NDA.</p>
<p style="font-size:11.5px;color:var(--cream-d);margin-top:16px;padding:14px;border-left:2px solid var(--gold-lo);line-height:1.9">This offering is available to professional investors only. Capital at risk. Past performance does not guarantee future results. Full legal documentation available upon execution of NDA.</p>`,
  },
  "credit-1": {
    title: "Global Credit Opportunities III",
    body: `<div class="detail-row"><span class="dr-label">Strategy</span><span class="dr-val">Senior Secured Corporate Credit</span></div>
<div class="detail-row"><span class="dr-label">Target Return</span><span class="dr-val">9.2% per annum net</span></div>
<div class="detail-row"><span class="dr-label">Term</span><span class="dr-val">18 months</span></div>
<div class="detail-row"><span class="dr-label">Distributions</span><span class="dr-val">Quarterly</span></div>
<div class="detail-row"><span class="dr-label">Minimum Investment</span><span class="dr-val">$100,000</span></div>
<div class="detail-row"><span class="dr-label">Status</span><span class="dr-val"><span class="badge badge-g">Open</span></span></div>
<p style="margin-top:20px;font-size:12.5px;color:var(--cream-d);line-height:2">A diversified portfolio of senior secured corporate credit instruments across European issuers. Average loan-to-value 58%. All borrowers subject to EquusChain's credit committee approval. Quarterly coupon distributions. Full Information Memorandum and audited track record of prior series available on request.</p>`,
  },
  "equestrian-1": {
    title: "Midnight Sovereign — Thoroughbred Racehorse",
    body: `<div class="detail-row"><span class="dr-label">Breed</span><span class="dr-val">Thoroughbred — 3yo Colt</span></div>
<div class="detail-row"><span class="dr-label">Trainer</span><span class="dr-val">Newmarket, UK (name disclosed to investors)</span></div>
<div class="detail-row"><span class="dr-label">Classification</span><span class="dr-val">Grade 2 prospect</span></div>
<div class="detail-row"><span class="dr-label">Fractional Offered</span><span class="dr-val">40% (8 x 5% shares)</span></div>
<div class="detail-row"><span class="dr-label">Minimum</span><span class="dr-val">£50,000 (5% share)</span></div>
<div class="detail-row"><span class="dr-label">Returns</span><span class="dr-val">Race earnings + capital value</span></div>
<p style="margin-top:20px;font-size:12.5px;color:var(--cream-d);line-height:2">Midnight Sovereign is an exceptionally well-bred 3-year-old colt trained at one of Newmarket's leading yards. All fractional owners receive race participation rights, stable visit access, and full veterinary reporting. Legal ownership via BHA-compliant partnership agreement.</p>`,
  },
  "aviation-1": {
    title: "Gulfstream G700 — Fractional Share",
    body: `<div class="detail-row"><span class="dr-label">Aircraft</span><span class="dr-val">Gulfstream G700</span></div>
<div class="detail-row"><span class="dr-label">Share</span><span class="dr-val">1/8 — 125 hours per annum</span></div>
<div class="detail-row"><span class="dr-label">Certification</span><span class="dr-val">EASA / FAA</span></div>
<div class="detail-row"><span class="dr-label">Base</span><span class="dr-val">Geneva, Switzerland</span></div>
<div class="detail-row"><span class="dr-label">Minimum</span><span class="dr-val">$800,000</span></div>
<div class="detail-row"><span class="dr-label">Charter Programme</span><span class="dr-val">Available — offset management costs</span></div>
<p style="margin-top:20px;font-size:12.5px;color:var(--cream-d);line-height:2">Access to one of aviation's most capable ultra-long-range business jets. 125 guaranteed hours per annum. Full crew management, hangarage, and CAMO included. Charter management programme available to offset fixed costs when not in use.</p>`,
  },
  "fund-1": {
    title: "Templar European Growth IV",
    body: `<div class="detail-row"><span class="dr-label">Strategy</span><span class="dr-val">Lower Mid-Market European PE</span></div>
<div class="detail-row"><span class="dr-label">Target Size</span><span class="dr-val">€450 million</span></div>
<div class="detail-row"><span class="dr-label">Target Net IRR</span><span class="dr-val">18%</span></div>
<div class="detail-row"><span class="dr-label">GP Commitment</span><span class="dr-val">3%</span></div>
<div class="detail-row"><span class="dr-label">Minimum LP</span><span class="dr-val">€500,000</span></div>
<div class="detail-row"><span class="dr-label">Final Close</span><span class="dr-val">June 2025</span></div>
<p style="margin-top:20px;font-size:12.5px;color:var(--cream-d);line-height:2">Successor fund to Templar Fund III (Fund III currently generating 1.6x MOIC). Focus on B2B technology-enabled services in the DACH region and Benelux. Buy-and-build strategy. Full Limited Partner Agreement, side-letter negotiation available for commitments of €5M+.</p>`,
  },
  "yacht-1": {
    title: "Aquila — 55m Motor Yacht",
    body: `<div class="detail-row"><span class="dr-label">Vessel</span><span class="dr-val">55m Custom Motor Yacht — 2019</span></div>
<div class="detail-row"><span class="dr-label">Programme</span><span class="dr-val">Fractional ownership or Charter Investment</span></div>
<div class="detail-row"><span class="dr-label">Charter Revenue 2023</span><span class="dr-val">€4.2 million</span></div>
<div class="detail-row"><span class="dr-label">Regions</span><span class="dr-val">Mediterranean & Caribbean</span></div>
<div class="detail-row"><span class="dr-label">Minimum</span><span class="dr-val">€1,000,000</span></div>
<p style="margin-top:20px;font-size:12.5px;color:var(--cream-d);line-height:2">A flagship of contemporary superyacht design. The vessel generated €4.2M in charter revenue in 2023 under full Burgess management. Investors may participate via a fractional ownership structure or a charter income participation programme. Personal use rights available to fractional owners.</p>`,
  },
};

function openModal(id) {
  const d = assetData[id];
  if (!d) return;

  const titleEl = document.getElementById("modal-title");
  const bodyEl = document.getElementById("modal-body");
  const overlayEl = document.getElementById("modal-overlay");

  if (titleEl) {
    titleEl.setAttribute("data-active-asset-id", id);
    const titleKey = "asset-" + id + "-title";
    if (window.currentLangDict && window.currentLangDict[titleKey]) {
      titleEl.innerHTML = window.currentLangDict[titleKey];
    } else {
      titleEl.textContent = d.title;
    }
  }

  if (bodyEl) {
    const bodyKey = "asset-" + id + "-body";
    if (window.currentLangDict && window.currentLangDict[bodyKey]) {
      bodyEl.innerHTML = window.currentLangDict[bodyKey];
    } else {
      bodyEl.innerHTML = d.body;
    }
  }

  if (overlayEl) {
    overlayEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const overlayEl = document.getElementById("modal-overlay");
  if (overlayEl) {
    overlayEl.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function expressInterest() {
  let msg =
    "Thank you for your expression of interest. A representative from our Investor Relations desk will contact you within 24 hours to provide the Information Memorandum and review the subscription process.";
  if (
    window.currentLangDict &&
    window.currentLangDict["alert-express-interest"]
  ) {
    msg = window.currentLangDict["alert-express-interest"];
  }
  alert(msg);
  closeModal();
}

const modalOverlay = document.getElementById("modal-overlay");
if (modalOverlay) {
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
}

// Sidebar toggle for dashboard responsive layout
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");
  if (sidebar && backdrop) {
    const isOpen = sidebar.classList.contains("open");
    if (isOpen) {
      sidebar.classList.remove("open");
      backdrop.classList.remove("open");
      document.body.style.overflow = "";
    } else {
      sidebar.classList.add("open");
      backdrop.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
}

// Close sidebar on link clicks for mobile devices
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sidebar .sb-link").forEach((link) => {
    link.addEventListener("click", () => {
      const sidebar = document.querySelector(".sidebar");
      const backdrop = document.querySelector(".sidebar-backdrop");
      if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        if (backdrop) backdrop.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });
});
