(function buildControlPanel() {
  if (document.getElementById('kill-controls')) return;

  const panel = document.createElement('div');
  panel.id = 'kill-controls';
  Object.assign(panel.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    background: 'rgba(255,255,255,0.3)',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    width: '160px',
    userSelect: 'none'
  });

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
      panel.style.top = `${e.clientY - offsetY}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

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
  resetBtn.title = 'Snap to bottom right';
  resetBtn.onclick = () => {
    Object.assign(panel.style, {
      bottom: '20px',
      right: '20px',
      top: 'auto',
      left: 'auto'
    });
  };

  const trashBtn = document.createElement('button');
  trashBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#555">
      <path d="M3 6L5 6 21 6 21 8 5 8 5 21 19 21 19 8 21 8 21 23 3 23zM8 11H10V19H8zM14 11H16V19H14zM9 4H15V6H9z"/>
    </svg>`;
  Object.assign(trashBtn.style, {
    border: 'none',
    background: 'none',
    color: '#fff',
    cursor: 'pointer',
    width: '20px',
    padding: '0px',
    marginLeft: '4px'
  });
  trashBtn.title = 'Remove panel';
  trashBtn.onclick = () => {
    stopTabLoop();
    stopToastLoop();
    panel.remove();
  };

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

  let tabLoop = null;
  const tabLoopBtn = document.createElement('button');
  tabLoopBtn.textContent = 'Start Tab Loop';
  Object.assign(tabLoopBtn.style, {
    margin: '4px 0',
    width: '100%',
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    background: '#1a7f5a',
    color: '#fff',
    cursor: 'pointer'
  });
  const startTabLoop = () => {
    tabLoopBtn.textContent = 'Stop Tab Loop';
    tabLoopBtn.style.background = '#c0392b';
    tabLoop = setInterval(() => {
      const tabs = document.querySelectorAll('ul.tabBarItems li.oneConsoleTabItem div.close');
      for (let i = 10; i < tabs.length; i++) {
        const button = tabs[0].querySelector('.slds-button_icon-x-small');
        if (button) button.click();
      }
    }, 1000);
  };
  const stopTabLoop = () => {
    clearInterval(tabLoop);
    tabLoop = null;
    tabLoopBtn.textContent = 'Start Tab Loop';
    tabLoopBtn.style.background = '#1a7f5a';
  };
  tabLoopBtn.onclick = () => tabLoop ? stopTabLoop() : startTabLoop();

  let toastLoop = null;
  const toastLoopBtn = document.createElement('button');
  toastLoopBtn.textContent = 'Start Toast Loop';
  Object.assign(toastLoopBtn.style, {
    margin: '4px 0',
    width: '100%',
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    background: '#1a7f5a',
    color: '#fff',
    cursor: 'pointer'
  });
  const startToastLoop = () => {
    toastLoopBtn.textContent = 'Stop Toast Loop';
    toastLoopBtn.style.background = '#c0392b';
    toastLoop = setInterval(() => {
      document.querySelectorAll('.slds-notify__close .toastClose').forEach(btn => btn.click());
    }, 1000);
  };
  const stopToastLoop = () => {
    clearInterval(toastLoop);
    toastLoop = null;
    toastLoopBtn.textContent = 'Start Toast Loop';
    toastLoopBtn.style.background = '#1a7f5a';
  };
  toastLoopBtn.onclick = () => toastLoop ? stopToastLoop() : startToastLoop();

  const killTabsBtn = document.createElement('button');
  killTabsBtn.textContent = 'Kill Tabs';
  Object.assign(killTabsBtn.style, {
    margin: '4px 0',
    width: '100%',
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    background: '#0070d2',
    color: '#fff',
    cursor: 'pointer'
  });
  killTabsBtn.onclick = async () => {
    const tabs = document.querySelectorAll('ul.tabBarItems li.oneConsoleTabItem div.close');
    for (const item of tabs) {
      const button = item.querySelector('.slds-button_icon-x-small');
      if (button) {
        button.click();
        await new Promise(res => setTimeout(res, 250));
      }
    }
  };

  const killToastsBtn = document.createElement('button');
  killToastsBtn.textContent = 'Kill Toasts';
  Object.assign(killToastsBtn.style, {
    margin: '4px 0',
    width: '100%',
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    background: '#555',
    color: '#fff',
    cursor: 'pointer'
  });

  killToastsBtn.onclick = () => {
    if (killToastsBtn.disabled) return;
    killToastsBtn.disabled = true;
    killToastsBtn.textContent = 'Killing...';

    const interval = setInterval(() => {
      document.querySelectorAll('.slds-notify__close .toastClose').forEach(btn => btn.click());
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      killToastsBtn.disabled = false;
      killToastsBtn.textContent = 'Kill Toasts';
    }, 5000);
  };

  panel.appendChild(topBar);
  panel.appendChild(killTabsBtn);
  panel.appendChild(tabLoopBtn);
  panel.appendChild(killToastsBtn);
  panel.appendChild(toastLoopBtn);
  panel.style.opacity = '0.05';
  panel.addEventListener('mouseenter', () => panel.style.opacity = '1');
  panel.addEventListener('mouseleave', () => panel.style.opacity = '0.05');
  document.body.appendChild(panel);
})();
