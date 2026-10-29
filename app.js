const API_BASE = "https://sulaf-ai-router.YOUR_SUBDOMAIN.workers.dev";
const form = document.querySelector("#chat-form");
const promptInput = document.querySelector("#prompt");
const sendButton = document.querySelector("#send");
const messagesEl = document.querySelector("#messages");
const providerSelect = document.querySelector("#provider");
const healthLabel = document.querySelector("#health-label");
const providerNote = document.querySelector("#provider-note");
const conversation = [];

function addBubble(role, content, meta = "") {
  const empty = messagesEl.querySelector(".empty");
  if (empty) empty.remove();
  const bubble = document.createElement("div");
  bubble.className = "bubble " + role;
  if (meta) {
    const label = document.createElement("span");
    label.className = "meta";
    label.textContent = meta;
    bubble.appendChild(label);
  }
  bubble.appendChild(document.createTextNode(content));
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return bubble;
}

async function checkHealth() {
  if (API_BASE.includes("YOUR_SUBDOMAIN")) {
    healthLabel.textContent = "بانتظار نشر الخادم";
    providerNote.textContent = "سيتم تفعيل الاتصال بعد النشر";
    return;
  }
  try {
    const response = await fetch(API_BASE + "/health");
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error("health_failed");
    healthLabel.textContent = "الخادم متصل";
    document.querySelector(".status").classList.add("ok");
    const active = Object.entries(data.providers || {}).filter(([, value]) => value).map(([key]) => key);
    providerNote.textContent = active.length + " مزوّد/مسار مهيأ";
  } catch {
    healthLabel.textContent = "الخادم غير متاح";
    providerNote.textContent = "تحقق من نشر الخادم";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = promptInput.value.trim();
  if (!content) return;
  if (API_BASE.includes("YOUR_SUBDOMAIN")) {
    addBubble("assistant", "واجهة المستخدم جاهزة، لكن يلزم نشر Cloudflare Worker ثم وضع عنوانه هنا في app.js قبل إرسال الطلبات.");
    return;
  }
  addBubble("user", content);
  conversation.push({ role: "user", content });
  promptInput.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "جارٍ العمل…";
  const pending = addBubble("assistant", "أختبر المزوّد وأحاول إكمال الطلب…");
  try {
    const response = await fetch(API_BASE + "/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: conversation.slice(-10), provider: providerSelect.value })
    });
    const data = await response.json();
    pending.remove();
    if (!response.ok || !data.ok) throw new Error(data.message || data.error || "تعذر إكمال الطلب");
    conversation.push({ role: "assistant", content: data.content });
    addBubble("assistant", data.content, data.provider + (data.fallback_used ? " · تم التحويل تلقائياً" : ""));
  } catch (error) {
    pending.remove();
    conversation.pop();
    addBubble("assistant", "لم يكتمل الطلب: " + (error.message || "تعذر الاتصال بالخادم") + ". يمكنك المحاولة مجدداً.");
  } finally {
    sendButton.disabled = false;
    sendButton.innerHTML = 'إرسال <span aria-hidden="true">↗</span>';
  }
});

checkHealth();
