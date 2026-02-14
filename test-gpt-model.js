// Test GPT model availability
require('dotenv').config({ path: '.env' });

async function testGPTModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  const modelToTest = 'gpt-4o-mini'; // Current model
  const alternativeModel = 'gpt-4o-mini-2024-07-18'; // Alternative with date
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in .env');
    process.exit(1);
  }
  
  console.log('✓ API Key found');
  console.log('🧪 Testing model:', modelToTest);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToTest,
        messages: [
          { role: 'user', content: 'Say "Model works!" in exactly 2 words.' }
        ],
        max_tokens: 10
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', JSON.stringify(data, null, 2));
      console.log('\n🔄 Trying alternative model:', alternativeModel);
      
      // Try alternative
      const response2 = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: alternativeModel,
          messages: [{ role: 'user', content: 'Say "Model works!" in exactly 2 words.' }],
          max_tokens: 10
        })
      });
      
      const data2 = await response2.json();
      if (!response2.ok) {
        console.error('❌ Alternative also failed:', JSON.stringify(data2, null, 2));
        process.exit(1);
      }
      
      console.log('✅ Alternative model WORKS!');
      console.log('Model:', alternativeModel);
      console.log('Response:', data2.choices[0].message.content);
      console.log('\n💡 Update your service to use:', alternativeModel);
      return;
    }
    
    console.log('✅ Model is VALID and WORKING!');
    console.log('Model:', data.model);
    console.log('Response:', data.choices[0].message.content);
    console.log('Tokens used:', data.usage.total_tokens);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testGPTModel();
