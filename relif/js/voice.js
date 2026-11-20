/* ==========================================================================
   ReliefOS — Browser Speech Synthesis Guidance System
   Permits auditory reading of critical preparedness guidance.
   Supports English (en-IN/en-US) and Bengali (bn-IN/bn-BD) where system voices exist.
   ========================================================================== */

import { getLanguage, t } from './translations.js';
import { Storage } from './storage.js';

let synth = null;
let voices = [];
let isSpeaking = false;
let isPaused = false;
let currentUtterance = null;

export const VoiceSystem = {
  init() {
    if ('speechSynthesis' in window) {
      synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    } else {
      console.warn('[ReliefOS Voice] Speech Synthesis API not supported in this browser.');
    }
  },

  loadVoices() {
    if (!synth) return;
    voices = synth.getVoices();
  },

  isSupported() {
    return synth !== null;
  },

  getAvailableVoices() {
    return voices;
  },

  getBestVoiceForCurrentLanguage() {
    const lang = getLanguage();
    if (!voices.length) return null;

    if (lang === 'bn') {
      // Find Bengali voice
      const bnVoice = voices.find(v => v.lang.startsWith('bn'));
      if (bnVoice) return bnVoice;
    }

    // Default to Indian English or English
    const inEnVoice = voices.find(v => v.lang === 'en-IN');
    if (inEnVoice) return inEnVoice;

    const enVoice = voices.find(v => v.lang.startsWith('en'));
    return enVoice || voices[0] || null;
  },

  speak(text, onStartCallback = null, onEndCallback = null) {
    if (!synth) {
      alert(t('voiceNotSupported') || 'Speech Synthesis is not supported on this browser.');
      return;
    }

    this.stop();

    if (!text || text.trim() === '') return;

    const settings = Storage.getSettings();
    const rate = settings.voiceSpeed || 1.0;

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = rate;
    currentUtterance.pitch = 1.0;

    const voice = this.getBestVoiceForCurrentLanguage();
    if (voice) {
      currentUtterance.voice = voice;
      currentUtterance.lang = voice.lang;
    } else {
      currentUtterance.lang = getLanguage() === 'bn' ? 'bn-IN' : 'en-IN';
    }

    currentUtterance.onstart = () => {
      isSpeaking = true;
      isPaused = false;
      this.updateUIState(true);
      if (onStartCallback) onStartCallback();
    };

    currentUtterance.onend = () => {
      isSpeaking = false;
      isPaused = false;
      this.updateUIState(false);
      if (onEndCallback) onEndCallback();
    };

    currentUtterance.onerror = (err) => {
      console.warn('[ReliefOS Voice] Utterance error:', err);
      isSpeaking = false;
      isPaused = false;
      this.updateUIState(false);
      if (onEndCallback) onEndCallback();
    };

    synth.speak(currentUtterance);
  },

  pause() {
    if (synth && isSpeaking && !isPaused) {
      synth.pause();
      isPaused = true;
      this.updateUIState(false, true);
    }
  },

  resume() {
    if (synth && isPaused) {
      synth.resume();
      isPaused = false;
      this.updateUIState(true, false);
    }
  },

  stop() {
    if (synth) {
      synth.cancel();
      isSpeaking = false;
      isPaused = false;
      this.updateUIState(false);
    }
  },

  updateUIState(speaking, paused = false) {
    const micIcons = document.querySelectorAll('.voice-status-icon');
    micIcons.forEach(icon => {
      if (speaking) {
        icon.classList.add('speaking');
      } else {
        icon.classList.remove('speaking');
      }
    });

    const activeSpeakBtns = document.querySelectorAll('.btn-read-aloud');
    activeSpeakBtns.forEach(btn => {
      if (speaking) {
        btn.classList.add('btn-danger');
        btn.classList.remove('btn-secondary');
        const textSpan = btn.querySelector('span');
        if (textSpan) textSpan.textContent = t('stopAudioBtn');
      } else {
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
        const textSpan = btn.querySelector('span');
        if (textSpan) textSpan.textContent = t('readAloudBtn');
      }
    });
  }
};
