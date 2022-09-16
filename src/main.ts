import { Watermark } from './Watermark';

export default function Demo() {
  const app = document.getElementById('app')!;
  app.innerHTML = 'Demo';

  Watermark({
    // element: app,
    content: 'HarryXiong24',
  });

  app.removeAttribute('class');
}

Demo();
