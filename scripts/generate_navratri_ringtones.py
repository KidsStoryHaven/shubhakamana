import math
import struct
import wave
import subprocess
import os
import random

SAMPLE_RATE = 44100
OUT_DIR = "public/audio"
os.makedirs(OUT_DIR, exist_ok=True)

# Helper synthesis functions
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

def generate_flute(freq, t, vibrato_speed=5.5, vibrato_depth=0.015):
    # Bansuri tone: fundamental + subtle 2nd, 3rd harmonic + gentle vibrato + breath
    vib = 1.0 + vibrato_depth * math.sin(2 * math.pi * vibrato_speed * t)
    f = freq * vib
    tone = (math.sin(2 * math.pi * f * t) * 0.7 +
            math.sin(2 * math.pi * f * 2 * t) * 0.2 +
            math.sin(2 * math.pi * f * 3 * t) * 0.08)
    return tone

def generate_dhol_bass(t_hit, duration=0.45):
    if t_hit < 0 or t_hit > duration: return 0.0
    # Pitch drop from 110Hz to 55Hz
    freq = 55.0 + 55.0 * math.exp(-t_hit * 12.0)
    env = math.exp(-t_hit * 7.0)
    return math.sin(2 * math.pi * freq * t_hit) * env

def generate_dhol_slap(t_hit, duration=0.15):
    if t_hit < 0 or t_hit > duration: return 0.0
    env = math.exp(-t_hit * 25.0)
    # Sharp crack + snare noise
    val = (math.sin(2 * math.pi * 320 * t_hit) * 0.4 +
           math.sin(2 * math.pi * 780 * t_hit) * 0.3 +
           (random.random() * 2.0 - 1.0) * 0.3)
    return val * env

def generate_manjira(t_hit, duration=0.6):
    if t_hit < 0 or t_hit > duration: return 0.0
    env = math.exp(-t_hit * 8.0)
    val = (math.sin(2 * math.pi * 2800 * t_hit) * 0.5 +
           math.sin(2 * math.pi * 3500 * t_hit) * 0.3 +
           math.sin(2 * math.pi * 5600 * t_hit) * 0.2)
    return val * env

def generate_shankh(t, freq=220.0):
    # Conch shell acoustic model: warm resonant horn with gentle breath tremor
    tremor = 1.0 + 0.02 * math.sin(2 * math.pi * 6.0 * t)
    f = freq * tremor
    val = (math.sin(2 * math.pi * f * t) * 0.55 +
           math.sin(2 * math.pi * f * 2 * t) * 0.25 +
           math.sin(2 * math.pi * f * 3 * t) * 0.12 +
           math.sin(2 * math.pi * f * 4 * t) * 0.05)
    return val

def generate_tanpura(t, root=130.81): # C3
    # 4 strings: Pa (G3), Sa (C4), Sa (C4), Kharaj Sa (C3)
    cycle = 3.2 # 4 strings plucked in sequence over 3.2s
    t_mod = t % cycle
    sig = 0.0
    # String 1: Pa (G3, 196Hz) at t=0.0
    if t_mod >= 0:
        sig += generate_bell(t_mod, root * 1.5, decay=1.2) * 0.25
    # String 2: Sa (C4, 261.6Hz) at t=0.8
    if t_mod >= 0.8:
        sig += generate_bell(t_mod - 0.8, root * 2.0, decay=1.2) * 0.25
    # String 3: Sa (C4, 261.6Hz) at t=1.6
    if t_mod >= 1.6:
        sig += generate_bell(t_mod - 1.6, root * 2.0, decay=1.2) * 0.25
    # String 4: Kharaj Sa (C3, 130.8Hz) at t=2.4
    if t_mod >= 2.4:
        sig += generate_bell(t_mod - 2.4, root, decay=0.9) * 0.35
    return sig

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

def should_skip(filename):
    return os.path.exists(filename) and os.path.getsize(filename) > 10000

DURATION = 30.0
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

# Note frequencies (Hz)
C4 = 261.63
D4 = 293.66
E4 = 329.63
F4 = 349.23
G4 = 392.00
A4 = 440.00
B4 = 493.88
C5 = 523.25
D5 = 587.33
E5 = 659.25
F5 = 698.46
G5 = 783.99
A5 = 880.00

# ============================================================================
# 1. Chalo Bulawa Aaya Hai (30s)
# ============================================================================
print("Synthesizing 1. Chalo Bulawa Aaya Hai...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
# Tempo 120 BPM -> Beat = 0.5s
# Bhajan melody: C4, E4, G4, A4, G4, E4, D4, C4 (Chalo Bulawa Aaya Hai)
melody_notes = [
    (C4, 0.5), (E4, 0.5), (G4, 1.0), (A4, 0.5), (G4, 0.5), (E4, 1.0),
    (D4, 0.5), (E4, 0.5), (D4, 1.0), (C4, 1.0), (C4, 1.0),
    (G4, 0.5), (G4, 0.5), (A4, 0.5), (C5, 1.0), (A4, 0.5), (G4, 1.0),
    (E4, 0.5), (G4, 0.5), (A4, 0.5), (G4, 0.5), (E4, 0.5), (D4, 0.5), (C4, 1.5)
]
melody_total_time = sum(d for _, d in melody_notes)

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    beat = t * 2.0 # 120 BPM
    t_in_beat = beat % 1.0
    
    # Dholak rhythm (Keherwa)
    t_bar = (t * 2.0) % 4.0
    # Bass on 0 and 2.5
    dhol_b = generate_dhol_bass(t_bar * 0.5 % 1.0) * 0.4
    # Slap on 1 and 3
    dhol_s = generate_dhol_slap((t_bar - 1.0) * 0.5 % 1.0) * 0.35 + generate_dhol_slap((t_bar - 3.0) * 0.5 % 1.0) * 0.35
    # Manjira on every beat
    manjira = generate_manjira(t_in_beat * 0.5) * 0.18
    # Temple bell every 4 beats
    bell = generate_bell(t % 2.0, 1174.66, decay=2.5) * 0.2
    
    # Melody
    t_mel = t % melody_total_time
    cur_t = 0.0
    cur_note = C4
    for note, dur in melody_notes:
        if cur_t <= t_mel < cur_t + dur:
            cur_note = note
            note_t = t_mel - cur_t
            note_env = min(1.0, note_t * 20.0) * max(0.0, 1.0 - (note_t / dur) * 0.25)
            lead = generate_flute(cur_note, note_t) * note_env * 0.45
            break
        cur_t += dur
    else:
        lead = 0.0

    # Harmony drone (C major)
    drone = (math.sin(2 * math.pi * C4 * t) * 0.08 +
             math.sin(2 * math.pi * G4 * t) * 0.06 +
             math.sin(2 * math.pi * C5 * t) * 0.04)

    sig = lead + dhol_b + dhol_s + manjira + bell + drone
    left[i] = sig * 0.95 + manjira * 0.15
    right[i] = sig * 0.95 - manjira * 0.15

write_wav(os.path.join(OUT_DIR, "chalo-bulawa-aaya-hai.mp3"), left, right)

# ============================================================================
# 2. Aigiri Nandini Trance (30s)
# ============================================================================
print("Synthesizing 2. Aigiri Nandini Trance...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
# 134 BPM -> Beat = 0.4477s
# Fast rhythmic Mahishasuramardini trance cadence in D minor (D4, F4, G4, A4)
bpm_aigiri = 134.0
beat_dur = 60.0 / bpm_aigiri
aigiri_notes = [
    D4, D4, F4, G4, A4, A4, G4, F4, G4, A4, F4, D4,
    D4, F4, G4, A4, C5, A4, G4, F4, G4, F4, D4, D4
]
note_len = beat_dur * 0.5 # Eighth notes

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    beat = t / beat_dur
    t_in_beat = (t % beat_dur) / beat_dur
    
    # Heavy Trance Kick on every beat
    kick_t = t % beat_dur
    kick = math.sin(2 * math.pi * (45.0 + 90.0 * math.exp(-kick_t * 30.0)) * kick_t) * math.exp(-kick_t * 9.0) * 0.55
    
    # Damru roll (triplets)
    damru_t = (t % (beat_dur / 3.0))
    damru = (random.random() * 2.0 - 1.0) * math.exp(-damru_t * 35.0) * 0.25
    
    # Bassline (D - D - F - G)
    bass_note = D4 * 0.5 if (int(beat / 4) % 2 == 0) else (D4 * 0.5 if int(beat) % 4 < 2 else F4 * 0.5)
    bass = math.sin(2 * math.pi * bass_note * t) * 0.35
    
    # Lead synth chant
    note_idx = int((t % (len(aigiri_notes) * note_len)) / note_len)
    f_lead = aigiri_notes[note_idx]
    lead_t = t % note_len
    lead_env = math.exp(-lead_t * 6.0)
    # Sawtooth/square rich lead
    lead = (math.sin(2 * math.pi * f_lead * t) * 0.4 +
            math.sin(2 * math.pi * f_lead * 2 * t) * 0.25 +
            math.sin(2 * math.pi * f_lead * 3 * t) * 0.15) * lead_env * 0.4
            
    # Hi-hat on offbeat
    hat_t = (t + beat_dur * 0.5) % beat_dur
    hat = (random.random() * 2.0 - 1.0) * math.exp(-hat_t * 40.0) * 0.18
    
    # Crash on bar 1 (every 4 beats)
    crash_t = t % (beat_dur * 4.0)
    crash = (random.random() * 2.0 - 1.0) * math.exp(-crash_t * 2.5) * 0.15

    sig = kick + damru + bass + lead + hat + crash
    left[i] = sig + lead * 0.1
    right[i] = sig - lead * 0.1

write_wav(os.path.join(OUT_DIR, "aigiri-nandini-trance.mp3"), left, right)

# ============================================================================
# 3. Dholida Garba Beats (30s)
# ============================================================================
print("Synthesizing 3. Dholida Garba Beats...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
# 116 BPM Gujarati Garba (Heek & Chanchar rhythm)
bpm_garba = 116.0
garba_beat = 60.0 / bpm_garba

# Folk Garba melody (Raag Bhupali / Bilawal): G4, A4, B4, D5, E5, D5, B4, A4, G4
garba_melody = [
    (G4, 0.5), (G4, 0.5), (A4, 0.5), (B4, 0.5), (D5, 1.0), (B4, 0.5), (A4, 0.5),
    (G4, 0.5), (A4, 0.5), (B4, 1.0), (A4, 0.5), (G4, 0.5), (E4, 1.0),
    (D4, 0.5), (E4, 0.5), (G4, 1.0), (A4, 0.5), (B4, 0.5), (G4, 1.5)
]
garba_mel_dur = sum(d for _, d in garba_melody) * (garba_beat / 0.5)

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    bar_t = (t % (garba_beat * 4.0)) / garba_beat # 0 to 4 beats
    
    # Dhol Boom on beat 0 and beat 2.5
    dhol_b1 = generate_dhol_bass(t % (garba_beat * 4.0)) * 0.5
    dhol_b2 = generate_dhol_bass((t - garba_beat * 2.5) % (garba_beat * 4.0)) * 0.4
    
    # Dhol wooden slap on beat 1 and beat 3
    dhol_s1 = generate_dhol_slap((t - garba_beat * 1.0) % (garba_beat * 4.0)) * 0.4
    dhol_s2 = generate_dhol_slap((t - garba_beat * 3.0) % (garba_beat * 4.0)) * 0.4
    
    # Dandiya wooden sticks click (Taali / sticks click on beat 1, 2, 3, 4)
    stick_t = t % garba_beat
    stick = (math.sin(2 * math.pi * 1200 * stick_t) + (random.random() - 0.5)) * math.exp(-stick_t * 50.0) * 0.22
    
    # Manjira brass shimmer on offbeats
    manj_t = (t + garba_beat * 0.5) % garba_beat
    manj = generate_manjira(manj_t) * 0.2
    
    # Flute melody
    t_mel = t % garba_mel_dur
    cur_t = 0.0
    lead_flute = 0.0
    for note, dur in garba_melody:
        scaled_dur = dur * (garba_beat / 0.5)
        if cur_t <= t_mel < cur_t + scaled_dur:
            n_t = t_mel - cur_t
            lead_flute = generate_flute(note, n_t) * math.sin(math.pi * min(1.0, n_t / scaled_dur)) * 0.4
            break
        cur_t += scaled_dur

    sig = dhol_b1 + dhol_b2 + dhol_s1 + dhol_s2 + stick + manj + lead_flute
    left[i] = sig + stick * 0.1
    right[i] = sig - stick * 0.1

write_wav(os.path.join(OUT_DIR, "dholida-garba-beats.mp3"), left, right)

# ============================================================================
# 4. O Sheronwali Bigdi Bana De (30s)
# ============================================================================
print("Synthesizing 4. O Sheronwali...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
# 126 BPM - Classic Punjabi Dholak Bhakti beat
sher_beat = 60.0 / 126.0
# Hook melody: E4, G4, A4, B4, C5, B4, A4, G4, E4
sher_notes = [
    (E4, 0.5), (G4, 0.5), (A4, 1.0), (B4, 0.5), (C5, 1.0), (B4, 0.5), (A4, 1.0),
    (G4, 0.5), (A4, 0.5), (G4, 0.5), (E4, 1.5),
    (A4, 0.5), (B4, 0.5), (C5, 1.0), (D5, 0.5), (C5, 0.5), (B4, 1.0), (A4, 1.5)
]
sher_mel_dur = sum(d for _, d in sher_notes) * sher_beat

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    t_bar = t % (sher_beat * 4.0)
    
    # Punjabi Dholak Chaal (Dha-Ge-Na-Ti-Na-Ka-Dhin-Na)
    dh_b = generate_dhol_bass(t_bar) * 0.45 + generate_dhol_bass((t_bar - sher_beat * 2.0) % (sher_beat * 4.0)) * 0.35
    dh_s = generate_dhol_slap((t_bar - sher_beat * 1.0) % (sher_beat * 4.0)) * 0.35 + generate_dhol_slap((t_bar - sher_beat * 3.0) % (sher_beat * 4.0)) * 0.35
    ghungroo = (random.random() - 0.5) * math.exp(-((t % (sher_beat * 0.5)) * 40.0)) * 0.18
    
    # Temple gong on bar start
    gong = generate_bell(t % (sher_beat * 8.0), 220.0, decay=1.2) * 0.25
    
    # Melody
    t_mel = t % sher_mel_dur
    cur_t = 0.0
    lead = 0.0
    for note, dur in sher_notes:
        scaled_dur = dur * sher_beat
        if cur_t <= t_mel < cur_t + scaled_dur:
            n_t = t_mel - cur_t
            # Shehnai/reed timbre
            vib = 1.0 + 0.018 * math.sin(2 * math.pi * 6.0 * n_t)
            lead = (math.sin(2 * math.pi * note * vib * n_t) * 0.5 +
                    math.sin(2 * math.pi * note * 2 * vib * n_t) * 0.3 +
                    math.sin(2 * math.pi * note * 3 * vib * n_t) * 0.15) * 0.38
            break
        cur_t += scaled_dur

    sig = dh_b + dh_s + ghungroo + gong + lead
    left[i] = sig + ghungroo * 0.1
    right[i] = sig - ghungroo * 0.1

write_wav(os.path.join(OUT_DIR, "o-sheronwali.mp3"), left, right)

# ============================================================================
# 5. Ya Devi Sarvabhuteshu / Durga Stuti (30s)
# ============================================================================
print("Synthesizing 5. Durga Stuti...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
# Serene Raag Yaman: Ni3, Re4, Ga4, Ma'4, Pa4, Dha4, Ni4, Sa5
# Tanpura drone in C# + Meditative Tibetan bowl + gentle temple bell
tanpura_root = 138.59 # C#3

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    
    # Tanpura 4-string drone
    tanp = generate_tanpura(t, root=tanpura_root) * 0.35
    
    # Cosmic Om low resonant hum (136.1 Hz)
    om_hum = (math.sin(2 * math.pi * 136.1 * t) * 0.2 +
              math.sin(2 * math.pi * 272.2 * t) * 0.08) * (1.0 + 0.05 * math.sin(t * 1.5))
              
    # Tibetan Singing Bowl (intermittent every 6s)
    bowl_t = t % 6.0
    bowl = math.sin(2 * math.pi * 432.0 * bowl_t) * math.exp(-bowl_t * 0.8) * 0.22
    
    # Sweet temple bell chime every 3s
    bell = generate_bell(t % 3.0, 1046.50, decay=2.0) * 0.18
    
    # Meditative Bansuri notes (Slow serene phrases)
    # Phrase: Sa -> Re -> Ga -> Pa -> Dha -> Sa
    phrase = [
        (277.18, 4.0), # C#4
        (311.13, 3.0), # D#4
        (349.23, 4.0), # F4
        (415.30, 4.0), # G#4
        (466.16, 3.0), # A#4
        (554.37, 5.0)  # C#5
    ]
    ph_total = sum(d for _, d in phrase)
    t_ph = t % ph_total
    cur_t = 0.0
    flute = 0.0
    for note, dur in phrase:
        if cur_t <= t_ph < cur_t + dur:
            n_t = t_ph - cur_t
            env = math.sin(math.pi * min(1.0, n_t / dur))
            flute = generate_flute(note, n_t, vibrato_speed=4.5, vibrato_depth=0.02) * env * 0.4
            break
        cur_t += dur

    sig = tanp + om_hum + bowl + bell + flute
    left[i] = sig + bell * 0.1
    right[i] = sig - bell * 0.1

write_wav(os.path.join(OUT_DIR, "durga-stuti-mantra.mp3"), left, right)

# ============================================================================
# 6. Meri Maa Ke Barabar Koi Nahi (30s)
# ============================================================================
print("Synthesizing 6. Meri Maa Ke Barabar...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
# Emotional, soulful acoustic bhajan
# Dadra taal 6-beat sway at 90 BPM
beat_meri = 60.0 / 90.0
# Flute melody: G4, C5, B4, A4, G4, E4, F4, G4
meri_notes = [
    (G4, 1.0), (C5, 1.5), (B4, 0.5), (A4, 1.0), (G4, 2.0),
    (E4, 1.0), (F4, 1.0), (G4, 1.5), (A4, 0.5), (G4, 2.0),
    (C5, 1.0), (D5, 1.0), (E5, 1.5), (D5, 0.5), (C5, 2.0)
]
meri_dur = sum(d for _, d in meri_notes) * beat_meri

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    bar_t = (t % (beat_meri * 6.0)) / beat_meri # 6-beat Dadra
    
    # Soft Dholak bass on beat 0 and beat 3
    b_t = (t % (beat_meri * 3.0))
    dhol_b = generate_dhol_bass(b_t) * 0.35
    # Soft tabla slap on beat 1, 2, 4, 5
    s_t = (t + beat_meri) % beat_meri
    tabla_s = generate_dhol_slap(s_t) * 0.2
    
    # Santoor arpeggio shimmer
    santoor_n = [C4, E4, G4, C5, E5][int(t * 4.0) % 5]
    sant_t = (t % 0.25)
    santoor = math.sin(2 * math.pi * santoor_n * sant_t) * math.exp(-sant_t * 12.0) * 0.15
    
    # Emotional Solo Bansuri Flute
    t_mel = t % meri_dur
    cur_t = 0.0
    lead_flute = 0.0
    for note, dur in meri_notes:
        scaled_dur = dur * beat_meri
        if cur_t <= t_mel < cur_t + scaled_dur:
            n_t = t_mel - cur_t
            env = math.sin(math.pi * min(1.0, n_t / scaled_dur))
            lead_flute = generate_flute(note, n_t, vibrato_speed=5.2, vibrato_depth=0.025) * env * 0.45
            break
        cur_t += scaled_dur

    sig = dhol_b + tabla_s + santoor + lead_flute
    left[i] = sig + santoor * 0.1
    right[i] = sig - santoor * 0.1

write_wav(os.path.join(OUT_DIR, "meri-maa-ke-barabar.mp3"), left, right)

# ============================================================================
# 7. Nagada Sang Dhol (30s)
# ============================================================================
print("Synthesizing 7. Nagada Sang Dhol...")
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES
# High energy 136 BPM Garba / Dhol Tasha
beat_nagada = 60.0 / 136.0

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    b_idx = int(t / beat_nagada)
    t_in_beat = t % beat_nagada
    
    # Heavy Nagada Boom (Pitch drop 140Hz -> 50Hz)
    nagada_hit = t_in_beat if (b_idx % 2 == 0) else (t_in_beat if (b_idx % 4 == 3) else 1.0)
    nagada = 0.0
    if nagada_hit < 0.35:
        nagada = generate_dhol_bass(nagada_hit) * 0.6
        
    # Snare / Tasha roll
    tasha_t = t % (beat_nagada / 2.0)
    tasha = (generate_dhol_slap(tasha_t) + (random.random() - 0.5) * 0.2) * 0.35
    
    # Handclaps on every beat
    clap_t = t_in_beat
    clap = (random.random() * 2.0 - 1.0) * math.exp(-clap_t * 30.0) * 0.25
    
    # High-register festive Shehnai riff (Fast notes)
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
    
    # Shankh blow (starts at 0.5s, blows for 5s, rests, blows again at 12s, 22s)
    shankh_cycle = t % 10.0
    shankh = 0.0
    if 0.5 <= shankh_cycle <= 6.5:
        s_t = shankh_cycle - 0.5
        env = min(1.0, s_t * 2.0) * min(1.0, (6.0 - s_t) * 1.5)
        shankh = generate_shankh(s_t, freq=216.0) * env * 0.45
        
    # 108 Temple Bells ringing (staggered multiple bells)
    # Bell 1: high gong every 0.6s
    b1 = generate_bell(t % 0.6, 1200.0, decay=4.0) * 0.22
    # Bell 2: medium bell every 1.2s
    b2 = generate_bell((t + 0.3) % 1.2, 880.0, decay=3.0) * 0.25
    # Bell 3: heavy brass sanctum bell every 2.4s
    b3 = generate_bell((t + 0.8) % 2.4, 440.0, decay=1.8) * 0.3
    
    # Deep Om drone
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
# Accelerating Kolkata Dhak rhythm (125 BPM)
beat_dhak = 60.0 / 125.0

for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    t_bar = (t % (beat_dhak * 4.0)) / beat_dhak
    
    # Dhak heavy drum (Double-head hollow cylinder)
    # Rhythm: Dha - Ti-Ti - Dha - Ti-Ti - Dha-Ge-Na
    dhak_hit = 0.0
    sub_t = t % beat_dhak
    # Big hit on beat 0 and beat 2
    if t_bar < 0.25 or (2.0 <= t_bar < 2.25):
        dhak_hit = generate_dhol_bass(sub_t) * 0.55
    # Fast stick taps on offbeats (cane stick on stretched goat skin)
    stick_t = t % (beat_dhak / 4.0)
    stick = (math.sin(2 * math.pi * 650 * stick_t) + (random.random() - 0.5) * 0.6) * math.exp(-stick_t * 30.0) * 0.35
    
    # Brass Kaansi / Gong clanging on every beat
    kaansi_t = t % beat_dhak
    kaansi = (math.sin(2 * math.pi * 2200 * kaansi_t) * 0.5 +
              math.sin(2 * math.pi * 3100 * kaansi_t) * 0.3) * math.exp(-kaansi_t * 12.0) * 0.25
              
    # Intermittent Shankh blast every 8s
    shankh_t = t % 8.0
    shankh = 0.0
    if shankh_t < 3.0:
        s_env = min(1.0, shankh_t * 2.0) * min(1.0, (3.0 - shankh_t) * 2.0)
        shankh = generate_shankh(shankh_t, freq=240.0) * s_env * 0.3

    sig = dhak_hit + stick + kaansi + shankh
    left[i] = sig + kaansi * 0.12
    right[i] = sig - kaansi * 0.12

write_wav(os.path.join(OUT_DIR, "dhak-dhunuchi-beats.mp3"), left, right)

print("All 9 new hit ringtones successfully synthesized!")
