import React from 'react';
import { createRoot } from 'react-dom/client';
import { detectProduct } from './detector';
import { TryOnButton } from './components/TryOnButton';
import { TryOnOverlay } from './components/TryOnOverlay';
import type { Product } from '@/shared/types';
import './styles.css';

let overlayRoot: ReturnType<typeof createRoot> | null = null;
let buttonRoot: ReturnType<typeof createRoot> | null = null;

function injectTryOnButton(product: Product, targetElement: Element) {
  const existingButton = document.getElementById('perfit-try-on-button');
  if (existingButton) {
    existingButton.remove();
  }

  const container = document.createElement('div');
  container.id = 'perfit-try-on-button';
  targetElement.insertAdjacentElement('afterend', container);

  buttonRoot = createRoot(container);
  buttonRoot.render(
    <React.StrictMode>
      <TryOnButton product={product} onTryOn={() => openOverlay(product)} />
    </React.StrictMode>
  );
}

function openOverlay(product: Product) {
  const existingOverlay = document.getElementById('perfit-overlay-root');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const container = document.createElement('div');
  container.id = 'perfit-overlay-root';
  document.body.appendChild(container);

  overlayRoot = createRoot(container);
  overlayRoot.render(
    <React.StrictMode>
      <TryOnOverlay product={product} onClose={closeOverlay} />
    </React.StrictMode>
  );
}

function closeOverlay() {
  const overlay = document.getElementById('perfit-overlay-root');
  if (overlay && overlayRoot) {
    overlayRoot.unmount();
    overlay.remove();
    overlayRoot = null;
  }
}

async function init() {
  const result = detectProduct();
  if (!result) {
    return;
  }

  const { product, buttonTarget } = result;
  if (buttonTarget) {
    injectTryOnButton(product, buttonTarget);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

const observer = new MutationObserver(() => {
  const hasButton = document.getElementById('perfit-try-on-button');
  if (!hasButton) {
    init();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

