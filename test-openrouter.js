// Simple OpenRouter API test
require('dotenv').config({ path: '.env' });

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not found in .env');
    process.exit(1);
  }
  
  console.log('✓ API Key found:', apiKey.substring(0, 20) + '...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Voice Agent Test'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'user', content: 'Say "API key works!" in exactly 3 words.' }
        ]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      process.exit(1);
    }
    
    console.log('✅ OpenRouter API Key is VALID!');
    console.log('Response:', data.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testOpenRouter();
