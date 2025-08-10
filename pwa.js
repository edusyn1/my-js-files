/*-- pwa botton js --*/
let deferredPrompt;window.addEventListener('beforeinstallprompt',(e) =>{e.preventDefault();deferredPrompt = e;document.getElementById('pwaInstallBtn').style.display = 'flex'}
);const btn = document.getElementById('pwaInstallBtn');btn.style.display = 'none';btn.addEventListener('click',async () =>{if (!deferredPrompt) return;deferredPrompt.prompt();const choiceResult = await deferredPrompt.userChoice;if (choiceResult.outcome === 'accepted'){console.log('User accepted the install prompt')}
else{console.log('User dismissed the install prompt')}
deferredPrompt = null;btn.style.display = 'none'}
);