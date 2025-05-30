(function buildASMWidget() {
  // if (document.getElementById('asm-controls')) return;

  const panel = document.createElement('div');
  panel.id = 'asm-controls';
  Object.assign(panel.style, {
    position: 'fixed',
    bottom: '200px',
    left: '300px',
    zIndex: '9999',
    background: 'rgba(255,255,255,0.3)',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    // boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    // minWidth: '160px',
    width: '160px',
    userSelect: 'none'
  });

  // === DRAG HANDLE ===
  let isDragging = false;
  let offsetX, offsetY;

  const dragHandle = document.createElement('div');
  dragHandle.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 100 100" fill="#555">
      <circle cx="20" cy="20" r="10"/>
      <circle cx="60" cy="20" r="10"/>
      <circle cx="20" cy="60" r="10"/>
      <circle cx="60" cy="60" r="10"/>
    </svg>`;
  Object.assign(dragHandle.style, {
    cursor: 'move',
    paddingTop: '4px',
    marginRight: 'auto'
  });

  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.bottom = `${e.clientY - offsetY}px`;
      panel.style.right = 'auto';
      panel.style.top = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // === SNAP BUTTON ===
  const resetBtn = document.createElement('button');
  resetBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#555">
      <path d="M12 2L15 8H9L12 2ZM12 22L9 16H15L12 22ZM2 12L8 15V9L2 12ZM22 12L16 9V15L22 12Z"/>
    </svg>`;
  Object.assign(resetBtn.style, {
    border: 'none',
    background: 'none',
    color: '#555',
    cursor: 'pointer',
    width: '20px',
    padding: '0px'
  });
  resetBtn.title = 'Snap to top right';
  resetBtn.onclick = () => {
    Object.assign(panel.style, {
      bottom: '200px',
      left: '300px',
      top: 'auto',
      right: 'auto'
    });
  };

  // === TRASH BUTTON ===
  const trashBtn = document.createElement('button');
  trashBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#555">
      <path d="M3 6L5 6 21 6 21 8 5 8 5 21 19 21 19 8 21 8 21 23 3 23zM8 11H10V19H8zM14 11H16V19H14zM9 4H15V6H9z"/>
    </svg>`;
  Object.assign(trashBtn.style, {
    border: 'none',
    background: 'none',
    color: '#555',
    cursor: 'pointer',
    width: '20px',
    padding: '0px',
    marginLeft: '4px'
  });
  trashBtn.title = 'Remove panel';
  trashBtn.onclick = () => {
	  stopLoop();  // Ensure the loop is stopped
	  panel.remove();
	};


  // === TOP BAR ===
  const topBar = document.createElement('div');
  topBar.style.display = 'flex';
  topBar.style.justifyContent = 'space-between';
  topBar.style.alignItems = 'center';
  topBar.style.marginBottom = '8px';
  topBar.appendChild(dragHandle);
  const iconGroup = document.createElement('div');
  iconGroup.appendChild(resetBtn);
  iconGroup.appendChild(trashBtn);
  topBar.appendChild(iconGroup);

  // === ASM BUTTON ===
  const nextCallBtn = document.createElement('button');
  nextCallBtn.textContent = 'ASM Next Call';
  Object.assign(nextCallBtn.style, {
    margin: '4px 0',
    width: '100%',
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    // background: '#2ecc71',
    background: '#0070d2',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px'
  });

  function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  function naturalClick(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return true;
    }
    return false;
  }

  nextCallBtn.onclick = async () => {
    clearInterval(countdown);
    countdown = null;        
    if (nextCallBtn.disabled) return;
    nextCallBtn.disabled = true;
    nextCallBtn.textContent = 'Working...';

    try {
      // Step 1: Click "Set Disposition..." (retry)
      for (let i = 0; i < 5; i++) {
        if (naturalClick('#call_endInteractionBtn')) break;
        await delay(250);
      }

	    readyForNextCountdown = false;

      // await delay(500);

      // Step 2: Click "CC Answering Machine"
      naturalClick('label[for="disp_id_42"]');
      // await delay(300);

      // Step 3: Click "End Interaction"
      naturalClick('#setDisposition_call');
      // await delay(300);

      // Step 4: Try Cancel button multiple times
      for (let i = 0; i < 15; i++) {
        //if (
        naturalClick('#sfli-cancel-preview-renew') 
        //) break;
        await delay(250);
      }

	readyForNextCountdown = true;
    } catch (err) {
      console.error('ASM automation error:', err);
    }

    await delay(500);
    nextCallBtn.disabled = false;
    nextCallBtn.textContent = 'ASM Next Call';
  };
  
  // DING SOUND
  function playDing(frequency = 800, duration = 150) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine'; // You can try 'triangle' or 'square' too
  oscillator.frequency.value = frequency;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();

  // Fade out for smoother sound
  gainNode.gain.setValueAtTime(0.5, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration / 1000);

  oscillator.stop(context.currentTime + duration / 1000);
}

  
  // LOOP LOGIC
    let loopActive = false;
  let loopInterval = null;
  
    let countdown = null;
	let readyForNextCountdown = true;

  const loopBtn = document.createElement('button');
  loopBtn.textContent = 'START LOOP';
  Object.assign(loopBtn.style, {
    margin: '4px 0',
    width: '100%',
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    background: '#1a7f5a', // dark green
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px'
  });

  const startLoop = () => {
    loopActive = true;
    countdown = null;
    loopBtn.style.background = '#c0392b'; // red
    loopBtn.textContent = 'STOP LOOP';
    loopInterval = setInterval(async () => {
      const stateEl = document.querySelector('#sfli-call-header .f9-nowrap-ellipsis span:nth-child(2)');
			const stateText = stateEl?.textContent?.trim();

			// Get the stopwatch time
			const timeEl = document.querySelector('#time-counter .stopwatch-partial');
			const timeText = timeEl?.textContent?.trim(); // e.g., "0:30" or "0:0:30"
			
			// Extract the last segment as seconds
let dialingSeconds = 0;
if (timeText) {
  const parts = timeText.split(':').map(Number);
  dialingSeconds = parts.length === 3 ? parts[2] : parts[1] || 0; // fallback to 0 if undefined
}

	    const callTypeEl = document.querySelector('#sfli-call-header .f9-nowrap-ellipsis span:first-child');
		const callTypeText = callTypeEl?.textContent?.trim(); // "Agent Call" or "Inbound Call"


				if (
				  (
				    stateText === ': Live Call' ||
				    stateText === ': Wrap Up' ||
				    (stateText === ': Dialing' && dialingSeconds >= 35)
				  )
				  && !countdown
					&& callTypeText !== 'Inbound Call' 
					&& readyForNextCountdown === true
				) {
        let seconds = 3;
        countdown = setInterval(() => {
          loopBtn.textContent = `STOP LOOP (${seconds}s)`;
          seconds--;
          if (seconds < 0) {
            playDing(400, 300);
            clearInterval(countdown);
            countdown = null;
            nextCallBtn.click();
            loopBtn.textContent = 'STOP LOOP';
          } else playDing();
        }, 1000);
      }
    }, 1000);
  };

  const stopLoop = () => {
    loopActive = false;
    clearInterval(loopInterval);
    clearInterval(countdown);
    loopInterval = null;
    countdown = null;
    loopBtn.style.background = '#1a7f5a'; // green
    loopBtn.textContent = 'START LOOP';
  };

  loopBtn.onclick = () => {
    loopActive ? stopLoop() : startLoop();
  }


  // === ASSEMBLE PANEL ===
  panel.appendChild(topBar);
  panel.appendChild(nextCallBtn);
  panel.appendChild(loopBtn);
// Append to DOM
  document.body.appendChild(panel);
  
  // === TRANSPARENCY STEALTH MODE ===
panel.style.opacity = '0.05';
panel.addEventListener('mouseenter', () => {panel.style.opacity = '1';
stopLoop()});
panel.addEventListener('mouseleave', () => panel.style.opacity = '0.05');


})();
