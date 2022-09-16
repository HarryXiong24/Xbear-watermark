import { WaterMark } from './Watermark';

export default function Demo() {
  const app = document.getElementById('app')!;
  app.innerHTML = 'Demo';
  WaterMark({
    content: 'HarryXiong24',
  });
}

Demo();
