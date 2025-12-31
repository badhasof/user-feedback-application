export function getSessionId(): string {
  let sessionId = localStorage.getItem("feedbackSessionId");
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("feedbackSessionId", sessionId);
  }
  
  return sessionId;
}
