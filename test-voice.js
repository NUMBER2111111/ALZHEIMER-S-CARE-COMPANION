import { ElevenLabsService } from './server/services/elevenlabs-service.js';

async function testVoiceService() {
  console.log('Testing ElevenLabs Voice Service...');
  
  try {
    // Test basic text-to-speech
    console.log('1. Testing basic text-to-speech...');
    const response = await ElevenLabsService.textToSpeech('Hello! This is a test of the ElevenLabs voice service.');
    console.log('✓ Basic TTS successful:', response.contentType, response.audioBuffer.length, 'bytes');
    
    // Test companion speech with emotional context
    console.log('2. Testing companion speech with emotional context...');
    const companionResponse = await ElevenLabsService.generateCompanionSpeech(
      'Good morning! How are you feeling today?', 
      'encouraging'
    );
    console.log('✓ Companion TTS successful:', companionResponse.contentType, companionResponse.audioBuffer.length, 'bytes');
    
    // Test usage check
    console.log('3. Testing usage check...');
    const usage = await ElevenLabsService.checkUsage();
    console.log('✓ Usage check successful:', usage);
    
    // Test available voices
    console.log('4. Testing available voices...');
    const voices = await ElevenLabsService.getHealthcareVoices();
    console.log('✓ Available voices:', voices.length, 'voices found');
    
    console.log('\n🎉 All ElevenLabs voice tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Voice service test failed:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.status, error.response.data);
    }
  }
}

testVoiceService();