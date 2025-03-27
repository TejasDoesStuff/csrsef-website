export async function POST(req: Request) {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("Error: OPENAI_API_KEY is not set");
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const { message } = await req.json();
  
      if (!message) {
        console.error("Error: No message provided");
        return new Response(JSON.stringify({ error: "Message is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      console.log("Received message:", message);
  
      const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message + " Take the user's input sentence and transform it into a engineered prompt for an AI chatbot. The final output should be a prompt, not an answer. Make sure the prompt includes the following: Start by assigning the AI a relevant expert role. Then, restate the problem that the user is having. Next, create an outline for the AI to follow when generating a response, such as an acknowledgment of the student’s feelings, three evidence-based strategies relating to their situation, a recommended technique relating to their situation, and a reminder on when to seek additional support. Next, create a specific length length and tone based on the users problem. Do not generate an answer to the student’s question, just output the restructured prompt." }],
          temperature: 0.7,
        }),
      });
  
      if (!openAiResponse.ok) {
        const errorText = await openAiResponse.text();
        console.error("OpenAI API Error:", errorText);
        return new Response(JSON.stringify({ error: `OpenAI API error: ${errorText}` }), {
          status: openAiResponse.status,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const data = await openAiResponse.json();
      console.log("OpenAI API Response:", data);
  
      const reply = data.choices?.[0]?.message?.content || "No response from AI";
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (error) {
      console.error("Internal Server Error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }