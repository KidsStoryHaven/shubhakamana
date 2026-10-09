import math
import struct
import wave
import subprocess
import os
import random

SAMPLE_RATE = 44100
OUT_DIR = "public/audio"
os.makedirs(OUT_DIR, exist_ok=True)

def generate_sine(freq, t, phase=0.0):
    return math.sin(2.0 * math.pi * freq * t + phase)

def generate_bell(t, freq, decay=3.0):
    if t < 0: return 0.0
    env = math.exp(-t * decay)
    s = (math.sin(2 * math.pi * freq * t) * 0.5 +
         math.sin(2 * math.pi * freq * 2.76 * t) * 0.25 +
         math.sin(2 * math.pi * freq * 5.4 * t) * 0.15 +
         math.sin(2 * math.pi * freq * 8.9 * t) * 0.1)
    return s * env

def generate_dhol_bass(t_hit, duration=0.45):
    if t_hit < 0 or t_hit > duration: return 0.0
    freq = 55.0 + 55.0 * math.exp(-t_hit * 12.0)
    env = math.exp(-t_hit * 7.0)
    return math.sin(2 * math.pi * freq * t_hit) * env

def generate_dhol_slap(t_hit, duration=0.15):
    if t_hit < 0 or t_hit > duration: return 0.0
    env = math.exp(-t_hit * 25.0)
    val = (math.sin(2 * math.pi * 320 * t_hit) * 0.4 +
           math.sin(2 * math.pi * 780 * t_hit) * 0.3 +
           (random.random() * 2.0 - 1.0) * 0.3)
    return val * env

def generate_shankh(t, freq=220.0):
    tremor = 1.0 + 0.02 * math.sin(2 * math.pi * 6.0 * t)
    f = freq * tremor
    val = (math.sin(2 * math.pi * f * t) * 0.55 +
           math.sin(2 * math.pi * f * 2 * t) * 0.25 +
           math.sin(2 * math.pi * f * 3 * t) * 0.12 +
           math.sin(2 * math.pi * f * 4 * t) * 0.05)
    return val

def write_wav(filename, samples_left, samples_right):
    wav_path = filename.replace('.mp3', '.wav')
    with wave.open(wav_path, 'wb') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for i in range(len(samples_left)):
            l = max(-32767, min(32767, int(samples_left[i] * 32767)))
            r = max(-32767, min(32767, int(samples_right[i] * 32767)))
            frames.extend(struct.pack('<hh', l, r))
        f.writeframes(frames)
    
    mp3_path = filename
    subprocess.run([
        'ffmpeg', '-y', '-i', wav_path, 
        '-af', 'afade=t=in:ss=0:d=0.5,afade=t=out:st=28.5:d=1.5',
        '-b:a', '128k', mp3_path
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(wav_path):
        os.remove(wav_path)
    print(f"Generated: {mp3_path}")

DURATION = 30.0
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

D5 = 587.33
F5 = 698.46
G5 = 783.99
A5 = 880.00
C5 = 523.25

# ============================================================================
# 7. Nagada Sang Dhol (30s)
# ============================================================================
print("Synthesizing 7. Nagada Sang Dhol...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
beat_nagada = 60.0 / 136.0

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    b_idx = int(t / beat_nagada)
    t_in_beat = t % beat_nagada
    
    nagada_hit = t_in_beat if (b_idx % 2 == 0) else (t_in_beat if (b_idx % 4 == 3) else 1.0)
    nagada = 0.0
    if nagada_hit < 0.35:
        nagada = generate_dhol_bass(nagada_hit) * 0.6
        
    tasha_t = t % (beat_nagada / 2.0)
    tasha = (generate_dhol_slap(tasha_t) + (random.random() - 0.5) * 0.2) * 0.35
    
    clap_t = t_in_beat
    clap = (random.random() * 2.0 - 1.0) * math.exp(-clap_t * 30.0) * 0.25
    
    riff_notes = [D5, F5, G5, A5, C5, A5, G5, F5]
    riff_n = riff_notes[int(t * 8.0) % len(riff_notes)]
    riff_t = t % 0.125
    shehnai = (math.sin(2 * math.pi * riff_n * t) * 0.4 +
               math.sin(2 * math.pi * riff_n * 2 * t) * 0.25) * math.exp(-riff_t * 6.0) * 0.3

    sig = nagada + tasha + clap + shehnai
    left[i] = sig + clap * 0.1
    right[i] = sig - clap * 0.1

write_wav(os.path.join(OUT_DIR, "nagada-sang-dhol.mp3"), left, right)

# ============================================================================
# 8. Holy Shankh & 108 Temple Bells (30s)
# ============================================================================
print("Synthesizing 8. Holy Shankh & 108 Bells...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    
    shankh_cycle = t % 10.0
    shankh = 0.0
    if 0.5 <= shankh_cycle <= 6.5:
        s_t = shankh_cycle - 0.5
        env = min(1.0, s_t * 2.0) * min(1.0, (6.0 - s_t) * 1.5)
        shankh = generate_shankh(s_t, freq=216.0) * env * 0.45
        
    b1 = generate_bell(t % 0.6, 1200.0, decay=4.0) * 0.22
    b2 = generate_bell((t + 0.3) % 1.2, 880.0, decay=3.0) * 0.25
    b3 = generate_bell((t + 0.8) % 2.4, 440.0, decay=1.8) * 0.3
    
    om = (math.sin(2 * math.pi * 108.0 * t) * 0.18 +
          math.sin(2 * math.pi * 216.0 * t) * 0.08)

    sig = shankh + b1 + b2 + b3 + om
    left[i] = sig + b1 * 0.15 - b2 * 0.1
    right[i] = sig - b1 * 0.15 + b2 * 0.1

write_wav(os.path.join(OUT_DIR, "shankh-108-bells.mp3"), left, right)

# ============================================================================
# 9. Dhak & Dhunuchi Bengali Utsav (30s)
# ============================================================================
print("Synthesizing 9. Dhak & Dhunuchi...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
beat_dhak = 60.0 / 125.0

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    t_bar = (t % (beat_dhak * 4.0)) / beat_dhak
    
    dhak_hit = 0.0
    sub_t = t % beat_dhak
    if t_bar < 0.25 or (2.0 <= t_bar < 2.25):
        dhak_hit = generate_dhol_bass(sub_t) * 0.55
        
    stick_t = t % (beat_dhak / 4.0)
    stick = (math.sin(2 * math.pi * 650 * stick_t) + (random.random() - 0.5) * 0.6) * math.exp(-stick_t * 30.0) * 0.35
    
    kaansi_t = t % beat_dhak
    kaansi = (math.sin(2 * math.pi * 2200 * kaansi_t) * 0.5 +
              math.sin(2 * math.pi * 3100 * kaansi_t) * 0.3) * math.exp(-kaansi_t * 12.0) * 0.25
              
    shankh_t = t % 8.0
    shankh = 0.0
    if shankh_t < 3.0:
        s_env = min(1.0, shankh_t * 2.0) * min(1.0, (3.0 - shankh_t) * 2.0)
        shankh = generate_shankh(shankh_t, freq=240.0) * s_env * 0.3

    sig = dhak_hit + stick + kaansi + shankh
    left[i] = sig + kaansi * 0.12
    right[i] = sig - kaansi * 0.12

write_wav(os.path.join(OUT_DIR, "dhak-dhunuchi-beats.mp3"), left, right)
print("Finished remaining tracks!")
