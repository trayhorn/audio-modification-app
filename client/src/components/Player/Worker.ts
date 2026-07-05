self.onmessage = (event: MessageEvent<{ samples: Float32Array; barCount: number }>) => {
  const { samples, barCount } = event.data;
  const samplesPerBar = samples.length / barCount;
  const data = [];

  for (let i = 0; i < barCount; i++) {
    const start = Math.floor(i * samplesPerBar);
    const end = Math.floor(start + samplesPerBar);
    let min = 0;
    let max = 0;
    for (let j = start; j < end; j++) {
      const val = samples[j];
      if (val < min) min = val;
      if (val > max) max = val;
    }
    data.push({ min, max });
  }

  postMessage({ data });
};